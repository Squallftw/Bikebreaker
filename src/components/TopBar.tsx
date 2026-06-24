import { useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useOwner, useBuildCheck } from '../hooks';
import { IconMenu } from './icons';

export function TopBar({ narrow }: { narrow: boolean }) {
  const { pathname } = useLocation();
  const toggleNav = useStore((s) => s.toggleNav);
  const hasChosen = useStore((s) => s.hasChosen);
  const owner = useOwner();
  const { hasConflict } = useBuildCheck();

  const [title, subtitle] = ((): [string, string] => {
    if (pathname.startsWith('/results'))
      return ['What fits', `Everything compatible with your ${owner.type}`];
    if (pathname.startsWith('/build'))
      return [
        'Your build',
        hasConflict ? 'A conflict needs your attention' : 'Everything in your build is compatible',
      ];
    // default + /pick
    return [
      'Your part',
      hasChosen
        ? 'Change the part you own'
        : 'Tell us one part you own — we’ll show everything that fits',
    ];
  })();

  return (
    <header className="sticky top-0 z-30 bg-content/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1180px] items-center gap-3.5 px-7 py-[18px]">
        {narrow && (
          <button
            type="button"
            onClick={toggleNav}
            aria-label="Open navigation"
            className="flex h-11 w-11 flex-none items-center justify-center rounded-[9px] border border-[#e1e2e5] bg-white text-[#3a3d44]"
          >
            <IconMenu />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[21px] font-semibold leading-tight tracking-tight">{title}</h1>
          <p className="mt-0.5 truncate text-[13px] text-[#82858c]">{subtitle}</p>
        </div>
        <span
          aria-hidden="true"
          className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full bg-gradient-to-br from-accent to-[#7c4ec4] text-[13px] font-semibold text-white"
        >
          AR
        </span>
      </div>
    </header>
  );
}
