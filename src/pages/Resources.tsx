import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { SiteNav } from '@/components/marketing/SiteNav'
import { SiteFooter } from '@/components/marketing/SiteFooter'
import { TEMPLATE } from '@/lib/checklist-template'
import { categoryLabels } from '@/lib/task-categories'

function dayLabel(offset: number) {
  if (offset === 0) return 'Move-out day'
  return offset > 0 ? `Day ${offset}` : `Day ${offset}`
}

const phases = [
  {
    heading: 'Before move-out',
    note: 'Day 21 down to day 7 before the tenant leaves. These are the steps most often skipped, and skipping them is what turns a 9-day turnover into a 25-day one.',
    filter: (o: number) => o < 0,
  },
  {
    heading: 'After move-out',
    note: 'Day 1 onward, once you have the keys. Safety-critical work comes first, the listing goes up before the unit is perfect.',
    filter: (o: number) => o > 0,
  },
]

const faqs = [
  {
    q: 'What does RentSet actually do?',
    a: 'It tracks a rental turnover from the day notice is given to the day the next tenant moves in. You add properties and units, open a turnover, and RentSet lays out a dated checklist against the move-out date. Each task carries a status, a due date, an optional vendor, and an optional cost.',
  },
  {
    q: 'Does it replace my accounting or leasing software?',
    a: 'No. It does not collect rent, run screening, or handle leases. It covers the gap between one tenant leaving and the next one moving in, which is the part that usually lives in texts and spreadsheets.',
  },
  {
    q: 'Where do the checklist and the 9-day target come from?',
    a: 'The default checklist is the 14-step version of a longer turnover process flow, with pre-vacancy prep running day 21 to day 7 before move-out and the active turnover running day 1 to day 8. Both the dates and the tasks are editable starting estimates, not fixed rules.',
  },
  {
    q: 'Can I change the checklist?',
    a: 'Yes. Every task can be renamed, re-dated, reassigned, or deleted, and you can add your own. The template is a starting point per turnover, not a constraint.',
  },
  {
    q: 'How many properties can I track?',
    a: 'There is no limit built into the product. It is designed for the scale an independent landlord or small manager actually works at, from one unit to a few dozen.',
  },
  {
    q: 'What does it cost?',
    a: 'It is free to start and does not ask for a card to create an account.',
  },
]

export default function Resources() {
  return (
    <div className="min-h-[100dvh] bg-canvas">
      <SiteNav />

      <main>
        <section className="mx-auto max-w-[1400px] px-6 pt-14 lg:px-10 lg:pt-20">
          <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
            <h1 className="max-w-2xl text-display-sm font-medium text-ink md:text-display-md">
              The turnover checklist, start to finish
            </h1>
            <p className="max-w-sm text-[15px] leading-relaxed text-ink-soft lg:pt-2">
              This is the exact checklist RentSet creates for every new turnover, dated against the move-out date. You
              can use it as-is, or edit it per unit.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-8">
            {phases.map((phase) => {
              const items = TEMPLATE.filter((t) => phase.filter(t.dayOffset))
              return (
                <div key={phase.heading} className="panel p-6 sm:p-8">
                  <h2 className="text-xl font-medium text-ink">{phase.heading}</h2>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">{phase.note}</p>
                  <ol className="mt-7 space-y-0">
                    {items.map((t, i) => (
                      <li
                        key={t.title}
                        className={`flex gap-4 py-4 ${i < items.length - 1 ? 'border-b border-line' : ''}`}
                      >
                        <span className="w-16 shrink-0 text-xs tabular-nums text-ink-faint">{dayLabel(t.dayOffset)}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm text-ink">{t.title}</span>
                          <span className="mt-1 block text-xs text-ink-faint">{categoryLabels[t.category]}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              )
            })}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-line pt-8">
            <p className="text-sm text-ink-soft">
              RentSet creates all {TEMPLATE.length} of these automatically when you open a turnover.
            </p>
            <Link to="/signup" className="btn-primary">
              Get started free
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </section>

        <section id="faq" className="border-t border-line bg-surface">
          <div className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28">
            <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
              <h2 className="max-w-2xl text-display-sm font-medium text-ink md:text-display-md">Common questions</h2>
              <p className="max-w-sm text-[15px] leading-relaxed text-ink-soft lg:pt-2">
                What the product covers, what it deliberately does not, and where the defaults come from.
              </p>
            </div>

            <dl className="mt-12 grid gap-px border-t border-line bg-line md:grid-cols-2">
              {faqs.map((f) => (
                <div key={f.q} className="bg-surface p-7">
                  <dt className="text-[15px] font-medium text-ink">{f.q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink-soft">{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
