import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Circle, CircleHalf } from '@phosphor-icons/react'
import { supabase } from '@/lib/supabase'
import { daysBetween, formatDate, todayISO } from '@/lib/format'
import { categoryLabels } from '@/lib/task-categories'
import { useTurnoverTasks, type TurnoverTaskRow } from '@/lib/workspace-data'
import type { TaskStatus } from '@/lib/database.types'

const statusOrder: TaskStatus[] = ['open', 'in_progress', 'done']
const statusIcon: Record<TaskStatus, typeof Circle> = {
  open: Circle,
  in_progress: CircleHalf,
  done: CheckCircle,
}
const statusColor: Record<TaskStatus, string> = {
  open: 'text-ink-subtle hover:text-ink-soft',
  in_progress: 'text-caution-500',
  done: 'text-brand-500',
}

function dayLabel(offset: number) {
  if (offset === 0) return 'Move-out day'
  return offset > 0 ? `Day ${offset}` : `Day −${Math.abs(offset)}`
}

export function Timeline({ turnoverId, moveOutDate }: { turnoverId: string; moveOutDate: string | null }) {
  const qc = useQueryClient()
  const today = todayISO()

  const { data: tasks } = useTurnoverTasks(turnoverId)

  const cycleStatus = useMutation({
    mutationFn: async ({ taskId, next }: { taskId: string; next: TaskStatus }) => {
      const { error } = await supabase
        .from('turnover_tasks')
        .update({ status: next, completed_at: next === 'done' ? new Date().toISOString() : null })
        .eq('id', taskId)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['turnover_tasks', turnoverId] })
      qc.invalidateQueries({ queryKey: ['all_tasks'] })
    },
  })

  if (!tasks) return null

  const scheduled = tasks.filter((t) => t.due_date)
  const unscheduled = tasks.filter((t) => !t.due_date)

  const byDate = new Map<string, TurnoverTaskRow[]>()
  for (const task of scheduled) {
    const list = byDate.get(task.due_date!) ?? []
    list.push(task)
    byDate.set(task.due_date!, list)
  }
  const dates = Array.from(byDate.keys()).sort()

  if (dates.length === 0 && unscheduled.length === 0) {
    return <p className="py-10 text-center text-[13px] text-ink-faint">Nothing scheduled on this turnover yet.</p>
  }

  return (
    <div className="max-w-3xl">
      <p className="ws-meta">
        Every task by the day it is due, counted from move-out. Click a status to move it along.
      </p>

      <ol className="mt-5">
        {dates.map((date, i) => {
          const dayTasks = byDate.get(date)!
          const offset = moveOutDate ? daysBetween(moveOutDate, date) : null
          const isToday = date === today
          const isPast = date < today
          const allDone = dayTasks.every((t) => t.status === 'done')

          return (
            <li key={date} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition-colors ${
                    allDone
                      ? 'border-brand-500 bg-brand-500 text-white'
                      : isToday
                        ? 'border-ink bg-ink text-white'
                        : isPast
                          ? 'border-critical-200 bg-critical-50 text-critical-600'
                          : 'border-line-strong bg-surface text-ink-faint'
                  }`}
                >
                  {i + 1}
                </span>
                {i < dates.length - 1 && <span className="w-px flex-1 bg-line" style={{ minHeight: '1rem' }} />}
              </div>

              <div className="min-w-0 flex-1 pb-7">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <h3 className="text-[13px] font-semibold text-ink">
                    {offset !== null ? dayLabel(offset) : formatDate(date)}
                  </h3>
                  {offset !== null && <span className="text-[12px] text-ink-faint">{formatDate(date)}</span>}
                  {isToday && (
                    <span className="rounded-sm bg-ink px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Today
                    </span>
                  )}
                </div>

                <ul className="mt-2 space-y-1.5">
                  {dayTasks.map((task) => {
                    const next = statusOrder[(statusOrder.indexOf(task.status) + 1) % 3]
                    const Icon = statusIcon[task.status]
                    return (
                      <li key={task.id} className="flex items-start gap-2.5">
                        <button
                          onClick={() => cycleStatus.mutate({ taskId: task.id, next })}
                          title={`Mark ${next.replace('_', ' ')}`}
                          className={`mt-0.5 shrink-0 transition-colors ${statusColor[task.status]}`}
                        >
                          <Icon size={15} weight={task.status === 'open' ? 'regular' : 'fill'} />
                        </button>
                        <span className="min-w-0 flex-1">
                          <span
                            className={`block text-[13px] leading-snug ${
                              task.status === 'done' ? 'text-ink-faint line-through' : 'text-ink'
                            }`}
                          >
                            {task.title}
                          </span>
                          <span className="block text-[11px] text-ink-faint">{categoryLabels[task.category]}</span>
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </li>
          )
        })}
      </ol>

      {unscheduled.length > 0 && (
        <div className="mt-2 border-t border-line pt-4">
          <p className="ws-label">No date set</p>
          <ul className="mt-2 space-y-1.5">
            {unscheduled.map((task) => (
              <li key={task.id} className="flex items-center gap-2 text-[13px] text-ink-soft">
                {task.title}
                <span className="text-[11px] text-ink-faint">{categoryLabels[task.category]}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
