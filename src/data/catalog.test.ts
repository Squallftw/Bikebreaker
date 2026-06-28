import { describe, it, expect } from 'vitest';
import { CATALOG } from './catalog';
import { validateCatalog } from './validateCatalog';

describe('catalog integrity', () => {
  it('every part passes schema validation', () => {
    expect(() => validateCatalog(CATALOG)).not.toThrow();
  });

  it('has no duplicate ids', () => {
    const ids = CATALOG.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('loaded the sourced Shimano dataset', () => {
    const shimano = CATALOG.filter((p) => p.source?.includes('Shimano'));
    expect(shimano.length).toBeGreaterThanOrEqual(20);
    // A known sourced part is present and correctly typed.
    expect(CATALOG.find((p) => p.id === 'shimano-fc-r9200')?.type).toBe('crankset');
  });

  it('rejects a record with a bad enum value', () => {
    expect(() =>
      validateCatalog([
        { id: 'x', type: 'crankset', brand: 'b', name: 'n', spec: 's', attrs: { spindle: 'BOGUS', group: 'shimano12', speed: 12 } },
      ]),
    ).toThrow(/spindle/);
  });

  it('seeded Shimano groupsets, all HG / 24HTII (phase-1 scope)', () => {
    const groupsets = CATALOG.filter((p) => p.type === 'groupset');
    expect(groupsets.length).toBeGreaterThanOrEqual(8);
    expect(CATALOG.find((p) => p.id === 'shimano-gs-r9200')?.type).toBe('groupset');
    for (const g of groupsets) {
      expect(g.brand).toBe('Shimano');
      if (g.type === 'groupset') {
        expect(g.attrs.freehub).toBe('HG');
        expect(g.attrs.crankSpindle).toBe('24HTII');
      }
    }
  });

  it('rejects a groupset with a bad actuation', () => {
    expect(() =>
      validateCatalog([
        {
          id: 'gx',
          type: 'groupset',
          brand: 'b',
          name: 'n',
          spec: 's',
          attrs: { group: 'shimano12', speed: 12, actuation: 'BOGUS', brake: 'disc', crankSpindle: '24HTII', freehub: 'HG' },
        },
      ]),
    ).toThrow(/actuation/);
  });
});
