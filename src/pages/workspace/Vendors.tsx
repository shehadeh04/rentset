import { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EnvelopeSimple, MapPin, Phone, Plus, Wrench } from '@phosphor-icons/react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { useVendors, type VendorRow } from '@/lib/workspace-data'
import { marketingImages } from '@/lib/images'
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
    <div className="space-y-5">
      <section className="scene relative min-h-[42svh]">
        <img src={marketingImages.kitchen.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/45 to-ink/30" aria-hidden="true" />
        <div className="relative flex min-h-[42svh] flex-col justify-end p-5 sm:p-10">
          <p className="eyebrow text-white/50">Who you call</p>
          <h1 className="display-1 mt-4 text-white">Vendors</h1>
          <p className="lede mt-5 max-w-[44ch] text-white/75">
            {vendors && vendors.length > 0
              ? `${vendors.length} contact${vendors.length === 1 ? '' : 's'} you can assign turnover work to.`
              : 'The contractors and cleaners you assign turnover work to.'}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="btn-light" onClick={() => setAdding(true)}>
              Add vendor <Plus size={14} weight="bold" />
            </button>
            <button className="btn-glass" onClick={() => setSearching(true)}>
              <MapPin size={14} weight="bold" /> Find nearby
            </button>
          </div>
        </div>
      </section>

      {vendors && vendors.length > 0 && (
        <div className="px-2 py-6 sm:px-5">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, trade or number"
            className="input max-w-sm"
          />
        </div>
      )}

      {vendors?.length === 0 && (
        <section className="scene-navy px-5 py-20 text-center sm:px-10">
          <Wrench size={26} className="mx-auto text-white/50" />
          <h2 className="display-2 mt-6">No vendors yet</h2>
          <p className="lede mx-auto mt-5 max-w-[40ch] text-white/60">
            Add the people you actually call, then assign them to tasks inside a turnover.
          </p>
          <button className="btn-light mt-8" onClick={() => setAdding(true)}>
            Add vendor <Plus size={14} weight="bold" />
          </button>
        </section>
      )}

      {vendors && vendors.length > 0 && grouped.length === 0 && (
        <p className="px-5 py-16 text-center text-[15px] text-ink-faint">No vendor matches “{query}”.</p>
      )}

      {grouped.map(([trade, list]) => (
        <section key={trade} className="px-2 pb-10 sm:px-5">
          <h2 className="display-4 border-t border-line pt-6">
            {trade} <span className="ml-2 text-[14px] text-ink-faint">{list.length}</span>
          </h2>
          <ul className="mt-4">
            {list.map((vendor) => (
              <li key={vendor.id} className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line py-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-pill bg-ink text-[14px] font-medium uppercase text-white">
                  {vendor.name.slice(0, 2)}
                </span>
                <div className="min-w-[8rem] flex-1">
                  <p className="display-4 truncate">{vendor.name}</p>
                  <p className="mt-1 truncate text-[13px] text-ink-faint">{vendor.trade || 'General'}</p>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[14px]">
                  {vendor.phone && (
                    <a href={`tel:${vendor.phone}`} className="flex items-center gap-2 ws-link">
                      <Phone size={14} className="text-ink-faint" /> {vendor.phone}
                    </a>
                  )}
                  {vendor.email && (
                    <a href={`mailto:${vendor.email}`} className="flex items-center gap-2 ws-link">
                      <EnvelopeSimple size={14} className="text-ink-faint" /> {vendor.email}
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
