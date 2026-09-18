import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ArrowUpRight, GearSix, MagnifyingGlass, SignOut, X } from '@phosphor-icons/react'
import { useAuth } from '@/lib/auth-context'
import { Logo } from '@/components/Logo'
import { Menu, MenuItem } from '@/components/ui/Menu'
import { ToastProvider } from '@/components/ui/Toast'
import { CommandSearch } from '@/components/workspace/CommandSearch'

const nav = [
  { to: '/app', label: 'Today', end: true },
  { to: '/app/turnovers', label: 'Turnovers', end: true },
  { to: '/app/portfolio', label: 'Portfolio', end: false },
  { to: '/app/schedule', label: 'Schedule', end: false },
  { to: '/app/vendors', label: 'Vendors', end: false },
]

export function WorkspaceLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const initial = (user?.email ?? '?')[0]!.toUpperCase()

  useEffect(() => setMenuOpen(false), [location.pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <ToastProvider>
      <div className="min-h-[100dvh] bg-paper">
        {/* Floating chrome: nothing is docked, everything is a pill. */}
        <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between gap-3 p-3 sm:p-5">
          <nav className="pointer-events-auto hidden items-center gap-1 rounded-pill bg-white/85 p-1 shadow-card backdrop-blur-md lg:flex">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-pill px-4 py-2 text-[13px] font-medium tracking-tight2 transition-colors ${
                    isActive ? 'bg-ink text-white' : 'text-ink-soft hover:bg-ink/[0.06] hover:text-ink'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button onClick={() => setMenuOpen(true)} className="btn-light pointer-events-auto shadow-card lg:hidden" aria-label="Open menu">
            Menu
          </button>

          <NavLink to="/app" className="pointer-events-auto" aria-label="RentSet home">
            <Logo size={46} />
          </NavLink>

          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="btn-light shadow-card"
              aria-label="Search"
            >
              <MagnifyingGlass size={15} weight="bold" />
              <span className="hidden sm:inline">Search</span>
            </button>

            <Menu
              trigger={() => (
                <span className="flex h-10 w-10 items-center justify-center rounded-pill bg-ink text-[13px] font-medium text-white shadow-card transition-opacity hover:opacity-85">
                  {initial}
                </span>
              )}
            >
              {(close) => (
                <>
                  <MenuItem
                    onClick={() => {
                      close()
                      navigate('/app/settings')
                    }}
                  >
                    <GearSix size={15} /> Settings
                  </MenuItem>
                  <MenuItem danger onClick={() => signOut()}>
                    <SignOut size={15} /> Log out
                  </MenuItem>
                </>
              )}
            </Menu>
          </div>
        </header>

        {/* Mobile overlay menu, same language as the marketing site. */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 flex animate-overlay-in flex-col bg-ink text-white lg:hidden">
            <div className="flex items-start justify-between gap-3 p-3 sm:p-5">
              <button onClick={() => setMenuOpen(false)} className="btn-glass" aria-label="Close menu">
                <X size={15} weight="bold" /> Close
              </button>
              <Logo size={46} light />
              <span className="flex h-10 w-10 items-center justify-center rounded-pill bg-white/15 text-[13px] font-medium text-white">
                {initial}
              </span>
            </div>

            <nav className="flex flex-1 flex-col justify-center px-5">
              <ul>
                {nav.map((item, i) => (
                  <li key={item.to} className="animate-rise border-b border-white/15" style={{ animationDelay: `${i * 45}ms` }}>
                    <NavLink to={item.to} end={item.end} className="group flex items-baseline justify-between gap-6 py-4">
                      <span className="display-3 transition-opacity group-hover:opacity-60">{item.label}</span>
                      <ArrowUpRight size={20} className="shrink-0 self-center opacity-40" />
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-wrap items-center gap-3 p-5">
              <NavLink to="/app/settings" className="btn-glass">
                <GearSix size={15} /> Settings
              </NavLink>
              <button onClick={() => signOut()} className="btn-glass">
                <SignOut size={15} /> Log out
              </button>
            </div>
          </div>
        )}

        <main className="px-3 pb-16 pt-24 sm:px-5 sm:pt-28">
          <div className="mx-auto w-full max-w-[1600px] animate-fade-in">
            <Outlet />
          </div>
        </main>

        <CommandSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
    </ToastProvider>
  )
}
