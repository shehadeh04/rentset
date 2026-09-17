import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Bed, Buildings, MapPin, Plus, Ruler, Shower, SquaresFour, Rows } from '@phosphor-icons/react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { useProperties, type PropertyRow, type UnitRow } from '@/lib/workspace-data'
import { addDays, formatMoney, todayISO } from '@/lib/format'
import { buildTemplateTasks } from '@/lib/checklist-template'
import { stageLabels } from '@/lib/turnover'
import { propertyPhoto, unitPhoto } from '@/lib/photos'
import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/Skeleton'
import { useToast } from '@/components/ui/Toast'
import type { UnitStatus } from '@/lib/database.types'

type StatusFilter = 'all' | UnitStatus

const statusFilters: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'occupied', label: 'Occupied' },
  { id: 'turnover', label: 'In turnover' },
  { id: 'vacant', label: 'Vacant' },
]

function unitState(unit: UnitRow) {
  const open = unit.turnovers.find((t) => t.stage !== 'leased')
  if (unit.status === 'turnover' && open) return { label: stageLabels[open.stage], tone: 'state-brand', turnoverId: open.id }
  if (unit.status === 'vacant') return { label: 'Vacant', tone: 'state-caution', turnoverId: null }
  return { label: 'Occupied', tone: 'state-positive', turnoverId: null }
}

export default function Portfolio() {
  const { user } = useAuth()
  const { data: properties, isLoading } = useProperties()
  const [view, setView] = useState<'gallery' | 'table'>('gallery')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [query, setQuery] = useState('')
  const [addProperty, setAddProperty] = useState(false)
  const [addUnitTo, setAddUnitTo] = useState<PropertyRow | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (properties ?? [])
      .map((property) => ({
        ...property,
        units: property.units.filter((unit) => {
          if (status !== 'all' && unit.status !== status) return false
          if (!q) return true
          return `${property.name} ${unit.unit_label} ${property.city}`.toLowerCase().includes(q)
        }),
      }))
      .filter((property) => property.units.length > 0 || (!q && status === 'all'))
  }, [properties, status, query])

  const totalUnits = (properties ?? []).reduce((sum, p) => sum + p.units.length, 0)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-56" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-60 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="ws-title">Portfolio</h1>
          <p className="mt-1 text-[13px] text-ink-soft">
            {properties && properties.length > 0
              ? `${properties.length} propert${properties.length === 1 ? 'y' : 'ies'} · ${totalUnits} unit${totalUnits === 1 ? '' : 's'}`
              : 'Your properties and the units inside them.'}
          </p>
        </div>
        <button className="btn-primary btn-sm" onClick={() => setAddProperty(true)}>
          <Plus size={15} weight="bold" /> Add property
        </button>
      </div>

      {properties && properties.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="seg">
              {statusFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setStatus(filter.id)}
                  className={`seg-item ${status === filter.id ? 'seg-item-active' : ''}`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter units"
              className="input h-[34px] w-44 py-1"
            />
          </div>

          <div className="seg">
            <button onClick={() => setView('gallery')} className={`seg-item ${view === 'gallery' ? 'seg-item-active' : ''}`}>
              <SquaresFour size={14} weight="bold" /> Gallery
            </button>
            <button onClick={() => setView('table')} className={`seg-item ${view === 'table' ? 'seg-item-active' : ''}`}>
              <Rows size={14} weight="bold" /> Table
            </button>
          </div>
        </div>
      )}

      {properties?.length === 0 && (
        <div className="flex flex-col items-center rounded border border-line bg-surface px-6 py-16 text-center">
          <Buildings size={24} className="text-ink-subtle" />
          <p className="mt-3 text-[13px] font-medium text-ink">No properties yet</p>
          <p className="mt-1 max-w-xs text-[12px] text-ink-faint">
            Add your first property, then add the units inside it.
          </p>
          <button className="btn-primary btn-sm mt-5" onClick={() => setAddProperty(true)}>
            <Plus size={15} weight="bold" /> Add property
          </button>
        </div>
      )}

      {view === 'table' && filtered.length > 0 && <UnitTable properties={filtered} landlordId={user!.id} />}

      {view === 'gallery' &&
        filtered.map((property) => (
          <section key={property.id} className="space-y-3">
            <header className="flex flex-wrap items-center gap-3 border-b border-line pb-3">
              <img
                src={propertyPhoto(property.id, 160, 160)}
                alt=""
                loading="lazy"
                className="h-11 w-11 shrink-0 rounded object-cover"
              />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-[14px] font-semibold text-ink">{property.name}</h2>
                <p className="flex items-center gap-1 truncate text-[12px] text-ink-faint">
                  <MapPin size={11} /> {property.address_line1}, {property.city}, {property.state}
                </p>
              </div>
              <button className="btn-ghost btn-sm shrink-0" onClick={() => setAddUnitTo(property)}>
                <Plus size={14} weight="bold" /> Add unit
              </button>
            </header>

            {property.units.length === 0 ? (
              <p className="py-4 text-[12px] text-ink-faint">No units in this property yet.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {property.units.map((unit) => (
                  <UnitCard key={unit.id} unit={unit} landlordId={user!.id} />
                ))}
              </div>
            )}
          </section>
        ))}

      {filtered.length === 0 && properties && properties.length > 0 && (
        <p className="rounded border border-line bg-surface px-4 py-10 text-center text-[13px] text-ink-faint">
          No units match those filters.
        </p>
      )}

      <AddPropertyModal open={addProperty} onClose={() => setAddProperty(false)} landlordId={user!.id} />
      <AddUnitModal property={addUnitTo} onClose={() => setAddUnitTo(null)} landlordId={user!.id} />
    </div>
  )
}

