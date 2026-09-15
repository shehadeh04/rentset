import { createClient } from '@supabase/supabase-js'

// Fall back to a placeholder project so the app (landing page included) can
// still build and render before Supabase credentials are configured. Calls
// that hit the network will fail gracefully rather than crashing on load.
const url = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
)

export const supabase = createClient(url, anonKey)
