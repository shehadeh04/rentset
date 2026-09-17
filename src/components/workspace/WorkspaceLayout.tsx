import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowsClockwise,
  Buildings,
  CalendarBlank,
  CaretUpDown,
  GearSix,
  List,
  MagnifyingGlass,
  SignOut,
  SquaresFour,
  Wrench,
  X,
} from '@phosphor-icons/react'
import { useAuth } from '@/lib/auth-context'
import { Menu, MenuItem } from '@/components/ui/Menu'
import { ToastProvider } from '@/components/ui/Toast'
import { CommandSearch } from '@/components/workspace/CommandSearch'

const primaryNav = [
  { to: '/app', label: 'Today', end: true, icon: SquaresFour },
  { to: '/app/turnovers', label: 'Turnovers', end: true, icon: ArrowsClockwise },
  { to: '/app/schedule', label: 'Schedule', end: false, icon: CalendarBlank },
]

const portfolioNav = [
  { to: '/app/portfolio', label: 'Portfolio', end: false, icon: Buildings },
  { to: '/app/vendors', label: 'Vendors', end: false, icon: Wrench },
]

const mobileNav = [...primaryNav, ...portfolioNav]

function pageTitle(pathname: string) {
  if (pathname === '/app') return 'Today'
  if (pathname === '/app/turnovers') return 'Turnovers'
  if (pathname.startsWith('/app/turnovers/')) return 'Turnover'
  if (pathname.startsWith('/app/portfolio')) return 'Portfolio'
  if (pathname.startsWith('/app/schedule')) return 'Schedule'
  if (pathname.startsWith('/app/vendors')) return 'Vendors'
  if (pathname.startsWith('/app/settings')) return 'Settings'
  return 'RentSet'
}

function NavGroup({ label, items, onNavigate }: { label: string; items: typeof primaryNav; onNavigate?: () => void }) {
  return (
    <div>
      <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-shell-muted">{label}</p>
      <div className="space-y-0.5">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `relative flex items-center gap-2.5 rounded px-3 py-2 text-[13px] transition-colors ${
                isActive ? 'bg-shell-soft font-medium text-white' : 'text-shell-text hover:bg-shell-soft/60 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-brand-300" aria-hidden="true" />}
                <item.icon size={16} weight={isActive ? 'fill' : 'regular'} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const initial = (user?.email ?? '?')[0]!.toUpperCase()

  return (
    <>
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="flex h-7 w-7 items-center justify-center rounded bg-white">
          <Buildings size={16} weight="fill" className="text-shell" />
        </span>
        <span className="text-[13px] font-semibold leading-none tracking-[0.14em] text-white">RENTSET</span>
      </div>

      <nav className="flex-1 space-y-6 px-2 py-2">
        <NavGroup label="Operations" items={primaryNav} onNavigate={onNavigate} />
        <NavGroup label="Portfolio" items={portfolioNav} onNavigate={onNavigate} />
      </nav>

      <div className="border-t border-shell-line p-2">
        <Menu
          align="left"
          trigger={() => (
            <span className="flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left transition-colors hover:bg-shell-soft">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-brand-500 text-[12px] font-semibold text-white">
                {initial}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] font-medium text-white">{user?.email}</span>
                <span className="block text-[11px] text-shell-muted">Landlord</span>
              </span>
              <CaretUpDown size={13} className="shrink-0 text-shell-muted" />
            </span>
          )}
        >
          {(close) => (
            <>
              <MenuItem
                onClick={() => {
                  close()
                  onNavigate?.()
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
    </>
  )
}

export function WorkspaceLayout() {
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

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

  return (
    <ToastProvider>
      <div className="min-h-[100dvh] bg-deck">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-[244px] flex-col bg-shell md:flex">
          <SidebarBody />
        </aside>

        {drawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 animate-overlay-in bg-shell/50" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
            <div className="relative flex h-full w-[264px] animate-sheet-in flex-col bg-shell">
              <button
                onClick={() => setDrawerOpen(false)}
                className="absolute right-3 top-4 text-shell-text transition-colors hover:text-white"
                aria-label="Close menu"
              >
                <X size={18} weight="bold" />
              </button>
              <SidebarBody onNavigate={() => setDrawerOpen(false)} />
            </div>
          </div>
        )}

        <div className="flex min-h-[100dvh] flex-col md:pl-[244px]">
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-line bg-deck/85 px-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-2">
              <button onClick={() => setDrawerOpen(true)} className="icon-btn -ml-1.5 md:hidden" aria-label="Open menu">
                <List size={18} weight="bold" />
              </button>
              <span className="truncate text-[13px] font-medium text-ink">{pageTitle(location.pathname)}</span>
            </div>

            <button
              onClick={() => setSearchOpen(true)}
              className="group flex h-9 flex-1 max-w-sm items-center gap-2 rounded border border-line bg-surface px-3 text-left text-[13px] text-ink-faint transition-colors hover:border-line-strong"
            >
              <MagnifyingGlass size={15} />
              <span className="flex-1 truncate">Search units, turnovers, vendors</span>
              <kbd className="hidden shrink-0 rounded border border-line bg-deck px-1.5 py-0.5 font-sans text-[10px] font-medium text-ink-faint sm:block">
                ⌘K
              </kbd>
            </button>
          </header>

          <main className="flex-1 px-4 pb-24 pt-6 sm:px-6 md:pb-10 lg:px-8">
            <div className="mx-auto w-full max-w-[1320px] animate-fade-in">
              <Outlet />
            </div>
          </main>

          <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-surface/95 backdrop-blur md:hidden">
            {mobileNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-medium transition-colors ${
                    isActive ? 'text-ink' : 'text-ink-faint'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={19} weight={isActive ? 'fill' : 'regular'} />
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <CommandSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
    </ToastProvider>
  )
}
