import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { SiteNav } from '@/components/marketing/SiteNav'
import { SiteFooter } from '@/components/marketing/SiteFooter'
import { marketingImages } from '@/lib/images'

const principles = [
  {
    heading: 'One job, done properly',
    body: 'RentSet covers the gap between one tenant leaving and the next moving in. It does not collect rent, screen applicants, or store leases. Narrow scope is the point: the turnover is the part that usually has no system at all.',
  },
  {
    heading: 'Dates, not reminders',
    body: 'Every task is anchored to the move-out date, so the schedule builds itself. You see what is late and what is next without maintaining a separate calendar.',
  },
  {
    heading: 'Defaults you can argue with',
    body: 'Each turnover starts from a standard checklist and a target ready date. Both are editable estimates. The product has an opinion, it just does not enforce it.',
  },
  {
    heading: 'A record after the fact',
    body: 'When a turnover closes, you keep what it cost and how long it took. That is what makes the next estimate better than a guess.',
  },
]

export default function About() {
  return (
    <div className="min-h-[100dvh] bg-canvas">
      <SiteNav />

      <main>
        <section className="mx-auto max-w-[1400px] px-6 pt-14 lg:px-10 lg:pt-20">
          <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
            <h1 className="max-w-2xl text-display-sm font-medium text-ink md:text-display-md">
              Built for the days a unit sits empty
            </h1>
            <p className="max-w-sm text-[15px] leading-relaxed text-ink-soft lg:pt-2">
              A vacancy is the most expensive week in a rental, and it is the week with the least structure around it.
              RentSet exists to give that week a system.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-xl lg:mt-16">
            <img
              src={marketingImages.rooftops.src}
              alt={marketingImages.rooftops.alt}
              className="h-[34vh] w-full object-cover sm:h-[44vh]"
            />
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
            <h2 className="max-w-2xl text-display-sm font-medium text-ink md:text-[2.75rem] md:leading-[1.05]">
              Who it is for
            </h2>
            <p className="max-w-sm text-[15px] leading-relaxed text-ink-soft lg:pt-2">
              Independent landlords and small property managers, the people who handle turnovers themselves rather than
              handing them to a department.
            </p>
          </div>

          <div className="mt-12 grid gap-px border-t border-line bg-line sm:grid-cols-2">
            {principles.map((p) => (
              <div key={p.heading} className="bg-canvas p-7 sm:p-9">
                <h3 className="text-[15px] font-medium text-ink">{p.heading}</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10 lg:py-16">
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={marketingImages.townscape.src}
                alt={marketingImages.townscape.alt}
                className="h-[20rem] w-full object-cover sm:h-[24rem]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/10" />
              <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12">
                <h2 className="max-w-lg text-display-sm font-medium text-white md:text-[3rem] md:leading-[1.02]">
                  Start with one property
                </h2>
                <p className="mt-3 max-w-md text-sm text-white/80">
                  Add a unit, open a turnover, and see the whole schedule laid out against the move-out date.
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
