import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { addDays, daysBetween, daysSince, formatMoney, todayISO } from '@/lib/format'
import { buildTemplateTasks } from '@/lib/checklist-template'
import { StatCard } from '@/components/StatCard'
import type { TaskCategory, TaskStatus, TurnoverStage, UnitStatus } from '@/lib/database.types'

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

interface TaskAlertRow {
  id: string
  title: string
  category: TaskCategory
  status: TaskStatus
  due_date: string | null
  cost: number | null
  turnover: { id: string; unit: { unit_label: string; property: { name: string } } }
}

interface TurnoverStatRow {
  id: string
  stage: TurnoverStage
  move_out_date: string | null
  target_ready_date: string | null
  leased_date: string | null
  unit: { unit_label: string; property: { name: string } }
}

interface Alert {
  id: string
  severity: 'red' | 'amber'
  message: string
  turnoverId: string
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

const ROW_GRID = 'grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 sm:grid-cols-[2fr_1fr_1fr_auto]'

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

  const { data: allTasks } = useQuery({
    queryKey: ['all_tasks', user!.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('turnover_tasks')
        .select(
          'id, title, category, status, due_date, cost, turnover:turnovers(id, unit:units(unit_label, property:properties(name)))'
        )
        .eq('landlord_id', user!.id)
      if (error) throw error
      return data as unknown as TaskAlertRow[]
    },
  })

  const { data: allTurnovers } = useQuery({
    queryKey: ['all_turnovers', user!.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('turnovers')
        .select(
          'id, stage, move_out_date, target_ready_date, leased_date, unit:units(unit_label, property:properties(name))'
        )
        .eq('landlord_id', user!.id)
      if (error) throw error
      return data as unknown as TurnoverStatRow[]
    },
  })

  const totalUnits = properties?.reduce((sum, p) => sum + p.units.length, 0) ?? 0

  const today = todayISO()

  const stats = useMemo(() => {
    const activeTurnovers = allTurnovers?.filter((t) => t.stage !== 'leased') ?? []
    const completed = (allTurnovers ?? []).filter((t) => t.stage === 'leased' && t.move_out_date && t.leased_date)
    const avgDays = completed.length
      ? Math.round(
          completed.reduce((sum, t) => sum + daysBetween(t.move_out_date!, t.leased_date!), 0) / completed.length
        )
      : null

    const openTasks = (allTasks ?? []).filter((t) => t.status !== 'done')
    const dueToday = openTasks.filter((t) => t.due_date === today).length
    const overdue = openTasks.filter((t) => t.due_date && t.due_date < today)
    const totalCost = (allTasks ?? []).reduce((sum, t) => sum + (t.cost ?? 0), 0)

    return { activeCount: activeTurnovers.length, avgDays, dueToday, overdue, totalCost }
  }, [allTasks, allTurnovers, today])

  const alerts = useMemo(() => {
    const list: Alert[] = []
    const overdueByTurnover = new Map<string, { count: number; label: string }>()
    for (const t of allTasks ?? []) {
      if (t.status === 'done' || !t.due_date || t.due_date >= today) continue
      const key = t.turnover.id
      const label = `${t.turnover.unit.property.name} · ${t.turnover.unit.unit_label}`
      const entry = overdueByTurnover.get(key) ?? { count: 0, label }
      entry.count += 1
      overdueByTurnover.set(key, entry)
    }
    for (const [turnoverId, { count, label }] of overdueByTurnover) {
      list.push({
        id: `overdue-${turnoverId}`,
        severity: 'red',
        message: `${count} task${count === 1 ? '' : 's'} overdue on ${label}`,
        turnoverId,
      })
    }

    for (const t of allTurnovers ?? []) {
      if (t.stage === 'leased' || !t.target_ready_date || t.target_ready_date >= today) continue
      const daysOver = daysBetween(t.target_ready_date, today)
      list.push({
        id: `target-${t.id}`,
        severity: 'amber',
        message: `${t.unit.property.name} · ${t.unit.unit_label} is ${daysOver} day${daysOver === 1 ? '' : 's'} past target`,
        turnoverId: t.id,
      })
    }

    return list.sort((a, b) => (a.severity === b.severity ? 0 : a.severity === 'red' ? -1 : 1)).slice(0, 4)
  }, [allTasks, allTurnovers, today])

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Properties</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {properties && properties.length > 0
              ? `${properties.length} propert${properties.length === 1 ? 'y' : 'ies'} · ${totalUnits} unit${totalUnits === 1 ? '' : 's'}`
              : 'Every property and unit you manage, and where each one stands.'}
          </p>
        </div>
        <button className="btn-primary" onClick={() => setAddingProperty((v) => !v)}>
          Add property
        </button>
      </div>

