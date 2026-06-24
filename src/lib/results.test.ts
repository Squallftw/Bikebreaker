import { describe, it, expect } from 'vitest';
import { generateGroups, aggregateKpis, crossCheckBuild } from './results';
import type { Part, Relation } from '../types';

const frameBSA: Part = { id: 'f-bsa', type: 'frame', brand: 'Canyon', name: 'BSA disc', spec: '', attrs: { bbShell: 'BSA', axle: '142x12', brake: 'disc', steerer: 'tapered' } };
const wheelFits: Part = { id: 'w-303', type: 'wheelset', brand: 'Zipp', name: '303', spec: '', attrs: { axle: '142x12', frontAxle: '100x12', brake: 'disc', freehubs: ['HG', 'XDR'], rimInternal: 25, hookless: true } };
const wheelConflict: Part = { id: 'w-r5', type: 'wheelset', brand: 'Fulcrum', name: 'Racing 5', spec: '', attrs: { axle: 'QR135', frontAxle: 'QR100', brake: 'disc', freehubs: ['HG'], rimInternal: 19, hookless: false } };
const wheelUnrelated: Part = { id: 'w-op', type: 'wheelset', brand: 'Mavic', name: 'Open Pro', spec: '', attrs: { axle: 'QR130', frontAxle: 'QR100', brake: 'rim', freehubs: ['HG'], rimInternal: 19, hookless: false } };

const crank24: Part = { id: 'c-24', type: 'crankset', brand: 'Shimano', name: 'Ultegra', spec: '', attrs: { spindle: '24HTII', group: 'shimano12', speed: 12 } };
const bbDUB: Part = { id: 'b-dub', type: 'bb', brand: 'SRAM', name: 'DUB BSA', spec: '', attrs: { shell: 'BSA', bbBore: '28.99' } };
const bb24: Part = { id: 'b-24', type: 'bb', brand: 'Shimano', name: 'BBR60', spec: '', attrs: { shell: 'BSA', bbBore: '24' } };

const catalog: Part[] = [frameBSA, wheelFits, wheelConflict, wheelUnrelated, crank24, bbDUB, bb24];
const wheelRel: Relation[] = [{ type: 'wheelset', title: 'Wheels', subtitle: 'sub' }];

describe('generateGroups', () => {
  it('runs compat against every candidate of the relation type, excluding the owner', () => {
    const [g] = generateGroups(frameBSA, wheelRel, catalog);
    expect(g.total).toBe(3); // three wheelsets, owner is a frame so not excluded here
    expect(g.items.map((i) => i.part.id)).not.toContain(frameBSA.id);
  });

  it('sorts fits → conflict → unrelated', () => {
    const [g] = generateGroups(frameBSA, wheelRel, catalog);
    expect(g.items.map((i) => i.result.tone)).toEqual(['fits', 'conflict', 'unrelated']);
  });

  it('counts fits per group', () => {
    const [g] = generateGroups(frameBSA, wheelRel, catalog);
    expect(g.fitCount).toBe(1);
  });

  it('excludes the owner itself from a same-type group', () => {
    const frameRel: Relation[] = [{ type: 'frame', title: 'Frames', subtitle: '' }];
    const [g] = generateGroups(frameBSA, frameRel, catalog);
    expect(g.items.map((i) => i.part.id)).not.toContain(frameBSA.id);
    expect(g.total).toBe(0); // only one frame in the catalog — the owner
  });
});

describe('aggregateKpis', () => {
  it('sums checked / fits / conflicts and computes the fit ratio', () => {
    const groups = generateGroups(frameBSA, wheelRel, catalog);
    const k = aggregateKpis(groups);
    expect(k.checked).toBe(3);
    expect(k.fits).toBe(1);
    expect(k.conflicts).toBe(1);
    expect(k.fitRatio).toBe(33); // round(1/3 * 100)
  });

  it('is safe with zero candidates', () => {
    const k = aggregateKpis([]);
    expect(k).toEqual({ checked: 0, fits: 0, conflicts: 0, fitRatio: 0 });
  });
});

describe('crossCheckBuild (holistic)', () => {
  it('pins the owner first and marks it non-removable', () => {
    const { rows } = crossCheckBuild(frameBSA, [], catalog);
    expect(rows[0].part.id).toBe(frameBSA.id);
    expect(rows[0].pinned).toBe(true);
    expect(rows).toHaveLength(1);
  });

  it('flags a conflict between two ADDED parts (not just vs the owner)', () => {
    // crank24 fits the BSA frame; bbDUB fits the BSA frame; but crank24 × bbDUB
    // conflict on bore — so the conflict is purely build-internal.
    const { rows, hasConflict } = crossCheckBuild(frameBSA, [crank24.id, bbDUB.id], catalog);
    expect(hasConflict).toBe(true);
    const crankRow = rows.find((r) => r.part.id === crank24.id);
    const bbRow = rows.find((r) => r.part.id === bbDUB.id);
    expect(crankRow?.conflict?.other.id).toBe(bbDUB.id);
    expect(bbRow?.conflict?.other.id).toBe(crank24.id);
    expect(crankRow?.conflict?.reason).toMatch(/bore/i);
    // The owner frame is compatible with both — not flagged.
    expect(rows.find((r) => r.part.id === frameBSA.id)?.conflict).toBeUndefined();
  });

  it('reports no conflict for a fully compatible build', () => {
    const { hasConflict } = crossCheckBuild(frameBSA, [crank24.id, bb24.id, wheelFits.id], catalog);
    expect(hasConflict).toBe(false);
  });

  it('ignores unknown / stale build ids', () => {
    const { rows } = crossCheckBuild(frameBSA, ['does-not-exist'], catalog);
    expect(rows).toHaveLength(1); // only the owner
  });
});
