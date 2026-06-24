import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the supabase client module; we swap select()'s resolved value per test.
const { selectMock } = vi.hoisted(() => ({ selectMock: vi.fn() }));
vi.mock('./supabase', () => ({
  supabase: { from: () => ({ select: selectMock }) },
}));

import { loadCatalog } from './loadCatalog';
import { CATALOG, partById, setCatalog } from './catalog';

// Snapshot the bundled catalog before any test mutates it, and restore each time.
const ORIGINAL = [...CATALOG];

beforeEach(() => {
  setCatalog(ORIGINAL);
  selectMock.mockReset();
});

describe('loadCatalog', () => {
  it('maps Supabase rows into the catalog and reports the source', async () => {
    const rows = [
      {
        id: 'db-frame',
        type: 'frame',
        brand: 'DBrand',
        name: 'DB Frame',
        spec: 'BSA · disc',
        attrs: { bbShell: 'BSA', axle: '142x12', brake: 'disc', steerer: 'tapered' },
        source: 'db',
      },
      {
        id: 'db-bb',
        type: 'bb',
        brand: 'DBrand',
        name: 'DB BB',
        spec: 'BSA · 24mm',
        attrs: { shell: 'BSA', bbBore: '24' },
        source: null, // must normalise to an omitted (undefined) Part.source
      },
    ];
    selectMock.mockResolvedValue({ data: rows, error: null });

    const result = await loadCatalog();

    expect(result).toEqual({ source: 'supabase', count: 2 });
    expect(CATALOG).toHaveLength(2);
    expect(partById('db-frame')?.source).toBe('db');
    expect(partById('db-bb')?.source).toBeUndefined(); // null → omitted
  });

  it('falls back to the bundled catalog on a query error', async () => {
    selectMock.mockResolvedValue({ data: null, error: { message: 'boom' } });

    const result = await loadCatalog();

    expect(result.source).toBe('fallback');
    expect(partById('canyon-cfr')).toBeDefined(); // bundled data intact
    expect(CATALOG).toEqual(ORIGINAL);
  });

  it('falls back (does not throw) when a row fails validation', async () => {
    const badRows = [
      {
        id: 'bad',
        type: 'frame',
        brand: 'B',
        name: 'N',
        spec: 'S',
        attrs: { bbShell: 'NOPE', axle: '142x12', brake: 'disc', steerer: 'tapered' },
        source: null,
      },
    ];
    selectMock.mockResolvedValue({ data: badRows, error: null });

    const result = await loadCatalog();

    expect(result.source).toBe('fallback');
    expect(CATALOG).toEqual(ORIGINAL); // invalid data never replaced the catalog
  });
});
