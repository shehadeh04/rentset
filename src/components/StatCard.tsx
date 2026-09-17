import type { Icon } from '@phosphor-icons/react'

const accentBorder: Record<'ink' | 'moss' | 'gold' | 'danger', string> = {
  ink: 'border-l-ink/15',
  moss: 'border-l-ink',
  gold: 'border-l-caution-500',
  danger: 'border-l-critical-500',
}

const accentValue: Record<'ink' | 'moss' | 'gold' | 'danger', string> = {
  ink: 'text-ink',
  moss: 'text-positive-600',
  gold: 'text-caution-700',
  danger: 'text-critical-600',
}

export function StatCard({
  label,
  value,
  accent = 'ink',
  icon: IconComponent,
}: {
  label: string
  value: number | string
  accent?: 'ink' | 'moss' | 'gold' | 'danger'
  icon?: Icon
}) {
  return (
    <div className={`flex items-start justify-between gap-2 rounded-sm border border-line border-l-2 bg-surface py-3 pl-4 pr-3.5 ${accentBorder[accent]}`}>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{label}</p>
        <p className={`mt-1 text-2xl font-medium tabular-nums ${accentValue[accent]}`}>{value}</p>
      </div>
      {IconComponent && <IconComponent size={16} weight="light" className="mt-0.5 shrink-0 text-ink-subtle" />}
    </div>
  )
}
