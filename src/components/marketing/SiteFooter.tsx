import { Link } from 'react-router-dom'
import { Logo } from '@/components/Logo'

const columns = [
  {
    heading: 'Product',
    links: [
      { label: 'Workspace', to: '/#product' },
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
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10">
        <div className="flex flex-col justify-between gap-10 sm:flex-row">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-ink-soft">
              Turnover management for independent landlords and small property managers.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-14">
            {columns.map((col) => (
              <div key={col.heading}>
                <p className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">{col.heading}</p>
                <ul className="mt-3 space-y-2 text-sm text-ink-soft">
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
        <p className="mt-12 border-t border-line pt-6 text-xs text-ink-faint">
          &copy; {new Date().getFullYear()} RentSet
        </p>
      </div>
    </footer>
  )
}
