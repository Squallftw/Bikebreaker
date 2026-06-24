import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { OwnedPartBar } from './OwnedPartBar';

const NARROW_BP = 900;

export function Layout() {
  const navOpen = useStore((s) => s.navOpen);
  const setNavOpen = useStore((s) => s.setNavOpen);
  const closeNav = useStore((s) => s.closeNav);
  const [narrow, setNarrow] = useState(false);
  const asideRef = useRef<HTMLElement>(null);

  // Track viewport: below the breakpoint the sidebar is an off-canvas overlay.
  useEffect(() => {
    const onResize = () => {
      const n = window.innerWidth < NARROW_BP;
      setNarrow(n);
      setNavOpen(!n);
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [setNavOpen]);

  // Esc closes the mobile overlay.
  useEffect(() => {
    if (!narrow || !navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeNav();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [narrow, navOpen, closeNav]);

  // Keep the off-canvas sidebar out of the tab order / a11y tree when hidden.
  useEffect(() => {
    const el = asideRef.current;
    if (!el) return;
    if (narrow && !navOpen) el.setAttribute('inert', '');
    else el.removeAttribute('inert');
  }, [narrow, navOpen]);

  const asideClass = narrow
    ? `fixed left-0 top-0 z-[60] h-screen w-[248px] bg-sidebar transition-transform duration-300 ease-out ${
        navOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-[110%]'
      }`
    : 'sticky top-0 z-30 h-screen w-[248px] flex-none bg-sidebar';

  return (
    <div className="flex min-h-screen bg-content text-ink">
      {narrow && navOpen && (
        <div
          onClick={closeNav}
          aria-hidden="true"
          className="fixed inset-0 z-[55] bg-black/45"
        />
      )}
      <aside ref={asideRef} aria-label="Primary" className={asideClass}>
        <Sidebar />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar narrow={narrow} />
        <main className="mx-auto w-full max-w-[1180px] flex-1 px-7 pb-16 pt-2">
          <OwnedPartBar />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
