import { describe, it, expect } from 'vitest';
import { searchCatalog } from './search';
import type { Part } from '../types';

const fixtures: Part[] = [
  { id: 'shimano-gs-r9200', type: 'groupset', brand: 'Shimano', name: 'Dura-Ace R9200 Di2', spec: '12s · Di2 · disc · HG', attrs: { group: 'shimano12', speed: 12, actuation: 'Di2', brake: 'disc', crankSpindle: '24HTII', freehub: 'HG' } },
  { id: 'sram-force-cass', type: 'cassette', brand: 'SRAM', name: 'Force XG-1270', spec: '12-speed · XDR freehub', attrs: { freehub: 'XDR', group: 'sram12', speed: 12 } },
  { id: 'canyon-cfr', type: 'frame', brand: 'Canyon', name: 'Ultimate CFR', spec: 'BSA · disc', attrs: { bbShell: 'BSA', axle: '142x12', brake: 'disc', steerer: 'tapered' } },
];

describe('searchCatalog', () => {
  it('returns nothing for an empty query', () => {
    expect(searchCatalog(fixtures, '')).toEqual([]);
    expect(searchCatalog(fixtures, '   ')).toEqual([]);
  });

  it('matches on brand, case-insensitively', () => {
    const ids = searchCatalog(fixtures, 'shimano').map((p) => p.id);
    expect(ids).toEqual(['shimano-gs-r9200']);
  });

  it('matches on the human type label', () => {
    const ids = searchCatalog(fixtures, 'groupset').map((p) => p.id);
    expect(ids).toEqual(['shimano-gs-r9200']);
  });

  it('matches on a derived spec term (xdr)', () => {
    const ids = searchCatalog(fixtures, 'xdr').map((p) => p.id);
    expect(ids).toEqual(['sram-force-cass']);
  });

  it('ANDs across terms (narrowing the result set)', () => {
    expect(searchCatalog(fixtures, 'dura').map((p) => p.id)).toEqual(['shimano-gs-r9200']);
    expect(searchCatalog(fixtures, 'dura sram')).toEqual([]);
  });

  it('returns empty when nothing matches', () => {
    expect(searchCatalog(fixtures, 'zzzzz')).toEqual([]);
  });
});
