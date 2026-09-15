import { NavLink, Outlet } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { useAuth } from '@/lib/auth-context'

const navItems = [
  { to: '/app', label: 'Properties', end: true },
  { to: '/app/schedule', label: 'Schedule' },
  { to: '/app/vendors', label: 'Vendors' },
  { to: '/app/settings', label: 'Settings' },
]

export function WorkspaceLayout() {
  const { user, signOut } = useAuth()

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-line bg-surface md:flex">
        <div className="px-5 py-5">
          <Logo />
        </div>
        <nav className="flex-1 space-y-0.5 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-ink text-white' : 'text-ink-soft hover:bg-ink/5 hover:text-ink'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-line px-3 py-4">
          <p className="truncate px-3 text-xs text-ink-faint">{user?.email}</p>
          <button onClick={() => signOut()} className="btn-ghost mt-1 w-full justify-start px-3">
            Log out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-line bg-surface px-4 py-3 md:hidden">
          <Logo />
          <button onClick={() => signOut()} className="btn-ghost text-sm">
            Log out
          </button>
        </header>

        <main className="flex-1 px-4 pb-24 pt-6 sm:px-6 md:px-10 md:py-10">
          <Outlet />
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-surface md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex-1 border-t-2 px-2 py-3 text-center text-xs font-medium ${
                  isActive ? 'border-ink text-ink' : 'border-transparent text-ink-faint'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
