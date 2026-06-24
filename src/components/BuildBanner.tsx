import { IconCheck, IconAlert } from './icons';

/** Green/red holistic status banner for the My Build screen. */
export function BuildBanner({
  hasConflict,
  partCount,
}: {
  hasConflict: boolean;
  partCount: number;
}) {
  const sub = hasConflict
    ? 'One part clashes with another — swap it to clear your build.'
    : `All ${partCount} part${partCount === 1 ? '' : 's'} share compatible interfaces.`;

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-[22px] ${
        hasConflict ? 'border-[#f5d9d5] bg-[#fdf3f2]' : 'border-[#d3ecdd] bg-[#f1faf4]'
      }`}
    >
      <div className="flex items-center gap-3.5">
        <span
          className={`flex h-12 w-12 flex-none items-center justify-center rounded-[13px] text-white ${
            hasConflict ? 'bg-conflict-dot' : 'bg-fits-dot'
          }`}
        >
          {hasConflict ? <IconAlert /> : <IconCheck />}
        </span>
        <div>
          <h2
            className={`text-[21px] font-semibold tracking-tight ${
              hasConflict ? 'text-conflict-fg' : 'text-fits-fg'
            }`}
          >
            {hasConflict ? 'Conflict' : 'Compatible'}
          </h2>
          <p className="mt-0.5 text-[13.5px] text-[#6f7178]">{sub}</p>
        </div>
      </div>
    </div>
  );
}
