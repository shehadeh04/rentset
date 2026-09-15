import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { addDays, daysSince, formatMoney, todayISO } from '@/lib/format'
import { buildTemplateTasks } from '@/lib/checklist-template'
import type { TurnoverStage, UnitStatus } from '@/lib/database.types'

interface UnitRow {
  id: string
  unit_label: string
  bedrooms: number
  bathrooms: number
  square_feet: number | null
  monthly_rent: number | null
  status: UnitStatus
  turnovers: { id: string; stage: TurnoverStage; notice_date: string }[]
}

interface PropertyRow {
  id: string
  name: string
  address_line1: string
  city: string
  state: string
  units: UnitRow[]
}

const stageLabels: Record<TurnoverStage, string> = {
  notice: 'Notice',
  inspection: 'Inspection',
  repairs: 'Repairs',
  cleaning: 'Cleaning',
  listing: 'Listing',
  leased: 'Leased',
}

const statusStyles: Record<UnitStatus, string> = {
  occupied: 'border border-ink/15 text-ink-soft',
  vacant: 'border border-ink/15 text-ink-soft',
  turnover: 'bg-brand-50 text-brand-700',
}

export default function Overview() {
  const { user } = useAuth()
  const [addingProperty, setAddingProperty] = useState(false)

  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties', user!.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(
          'id, name, address_line1, city, state, units(id, unit_label, bedrooms, bathrooms, square_feet, monthly_rent, status, turnovers(id, stage, notice_date))'
        )
        .eq('landlord_id', user!.id)
        .order('created_at', { ascending: false })
        .order('unit_label', { referencedTable: 'units', ascending: true })
      if (error) throw error
      return data as unknown as PropertyRow[]
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Properties</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Every property and unit you manage, and where each one stands.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setAddingProperty((v) => !v)}>
          Add property
        </button>
      </div>

      {addingProperty && (
        <AddPropertyForm landlordId={user!.id} onDone={() => setAddingProperty(false)} />
      )}

      <div className="mt-8 space-y-5">
        {isLoading && <p className="text-sm text-ink-faint">Loading…</p>}

        {!isLoading && properties?.length === 0 && !addingProperty && (
          <div className="card flex flex-col items-start gap-3 p-10">
            <p className="font-medium text-ink">No properties yet</p>
            <p className="text-sm text-ink-soft">
              Add your first property to start tracking its units and turnovers.
            </p>
            <button className="btn-primary mt-1" onClick={() => setAddingProperty(true)}>
              Add property
            </button>
          </div>
        )}

        {properties?.map((property) => (
          <PropertyCard key={property.id} property={property} landlordId={user!.id} />
        ))}
      </div>
    </div>
  )
}

function AddPropertyForm({ landlordId, onDone }: { landlordId: string; onDone: () => void }) {
  const qc = useQueryClient()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('properties').insert({
        landlord_id: landlordId,
        name,
        address_line1: address,
        city,
        state,
        postal_code: zip,
      })
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['properties', landlordId] })
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
      <div className="sm:col-span-2">
        <label className="field-label">Property name</label>
        <input
          className="field-input"
          placeholder="e.g. Maple Street Duplex"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="sm:col-span-2">
        <label className="field-label">Street address</label>
        <input
          className="field-input"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="field-label">City</label>
        <input className="field-input" value={city} onChange={(e) => setCity(e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="field-label">State</label>
          <input className="field-input" value={state} onChange={(e) => setState(e.target.value)} required />
        </div>
        <div>
          <label className="field-label">ZIP</label>
          <input className="field-input" value={zip} onChange={(e) => setZip(e.target.value)} required />
        </div>
      </div>
      {mutation.isError && (
        <p className="sm:col-span-2 text-sm text-red-600">Couldn’t save that property. Try again.</p>
      )}
      <div className="flex gap-3 sm:col-span-2">
        <button type="submit" className="btn-primary" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving…' : 'Save property'}
        </button>
        <button type="button" className="btn-ghost" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  )
}

function PropertyCard({ property, landlordId }: { property: PropertyRow; landlordId: string }) {
  const [addingUnit, setAddingUnit] = useState(false)

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-medium text-ink">{property.name}</h2>
          <p className="text-sm text-ink-faint">
            {property.address_line1}, {property.city}, {property.state}
          </p>
        </div>
        <button className="btn-ghost text-sm" onClick={() => setAddingUnit((v) => !v)}>
          Add unit
        </button>
      </div>

      {addingUnit && (
        <AddUnitForm
          propertyId={property.id}
          landlordId={landlordId}
          onDone={() => setAddingUnit(false)}
        />
      )}

      {property.units.length === 0 && !addingUnit && (
        <p className="mt-4 text-sm text-ink-faint">No units added yet.</p>
      )}

      {property.units.length > 0 && (
        <div className="mt-5 divide-y divide-line border-t border-line">
          {property.units.map((unit) => (
            <UnitRowItem key={unit.id} unit={unit} landlordId={landlordId} />
          ))}
        </div>
      )}
    </div>
  )
}

