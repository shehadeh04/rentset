import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  Bathtub,
  Buildings,
  Bed,
  CalendarBlank,
  CheckCircle,
  Circle,
  CircleHalf,
  ClipboardText,
  Ruler,
  Wrench,
} from '@phosphor-icons/react'
import { SiteNav } from '@/components/marketing/SiteNav'
import { SiteFooter } from '@/components/marketing/SiteFooter'
import { marketingImages } from '@/lib/images'
import { TEMPLATE } from '@/lib/checklist-template'
import { categoryLabels } from '@/lib/task-categories'

const stages = [
  { name: 'Notice', body: 'Add the move-out date and RentSet opens a turnover with the standard checklist already dated against it.' },
  { name: 'Inspection', body: 'Walk the unit room by room, log condition and damage, and push findings straight into repair tasks.' },
  { name: 'Repairs', body: 'Assign each job to a vendor, track cost and status, and see what is still blocking the unit.' },
  { name: 'Cleaning', body: 'Book the clean, confirm it happened, and know the unit is presentable before anyone sees it.' },
  { name: 'Listing', body: 'Draft the listing while work is still in progress so it publishes the day the unit is ready.' },
  { name: 'Leased', body: 'Close the turnover, record how long it actually took, and carry that into the next one.' },
]

const units = [
  { name: 'Maple Street Duplex', unit: 'Unit A', location: 'Erie, PA', rent: '$1,200', beds: 1, baths: 1, sqft: 720, status: 'Repairs', badge: 'badge-caution', image: marketingImages.unitA },
  { name: 'Cedar Court', unit: 'Unit 2', location: 'Erie, PA', rent: '$1,450', beds: 2, baths: 1, sqft: 940, status: 'Cleaning', badge: 'badge-caution', image: marketingImages.unitB },
  { name: 'Lakeview Apartments', unit: 'Unit 3B', location: 'Erie, PA', rent: '$1,050', beds: 1, baths: 1, sqft: 610, status: 'Leased', badge: 'badge-positive', image: marketingImages.unitC },
]

const facts = [
  { value: String(TEMPLATE.length), label: 'Checklist steps set up per turnover' },
  { value: '6', label: 'Stages from notice to leased' },
  { value: Object.keys(categoryLabels).length + '', label: 'Task categories tracked' },
  { value: 'Day 21', label: 'Prep starts before move-out' },
]

const capabilities = [
  {
    title: 'Properties & units',
    body: 'Every property with its units, rent, and current status in one table.',
    count: 'Unlimited units',
    to: '/#product',
    icon: Buildings,
  },
  {
    title: 'Turnovers',
    body: 'A dated checklist per unit, from notice through to leased.',
    count: '6 stages',
    to: '/#how-it-works',
    icon: ClipboardText,
  },
  {
    title: 'Schedule',
    body: 'Every due date across every property, grouped by what is late.',
    count: 'Overdue first',
    to: '/#product',
    icon: CalendarBlank,
  },
  {
    title: 'Vendors',
    body: 'The people you call for repairs and cleaning, attached to the work.',
    count: 'Per task',
    to: '/#product',
    icon: Wrench,
  },
]

const reasons = [
  {
    title: 'Dates, not reminders',
    body: 'Tasks are anchored to the move-out date, so the schedule builds itself. Nothing to maintain on the side.',
  },
  {
    title: 'One job, done properly',
    body: 'No rent collection, no screening, no leases. Just the week between one tenant leaving and the next arriving.',
  },
  {
    title: 'A record afterwards',
    body: 'Closed turnovers keep their cost and duration, so the next estimate is based on your own history.',
  },
]

const metrics = [
  { label: 'Average days vacant', value: '9', bars: [14, 12, 15, 11, 9, 13, 8, 9, 7], caption: 'Tracked per turnover, from move-out to leased.' },
  { label: 'Cost per turnover', value: '$1,240', bars: [8, 11, 9, 13, 10, 14, 11, 9, 12], caption: 'Repairs, cleaning, and vendor invoices in one total.' },
  { label: 'Tasks closed on time', value: '86%', bars: [6, 8, 9, 11, 10, 12, 13, 12, 14], caption: 'Against the due date set when the task was created.' },
]

