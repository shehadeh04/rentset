import type { TurnoverStage } from './database.types'
import { daysBetween, todayISO } from './format'

export const STAGES: TurnoverStage[] = ['notice', 'inspection', 'repairs', 'cleaning', 'listing', 'leased']

export const stageLabels: Record<TurnoverStage, string> = {
  notice: 'Notice',
  inspection: 'Inspection',
  repairs: 'Repairs',
  cleaning: 'Cleaning',
  listing: 'Listing',
  leased: 'Leased',
}

export const stageBlurb: Record<TurnoverStage, string> = {
  notice: 'Tenant has given notice. Prep work starts before they move out.',
  inspection: 'Walk the unit and record what actually needs doing.',
  repairs: 'Safety-critical work first, then everything cosmetic.',
  cleaning: 'Deep clean so the unit shows well.',
  listing: 'Get it listed before the work is fully finished.',
  leased: 'Signed. This turnover is closed.',
}

export function stageIndex(stage: TurnoverStage) {
  return STAGES.indexOf(stage)
}

export interface TurnoverHealth {
  /** Days since move-out. Negative means move-out has not happened yet. */
  dayNum: number | null
  /** Days remaining until target ready date. Negative means past target. */
  daysLeft: number | null
  pastTarget: boolean
  headline: string
}

export function turnoverHealth(turnover: {
  stage: TurnoverStage
  move_out_date: string | null
  target_ready_date: string | null
  leased_date: string | null
}): TurnoverHealth {
  const today = todayISO()

  if (turnover.stage === 'leased') {
    const total =
      turnover.move_out_date && turnover.leased_date ? daysBetween(turnover.move_out_date, turnover.leased_date) : null
    return {
      dayNum: null,
      daysLeft: null,
      pastTarget: false,
      headline: total === null ? 'Closed' : `Closed in ${total} day${total === 1 ? '' : 's'}`,
    }
  }

  const dayNum = turnover.move_out_date ? daysBetween(turnover.move_out_date, today) : null
  const daysLeft = turnover.target_ready_date ? daysBetween(today, turnover.target_ready_date) : null
  const pastTarget = daysLeft !== null && daysLeft < 0

  let headline: string
  if (dayNum === null) headline = 'No move-out date'
  else if (dayNum < 0) headline = `Move-out in ${-dayNum} day${-dayNum === 1 ? '' : 's'}`
  else if (pastTarget) headline = `${-daysLeft!} day${-daysLeft! === 1 ? '' : 's'} past target`
  else if (daysLeft === 0) headline = 'Due to be ready today'
  else if (daysLeft !== null) headline = `${daysLeft} day${daysLeft === 1 ? '' : 's'} to target`
  else headline = `Day ${dayNum} since move-out`

  return { dayNum, daysLeft, pastTarget, headline }
}
