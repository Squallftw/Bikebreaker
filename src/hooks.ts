import { useMemo } from 'react';
import { useStore } from './store/useStore';
import { CATALOG, partById } from './data/catalog';
import { RELATIONS } from './data/relations';
import { generateGroups, crossCheckBuild } from './lib/results';
import type { Part } from './types';
import type { CompatGroup, BuildCheck } from './lib/results';

/** The currently owned part, always resolvable (falls back to the first catalog entry). */
export function useOwner(): Part {
  const ownedPartId = useStore((s) => s.ownedPartId);
  return useMemo(() => partById(ownedPartId) ?? CATALOG[0], [ownedPartId]);
}

/** Compatibility groups for the owned part (Dashboard + Results). */
export function useGroups(): CompatGroup[] {
  const owner = useOwner();
  return useMemo(() => generateGroups(owner, RELATIONS[owner.type], CATALOG), [owner]);
}

/** Holistic build cross-check (Sidebar status card, TopBar subtitle, My Build). */
export function useBuildCheck(): BuildCheck {
  const owner = useOwner();
  const build = useStore((s) => s.build);
  return useMemo(() => crossCheckBuild(owner, build, CATALOG), [owner, build]);
}
