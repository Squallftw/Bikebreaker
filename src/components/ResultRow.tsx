import { useState } from 'react';
import type { GroupItem } from '../lib/results';
import { useStore } from '../store/useStore';
import { TONE_TOKENS } from '../theme/tokens';
import { PartTypeIcon } from './PartTypeIcon';
import { StatusBadge } from './StatusBadge';
import { SpecCompare } from './SpecCompare';

/** One candidate part within a relationship group. Fully computed — no hard-coded status. */
export function ResultRow({ item }: { item: GroupItem }) {
  const { part, result } = item;
  const [expanded, setExpanded] = useState(false);
  const added = useStore((s) => s.build.includes(part.id));
  const addToBuild = useStore((s) => s.addToBuild);

  const tone = TONE_TOKENS[result.tone];
  const canAdd = result.tone !== 'unrelated';
  const detailLabel = expanded ? 'Hide' : result.tone === 'fits' ? 'Specs' : 'Why?';
  const addLabel = added
    ? 'Added ✓'
    : canAdd
      ? result.tone === 'conflict'
        ? 'Add anyway'
        : 'Add to build'
      : 'N/A';

  const addClass = added
    ? 'border-fits-border bg-fits-bg text-fits-fg'
    : canAdd
      ? 'border-accent bg-accent text-white hover:opacity-95'
      : 'border-[#ededee] bg-[#f6f6f6] text-[#c0c3c8] cursor-not-allowed';

  const detailId = `detail-${part.id}`;

  return (
    <div className={`rounded-xl border p-3.5 ${tone.row}`}>
      <div className="flex items-start gap-3.5">
        <PartTypeIcon type={part.type} size="row" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-[#abaeb4]">
                {part.brand}
              </span>
              <span className="mt-0.5 block text-[15px] font-semibold leading-tight tracking-tight text-ink">
                {part.name}
              </span>
              <span className="mt-1 block font-mono text-xs leading-snug text-[#abaeb4]">
                {part.spec}
              </span>
            </div>
            <StatusBadge tone={result.tone} />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            {result.reason && (
              <span className="text-[12.5px] text-[#6f7178]">{result.reason}</span>
            )}
            <span className="flex-1" />
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-controls={detailId}
              className="min-h-11 whitespace-nowrap rounded-lg border border-[#e7e8ea] bg-white px-3 py-1.5 text-[13px] font-semibold text-[#5c5f66] hover:bg-[#f7f8fa]"
            >
              {detailLabel}
            </button>
            <button
              type="button"
              onClick={() => addToBuild(part.id)}
              disabled={!canAdd || added}
              aria-label={
                canAdd ? `Add ${part.brand} ${part.name} to build` : `${part.name} is unrelated`
              }
              className={`min-h-11 whitespace-nowrap rounded-lg border px-3.5 py-1.5 text-[13px] font-semibold ${addClass}`}
            >
              {addLabel}
            </button>
          </div>

          {expanded && (
            <div id={detailId} className="mt-3">
              <SpecCompare detail={result.detail} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
