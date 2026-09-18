import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowUpRight, Plus, Rows, SquaresFour } from '@phosphor-icons/react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { useProperties, type PropertyRow, type UnitRow } from '@/lib/workspace-data'
import { addDays, formatMoney, todayISO } from '@/lib/format'
import { buildTemplateTasks } from '@/lib/checklist-template'
import { stageLabels } from '@/lib/turnover'
import { propertyPhoto, unitPhoto } from '@/lib/photos'
import { marketingImages } from '@/lib/images'
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
  if (unit.status === 'turnover' && open) return { label: stageLabels[open.stage], turnoverId: open.id }
  if (unit.status === 'vacant') return { label: 'Vacant', turnoverId: null }
  return { label: 'Occupied', turnoverId: null }
}

export default function Portfolio() {
  const { user } = useAuth()
  const { data: properties, isLoading } = useProperties()
  const [view, setView] = useState<'gallery' | 'list'>('gallery')
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
      <div className="space-y-5">
        <Skeleton className="h-[42svh] w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <section className="scene relative min-h-[42svh]">
        <img src={marketingImages.rooftops.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/45 to-ink/25" aria-hidden="true" />
        <div className="relative flex min-h-[42svh] flex-col justify-end p-5 sm:p-10">
          <p className="eyebrow text-white/50">Your portfolio</p>
          <h1 className="display-1 mt-4 text-white">
            {properties && properties.length > 0 ? `${totalUnits} unit${totalUnits === 1 ? '' : 's'}` : 'Portfolio'}
          </h1>
          <p className="lede mt-5 max-w-[42ch] text-white/75">
            {properties && properties.length > 0
              ? `Across ${properties.length} propert${properties.length === 1 ? 'y' : 'ies'}.`
              : 'Your properties and the units inside them.'}
          </p>
          <button className="btn-light mt-8 self-start" onClick={() => setAddProperty(true)}>
            Add property <Plus size={15} weight="bold" />
          </button>
        </div>
      </section>

      {properties && properties.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-6 sm:px-5">
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
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter units" className="input w-48" />
          </div>

          <div className="seg">
            <button onClick={() => setView('gallery')} className={`seg-item ${view === 'gallery' ? 'seg-item-active' : ''}`}>
              <SquaresFour size={14} weight="bold" /> Gallery
            </button>
            <button onClick={() => setView('list')} className={`seg-item ${view === 'list' ? 'seg-item-active' : ''}`}>
              <Rows size={14} weight="bold" /> List
            </button>
          </div>
        </div>
      )}

      {properties?.length === 0 && (
        <section className="scene-navy px-5 py-20 text-center sm:px-10">
          <h2 className="display-2">No properties yet</h2>
          <p className="lede mx-auto mt-5 max-w-[38ch] text-white/60">
            Add your first property, then add the units inside it.
          </p>
          <button className="btn-light mt-8" onClick={() => setAddProperty(true)}>
            Add property <Plus size={15} weight="bold" />
          </button>
        </section>
      )}

      {view === 'list' && filtered.length > 0 && <UnitList properties={filtered} landlordId={user!.id} />}

      {view === 'gallery' &&
        filtered.map((property) => (
          <section key={property.id} className="px-2 pb-12 sm:px-5">
            <header className="flex flex-wrap items-end justify-between gap-5 border-t border-line pt-8">
              <div className="flex items-center gap-5">
                <img
                  src={propertyPhoto(property.id, 220, 220)}
                  alt=""
                  loading="lazy"
                  className="h-20 w-20 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0">
                  <h2 className="display-3">{property.name}</h2>
                  <p className="mt-2 text-[13px] text-ink-faint">
                    {property.address_line1}, {property.city}, {property.state}
                  </p>
                </div>
              </div>
              <button className="btn-secondary btn-sm shrink-0" onClick={() => setAddUnitTo(property)}>
                Add unit <Plus size={14} weight="bold" />
              </button>
            </header>

            {property.units.length === 0 ? (
              <p className="py-10 text-[14px] text-ink-faint">No units in this property yet.</p>
            ) : (
              <div className="mt-8 grid gap-3 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
                {property.units.map((unit) => (
                  <UnitCard key={unit.id} unit={unit} landlordId={user!.id} />
                ))}
              </div>
            )}
          </section>
        ))}

      {filtered.length === 0 && properties && properties.length > 0 && (
        <p className="px-5 py-16 text-center text-[15px] text-ink-faint">No units match those filters.</p>
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
    <article className="scene group relative min-h-[320px]">
      <img
        src={unitPhoto(unit.id, 900, 700)}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" aria-hidden="true" />

      <div className="relative flex min-h-[320px] flex-col justify-end p-5 text-white">
        <span className="absolute left-5 top-5 flex items-center gap-2 rounded-pill bg-white/15 px-3 py-1.5 text-[12px] font-medium backdrop-blur-md">
          {state.label}
        </span>

        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h3 className="display-3">{unit.unit_label}</h3>
            <p className="mt-2 text-[13px] text-white/65">
              {unit.bedrooms} bd · {unit.bathrooms} ba{unit.square_feet ? ` · ${unit.square_feet} ft²` : ''}
            </p>
          </div>
          <p className="shrink-0 text-[20px] tabular-nums tracking-display">
            {unit.monthly_rent ? formatMoney(unit.monthly_rent) : '—'}
          </p>
        </div>

        <div className="mt-6">
          {state.turnoverId ? (
            <Link to={`/app/turnovers/${state.turnoverId}`} className="btn-light">
              Open turnover <ArrowUpRight size={14} weight="bold" />
            </Link>
          ) : (
            <button className="btn-glass" onClick={() => start.mutate(unit.id)} disabled={start.isPending}>
              {start.isPending ? 'Starting…' : 'Start turnover'}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

function UnitList({ properties, landlordId }: { properties: PropertyRow[]; landlordId: string }) {
  const start = useStartTurnover(landlordId)

  return (
    <section className="px-2 pb-10 sm:px-5">
      <ul>
        {properties.flatMap((property) =>
          property.units.map((unit) => {
            const state = unitState(unit)
            return (
              <li key={unit.id} className="flex flex-wrap items-center gap-5 border-t border-line py-5">
                <img src={unitPhoto(unit.id, 200, 200)} alt="" loading="lazy" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                <span className="min-w-[10rem] flex-1">
                  <span className="display-4 block">{unit.unit_label}</span>
                  <span className="mt-1 block text-[13px] text-ink-faint">{property.name}</span>
                </span>
                <span className="hidden w-40 shrink-0 text-[13px] text-ink-faint sm:block">
                  {unit.bedrooms} bd · {unit.bathrooms} ba{unit.square_feet ? ` · ${unit.square_feet} ft²` : ''}
                </span>
                <span className="w-24 shrink-0 text-[15px] tabular-nums tracking-tight2">
                  {unit.monthly_rent ? formatMoney(unit.monthly_rent) : '—'}
                </span>
                <span className="w-28 shrink-0 text-[13px] text-ink-soft">{state.label}</span>
                <span className="shrink-0">
                  {state.turnoverId ? (
                    <Link to={`/app/turnovers/${state.turnoverId}`} className="btn-secondary btn-sm">
                      Open
                    </Link>
                  ) : (
                    <button className="btn-secondary btn-sm" onClick={() => start.mutate(unit.id)} disabled={start.isPending}>
                      Start turnover
                    </button>
                  )}
                </span>
              </li>
            )
          })
        )}
      </ul>
    </section>
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
        className="grid gap-5 sm:grid-cols-2"
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
      <div className="mt-6 flex items-center gap-3">
        <button type="submit" form="add-property" className="btn-primary" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving…' : 'Save property'}
        </button>
        <button type="button" className="btn-ghost" onClick={onClose}>
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
        className="grid gap-5 sm:grid-cols-2"
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
      <div className="mt-6 flex items-center gap-3">
        <button type="submit" form="add-unit" className="btn-primary" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving…' : 'Save unit'}
        </button>
        <button type="button" className="btn-ghost" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  )
}
