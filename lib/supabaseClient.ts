import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_CONFIG_MESSAGE =
  'Supabase environment variables are not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before running the app.';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

if (!isSupabaseConfigured) {
  console.warn(SUPABASE_CONFIG_MESSAGE);
}

export const supabase: SupabaseClient | null =
  isSupabaseConfigured && SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;
