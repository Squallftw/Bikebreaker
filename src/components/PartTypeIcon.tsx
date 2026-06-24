import type { PartType } from '../types';
import { TYPE_TOKENS } from '../theme/tokens';

const SIZES = {
  sm: 'h-[30px] w-[30px] rounded-lg text-[13px]',
  md: 'h-10 w-10 rounded-[11px] text-[17px]',
  row: 'h-[42px] w-[42px] rounded-xl text-[18px]',
  hero: 'h-[54px] w-[54px] rounded-2xl text-[22px]',
} as const;

export type GlyphSize = keyof typeof SIZES;

/** Pastel, type-colored letter glyph. Decorative — the brand/name carry meaning. */
export function PartTypeIcon({ type, size = 'md' }: { type: PartType; size?: GlyphSize }) {
  const t = TYPE_TOKENS[type];
  return (
    <span
      aria-hidden="true"
      className={`flex flex-none items-center justify-center font-mono font-semibold ${SIZES[size]} ${t.glyph}`}
    >
      {t.letter}
    </span>
  );
}