      {!isLoading && properties && properties.length > 0 && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Active turnovers" value={stats.activeCount} accent="ink" />
            <StatCard label="Avg. turnover days" value={stats.avgDays ?? '—'} accent="ink" />
            <StatCard
              label="Tasks due today"
              value={stats.dueToday}
              accent={stats.dueToday > 0 ? 'amber' : 'ink'}
            />
            <StatCard
              label="Overdue tasks"
              value={stats.overdue.length}
              accent={stats.overdue.length > 0 ? 'red' : 'ink'}
            />
          </div>

          {stats.totalCost > 0 && (
            <p className="mt-3 text-sm text-ink-soft">
              <span className="font-semibold text-ink">{formatMoney(stats.totalCost)}</span> in tracked
              repair &amp; vendor costs across all turnovers.
            </p>
          )}

          {alerts.length > 0 && (
            <div className="mt-6 space-y-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3 ${
                    alert.severity === 'red'
                      ? 'border-red-200 bg-red-50'
                      : 'border-brand-200 bg-brand-50'
                  }`}
                >
                  <p className={`text-sm font-medium ${alert.severity === 'red' ? 'text-red-800' : 'text-brand-800'}`}>
                    {alert.message}
                  </p>
                  <Link
                    to={`/app/turnovers/${alert.turnoverId}`}
                    className={`shrink-0 text-sm font-semibold hover:underline ${
                      alert.severity === 'red' ? 'text-red-700' : 'text-brand-700'
                    }`}
                  >
                    View turnover &rarr;
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {addingProperty && (
        <AddPropertyForm landlordId={user!.id} onDone={() => setAddingProperty(false)} />
      )}

      <div className="mt-8">
        {isLoading && <p className="text-sm text-ink-faint">Loading&hellip;</p>}

        {!isLoading && properties?.length === 0 && !addingProperty && (
          <div className="card flex flex-col items-start gap-3 p-10">
            <p className="font-semibold text-ink">No properties yet</p>
            <p className="text-sm text-ink-soft">
              Add your first property to start tracking its units and turnovers.
            </p>
            <button className="btn-primary mt-1" onClick={() => setAddingProperty(true)}>
              Add property
            </button>
          </div>
        )}

        {properties && properties.length > 0 && (
          <div className="card overflow-hidden">
            <div className={`${ROW_GRID} border-b border-ink/10 px-4 py-2 sm:px-6`}>
              <p className="tag text-ink-faint">Unit</p>
              <p className="tag hidden text-ink-faint sm:block">Rent</p>
              <p className="tag text-ink-faint">Status</p>
              <p />
            </div>
            {properties.map((property) => (
              <PropertySection key={property.id} property={property} landlordId={user!.id} />
            ))}
          </div>
        )}
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
        <p className="sm:col-span-2 text-sm text-red-600">Couldn&rsquo;t save that property. Try again.</p>
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

function PropertySection({ property, landlordId }: { property: PropertyRow; landlordId: string }) {
  const [addingUnit, setAddingUnit] = useState(false)

  return (
    <div className="border-b border-ink/10 last:border-b-0">
      <div className="flex items-start justify-between gap-3 bg-ink/[0.02] px-4 py-3 sm:px-6">
        <div>
          <p className="text-sm font-semibold text-ink">{property.name}</p>
          <p className="text-xs text-ink-faint">
            {property.address_line1}, {property.city}, {property.state}
          </p>
        </div>
        <button className="btn-ghost shrink-0 py-1 text-xs" onClick={() => setAddingUnit((v) => !v)}>
          + Add unit
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
        <p className="px-4 py-4 text-sm text-ink-faint sm:px-6">No units added yet.</p>
      )}

      {property.units.map((unit) => (
        <UnitRowItem key={unit.id} unit={unit} landlordId={landlordId} />
      ))}
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
      className="grid grid-cols-2 gap-3 border-b border-ink/10 bg-paper px-4 py-4 sm:grid-cols-4 sm:px-6"
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
    <div className={`${ROW_GRID} border-b border-ink/10 px-4 py-3 last:border-b-0 sm:px-6`}>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{unit.unit_label}</p>
        <p className="text-xs text-ink-faint">
          {unit.bedrooms} bd &middot; {unit.bathrooms} ba
        </p>
      </div>
      <p className="hidden text-sm text-ink-soft sm:block">
        {unit.monthly_rent ? `${formatMoney(unit.monthly_rent)}/mo` : '—'}
      </p>
      <div>
        <span className={`tag ${statusStyles[unit.status]}`}>
          {unit.status === 'turnover' && openTurnover
            ? stageLabels[openTurnover.stage]
            : unit.status[0].toUpperCase() + unit.status.slice(1)}
        </span>
        {unit.status === 'turnover' && openTurnover && (
          <span className="ml-1.5 hidden text-xs text-ink-faint sm:inline">
            {daysSince(openTurnover.notice_date)}d
          </span>
        )}
      </div>
      {openTurnover ? (
        <button
          className="btn-secondary py-1.5 text-xs sm:text-sm"
          onClick={() => navigate(`/app/turnovers/${openTurnover.id}`)}
        >
          View
        </button>
      ) : (
        <button
          className="btn-secondary py-1.5 text-xs sm:text-sm"
          onClick={() => startTurnover.mutate()}
          disabled={startTurnover.isPending}
        >
          {startTurnover.isPending ? 'Starting…' : 'Start turnover'}
        </button>
      )}
    </div>
  )
}
