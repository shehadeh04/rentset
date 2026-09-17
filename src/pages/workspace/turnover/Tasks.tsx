import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Circle, CircleHalf, Plus } from '@phosphor-icons/react'
import { supabase } from '@/lib/supabase'
import { formatDate, formatMoney, todayISO } from '@/lib/format'
import { categoryLabels } from '@/lib/task-categories'
import { useTurnoverTasks } from '@/lib/workspace-data'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import type { TaskCategory, TaskStatus } from '@/lib/database.types'

interface VendorOption {
  id: string
  name: string
}

const categoryOrder: TaskCategory[] = ['prep', 'inspection', 'repair', 'cleaning', 'vendor', 'listing']
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

export function Tasks({ turnoverId, landlordId }: { turnoverId: string; landlordId: string }) {
  const qc = useQueryClient()
  const today = todayISO()
  const [filter, setFilter] = useState<TaskCategory | 'all'>('all')
  const [adding, setAdding] = useState(false)

  const { data: tasks } = useTurnoverTasks(turnoverId)

  const { data: vendors } = useQuery({
    queryKey: ['vendors', landlordId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('id, name')
        .eq('landlord_id', landlordId)
        .order('name', { ascending: true })
      if (error) throw error
      return data as VendorOption[]
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['turnover_tasks', turnoverId] })
      qc.invalidateQueries({ queryKey: ['all_tasks'] })
    },
  })

  const sorted = useMemo(() => {
    if (!tasks) return []
    return [...tasks].sort((a, b) => {
      if (a.category !== b.category) return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
      if (a.due_date && b.due_date) return a.due_date < b.due_date ? -1 : 1
      if (a.due_date) return -1
      if (b.due_date) return 1
      return 0
    })
  }, [tasks])

  const counts = useMemo(() => {
    const map = new Map<TaskCategory | 'all', number>()
    map.set('all', sorted.length)
    for (const task of sorted) map.set(task.category, (map.get(task.category) ?? 0) + 1)
    return map
  }, [sorted])

  const visible = filter === 'all' ? sorted : sorted.filter((t) => t.category === filter)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {(['all', ...categoryOrder] as const).map((category) => {
            const count = counts.get(category) ?? 0
            if (category !== 'all' && count === 0) return null
            return (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`rounded px-2.5 py-1 text-[12px] font-medium transition-colors ${
                  filter === category ? 'bg-ink text-white' : 'text-ink-soft hover:bg-sunken'
                }`}
              >
                {category === 'all' ? 'All' : categoryLabels[category]}
                <span className={`ml-1.5 tabular-nums ${filter === category ? 'text-white/60' : 'text-ink-faint'}`}>{count}</span>
              </button>
            )
          })}
        </div>
        <button className="btn-secondary btn-sm" onClick={() => setAdding(true)}>
          <Plus size={14} weight="bold" /> Add task
        </button>
      </div>

      {visible.length === 0 ? (
        <p className="py-12 text-center text-[13px] text-ink-faint">
          {filter === 'all' ? 'No tasks on this turnover yet.' : 'Nothing in this category.'}
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded border border-line bg-surface">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-line">
                <th className="tbl-head w-10 px-3 py-2.5" aria-label="Status" />
                <th className="tbl-head px-3 py-2.5 text-left">Task</th>
                <th className="tbl-head px-3 py-2.5 text-left">Category</th>
                <th className="tbl-head px-3 py-2.5 text-left">Vendor</th>
                <th className="tbl-head px-3 py-2.5 text-left">Due</th>
                <th className="tbl-head px-3 py-2.5 text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {visible.map((task) => {
                const vendor = vendors?.find((v) => v.id === task.vendor_id)
                const next = statusOrder[(statusOrder.indexOf(task.status) + 1) % 3]
                const Icon = statusIcon[task.status]
                const isLate = task.status !== 'done' && task.due_date && task.due_date < today
                return (
                  <tr key={task.id} className="tbl-row">
                    <td className="px-3 py-2.5">
                      <button
                        onClick={() => cycleStatus.mutate({ taskId: task.id, next })}
                        title={`Mark ${next.replace('_', ' ')}`}
                        className={`transition-colors ${statusColor[task.status]}`}
                      >
                        <Icon size={16} weight={task.status === 'open' ? 'regular' : 'fill'} />
                      </button>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`text-[13px] ${task.status === 'done' ? 'text-ink-faint line-through' : 'text-ink'}`}>
                        {task.title}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[12px] text-ink-faint">{categoryLabels[task.category]}</td>
                    <td className="px-3 py-2.5 text-[12px] text-ink-soft">{vendor?.name ?? '—'}</td>
                    <td className={`px-3 py-2.5 text-[12px] tabular-nums ${isLate ? 'font-medium text-critical-600' : 'text-ink-soft'}`}>
                      {task.due_date ? formatDate(task.due_date) : '—'}
                    </td>
                    <td className="px-3 py-2.5 text-right text-[12px] tabular-nums text-ink-soft">
                      {task.cost != null ? formatMoney(task.cost) : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <AddTaskModal
        open={adding}
        onClose={() => setAdding(false)}
        turnoverId={turnoverId}
        landlordId={landlordId}
        defaultCategory={filter === 'all' ? 'prep' : filter}
        vendors={vendors ?? []}
      />
    </div>
  )
}

function AddTaskModal({
  open,
  onClose,
  turnoverId,
  landlordId,
  defaultCategory,
  vendors,
}: {
  open: boolean
  onClose: () => void
  turnoverId: string
  landlordId: string
  defaultCategory: TaskCategory
  vendors: VendorOption[]
}) {
  const qc = useQueryClient()
  const toast = useToast()
  const [category, setCategory] = useState<TaskCategory>(defaultCategory)
  const [title, setTitle] = useState('')
  const [vendorId, setVendorId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [cost, setCost] = useState('')

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('turnover_tasks').insert({
        turnover_id: turnoverId,
        landlord_id: landlordId,
        category,
        title,
        vendor_id: vendorId || null,
        due_date: dueDate || null,
        cost: cost ? Number(cost) : null,
      })
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['turnover_tasks', turnoverId] })
      qc.invalidateQueries({ queryKey: ['all_tasks'] })
      toast('Task added')
      setTitle('')
      setDueDate('')
      setCost('')
      setVendorId('')
      onClose()
    },
    onError: () => toast('Could not save that task', 'error'),
  })

  return (
    <Modal open={open} onClose={onClose} title="Add a task" description="It will show up on the timeline and the schedule.">
      <form
        id="add-task"
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault()
          mutation.mutate()
        }}
      >
        <div className="sm:col-span-2">
          <label className="input-label">Task</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus />
        </div>
        <div>
          <label className="input-label">Category</label>
          <select className="input" value={category} onChange={(e) => setCategory(e.target.value as TaskCategory)}>
            {categoryOrder.map((c) => (
              <option key={c} value={c}>
                {categoryLabels[c]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="input-label">Vendor</label>
          <select className="input" value={vendorId} onChange={(e) => setVendorId(e.target.value)} disabled={vendors.length === 0}>
            <option value="">{vendors.length === 0 ? 'No vendors saved' : 'None'}</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="input-label">Due date</label>
          <input type="date" className="input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <div>
          <label className="input-label">Cost</label>
          <input type="number" min="0" className="input" placeholder="$" value={cost} onChange={(e) => setCost(e.target.value)} />
        </div>
      </form>
      <div className="mt-5 flex items-center gap-3">
        <button type="submit" form="add-task" className="btn-primary btn-sm" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving…' : 'Add task'}
        </button>
        <button type="button" className="btn-ghost btn-sm" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  )
}
