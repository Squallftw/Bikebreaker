import type { ReactNode } from 'react';

// ────────────────────────────────────────────────────────────────────────────
// Responsive grid for animated part tiles. `renderItem` returns the (keyed) tile
// directly as a grid child, so a result tile can span the full width when it
// expands. Entrance staggering is per-tile (each tile reads its index); changing
// `resetKey` remounts the grid to re-trigger the entrance on a reflow (e.g. a
// category change).
// ────────────────────────────────────────────────────────────────────────────

export function TileGrid<T>({
  items,
  renderItem,
  resetKey,
  empty,
}: {
  items: T[];
  /** Must return a keyed element (e.g. `<PartTile key={id} … />`). */
  renderItem: (item: T, index: number) => ReactNode;
  resetKey?: string | number;
  empty?: ReactNode;
}) {
  if (items.length === 0) {
    return (
      <>
        {empty ?? (
          <div className="rounded-[14px] border border-dashed border-[#dcdee1] bg-white px-5 py-[44px] text-center">
            <p className="mb-1 text-[15px] font-semibold text-ink">Nothing here</p>
            <p className="text-[13.5px] text-[#abaeb4]">Try another category or search term.</p>
          </div>
        )}
      </>
    );
  }
  return (
    <div
      key={resetKey}
      className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(190px,1fr))]"
    >
      {items.map((item, i) => renderItem(item, i))}
    </div>
  );
}
