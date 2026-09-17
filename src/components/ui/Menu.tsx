import { useEffect, useRef, useState, type ReactNode } from 'react'

export function Menu({ trigger, children, align = 'right' }: { trigger: (open: boolean) => ReactNode; children: (close: () => void) => ReactNode; align?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={root} className="relative">
      <button onClick={() => setOpen((v) => !v)} className="block w-full text-left" aria-expanded={open} aria-haspopup="menu">
        {trigger(open)}
      </button>
      {open && (
        <div
          role="menu"
          className={`absolute z-40 mt-1.5 min-w-[13rem] animate-menu-in overflow-hidden rounded-md border border-line bg-surface py-1 shadow-pop ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}

export function MenuItem({ onClick, children, danger }: { onClick: () => void; children: ReactNode; danger?: boolean }) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] transition-colors ${
        danger ? 'text-critical-600 hover:bg-critical-50' : 'text-ink-soft hover:bg-deck hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}
