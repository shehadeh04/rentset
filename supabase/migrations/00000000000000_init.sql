-- RentSet initial schema
-- Landlord-scoped rental turnover management: properties, units, turnovers,
-- turnover tasks (inspections/repairs/cleaning/vendor visits), vendors, listings.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles: one row per landlord, mirrors auth.users
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  company_name text not null default '',
  phone text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- properties
-- ---------------------------------------------------------------------------
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  address_line1 text not null,
  address_line2 text not null default '',
  city text not null,
  state text not null,
  postal_code text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index properties_landlord_id_idx on public.properties (landlord_id);

-- ---------------------------------------------------------------------------
-- units
-- ---------------------------------------------------------------------------
create type public.unit_status as enum ('occupied', 'vacant', 'turnover');

create table public.units (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  landlord_id uuid not null references public.profiles (id) on delete cascade,
  unit_label text not null,
  bedrooms numeric(3,1) not null default 0,
  bathrooms numeric(3,1) not null default 0,
  square_feet integer,
  monthly_rent numeric(10,2),
  status public.unit_status not null default 'occupied',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index units_property_id_idx on public.units (property_id);
create index units_landlord_id_idx on public.units (landlord_id);

-- ---------------------------------------------------------------------------
-- turnovers: one active (or historical) turnover cycle per unit
-- ---------------------------------------------------------------------------
create type public.turnover_stage as enum (
  'notice',
  'inspection',
  'repairs',
  'cleaning',
  'listing',
  'leased'
);

create table public.turnovers (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.units (id) on delete cascade,
  landlord_id uuid not null references public.profiles (id) on delete cascade,
  stage public.turnover_stage not null default 'notice',
  notice_date date not null,
  move_out_date date,
  target_ready_date date,
  leased_date date,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create index turnovers_unit_id_idx on public.turnovers (unit_id);
create index turnovers_landlord_id_idx on public.turnovers (landlord_id);
create index turnovers_stage_idx on public.turnovers (stage);

-- Only one open (non-leased) turnover per unit at a time.
create unique index turnovers_one_open_per_unit
  on public.turnovers (unit_id)
  where stage <> 'leased';

-- ---------------------------------------------------------------------------
-- vendors
-- ---------------------------------------------------------------------------
create table public.vendors (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  trade text not null default '',
  phone text not null default '',
  email text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now()
);

create index vendors_landlord_id_idx on public.vendors (landlord_id);

-- ---------------------------------------------------------------------------
-- turnover_tasks: inspections, repairs, cleaning, vendor visits, scheduling
-- ---------------------------------------------------------------------------
create type public.task_category as enum (
  'inspection',
  'repair',
  'cleaning',
  'vendor',
  'listing'
);

create type public.task_status as enum ('open', 'in_progress', 'done');

create table public.turnover_tasks (
  id uuid primary key default gen_random_uuid(),
  turnover_id uuid not null references public.turnovers (id) on delete cascade,
  landlord_id uuid not null references public.profiles (id) on delete cascade,
  category public.task_category not null,
  title text not null,
  notes text not null default '',
  status public.task_status not null default 'open',
  vendor_id uuid references public.vendors (id) on delete set null,
  scheduled_date date,
  due_date date,
  cost numeric(10,2),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index turnover_tasks_turnover_id_idx on public.turnover_tasks (turnover_id);
create index turnover_tasks_landlord_id_idx on public.turnover_tasks (landlord_id);

-- ---------------------------------------------------------------------------
-- listings: marketing the unit once it's ready
-- ---------------------------------------------------------------------------
create type public.listing_status as enum ('draft', 'published', 'leased');

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  turnover_id uuid not null references public.turnovers (id) on delete cascade,
  landlord_id uuid not null references public.profiles (id) on delete cascade,
  headline text not null default '',
  description text not null default '',
  asking_rent numeric(10,2),
  status public.listing_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index listings_turnover_id_idx on public.listings (turnover_id);

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.properties
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.units
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.turnovers
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.turnover_tasks
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.listings
  for each row execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security: every table is scoped to the owning landlord
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.units enable row level security;
alter table public.turnovers enable row level security;
alter table public.vendors enable row level security;
alter table public.turnover_tasks enable row level security;
alter table public.listings enable row level security;

create policy "profiles are self-readable" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles are self-updatable" on public.profiles
  for update using (auth.uid() = id);

create policy "landlords manage their own properties" on public.properties
  for all using (auth.uid() = landlord_id) with check (auth.uid() = landlord_id);

create policy "landlords manage their own units" on public.units
  for all using (auth.uid() = landlord_id) with check (auth.uid() = landlord_id);

create policy "landlords manage their own turnovers" on public.turnovers
  for all using (auth.uid() = landlord_id) with check (auth.uid() = landlord_id);

create policy "landlords manage their own vendors" on public.vendors
  for all using (auth.uid() = landlord_id) with check (auth.uid() = landlord_id);

create policy "landlords manage their own turnover tasks" on public.turnover_tasks
  for all using (auth.uid() = landlord_id) with check (auth.uid() = landlord_id);

create policy "landlords manage their own listings" on public.listings
  for all using (auth.uid() = landlord_id) with check (auth.uid() = landlord_id);
