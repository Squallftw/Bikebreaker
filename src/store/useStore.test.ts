import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './useStore';

beforeEach(() => {
  localStorage.clear();
  useStore.setState({ ownedPartId: 'canyon-cfr', build: [], navOpen: true });
});

describe('useStore', () => {
  it('sets the owned part and persists it to localStorage', () => {
    useStore.getState().setOwnedPart('spec-sl8');
    expect(useStore.getState().ownedPartId).toBe('spec-sl8');
    expect(localStorage.getItem('bikebreaker:v1')).toContain('spec-sl8');
  });

  it('adds to the build without duplicates and never the owned part', () => {
    const { addToBuild } = useStore.getState();
    addToBuild('zipp-303');
    addToBuild('zipp-303'); // duplicate ignored
    addToBuild('canyon-cfr'); // owner ignored
    expect(useStore.getState().build).toEqual(['zipp-303']);
  });

  it('removes a part from the build', () => {
    useStore.setState({ build: ['zipp-303', 'shimano-bb-r9100'] });
    useStore.getState().removeFromBuild('zipp-303');
    expect(useStore.getState().build).toEqual(['shimano-bb-r9100']);
  });

  it('drops the newly-owned part from the build', () => {
    useStore.setState({ build: ['zipp-303'] });
    useStore.getState().setOwnedPart('zipp-303');
    expect(useStore.getState().build).toEqual([]);
    expect(useStore.getState().ownedPartId).toBe('zipp-303');
  });

  it('reports build membership', () => {
    useStore.setState({ build: ['zipp-303'] });
    expect(useStore.getState().isInBuild('zipp-303')).toBe(true);
    expect(useStore.getState().isInBuild('shimano-bb-r9100')).toBe(false);
  });
});

describe('deferred hydration (skipHydration + rehydrate)', () => {
  it('validates persisted state against the catalog, dropping stale ids', async () => {
    // Persist a payload with a valid owner, one valid build id, and one stale id.
    localStorage.setItem(
      'bikebreaker:v1',
      JSON.stringify({
        state: {
          ownedPartId: 'spec-sl8',
          build: ['zipp-303', 'totally-not-a-real-id'],
          hasChosen: true,
        },
        version: 0,
      }),
    );

    await useStore.persist.rehydrate(); // runs merge/isKnown against the catalog

    const s = useStore.getState();
    expect(s.ownedPartId).toBe('spec-sl8');
    expect(s.hasChosen).toBe(true);
    expect(s.build).toEqual(['zipp-303']); // stale id filtered out
  });

  it('falls back to the default owner when the persisted id is unknown', async () => {
    localStorage.setItem(
      'bikebreaker:v1',
      JSON.stringify({ state: { ownedPartId: 'ghost-part', build: [], hasChosen: true }, version: 0 }),
    );

    await useStore.persist.rehydrate();

    expect(useStore.getState().ownedPartId).toBe('canyon-cfr');
  });
});
