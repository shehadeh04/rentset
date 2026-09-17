import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowsClockwise, Buildings, MagnifyingGlass, Wrench } from '@phosphor-icons/react'
import { useAllTurnovers, useProperties, useVendors } from '@/lib/workspace-data'
import { stageLabels } from '@/lib/turnover'

interface Hit {
  id: string
  group: 'Units' | 'Turnovers' | 'Vendors'
  title: string
  sub: string
  to: string
}

export function CommandSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)

  const { data: properties } = useProperties()
  const { data: turnovers } = useAllTurnovers()
  const { data: vendors } = useVendors()

  const hits = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list: Hit[] = []

    for (const property of properties ?? []) {
      for (const unit of property.units) {
        list.push({
          id: `unit-${unit.id}`,
          group: 'Units',
          title: `${property.name} · ${unit.unit_label}`,
          sub: `${property.city}, ${property.state} · ${unit.bedrooms} bd`,
          to: '/app/portfolio',
        })
      }
    }
    for (const turnover of turnovers ?? []) {
      list.push({
        id: `turnover-${turnover.id}`,
        group: 'Turnovers',
        title: `${turnover.unit.property.name} · ${turnover.unit.unit_label}`,
        sub: stageLabels[turnover.stage],
        to: `/app/turnovers/${turnover.id}`,
      })
    }
    for (const vendor of vendors ?? []) {
      list.push({
        id: `vendor-${vendor.id}`,
        group: 'Vendors',
        title: vendor.name,
        sub: vendor.trade || 'General',
        to: '/app/vendors',
      })
    }

    if (!q) return list.slice(0, 8)
    return list.filter((hit) => `${hit.title} ${hit.sub}`.toLowerCase().includes(q)).slice(0, 12)
  }, [properties, turnovers, vendors, query])

  useEffect(() => setCursor(0), [query])

  useEffect(() => {
    if (!open) {
      setQuery('')
      return
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setCursor((c) => Math.min(c + 1, hits.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setCursor((c) => Math.max(c - 1, 0))
      }
      if (e.key === 'Enter' && hits[cursor]) {
        e.preventDefault()
        navigate(hits[cursor].to)
        onClose()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, hits, cursor, navigate, onClose])

  if (!open) return null

  let lastGroup = ''

  return (
    <div className="fixed inset-0 z-[55] flex items-start justify-center px-4 pt-[12vh]">
      <div className="absolute inset-0 animate-overlay-in bg-shell/50 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-label="Search" className="relative z-10 w-full max-w-lg animate-dialog-in overflow-hidden rounded-lg bg-surface shadow-dialog">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <MagnifyingGlass size={17} className="shrink-0 text-ink-faint" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search units, turnovers, vendors"
            className="w-full bg-transparent py-3.5 text-[14px] text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </div>

        <div className="max-h-[52vh] overflow-y-auto py-2">
          {hits.length === 0 && (
            <p className="px-4 py-8 text-center text-[13px] text-ink-faint">
              {query ? `Nothing matches “${query}”.` : 'Nothing to search yet.'}
            </p>
          )}
          {hits.map((hit, i) => {
            const showGroup = hit.group !== lastGroup
            lastGroup = hit.group
            const Icon = hit.group === 'Units' ? Buildings : hit.group === 'Turnovers' ? ArrowsClockwise : Wrench
            return (
              <div key={hit.id}>
                {showGroup && <p className="px-4 pb-1 pt-2.5 ws-label">{hit.group}</p>}
                <button
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => {
                    navigate(hit.to)
                    onClose()
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors ${
                    i === cursor ? 'bg-deck' : ''
                  }`}
                >
                  <Icon size={15} className="shrink-0 text-ink-faint" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-ink">{hit.title}</span>
                    <span className="block truncate text-[11px] text-ink-faint">{hit.sub}</span>
                  </span>
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
