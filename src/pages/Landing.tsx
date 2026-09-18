import { Link } from 'react-router-dom'
import { ArrowUpRight } from '@phosphor-icons/react'
import { SiteNav } from '@/components/marketing/SiteNav'
import { SiteFooter } from '@/components/marketing/SiteFooter'
import { marketingImages } from '@/lib/images'

const stages = [
  { n: '01', label: 'Notice', body: 'The tenant gives notice. Prep starts three weeks before they leave.' },
  { n: '02', label: 'Inspection', body: 'Walk the unit once and record what actually needs doing.' },
  { n: '03', label: 'Repairs', body: 'Safety-critical work first, then everything cosmetic.' },
  { n: '04', label: 'Cleaning', body: 'Deep clean so the unit shows the way it should.' },
  { n: '05', label: 'Listing', body: 'Published before the work is finished, not after.' },
  { n: '06', label: 'Leased', body: 'Signed, with the cost and duration kept on record.' },
]

const capabilities = [
  { label: 'Properties & units', body: 'Every property and unit with its rent, layout and current status.' },
  { label: 'Turnovers', body: 'A dated checklist per unit, from notice through to leased.' },
  { label: 'Schedule', body: 'Every due date across every property, grouped by what is late.' },
  { label: 'Vendors', body: 'The people you call for repairs and cleaning, attached to the work.' },
]

const numbers = [
  { value: '9', label: 'Average days vacant', body: 'Tracked per turnover, from move-out to leased.' },
  { value: '$1,240', label: 'Cost per turnover', body: 'Repairs, cleaning and vendor invoices in one total.' },
  { value: '86%', label: 'Tasks closed on time', body: 'Against the due date set when the task was created.' },
]

