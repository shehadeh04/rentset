# RentSet

RentSet is a turnover management platform for landlords and property managers.
It tracks a rental unit from the moment a tenant gives notice through
inspection, repairs, cleaning, vendor coordination, scheduling, and listing —
until the unit is rented again.

Built as a Senior Design capstone at Gannon University.

## Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query
- **Backend:** [Supabase](https://supabase.com) — Postgres, Auth, Row Level Security, Storage
- **Hosting:** GitHub Pages, deployed via GitHub Actions on every push to `main`

## Local development

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project URL + anon key
npm run dev
```

## Database

The schema lives in [`supabase/migrations`](supabase/migrations). Every table
is scoped with Row Level Security so a landlord can only ever read or write
their own properties, units, turnovers, and tasks.

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the app and publishes it to GitHub Pages.
