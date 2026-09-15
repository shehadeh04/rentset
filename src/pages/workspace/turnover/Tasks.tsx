import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { formatDate, formatMoney } from '@/lib/format'
import { categoryLabels } from '@/lib/task-categories'
import type { TaskCategory, TaskStatus } from '@/lib/database.types'

interface TaskRow {
  id: string
  category: TaskCategory
  title: string
  status: TaskStatus
  vendor_id: string | null
  scheduled_date: string | null
  due_date: string | null
  cost: number | null
}

interface VendorOption {
  id: string
  name: string
}

const categoryOrder: TaskCategory[] = ['prep', 'inspection', 'repair', 'cleaning', 'vendor', 'listing']
const statusOrder: TaskStatus[] = ['open', 'in_progress', 'done']
const statusLabel: Record<TaskStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  done: 'Done',
}
const statusStyle: Record<TaskStatus, string> = {
  open: 'border border-ink/15 text-ink-soft',
  in_progress: 'bg-brand-50 text-brand-700',
  done: 'bg-ink text-white',
}

export function Tasks({ turnoverId, landlordId }: { turnoverId: string; landlordId: string }) {
  const qc = useQueryClient()
  const [filter, setFilter] = useState<TaskCategory | 'all'>('all')
  const [adding, setAdding] = useState(false)

  const { data: tasks } = useQuery({
    queryKey: ['turnover_tasks', turnoverId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('turnover_tasks')
        .select('id, category, title, status, vendor_id, scheduled_date, due_date, cost')
        .eq('turnover_id', turnoverId)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data as TaskRow[]
    },
  })

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
    onSuccess: () => qc.invalidateQueries({ queryKey: ['turnover_tasks', turnoverId] }),
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

  const visible = filter === 'all' ? sorted : sorted.filter((t) => t.category === filter)

  return (
    <div className="card mt-6 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-6">
        <h2 className="font-semibold text-ink">Tasks</h2>
        <button className="btn-secondary py-1.5 text-sm" onClick={() => setAdding((v) => !v)}>
          {adding ? 'Cancel' : 'Add task'}
        </button>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-line px-4 py-2 sm:px-6">
        {(['all', ...categoryOrder] as const).map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              filter === c ? 'bg-ink text-white' : 'text-ink-soft hover:bg-ink/5'
            }`}
          >
            {c === 'all' ? 'All' : categoryLabels[c]}
          </button>
        ))}
      </div>

      {adding && (
        <AddTaskForm
          turnoverId={turnoverId}
          landlordId={landlordId}
          defaultCategory={filter === 'all' ? 'prep' : filter}
          vendors={vendors ?? []}
          onDone={() => setAdding(false)}
        />
      )}

      {visible.length === 0 && !adding && (
        <p className="px-4 py-8 text-center text-sm text-ink-faint sm:px-6">
          {filter === 'all' ? 'No tasks yet.' : `No ${categoryLabels[filter].toLowerCase()} tasks yet.`}
        </p>
      )}

      {visible.length > 0 && (
        <ul className="divide-y divide-line">
          {visible.map((task) => {
            const vendor = vendors?.find((v) => v.id === task.vendor_id)
            const nextStatus = statusOrder[(statusOrder.indexOf(task.status) + 1) % 3]
            return (
              <li key={task.id} className="flex items-center gap-3 px-4 py-3 sm:px-6">
                <span className="tag hidden shrink-0 border border-ink/15 text-ink-faint sm:inline-flex">
                  {categoryLabels[task.category]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-medium ${task.status === 'done' ? 'text-ink-faint line-through' : 'text-ink'}`}>
                    {task.title}
                  </p>
                  <p className="truncate text-xs text-ink-faint sm:hidden">{categoryLabels[task.category]}</p>
                  {(vendor || task.due_date || task.cost != null) && (
                    <p className="truncate text-xs text-ink-faint">
                      {vendor && <span>{vendor.name}</span>}
                      {vendor && (task.due_date || task.cost != null) && <span className="mx-1.5">&middot;</span>}
                      {task.due_date && <span>Due {formatDate(task.due_date)}</span>}
                      {task.due_date && task.cost != null && <span className="mx-1.5">&middot;</span>}
                      {task.cost != null && <span>{formatMoney(task.cost)}</span>}
                    </p>
                  )}
                </div>
                <button
                  className={`tag shrink-0 transition-colors ${statusStyle[task.status]}`}
                  onClick={() => cycleStatus.mutate({ taskId: task.id, next: nextStatus })}
                >
                  {statusLabel[task.status]}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function AddTaskForm({
  turnoverId,
  landlordId,
  defaultCategory,
  vendors,
  onDone,
}: {
  turnoverId: string
  landlordId: string
  defaultCategory: TaskCategory
  vendors: VendorOption[]
  onDone: () => void
}) {
  const qc = useQueryClient()
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
      onDone()
    },
  })

  return (
    <form
      className="grid grid-cols-2 gap-3 border-b border-line bg-paper px-4 py-4 sm:grid-cols-5 sm:px-6"
      onSubmit={(e) => {
        e.preventDefault()
        mutation.mutate()
      }}
    >
      <div className="col-span-2 sm:col-span-1">
        <label className="field-label">Category</label>
        <select
          className="field-input"
          value={category}
          onChange={(e) => setCategory(e.target.value as TaskCategory)}
        >
          {categoryOrder.map((c) => (
            <option key={c} value={c}>
              {categoryLabels[c]}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-2 sm:col-span-1">
        <label className="field-label">Task</label>
        <input className="field-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      {vendors.length > 0 && (
        <div>
          <label className="field-label">Vendor</label>
          <select className="field-input" value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
            <option value="">None</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label className="field-label">Due date</label>
        <input
          type="date"
          className="field-input"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      <div>
        <label className="field-label">Cost</label>
        <input
          type="number"
          min="0"
          className="field-input"
          placeholder="$"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
        />
      </div>
      <div className="col-span-2 flex items-end gap-3 sm:col-span-5">
        <button type="submit" className="btn-primary" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving…' : 'Add task'}
        </button>
        <button type="button" className="btn-ghost" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  )
}
