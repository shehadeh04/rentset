import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { daysBetween, formatDate, todayISO } from '@/lib/format'
import { categoryLabels } from '@/lib/task-categories'
import type { TaskCategory, TaskStatus } from '@/lib/database.types'

interface TaskRow {
  id: string
  category: TaskCategory
  title: string
  status: TaskStatus
  due_date: string | null
}

const statusOrder: TaskStatus[] = ['open', 'in_progress', 'done']
const statusStyle: Record<TaskStatus, string> = {
  open: 'border border-line bg-white text-ink-soft',
  in_progress: 'bg-clay-100 text-clay-600',
  done: 'bg-brand-50 text-brand-700',
}
const statusLabel: Record<TaskStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  done: 'Done',
}

function dayLabel(offset: number) {
  if (offset === 0) return 'Move-out day'
  return offset > 0 ? `Day ${offset}` : `Day −${Math.abs(offset)}`
}

export function Timeline({ turnoverId, moveOutDate }: { turnoverId: string; moveOutDate: string | null }) {
  const qc = useQueryClient()
  const today = todayISO()

  const { data: tasks } = useQuery({
    queryKey: ['turnover_tasks', turnoverId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('turnover_tasks')
        .select('id, category, title, status, due_date')
        .eq('turnover_id', turnoverId)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data as TaskRow[]
    },
  })

  const cycleStatus = useMutation({
    mutationFn: async ({ taskId, next }: { taskId: string; next: TaskStatus }) => {
      const { error } = await supabase
        .from('turnover_tasks')
        .update({ status: next, completed_at: next === 'done' ? new Date().toISOString() : null })
        .eq('id', taskId)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['turnover_tasks', turnoverId] }),
  })

  if (!tasks) return null

  const scheduled = tasks.filter((t) => t.due_date)
  const unscheduled = tasks.filter((t) => !t.due_date)

  const byDate = new Map<string, TaskRow[]>()
  for (const t of scheduled) {
    const list = byDate.get(t.due_date!) ?? []
    list.push(t)
    byDate.set(t.due_date!, list)
  }
  const dates = Array.from(byDate.keys()).sort()

  if (dates.length === 0 && unscheduled.length === 0) return null

  return (
    <div className="card mt-6 p-6">
      <h3 className="font-medium text-ink">Timeline</h3>
      <p className="text-sm text-ink-faint">What’s due, day by day.</p>

      <ol className="mt-5 space-y-0">
        {dates.map((date, i) => {
          const dayTasks = byDate.get(date)!
          const offset = moveOutDate ? daysBetween(moveOutDate, date) : null
          const isToday = date === today
          const isPast = date < today

          return (
            <li key={date} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    isToday
                      ? 'bg-brand-700 text-white'
                      : isPast
                        ? 'bg-brand-50 text-brand-700'
                        : 'border border-line bg-white text-ink-faint'
                  }`}
                >
                  {i + 1}
                </div>
                {i < dates.length - 1 && (
                  <div className="w-px flex-1 bg-line" style={{ minHeight: '1.25rem' }} />
                )}
              </div>
              <div className="pb-6">
                <p className="text-sm font-medium text-ink">
                  {offset !== null ? dayLabel(offset) : formatDate(date)}
                  <span className="ml-2 font-normal text-ink-faint">
                    {offset !== null ? formatDate(date) : ''}
                  </span>
                  {isToday && (
                    <span className="ml-2 rounded-full bg-brand-700 px-2 py-0.5 text-xs font-medium text-white">
                      Today
                    </span>
                  )}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {dayTasks.map((task) => {
                    const nextStatus = statusOrder[(statusOrder.indexOf(task.status) + 1) % 3]
                    return (
                      <li key={task.id} className="flex flex-wrap items-center gap-2">
                        <button
                          className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${statusStyle[task.status]}`}
                          onClick={() => cycleStatus.mutate({ taskId: task.id, next: nextStatus })}
                        >
                          {statusLabel[task.status]}
                        </button>
                        <span
                          className={`text-sm ${task.status === 'done' ? 'text-ink-faint line-through' : 'text-ink'}`}
                        >
                          {task.title}
                        </span>
                        <span className="text-xs text-ink-faint">{categoryLabels[task.category]}</span>
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
          <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">No date set</p>
          <ul className="mt-2 space-y-1.5">
            {unscheduled.map((task) => (
              <li key={task.id} className="flex items-center gap-2 text-sm text-ink-soft">
                <span>{task.title}</span>
                <span className="text-xs text-ink-faint">{categoryLabels[task.category]}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
