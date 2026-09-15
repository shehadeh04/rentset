import { Link } from 'react-router-dom'
import { Logo } from '@/components/Logo'

const stages = [
  { label: 'Notice', hint: 'Tenant gives notice' },
  { label: 'Inspection', hint: 'Walk the unit' },
  { label: 'Repairs', hint: 'Fix what’s needed' },
  { label: 'Cleaning', hint: 'Make it move-in ready' },
  { label: 'Listing', hint: 'Get it in front of renters' },
  { label: 'Leased', hint: 'New tenant signed' },
]

const painPoints = [
  {
    title: 'The timeline lives in your head',
    body: 'Move-out dates, contractor callbacks, cleaner availability, listing photos — tracked across texts, sticky notes, and whatever spreadsheet you last updated.',
  },
  {
    title: 'Every vacant day costs you',
    body: 'A turnover that drifts from 10 days to 25 isn’t a rounding error — it’s real rent you don’t collect, and it’s usually invisible until the unit’s already been sitting empty.',
  },
  {
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

export default function Landing() {
  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm text-ink-soft md:flex">
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
        <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">
          <div className="grid gap-14 md:grid-cols-2 md:items-center md:gap-8">
            <div>
              <span className="inline-flex items-center rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-ink-soft">
                For independent landlords & small property managers
              </span>
              <h1 className="mt-5 font-display text-4xl font-medium leading-[1.1] text-ink md:text-5xl">
                Turn units around faster, without losing track of anything.
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-soft">
                RentSet is where you run every vacancy from notice to move-in —
                inspections, repairs, cleaning, vendors, and the listing — so you
                always know exactly where each unit stands and how long it’s
                taking.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link to="/signup" className="btn-primary px-6 py-3 text-base">
                  Get started free
                </Link>
                <Link to="/login" className="btn-secondary px-6 py-3 text-base">
                  Log in
                </Link>
              </div>
              <p className="mt-4 text-sm text-ink-faint">
                No credit card required. Set up your first property in a couple
                of minutes.
              </p>
            </div>

            <div className="card p-6 md:p-7">
              <p className="mb-5 text-sm font-medium text-ink-soft">
                A turnover, start to finish
              </p>
              <ol className="space-y-0">
                {stages.map((stage, i) => (
                  <li key={stage.label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                          i === 0
                            ? 'bg-brand-700 text-white'
                            : 'border border-line bg-white text-ink-faint'
                        }`}
                      >
                        {i + 1}
                      </div>
                      {i < stages.length - 1 && (
                        <div className="h-full w-px flex-1 bg-line" style={{ minHeight: '1.5rem' }} />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className="text-sm font-medium text-ink">{stage.label}</p>
                      <p className="text-sm text-ink-faint">{stage.hint}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Pain points */}
        <section className="border-y border-line bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <h2 className="max-w-xl font-display text-2xl font-medium text-ink md:text-3xl">
              Most turnovers don’t fail because of one big mistake.
            </h2>
            <p className="mt-3 max-w-xl text-ink-soft">
              They fail a little at a time — a callback that didn’t happen, a
              cleaner who was never confirmed, a listing that went up a week
              late.
            </p>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {painPoints.map((p) => (
                <div key={p.title}>
                  <h3 className="font-medium text-ink">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <h2 className="font-display text-2xl font-medium text-ink md:text-3xl">
            How it works
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-4 md:gap-6">
            {[
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
            ].map((step) => (
              <div key={step.n}>
                <p className="font-display text-2xl text-brand-600">{step.n}</p>
                <h3 className="mt-2 font-medium text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Feature grid */}
        <section id="product" className="border-y border-line bg-white">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <h2 className="font-display text-2xl font-medium text-ink md:text-3xl">
              Everything a turnover touches, in one workspace
            </h2>
            <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div key={f.title}>
                  <h3 className="font-medium text-ink">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="card flex flex-col items-start gap-6 bg-brand-900 p-10 text-brand-50 md:flex-row md:items-center md:justify-between md:p-14">
            <div>
              <h2 className="font-display text-2xl font-medium md:text-3xl">
                Run your next turnover in RentSet.
              </h2>
              <p className="mt-2 max-w-md text-brand-100/90">
                Free to start. Add your first property and see where your
                units actually stand.
              </p>
            </div>
            <Link
              to="/signup"
              className="btn bg-white px-6 py-3 text-base text-brand-900 hover:bg-brand-50"
            >
              Get started free
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
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
