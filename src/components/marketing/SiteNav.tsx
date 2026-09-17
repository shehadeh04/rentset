import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { Icon } from '@phosphor-icons/react'
import {
  ArrowUpRight,
  Broom,
  CalendarBlank,
  CaretDown,
  ChartLineUp,
  ClipboardText,
  House,
  List,
  Wrench,
  X,
} from '@phosphor-icons/react'
import { Logo } from '@/components/Logo'

interface NavLeaf {
  label: string
  to: string
  description?: string
  icon?: Icon
}

interface NavGroup {
  label: string
  items: NavLeaf[]
}

const productItems: NavLeaf[] = [
  { label: 'Inspections', to: '/#product', description: 'Checklists that become repair tasks', icon: ClipboardText },
  { label: 'Repairs & vendors', to: '/#product', description: 'Assign work, track cost and status', icon: Wrench },
  { label: 'Cleaning', to: '/#product', description: 'Scheduled, confirmed, done', icon: Broom },
  { label: 'Scheduling', to: '/#product', description: 'Every due date in one list', icon: CalendarBlank },
  { label: 'Listings', to: '/#product', description: 'Drafted early, published on time', icon: House },
  { label: 'Turnover history', to: '/#numbers', description: 'What each unit actually took', icon: ChartLineUp },
]

const stageItems: NavLeaf[] = [
  { label: 'Notice', to: '/?stage=0#how-it-works' },
  { label: 'Inspection', to: '/?stage=1#how-it-works' },
  { label: 'Repairs', to: '/?stage=2#how-it-works' },
  { label: 'Cleaning', to: '/?stage=3#how-it-works' },
  { label: 'Listing', to: '/?stage=4#how-it-works' },
  { label: 'Leased', to: '/?stage=5#how-it-works' },
]

const resourceItems: NavLeaf[] = [
  { label: 'Turnover checklist', to: '/resources', description: 'The 14 steps RentSet sets up for you' },
  { label: 'Common questions', to: '/resources#faq', description: 'What the product does and does not do' },
]

const groups: NavGroup[] = [
  { label: 'Product', items: productItems },
  { label: 'How it works', items: stageItems },
  { label: 'Resources', items: resourceItems },
]

function Dropdown({ group, wide }: { group: NavGroup; wide: boolean }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1 py-2 text-sm text-ink-soft transition-colors hover:text-ink"
      >
        {group.label}
        <CaretDown size={12} weight="bold" className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className={`absolute left-0 top-full z-50 animate-fade-in rounded-lg border border-line bg-surface p-2 shadow-lifted ${
            wide ? 'w-[30rem]' : 'w-64'
          }`}
        >
          <div className={wide ? 'grid grid-cols-2 gap-1' : 'grid gap-1'}>
            {group.items.map((item) => (
              <Link
                key={item.label + item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex items-start gap-2.5 rounded-md p-2.5 transition-colors hover:bg-sunken"
              >
                {item.icon && <item.icon size={17} weight="regular" className="mt-0.5 shrink-0 text-ink" />}
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium text-ink">{item.label}</span>
                  {item.description && (
                    <span className="mt-0.5 block text-xs leading-snug text-ink-faint">{item.description}</span>
                  )}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function SiteNav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>('Product')
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname, location.hash, location.search])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const isHome = location.pathname === '/'

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between gap-6 px-6 lg:px-10">
        <div className="flex items-center gap-10">
          <Link to="/" aria-label="RentSet home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            <Link
              to="/"
              className={`py-2 text-sm transition-colors hover:text-ink ${isHome ? 'font-medium text-ink' : 'text-ink-soft'}`}
            >
              Home
            </Link>
            {groups.map((g) => (
              <Dropdown key={g.label} group={g} wide={g.label === 'Product'} />
            ))}
            <Link
              to="/about"
              className={`py-2 text-sm transition-colors hover:text-ink ${
                location.pathname === '/about' ? 'font-medium text-ink' : 'text-ink-soft'
              }`}
            >
              About
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link to="/login" className="btn-ghost hidden px-3 sm:inline-flex sm:px-5">
            Log in
          </Link>
          <Link to="/signup" className="btn-secondary px-3.5 sm:px-5">
            <ArrowUpRight size={15} weight="bold" />
            <span className="hidden sm:inline">Get started free</span>
            <span className="sm:hidden">Get started</span>
          </Link>
          <button
            className="icon-btn lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} weight="regular" /> : <List size={20} weight="regular" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="max-h-[calc(100dvh-5rem)] animate-fade-in overflow-y-auto border-t border-line bg-canvas px-6 pb-10 pt-4 lg:hidden">
          <Link to="/" className="block py-3 text-sm font-medium text-ink">
            Home
          </Link>
          {groups.map((g) => {
            const expanded = openGroup === g.label
            return (
              <div key={g.label} className="border-t border-line">
                <button
                  className="flex w-full items-center justify-between py-3 text-sm font-medium text-ink"
                  onClick={() => setOpenGroup(expanded ? null : g.label)}
                  aria-expanded={expanded}
                >
                  {g.label}
                  <CaretDown size={13} weight="bold" className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
                </button>
                {expanded && (
                  <div className="grid gap-0.5 pb-3">
                    {g.items.map((item) => (
                      <Link
                        key={item.label + item.to}
                        to={item.to}
                        className="flex items-center gap-2.5 rounded-md px-2 py-2.5 text-[13px] text-ink-soft hover:bg-sunken hover:text-ink"
                      >
                        {item.icon && <item.icon size={16} weight="regular" className="shrink-0" />}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          <div className="border-t border-line">
            <Link to="/about" className="block py-3 text-sm font-medium text-ink">
              About
            </Link>
          </div>
          <div className="mt-5 grid gap-2 border-t border-line pt-5">
            <Link to="/login" className="btn-secondary w-full">
              Log in
            </Link>
            <Link to="/signup" className="btn-primary w-full">
              Get started free
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
