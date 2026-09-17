import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Check, CurrencyDollar, WarningCircle } from '@phosphor-icons/react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { daysBetween, formatDate, formatMoney, todayISO } from '@/lib/format'
import type { TaskStatus, TurnoverStage } from '@/lib/database.types'
import { Tasks } from '@/pages/workspace/turnover/Tasks'
import { ListingPanel } from '@/pages/workspace/turnover/ListingPanel'
import { Timeline } from '@/pages/workspace/turnover/Timeline'
import { StatCard } from '@/components/StatCard'
import { Skeleton } from '@/components/Skeleton'

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

function StageRail({
  currentStage,
  onSelect,
  disabled,
}: {
  currentStage: TurnoverStage
  onSelect: (stage: TurnoverStage) => void
  disabled: boolean
}) {
  const currentIndex = stages.indexOf(currentStage)
  return (
    <div className="panel p-5">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Stage</p>
      <div>
        {stages.map((stage, i) => {
          const isCurrent = stage === currentStage
          const isDone = i < currentIndex
          const isReached = i <= currentIndex
          return (
            <button
              key={stage}
              onClick={() => onSelect(stage)}
              disabled={disabled}
              className="relative flex w-full items-start gap-3 pb-6 text-left last:pb-0 disabled:opacity-60"
            >
              {i < stages.length - 1 && (
                <span
                  className={`absolute left-[9px] top-5 h-full w-px transition-colors ${isReached ? 'bg-ink' : 'bg-line'}`}
                  aria-hidden="true"
                />
              )}
              <span
                className={`relative z-10 flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                  isCurrent
                    ? 'bg-ink text-white'
                    : isDone
                      ? 'bg-ink text-white'
                      : 'border-2 border-line-strong bg-surface text-ink-faint'
                }`}
              >
                {isDone ? <Check size={10} weight="bold" /> : i + 1}
              </span>
              <span className={`pt-0.5 text-sm font-semibold ${isCurrent ? 'text-ink' : 'text-ink-faint'}`}>
                {stageLabels[stage]}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
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

  const { data: tasks } = useQuery({
    queryKey: ['turnover_tasks', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('turnover_tasks')
        .select('id, status, due_date, cost')
        .eq('turnover_id', id!)
      if (error) throw error
      return data as { id: string; status: TaskStatus; due_date: string | null; cost: number | null }[]
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
    return (
      <div className="max-w-5xl">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-4 h-8 w-64" />
        <div className="mt-6 grid gap-8 md:grid-cols-[13rem_1fr]">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    )
  }

  const today = todayISO()

  let progress: { label: string; overTarget: boolean } | null = null
  if (turnover.stage !== 'leased' && turnover.move_out_date) {
    const dayNum = daysBetween(turnover.move_out_date, today)
    if (dayNum < 0) {
      progress = { label: `Move-out in ${-dayNum} day${-dayNum === 1 ? '' : 's'}`, overTarget: false }
    } else {
      const targetDays = turnover.target_ready_date ? daysBetween(turnover.move_out_date, turnover.target_ready_date) : null
      const overTarget = targetDays !== null && dayNum > targetDays
      progress = {
        label: `Day ${dayNum} since move-out` + (targetDays !== null ? ` · target ${targetDays}` : ''),
        overTarget,
      }
    }
  }

  const doneCount = tasks?.filter((t) => t.status === 'done').length ?? 0
  const totalTasks = tasks?.length ?? 0
  const overdueCount = tasks?.filter((t) => t.status !== 'done' && t.due_date && t.due_date < today).length ?? 0
  const totalCost = tasks?.reduce((sum, t) => sum + (t.cost ?? 0), 0) ?? 0
  const daysLeft = turnover.stage !== 'leased' && turnover.target_ready_date ? daysBetween(today, turnover.target_ready_date) : null

  return (
    <div className="max-w-5xl">
      <Link to="/app" className="inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink">
        <ArrowLeft size={14} weight="regular" /> Properties
      </Link>

      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-3xl font-medium tracking-tight text-ink">
          {turnover.unit.property.name} &middot; {turnover.unit.unit_label}
        </h1>
        {progress && (
          <span className={`text-sm ${progress.overTarget ? 'font-medium text-critical-600' : 'text-ink-faint'}`}>
            {progress.label}
          </span>
        )}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[13rem_1fr] md:gap-8">
        <div className="md:sticky md:top-20 md:self-start">
          <StageRail currentStage={turnover.stage} onSelect={(s) => setStage.mutate(s)} disabled={setStage.isPending} />
        </div>

        <div className="min-w-0 space-y-6">
          {totalTasks > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Days left" value={daysLeft === null ? 'N/A' : daysLeft} accent={daysLeft !== null && daysLeft < 0 ? 'danger' : 'ink'} />
              <StatCard label="Tasks done" value={`${doneCount}/${totalTasks}`} accent="ink" />
              <StatCard label="Overdue" value={overdueCount} accent={overdueCount > 0 ? 'danger' : 'ink'} />
              <StatCard label="Cost" value={formatMoney(totalCost)} accent="ink" icon={CurrencyDollar} />
            </div>
          )}

          <div className="panel grid gap-5 p-6 sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Notice given</p>
              <p className="mt-1.5 text-sm text-ink">{formatDate(turnover.notice_date)}</p>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Move-out date</label>
              <input type="date" className="field-input mt-1.5" value={moveOut} onChange={(e) => setMoveOut(e.target.value)} />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Target ready</label>
              <input
                type="date"
                className="field-input mt-1.5"
                value={targetReady}
                onChange={(e) => setTargetReady(e.target.value)}
              />
            </div>
          </div>

          <div className="panel p-6">
            <label className="field-label">Notes</label>
            <textarea
              className="field-input min-h-28 resize-y"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything worth remembering about this turnover."
            />
            <div className="mt-3 flex items-center gap-3">
              <button className="btn-primary" onClick={() => saveDetails.mutate()} disabled={saveDetails.isPending}>
                {saveDetails.isPending ? 'Saving…' : 'Save'}
              </button>
              {saveDetails.isSuccess && (
                <span className="flex items-center gap-1 text-sm font-medium text-positive-600">
                  <Check size={15} weight="bold" /> Saved
                </span>
              )}
              {saveDetails.isError && (
                <span className="flex items-center gap-1 text-sm font-medium text-critical-600">
                  <WarningCircle size={15} weight="fill" /> Could not save. Try again.
                </span>
              )}
            </div>
          </div>

          <Timeline turnoverId={turnover.id} moveOutDate={turnover.move_out_date} />
          <Tasks turnoverId={turnover.id} landlordId={user!.id} />
          <ListingPanel turnoverId={turnover.id} landlordId={user!.id} />
        </div>
      </div>
    </div>
  )
}
