import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Columns, DotsThree, Rows } from '@phosphor-icons/react'
import { useAllTasks, useAllTurnovers, useSetTurnoverStage, taskRollup, type TurnoverRow } from '@/lib/workspace-data'
import { STAGES, stageIndex, stageLabels, turnoverHealth } from '@/lib/turnover'
import { formatDate, formatMoney, todayISO } from '@/lib/format'
import { unitPhoto } from '@/lib/photos'
import { marketingImages } from '@/lib/images'
import { Progress } from '@/components/ui/Progress'
import { Menu, MenuItem } from '@/components/ui/Menu'
import { Skeleton } from '@/components/Skeleton'
import { useToast } from '@/components/ui/Toast'
import type { TurnoverStage } from '@/lib/database.types'

type Counts = { done: number; total: number; overdue: number; cost: number }

export default function Turnovers() {
  const today = todayISO()
  const [view, setView] = useState<'board' | 'list'>('board')
  const [showClosed, setShowClosed] = useState(false)

  const { data: turnovers, isLoading } = useAllTurnovers()
  const { data: tasks } = useAllTasks()
  const rollup = useMemo(() => taskRollup(tasks, today), [tasks, today])

  const visible = useMemo(
    () => (turnovers ?? []).filter((t) => (showClosed ? true : t.stage !== 'leased')),
    [turnovers, showClosed]
  )

  const byStage = useMemo(() => {
    const map = new Map<TurnoverStage, TurnoverRow[]>()
    for (const stage of STAGES) map.set(stage, [])
    for (const turnover of visible) map.get(turnover.stage)?.push(turnover)
    return map
  }, [visible])

  const activeCount = (turnovers ?? []).filter((t) => t.stage !== 'leased').length

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
        <img src={marketingImages.loft.src} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/45 to-ink/30" aria-hidden="true" />
        <div className="relative flex min-h-[42svh] flex-col justify-end p-5 sm:p-10">
          <p className="eyebrow text-white/50">The pipeline</p>
          <h1 className="display-1 mt-4 text-white">Turnovers</h1>
          <p className="lede mt-5 max-w-[44ch] text-white/75">
            {activeCount === 0
              ? 'Nothing is open. Start a turnover from a unit in your portfolio.'
              : `${activeCount} turnover${activeCount === 1 ? '' : 's'} moving from notice to leased.`}
          </p>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-6 sm:px-5">
        <button onClick={() => setShowClosed((v) => !v)} className={showClosed ? 'chip-active' : 'chip'}>
          {showClosed ? 'Hide closed' : 'Show closed'}
        </button>
        <div className="seg">
          <button onClick={() => setView('board')} className={`seg-item ${view === 'board' ? 'seg-item-active' : ''}`}>
            <Columns size={14} weight="bold" /> Board
          </button>
          <button onClick={() => setView('list')} className={`seg-item ${view === 'list' ? 'seg-item-active' : ''}`}>
            <Rows size={14} weight="bold" /> List
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <section className="scene-navy px-5 py-20 text-center sm:px-10">
          <h2 className="display-2">Nothing in the pipeline</h2>
          <p className="lede mx-auto mt-5 max-w-[40ch] text-white/60">
            When a tenant gives notice, start a turnover on that unit and it appears here.
          </p>
          <Link to="/app/portfolio" className="btn-light mt-8">
            Go to portfolio <ArrowUpRight size={15} weight="bold" />
          </Link>
        </section>
      ) : view === 'board' ? (
        <div className="overflow-x-auto px-2 pb-4 sm:px-5">
          <div className="flex gap-3 sm:gap-5">
            {STAGES.map((stage) => {
              if (stage === 'leased' && !showClosed) return null
              const column = byStage.get(stage) ?? []
              return (
                <section key={stage} className="flex min-w-[250px] flex-1 flex-col">
                  <header className="flex items-baseline justify-between gap-2 border-t-2 border-ink pt-3">
                    <h2 className="display-4">{stageLabels[stage]}</h2>
                    <span className="text-[13px] tabular-nums text-ink-faint">{column.length}</span>
                  </header>
                  <div className="mt-4 space-y-3 sm:space-y-4">
                    {column.length === 0 && (
                      <p className="py-8 text-center text-[12px] uppercase tracking-[0.14em] text-ink-subtle">Empty</p>
                    )}
                    {column.map((turnover) => (
                      <BoardCard
                        key={turnover.id}
                        turnover={turnover}
                        counts={rollup.get(turnover.id) ?? { done: 0, total: 0, overdue: 0, cost: 0 }}
                      />
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      ) : (
        <TurnoverList turnovers={visible} rollup={rollup} />
      )}
    </div>
  )
}

function BoardCard({ turnover, counts }: { turnover: TurnoverRow; counts: Counts }) {
  const health = turnoverHealth(turnover)
  const setStage = useSetTurnoverStage()
  const toast = useToast()
  const index = stageIndex(turnover.stage)
  const next = STAGES[index + 1]
  const previous = STAGES[index - 1]

  const move = (stage: TurnoverStage) =>
    setStage.mutate(
      { turnoverId: turnover.id, unitId: turnover.unit.id, stage },
      {
        onSuccess: () => toast(`Moved to ${stageLabels[stage].toLowerCase()}`),
        onError: () => toast('Could not move that turnover', 'error'),
      }
    )

  return (
    <article className="scene group relative min-h-[260px]">
      <Link to={`/app/turnovers/${turnover.id}`} className="block">
        <img
          src={unitPhoto(turnover.unit.id, 700, 600)}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent" aria-hidden="true" />
        <span className="relative flex min-h-[260px] flex-col justify-end p-4 text-white">
          {counts.overdue > 0 && (
            <span className="absolute left-4 top-4 rounded-pill bg-critical-600 px-2.5 py-1 text-[11px] font-medium">
              {counts.overdue} overdue
            </span>
          )}
          <span className="display-4 block">{turnover.unit.unit_label}</span>
          <span className="mt-1 block truncate text-[12px] text-white/65">{turnover.unit.property.name}</span>
          <span className="mt-4 block">
            <Progress value={counts.done} total={counts.total} tone={health.pastTarget ? 'critical' : 'brand'} />
          </span>
          <span className="mt-2 flex items-center justify-between gap-2 text-[11px] text-white/65">
            <span>
              {counts.done}/{counts.total}
            </span>
            <span className={health.pastTarget ? 'font-medium text-critical-200' : ''}>{health.headline}</span>
          </span>
        </span>
      </Link>

      <div className="absolute right-3 top-3">
        <Menu
          trigger={() => (
            <span className="flex h-8 w-8 items-center justify-center rounded-pill bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/30" aria-label="Move stage">
              <DotsThree size={16} weight="bold" />
            </span>
          )}
        >
          {(close) => (
            <>
              {next && (
                <MenuItem
                  onClick={() => {
                    close()
                    move(next)
                  }}
                >
                  Move to {stageLabels[next].toLowerCase()}
                </MenuItem>
              )}
              {previous && (
                <MenuItem
                  onClick={() => {
                    close()
                    move(previous)
                  }}
                >
                  Back to {stageLabels[previous].toLowerCase()}
                </MenuItem>
              )}
            </>
          )}
        </Menu>
      </div>
    </article>
  )
}

function TurnoverList({ turnovers, rollup }: { turnovers: TurnoverRow[]; rollup: Map<string, Counts> }) {
  return (
    <section className="px-2 pb-10 sm:px-5">
      <ul>
        {turnovers.map((turnover) => {
          const counts = rollup.get(turnover.id) ?? { done: 0, total: 0, overdue: 0, cost: 0 }
          const health = turnoverHealth(turnover)
          return (
            <li key={turnover.id} className="border-t border-line">
              <Link to={`/app/turnovers/${turnover.id}`} className="group flex flex-wrap items-center gap-5 py-5">
                <img
                  src={unitPhoto(turnover.unit.id, 200, 200)}
                  alt=""
                  loading="lazy"
                  className="h-16 w-16 shrink-0 rounded-lg object-cover"
                />
                <span className="min-w-[10rem] flex-1">
                  <span className="display-4 block transition-opacity group-hover:opacity-65">{turnover.unit.unit_label}</span>
                  <span className="mt-1 block text-[13px] text-ink-faint">{turnover.unit.property.name}</span>
                </span>
                <span className="w-28 shrink-0">
                  <span className={`state ${turnover.stage === 'leased' ? 'state-positive' : health.pastTarget ? 'state-critical' : 'state-brand'}`}>
                    {stageLabels[turnover.stage]}
                  </span>
                </span>
                <span className="w-32 shrink-0">
                  <Progress value={counts.done} total={counts.total} tone={health.pastTarget ? 'critical' : 'brand'} />
                  <span className="mt-2 block text-[12px] text-ink-faint">
                    {counts.done}/{counts.total}
                    {counts.overdue > 0 && <span className="ml-1.5 text-critical-600">{counts.overdue} late</span>}
                  </span>
                </span>
                <span className="hidden w-28 shrink-0 text-[13px] tabular-nums text-ink-faint lg:block">
                  {formatDate(turnover.move_out_date)}
                </span>
                <span className="w-20 shrink-0 text-right text-[15px] tabular-nums tracking-tight2">
                  {counts.cost > 0 ? formatMoney(counts.cost) : '—'}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
