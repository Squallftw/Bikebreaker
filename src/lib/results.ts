// ────────────────────────────────────────────────────────────────────────────
// Results engine — pure aggregation built on top of compat(). Turns an owned
// part + the catalog into the grouped, sorted, counted data the screens render,
// and cross-checks a whole build holistically. No React, no colors.
// ────────────────────────────────────────────────────────────────────────────

import { compat } from './compat';
import type { Part, PartType, CompatResult, Relation, Tone } from '../types';

export interface GroupItem {
  part: Part;
  result: CompatResult;
}

export interface CompatGroup {
  type: PartType;
  title: string;
  subtitle: string;
  items: GroupItem[];
  fitCount: number;
  total: number;
}

export interface Kpis {
  checked: number;
  fits: number;
  conflicts: number;
  /** Percentage of checked parts that fit (0–100). */
  fitRatio: number;
}

export interface BuildConflict {
  other: Part;
  reason: string;
}

export interface BuildRow {
  part: Part;
  /** The owned part — pinned to the build and not removable. */
  pinned: boolean;
  /** First part in the build this one clashes with, if any. */
  conflict?: BuildConflict;
}

export interface BuildCheck {
  rows: BuildRow[];
  hasConflict: boolean;
}

const TONE_RANK: Record<Tone, number> = { fits: 0, conflict: 1, unrelated: 2 };

/**
 * For an owned part, build one group per candidate relation: run compat() over
 * every catalog part of that type (excluding the owner) and sort
 * fits → conflict → unrelated.
 */
export function generateGroups(
  owner: Part,
  relations: Relation[],
  catalog: Part[],
): CompatGroup[] {
  return relations.map((rel) => {
    const items = catalog
      .filter((c) => c.type === rel.type && c.id !== owner.id)
      .map((part) => ({ part, result: compat(owner, part) }))
      .sort((x, y) => TONE_RANK[x.result.tone] - TONE_RANK[y.result.tone]);

    const fitCount = items.filter((it) => it.result.tone === 'fits').length;
    return {
      type: rel.type,
      title: rel.title,
      subtitle: rel.subtitle,
      items,
      fitCount,
      total: items.length,
    };
  });
}

/** Roll the per-group results up into the dashboard KPI numbers. */
export function aggregateKpis(groups: CompatGroup[]): Kpis {
  let checked = 0;
  let fits = 0;
  let conflicts = 0;
  for (const g of groups) {
    for (const it of g.items) {
      checked++;
      if (it.result.tone === 'fits') fits++;
      else if (it.result.tone === 'conflict') conflicts++;
    }
  }
  const fitRatio = checked ? Math.round((fits / checked) * 100) : 0;
  return { checked, fits, conflicts, fitRatio };
}

/**
 * Cross-check a whole build holistically: every part against every other part
 * (owner pinned). Each part is flagged with the first part it conflicts with,
 * so a clash between two ADDED parts is caught — not just clashes with the owner.
 */
export function crossCheckBuild(
  owner: Part,
  buildIds: string[],
  catalog: Part[],
): BuildCheck {
  const byId = (id: string) => catalog.find((p) => p.id === id);
  const added = buildIds
    .map(byId)
    .filter((p): p is Part => Boolean(p) && p!.id !== owner.id);

  const tray: { part: Part; pinned: boolean }[] = [
    { part: owner, pinned: true },
    ...added.map((part) => ({ part, pinned: false })),
  ];

  let hasConflict = false;
  const rows: BuildRow[] = tray.map(({ part, pinned }, idx) => {
    let conflict: BuildConflict | undefined;
    for (let j = 0; j < tray.length; j++) {
      if (j === idx) continue;
      const r = compat(part, tray[j].part);
      if (r.tone === 'conflict') {
        conflict = { other: tray[j].part, reason: r.reason };
        break;
      }
    }
    if (conflict) hasConflict = true;
    return { part, pinned, conflict };
  });

  return { rows, hasConflict };
}
