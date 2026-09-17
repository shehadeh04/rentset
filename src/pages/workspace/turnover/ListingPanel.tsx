import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, Eye } from '@phosphor-icons/react'
import { supabase } from '@/lib/supabase'
import { formatMoney } from '@/lib/format'
import { unitPhoto } from '@/lib/photos'
import { useToast } from '@/components/ui/Toast'
import type { ListingStatus } from '@/lib/database.types'

interface ListingRow {
  id: string
  headline: string
  description: string
  asking_rent: number | null
  status: ListingStatus
}

const statusTone: Record<ListingStatus, string> = {
  draft: 'state',
  published: 'state state-positive',
  leased: 'state state-brand',
}

export function ListingPanel({
  turnoverId,
  landlordId,
  unitId,
  unitLabel,
  propertyName,
}: {
  turnoverId: string
  landlordId: string
  unitId: string
  unitLabel: string
  propertyName: string
}) {
  const qc = useQueryClient()
  const toast = useToast()

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', turnoverId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('id, headline, description, asking_rent, status')
        .eq('turnover_id', turnoverId)
        .maybeSingle()
      if (error) throw error
      return data as ListingRow | null
    },
  })

  const [headline, setHeadline] = useState('')
  const [description, setDescription] = useState('')
  const [askingRent, setAskingRent] = useState('')

  useEffect(() => {
    if (listing) {
      setHeadline(listing.headline)
      setDescription(listing.description)
      setAskingRent(listing.asking_rent?.toString() ?? '')
    }
  }, [listing])

  const invalidate = () => qc.invalidateQueries({ queryKey: ['listing', turnoverId] })

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        headline,
        description,
        asking_rent: askingRent ? Number(askingRent) : null,
      }
      if (listing) {
        const { error } = await supabase.from('listings').update(payload).eq('id', listing.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('listings')
          .insert({ ...payload, turnover_id: turnoverId, landlord_id: landlordId })
        if (error) throw error
      }
    },
    onSuccess: () => {
      invalidate()
      toast(listing ? 'Listing saved' : 'Listing created')
    },
    onError: () => toast('Could not save the listing', 'error'),
  })

  const setStatus = useMutation({
    mutationFn: async (status: ListingStatus) => {
      const { error } = await supabase
        .from('listings')
        .update({ status, published_at: status === 'published' ? new Date().toISOString() : null })
        .eq('id', listing!.id)
      if (error) throw error
    },
    onSuccess: (_data, status) => {
      invalidate()
      toast(status === 'published' ? 'Listing published' : 'Listing moved back to draft')
    },
    onError: () => toast('Could not update the listing', 'error'),
  })

  if (isLoading) return null

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.2fr_1fr]">
      <form
        className="min-w-0 space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          save.mutate()
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="ws-section">Listing</h2>
            <p className="ws-meta mt-0.5">Write it while the work is still happening, so it is ready to go live.</p>
          </div>
          {listing && <span className={statusTone[listing.status]}>{listing.status[0].toUpperCase() + listing.status.slice(1)}</span>}
        </div>

        <div>
          <label className="input-label">Headline</label>
          <input
            className="input"
            placeholder="e.g. Sunny 2BR near downtown, in-unit laundry"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />
        </div>

        <div>
          <label className="input-label">Description</label>
          <textarea
            className="input min-h-36 resize-y"
            placeholder="What a renter would actually want to know: layout, parking, utilities, what is new."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="max-w-[12rem]">
          <label className="input-label">Asking rent</label>
          <input
            type="number"
            min="0"
            className="input"
            placeholder="$"
            value={askingRent}
            onChange={(e) => setAskingRent(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button type="submit" className="btn-primary btn-sm" disabled={save.isPending}>
            {save.isPending ? 'Saving…' : listing ? 'Save listing' : 'Create listing'}
          </button>

          {listing?.status === 'draft' && (
            <button
              type="button"
              className="btn-brand btn-sm"
              onClick={() => setStatus.mutate('published')}
              disabled={setStatus.isPending}
            >
              <Check size={14} weight="bold" /> Publish
            </button>
          )}
          {listing?.status === 'published' && (
            <button type="button" className="btn-ghost btn-sm" onClick={() => setStatus.mutate('draft')} disabled={setStatus.isPending}>
              Move back to draft
            </button>
          )}
        </div>
      </form>

      <aside className="min-w-0">
        <p className="ws-label flex items-center gap-1.5">
          <Eye size={12} /> Preview
        </p>
        <article className="mt-2.5 overflow-hidden rounded-lg border border-line bg-surface shadow-card">
          <img src={unitPhoto(unitId, 720, 440)} alt="" className="h-44 w-full object-cover" />
          <div className="p-4">
            <p className="text-[11px] text-ink-faint">
              {propertyName} · {unitLabel}
            </p>
            <h3 className="mt-1 text-[15px] font-semibold leading-snug text-ink">
              {headline || 'Your headline appears here'}
            </h3>
            <p className="mt-1.5 text-[15px] font-semibold tabular-nums text-ink">
              {askingRent ? `${formatMoney(Number(askingRent))}/mo` : 'Rent not set'}
            </p>
            <p className="mt-2.5 whitespace-pre-line text-[12px] leading-relaxed text-ink-soft">
              {description || 'The description you write will show up here, exactly as a renter would read it.'}
            </p>
          </div>
        </article>
      </aside>
    </div>
  )
}
