import { useState } from 'react'
import { ArrowSquareOut } from '@phosphor-icons/react'
import { Modal } from '@/components/ui/Modal'

export function NearbyVendorSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [trade, setTrade] = useState('')
  const [location, setLocation] = useState('')

  function openMapsSearch(e: React.FormEvent) {
    e.preventDefault()
    const query = `${trade} near ${location}`
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank', 'noopener')
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Find vendors nearby"
      description="Opens a Google Maps search in a new tab. Found someone good? Add them here afterwards."
      width="sm"
    >
      <form id="find-vendor" className="space-y-4" onSubmit={openMapsSearch}>
        <div>
          <label className="input-label">Trade</label>
          <input
            className="input"
            placeholder="e.g. plumber, house cleaner, locksmith"
            value={trade}
            onChange={(e) => setTrade(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="input-label">Location</label>
          <input
            className="input"
            placeholder="e.g. Erie, PA or a street address"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
      </form>
      <div className="mt-5 flex items-center gap-3">
        <button type="submit" form="find-vendor" className="btn-primary btn-sm">
          Search on Google Maps <ArrowSquareOut size={14} weight="bold" />
        </button>
        <button type="button" className="btn-ghost btn-sm" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  )
}
