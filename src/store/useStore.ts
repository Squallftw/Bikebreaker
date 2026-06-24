import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CATALOG } from '../data/catalog';

// ────────────────────────────────────────────────────────────────────────────
// Single app store: the owned part, the build, and ephemeral UI state.
// Only ownedPartId + build are persisted to localStorage; nav state is not.
// ────────────────────────────────────────────────────────────────────────────

const STORE_KEY = 'bikebreaker:v1';
const DEFAULT_OWNED = 'canyon-cfr';

const isKnown = (id: string) => CATALOG.some((p) => p.id === id);

interface AppState {
  ownedPartId: string;
  /** False until the user has explicitly chosen their part (vs the seeded default). */
  hasChosen: boolean;
  build: string[];
  navOpen: boolean;

  setOwnedPart: (id: string) => void;
  addToBuild: (id: string) => void;
  removeFromBuild: (id: string) => void;
  isInBuild: (id: string) => boolean;

  toggleNav: () => void;
  closeNav: () => void;
  setNavOpen: (open: boolean) => void;
}

type Persisted = Pick<AppState, 'ownedPartId' | 'build' | 'hasChosen'>;

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      ownedPartId: DEFAULT_OWNED,
      hasChosen: false,
      build: [],
      navOpen: true,

      // Selecting an owned part marks the choice and clears it from the build.
      setOwnedPart: (id) =>
        set((s) => ({ ownedPartId: id, hasChosen: true, build: s.build.filter((b) => b !== id) })),

      addToBuild: (id) =>
        set((s) =>
          s.build.includes(id) || id === s.ownedPartId ? s : { build: [...s.build, id] },
        ),

      removeFromBuild: (id) => set((s) => ({ build: s.build.filter((b) => b !== id) })),

      isInBuild: (id) => get().build.includes(id),

      toggleNav: () => set((s) => ({ navOpen: !s.navOpen })),
      closeNav: () => set({ navOpen: false }),
      setNavOpen: (open) => set({ navOpen: open }),
    }),
    {
      name: STORE_KEY,
      // Hydration is deferred until after the catalog is loaded (see main.tsx),
      // so `merge`/`isKnown` validate against a populated CATALOG, not an empty
      // one. main.tsx calls useStore.persist.rehydrate() once data is ready.
      skipHydration: true,
      partialize: (s): Persisted => ({
        ownedPartId: s.ownedPartId,
        build: s.build,
        hasChosen: s.hasChosen,
      }),
      // Validate against the catalog on hydrate — drop unknown/stale ids.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<Persisted>;
        const ownedPartId =
          p.ownedPartId && isKnown(p.ownedPartId) ? p.ownedPartId : current.ownedPartId;
        const build = Array.isArray(p.build)
          ? p.build.filter((id) => isKnown(id) && id !== ownedPartId)
          : current.build;
        const hasChosen = typeof p.hasChosen === 'boolean' ? p.hasChosen : current.hasChosen;
        return { ...current, ownedPartId, build, hasChosen };
      },
    },
  ),
);
