import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check } from '@phosphor-icons/react'
import { useAllTasks, useCompleteTask, type TaskRow } from '@/lib/workspace-data'
import { addDays, todayISO } from '@/lib/format'
import { categoryLabels } from '@/lib/task-categories'
import { marketingImages } from '@/lib/images'
import { Skeleton } from '@/components/Skeleton'

type Range = 'week' | 'month' | 'all'

const ranges: { id: Range; label: string }[] = [
  { id: 'week', label: 'Next 7 days' },
  { id: 'month', label: 'Next 30 days' },
  { id: 'all', label: 'Everything' },
]

export default function Schedule() {
  const today = todayISO()
  const [range, setRange] = useState<Range>('month')
  const { data: tasks, isLoading } = useAllTasks()
  const completeTask = useCompleteTask()

  const open = useMemo(() => (tasks ?? []).filter((t) => t.status !== 'done' && t.due_date), [tasks])

  const overdue = useMemo(
    () => open.filter((t) => t.due_date! < today).sort((a, b) => (a.due_date! < b.due_date! ? -1 : 1)),
    [open, today]
  )

  const upcoming = useMemo(() => {
    const horizon = range === 'week' ? addDays(today, 7) : range === 'month' ? addDays(today, 30) : null
    const list = open.filter((t) => t.due_date! >= today && (horizon === null || t.due_date! <= horizon))
    const byDate = new Map<string, TaskRow[]>()
    for (const task of list.sort((a, b) => (a.due_date! < b.due_date! ? -1 : 1))) {
      const group = byDate.get(task.due_date!) ?? []
      group.push(task)
      byDate.set(task.due_date!, group)
    }
    return byDate
  }, [open, range, today])

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-[42svh] w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const hasAnything = overdue.length > 0 || upcoming.size > 0

  return (
    <div className="space-y-5">
      <section className="scene relative min-h-[42svh]">
        <img src={marketingImages.livingRoom.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/45 to-ink/30" aria-hidden="true" />
        <div className="relative flex min-h-[42svh] flex-col justify-end p-5 sm:p-10">
          <p className="eyebrow text-white/50">Every due date</p>
          <h1 className="display-1 mt-4 text-white">Schedule</h1>
          <p className="lede mt-5 max-w-[44ch] text-white/75">
            {open.length === 0
              ? 'Nothing with a due date is open.'
              : `${open.length} open task${open.length === 1 ? '' : 's'} across every unit.`}
          </p>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-end gap-3 px-2 py-6 sm:px-5">
        <div className="seg">
          {ranges.map((option) => (
            <button key={option.id} onClick={() => setRange(option.id)} className={`seg-item ${range === option.id ? 'seg-item-active' : ''}`}>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {!hasAnything && (
        <section className="scene-navy px-5 py-20 text-center sm:px-10">
          <h2 className="display-2">Nothing scheduled</h2>
          <p className="lede mx-auto mt-5 max-w-[40ch] text-white/60">
            Tasks with a due date show up here, grouped by the day they are due.
          </p>
        </section>
      )}

      {overdue.length > 0 && (
        <section className="scene-clay px-5 py-12 sm:px-10 sm:py-16">
          <p className="eyebrow text-white/45">Overdue</p>
          <h2 className="display-2 mt-5">
            {overdue.length} task{overdue.length === 1 ? '' : 's'} late
          </h2>
          <ul className="mt-10">
            {overdue.map((task) => (
              <li key={task.id} className="flex items-center gap-4 border-t border-white/15 py-4">
                <button
                  onClick={() => completeTask.mutate(task.id)}
                  aria-label={`Mark ${task.title} done`}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-pill border border-white/30 text-transparent transition-colors hover:border-white hover:bg-white hover:text-ink"
                >
                  <Check size={13} weight="bold" />
                </button>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[16px] tracking-tight2">{task.title}</span>
                  <span className="mt-1 block truncate text-[12px] text-white/55">
                    {categoryLabels[task.category]}
                    {task.turnover && ` · ${task.turnover.unit.property.name} · ${task.turnover.unit.unit_label}`}
                  </span>
                </span>
                {task.turnover && (
                  <Link to={`/app/turnovers/${task.turnover.id}`} className="btn-glass btn-sm shrink-0">
                    Open
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {upcoming.size > 0 && (
        <section className="px-2 pb-12 sm:px-5">
          {Array.from(upcoming.entries()).map(([date, dayTasks]) => {
            const parsed = new Date(date + 'T00:00:00')
            const isToday = date === today
            return (
              <div key={date} className="flex gap-6 border-t border-line py-8 sm:gap-12">
                <div className="w-20 shrink-0 sm:w-28">
                  <p className={`text-[11px] uppercase tracking-[0.14em] ${isToday ? 'text-ink' : 'text-ink-faint'}`}>
                    {isToday ? 'Today' : parsed.toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <p className="mt-2 text-[clamp(2.25rem,4vw,3.25rem)] leading-none tracking-display tabular-nums">
                    {parsed.getDate()}
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                    {parsed.toLocaleDateString('en-US', { month: 'short' })}
                  </p>
                </div>
                <ul className="min-w-0 flex-1">
                  {dayTasks.map((task) => (
                    <li key={task.id} className="flex items-center gap-4 border-b border-line py-4 last:border-b-0">
                      <button
                        onClick={() => completeTask.mutate(task.id)}
                        aria-label={`Mark ${task.title} done`}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-pill border border-line text-transparent transition-colors hover:border-ink hover:bg-ink hover:text-white"
                      >
                        <Check size={13} weight="bold" />
                      </button>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[16px] tracking-tight2">{task.title}</span>
                        <span className="mt-1 block truncate text-[12px] text-ink-faint">
                          {categoryLabels[task.category]}
                          {task.turnover && (
                            <>
                              {' · '}
                              <Link to={`/app/turnovers/${task.turnover.id}`} className="ws-link">
                                {task.turnover.unit.property.name} · {task.turnover.unit.unit_label}
                              </Link>
                            </>
                          )}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </section>
      )}
    </div>
  )
}
