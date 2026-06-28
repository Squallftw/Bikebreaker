import type { CompatGroup } from '../lib/results';
import { PartTile } from './PartTile';
import { TileGrid } from './TileGrid';

/** A relationship group: a white panel with a tile grid of candidate parts. */
export function ResultGroup({ group }: { group: CompatGroup }) {
  return (
    <section className="rounded-2xl border border-hairline bg-white p-4">
      <header className="flex items-center justify-between gap-3 pb-3.5">
        <div className="min-w-0">
          <h3 className="text-[15.5px] font-semibold leading-tight tracking-tight">{group.title}</h3>
          <p className="mt-0.5 text-[12.5px] text-[#abaeb4]">{group.subtitle}</p>
        </div>
        <span className="whitespace-nowrap rounded-md bg-[#f4f5f7] px-2.5 py-1 font-mono text-xs text-[#82858c]">
          {group.fitCount} of {group.total} fit
        </span>
      </header>

      {group.items.length === 0 ? (
        <p className="text-[13px] text-[#abaeb4]">No catalog parts of this type yet.</p>
      ) : (
        <TileGrid
          items={group.items}
          resetKey={group.type}
          renderItem={(it, i) => <PartTile key={it.part.id} mode="result" item={it} index={i} />}
        />
      )}
    </section>
  );
}
