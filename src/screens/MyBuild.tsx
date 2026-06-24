import { Link } from 'react-router-dom';
import { useBuildCheck } from '../hooks';
import { useStore } from '../store/useStore';
import { BuildBanner } from '../components/BuildBanner';
import { PartTypeIcon } from '../components/PartTypeIcon';
import { StatusBadge } from '../components/StatusBadge';
import { IconPlus } from '../components/icons';

export function MyBuild() {
  const { rows, hasConflict } = useBuildCheck();
  const removeFromBuild = useStore((s) => s.removeFromBuild);

  return (
    <div className="flex flex-col gap-4">
      <BuildBanner hasConflict={hasConflict} partCount={rows.length} />

      <div className="rounded-2xl border border-hairline bg-white p-2">
        <div className="flex flex-col gap-1.5">
          {rows.map(({ part, pinned, conflict }) => (
            <div
              key={part.id}
              className={`flex items-center gap-3.5 rounded-xl border p-3.5 ${
                conflict ? 'border-conflict-rowb bg-conflict-row' : 'border-fits-rowb bg-fits-row'
              }`}
            >
              <PartTypeIcon type={part.type} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-[#abaeb4]">
                    {part.brand}
                  </span>
                  {pinned && (
                    <span className="rounded bg-[#f0f1f3] px-1.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.04em] text-[#6f7178]">
                      You have
                    </span>
                  )}
                </div>
                <span className="mt-0.5 block text-[15px] font-semibold text-ink">{part.name}</span>
                {conflict && (
                  <span className="mt-1 block text-[12.5px] leading-snug text-conflict-fg">
                    Conflicts with {conflict.other.brand} {conflict.other.name} — {conflict.reason}
                  </span>
                )}
              </div>
              <StatusBadge tone={conflict ? 'conflict' : 'fits'} />
              {!pinned && (
                <button
                  type="button"
                  onClick={() => removeFromBuild(part.id)}
                  aria-label={`Remove ${part.brand} ${part.name} from build`}
                  className="flex h-11 w-11 flex-none items-center justify-center rounded-lg text-[20px] leading-none text-[#c0c3c8] hover:bg-[#f4f5f7] hover:text-[#6f7178]"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="px-3 pb-2 pt-3.5">
          <Link
            to="/results"
            className="inline-flex min-h-11 items-center gap-2 text-[13.5px] font-semibold text-accent"
          >
            <IconPlus />
            Add more compatible parts
          </Link>
        </div>
      </div>
    </div>
  );
}
