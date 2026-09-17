import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Check, WarningCircle } from '@phosphor-icons/react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { formatDate, formatMoney, todayISO } from '@/lib/format'
import { STAGES, stageBlurb, stageIndex, stageLabels, turnoverHealth } from '@/lib/turnover'
import { unitPhoto } from '@/lib/photos'
import { useSetTurnoverStage, useTurnoverTasks } from '@/lib/workspace-data'
import { Tabs } from '@/components/ui/Tabs'
import { Progress } from '@/components/ui/Progress'
import { Skeleton } from '@/components/Skeleton'
import { useToast } from '@/components/ui/Toast'
import { Tasks } from '@/pages/workspace/turnover/Tasks'
import { ListingPanel } from '@/pages/workspace/turnover/ListingPanel'
import { Timeline } from '@/pages/workspace/turnover/Timeline'
import type { TurnoverStage } from '@/lib/database.types'

interface TurnoverRecord {
  id: string
  stage: TurnoverStage
  notice_date: string
  move_out_date: string | null
  target_ready_date: string | null
  leased_date: string | null
  notes: string
  unit: { id: string; unit_label: string; monthly_rent: number | null; property: { id: string; name: string } }
}

type TabId = 'overview' | 'timeline' | 'tasks' | 'listing'

export default function TurnoverDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const qc = useQueryClient()
  const toast = useToast()
  const [tab, setTab] = useState<TabId>('overview')

  const { data: turnover, isLoading } = useQuery({
    queryKey: ['turnover', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('turnovers')
        .select(
          'id, stage, notice_date, move_out_date, target_ready_date, leased_date, notes, unit:units(id, unit_label, monthly_rent, property:properties(id, name))'
        )
        .eq('id', id!)
        .single()
      if (error) throw error
      return data as unknown as TurnoverRecord
    },
  })

  const { data: tasks } = useTurnoverTasks(id!)

  const setStage = useSetTurnoverStage()

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

  const saveDetails = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('turnovers')
        .update({ move_out_date: moveOut || null, target_ready_date: targetReady || null, notes })
        .eq('id', id!)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['turnover', id] })
      qc.invalidateQueries({ queryKey: ['all_turnovers', user!.id] })
      toast('Turnover updated')
    },
    onError: () => toast('Could not save those details', 'error'),
  })

  if (isLoading || !turnover) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const today = todayISO()
  const health = turnoverHealth(turnover)
  const done = tasks?.filter((t) => t.status === 'done').length ?? 0
  const total = tasks?.length ?? 0
  const overdue = tasks?.filter((t) => t.status !== 'done' && t.due_date && t.due_date < today).length ?? 0
  const cost = tasks?.reduce((sum, t) => sum + (t.cost ?? 0), 0) ?? 0

  const move = (stage: TurnoverStage) =>
    setStage.mutate(
      { turnoverId: turnover.id, unitId: turnover.unit.id, stage },
      {
        onSuccess: () => toast(`Moved to ${stageLabels[stage].toLowerCase()}`),
        onError: () => toast('Could not change the stage', 'error'),
      }
    )

  return (
    <div className="space-y-6">
      <Link to="/app/turnovers" className="inline-flex items-center gap-1.5 text-[12px] text-ink-soft transition-colors hover:text-ink">
        <ArrowLeft size={13} /> Turnovers
      </Link>

      {/* Photo header: the unit as an object, not a text heading. */}
      <header className="relative overflow-hidden rounded-lg bg-shell">
        <img src={unitPhoto(turnover.unit.id, 1600, 500)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-shell/25" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-shell via-shell/70 to-transparent" aria-hidden="true" />
        <div className="relative flex flex-col justify-end gap-4 p-5 pt-36 sm:p-6 sm:pt-44">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[12px] text-white/70">{turnover.unit.property.name}</p>
              <h1 className="mt-0.5 truncate text-[1.5rem] font-semibold tracking-[-0.02em] text-white">
                {turnover.unit.unit_label}
              </h1>
              <p
                className={`mt-1.5 text-[12px] font-medium ${
                  health.pastTarget ? 'text-critical-200' : 'text-white/80'
                }`}
              >
                {health.headline}
                {turnover.unit.monthly_rent ? ` · ${formatMoney(turnover.unit.monthly_rent)}/mo` : ''}
              </p>
            </div>

            <dl className="flex shrink-0 gap-6">
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/50">Tasks</dt>
                <dd className="mt-0.5 text-[18px] font-semibold tabular-nums text-white">
                  {done}/{total}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/50">Overdue</dt>
                <dd className={`mt-0.5 text-[18px] font-semibold tabular-nums ${overdue > 0 ? 'text-critical-200' : 'text-white'}`}>
                  {overdue}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/50">Cost</dt>
                <dd className="mt-0.5 text-[18px] font-semibold tabular-nums text-white">{formatMoney(cost)}</dd>
              </div>
            </dl>
          </div>

          <div className="w-full">
            <Progress value={done} total={total} tone={health.pastTarget ? 'critical' : 'brand'} />
          </div>
        </div>
      </header>

      <StageStepper current={turnover.stage} onSelect={move} disabled={setStage.isPending} />

      <Tabs<TabId>
        tabs={[
          { id: 'overview', label: 'Overview' },
          { id: 'timeline', label: 'Timeline' },
          { id: 'tasks', label: 'Tasks', count: total },
          { id: 'listing', label: 'Listing' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 'overview' && (
        <div className="grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
          <section className="min-w-0 space-y-5">
            <div>
              <h2 className="ws-section">Key dates</h2>
              <p className="ws-meta mt-0.5">The whole checklist is scheduled from the move-out date.</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="ws-label">Notice given</p>
                  <p className="mt-1.5 text-[13px] tabular-nums text-ink">{formatDate(turnover.notice_date)}</p>
                </div>
                <div>
                  <label className="ws-label" htmlFor="move-out">
                    Move-out
                  </label>
                  <input
                    id="move-out"
                    type="date"
                    className="input mt-1.5"
                    value={moveOut}
                    onChange={(e) => setMoveOut(e.target.value)}
                  />
                </div>
                <div>
                  <label className="ws-label" htmlFor="target-ready">
                    Target ready
                  </label>
                  <input
                    id="target-ready"
                    type="date"
                    className="input mt-1.5"
                    value={targetReady}
                    onChange={(e) => setTargetReady(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="ws-section" htmlFor="notes">
                Notes
              </label>
              <textarea
                id="notes"
                className="input mt-3 min-h-32 resize-y"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What the plumber said, where the keys are, anything worth remembering."
              />
            </div>

            <div className="flex items-center gap-3">
              <button className="btn-primary btn-sm" onClick={() => saveDetails.mutate()} disabled={saveDetails.isPending}>
                {saveDetails.isPending ? 'Saving…' : 'Save changes'}
              </button>
              {saveDetails.isError && (
                <span className="flex items-center gap-1 text-[12px] font-medium text-critical-600">
                  <WarningCircle size={14} weight="fill" /> Could not save
                </span>
              )}
            </div>
          </section>

          <aside className="space-y-5 rounded border border-line bg-surface p-5">
            <div>
              <p className="ws-label">Current stage</p>
              <p className="mt-1.5 text-[15px] font-semibold text-ink">{stageLabels[turnover.stage]}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-ink-soft">{stageBlurb[turnover.stage]}</p>
            </div>

            <div className="border-t border-line pt-4">
              <p className="ws-label">Checklist</p>
              <div className="mt-2">
                <Progress value={done} total={total} tone={health.pastTarget ? 'critical' : 'brand'} />
              </div>
              <p className="mt-2 text-[12px] text-ink-soft">
                {done} of {total} closed
                {overdue > 0 && <span className="text-critical-600"> · {overdue} overdue</span>}
              </p>
              <button onClick={() => setTab('tasks')} className="mt-2.5 text-[12px] ws-link">
                Open the checklist
              </button>
            </div>

            <div className="border-t border-line pt-4">
              <p className="ws-label">Tracked cost</p>
              <p className="mt-1.5 text-metric font-semibold tabular-nums text-ink">{formatMoney(cost)}</p>
              <p className="mt-0.5 text-[12px] text-ink-faint">Repairs, cleaning and vendor invoices on this turnover.</p>
            </div>
          </aside>
        </div>
      )}

      {tab === 'timeline' && <Timeline turnoverId={turnover.id} moveOutDate={turnover.move_out_date} />}
      {tab === 'tasks' && <Tasks turnoverId={turnover.id} landlordId={user!.id} />}
      {tab === 'listing' && (
        <ListingPanel
          turnoverId={turnover.id}
          landlordId={user!.id}
          unitId={turnover.unit.id}
          unitLabel={turnover.unit.unit_label}
          propertyName={turnover.unit.property.name}
        />
      )}
    </div>
  )
}

function StageStepper({
  current,
  onSelect,
  disabled,
}: {
  current: TurnoverStage
  onSelect: (stage: TurnoverStage) => void
  disabled: boolean
}) {
  const currentIndex = stageIndex(current)

  return (
    <nav aria-label="Turnover stage" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ol className="flex min-w-[640px] items-center">
        {STAGES.map((stage, i) => {
          const isCurrent = i === currentIndex
          const isDone = i < currentIndex
          return (
            <li key={stage} className="flex flex-1 items-center">
              <button
                onClick={() => onSelect(stage)}
                disabled={disabled}
                aria-current={isCurrent ? 'step' : undefined}
                className="group flex shrink-0 items-center gap-2 disabled:opacity-60"
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                    isDone
                      ? 'bg-brand-500 text-white'
                      : isCurrent
                        ? 'bg-ink text-white'
                        : 'border border-line-strong bg-surface text-ink-faint group-hover:border-ink-subtle'
                  }`}
                >
                  {isDone ? <Check size={11} weight="bold" /> : i + 1}
                </span>
                <span
                  className={`whitespace-nowrap text-[12px] transition-colors ${
                    isCurrent ? 'font-semibold text-ink' : isDone ? 'font-medium text-ink-soft' : 'text-ink-faint group-hover:text-ink-soft'
                  }`}
                >
                  {stageLabels[stage]}
                </span>
              </button>
              {i < STAGES.length - 1 && (
                <span className={`mx-2 h-px flex-1 ${i < currentIndex ? 'bg-brand-500' : 'bg-line'}`} aria-hidden="true" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
