import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// True only when real credentials were baked in at build time.
// On GitHub Pages this requires the repo secrets VITE_SUPABASE_URL and
// VITE_SUPABASE_PUBLISHABLE_KEY (Settings -> Secrets and variables -> Actions).
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes('YOUR_PROJECT_REF') &&
  !supabaseKey.includes('YOUR_SUPABASE')
)

export const BACKEND_NOT_CONFIGURED_MESSAGE =
  'Demo mode: Supabase is not connected, so live actions and Gemini are disabled. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to the build.'

if (!isSupabaseConfigured) {
  console.warn(`[ColdLife] ${BACKEND_NOT_CONFIGURED_MESSAGE} Local fallback demo data will still render.`)
}

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://example.supabase.co',
  isSupabaseConfigured ? supabaseKey : 'demo-placeholder-key',
  { auth: { persistSession: false } }
)
