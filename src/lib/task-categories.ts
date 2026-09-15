import type { TaskCategory } from './database.types'

export const categoryLabels: Record<TaskCategory, string> = {
  prep: 'Pre-move-out prep',
  inspection: 'Inspection',
  repair: 'Repair',
  cleaning: 'Cleaning',
  vendor: 'Vendor visit',
  listing: 'Listing prep',
}
