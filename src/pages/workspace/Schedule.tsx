import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { formatDate } from '@/lib/format'
import { Link } from 'react-router-dom'
import type { TaskCategory, TaskStatus } from '@/lib/database.types'

interface ScheduledTask {
  id: string
  title: string
  category: TaskCategory
  status: TaskStatus
  due_date: string
  turnover: {
    id: string
    unit: { unit_label: string; property: { name: string } }
  }
}

const categoryLabel: Record<TaskCategory, string> = {
  prep: 'Pre-move-out prep',
  inspection: 'Inspection',
  repair: 'Repair',
  cleaning: 'Cleaning',
  vendor: 'Vendor visit',
  listing: 'Listing prep',
}

function dueGroup(dueDate: string): 'Overdue' | 'This week' | 'Later' {
  const due = new Date(dueDate + 'T00:00:00').getTime()
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const days = Math.round((due - now.getTime()) / (1000 * 60 * 60 * 24))
  if (days < 0) return 'Overdue'
  if (days <= 7) return 'This week'
  return 'Later'
}

export default function Schedule() {
  const { user } = useAuth()
  const qc = useQueryClient()

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['schedule', user!.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('turnover_tasks')
        .select(
          'id, title, category, status, due_date, turnover:turnovers(id, unit:units(unit_label, property:properties(name)))'
        )
        .eq('landlord_id', user!.id)
        .not('due_date', 'is', null)
        .neq('status', 'done')
        .order('due_date', { ascending: true })
      if (error) throw error
      return data as unknown as ScheduledTask[]
    },
  })

  const markDone = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('turnover_tasks')
        .update({ status: 'done', completed_at: new Date().toISOString() })
        .eq('id', taskId)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['schedule', user!.id] }),
  })

  const groups: Record<string, ScheduledTask[]> = { Overdue: [], 'This week': [], Later: [] }
  tasks?.forEach((t) => groups[dueGroup(t.due_date)].push(t))

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Schedule</h1>
      <p className="mt-1 text-sm text-ink-soft">Everything with a due date, across every unit.</p>

      <div className="mt-8 space-y-8">
        {isLoading && <p className="text-sm text-ink-faint">Loading…</p>}

        {!isLoading && tasks?.length === 0 && (
          <div className="card p-10">
            <p className="font-medium text-ink">Nothing scheduled</p>
            <p className="mt-1 text-sm text-ink-soft">
              Add due dates to tasks inside a turnover and they’ll show up here.
            </p>
          </div>
        )}

        {(['Overdue', 'This week', 'Later'] as const).map((label) =>
          groups[label].length > 0 ? (
            <div key={label}>
              <h2
                className={`text-sm font-medium ${label === 'Overdue' ? 'text-red-600' : 'text-ink-soft'}`}
              >
                {label}
              </h2>
              <div className="card mt-3 divide-y divide-line">
                {groups[label].map((task) => (
                  <div key={task.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-ink">{task.title}</p>
                      <p className="text-xs text-ink-faint">
                        {categoryLabel[task.category]} &middot;{' '}
                        <Link
                          to={`/app/turnovers/${task.turnover.id}`}
                          className="hover:text-ink-soft hover:underline"
                        >
                          {task.turnover.unit.property.name} &middot; {task.turnover.unit.unit_label}
                        </Link>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-ink-faint">{formatDate(task.due_date)}</span>
                      <button
                        className="btn-secondary py-1.5 text-sm"
                        onClick={() => markDone.mutate(task.id)}
                        disabled={markDone.isPending}
                      >
                        Mark done
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  )
}
