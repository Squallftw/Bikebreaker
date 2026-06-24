import type { CompatGroup } from '../lib/results';
import { ResultRow } from './ResultRow';

/** A relationship group: a white panel of candidate rows for one candidate type. */
export function ResultGroup({ group }: { group: CompatGroup }) {
  return (
    <section className="rounded-2xl border border-hairline bg-white p-1.5 pb-2">
      <header className="flex items-center justify-between gap-3 px-3.5 pb-3 pt-3.5">
        <div className="min-w-0">
          <h3 className="text-[15.5px] font-semibold leading-tight tracking-tight">{group.title}</h3>
          <p className="mt-0.5 text-[12.5px] text-[#abaeb4]">{group.subtitle}</p>
        </div>
        <span className="whitespace-nowrap rounded-md bg-[#f4f5f7] px-2.5 py-1 font-mono text-xs text-[#82858c]">
          {group.fitCount} of {group.total} fit
        </span>
      </header>

      {group.items.length === 0 ? (
        <p className="px-3.5 pb-3 text-[13px] text-[#abaeb4]">
          No catalog parts of this type yet.
        </p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {group.items.map((it) => (
            <ResultRow key={it.part.id} item={it} />
          ))}
        </div>
      )}
    </section>
  );
}
