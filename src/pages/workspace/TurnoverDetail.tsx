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
      <div className="space-y-5">
        <Skeleton className="h-[58svh] w-full" />
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
    <div className="space-y-5">
      {/* Hero: the unit, full bleed. --------------------------------- */}
      <section className="scene relative min-h-[58svh]">
        <img src={unitPhoto(turnover.unit.id, 2000, 1200)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/92 via-ink/40 to-ink/30" aria-hidden="true" />

        <div className="relative flex min-h-[58svh] flex-col justify-between p-5 sm:p-10">
          <Link to="/app/turnovers" className="btn-glass self-start">
            <ArrowLeft size={14} weight="bold" /> Turnovers
          </Link>

          <div>
            <p className="eyebrow text-white/50">{turnover.unit.property.name}</p>
            <h1 className="display-1 mt-4 text-white">{turnover.unit.unit_label}</h1>
            <p className={`lede mt-4 ${health.pastTarget ? 'text-critical-200' : 'text-white/75'}`}>
              {health.headline}
              {turnover.unit.monthly_rent ? ` · ${formatMoney(turnover.unit.monthly_rent)}/mo` : ''}
            </p>

            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-white/20 pt-6 sm:max-w-lg">
              <HeroStat label="Tasks" value={`${done}/${total}`} />
              <HeroStat label="Overdue" value={overdue} tone={overdue > 0 ? 'critical' : undefined} />
              <HeroStat label="Cost" value={formatMoney(cost)} />
            </dl>

            <div className="mt-6 sm:max-w-lg">
              <Progress value={done} total={total} tone={health.pastTarget ? 'critical' : 'brand'} />
            </div>
          </div>
        </div>
      </section>

      <div className="px-2 sm:px-5">
        <StageStepper current={turnover.stage} onSelect={move} disabled={setStage.isPending} />

        <div className="mt-10">
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
        </div>

        <div className="py-10">
          {tab === 'overview' && (
            <div className="grid items-start gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
              <section className="min-w-0">
                <h2 className="display-3">Key dates</h2>
                <p className="ws-meta mt-3">The whole checklist is scheduled from the move-out date.</p>

                <div className="mt-8 grid gap-6 sm:grid-cols-3">
                  <div>
                    <p className="ws-label">Notice given</p>
                    <p className="mt-3 text-[18px] tabular-nums tracking-tight2">{formatDate(turnover.notice_date)}</p>
                  </div>
                  <div>
                    <label className="ws-label" htmlFor="move-out">
                      Move-out
                    </label>
                    <input id="move-out" type="date" className="input mt-3" value={moveOut} onChange={(e) => setMoveOut(e.target.value)} />
                  </div>
                  <div>
                    <label className="ws-label" htmlFor="target-ready">
                      Target ready
                    </label>
                    <input
                      id="target-ready"
                      type="date"
                      className="input mt-3"
                      value={targetReady}
                      onChange={(e) => setTargetReady(e.target.value)}
                    />
                  </div>
                </div>

                <h2 className="display-3 mt-14">Notes</h2>
                <textarea
                  className="input mt-6 min-h-36 resize-y"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What the plumber said, where the keys are, anything worth remembering."
                />

                <div className="mt-6 flex items-center gap-4">
                  <button className="btn-primary" onClick={() => saveDetails.mutate()} disabled={saveDetails.isPending}>
                    {saveDetails.isPending ? 'Saving…' : 'Save changes'}
                  </button>
                  {saveDetails.isError && (
                    <span className="flex items-center gap-1.5 text-[13px] font-medium text-critical-600">
                      <WarningCircle size={15} weight="fill" /> Could not save
                    </span>
                  )}
                </div>
              </section>

              <aside className="scene-clay p-6 sm:p-8">
                <p className="eyebrow text-white/45">Current stage</p>
                <p className="display-3 mt-4">{stageLabels[turnover.stage]}</p>
                <p className="mt-3 text-[14px] leading-relaxed text-white/60">{stageBlurb[turnover.stage]}</p>

                <div className="mt-8 border-t border-white/15 pt-6">
                  <p className="eyebrow text-white/45">Checklist</p>
                  <p className="mt-4 text-[40px] leading-none tracking-display tabular-nums">
                    {done}
                    <span className="text-white/40">/{total}</span>
                  </p>
                  <p className="mt-3 text-[13px] text-white/60">
                    closed
                    {overdue > 0 && <span className="text-critical-200"> · {overdue} overdue</span>}
                  </p>
                  <button onClick={() => setTab('tasks')} className="btn-glass mt-5">
                    Open the checklist
                  </button>
                </div>

                <div className="mt-8 border-t border-white/15 pt-6">
                  <p className="eyebrow text-white/45">Tracked cost</p>
                  <p className="mt-4 text-[40px] leading-none tracking-display tabular-nums">{formatMoney(cost)}</p>
                  <p className="mt-3 text-[13px] text-white/60">Repairs, cleaning and vendor invoices on this turnover.</p>
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
      </div>
    </div>
  )
}

function HeroStat({ label, value, tone }: { label: string; value: string | number; tone?: 'critical' }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/45">{label}</dt>
      <dd className={`mt-2 text-[28px] leading-none tracking-display tabular-nums ${tone === 'critical' ? 'text-critical-200' : 'text-white'}`}>
        {value}
      </dd>
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
    <nav aria-label="Turnover stage" className="overflow-x-auto py-8">
      <ol className="flex min-w-[720px] items-center gap-2">
        {STAGES.map((stage, i) => {
          const isCurrent = i === currentIndex
          const isDone = i < currentIndex
          return (
            <li key={stage} className="flex flex-1 items-center gap-2">
              <button
                onClick={() => onSelect(stage)}
                disabled={disabled}
                aria-current={isCurrent ? 'step' : undefined}
                className={`group flex shrink-0 items-center gap-2.5 rounded-pill px-4 py-2.5 transition-colors disabled:opacity-60 ${
                  isCurrent ? 'bg-ink text-white' : isDone ? 'bg-ink/[0.08] text-ink' : 'text-ink-faint hover:bg-ink/[0.05]'
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-pill text-[10px] font-medium ${
                    isDone ? 'bg-brand-500 text-white' : isCurrent ? 'bg-white/20 text-white' : 'border border-line'
                  }`}
                >
                  {isDone ? <Check size={10} weight="bold" /> : i + 1}
                </span>
                <span className="whitespace-nowrap text-[14px] tracking-tight2">{stageLabels[stage]}</span>
              </button>
              {i < STAGES.length - 1 && (
                <span className={`h-px flex-1 ${i < currentIndex ? 'bg-brand-500' : 'bg-line'}`} aria-hidden="true" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
