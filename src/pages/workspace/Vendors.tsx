import { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EnvelopeSimple, MapPin, Phone, Plus, Wrench } from '@phosphor-icons/react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { useVendors, type VendorRow } from '@/lib/workspace-data'
import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/Skeleton'
import { useToast } from '@/components/ui/Toast'
import { NearbyVendorSearch } from './NearbyVendorSearch'

export default function Vendors() {
  const { user } = useAuth()
  const { data: vendors, isLoading } = useVendors()
  const [query, setQuery] = useState('')
  const [adding, setAdding] = useState(false)
  const [searching, setSearching] = useState(false)

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = (vendors ?? []).filter((v) => `${v.name} ${v.trade} ${v.phone} ${v.email}`.toLowerCase().includes(q))
    const map = new Map<string, VendorRow[]>()
    for (const vendor of filtered) {
      const trade = vendor.trade.trim() || 'General'
      const list = map.get(trade) ?? []
      list.push(vendor)
      map.set(trade, list)
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [vendors, query])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-56 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="ws-title">Vendors</h1>
          <p className="mt-1 text-[13px] text-ink-soft">
            {vendors && vendors.length > 0
              ? `${vendors.length} contact${vendors.length === 1 ? '' : 's'} you can assign turnover work to.`
              : 'The contractors and cleaners you assign turnover work to.'}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button className="btn-secondary btn-sm" onClick={() => setSearching(true)}>
            <MapPin size={14} weight="bold" /> Find nearby
          </button>
          <button className="btn-primary btn-sm" onClick={() => setAdding(true)}>
            <Plus size={14} weight="bold" /> Add vendor
          </button>
        </div>
      </div>

      {vendors && vendors.length > 0 && (
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, trade or number"
          className="input h-[34px] max-w-xs py-1"
        />
      )}

      {vendors?.length === 0 && (
        <div className="flex flex-col items-center rounded border border-line bg-surface px-6 py-16 text-center">
          <Wrench size={24} className="text-ink-subtle" />
          <p className="mt-3 text-[13px] font-medium text-ink">No vendors yet</p>
          <p className="mt-1 max-w-xs text-[12px] text-ink-faint">
            Add the people you actually call, then assign them to tasks inside a turnover.
          </p>
          <button className="btn-primary btn-sm mt-5" onClick={() => setAdding(true)}>
            <Plus size={14} weight="bold" /> Add vendor
          </button>
        </div>
      )}

      {vendors && vendors.length > 0 && grouped.length === 0 && (
        <p className="rounded border border-line bg-surface px-4 py-10 text-center text-[13px] text-ink-faint">
          No vendor matches “{query}”.
        </p>
      )}

      {grouped.map(([trade, list]) => (
        <section key={trade}>
          <h2 className="ws-label border-b border-line pb-2">
            {trade} <span className="ml-1 text-ink-subtle">{list.length}</span>
          </h2>
          <ul className="divide-y divide-line">
            {list.map((vendor) => (
              <li key={vendor.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-sunken text-[12px] font-semibold uppercase text-ink-soft">
                  {vendor.name.slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-ink">{vendor.name}</p>
                  <p className="truncate text-[11px] text-ink-faint">{vendor.trade || 'General'}</p>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px]">
                  {vendor.phone && (
                    <a href={`tel:${vendor.phone}`} className="flex items-center gap-1.5 ws-link">
                      <Phone size={13} className="text-ink-faint" /> {vendor.phone}
                    </a>
                  )}
                  {vendor.email && (
                    <a href={`mailto:${vendor.email}`} className="flex items-center gap-1.5 ws-link">
                      <EnvelopeSimple size={13} className="text-ink-faint" /> {vendor.email}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <AddVendorModal open={adding} onClose={() => setAdding(false)} landlordId={user!.id} />
      <NearbyVendorSearch open={searching} onClose={() => setSearching(false)} />
    </div>
  )
}

function AddVendorModal({ open, onClose, landlordId }: { open: boolean; onClose: () => void; landlordId: string }) {
  const qc = useQueryClient()
  const toast = useToast()
  const [name, setName] = useState('')
  const [trade, setTrade] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('vendors').insert({ landlord_id: landlordId, name, trade, phone, email })
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vendors', landlordId] })
      toast('Vendor added')
      setName('')
      setTrade('')
      setPhone('')
      setEmail('')
      onClose()
    },
    onError: () => toast('Could not save that vendor', 'error'),
  })

  return (
    <Modal open={open} onClose={onClose} title="Add a vendor" description="Someone you can assign turnover tasks to." width="sm">
      <form
        id="add-vendor"
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          mutation.mutate()
        }}
      >
        <div>
          <label className="input-label">Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="input-label">Trade</label>
          <input className="input" placeholder="e.g. Plumbing, Cleaning" value={trade} onChange={(e) => setTrade(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="input-label">Phone</label>
            <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="input-label">Email</label>
            <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
      </form>
      <div className="mt-5 flex items-center gap-3">
        <button type="submit" form="add-vendor" className="btn-primary btn-sm" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving…' : 'Save vendor'}
        </button>
        <button type="button" className="btn-ghost btn-sm" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  )
}
