import type { Part } from '../types';
import { supabase } from './supabase';
import { validateCatalog } from './validateCatalog';
import { CATALOG, setCatalog } from './catalog';

// ────────────────────────────────────────────────────────────────────────────
// Loads the parts catalog from the Supabase `bikebreaker.parts` table at boot,
// validates it (fail-fast), and overwrites the in-memory CATALOG in place.
//
// This is the ONE place the app talks to the database. Any failure — no client,
// network error, or invalid data — is swallowed and the bundled fallback
// catalog is kept, so the app always renders something usable.
// ────────────────────────────────────────────────────────────────────────────

export interface CatalogLoadResult {
  source: 'supabase' | 'fallback';
  count: number;
}

/** Shape of a row from bikebreaker.parts. `attrs` is JSONB (returned parsed). */
interface PartRow {
  id: string;
  type: string;
  brand: string;
  name: string;
  spec: string;
  attrs: unknown;
  source: string | null;
}

export async function loadCatalog(): Promise<CatalogLoadResult> {
  if (!supabase) {
    // No credentials configured — keep the bundled catalog.
    return { source: 'fallback', count: CATALOG.length };
  }

  try {
    const { data, error } = await supabase
      .from('parts')
      .select('id,type,brand,name,spec,attrs,source');
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Supabase returned no parts');

    // Map each row explicitly. Never spread the row — Supabase may add columns
    // (created_at, etc.) — and normalise a NULL source to an omitted field so it
    // matches the optional `Part.source`.
    const mapped = (data as PartRow[]).map((r) => ({
      id: r.id,
      type: r.type,
      brand: r.brand,
      name: r.name,
      spec: r.spec,
      attrs: r.attrs,
      ...(r.source ? { source: r.source } : {}),
    }));

    const parts: Part[] = validateCatalog(mapped); // throws on any bad record
    setCatalog(parts);
    return { source: 'supabase', count: parts.length };
  } catch (err) {
    console.warn(
      '[BikeBreaker] Could not load parts from Supabase — using bundled catalog.',
      err,
    );
    return { source: 'fallback', count: CATALOG.length };
  }
}
