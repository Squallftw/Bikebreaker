import type { Part, PartType } from '../types';
import { specsFor } from './compat';

// ────────────────────────────────────────────────────────────────────────────
// Pure cross-type catalog search. Matches a query against a part's brand, name,
// spec, human type label, and its derived spec chips — so "disc", "xdr", "di2",
// "groupset", or "shimano 12" all find the right parts. Kept framework-free and
// theme-free (the label map is inlined) so it's trivially unit-testable.
// ────────────────────────────────────────────────────────────────────────────

const TYPE_LABEL: Record<PartType, string> = {
  frame: 'Frame',
  crankset: 'Crankset',
  bb: 'Bottom bracket',
  wheelset: 'Wheelset',
  cassette: 'Cassette',
  tire: 'Tire',
  fork: 'Fork',
  chain: 'Chain',
  groupset: 'Groupset',
};

/** Case-insensitive, AND-across-terms search over the whole catalog. */
export function searchCatalog(catalog: Part[], query: string): Part[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return catalog.filter((p) => {
    const hay = [p.brand, p.name, p.spec, TYPE_LABEL[p.type], specsFor(p).join(' ')]
      .join(' ')
      .toLowerCase();
    return terms.every((t) => hay.includes(t));
  });
}