function BarChart({ bars }: { bars: number[] }) {
  const max = Math.max(...bars)
  return (
    <div className="flex h-20 items-end gap-1.5" aria-hidden="true">
      {bars.map((b, i) => (
        <div key={i} className="flex flex-1 flex-col" style={{ height: `${Math.max((b / max) * 100, 12)}%` }}>
          <div className="h-[3px] w-full bg-ink" />
          <div className="w-full flex-1 bg-sunken" />
        </div>
      ))}
    </div>
  )
}

function PropertiesPanel() {
  return (
    <div>
      <div className="grid grid-cols-[1.6fr_1fr_1fr_auto] items-center gap-4 border-b border-line px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
        <p>Unit</p>
        <p className="hidden sm:block">Rent</p>
        <p>Status</p>
        <p />
      </div>
      {[
        { u: 'Unit A', p: 'Maple Street Duplex', r: '$1,200/mo', s: 'Repairs', b: 'badge-caution', d: '6d' },
        { u: 'Unit B', p: 'Maple Street Duplex', r: '$1,150/mo', s: 'Occupied', b: 'badge-neutral', d: null },
        { u: 'Unit 2', p: 'Cedar Court', r: '$1,450/mo', s: 'Cleaning', b: 'badge-caution', d: '11d' },
        { u: 'Unit 3B', p: 'Lakeview Apartments', r: '$1,050/mo', s: 'Leased', b: 'badge-positive', d: null },
      ].map((row) => (
        <div key={row.u + row.p} className="grid grid-cols-[1.6fr_1fr_1fr_auto] items-center gap-4 border-b border-line px-5 py-3 last:border-b-0">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{row.u}</p>
            <p className="truncate text-xs text-ink-faint">{row.p}</p>
          </div>
          <p className="hidden text-sm tabular-nums text-ink-soft sm:block">{row.r}</p>
          <div className="flex items-center gap-2">
            <span className={row.b}>{row.s}</span>
            {row.d && <span className="hidden text-xs text-ink-faint lg:inline">{row.d}</span>}
          </div>
          <span className="text-xs font-medium text-ink-soft">View</span>
        </div>
      ))}
    </div>
  )
}

function SchedulePanel() {
  return (
    <div>
      <p className="border-b border-line px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-critical-600">Overdue</p>
      {[
        { t: 'Complete safety-critical repairs', m: 'Maple Street Duplex · Unit A', d: 'Mar 4' },
        { t: 'Confirm cleaner for Friday', m: 'Cedar Court · Unit 2', d: 'Mar 5' },
      ].map((r) => (
        <div key={r.t} className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{r.t}</p>
            <p className="truncate text-xs text-ink-faint">{r.m}</p>
          </div>
          <p className="shrink-0 text-sm tabular-nums text-critical-600">{r.d}</p>
        </div>
      ))}
      <p className="border-b border-line px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-ink-faint">This week</p>
      {[
        { t: 'Deep clean the unit', m: 'Maple Street Duplex · Unit A', d: 'Mar 9' },
        { t: 'Publish the listing', m: 'Cedar Court · Unit 2', d: 'Mar 11' },
      ].map((r) => (
        <div key={r.t} className="flex items-center justify-between gap-4 border-b border-line px-5 py-3 last:border-b-0">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{r.t}</p>
            <p className="truncate text-xs text-ink-faint">{r.m}</p>
          </div>
          <p className="shrink-0 text-sm tabular-nums text-ink-soft">{r.d}</p>
        </div>
      ))}
    </div>
  )
}

