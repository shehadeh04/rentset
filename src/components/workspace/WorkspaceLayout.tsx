import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Buildings, CalendarBlank, GearSix, SignOut, Wrench } from '@phosphor-icons/react'
import { Logo } from '@/components/Logo'
import { useAuth } from '@/lib/auth-context'

const navItems = [
  { to: '/app', label: 'Properties', end: true, icon: Buildings },
  { to: '/app/schedule', label: 'Schedule', end: false, icon: CalendarBlank },
  { to: '/app/vendors', label: 'Vendors', end: false, icon: Wrench },
  { to: '/app/settings', label: 'Settings', end: false, icon: GearSix },
]

function pageTitle(pathname: string) {
  if (pathname === '/app') return 'Properties'
  if (pathname.startsWith('/app/schedule')) return 'Schedule'
  if (pathname.startsWith('/app/vendors')) return 'Vendors'
  if (pathname.startsWith('/app/settings')) return 'Settings'
  if (pathname.startsWith('/app/turnovers')) return 'Turnover'
  return 'RentSet'
}

export function WorkspaceLayout() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const initial = (user?.email ?? '?')[0]!.toUpperCase()

  return (
    <div className="flex min-h-[100dvh] bg-canvas">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-surface md:flex">
        <div className="px-6 py-6">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                  isActive ? 'bg-ink font-medium text-white' : 'text-ink-soft hover:bg-sunken hover:text-ink'
                }`
              }
            >
              <item.icon size={17} weight="regular" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-line px-6 py-5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">Signed in</p>
          <p className="mt-1 truncate text-sm text-ink-soft">{user?.email}</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line bg-surface px-4 py-3 md:hidden">
          <Logo />
          <button onClick={() => signOut()} className="icon-btn" aria-label="Log out">
            <SignOut size={18} weight="regular" />
          </button>
        </header>

        <header className="hidden items-center justify-between border-b border-line bg-surface px-8 py-3.5 md:flex">
          <p className="text-sm font-medium text-ink-soft">{pageTitle(location.pathname)}</p>
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-sunken text-xs font-semibold text-ink">
              {initial}
            </span>
            <button onClick={() => signOut()} className="icon-btn" title="Log out" aria-label="Log out">
              <SignOut size={16} weight="regular" />
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 pb-24 pt-6 sm:px-6 md:px-10 md:py-10">
          <div className="mx-auto w-full max-w-6xl animate-fade-in">
            <Outlet />
          </div>
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-surface/95 backdrop-blur md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-ink' : 'text-ink-faint'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} weight={isActive ? 'fill' : 'regular'} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
