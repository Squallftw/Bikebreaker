import { NavLink } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useBuildCheck } from '../hooks';
import { IconSearch, IconLink, IconBuild, IconHelp } from './icons';

const NAV = [
  { to: '/pick', label: 'Your part', Icon: IconSearch },
  { to: '/results', label: 'What fits', Icon: IconLink },
  { to: '/build', label: 'Your build', Icon: IconBuild },
] as const;

export function Sidebar() {
  const closeNav = useStore((s) => s.closeNav);
  const { rows, hasConflict } = useBuildCheck();
  const count = rows.length;

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex min-h-11 items-center gap-3 rounded-[9px] px-3 py-2.5 text-sm transition ${
      isActive
        ? 'bg-sidebar-pill font-semibold text-white shadow-[inset_0_0_0_1px_#393940]'
        : 'font-medium text-sidebar-nav hover:text-white'
    }`;

  return (
    <div className="flex h-full flex-col px-4 py-5">
      {/* logo */}
      <div className="flex items-center gap-2.5 px-2 pb-5">
        <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-accent font-mono text-[15px] font-bold text-white">
          B
        </span>
        <span className="text-base font-semibold tracking-tight text-white">BikeBreaker</span>
      </div>

      <p className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.07em] text-sidebar-label">
        Main menu
      </p>
      <nav className="flex flex-col gap-[3px]">
        {NAV.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} className={navClass} onClick={closeNav}>
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      <p className="px-2 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-[0.07em] text-sidebar-label">
        Preferences
      </p>
      <span className="flex min-h-11 items-center gap-3 rounded-[9px] px-3 py-2.5 text-sm font-medium text-sidebar-nav opacity-70">
        <IconHelp />
        Help center
      </span>

      {/* Live build status — present on every screen */}
      <div className="mt-auto pt-5">
        <NavLink
          to="/build"
          onClick={closeNav}
          className="block rounded-[14px] border border-sidebar-card-border bg-sidebar-card p-4 text-left"
        >
          <div className="mb-2.5 flex items-center gap-2.5">
            <span
              className={`h-2.5 w-2.5 flex-none rounded-full ${
                hasConflict
                  ? 'bg-conflict-dot shadow-[0_0_0_4px_rgba(224,71,58,0.18)]'
                  : 'bg-fits-dot shadow-[0_0_0_4px_rgba(31,157,87,0.18)]'
              }`}
            />
            <span className="text-[13.5px] font-semibold text-white">
              {hasConflict ? 'Conflict found' : 'Build compatible'}
            </span>
          </div>
          <p className="mb-3 text-[12.5px] leading-snug text-sidebar-nav">
            {count} part{count === 1 ? '' : 's'} total —{' '}
            {hasConflict ? 'review the flagged part' : 'all interfaces check out'}.
          </p>
          <span className="flex items-center justify-center rounded-lg bg-accent px-3 py-2.5 text-[13px] font-semibold text-white">
            View build
          </span>
        </NavLink>
      </div>
    </div>
  );
}
