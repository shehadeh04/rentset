import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { daysSince, formatDate, todayISO } from '@/lib/format'
import type { TurnoverStage } from '@/lib/database.types'

const stages: TurnoverStage[] = ['notice', 'inspection', 'repairs', 'cleaning', 'listing', 'leased']
const stageLabels: Record<TurnoverStage, string> = {
  notice: 'Notice',
  inspection: 'Inspection',
  repairs: 'Repairs',
  cleaning: 'Cleaning',
  listing: 'Listing',
  leased: 'Leased',
}

interface TurnoverRow {
  id: string
  stage: TurnoverStage
  notice_date: string
  move_out_date: string | null
  target_ready_date: string | null
  leased_date: string | null
  notes: string
  unit: { id: string; unit_label: string; property: { id: string; name: string } }
}

export default function TurnoverDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const qc = useQueryClient()

  const { data: turnover, isLoading } = useQuery({
    queryKey: ['turnover', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('turnovers')
        .select(
          'id, stage, notice_date, move_out_date, target_ready_date, leased_date, notes, unit:units(id, unit_label, property:properties(id, name))'
        )
        .eq('id', id!)
        .single()
      if (error) throw error
      return data as unknown as TurnoverRow
    },
  })

  const [moveOut, setMoveOut] = useState('')
  const [targetReady, setTargetReady] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (turnover) {
      setMoveOut(turnover.move_out_date ?? '')
      setTargetReady(turnover.target_ready_date ?? '')
      setNotes(turnover.notes)
    }
  }, [turnover])

  const setStage = useMutation({
    mutationFn: async (stage: TurnoverStage) => {
      const patch: Record<string, unknown> = { stage }
      if (stage === 'leased') {
        patch.leased_date = todayISO()
        patch.completed_at = new Date().toISOString()
      }
      const { error } = await supabase.from('turnovers').update(patch).eq('id', id!)
      if (error) throw error
      if (stage === 'leased' && turnover) {
        await supabase.from('units').update({ status: 'occupied' }).eq('id', turnover.unit.id)
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['turnover', id] })
      qc.invalidateQueries({ queryKey: ['properties', user!.id] })
    },
  })

  const saveDetails = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('turnovers')
        .update({
          move_out_date: moveOut || null,
          target_ready_date: targetReady || null,
          notes,
        })
        .eq('id', id!)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['turnover', id] }),
  })

  if (isLoading || !turnover) {
    return <p className="text-sm text-ink-faint">Loading…</p>
  }

  const currentIndex = stages.indexOf(turnover.stage)
  const days = daysSince(turnover.notice_date)

  return (
    <div className="max-w-3xl">
      <Link to="/app" className="text-sm text-ink-soft hover:text-ink">
        &larr; Properties
      </Link>

      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-2xl font-medium text-ink">
          {turnover.unit.property.name} &middot; {turnover.unit.unit_label}
        </h1>
        {turnover.stage !== 'leased' && days !== null && (
          <span className="text-sm text-ink-faint">{days} days in turnover</span>
        )}
      </div>

      <div className="card mt-6 p-6">
        <p className="mb-4 text-sm font-medium text-ink-soft">Stage</p>
        <div className="flex flex-wrap gap-2">
          {stages.map((stage, i) => {
            const isCurrent = stage === turnover.stage
            const isPast = i < currentIndex
            return (
              <button
                key={stage}
                onClick={() => setStage.mutate(stage)}
                disabled={setStage.isPending}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isCurrent
                    ? 'bg-brand-700 text-white'
                    : isPast
                      ? 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                      : 'border border-line bg-white text-ink-soft hover:border-ink/30'
                }`}
              >
                {stageLabels[stage]}
              </button>
            )
          })}
        </div>
      </div>

      <div className="card mt-6 grid gap-4 p-6 sm:grid-cols-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">Notice given</p>
          <p className="mt-1 text-ink">{formatDate(turnover.notice_date)}</p>
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-ink-faint">Move-out date</label>
          <input
            type="date"
            className="field-input mt-1"
            value={moveOut}
            onChange={(e) => setMoveOut(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wide text-ink-faint">Target ready</label>
          <input
            type="date"
            className="field-input mt-1"
            value={targetReady}
            onChange={(e) => setTargetReady(e.target.value)}
          />
        </div>
      </div>

      <div className="card mt-6 p-6">
        <label className="field-label">Notes</label>
        <textarea
          className="field-input min-h-28 resize-y"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything worth remembering about this turnover."
        />
        <div className="mt-3 flex items-center gap-3">
          <button
            className="btn-primary"
            onClick={() => saveDetails.mutate()}
            disabled={saveDetails.isPending}
          >
            {saveDetails.isPending ? 'Saving…' : 'Save'}
          </button>
          {saveDetails.isSuccess && <span className="text-sm text-brand-700">Saved.</span>}
        </div>
      </div>
    </div>
  )
}
