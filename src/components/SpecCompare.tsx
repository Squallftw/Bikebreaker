import type { DetailRow } from '../types';
import { DETAIL_DOT } from '../theme/tokens';

/** The per-dimension spec comparison powering the expandable "Why?" panel. */
export function SpecCompare({ detail }: { detail: DetailRow[] }) {
  if (detail.length === 0) {
    return (
      <p className="rounded-xl border border-[#eef0f2] bg-[#f8f9fa] p-3.5 text-[12.5px] text-[#9a9ca1]">
        No shared mechanical interface to compare.
      </p>
    );
  }
  return (
    <dl className="flex flex-col gap-2.5 rounded-xl border border-[#eef0f2] bg-[#f8f9fa] p-3.5">
      {detail.map((d) => (
        <div key={d.label} className="flex items-center gap-2.5">
          <span
            className={`h-[7px] w-[7px] flex-none rounded-full ${d.ok ? DETAIL_DOT.ok : DETAIL_DOT.fail}`}
          />
          <dt className="w-[78px] flex-none font-mono text-[11px] uppercase tracking-[0.04em] text-[#abaeb4]">
            {d.label}
          </dt>
          <dd className="m-0 flex min-w-0 flex-1 flex-wrap items-center gap-1.5 text-[12.5px]">
            <span className="text-[#b0b3b8]">yours</span>
            <span className="rounded-md border border-[#e7e8ea] bg-white px-1.5 py-0.5 font-mono text-[#5c5f66]">
              {d.you}
            </span>
            <span aria-hidden="true" className="text-[#cdcfd3]">
              →
            </span>
            <span className="text-[#b0b3b8]">this</span>
            <span
              className={`rounded-md border px-1.5 py-0.5 font-mono ${
                d.ok
                  ? 'border-[#e7e8ea] bg-white text-[#5c5f66]'
                  : 'border-conflict-border bg-conflict-bg text-conflict-fg'
              }`}
            >
              {d.them}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
