import type { Tone } from '../types';
import { TONE_TOKENS } from '../theme/tokens';

/** Dot + mono label conveying fits / conflict / unrelated at a glance. */
export function StatusBadge({ tone }: { tone: Tone }) {
  const t = TONE_TOKENS[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${t.badge}`}
    >
      <span className={`h-[7px] w-[7px] flex-none rounded-full ${t.dot}`} />
      <span className="font-mono tracking-[0.02em]">{t.label}</span>
    </span>
  );
}
