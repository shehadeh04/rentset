import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

interface VendorRow {
  id: string
  name: string
  trade: string
  phone: string
  email: string
}

export default function Vendors() {
  const { user } = useAuth()
  const [adding, setAdding] = useState(false)

  const { data: vendors, isLoading } = useQuery({
    queryKey: ['vendors', user!.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('id, name, trade, phone, email')
        .eq('landlord_id', user!.id)
        .order('name', { ascending: true })
      if (error) throw error
      return data as VendorRow[]
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink">Vendors</h1>
          <p className="mt-1 text-sm text-ink-soft">
            The contractors and cleaners you assign work to during a turnover.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setAdding((v) => !v)}>
          Add vendor
        </button>
      </div>

      {adding && <AddVendorForm landlordId={user!.id} onDone={() => setAdding(false)} />}

      <div className="mt-8">
        {isLoading && <p className="text-sm text-ink-faint">Loading…</p>}

        {!isLoading && vendors?.length === 0 && !adding && (
          <div className="card flex flex-col items-start gap-3 p-10">
            <p className="font-medium text-ink">No vendors yet</p>
            <p className="text-sm text-ink-soft">
              Add the people you actually call for repairs, cleaning, and inspections.
            </p>
            <button className="btn-primary mt-1" onClick={() => setAdding(true)}>
              Add vendor
            </button>
          </div>
        )}

        {vendors && vendors.length > 0 && (
          <div className="card divide-y divide-line">
            {vendors.map((v) => (
              <div key={v.id} className="flex flex-wrap items-center justify-between gap-2 px-6 py-4">
                <div>
                  <p className="font-medium text-ink">{v.name}</p>
                  <p className="text-sm text-ink-faint">{v.trade || 'General'}</p>
                </div>
                <div className="text-sm text-ink-soft">
                  {v.phone && <span>{v.phone}</span>}
                  {v.phone && v.email && <span className="mx-2 text-line">&middot;</span>}
                  {v.email && <span>{v.email}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AddVendorForm({ landlordId, onDone }: { landlordId: string; onDone: () => void }) {
  const qc = useQueryClient()
  const [name, setName] = useState('')
  const [trade, setTrade] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('vendors').insert({
        landlord_id: landlordId,
        name,
        trade,
        phone,
        email,
      })
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vendors', landlordId] })
      onDone()
    },
  })

  return (
    <form
      className="card mt-6 grid gap-4 p-6 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault()
        mutation.mutate()
      }}
    >
      <div>
        <label className="field-label">Name</label>
        <input className="field-input" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label className="field-label">Trade</label>
        <input
          className="field-input"
          placeholder="e.g. Plumbing, Cleaning"
          value={trade}
          onChange={(e) => setTrade(e.target.value)}
        />
      </div>
      <div>
        <label className="field-label">Phone</label>
        <input className="field-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div>
        <label className="field-label">Email</label>
        <input
          type="email"
          className="field-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {mutation.isError && (
        <p className="sm:col-span-2 text-sm text-red-600">Couldn’t save that vendor. Try again.</p>
      )}
      <div className="flex gap-3 sm:col-span-2">
        <button type="submit" className="btn-primary" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving…' : 'Save vendor'}
        </button>
        <button type="button" className="btn-ghost" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  )
}
