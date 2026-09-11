import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('[ColdLife] Supabase env vars are missing. Local fallback demo data will still render.')
}

export const supabase = createClient(
  supabaseUrl || 'https://example.supabase.co',
  supabaseKey || 'demo-placeholder-key',
  { auth: { persistSession: false } }
)
