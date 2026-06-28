import { Link } from 'react-router-dom';
import { useBuildCheck } from '../hooks';
import { useStore } from '../store/useStore';
import { BuildBanner } from '../components/BuildBanner';
import { PartTile } from '../components/PartTile';
import { TileGrid } from '../components/TileGrid';
import { IconPlus } from '../components/icons';

export function MyBuild() {
  const { rows, hasConflict } = useBuildCheck();
  const removeFromBuild = useStore((s) => s.removeFromBuild);

  return (
    <div className="flex flex-col gap-4">
      <BuildBanner hasConflict={hasConflict} partCount={rows.length} />

      <TileGrid
        items={rows}
        resetKey={`${rows.length}-${hasConflict}`}
        renderItem={(r, i) => (
          <PartTile
            key={r.part.id}
            mode="build"
            part={r.part}
            pinned={r.pinned}
            conflict={r.conflict}
            index={i}
            onRemove={removeFromBuild}
          />
        )}
      />

      <Link
        to="/results"
        className="inline-flex min-h-11 items-center gap-2 self-start text-[13.5px] font-semibold text-accent"
      >
        <IconPlus />
        Add more compatible parts
      </Link>
    </div>
  );
}
