import type { TaskCategory } from './database.types'
import { addDays } from './format'

// Suggested checklist generated for every new turnover, with due dates
// offset from the expected move-out date (day 0). Based on the 29-step
// turnover process flow: pre-vacancy prep runs Day -21 to Day -7, the
// active turnover runs Day 1 (day after move-out) through Day 8-9.
// Vendor pre-scheduling during the notice period and tenant communication
// before move-out are the steps most commonly skipped in practice.
export interface TemplateTask {
  category: TaskCategory
  title: string
  dayOffset: number
}

export const TEMPLATE: TemplateTask[] = [
  { category: 'prep', title: 'Send move-out expectations & cleaning checklist to tenant', dayOffset: -21 },
  { category: 'prep', title: 'Check vendor availability & put trusted vendors on standby', dayOffset: -14 },
  { category: 'prep', title: 'Verify standard supplies in stock (paint, caulk, bulbs, cleaning basics)', dayOffset: -14 },
  { category: 'prep', title: 'Confirm move-out date & key return details with tenant, in writing', dayOffset: -7 },
  { category: 'prep', title: 'Pre-schedule a cleaner and maintenance help for right after move-out', dayOffset: -7 },
  { category: 'inspection', title: 'Full walk-through inspection: every room, appliance, and safety device', dayOffset: 1 },
  { category: 'inspection', title: 'Change locks & install a lockbox', dayOffset: 1 },
  { category: 'vendor', title: "Confirm tomorrow's vendor visits by phone or text", dayOffset: 1 },
  { category: 'repair', title: 'Complete safety-critical repairs (locks, smoke/CO detectors, electrical)', dayOffset: 2 },
  { category: 'repair', title: 'Complete functional & cosmetic repairs', dayOffset: 6 },
  { category: 'cleaning', title: 'Deep clean the unit: kitchen, bathrooms, floors, windows', dayOffset: 7 },
  { category: 'listing', title: 'Draft the listing description and photos', dayOffset: 5 },
  { category: 'listing', title: "Publish the listing, don't wait for the unit to be 100% done", dayOffset: 6 },
  { category: 'inspection', title: 'Final inspection against the original findings', dayOffset: 8 },
]

export function buildTemplateTasks(
  turnoverId: string,
  landlordId: string,
  moveOutDate: string
) {
  return TEMPLATE.map((t) => ({
    turnover_id: turnoverId,
    landlord_id: landlordId,
    category: t.category,
    title: t.title,
    due_date: addDays(moveOutDate, t.dayOffset),
  }))
}
