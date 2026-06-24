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
});
