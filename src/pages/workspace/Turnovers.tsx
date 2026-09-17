import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowsClockwise, Columns, DotsThree, List as ListIcon, WarningCircle } from '@phosphor-icons/react'
import { useAllTasks, useAllTurnovers, useSetTurnoverStage, taskRollup, type TurnoverRow } from '@/lib/workspace-data'
import { STAGES, stageIndex, stageLabels, turnoverHealth } from '@/lib/turnover'
import { formatDate, formatMoney, todayISO } from '@/lib/format'
import { unitPhoto } from '@/lib/photos'
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
      <div className="space-y-6">
        <Skeleton className="h-9 w-56" />
        <div className="grid gap-3 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-72 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="ws-title">Turnovers</h1>
          <p className="mt-1 text-[13px] text-ink-soft">
            {activeCount === 0
              ? 'No turnover is open. Start one from a unit in your portfolio.'
              : `${activeCount} turnover${activeCount === 1 ? '' : 's'} moving through the pipeline.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowClosed((v) => !v)}
            className={`seg-item border border-line ${showClosed ? 'seg-item-active' : 'bg-surface'}`}
          >
            {showClosed ? 'Hide closed' : 'Show closed'}
          </button>
          <div className="seg">
            <button
              onClick={() => setView('board')}
              className={`seg-item ${view === 'board' ? 'seg-item-active' : ''}`}
              aria-pressed={view === 'board'}
            >
              <Columns size={14} weight="bold" /> Board
            </button>
            <button
              onClick={() => setView('list')}
              className={`seg-item ${view === 'list' ? 'seg-item-active' : ''}`}
              aria-pressed={view === 'list'}
            >
              <ListIcon size={14} weight="bold" /> List
            </button>
          </div>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center rounded border border-line bg-surface px-6 py-16 text-center">
          <ArrowsClockwise size={24} className="text-ink-subtle" />
          <p className="mt-3 text-[13px] font-medium text-ink">Nothing in the pipeline</p>
          <p className="mt-1 max-w-xs text-[12px] text-ink-faint">
            When a tenant gives notice, start a turnover on that unit and it will appear here.
          </p>
          <Link to="/app/portfolio" className="btn-secondary btn-sm mt-5">
            Go to portfolio
          </Link>
        </div>
      ) : view === 'board' ? (
        <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex gap-3">
            {STAGES.map((stage) => {
              const column = byStage.get(stage) ?? []
              if (stage === 'leased' && !showClosed) return null
              return (
                <section key={stage} className="flex min-w-[208px] flex-1 flex-col">
                  <header className="flex items-center justify-between gap-2 border-b-2 border-ink px-1 pb-2">
                    <h2 className="text-[12px] font-semibold text-ink">{stageLabels[stage]}</h2>
                    <span className="text-[11px] font-medium tabular-nums text-ink-faint">{column.length}</span>
                  </header>
                  <div className="mt-2.5 min-h-[260px] space-y-2.5 rounded bg-canvas/50 p-1.5">
                    {column.length === 0 && (
                      <p className="rounded border border-dashed border-line px-3 py-6 text-center text-[11px] text-ink-faint">
                        Empty
                      </p>
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
        <TurnoverTable turnovers={visible} rollup={rollup} />
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
    <article className="group overflow-hidden rounded border border-line bg-surface transition-shadow hover:shadow-card">
      <Link to={`/app/turnovers/${turnover.id}`} className="block">
        <div className="relative h-24 w-full overflow-hidden bg-sunken">
          <img
            src={unitPhoto(turnover.unit.id, 420, 240)}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          {counts.overdue > 0 && (
            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-sm bg-critical-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              <WarningCircle size={10} weight="fill" /> {counts.overdue} overdue
            </span>
          )}
        </div>
        <div className="px-3 pb-1 pt-2.5">
          <p className="truncate text-[13px] font-medium text-ink">{turnover.unit.unit_label}</p>
          <p className="truncate text-[11px] text-ink-faint">{turnover.unit.property.name}</p>
          <div className="mt-2.5">
            <Progress value={counts.done} total={counts.total} tone={health.pastTarget ? 'critical' : 'brand'} />
          </div>
          <p className="mt-1.5 flex items-center justify-between gap-2 text-[11px]">
            <span className="text-ink-faint">
              {counts.done}/{counts.total} tasks
            </span>
            <span className={health.pastTarget ? 'font-medium text-critical-600' : 'text-ink-faint'}>{health.headline}</span>
          </p>
        </div>
      </Link>

      <div className="flex items-center justify-between gap-2 px-3 pb-2 pt-1.5">
        <span className="text-[11px] tabular-nums text-ink-faint">
          {counts.cost > 0 ? formatMoney(counts.cost) : '—'}
        </span>
        <Menu
          trigger={() => (
            <span className="icon-btn h-7 w-7" aria-label="Move stage">
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

function TurnoverTable({ turnovers, rollup }: { turnovers: TurnoverRow[]; rollup: Map<string, Counts> }) {
  return (
    <div className="overflow-x-auto rounded border border-line bg-surface">
      <table className="w-full min-w-[720px] border-collapse">
        <thead>
          <tr className="border-b border-line">
            <th className="tbl-head px-4 py-2.5 text-left">Unit</th>
            <th className="tbl-head px-4 py-2.5 text-left">Stage</th>
            <th className="tbl-head px-4 py-2.5 text-left">Progress</th>
            <th className="tbl-head px-4 py-2.5 text-left">Move-out</th>
            <th className="tbl-head px-4 py-2.5 text-left">Target</th>
            <th className="tbl-head px-4 py-2.5 text-right">Cost</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {turnovers.map((turnover) => {
            const counts = rollup.get(turnover.id) ?? { done: 0, total: 0, overdue: 0, cost: 0 }
            const health = turnoverHealth(turnover)
            return (
              <tr key={turnover.id} className="tbl-row">
                <td className="px-4 py-2.5">
                  <Link to={`/app/turnovers/${turnover.id}`} className="flex items-center gap-2.5">
                    <img src={unitPhoto(turnover.unit.id, 80, 80)} alt="" loading="lazy" className="h-8 w-8 shrink-0 rounded object-cover" />
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-medium text-ink">{turnover.unit.unit_label}</span>
                      <span className="block truncate text-[11px] text-ink-faint">{turnover.unit.property.name}</span>
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-2.5">
                  <span className={`state ${turnover.stage === 'leased' ? 'state-positive' : health.pastTarget ? 'state-critical' : 'state-brand'}`}>
                    {stageLabels[turnover.stage]}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <div className="w-28">
                    <Progress value={counts.done} total={counts.total} tone={health.pastTarget ? 'critical' : 'brand'} />
                    <p className="mt-1 text-[11px] text-ink-faint">
                      {counts.done}/{counts.total}
                      {counts.overdue > 0 && <span className="ml-1.5 text-critical-600">{counts.overdue} late</span>}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-[12px] tabular-nums text-ink-soft">{formatDate(turnover.move_out_date)}</td>
                <td className="px-4 py-2.5 text-[12px] tabular-nums text-ink-soft">{formatDate(turnover.target_ready_date)}</td>
                <td className="px-4 py-2.5 text-right text-[12px] tabular-nums text-ink-soft">
                  {counts.cost > 0 ? formatMoney(counts.cost) : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