function useStartTurnover(landlordId: string) {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const toast = useToast()

  return useMutation({
    mutationFn: async (unitId: string) => {
      const noticeDate = todayISO()
      // 30 days is the standard PA notice period and 9 days the research-backed
      // turnover length. Both are starting estimates the user can edit.
      const moveOutDate = addDays(noticeDate, 30)
      const targetReadyDate = addDays(moveOutDate, 9)

      const { data, error } = await supabase
        .from('turnovers')
        .insert({
          unit_id: unitId,
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

      await supabase.from('units').update({ status: 'turnover' }).eq('id', unitId)
      return data.id as string
    },
    onSuccess: (turnoverId) => {
      qc.invalidateQueries({ queryKey: ['properties', landlordId] })
      qc.invalidateQueries({ queryKey: ['all_turnovers', landlordId] })
      qc.invalidateQueries({ queryKey: ['all_tasks', landlordId] })
      toast('Turnover started with a 14-step checklist')
      navigate(`/app/turnovers/${turnoverId}`)
    },
    onError: () => toast('Could not start that turnover', 'error'),
  })
}

function UnitCard({ unit, landlordId }: { unit: UnitRow; landlordId: string }) {
  const start = useStartTurnover(landlordId)
  const state = unitState(unit)

  return (
    <article className="group overflow-hidden rounded border border-line bg-surface transition-shadow hover:shadow-card">
      <div className="relative h-36 overflow-hidden bg-sunken">
        <img
          src={unitPhoto(unit.id, 480, 300)}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute left-2.5 top-2.5 rounded-sm bg-surface/95 px-2 py-1 backdrop-blur">
          <span className={`state ${state.tone}`}>{state.label}</span>
        </span>
      </div>

      <div className="p-3.5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="truncate text-[13px] font-semibold text-ink">{unit.unit_label}</h3>
          <span className="shrink-0 text-[13px] font-medium tabular-nums text-ink">
            {unit.monthly_rent ? formatMoney(unit.monthly_rent) : '—'}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-faint">
          <span className="flex items-center gap-1">
            <Bed size={12} /> {unit.bedrooms} bd
          </span>
          <span className="flex items-center gap-1">
            <Shower size={12} /> {unit.bathrooms} ba
          </span>
          {unit.square_feet && (
            <span className="flex items-center gap-1">
              <Ruler size={12} /> {unit.square_feet} ft²
            </span>
          )}
        </div>

        <div className="mt-3.5">
          {state.turnoverId ? (
            <Link to={`/app/turnovers/${state.turnoverId}`} className="btn-secondary btn-sm w-full">
              Open turnover
            </Link>
          ) : (
            <button
              className="btn-secondary btn-sm w-full"
              onClick={() => start.mutate(unit.id)}
              disabled={start.isPending}
            >
              {start.isPending ? 'Starting…' : 'Start turnover'}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

function UnitTable({ properties, landlordId }: { properties: PropertyRow[]; landlordId: string }) {
  const start = useStartTurnover(landlordId)

  return (
    <div className="overflow-x-auto rounded border border-line bg-surface">
      <table className="w-full min-w-[760px] border-collapse">
        <thead>
          <tr className="border-b border-line">
            <th className="tbl-head px-4 py-2.5 text-left">Unit</th>
            <th className="tbl-head px-4 py-2.5 text-left">Property</th>
            <th className="tbl-head px-4 py-2.5 text-left">Layout</th>
            <th className="tbl-head px-4 py-2.5 text-right">Rent</th>
            <th className="tbl-head px-4 py-2.5 text-left">Status</th>
            <th className="tbl-head px-4 py-2.5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {properties.flatMap((property) =>
            property.units.map((unit) => {
              const state = unitState(unit)
              return (
                <tr key={unit.id} className="tbl-row">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <img src={unitPhoto(unit.id, 80, 80)} alt="" loading="lazy" className="h-8 w-8 shrink-0 rounded object-cover" />
                      <span className="text-[13px] font-medium text-ink">{unit.unit_label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-[12px] text-ink-soft">{property.name}</td>
                  <td className="px-4 py-2.5 text-[12px] text-ink-soft">
                    {unit.bedrooms} bd · {unit.bathrooms} ba
                    {unit.square_feet ? ` · ${unit.square_feet} ft²` : ''}
                  </td>
                  <td className="px-4 py-2.5 text-right text-[12px] tabular-nums text-ink-soft">
                    {unit.monthly_rent ? formatMoney(unit.monthly_rent) : '—'}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`state ${state.tone}`}>{state.label}</span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {state.turnoverId ? (
                      <Link to={`/app/turnovers/${state.turnoverId}`} className="text-[12px] ws-link">
                        Open
                      </Link>
                    ) : (
                      <button
                        className="text-[12px] ws-link"
                        onClick={() => start.mutate(unit.id)}
                        disabled={start.isPending}
                      >
                        Start turnover
                      </button>
                    )}
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

function AddPropertyModal({ open, onClose, landlordId }: { open: boolean; onClose: () => void; landlordId: string }) {
  const qc = useQueryClient()
  const toast = useToast()
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
      toast('Property added')
      setName('')
      setAddress('')
      setCity('')
      setState('')
      setZip('')
      onClose()
    },
    onError: () => toast('Could not save that property', 'error'),
  })

  return (
    <Modal open={open} onClose={onClose} title="Add a property" description="The building or address. Units come next.">
      <form
        id="add-property"
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault()
          mutation.mutate()
        }}
      >
        <div className="sm:col-span-2">
          <label className="input-label">Property name</label>
          <input className="input" placeholder="e.g. Maple Street Duplex" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <label className="input-label">Street address</label>
          <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>
        <div>
          <label className="input-label">City</label>
          <input className="input" value={city} onChange={(e) => setCity(e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="input-label">State</label>
            <input className="input" value={state} onChange={(e) => setState(e.target.value)} required />
          </div>
          <div>
            <label className="input-label">ZIP</label>
            <input className="input" value={zip} onChange={(e) => setZip(e.target.value)} required />
          </div>
        </div>
      </form>
      <div className="mt-5 flex items-center gap-3">
        <button type="submit" form="add-property" className="btn-primary btn-sm" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving…' : 'Save property'}
        </button>
        <button type="button" className="btn-ghost btn-sm" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  )
}

function AddUnitModal({ property, onClose, landlordId }: { property: PropertyRow | null; onClose: () => void; landlordId: string }) {
  const qc = useQueryClient()
  const toast = useToast()
  const [label, setLabel] = useState('')
  const [bedrooms, setBedrooms] = useState('1')
  const [bathrooms, setBathrooms] = useState('1')
  const [squareFeet, setSquareFeet] = useState('')
  const [rent, setRent] = useState('')

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('units').insert({
        property_id: property!.id,
        landlord_id: landlordId,
        unit_label: label,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        square_feet: squareFeet ? Number(squareFeet) : null,
        monthly_rent: rent ? Number(rent) : null,
        status: 'occupied',
      })
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['properties', landlordId] })
      toast('Unit added')
      setLabel('')
      setSquareFeet('')
      setRent('')
      onClose()
    },
    onError: () => toast('Could not save that unit', 'error'),
  })

  return (
    <Modal open={property !== null} onClose={onClose} title="Add a unit" description={property?.name}>
      <form
        id="add-unit"
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault()
          mutation.mutate()
        }}
      >
        <div className="sm:col-span-2">
          <label className="input-label">Unit label</label>
          <input className="input" placeholder="e.g. Unit A" value={label} onChange={(e) => setLabel(e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="input-label">Bedrooms</label>
            <input type="number" min="0" step="0.5" className="input" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
          </div>
          <div>
            <label className="input-label">Bathrooms</label>
            <input type="number" min="0" step="0.5" className="input" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="input-label">Square feet</label>
            <input type="number" min="0" className="input" placeholder="Optional" value={squareFeet} onChange={(e) => setSquareFeet(e.target.value)} />
          </div>
          <div>
            <label className="input-label">Monthly rent</label>
            <input type="number" min="0" className="input" placeholder="$" value={rent} onChange={(e) => setRent(e.target.value)} />
          </div>
        </div>
      </form>
      <div className="mt-5 flex items-center gap-3">
        <button type="submit" form="add-unit" className="btn-primary btn-sm" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving…' : 'Save unit'}
        </button>
        <button type="button" className="btn-ghost btn-sm" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  )
}
