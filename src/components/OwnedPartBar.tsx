import { Link, useLocation } from 'react-router-dom';
import { useOwner } from '../hooks';
import { useStore } from '../store/useStore';
import { specsFor } from '../lib/compat';
import { PartTypeIcon } from './PartTypeIcon';

/**
 * The global anchor: what the whole app is measured against. Visible on every
 * screen once a part is chosen, so the owned part is never out of sight.
 * Hidden on the picker (that screen IS where you change it) and before first choice.
 */
export function OwnedPartBar() {
  const hasChosen = useStore((s) => s.hasChosen);
  const owner = useOwner();
  const { pathname } = useLocation();

  if (!hasChosen || pathname.startsWith('/pick')) return null;
  const specs = specsFor(owner).slice(0, 3);

  return (
    <div className="mb-4 flex items-center gap-3.5 rounded-[14px] border border-hairline bg-white px-4 py-3">
      <PartTypeIcon type={owner.type} size="md" />
      <div className="min-w-0 flex-1">
        <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-[#abaeb4]">
          You have
        </span>
        <span className="block truncate text-[15px] font-semibold tracking-tight">
          {owner.brand} {owner.name}
        </span>
      </div>
      <div className="hidden flex-wrap items-center gap-1.5 lg:flex">
        {specs.map((s) => (
          <span
            key={s}
            className="rounded-md border border-hairline bg-[#f4f5f7] px-2 py-1 font-mono text-[11px] text-[#5c5f66]"
          >
            {s}
          </span>
        ))}
      </div>
      <Link
        to="/pick"
        className="flex min-h-11 flex-none items-center rounded-lg border border-[#e7e8ea] bg-[#f1f2f4] px-3.5 py-2 text-[13px] font-semibold text-[#3a3d44] hover:bg-[#e9eaed]"
      >
        Change
      </Link>
    </div>
  );
}
