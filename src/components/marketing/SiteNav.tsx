import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUpRight, X } from '@phosphor-icons/react'
import { Logo } from '@/components/Logo'

const menuLinks = [
  { label: 'Home', to: '/' },
  { label: 'How it works', to: '/#how-it-works' },
  { label: 'The product', to: '/#product' },
  { label: 'Resources', to: '/resources' },
  { label: 'About', to: '/about' },
]

export function SiteNav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname, location.hash, location.search])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between gap-3 p-3 sm:p-5">
        <button
          onClick={() => setOpen(true)}
          className="btn-light pointer-events-auto shadow-card"
          aria-expanded={open}
          aria-label="Open menu"
        >
          Menu
        </button>

        <Link to="/" aria-label="RentSet home" className="pointer-events-auto">
          <Logo size={46} />
        </Link>

        <Link to="/signup" className="btn-primary pointer-events-auto shadow-card">
          Get started
        </Link>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 flex animate-overlay-in flex-col bg-ink text-white">
          <div className="flex items-start justify-between gap-3 p-3 sm:p-5">
            <button onClick={() => setOpen(false)} className="btn-glass" aria-label="Close menu">
              <X size={15} weight="bold" /> Close
            </button>
            <Logo size={46} light />
            <Link to="/signup" className="btn-light">
              Get started
            </Link>
          </div>

          <nav className="flex flex-1 flex-col justify-center px-5 sm:px-10">
            <ul>
              {menuLinks.map((link, i) => (
                <li key={link.label} className="animate-rise border-b border-white/15" style={{ animationDelay: `${i * 45}ms` }}>
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="group flex items-baseline justify-between gap-6 py-4 sm:py-6"
                  >
                    <span className="display-2 transition-opacity group-hover:opacity-60">{link.label}</span>
                    <ArrowUpRight
                      size={22}
                      className="shrink-0 self-center opacity-40 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-wrap items-center gap-3 p-5 sm:p-10">
            <Link to="/login" className="btn-glass">
              Log in
            </Link>
            <span className="text-[13px] text-white/50">Free to start, no credit card required.</span>
          </div>
        </div>
      )}
    </>
  )
}
