import type { PartType, Tone } from '../types';

// ────────────────────────────────────────────────────────────────────────────
// Theme layer — the ONLY place that maps engine output (a `tone`) or a
// `PartType` to colors. Values are FULL LITERAL Tailwind class strings so the
// JIT compiler can see them (never build class names by concatenation).
// ────────────────────────────────────────────────────────────────────────────

export interface ToneToken {
  label: string;
  /** Badge container: bg + text + border. */
  badge: string;
  /** Status dot background. */
  dot: string;
  /** Result-row subtle tint: bg + border. */
  row: string;
}

export const TONE_TOKENS: Record<Tone, ToneToken> = {
  fits: {
    label: 'Fits',
    badge: 'bg-fits-bg text-fits-fg border-fits-border',
    dot: 'bg-fits-dot',
    row: 'bg-fits-row border-fits-rowb',
  },
  conflict: {
    label: 'Conflict',
    badge: 'bg-conflict-bg text-conflict-fg border-conflict-border',
    dot: 'bg-conflict-dot',
    row: 'bg-conflict-row border-conflict-rowb',
  },
  unrelated: {
    label: 'Unrelated',
    badge: 'bg-unrelated-bg text-unrelated-fg border-unrelated-border',
    dot: 'bg-unrelated-dot',
    row: 'bg-unrelated-row border-unrelated-rowb',
  },
};

export interface TypeToken {
  label: string;
  letter: string;
  /** Pastel glyph: tinted bg + saturated fg. */
  glyph: string;
}

export const TYPE_TOKENS: Record<PartType, TypeToken> = {
  frame: { label: 'Frame', letter: 'F', glyph: 'bg-type-frame-bg text-type-frame-fg' },
  crankset: { label: 'Crankset', letter: 'C', glyph: 'bg-type-crankset-bg text-type-crankset-fg' },
  wheelset: { label: 'Wheelset', letter: 'W', glyph: 'bg-type-wheelset-bg text-type-wheelset-fg' },
  cassette: { label: 'Cassette', letter: 'K', glyph: 'bg-type-cassette-bg text-type-cassette-fg' },
  bb: { label: 'Bottom bracket', letter: 'B', glyph: 'bg-type-bb-bg text-type-bb-fg' },
  tire: { label: 'Tire', letter: 'T', glyph: 'bg-type-tire-bg text-type-tire-fg' },
  fork: { label: 'Fork', letter: 'O', glyph: 'bg-type-fork-bg text-type-fork-fg' },
  chain: { label: 'Chain', letter: 'N', glyph: 'bg-type-chain-bg text-type-chain-fg' },
};

/** Per-detail-row dot for the spec comparison (ok → green, fail → red). */
export const DETAIL_DOT: Record<'ok' | 'fail', string> = {
  ok: 'bg-fits-dot',
  fail: 'bg-conflict-dot',
};

/**
 * Raw hex values per part type — for SVG fills (the bike diagram) where Tailwind
 * utility classes don't apply cleanly. Mirrors the `type-*` colors in the Tailwind
 * config. Light-theme only, matching the brief.
 */
export const TYPE_HEX: Record<PartType, { bg: string; fg: string }> = {
  frame: { bg: '#eaf0fd', fg: '#3b6ef6' },
  crankset: { bg: '#fdeee2', fg: '#e0843a' },
  wheelset: { bg: '#e7f5ee', fg: '#1f9d57' },
  cassette: { bg: '#f3edfb', fg: '#7c4ec4' },
  bb: { bg: '#fceef4', fg: '#c2477e' },
  tire: { bg: '#eef4e6', fg: '#6f8a2f' },
  fork: { bg: '#eef2fb', fg: '#3b78d6' },
  chain: { bg: '#f3ece0', fg: '#927b45' },
};

/** Types the user can pick & own. */
export const PICKABLE_TYPES: PartType[] = [
  'frame',
  'crankset',
  'wheelset',
  'cassette',
  'bb',
  'tire',
  'fork',
  'chain',
];
