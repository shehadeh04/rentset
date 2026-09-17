import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MapPin, Phone, Plus, Wrench, EnvelopeSimple, WarningCircle } from '@phosphor-icons/react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { EmptyState } from '@/components/EmptyState'
import { SkeletonPanel } from '@/components/Skeleton'
import { NearbyVendorSearch } from './NearbyVendorSearch'

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
  const [searching, setSearching] = useState(false)

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-ink">Vendors</h1>
          <p className="mt-1 text-sm text-ink-soft">The contractors and cleaners you assign work to during a turnover.</p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button
            className="btn-secondary"
            onClick={() => {
              setSearching((v) => !v)
              setAdding(false)
            }}
          >
            <MapPin size={16} weight="bold" />
            Find nearby
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              setAdding((v) => !v)
              setSearching(false)
            }}
          >
            <Plus size={16} weight="bold" />
            Add vendor
          </button>
        </div>
      </div>

      {searching && <NearbyVendorSearch onDone={() => setSearching(false)} />}

      {adding && <AddVendorForm landlordId={user!.id} onDone={() => setAdding(false)} />}

      <div className="mt-8">
        {isLoading && <SkeletonPanel rows={4} columns={2} />}

        {!isLoading && vendors?.length === 0 && !adding && (
          <EmptyState
            icon={Wrench}
            title="No vendors yet"
            body="Add the people you actually call for repairs, cleaning, and inspections."
            action={
              <button className="btn-primary mt-1" onClick={() => setAdding(true)}>
                <Plus size={16} weight="bold" />
                Add vendor
              </button>
            }
          />
        )}

        {vendors && vendors.length > 0 && (
          <div className="panel divide-y divide-line">
            {vendors.map((v) => (
              <div key={v.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 sm:px-6">
                <div>
                  <p className="font-medium text-ink">{v.name}</p>
                  <p className="text-sm text-ink-faint">{v.trade || 'General'}</p>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-soft">
                  {v.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone size={14} weight="bold" className="text-ink-faint" /> {v.phone}
                    </span>
                  )}
                  {v.email && (
                    <span className="flex items-center gap-1.5">
                      <EnvelopeSimple size={14} weight="bold" className="text-ink-faint" /> {v.email}
                    </span>
                  )}
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
      className="panel mt-6 grid animate-fade-in gap-4 p-6 sm:grid-cols-2"
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
        <input type="email" className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      {mutation.isError && (
        <p className="field-error sm:col-span-2">
          <WarningCircle size={14} weight="fill" /> Could not save that vendor. Try again.
        </p>
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
