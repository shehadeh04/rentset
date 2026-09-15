const accentClass: Record<'ink' | 'amber' | 'red', string> = {
  ink: 'border-t-ink',
  amber: 'border-t-brand-500',
  red: 'border-t-red-500',
}

export function StatCard({
  label,
  value,
  accent = 'ink',
}: {
  label: string
  value: number | string
  accent?: 'ink' | 'amber' | 'red'
}) {
  return (
    <div className={`card border-t-2 p-4 ${accentClass[accent]}`}>
      <p className="font-display text-2xl font-semibold text-ink">{value}</p>
      <p className="tag mt-1 text-ink-faint">{label}</p>
    </div>
  )
}
