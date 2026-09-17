import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from './supabase'
import { useAuth } from './auth-context'
import type { TaskCategory, TaskStatus, TurnoverStage, UnitStatus } from './database.types'

export interface UnitRow {
  id: string
  unit_label: string
  bedrooms: number
  bathrooms: number
  square_feet: number | null
  monthly_rent: number | null
  status: UnitStatus
  turnovers: { id: string; stage: TurnoverStage; notice_date: string }[]
}

export interface PropertyRow {
  id: string
  name: string
  address_line1: string
  city: string
  state: string
  units: UnitRow[]
}

export interface TaskRow {
  id: string
  title: string
  category: TaskCategory
  status: TaskStatus
  due_date: string | null
  cost: number | null
  turnover: { id: string; unit: { unit_label: string; property: { name: string } } }
}

export interface TurnoverRow {
  id: string
  stage: TurnoverStage
  notice_date: string
  move_out_date: string | null
  target_ready_date: string | null
  leased_date: string | null
  unit: { id: string; unit_label: string; monthly_rent: number | null; property: { name: string } }
}

/** Properties with their units and any open turnover. */
export function useProperties() {
  const { user } = useAuth()
  return useQuery({
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
}

/** Every task across every turnover, for alerts, schedule and cost rollups. */
export function useAllTasks() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['all_tasks', user!.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('turnover_tasks')
        .select(
          'id, title, category, status, due_date, cost, turnover:turnovers(id, unit:units(unit_label, property:properties(name)))'
        )
        .eq('landlord_id', user!.id)
      if (error) throw error
      return data as unknown as TaskRow[]
    },
  })
}

/** Every turnover, for the pipeline board and portfolio rollups. */
export function useAllTurnovers() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['all_turnovers', user!.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('turnovers')
        .select(
          'id, stage, notice_date, move_out_date, target_ready_date, leased_date, unit:units(id, unit_label, monthly_rent, property:properties(name))'
        )
        .eq('landlord_id', user!.id)
        .order('notice_date', { ascending: false })
      if (error) throw error
      return data as unknown as TurnoverRow[]
    },
  })
}

export interface VendorRow {
  id: string
  name: string
  trade: string
  phone: string
  email: string
}

export function useVendors() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['vendors', user!.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('id, name, trade, phone, email')
        .eq('landlord_id', user!.id)
        .order('name', { ascending: true })
      if (error) throw error
      return data as VendorRow[]
    },
  })
}

export interface TurnoverTaskRow {
  id: string
  category: TaskCategory
  title: string
  status: TaskStatus
  vendor_id: string | null
  due_date: string | null
  cost: number | null
}

/**
 * The tasks on a single turnover. Every panel on the turnover page shares this
 * one query, so the column list must stay a superset of what they all render —
 * splitting it into narrower selects under the same key silently blanks fields
 * in whichever panel loses the cache race.
 */
export function useTurnoverTasks(turnoverId: string) {
  return useQuery({
    queryKey: ['turnover_tasks', turnoverId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('turnover_tasks')
        .select('id, category, title, status, vendor_id, due_date, cost')
        .eq('turnover_id', turnoverId)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data as TurnoverTaskRow[]
    },
  })
}

/** Closes a task from anywhere, refreshing every view that counts tasks. */
export function useCompleteTask() {
  const { user } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('turnover_tasks')
        .update({ status: 'done', completed_at: new Date().toISOString() })
        .eq('id', taskId)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['all_tasks', user!.id] })
      qc.invalidateQueries({ queryKey: ['schedule', user!.id] })
      qc.invalidateQueries({ queryKey: ['turnover_tasks'] })
    },
  })
}

/** Moves a turnover to a stage, keeping the unit's own status in sync. */
export function useSetTurnoverStage() {
  const { user } = useAuth()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ turnoverId, unitId, stage }: { turnoverId: string; unitId: string; stage: TurnoverStage }) => {
      const patch: Record<string, unknown> = { stage }
      if (stage === 'leased') {
        patch.leased_date = new Date().toISOString().slice(0, 10)
        patch.completed_at = new Date().toISOString()
      } else {
        patch.leased_date = null
        patch.completed_at = null
      }
      const { error } = await supabase.from('turnovers').update(patch).eq('id', turnoverId)
      if (error) throw error

      const { error: unitError } = await supabase
        .from('units')
        .update({ status: stage === 'leased' ? 'occupied' : 'turnover' })
        .eq('id', unitId)
      if (unitError) throw unitError
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['all_turnovers', user!.id] })
      qc.invalidateQueries({ queryKey: ['properties', user!.id] })
      qc.invalidateQueries({ queryKey: ['turnover', variables.turnoverId] })
    },
  })
}

/** Task counts keyed by turnover id, derived from the shared task cache. */
export function taskRollup(tasks: TaskRow[] | undefined, today: string) {
  const map = new Map<string, { done: number; total: number; overdue: number; cost: number }>()
  for (const task of tasks ?? []) {
    const key = task.turnover?.id
    if (!key) continue
    const entry = map.get(key) ?? { done: 0, total: 0, overdue: 0, cost: 0 }
    entry.total += 1
    if (task.status === 'done') entry.done += 1
    else if (task.due_date && task.due_date < today) entry.overdue += 1
    entry.cost += task.cost ?? 0
    map.set(key, entry)
  }
  return map
}
