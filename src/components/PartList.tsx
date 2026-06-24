import type { Part } from '../types';
import { PartTypeIcon } from './PartTypeIcon';
import { IconChevronRight } from './icons';

/** A list of catalog parts as clickable rows, with a no-results empty state. */
export function PartList({
  parts,
  query,
  onPick,
}: {
  parts: Part[];
  query: string;
  onPick: (id: string) => void;
}) {
  if (parts.length === 0) {
    return (
      <div className="rounded-[14px] border border-dashed border-[#dcdee1] bg-white px-5 py-[52px] text-center">
        <p className="mb-1 text-[15px] font-semibold text-ink">
          No parts match {query ? `“${query}”` : 'that filter'}
        </p>
        <p className="text-[13.5px] text-[#abaeb4]">
          Try another brand or model, or pick a different part.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex list-none flex-col gap-2 p-0">
      {parts.map((p) => (
        <li key={p.id}>
          <button
            type="button"
            onClick={() => onPick(p.id)}
            className="flex min-h-11 w-full items-center gap-3.5 rounded-[13px] border border-hairline bg-white px-4 py-3.5 text-left hover:border-[#d6d8dc]"
          >
            <PartTypeIcon type={p.type} size="row" />
            <span className="min-w-0 flex-1">
              <span className="block font-mono text-[11.5px] font-semibold uppercase tracking-[0.05em] text-[#abaeb4]">
                {p.brand}
              </span>
              <span className="mt-0.5 block text-[15px] font-semibold text-ink">{p.name}</span>
              <span className="mt-0.5 block font-mono text-[12.5px] text-[#abaeb4]">{p.spec}</span>
            </span>
            <IconChevronRight className="flex-none text-[#cdcfd3]" />
          </button>
        </li>
      ))}
    </ul>
  );
}
