import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { formatDate, formatMoney } from '@/lib/format'
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

const categories: { key: TaskCategory; label: string; hint: string }[] = [
  {
    key: 'prep',
    label: 'Pre-move-out prep',
    hint: 'Get ahead of it during the notice period — before the unit is even empty.',
  },
  { key: 'inspection', label: 'Inspection', hint: 'Walk the unit and note what needs attention.' },
  { key: 'repair', label: 'Repairs', hint: 'Work that needs to happen before the unit is ready.' },
  { key: 'cleaning', label: 'Cleaning', hint: 'Getting the unit move-in ready.' },
  { key: 'vendor', label: 'Vendor visits', hint: 'Anything else you’re coordinating with a vendor.' },
  { key: 'listing', label: 'Listing prep', hint: 'Photos, description, and anything before it goes live.' },
]

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
  const [openForm, setOpenForm] = useState<TaskCategory | null>(null)

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

  return (
    <div className="mt-6 space-y-5">
      {categories.map((cat) => {
        const items = tasks?.filter((t) => t.category === cat.key) ?? []
        return (
          <div key={cat.key} className="card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium text-ink">{cat.label}</h3>
                <p className="text-sm text-ink-faint">{cat.hint}</p>
              </div>
              <button
                className="btn-ghost shrink-0 text-sm"
                onClick={() => setOpenForm(openForm === cat.key ? null : cat.key)}
              >
                Add
              </button>
            </div>

            {items.length > 0 && (
              <ul className="mt-4 divide-y divide-line border-t border-line">
                {items.map((task) => {
                  const vendor = vendors?.find((v) => v.id === task.vendor_id)
                  const nextStatus = statusOrder[(statusOrder.indexOf(task.status) + 1) % 3]
                  return (
                    <li key={task.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                      <div>
                        <p className="text-sm font-medium text-ink">{task.title}</p>
                        <p className="text-xs text-ink-faint">
                          {vendor && <span>{vendor.name}</span>}
                          {vendor && (task.due_date || task.cost) && <span className="mx-1.5">&middot;</span>}
                          {task.due_date && <span>Due {formatDate(task.due_date)}</span>}
                          {task.due_date && task.cost && <span className="mx-1.5">&middot;</span>}
                          {task.cost != null && <span>{formatMoney(task.cost)}</span>}
                        </p>
                      </div>
                      <button
                        className={`tag transition-colors ${statusStyle[task.status]}`}
                        onClick={() => cycleStatus.mutate({ taskId: task.id, next: nextStatus })}
                      >
                        {statusLabel[task.status]}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}

            {items.length === 0 && openForm !== cat.key && (
              <p className="mt-3 text-sm text-ink-faint">Nothing added yet.</p>
            )}

            {openForm === cat.key && (
              <AddTaskForm
                turnoverId={turnoverId}
                landlordId={landlordId}
                category={cat.key}
                vendors={vendors ?? []}
                onDone={() => setOpenForm(null)}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function AddTaskForm({
  turnoverId,
  landlordId,
  category,
  vendors,
  onDone,
}: {
  turnoverId: string
  landlordId: string
  category: TaskCategory
  vendors: VendorOption[]
  onDone: () => void
}) {
  const qc = useQueryClient()
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
      className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-line bg-paper p-4 sm:grid-cols-4"
      onSubmit={(e) => {
        e.preventDefault()
        mutation.mutate()
      }}
    >
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
      <div className="col-span-2 flex items-end gap-3 sm:col-span-4">
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
