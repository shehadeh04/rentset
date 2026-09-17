import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarBlank, Check, WarningCircle } from '@phosphor-icons/react'
import { useAllTasks, useCompleteTask, type TaskRow } from '@/lib/workspace-data'
import { addDays, todayISO } from '@/lib/format'
import { categoryLabels } from '@/lib/task-categories'
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

  const open = useMemo(
    () => (tasks ?? []).filter((t) => t.status !== 'done' && t.due_date),
    [tasks]
  )

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
      <div className="space-y-6">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const hasAnything = overdue.length > 0 || upcoming.size > 0

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="ws-title">Schedule</h1>
          <p className="mt-1 text-[13px] text-ink-soft">
            {open.length === 0
              ? 'Nothing with a due date is open.'
              : `${open.length} open task${open.length === 1 ? '' : 's'} with a due date across every unit.`}
          </p>
        </div>
        <div className="seg">
          {ranges.map((option) => (
            <button
              key={option.id}
              onClick={() => setRange(option.id)}
              className={`seg-item ${range === option.id ? 'seg-item-active' : ''}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {!hasAnything && (
        <div className="flex flex-col items-center rounded border border-line bg-surface px-6 py-16 text-center">
          <CalendarBlank size={24} className="text-ink-subtle" />
          <p className="mt-3 text-[13px] font-medium text-ink">Nothing scheduled</p>
          <p className="mt-1 max-w-xs text-[12px] text-ink-faint">
            Tasks with a due date show up here, grouped by the day they are due.
          </p>
        </div>
      )}

      {overdue.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-[13px] font-semibold text-critical-600">
            <WarningCircle size={15} weight="fill" /> Overdue
            <span className="font-normal text-ink-faint">{overdue.length}</span>
          </h2>
          <div className="mt-3 overflow-hidden rounded border border-critical-200">
            <ul className="divide-y divide-critical-200/60">
              {overdue.map((task) => (
                <TaskLine key={task.id} task={task} onComplete={() => completeTask.mutate(task.id)} tone="critical" />
              ))}
            </ul>
          </div>
        </section>
      )}

      {upcoming.size > 0 && (
        <section className="space-y-0">
          {Array.from(upcoming.entries()).map(([date, dayTasks]) => {
            const parsed = new Date(date + 'T00:00:00')
            const isToday = date === today
            return (
              <div key={date} className="flex gap-4 border-t border-line py-4 first:border-t-0 sm:gap-6">
                <div className="w-14 shrink-0 sm:w-20">
                  <p className={`text-[11px] font-semibold uppercase tracking-wide ${isToday ? 'text-ink' : 'text-ink-faint'}`}>
                    {isToday ? 'Today' : parsed.toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <p className={`text-[22px] font-semibold leading-tight tabular-nums ${isToday ? 'text-ink' : 'text-ink-soft'}`}>
                    {parsed.getDate()}
                  </p>
                  <p className="text-[11px] uppercase tracking-wide text-ink-faint">
                    {parsed.toLocaleDateString('en-US', { month: 'short' })}
                  </p>
                </div>
                <ul className="min-w-0 flex-1 divide-y divide-line">
                  {dayTasks.map((task) => (
                    <TaskLine key={task.id} task={task} onComplete={() => completeTask.mutate(task.id)} />
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

function TaskLine({ task, onComplete, tone }: { task: TaskRow; onComplete: () => void; tone?: 'critical' }) {
  return (
    <li className={`flex items-center gap-3 py-2.5 ${tone === 'critical' ? 'bg-critical-50 px-4' : ''}`}>
      <button
        onClick={onComplete}
        title="Mark done"
        aria-label={`Mark ${task.title} done`}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface text-transparent transition-colors hover:border-brand-500 hover:bg-brand-500 hover:text-white"
      >
        <Check size={11} weight="bold" />
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] text-ink">{task.title}</p>
        <p className="truncate text-[11px] text-ink-faint">
          {categoryLabels[task.category]}
          {task.turnover && (
            <>
              {' · '}
              <Link to={`/app/turnovers/${task.turnover.id}`} className="ws-link">
                {task.turnover.unit.property.name} · {task.turnover.unit.unit_label}
              </Link>
            </>
          )}
        </p>
      </div>
    </li>
  )
}
