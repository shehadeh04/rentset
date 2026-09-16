import { Link } from 'react-router-dom'
import { Logo } from '@/components/Logo'

const painPoints = [
  {
    n: '01',
    title: 'The timeline lives in your head',
    body: 'Move-out dates, contractor callbacks, cleaner availability, listing photos — tracked across texts, sticky notes, and whatever spreadsheet you last updated.',
  },
  {
    n: '02',
    title: 'Every vacant day costs you',
    body: 'A turnover that drifts from 10 days to 25 isn’t a rounding error — it’s real rent you don’t collect, and it’s usually invisible until the unit’s already been sitting empty.',
  },
  {
    n: '03',
    title: 'Nothing is written down until it’s a problem',
    body: 'No record of what the inspection found, what the vendor quoted, or why the unit still isn’t listed — until a tenant, partner, or your own memory needs it.',
  },
]

const features = [
  {
    title: 'Inspections',
    body: 'Walk the unit against a checklist, note condition and damage, and turn findings straight into repair tasks.',
  },
  {
    title: 'Repairs & vendors',
    body: 'Assign work to a vendor, track cost and status, and keep a running list of who you actually trust for what.',
  },
  {
    title: 'Cleaning',
    body: 'Schedule the clean, confirm it’s done, and know the unit is ready before you list it — not after a tenant complains.',
  },
  {
    title: 'Scheduling',
    body: 'Every inspection, repair, and cleaning has a date. See what’s due this week across every unit you manage.',
  },
  {
    title: 'Listing',
    body: 'Draft the listing while the unit is still being turned, so it’s ready to publish the day it’s move-in ready.',
  },
  {
    title: 'Turnover tracking',
    body: 'See exactly what stage every unit is in and how long it’s been there — across one property or twenty.',
  },
]

const steps = [
  {
    n: '01',
    title: 'A tenant gives notice',
    body: 'Add the move-out date and RentSet opens a turnover for that unit.',
  },
  {
    n: '02',
    title: 'Work the checklist',
    body: 'Inspect, line up repairs and cleaning, and assign vendors as you go.',
  },
  {
    n: '03',
    title: 'Track it in real time',
    body: 'Every task has a status and a date. You always know what’s next.',
  },
  {
    n: '04',
    title: 'List it and re-rent',
    body: 'Publish the listing the moment the unit is ready — not days after.',
  },
]

function AppPreview() {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-panel">
      <div className="flex items-center gap-1.5 border-b border-line bg-ink/[0.02] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full border border-ink/15" />
        <span className="h-2.5 w-2.5 rounded-full border border-ink/15" />
        <span className="h-2.5 w-2.5 rounded-full border border-ink/15" />
        <span className="ml-3 text-xs text-ink-faint">app.rentset.com/properties</span>
      </div>
      <div className="flex">
        <div className="hidden w-40 shrink-0 border-r border-line px-4 py-5 sm:block">
          <div className="space-y-3 text-xs font-medium">
            <p className="rounded-md bg-ink px-2 py-1.5 text-white">Properties</p>
            <p className="px-2 py-1.5 text-ink-faint">Schedule</p>
            <p className="px-2 py-1.5 text-ink-faint">Vendors</p>
            <p className="px-2 py-1.5 text-ink-faint">Settings</p>
          </div>
        </div>
        <div className="flex-1 p-5 sm:p-6">
          <p className="tag text-ink-faint">Maple Street Duplex</p>
          <p className="mt-1 text-xs text-ink-faint">142 Maple Street, Erie, PA</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <div>
              <p className="text-sm font-semibold text-ink">Unit A</p>
              <p className="text-xs text-ink-faint">1 bd &middot; 1 ba &middot; $1,200/mo</p>
            </div>
            <span className="tag bg-brand-50 text-brand-700">Turnover &middot; Inspection</span>
          </div>
          <div className="mt-5 flex items-center gap-1.5">
            {['Notice', 'Inspection', 'Repairs', 'Cleaning', 'Listing', 'Leased'].map((s, i) => (
              <div key={s} className="flex flex-1 flex-col gap-1.5">
                <div className={`h-1.5 rounded-full ${i <= 1 ? 'bg-ink' : 'bg-ink/10'}`} />
                <p className="hidden text-[10px] font-medium text-ink-faint md:block">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-medium text-ink-soft md:flex">
            <a href="#product" className="hover:text-ink">
              Product
            </a>
            <a href="#how-it-works" className="hover:text-ink">
              How it works
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost">
              Log in
            </Link>
            <Link to="/signup" className="btn-primary">
              Get started free
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="tag border border-ink/15 text-ink-soft">
              For independent landlords &amp; small property managers
            </span>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink md:text-6xl">
              Turn units around faster.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              Track every vacancy from notice to move-in — inspections, repairs,
              cleaning, vendors, and the listing — all in one place.
            </p>
            <div className="mt-8">
              <Link to="/signup" className="btn-primary px-6 py-3 text-base">
                Get started free
              </Link>
            </div>
          </div>

          <div className="mt-16 md:mt-20">
            <AppPreview />
          </div>
        </section>

        {/* Pain points */}
        <section className="border-y border-ink/10 bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                Most turnovers don’t fail because of one big mistake.
              </h2>
              <p className="mt-3 text-ink-soft">
                They fail a little at a time — a callback that didn’t happen, a
                cleaner who was never confirmed, a listing that went up a week
                late.
              </p>
            </div>
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {painPoints.map((p) => (
                <div key={p.n}>
                  <p className="font-display text-sm font-semibold text-brand-500">{p.n}</p>
                  <h3 className="mt-2 font-semibold text-ink">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            How it works
          </h2>
          <div className="mt-12 grid gap-x-6 gap-y-10 md:grid-cols-4">
            {steps.map((step) => (
              <div key={step.n} className="border-t border-ink/10 pt-4">
                <p className="font-display text-xl font-semibold text-brand-500">{step.n}</p>
                <h3 className="mt-2 font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Feature grid */}
        <section id="product" className="border-y border-ink/10 bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              Everything a turnover touches, in one workspace
            </h2>
            <div className="mt-12 grid divide-y divide-ink/10 border-t border-ink/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-3">
              {features.map((f) => (
                <div key={f.title} className="p-6 first:pl-0 sm:p-8">
                  <h3 className="font-semibold text-ink">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="flex flex-col items-start gap-6 rounded-lg bg-ink p-10 text-white md:flex-row md:items-center md:justify-between md:p-14">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
                Run your next turnover in RentSet.
              </h2>
              <p className="mt-2 max-w-md text-white/70">
                Free to start. Add your first property and see where your units
                actually stand.
              </p>
            </div>
            <Link
              to="/signup"
              className="btn shrink-0 whitespace-nowrap bg-brand-500 px-6 py-3 text-base text-white hover:bg-brand-400"
            >
              Get started free
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink/10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center">
          <Logo />
          <p className="text-sm text-ink-faint">
            &copy; {new Date().getFullYear()} RentSet. Built for landlords who’d rather be renting than chasing.
          </p>
        </div>
      </footer>
    </div>
  )
}