export default function Landing() {
  return (
    <div className="bg-paper">
      <SiteNav />

      {/* ---------------------------------------------------------------- */}
      {/* Hero: the photograph is the page. Type sits on it.                */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden">
        <img src={marketingImages.hero.src} alt={marketingImages.hero.alt} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-ink/30" aria-hidden="true" />

        <div className="relative flex h-full flex-col justify-end p-5 pb-10 sm:p-10 sm:pb-14">
          <h1 className="display-1 max-w-[16ch] animate-rise text-white">Turn vacant units around in days, not weeks</h1>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6 border-t border-white/25 pt-6">
            <p className="lede max-w-[46ch] animate-rise text-white/80" style={{ animationDelay: '90ms' }}>
              RentSet tracks every inspection, repair, clean and listing from notice to move-in, so a unit is never
              quietly waiting on you.
            </p>
            <Link
              to="/signup"
              className="btn-light animate-rise shadow-card"
              style={{ animationDelay: '150ms' }}
            >
              Start free <ArrowUpRight size={15} weight="bold" />
            </Link>
          </div>
        </div>

      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Statement: two-tone editorial sentence, lots of air.              */}
      {/* ---------------------------------------------------------------- */}
      <section id="statement" className="px-5 py-24 sm:px-10 sm:py-36">
        <p className="display-3 mx-auto max-w-[24ch] text-center">
          A vacancy is the most expensive week in a rental{' '}
          <span className="text-ink-faint">and usually the one with the least structure around it.</span>
        </p>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* How it works: deep clay scene, offset photograph.                 */}
      {/* ---------------------------------------------------------------- */}
      <section id="how-it-works" className="px-3 sm:px-5">
        <div className="scene-clay px-5 py-16 sm:px-10 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
            <div>
              <p className="eyebrow text-white/45">How it works</p>
              <h2 className="display-2 mt-5 max-w-[14ch]">Six stages, one week</h2>
              <p className="lede mt-6 max-w-[44ch] text-white/65">
                Opening a turnover lays down a fourteen-step checklist, dated from the move-out. Nothing to set up and
                nothing to maintain on the side.
              </p>

              <ol className="mt-12">
                {stages.map((stage) => (
                  <li key={stage.n} className="flex gap-5 border-t border-white/15 py-5 sm:gap-8">
                    <span className="w-8 shrink-0 pt-1 text-[12px] tabular-nums text-white/40">{stage.n}</span>
                    <span className="min-w-0 flex-1">
                      <span className="display-4 block">{stage.label}</span>
                      <span className="mt-1.5 block text-[14px] leading-relaxed text-white/55">{stage.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="lg:pt-24">
              <img
                src={marketingImages.emptyRoom.src}
                alt={marketingImages.emptyRoom.alt}
                loading="lazy"
                className="h-[420px] w-full rounded-lg object-cover lg:h-[640px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Product: navy scene                                               */}
      {/* ---------------------------------------------------------------- */}
      <section id="product" className="px-3 pt-3 sm:px-5 sm:pt-5">
        <div className="scene-navy px-5 py-16 sm:px-10 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
            <div className="order-2 lg:order-1 lg:pt-24">
              <img
                src={marketingImages.kitchen.src}
                alt={marketingImages.kitchen.alt}
                loading="lazy"
                className="h-[420px] w-full rounded-lg object-cover lg:h-[560px]"
              />
            </div>

            <div className="order-1 lg:order-2">
              <p className="eyebrow text-white/45">The product</p>
              <h2 className="display-2 mt-5 max-w-[16ch]">Everything the week needs, nothing it doesn't</h2>
              <p className="lede mt-6 max-w-[44ch] text-white/65">
                No rent collection, no screening, no leases. Just the stretch between one tenant leaving and the next
                arriving.
              </p>

              <dl className="mt-12">
                {capabilities.map((item) => (
                  <div key={item.label} className="border-t border-white/15 py-5">
                    <dt className="display-4">{item.label}</dt>
                    <dd className="mt-1.5 max-w-[48ch] text-[14px] leading-relaxed text-white/55">{item.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Gallery: photography at full width                                */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-3 pt-3 sm:px-5 sm:pt-5">
        <div className="grid gap-3 sm:gap-5 lg:grid-cols-3">
          {[marketingImages.livingRoom, marketingImages.loft, marketingImages.lounge].map((image, i) => (
            <figure key={i} className="scene group">
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="h-[280px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] lg:h-[400px]"
              />
            </figure>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Numbers                                                           */}
      {/* ---------------------------------------------------------------- */}
      <section id="numbers" className="px-5 py-24 sm:px-10 sm:py-36">
        <h2 className="display-2 max-w-[18ch]">Know what a turnover actually costs you</h2>
        <p className="lede mt-6 max-w-[48ch] text-ink-soft">
          Every task carries a date and a cost, so the vacancy stops being a feeling and starts being a number you can
          work on.
        </p>

        <dl className="mt-16 grid gap-px border-t border-line sm:grid-cols-3">
          {numbers.map((item) => (
            <div key={item.label} className="pt-8">
              <dd className="text-[clamp(3rem,7vw,5.5rem)] font-normal leading-none tracking-display tabular-nums">
                {item.value}
              </dd>
              <dt className="mt-5 text-[14px] font-medium">{item.label}</dt>
              <dd className="mt-1.5 max-w-[32ch] text-[13px] leading-relaxed text-ink-faint">{item.body}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-10 text-[12px] text-ink-faint">Figures shown are an example portfolio, not aggregate customer data.</p>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Closing CTA over photography                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-3 pb-3 sm:px-5 sm:pb-5">
        <div className="scene relative min-h-[520px]">
          <img
            src={marketingImages.rooftops.src}
            alt={marketingImages.rooftops.alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-ink/55" aria-hidden="true" />
          <div className="relative flex min-h-[520px] flex-col justify-end p-5 sm:p-10">
            <h2 className="display-1 max-w-[14ch] text-white">Run your next turnover in RentSet</h2>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/signup" className="btn-light">
                Get started free <ArrowUpRight size={15} weight="bold" />
              </Link>
              <Link to="/login" className="btn-glass">
                Log in
              </Link>
            </div>
            <p className="mt-5 text-[13px] text-white/60">Free to start. Add a property, open a turnover, see where the unit stands.</p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
