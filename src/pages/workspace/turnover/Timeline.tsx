import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Circle, CircleHalf } from '@phosphor-icons/react'
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
const statusIcon: Record<TaskStatus, typeof Circle> = {
  open: Circle,
  in_progress: CircleHalf,
  done: CheckCircle,
}
const statusStyle: Record<TaskStatus, string> = {
  open: 'border border-line-strong text-ink-soft',
  in_progress: 'bg-caution-50 text-caution-700',
  done: 'bg-positive-50 text-positive-700',
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
    <div className="panel p-6">
      <h3 className="text-lg font-medium text-ink">Timeline</h3>
      <p className="text-sm text-ink-faint">What is due, day by day.</p>

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
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isToday ? 'bg-ink text-white' : isPast ? 'bg-ink text-white' : 'border-2 border-line-strong text-ink-faint'
                  }`}
                >
                  {i + 1}
                </div>
                {i < dates.length - 1 && <div className="w-px flex-1 bg-line" style={{ minHeight: '1.25rem' }} />}
              </div>
              <div className="pb-6">
                <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                  {offset !== null ? dayLabel(offset) : formatDate(date)}
                  <span className="font-normal text-ink-faint">{offset !== null ? formatDate(date) : ''}</span>
                  {isToday && <span className="badge-positive">Today</span>}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {dayTasks.map((task) => {
                    const nextStatus = statusOrder[(statusOrder.indexOf(task.status) + 1) % 3]
                    const StatusIcon = statusIcon[task.status]
                    return (
                      <li key={task.id} className="flex flex-wrap items-center gap-2">
                        <button
                          className={`badge transition-colors ${statusStyle[task.status]}`}
                          onClick={() => cycleStatus.mutate({ taskId: task.id, next: nextStatus })}
                        >
                          <StatusIcon size={12} weight={task.status === 'open' ? 'bold' : 'fill'} />
                          {statusLabel[task.status]}
                        </button>
                        <span className={`text-sm ${task.status === 'done' ? 'text-ink-faint line-through' : 'text-ink'}`}>
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
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">No date set</p>
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
