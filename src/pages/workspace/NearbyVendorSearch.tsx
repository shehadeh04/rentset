import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { searchNearbyVendors, type NearbyVendor } from '@/lib/places'

export function NearbyVendorSearch({ landlordId, onDone }: { landlordId: string; onDone: () => void }) {
  const qc = useQueryClient()
  const [trade, setTrade] = useState('')
  const [location, setLocation] = useState('')
  const [results, setResults] = useState<NearbyVendor[] | null>(null)
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())

  async function runSearch(e: React.FormEvent) {
    e.preventDefault()
    setSearching(true)
    setSearchError(null)
    try {
      const found = await searchNearbyVendors(trade, location)
      setResults(found)
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Search failed. Try again.')
    } finally {
      setSearching(false)
    }
  }

  const addVendor = useMutation({
    mutationFn: async (place: NearbyVendor) => {
      const { error } = await supabase.from('vendors').insert({
        landlord_id: landlordId,
        name: place.name,
        trade,
        phone: place.phone ?? '',
        notes: place.address,
      })
      if (error) throw error
    },
    onSuccess: (_data, place) => {
      qc.invalidateQueries({ queryKey: ['vendors', landlordId] })
      setAddedIds((prev) => new Set(prev).add(place.id))
    },
  })

  return (
    <div className="card mt-6 p-6">
      <h2 className="font-medium text-ink">Find vendors near you</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Search real contractors and businesses by trade and location, then add the ones you want to
        your roster.
      </p>

      <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={runSearch}>
        <div>
          <label className="field-label">Trade</label>
          <input
            className="field-input"
            placeholder="e.g. plumber, house cleaner, locksmith"
            value={trade}
            onChange={(e) => setTrade(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="field-label">Location</label>
          <input
            className="field-input"
            placeholder="e.g. Erie, PA or a street address"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center gap-3 sm:col-span-2">
          <button type="submit" className="btn-primary" disabled={searching}>
            {searching ? 'Searching…' : 'Search'}
          </button>
          <button type="button" className="btn-ghost" onClick={onDone}>
            Close
          </button>
        </div>
      </form>

      {searchError && <p className="mt-4 text-sm text-red-600">{searchError}</p>}

      {results && results.length === 0 && !searchError && (
        <p className="mt-4 text-sm text-ink-faint">No results. Try a broader location or trade.</p>
      )}

      {results && results.length > 0 && (
        <div className="mt-5 divide-y divide-line border-t border-line">
          {results.map((place) => {
            const added = addedIds.has(place.id)
            return (
              <div key={place.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">{place.name}</p>
                  <p className="text-xs text-ink-faint">
                    {place.address}
                    {place.phone && <span> &middot; {place.phone}</span>}
                    {place.rating !== null && <span> &middot; {place.rating}★</span>}
                  </p>
                </div>
                <button
                  className="btn-secondary py-1.5 text-sm"
                  onClick={() => addVendor.mutate(place)}
                  disabled={added || addVendor.isPending}
                >
                  {added ? 'Added' : 'Add to my vendors'}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