function AddUnitForm({
  propertyId,
  landlordId,
  onDone,
}: {
  propertyId: string
  landlordId: string
  onDone: () => void
}) {
  const qc = useQueryClient()
  const [label, setLabel] = useState('')
  const [bedrooms, setBedrooms] = useState('1')
  const [bathrooms, setBathrooms] = useState('1')
  const [rent, setRent] = useState('')

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('units').insert({
        property_id: propertyId,
        landlord_id: landlordId,
        unit_label: label,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        monthly_rent: rent ? Number(rent) : null,
        status: 'occupied',
      })
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['properties', landlordId] })
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
        <label className="field-label">Unit</label>
        <input
          className="field-input"
          placeholder="e.g. Unit A"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="field-label">Beds</label>
        <input
          type="number"
          min="0"
          step="0.5"
          className="field-input"
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
        />
      </div>
      <div>
        <label className="field-label">Baths</label>
        <input
          type="number"
          min="0"
          step="0.5"
          className="field-input"
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
        />
      </div>
      <div>
        <label className="field-label">Rent</label>
        <input
          type="number"
          min="0"
          className="field-input"
          placeholder="$"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
        />
      </div>
      <div className="col-span-2 flex items-end gap-3 sm:col-span-4">
        <button type="submit" className="btn-primary" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving…' : 'Save unit'}
        </button>
        <button type="button" className="btn-ghost" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  )
}

function UnitRowItem({ unit, landlordId }: { unit: UnitRow; landlordId: string }) {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const openTurnover = unit.turnovers.find((t) => t.stage !== 'leased')

  const startTurnover = useMutation({
    mutationFn: async () => {
      const noticeDate = todayISO()
      // 30 days is the standard PA lease notice period, and 9 days is the
      // research-backed standard-path turnover length — both are editable
      // starting estimates, not fixed rules.
      const moveOutDate = addDays(noticeDate, 30)
      const targetReadyDate = addDays(moveOutDate, 9)

      const { data, error } = await supabase
        .from('turnovers')
        .insert({
          unit_id: unit.id,
          landlord_id: landlordId,
          stage: 'notice',
          notice_date: noticeDate,
          move_out_date: moveOutDate,
          target_ready_date: targetReadyDate,
        })
        .select('id')
        .single()
      if (error) throw error

      const { error: tasksError } = await supabase
        .from('turnover_tasks')
        .insert(buildTemplateTasks(data.id, landlordId, moveOutDate))
      if (tasksError) throw tasksError

      await supabase.from('units').update({ status: 'turnover' }).eq('id', unit.id)
      return data.id as string
    },
    onSuccess: (turnoverId) => {
      qc.invalidateQueries({ queryKey: ['properties', landlordId] })
      navigate(`/app/turnovers/${turnoverId}`)
    },
  })

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div className="flex items-center gap-3">
        <span className="font-medium text-ink">{unit.unit_label}</span>
        <span className="text-sm text-ink-faint">
          {unit.bedrooms} bd &middot; {unit.bathrooms} ba
          {unit.monthly_rent ? ` · ${formatMoney(unit.monthly_rent)}/mo` : ''}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className={`tag ${statusStyles[unit.status]}`}>
          {unit.status === 'turnover' && openTurnover
            ? `Turnover · ${stageLabels[openTurnover.stage]}`
            : unit.status[0].toUpperCase() + unit.status.slice(1)}
        </span>
        {unit.status === 'turnover' && openTurnover && (
          <span className="text-xs text-ink-faint">
            {daysSince(openTurnover.notice_date)} days
          </span>
        )}
        {openTurnover ? (
          <button
            className="btn-secondary py-1.5 text-sm"
            onClick={() => navigate(`/app/turnovers/${openTurnover.id}`)}
          >
            View turnover
          </button>
        ) : (
          <button
            className="btn-secondary py-1.5 text-sm"
            onClick={() => startTurnover.mutate()}
            disabled={startTurnover.isPending}
          >
            {startTurnover.isPending ? 'Starting…' : 'Start turnover'}
          </button>
        )}
      </div>
    </div>
  )
}
