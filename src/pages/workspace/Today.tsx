import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Buildings, Check, CheckCircle, Plus, WarningCircle } from '@phosphor-icons/react'
import { useAllTasks, useAllTurnovers, useCompleteTask, useProperties, taskRollup } from '@/lib/workspace-data'
import { addDays, daysBetween, formatDate, formatMoney, todayISO } from '@/lib/format'
import { stageLabels, turnoverHealth } from '@/lib/turnover'
import { unitPhoto } from '@/lib/photos'
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

  const active = useMemo(
    () => (turnovers ?? []).filter((t) => t.stage !== 'leased'),
    [turnovers]
  )

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

  const dueToday = useMemo(
    () => (tasks ?? []).filter((t) => t.status !== 'done' && t.due_date === today),
    [tasks, today]
  )

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
      <div className="space-y-8">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    )
  }

  if (properties && properties.length === 0) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-shell">
          <Buildings size={22} weight="fill" className="text-white" />
        </span>
        <h1 className="mt-5 ws-title">Set up your portfolio</h1>
        <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-ink-soft">
          Add your first property and its units. Once a tenant gives notice you can open a turnover and RentSet will
          build the schedule for you.
        </p>
        <Link to="/app/portfolio" className="btn-primary mt-6">
          <Plus size={15} weight="bold" /> Add a property
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="ws-title">{greeting()}</h1>
          <p className="mt-1 text-[13px] text-ink-soft">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            {attention.length === 0 ? ' · nothing is behind schedule' : ` · ${attention.length} thing${attention.length === 1 ? '' : 's'} need attention`}
          </p>
        </div>
        <Link to="/app/turnovers" className="btn-secondary btn-sm">
          Open the board <ArrowRight size={14} weight="bold" />
        </Link>
      </div>

      {/* Editorial metric strip: hairline rules, not a row of boxes. */}
      <dl className="grid grid-cols-2 border-y border-line sm:grid-cols-4 sm:divide-x sm:divide-line">
        <Metric label="Active turnovers" value={metrics.active} sub={`${unitCounts.total} unit${unitCounts.total === 1 ? '' : 's'} total`} />
        <Metric label="Due today" value={metrics.dueToday} sub={metrics.dueToday === 0 ? 'Clear' : 'Tasks to close'} />
        <Metric
          label="Overdue"
          value={metrics.overdue}
          sub={metrics.overdue === 0 ? 'On schedule' : 'Past due date'}
          tone={metrics.overdue > 0 ? 'critical' : undefined}
        />
        <Metric
          label="Tracked cost"
          value={formatMoney(metrics.cost)}
          sub={metrics.avgDays === null ? 'No closed turnovers yet' : `${metrics.avgDays}d average turnover`}
        />
      </dl>

      <div className="grid items-start gap-10 lg:grid-cols-[1.55fr_1fr]">
        <div className="min-w-0 space-y-9">
          <section>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="ws-section">Needs attention</h2>
              {attention.length > 0 && <span className="ws-meta">{attention.length} open</span>}
            </div>

            {attention.length === 0 ? (
              <div className="mt-3 flex items-center gap-3 rounded border border-line bg-surface px-4 py-5">
                <CheckCircle size={20} weight="fill" className="shrink-0 text-positive-500" />
                <div>
                  <p className="text-[13px] font-medium text-ink">Everything is on schedule</p>
                  <p className="ws-meta">No overdue tasks and no turnover past its target date.</p>
                </div>
              </div>
            ) : (
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {attention.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={`/app/turnovers/${item.turnoverId}`}
                      className="group flex items-start gap-3 py-3.5 transition-colors hover:bg-surface"
                    >
                      <WarningCircle
                        size={17}
                        weight="fill"
                        className={`mt-0.5 shrink-0 ${item.tone === 'critical' ? 'text-critical-500' : 'text-caution-500'}`}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-medium text-ink">{item.headline}</span>
                        <span className="block truncate text-[12px] text-ink-faint">{item.detail}</span>
                      </span>
                      <ArrowRight
                        size={15}
                        className="mt-0.5 shrink-0 text-ink-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-ink-soft"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="ws-section">Due today</h2>
              <Link to="/app/schedule" className="text-[12px] ws-link">
                Full schedule
              </Link>
            </div>

            {dueToday.length === 0 ? (
              <p className="mt-3 border-y border-line py-5 text-[13px] text-ink-faint">
                Nothing is due today.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {dueToday.map((task) => (
                  <li key={task.id} className="flex items-center gap-3 py-2.5">
                    <button
                      onClick={() => completeTask.mutate(task.id)}
                      disabled={completeTask.isPending}
                      title="Mark done"
                      aria-label={`Mark ${task.title} done`}
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line-strong text-transparent transition-colors hover:border-brand-500 hover:bg-brand-500 hover:text-white"
                    >
                      <Check size={11} weight="bold" />
                    </button>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] text-ink">{task.title}</span>
                      <span className="block truncate text-[11px] text-ink-faint">
                        {categoryLabels[task.category]}
                        {task.turnover && ` · ${task.turnover.unit.property.name} · ${task.turnover.unit.unit_label}`}
                      </span>
                    </span>
                    {task.turnover && (
                      <Link to={`/app/turnovers/${task.turnover.id}`} className="shrink-0 text-[12px] ws-link">
                        Open
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {upcoming.length > 0 && (
            <section>
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="ws-section">Coming up</h2>
                <span className="ws-meta">Next 30 days</span>
              </div>
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {upcoming.map((task) => {
                  const due = new Date(task.due_date + 'T00:00:00')
                  const inDays = daysBetween(today, task.due_date!)
                  return (
                    <li key={task.id} className="flex items-center gap-3 py-2.5">
                      <span className="w-12 shrink-0">
                        <span className="block text-[11px] font-medium uppercase tracking-wide text-ink-faint">
                          {due.toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="block text-[14px] font-semibold leading-tight tabular-nums text-ink-soft">
                          {due.getDate()}
                        </span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] text-ink">{task.title}</span>
                        <span className="block truncate text-[11px] text-ink-faint">
                          {categoryLabels[task.category]}
                          {task.turnover && ` · ${task.turnover.unit.unit_label}`}
                        </span>
                      </span>
                      <span className="shrink-0 text-[11px] text-ink-faint">in {inDays}d</span>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}
        </div>

        <div className="min-w-0 space-y-9">
          <section>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="ws-section">Active turnovers</h2>
              <Link to="/app/turnovers" className="text-[12px] ws-link">
                All
              </Link>
            </div>

            {active.length === 0 ? (
              <p className="mt-3 rounded border border-line bg-surface px-4 py-5 text-[13px] text-ink-faint">
                No turnover is open right now.
              </p>
            ) : (
              <ul className="mt-3 space-y-2.5">
                {active.map((turnover) => {
                  const counts = rollup.get(turnover.id) ?? { done: 0, total: 0, overdue: 0, cost: 0 }
                  const health = turnoverHealth(turnover)
                  return (
                    <li key={turnover.id}>
                      <Link
                        to={`/app/turnovers/${turnover.id}`}
                        className="group flex gap-3 overflow-hidden rounded border border-line bg-surface p-2.5 transition-colors hover:border-line-strong"
                      >
                        <img
                          src={unitPhoto(turnover.unit.id, 160, 160)}
                          alt=""
                          loading="lazy"
                          className="h-16 w-16 shrink-0 rounded object-cover"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <span className="truncate text-[13px] font-medium text-ink">{turnover.unit.unit_label}</span>
                            <span className={`state ${health.pastTarget ? 'state-critical' : 'state-brand'} shrink-0`}>
                              {stageLabels[turnover.stage]}
                            </span>
                          </span>
                          <span className="block truncate text-[11px] text-ink-faint">{turnover.unit.property.name}</span>
                          <span className="mt-2 block">
                            <Progress
                              value={counts.done}
                              total={counts.total}
                              tone={health.pastTarget ? 'critical' : 'brand'}
                            />
                          </span>
                          <span className="mt-1.5 flex items-center justify-between gap-2 text-[11px] text-ink-faint">
                            <span>
                              {counts.done}/{counts.total} tasks
                            </span>
                            <span className={health.pastTarget ? 'font-medium text-critical-600' : ''}>{health.headline}</span>
                          </span>
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          {unitCounts.total > 0 && (
            <section>
              <h2 className="ws-section">Portfolio</h2>
              <div className="mt-3 rounded border border-line bg-surface p-4">
                <div className="flex h-2 overflow-hidden rounded-full bg-line">
                  {unitCounts.occupied > 0 && (
                    <div className="bg-ink" style={{ width: `${(unitCounts.occupied / unitCounts.total) * 100}%` }} />
                  )}
                  {unitCounts.turnover > 0 && (
                    <div className="bg-brand-500" style={{ width: `${(unitCounts.turnover / unitCounts.total) * 100}%` }} />
                  )}
                  {unitCounts.vacant > 0 && (
                    <div className="bg-caution-300" style={{ width: `${(unitCounts.vacant / unitCounts.total) * 100}%` }} />
                  )}
                </div>
                <dl className="mt-4 space-y-2">
                  <LegendRow swatch="bg-ink" label="Occupied" value={unitCounts.occupied} />
                  <LegendRow swatch="bg-brand-500" label="In turnover" value={unitCounts.turnover} />
                  <LegendRow swatch="bg-caution-300" label="Vacant" value={unitCounts.vacant} />
                </dl>
                <Link to="/app/portfolio" className="mt-4 flex items-center gap-1 text-[12px] ws-link">
                  View portfolio <ArrowRight size={12} weight="bold" />
                </Link>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

function Metric({
  label,
  value,
  sub,
  tone,
}: {
  label: string
  value: string | number
  sub: string
  tone?: 'critical'
}) {
  return (
    <div className="px-1 py-4 first:pl-0 sm:px-5 sm:first:pl-0">
      <dt className="ws-label">{label}</dt>
      <dd className={`mt-1.5 text-metric font-semibold tabular-nums ${tone === 'critical' ? 'text-critical-600' : 'text-ink'}`}>
        {value}
      </dd>
      <dd className="mt-0.5 text-[11px] text-ink-faint">{sub}</dd>
    </div>
  )
}

function LegendRow({ swatch, label, value }: { swatch: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={`h-2 w-2 shrink-0 rounded-full ${swatch}`} />
      <dt className="flex-1 text-[12px] text-ink-soft">{label}</dt>
      <dd className="text-[12px] font-medium tabular-nums text-ink">{value}</dd>
    </div>
  )
}
