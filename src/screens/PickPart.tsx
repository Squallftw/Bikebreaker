import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATALOG } from '../data/catalog';
import { useStore } from '../store/useStore';
import { PICKABLE_TYPES } from '../theme/tokens';
import type { PartType } from '../types';
import { PartChip } from '../components/PartChip';
import { PartSearch } from '../components/PartSearch';
import { PartTile } from '../components/PartTile';
import { TileGrid } from '../components/TileGrid';

export function PickPart() {
  const navigate = useNavigate();
  const setOwnedPart = useStore((s) => s.setOwnedPart);
  const [selectedType, setSelectedType] = useState<PartType | null>(null);

  const pick = (id: string) => {
    setOwnedPart(id);
    navigate('/results');
  };

  const parts = useMemo(
    () => (selectedType ? CATALOG.filter((p) => p.type === selectedType) : CATALOG),
    [selectedType],
  );

  return (
    <div className="flex flex-col gap-4">
      <PartSearch variant="full" autoFocus onSelect={pick} />

      <p className="px-0.5 text-[13.5px] text-[#6f7178]">
        Search above, or browse a category and tap the part you own.
      </p>

      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => setSelectedType(null)}
          aria-pressed={selectedType === null}
          className={`inline-flex min-h-11 items-center rounded-xl border bg-white px-4 py-2 text-sm font-medium text-ink transition ${
            selectedType === null ? 'border-accent ring-1 ring-accent' : 'border-[#e7e8ea] hover:border-[#d6d8dc]'
          }`}
        >
          All parts
        </button>
        {PICKABLE_TYPES.map((t) => (
          <PartChip key={t} type={t} active={selectedType === t} onClick={() => setSelectedType(t)} />
        ))}
      </div>

      <TileGrid
        items={parts}
        resetKey={selectedType ?? 'all'}
        renderItem={(p, i) => <PartTile key={p.id} mode="pick" part={p} index={i} onPick={pick} />}
      />
    </div>
  );
}
