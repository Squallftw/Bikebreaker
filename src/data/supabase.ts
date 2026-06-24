import { createClient } from '@supabase/supabase-js';

// ────────────────────────────────────────────────────────────────────────────
// Supabase client, scoped to the dedicated `bikebreaker` schema inside the
// Butchapp project. The URL + anon key come from build-time env vars (safe to
// ship publicly — the anon key is protected by row-level security).
//
// If either var is missing (e.g. local dev without a .env, or a build with no
// secrets), `supabase` is null and the app falls back to the bundled catalog.
// ────────────────────────────────────────────────────────────────────────────

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Type is inferred (a client scoped to the `bikebreaker` schema, or null).
export const supabase =
  url && anonKey ? createClient(url, anonKey, { db: { schema: 'bikebreaker' } }) : null;
