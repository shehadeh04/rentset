import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { ListingStatus } from '@/lib/database.types'

interface ListingRow {
  id: string
  headline: string
  description: string
  asking_rent: number | null
  status: ListingStatus
}

const statusStyle: Record<ListingStatus, string> = {
  draft: 'border border-ink/15 text-ink-soft',
  published: 'bg-brand-50 text-brand-700',
  leased: 'bg-ink text-white',
}

export function ListingPanel({ turnoverId, landlordId }: { turnoverId: string; landlordId: string }) {
  const qc = useQueryClient()

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

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('listings').insert({
        turnover_id: turnoverId,
        landlord_id: landlordId,
        headline,
        description,
        asking_rent: askingRent ? Number(askingRent) : null,
      })
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['listing', turnoverId] }),
  })

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('listings')
        .update({
          headline,
          description,
          asking_rent: askingRent ? Number(askingRent) : null,
        })
        .eq('id', listing!.id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['listing', turnoverId] }),
  })

  const setStatus = useMutation({
    mutationFn: async (status: ListingStatus) => {
      const { error } = await supabase
        .from('listings')
        .update({ status, published_at: status === 'published' ? new Date().toISOString() : null })
        .eq('id', listing!.id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['listing', turnoverId] }),
  })

  if (isLoading) return null

  return (
    <div className="card mt-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-medium text-ink">Listing</h3>
          <p className="text-sm text-ink-faint">
            Draft it while the unit is being turned so it’s ready to publish.
          </p>
        </div>
        {listing && (
          <span className={`tag shrink-0 ${statusStyle[listing.status]}`}>
            {listing.status[0].toUpperCase() + listing.status.slice(1)}
          </span>
        )}
      </div>

      <form
        className="mt-4 space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          listing ? save.mutate() : create.mutate()
        }}
      >
        <div>
          <label className="field-label">Headline</label>
          <input
            className="field-input"
            placeholder="e.g. Sunny 2BR near downtown, in-unit laundry"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">Description</label>
          <textarea
            className="field-input min-h-28 resize-y"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="max-w-xs">
          <label className="field-label">Asking rent</label>
          <input
            type="number"
            min="0"
            className="field-input"
            placeholder="$"
            value={askingRent}
            onChange={(e) => setAskingRent(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="submit"
            className="btn-primary"
            disabled={create.isPending || save.isPending}
          >
            {listing
              ? save.isPending
                ? 'Saving…'
                : 'Save listing'
              : create.isPending
                ? 'Creating…'
                : 'Create listing'}
          </button>

          {listing?.status === 'draft' && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setStatus.mutate('published')}
              disabled={setStatus.isPending}
            >
              Publish
            </button>
          )}
          {listing?.status === 'published' && (
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setStatus.mutate('draft')}
              disabled={setStatus.isPending}
            >
              Unpublish
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
