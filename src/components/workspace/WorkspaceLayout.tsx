import { NavLink, Outlet } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { useAuth } from '@/lib/auth-context'

const navItems = [
  { to: '/app', label: 'Properties', end: true },
  { to: '/app/vendors', label: 'Vendors' },
  { to: '/app/settings', label: 'Settings' },
]

export function WorkspaceLayout() {
  const { user, signOut } = useAuth()

  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-white md:flex">
        <div className="px-6 py-5">
          <Logo />
        </div>
        <nav className="flex-1 space-y-0.5 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-800'
                    : 'text-ink-soft hover:bg-black/[0.03] hover:text-ink'
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
        <header className="flex items-center justify-between border-b border-line bg-white px-4 py-3 md:hidden">
          <Logo />
          <button onClick={() => signOut()} className="btn-ghost text-sm">
            Log out
          </button>
        </header>
        <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
