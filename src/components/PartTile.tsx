import { useState } from 'react';
import type { Part } from '../types';
import type { GroupItem, BuildConflict } from '../lib/results';
import { useStore } from '../store/useStore';
import { TONE_TOKENS } from '../theme/tokens';
import { PartTypeIcon } from './PartTypeIcon';
import { StatusBadge } from './StatusBadge';
import { SpecCompare } from './SpecCompare';

// ────────────────────────────────────────────────────────────────────────────
// One animated part tile, used everywhere parts are shown. Three modes:
//   pick   — the whole tile selects the part (picker)
//   result — status badge + Why?/Specs expansion + add-to-build (compat results)
//   build  — remove action + conflict highlight (My Build)
// Animations are gated behind `motion-safe:` so reduced-motion users get none.
// ────────────────────────────────────────────────────────────────────────────

const TILE_BASE =
  'flex h-full flex-col gap-2 rounded-2xl border p-3.5 text-left transition motion-safe:animate-tile-in';
const HOVER =
  'motion-safe:hover:-translate-y-1 hover:border-[#d6d8dc] hover:shadow-[0_8px_22px_rgba(20,20,30,0.08)]';

const delayStyle = (index = 0) => ({ animationDelay: `${Math.min(index, 11) * 40}ms` });

function Head({ part }: { part: Part }) {
  return (
    <div className="flex items-start gap-3">
      <PartTypeIcon type={part.type} size="row" />
      <div className="min-w-0 flex-1">
        <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-[#abaeb4]">
          {part.brand}
        </span>
        <span className="mt-0.5 block text-[14.5px] font-semibold leading-tight tracking-tight text-ink">
          {part.name}
        </span>
        <span className="mt-1 block font-mono text-[11.5px] leading-snug text-[#abaeb4]">
          {part.spec}
        </span>
      </div>
    </div>
  );
}

function PickTile({ part, index, onPick }: { part: Part; index: number; onPick: (id: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onPick(part.id)}
      style={delayStyle(index)}
      className={`${TILE_BASE} ${HOVER} border-hairline bg-white motion-safe:active:scale-[0.99]`}
    >
      <Head part={part} />
    </button>
  );
}

function ResultTile({ item, index }: { item: GroupItem; index: number }) {
  const { part, result } = item;
  const [expanded, setExpanded] = useState(false);
  const added = useStore((s) => s.build.includes(part.id));
  const addToBuild = useStore((s) => s.addToBuild);

  const tone = TONE_TOKENS[result.tone];
  const canAdd = result.tone !== 'unrelated';
  const detailLabel = expanded ? 'Hide' : result.tone === 'fits' ? 'Specs' : 'Why?';
  const addLabel = added ? 'Added ✓' : result.tone === 'conflict' ? 'Add anyway' : canAdd ? 'Add' : 'N/A';
  const addClass = added
    ? 'border-fits-border bg-fits-bg text-fits-fg'
    : canAdd
      ? 'border-accent bg-accent text-white hover:opacity-95'
      : 'border-[#ededee] bg-[#f6f6f6] text-[#c0c3c8] cursor-not-allowed';
  const detailId = `detail-${part.id}`;

  return (
    <div
      style={delayStyle(index)}
      className={`${TILE_BASE} ${tone.row} ${expanded ? 'col-span-full' : HOVER}`}
    >
      <div className="flex items-start justify-between gap-2">
        <Head part={part} />
        <StatusBadge tone={result.tone} />
      </div>
      {result.reason && (
        <p className="text-[12px] leading-snug text-[#6f7178]">{result.reason}</p>
      )}
      <div className="mt-auto flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={detailId}
          className="min-h-9 whitespace-nowrap rounded-lg border border-[#e7e8ea] bg-white px-3 py-1.5 text-[12.5px] font-semibold text-[#5c5f66] hover:bg-[#f7f8fa]"
        >
          {detailLabel}
        </button>
        <span className="flex-1" />
        <button
          type="button"
          onClick={() => addToBuild(part.id)}
          disabled={!canAdd || added}
          aria-label={canAdd ? `Add ${part.brand} ${part.name} to build` : `${part.name} is unrelated`}
          className={`min-h-9 whitespace-nowrap rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold ${addClass}`}
        >
          {addLabel}
        </button>
      </div>
      {expanded && (
        <div id={detailId} className="motion-safe:animate-tile-in">
          <SpecCompare detail={result.detail} />
        </div>
      )}
    </div>
  );
}

function BuildTile({
  part,
  pinned,
  conflict,
  index,
  onRemove,
}: {
  part: Part;
  pinned: boolean;
  conflict?: BuildConflict;
  index: number;
  onRemove: (id: string) => void;
}) {
  return (
    <div
      style={delayStyle(index)}
      className={`${TILE_BASE} ${conflict ? 'border-conflict-rowb bg-conflict-row' : 'border-fits-rowb bg-fits-row'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <Head part={part} />
        {pinned ? (
          <span className="flex-none rounded bg-[#f0f1f3] px-1.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.04em] text-[#6f7178]">
            You have
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onRemove(part.id)}
            aria-label={`Remove ${part.brand} ${part.name} from build`}
            className="flex h-9 w-9 flex-none items-center justify-center rounded-lg text-[18px] leading-none text-[#c0c3c8] hover:bg-white hover:text-[#6f7178]"
          >
            ×
          </button>
        )}
      </div>
      {conflict && (
        <p className="text-[12px] leading-snug text-conflict-fg">
          Conflicts with {conflict.other.brand} {conflict.other.name} — {conflict.reason}
        </p>
      )}
      <div className="mt-auto pt-1">
        <StatusBadge tone={conflict ? 'conflict' : 'fits'} />
      </div>
    </div>
  );
}

type PartTileProps =
  | { mode: 'pick'; part: Part; index: number; onPick: (id: string) => void }
  | { mode: 'result'; item: GroupItem; index: number }
  | {
      mode: 'build';
      part: Part;
      pinned: boolean;
      conflict?: BuildConflict;
      index: number;
      onRemove: (id: string) => void;
    };

export function PartTile(props: PartTileProps) {
  if (props.mode === 'pick') return <PickTile part={props.part} index={props.index} onPick={props.onPick} />;
  if (props.mode === 'result') return <ResultTile item={props.item} index={props.index} />;
  return (
    <BuildTile
      part={props.part}
      pinned={props.pinned}
      conflict={props.conflict}
      index={props.index}
      onRemove={props.onRemove}
    />
  );
}
