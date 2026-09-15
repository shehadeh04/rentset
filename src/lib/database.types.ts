// Mirrors the enum types defined in supabase/migrations/00000000000000_init.sql.
// Once the Supabase CLI is linked to the project, full table types can be
// generated with: supabase gen types typescript --linked

export type UnitStatus = 'occupied' | 'vacant' | 'turnover'
export type TurnoverStage = 'notice' | 'inspection' | 'repairs' | 'cleaning' | 'listing' | 'leased'
export type TaskCategory = 'prep' | 'inspection' | 'repair' | 'cleaning' | 'vendor' | 'listing'
export type TaskStatus = 'open' | 'in_progress' | 'done'
export type ListingStatus = 'draft' | 'published' | 'leased'
