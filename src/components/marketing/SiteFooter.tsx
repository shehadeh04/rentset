import { Link } from 'react-router-dom'
import { ArrowUpRight } from '@phosphor-icons/react'
import { Logo } from '@/components/Logo'

const columns = [
  {
    heading: 'Product',
    links: [
      { label: 'The product', to: '/#product' },
      { label: 'How it works', to: '/#how-it-works' },
      { label: 'Results', to: '/#numbers' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Turnover checklist', to: '/resources' },
      { label: 'Common questions', to: '/resources#faq' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Log in', to: '/login' },
      { label: 'Get started free', to: '/signup' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-paper px-5 pb-8 pt-24 sm:px-10">
      <div className="flex flex-col justify-between gap-12 border-t border-line pt-10 lg:flex-row lg:gap-20">
        <div>
          <Logo size={46} />
          <p className="mt-6 max-w-[28ch] text-[14px] leading-relaxed text-ink-soft">
            Turnover management for independent landlords and small property managers.
          </p>
          <Link to="/signup" className="btn-primary mt-8">
            Get started free <ArrowUpRight size={15} weight="bold" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-16">
          {columns.map((col) => (
            <div key={col.heading}>
              <p className="eyebrow text-ink-faint">{col.heading}</p>
              <ul className="mt-5 space-y-3 text-[14px] text-ink-soft">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="transition-colors hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-16 border-t border-line pt-6 text-[12px] text-ink-faint">
        &copy; {new Date().getFullYear()} RentSet
      </p>
    </footer>
  )
}
