import type { PartType } from '../types';
import { TYPE_TOKENS } from '../theme/tokens';
import { PartTypeIcon } from './PartTypeIcon';

/** A part-type filter chip used on the picker. */
export function PartChip({
  type,
  active,
  onClick,
}: {
  type: PartType;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-11 items-center gap-2.5 rounded-xl border bg-white py-2 pl-2 pr-4 text-sm font-medium text-ink transition ${
        active ? 'border-accent ring-1 ring-accent' : 'border-[#e7e8ea] hover:border-[#d6d8dc]'
      }`}
    >
      <PartTypeIcon type={type} size="sm" />
      {TYPE_TOKENS[type].label}
    </button>
  );
}
