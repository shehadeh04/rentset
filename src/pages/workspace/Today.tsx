import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Check } from '@phosphor-icons/react'
import { useAllTasks, useAllTurnovers, useCompleteTask, useProperties, taskRollup } from '@/lib/workspace-data'
import { addDays, daysBetween, formatDate, formatMoney, todayISO } from '@/lib/format'
import { stageLabels, turnoverHealth } from '@/lib/turnover'
import { unitPhoto } from '@/lib/photos'
import { marketingImages } from '@/lib/images'
import { categoryLabels } from '@/lib/task-categories'
import { Progress } from '@/components/ui/Progress'
import { Skeleton } from '@/components/Skeleton'

interface AttentionItem {
  id: string
  tone: 'critical' | 'caution'
  headline: string
  detail: string
  turnoverId: string
}

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Today() {
  const today = todayISO()

  const { data: properties, isLoading } = useProperties()
  const { data: tasks } = useAllTasks()
  const { data: turnovers } = useAllTurnovers()
  const completeTask = useCompleteTask()

  const rollup = useMemo(() => taskRollup(tasks, today), [tasks, today])
  const active = useMemo(() => (turnovers ?? []).filter((t) => t.stage !== 'leased'), [turnovers])

  const metrics = useMemo(() => {
    const open = (tasks ?? []).filter((t) => t.status !== 'done')
    const closed = (turnovers ?? []).filter((t) => t.stage === 'leased' && t.move_out_date && t.leased_date)
    const avgDays = closed.length
      ? Math.round(closed.reduce((sum, t) => sum + daysBetween(t.move_out_date!, t.leased_date!), 0) / closed.length)
      : null
    return {
      active: active.length,
      dueToday: open.filter((t) => t.due_date === today).length,
      overdue: open.filter((t) => t.due_date && t.due_date < today).length,
      cost: (tasks ?? []).reduce((sum, t) => sum + (t.cost ?? 0), 0),
      avgDays,
    }
  }, [tasks, turnovers, active, today])

  const attention = useMemo(() => {
    const items: AttentionItem[] = []
    const overdueByTurnover = new Map<string, { count: number; label: string; oldest: string }>()

    for (const task of tasks ?? []) {
      if (task.status === 'done' || !task.due_date || task.due_date >= today || !task.turnover) continue
      const key = task.turnover.id
      const label = `${task.turnover.unit.property.name} · ${task.turnover.unit.unit_label}`
      const entry = overdueByTurnover.get(key) ?? { count: 0, label, oldest: task.due_date }
      entry.count += 1
      if (task.due_date < entry.oldest) entry.oldest = task.due_date
      overdueByTurnover.set(key, entry)
    }
    for (const [turnoverId, { count, label, oldest }] of overdueByTurnover) {
      items.push({
        id: `overdue-${turnoverId}`,
        tone: 'critical',
        headline: `${count} task${count === 1 ? '' : 's'} overdue`,
        detail: `${label} · oldest due ${formatDate(oldest)}`,
        turnoverId,
      })
    }
    for (const turnover of active) {
      const health = turnoverHealth(turnover)
      const label = `${turnover.unit.property.name} · ${turnover.unit.unit_label}`
      if (health.pastTarget) {
        items.push({
          id: `target-${turnover.id}`,
          tone: 'caution',
          headline: health.headline,
          detail: `${label} · still in ${stageLabels[turnover.stage].toLowerCase()}`,
          turnoverId: turnover.id,
        })
      } else if (turnover.stage === 'notice' && health.dayNum !== null && health.dayNum > -7 && health.dayNum < 0) {
        items.push({
          id: `soon-${turnover.id}`,
          tone: 'caution',
          headline: health.headline,
          detail: `${label} · book vendors before the unit is empty`,
          turnoverId: turnover.id,
        })
      }
    }
    return items.sort((a, b) => (a.tone === b.tone ? 0 : a.tone === 'critical' ? -1 : 1))
  }, [tasks, active, today])

  const dueToday = useMemo(() => (tasks ?? []).filter((t) => t.status !== 'done' && t.due_date === today), [tasks, today])

  const upcoming = useMemo(() => {
    const horizon = addDays(today, 30)
    return (tasks ?? [])
      .filter((t) => t.status !== 'done' && t.due_date && t.due_date > today && t.due_date <= horizon)
      .sort((a, b) => (a.due_date! < b.due_date! ? -1 : 1))
      .slice(0, 8)
  }, [tasks, today])

  const unitCounts = useMemo(() => {
    const all = (properties ?? []).flatMap((p) => p.units)
    return {
      total: all.length,
      occupied: all.filter((u) => u.status === 'occupied').length,
      turnover: all.filter((u) => u.status === 'turnover').length,
      vacant: all.filter((u) => u.status === 'vacant').length,
    }
  }, [properties])

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-[60svh] w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (properties && properties.length === 0) {
    return (
      <section className="scene relative min-h-[70svh]">
        <img src={marketingImages.emptyRoom.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/65" aria-hidden="true" />
        <div className="relative flex min-h-[70svh] flex-col justify-end p-5 sm:p-10">
          <h1 className="display-1 max-w-[14ch] text-white">Set up your portfolio</h1>
          <p className="lede mt-6 max-w-[46ch] text-white/70">
            Add your first property and its units. Once a tenant gives notice, open a turnover and RentSet builds the
            schedule for you.
          </p>
          <Link to="/app/portfolio" className="btn-light mt-8 self-start">
            Add a property <ArrowUpRight size={15} weight="bold" />
          </Link>
        </div>
      </section>
    )
  }

  const lead = active[0]

  return (
    <div className="space-y-5">
      {/* Hero scene ---------------------------------------------------- */}
      <section className="scene relative min-h-[64svh]">
        <img
          src={lead ? unitPhoto(lead.unit.id, 2000, 1100) : marketingImages.lounge.src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/25" aria-hidden="true" />

        <div className="relative flex min-h-[64svh] flex-col justify-end p-5 sm:p-10">
          <p className="eyebrow text-white/50">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="display-1 mt-4 text-white">{greeting()}</h1>
          <p className="lede mt-5 max-w-[44ch] text-white/75">
            {attention.length === 0
              ? 'Nothing is behind schedule. Every task is inside its due date.'
              : `${attention.length} thing${attention.length === 1 ? '' : 's'} need your attention today.`}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/app/turnovers" className="btn-light">
              Open the board <ArrowUpRight size={15} weight="bold" />
            </Link>
            <Link to="/app/schedule" className="btn-glass">
              Full schedule
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics ------------------------------------------------------- */}
      <section className="px-2 py-14 sm:px-5 sm:py-20">
        <dl className="grid gap-10 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Active turnovers" value={metrics.active} sub={`${unitCounts.total} unit${unitCounts.total === 1 ? '' : 's'} total`} />
          <Metric label="Due today" value={metrics.dueToday} sub={metrics.dueToday === 0 ? 'Clear' : 'Tasks to close'} />
          <Metric label="Overdue" value={metrics.overdue} sub={metrics.overdue === 0 ? 'On schedule' : 'Past due date'} tone={metrics.overdue > 0 ? 'critical' : undefined} />
          <Metric
            label="Tracked cost"
            value={formatMoney(metrics.cost)}
            sub={metrics.avgDays === null ? 'No closed turnovers yet' : `${metrics.avgDays}d average turnover`}
          />
        </dl>
      </section>

      {/* Needs attention ----------------------------------------------- */}
      {attention.length > 0 ? (
        <section className="scene-clay px-5 py-14 sm:px-10 sm:py-20">
          <p className="eyebrow text-white/45">Needs attention</p>
          <h2 className="display-2 mt-5 max-w-[16ch]">
            {attention.length} thing{attention.length === 1 ? '' : 's'} behind
          </h2>
          <ul className="mt-12">
            {attention.map((item) => (
              <li key={item.id} className="border-t border-white/15">
                <Link to={`/app/turnovers/${item.turnoverId}`} className="group flex items-center justify-between gap-6 py-5">
                  <span className="min-w-0">
                    <span className="display-4 block transition-opacity group-hover:opacity-70">{item.headline}</span>
                    <span className="mt-1.5 block truncate text-[13px] text-white/55">{item.detail}</span>
                  </span>
                  <ArrowUpRight size={20} className="shrink-0 opacity-40 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="scene-navy px-5 py-14 sm:px-10 sm:py-20">
          <p className="eyebrow text-white/45">Needs attention</p>
          <h2 className="display-2 mt-5 max-w-[18ch]">Everything is on schedule</h2>
          <p className="lede mt-6 max-w-[42ch] text-white/60">
            No overdue tasks, and no turnover is past its target date.
          </p>
        </section>
      )}

      {/* Due today ------------------------------------------------------ */}
      <section className="px-2 py-14 sm:px-5 sm:py-20">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="display-3">Due today</h2>
          <Link to="/app/schedule" className="btn-secondary btn-sm">
            Full schedule
          </Link>
        </div>

        {dueToday.length === 0 ? (
          <p className="lede mt-8 border-t border-line pt-8 text-ink-faint">Nothing is due today.</p>
        ) : (
          <ul className="mt-8">
            {dueToday.map((task) => (
              <li key={task.id} className="flex items-center gap-4 border-t border-line py-4">
                <button
                  onClick={() => completeTask.mutate(task.id)}
                  disabled={completeTask.isPending}
                  aria-label={`Mark ${task.title} done`}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-pill border border-line text-transparent transition-colors hover:border-ink hover:bg-ink hover:text-white"
                >
                  <Check size={13} weight="bold" />
                </button>
                <span className="min-w-0 flex-1">
                  <span className="display-4 block truncate">{task.title}</span>
                  <span className="mt-1 block truncate text-[13px] text-ink-faint">
                    {categoryLabels[task.category]}
                    {task.turnover && ` · ${task.turnover.unit.property.name} · ${task.turnover.unit.unit_label}`}
                  </span>
                </span>
                {task.turnover && (
                  <Link to={`/app/turnovers/${task.turnover.id}`} className="btn-ghost btn-sm shrink-0">
                    Open
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Active turnovers ---------------------------------------------- */}
      {active.length > 0 && (
        <section className="px-2 pb-14 sm:px-5 sm:pb-20">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="display-3">Active turnovers</h2>
            <Link to="/app/turnovers" className="btn-secondary btn-sm">
              All turnovers
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
            {active.map((turnover) => {
              const counts = rollup.get(turnover.id) ?? { done: 0, total: 0, overdue: 0, cost: 0 }
              const health = turnoverHealth(turnover)
              return (
                <Link key={turnover.id} to={`/app/turnovers/${turnover.id}`} className="scene group relative min-h-[300px]">
                  <img
                    src={unitPhoto(turnover.unit.id, 900, 700)}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" aria-hidden="true" />
                  <span className="relative flex min-h-[300px] flex-col justify-end p-5 text-white">
                    <span className="flex items-center gap-2 text-[12px] font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                      {stageLabels[turnover.stage]}
                    </span>
                    <span className="display-3 mt-2 block">{turnover.unit.unit_label}</span>
                    <span className="mt-1 block text-[13px] text-white/65">{turnover.unit.property.name}</span>
                    <span className="mt-5 block">
                      <Progress value={counts.done} total={counts.total} tone={health.pastTarget ? 'critical' : 'brand'} />
                    </span>
                    <span className="mt-2.5 flex items-center justify-between gap-3 text-[12px] text-white/65">
                      <span>
                        {counts.done}/{counts.total} tasks
                      </span>
                      <span className={health.pastTarget ? 'font-medium text-critical-200' : ''}>{health.headline}</span>
                    </span>
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Coming up ------------------------------------------------------ */}
      {upcoming.length > 0 && (
        <section className="px-2 pb-14 sm:px-5 sm:pb-20">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="display-3">Coming up</h2>
            <span className="ws-meta">Next 30 days</span>
          </div>
          <ul className="mt-8">
            {upcoming.map((task) => {
              const due = new Date(task.due_date + 'T00:00:00')
              return (
                <li key={task.id} className="flex items-center gap-5 border-t border-line py-4">
                  <span className="w-16 shrink-0">
                    <span className="block text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                      {due.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="block text-[24px] leading-none tracking-display tabular-nums">{due.getDate()}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] tracking-tight2">{task.title}</span>
                    <span className="mt-0.5 block truncate text-[12px] text-ink-faint">
                      {categoryLabels[task.category]}
                      {task.turnover && ` · ${task.turnover.unit.unit_label}`}
                    </span>
                  </span>
                  <span className="shrink-0 text-[12px] text-ink-faint">in {daysBetween(today, task.due_date!)}d</span>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {/* Portfolio band ------------------------------------------------- */}
      {unitCounts.total > 0 && (
        <section className="scene-dark px-5 py-14 sm:px-10 sm:py-20">
          <p className="eyebrow text-white/45">Portfolio</p>
          <h2 className="display-2 mt-5">
            {unitCounts.total} unit{unitCounts.total === 1 ? '' : 's'}
          </h2>

          <div className="mt-10 flex h-1.5 overflow-hidden rounded-pill bg-white/15">
            {unitCounts.occupied > 0 && <div className="bg-white" style={{ width: `${(unitCounts.occupied / unitCounts.total) * 100}%` }} />}
            {unitCounts.turnover > 0 && <div className="bg-brand-300" style={{ width: `${(unitCounts.turnover / unitCounts.total) * 100}%` }} />}
            {unitCounts.vacant > 0 && <div className="bg-caution-300" style={{ width: `${(unitCounts.vacant / unitCounts.total) * 100}%` }} />}
          </div>

          <dl className="mt-8 grid gap-6 sm:grid-cols-3">
            <LegendRow swatch="bg-white" label="Occupied" value={unitCounts.occupied} />
            <LegendRow swatch="bg-brand-300" label="In turnover" value={unitCounts.turnover} />
            <LegendRow swatch="bg-caution-300" label="Vacant" value={unitCounts.vacant} />
          </dl>

          <Link to="/app/portfolio" className="btn-light mt-10 self-start">
            View portfolio <ArrowUpRight size={15} weight="bold" />
          </Link>
        </section>
      )}
    </div>
  )
}

function Metric({ label, value, sub, tone }: { label: string; value: string | number; sub: string; tone?: 'critical' }) {
  return (
    <div>
      <dt className="ws-label">{label}</dt>
      <dd className={`mt-4 text-[clamp(2.5rem,5vw,4rem)] font-normal leading-none tracking-display tabular-nums ${tone === 'critical' ? 'text-critical-600' : ''}`}>
        {value}
      </dd>
      <dd className="mt-3 text-[13px] text-ink-faint">{sub}</dd>
    </div>
  )
}

function LegendRow({ swatch, label, value }: { swatch: string; label: string; value: number }) {
  return (
    <div className="flex items-baseline gap-3 border-t border-white/15 pt-4">
      <span className={`h-2 w-2 shrink-0 translate-y-[-2px] rounded-full ${swatch}`} />
      <dt className="flex-1 text-[14px] text-white/65">{label}</dt>
      <dd className="text-[24px] leading-none tracking-display tabular-nums">{value}</dd>
    </div>
  )
}
