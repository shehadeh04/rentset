import { useState } from 'react'
import { ArrowSquareOut, MapPin } from '@phosphor-icons/react'

export function NearbyVendorSearch({ onDone }: { onDone: () => void }) {
  const [trade, setTrade] = useState('')
  const [location, setLocation] = useState('')

  function openMapsSearch(e: React.FormEvent) {
    e.preventDefault()
    const query = `${trade} near ${location}`
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank', 'noopener')
  }

  return (
    <div className="panel mt-6 animate-fade-in p-6">
      <div className="flex items-center gap-2">
        <MapPin size={18} weight="regular" className="text-ink" />
        <h2 className="font-semibold text-ink">Find vendors near you</h2>
      </div>
      <p className="mt-1 text-sm text-ink-soft">
        Opens a Google Maps search in a new tab. Found someone good? Come back and add them below.
      </p>

      <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={openMapsSearch}>
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
          <button type="submit" className="btn-primary">
            Search on Google Maps
            <ArrowSquareOut size={16} weight="bold" />
          </button>
          <button type="button" className="btn-ghost" onClick={onDone}>
            Close
          </button>
        </div>
      </form>
    </div>
  )
}