function TurnoverPanel() {
  const tasks = [
    { t: 'Full walk-through inspection', s: 'done' as const },
    { t: 'Change locks & install lockbox', s: 'done' as const },
    { t: 'Complete safety-critical repairs', s: 'active' as const },
    { t: 'Deep clean the unit', s: 'open' as const },
    { t: 'Publish the listing', s: 'open' as const },
  ]
  return (
    <div className="flex flex-col gap-6 p-5 sm:flex-row">
      <div className="shrink-0 sm:w-36">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-ink-faint">Stage</p>
        {stages.map((s, i) => (
          <div key={s.name} className="relative flex items-start gap-2.5 pb-4 last:pb-0">
            {i < stages.length - 1 && <span className="absolute left-[8px] top-4 h-full w-px bg-line" />}
            <span
              className={`relative z-10 flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full text-[9px] font-semibold ${
                i < 2 ? 'bg-ink text-white' : i === 2 ? 'border-2 border-ink bg-surface text-ink' : 'border border-line-strong bg-surface text-ink-faint'
              }`}
            >
              {i < 2 ? <CheckCircle size={10} weight="fill" /> : i + 1}
            </span>
            <span className={`text-[13px] ${i === 2 ? 'font-medium text-ink' : 'text-ink-faint'}`}>{s.name}</span>
          </div>
        ))}
      </div>
      <div className="min-w-0 flex-1 border-t border-line pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-ink-faint">Tasks</p>
        <ul className="space-y-2.5">
          {tasks.map((task) => (
            <li key={task.t} className="flex items-center gap-2.5 text-sm">
              {task.s === 'done' && <CheckCircle size={16} weight="fill" className="shrink-0 text-positive-600" />}
              {task.s === 'active' && <CircleHalf size={16} weight="fill" className="shrink-0 text-caution-600" />}
              {task.s === 'open' && <Circle size={16} weight="regular" className="shrink-0 text-ink-subtle" />}
              <span className={task.s === 'done' ? 'text-ink-faint line-through' : 'text-ink'}>{task.t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const tabs = [
  { id: 'properties', label: 'Properties', panel: PropertiesPanel },
  { id: 'schedule', label: 'Schedule', panel: SchedulePanel },
  { id: 'turnover', label: 'Turnover detail', panel: TurnoverPanel },
]

export default function Landing() {
  const [activeTab, setActiveTab] = useState('properties')
  const [activeStage, setActiveStage] = useState(2)
  const [searchParams] = useSearchParams()
  const ActivePanel = tabs.find((t) => t.id === activeTab)!.panel

  const stageParam = searchParams.get('stage')
  useEffect(() => {
    if (stageParam === null) return
    const i = Number(stageParam)
    if (Number.isInteger(i) && i >= 0 && i < stages.length) setActiveStage(i)
  }, [stageParam])

  return (
    <div className="min-h-[100dvh] bg-canvas">
      <SiteNav />

      <main>
        <section className="mx-auto max-w-[1400px] px-6 pt-14 lg:px-10 lg:pt-20">
          <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-start lg:gap-16">
            <h1 className="max-w-3xl text-display-sm font-medium text-ink md:text-display-md lg:text-display-lg">
              Turn vacant units around in days, not weeks
            </h1>
            <p className="max-w-sm text-[15px] leading-relaxed text-ink-soft lg:pt-3">
              RentSet tracks every inspection, repair, clean, and listing from notice to move-in, so a unit is never
              quietly waiting on you.
            </p>
          </div>

          <div className="mt-10">
            <Link to="/signup" className="btn-primary px-6 py-3 text-[15px]">
              Get started free
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>

          <div className="mt-12 overflow-hidden rounded-xl lg:mt-16">
            <img
              src={marketingImages.hero.src}
              alt={marketingImages.hero.alt}
              className="h-[42vh] w-full object-cover sm:h-[52vh] lg:h-[62vh]"
            />
          </div>
        </section>

        <section className="border-y border-line bg-surface">
          <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-px bg-line px-0 lg:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="bg-surface px-6 py-8 lg:px-10">
                <p className="text-3xl font-medium tabular-nums tracking-tight text-ink">{f.value}</p>
                <p className="mt-1.5 text-[13px] leading-snug text-ink-soft">{f.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">What RentSet is</p>
              <h2 className="mt-4 max-w-2xl text-display-sm font-medium text-ink md:text-[2.75rem] md:leading-[1.05]">
                A system for the week a unit sits empty
              </h2>
            </div>
            <div className="lg:pt-12">
              <p className="max-w-md text-[15px] leading-relaxed text-ink-soft">
                A vacancy is the most expensive week in a rental and usually the one with the least structure around
                it. RentSet gives that week a checklist, a schedule, and a record, without adding software you have to
                babysit.
              </p>
              <Link
                to="/about"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors hover:text-ink-soft"
              >
                More about RentSet
                <ArrowRight size={15} weight="bold" />
              </Link>
            </div>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((c) => (
              <Link
                key={c.title}
                to={c.to}
                className="group flex flex-col rounded-lg border border-line bg-surface p-6 transition-colors hover:border-ink-subtle"
              >
                <c.icon size={20} weight="regular" className="text-ink" />
                <h3 className="mt-4 text-[15px] font-medium text-ink">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{c.body}</p>
                <span className="mt-5 flex items-center justify-between border-t border-line pt-3.5 text-xs text-ink-faint">
                  {c.count}
                  <ArrowRight size={14} weight="bold" className="text-ink transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section id="product" className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
            <h2 className="max-w-2xl text-display-sm font-medium text-ink md:text-display-md">
              The whole turnover, on one screen
            </h2>
            <p className="max-w-sm text-[15px] leading-relaxed text-ink-soft lg:pt-2">
              Properties, due dates, and the unit you are working on right now. No spreadsheet, no scrolling back
              through texts to remember what the plumber said.
            </p>
          </div>

          <div className="mt-10">
            <div className="flex flex-wrap gap-2">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={activeTab === t.id ? 'chip-active' : 'chip'}
                  aria-pressed={activeTab === t.id}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="panel mt-4 overflow-hidden shadow-card">
              <ActivePanel />
            </div>
          </div>
        </section>

        <section className="border-t border-line bg-surface">
          <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="max-w-xl text-display-sm font-medium text-ink md:text-display-md">
                Every unit you manage, in one place
              </h2>
              <p className="max-w-xs text-sm leading-relaxed text-ink-soft">
                A preview of how a small portfolio looks once it is set up. Status comes from the stage each turnover is
                actually in.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {units.map((u) => (
                <article key={u.name + u.unit} className="group overflow-hidden rounded-lg border border-line bg-surface">
                  <div className="overflow-hidden">
                    <img
                      src={u.image.src}
                      alt={u.image.alt}
                      className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-[15px] font-medium text-ink">
                          {u.name} &middot; {u.unit}
                        </h3>
                        <p className="mt-0.5 text-xs text-ink-faint">{u.location}</p>
                      </div>
                      <p className="shrink-0 text-[15px] font-medium tabular-nums text-ink">{u.rent}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-line pt-3.5">
                      <div className="flex items-center gap-3.5 text-xs text-ink-soft">
                        <span className="flex items-center gap-1.5">
                          <Bed size={14} weight="regular" /> {u.beds}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Bathtub size={14} weight="regular" /> {u.baths}
                        </span>
                        <span className="flex items-center gap-1.5 tabular-nums">
                          <Ruler size={14} weight="regular" /> {u.sqft} ft&sup2;
                        </span>
                      </div>
                      <span className={u.badge}>{u.status}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-t border-line">
          <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
              <div className="flex flex-col">
                <h2 className="text-display-sm font-medium text-ink md:text-[2.75rem] md:leading-[1.05]">
                  {stages[activeStage].name}
                </h2>
                <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink-soft">{stages[activeStage].body}</p>
                <Link to="/signup" className="btn-secondary mt-7 w-fit">
                  Get started free
                </Link>

                <div className="mt-10 border-t border-line pt-5 lg:mt-auto">
                  <ul className="space-y-2.5">
                    {stages.map((s, i) => (
                      <li key={s.name}>
                        <button
                          onClick={() => setActiveStage(i)}
                          className={`flex w-full items-center gap-3 text-left text-sm transition-colors ${
                            i === activeStage ? 'font-medium text-ink' : 'text-ink-faint hover:text-ink-soft'
                          }`}
                        >
                          <span className="tabular-nums text-xs text-ink-subtle">{String(i + 1).padStart(2, '0')}</span>
                          {s.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="relative">
                <img
                  src={marketingImages.unitInterior.src}
                  alt={marketingImages.unitInterior.alt}
                  className="h-full min-h-[22rem] w-full rounded-lg object-cover"
                />
                <div className="absolute bottom-4 right-4 w-[15rem] rounded-lg border border-line bg-surface p-4 shadow-lifted sm:bottom-6 sm:right-6 sm:w-[17rem]">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">Day 6 of 9</p>
                  <div className="mt-2.5 flex items-center gap-1">
                    {stages.map((s, i) => (
                      <div key={s.name} className={`h-1 flex-1 rounded-full ${i <= activeStage ? 'bg-ink' : 'bg-line'}`} />
                    ))}
                  </div>
                  <p className="mt-3 text-sm font-medium text-ink">Maple Street Duplex &middot; Unit A</p>
                  <p className="text-xs text-ink-faint">8 of 14 tasks closed</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="numbers" className="border-t border-line bg-surface">
          <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28">
            <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
              <h2 className="max-w-2xl text-display-sm font-medium text-ink md:text-display-md">
                Know what a turnover actually costs you
              </h2>
              <p className="max-w-sm text-[15px] leading-relaxed text-ink-soft lg:pt-2">
                Every task carries a date and a cost, so the vacancy stops being a feeling and starts being a number you
                can work on.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {metrics.map((m) => (
                <div key={m.label} className="rounded-lg border border-line p-6">
                  <p className="text-[13px] text-ink-soft">{m.label}</p>
                  <p className="mt-2 text-4xl font-medium tabular-nums tracking-tight text-ink">{m.value}</p>
                  <div className="mt-5">
                    <BarChart bars={m.bars} />
                  </div>
                  <p className="mt-4 border-t border-line pt-3.5 text-xs leading-relaxed text-ink-faint">{m.caption}</p>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs text-ink-faint">Figures shown are an example portfolio, not aggregate customer data.</p>
          </div>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28">
            <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
              <h2 className="max-w-2xl text-display-sm font-medium text-ink md:text-display-md">Why RentSet</h2>
              <p className="max-w-sm text-[15px] leading-relaxed text-ink-soft lg:pt-2">
                Three decisions that shape the whole product, and the reasons behind them.
              </p>
            </div>
            <div className="mt-12 grid gap-px border-t border-line bg-line lg:grid-cols-3">
              {reasons.map((r, i) => (
                <div key={r.title} className="bg-canvas p-7 sm:p-9">
                  <p className="text-xs tabular-nums text-ink-faint">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="mt-3 text-[15px] font-medium text-ink">{r.title}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">{r.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10 lg:py-16">
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={marketingImages.rooftops.src}
                alt={marketingImages.rooftops.alt}
                className="h-[22rem] w-full object-cover sm:h-[26rem]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/10" />
              <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12">
                <h2 className="max-w-lg text-display-sm font-medium text-white md:text-[3rem] md:leading-[1.02]">
                  Run your next turnover in RentSet
                </h2>
                <p className="mt-3 max-w-md text-sm text-white/80">
                  Free to start. Add a property, open a turnover, and see where the unit actually stands.
                </p>
                <Link to="/signup" className="btn mt-7 bg-white px-6 py-3 text-[15px] text-ink hover:bg-white/90">
                  Get started free
                  <ArrowRight size={16} weight="bold" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
