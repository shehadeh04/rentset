export function Progress({ value, total, tone = 'brand' }: { value: number; total: number; tone?: 'brand' | 'ink' | 'critical' }) {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0
  const fill = tone === 'critical' ? 'bg-critical-500' : tone === 'ink' ? 'bg-ink' : 'bg-brand-500'
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full rounded-full transition-[width] duration-500 ${fill}`} style={{ width: `${pct}%` }} />
    </div>
  )
}
