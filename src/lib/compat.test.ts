import { describe, it, expect } from 'vitest';
import { compat } from './compat';
import type { Part } from '../types';

// ── Inline fixtures (engine tested in isolation from the catalog) ────────────
const frameBSAdisc: Part = { id: 'f-bsa', type: 'frame', brand: 'Canyon', name: 'BSA disc', spec: '', attrs: { bbShell: 'BSA', axle: '142x12', brake: 'disc', steerer: 'tapered' } };
const frameT47disc: Part = { id: 'f-t47', type: 'frame', brand: 'Spec', name: 'T47 disc', spec: '', attrs: { bbShell: 'T47', axle: '142x12', brake: 'disc', steerer: 'tapered' } };
const frameBSArim: Part = { id: 'f-rim', type: 'frame', brand: 'Cdale', name: 'BSA rim', spec: '', attrs: { bbShell: 'BSA', axle: 'QR130', brake: 'rim', steerer: 'straight' } };

const crank24: Part = { id: 'c-24', type: 'crankset', brand: 'Shimano', name: 'Ultegra', spec: '', attrs: { spindle: '24HTII', group: 'shimano12', speed: 12 } };
const crankDUB: Part = { id: 'c-dub', type: 'crankset', brand: 'SRAM', name: 'Rival', spec: '', attrs: { spindle: 'DUB', group: 'sram12', speed: 12 } };
const crankProTech: Part = { id: 'c-pt', type: 'crankset', brand: 'Campagnolo', name: 'Super Record', spec: '', attrs: { spindle: 'ProTech', group: 'campy12', speed: 12 } };

const bbBSA24: Part = { id: 'b-bsa24', type: 'bb', brand: 'Shimano', name: 'BBR60', spec: '', attrs: { shell: 'BSA', bbBore: '24' } };
const bbBSA2899: Part = { id: 'b-dub', type: 'bb', brand: 'SRAM', name: 'DUB BSA', spec: '', attrs: { shell: 'BSA', bbBore: '28.99' } };
const bbT4724: Part = { id: 'b-t47', type: 'bb', brand: 'WM', name: 'T47', spec: '', attrs: { shell: 'T47', bbBore: '24' } };

const wheelDiscBoth: Part = { id: 'w-303', type: 'wheelset', brand: 'Zipp', name: '303', spec: '', attrs: { axle: '142x12', frontAxle: '100x12', brake: 'disc', freehubs: ['HG', 'XDR'], rimInternal: 25, hookless: true } };
const wheelDiscXDR: Part = { id: 'w-404', type: 'wheelset', brand: 'Zipp', name: '404', spec: '', attrs: { axle: '142x12', frontAxle: '100x12', brake: 'disc', freehubs: ['XDR'], rimInternal: 23, hookless: true } };
const wheelQR135disc: Part = { id: 'w-r5', type: 'wheelset', brand: 'Fulcrum', name: 'Racing 5', spec: '', attrs: { axle: 'QR135', frontAxle: 'QR100', brake: 'disc', freehubs: ['HG'], rimInternal: 19, hookless: false } };
const wheelQR130rim: Part = { id: 'w-op', type: 'wheelset', brand: 'Mavic', name: 'Open Pro', spec: '', attrs: { axle: 'QR130', frontAxle: 'QR100', brake: 'rim', freehubs: ['HG'], rimInternal: 19, hookless: false } };

const cassHG12: Part = { id: 'k-ult', type: 'cassette', brand: 'Shimano', name: 'Ultegra 12', spec: '', attrs: { freehub: 'HG', group: 'shimano12', speed: 12 } };
const cassHG11: Part = { id: 'k-105', type: 'cassette', brand: 'Shimano', name: '105 11', spec: '', attrs: { freehub: 'HG', group: 'shimano11', speed: 11 } };
const cassXDR12: Part = { id: 'k-force', type: 'cassette', brand: 'SRAM', name: 'Force 12', spec: '', attrs: { freehub: 'XDR', group: 'sram12', speed: 12 } };

const tire30HL: Part = { id: 't-30', type: 'tire', brand: 'Conti', name: 'GP5000 30', spec: '', attrs: { width: 30, tubeless: true, hooklessOK: true } };
const tire28Hooked: Part = { id: 't-28', type: 'tire', brand: 'Conti', name: 'GP5000 28', spec: '', attrs: { width: 28, tubeless: false, hooklessOK: false } };
const tire25Hooked: Part = { id: 't-25', type: 'tire', brand: 'Vittoria', name: 'Corsa 25', spec: '', attrs: { width: 25, tubeless: false, hooklessOK: false } };
// Synthetic: hookless-approved but too narrow — exercises the width branch.
const tire25HL: Part = { id: 't-25hl', type: 'tire', brand: 'Test', name: 'Narrow HL', spec: '', attrs: { width: 25, tubeless: true, hooklessOK: true } };

const forkDiscTapered: Part = { id: 'fk-enve', type: 'fork', brand: 'ENVE', name: 'Road Disc', spec: '', attrs: { axle: '100x12', brake: 'disc', steerer: 'tapered' } };
const forkDiscStraight: Part = { id: 'fk-whisky', type: 'fork', brand: 'Whisky', name: 'No.9', spec: '', attrs: { axle: 'QR100', brake: 'disc', steerer: 'straight' } };
const forkRimStraight: Part = { id: 'fk-columbus', type: 'fork', brand: 'Columbus', name: 'Futura', spec: '', attrs: { axle: 'QR100', brake: 'rim', steerer: 'straight' } };

const chainShim12: Part = { id: 'ch-shim12', type: 'chain', brand: 'Shimano', name: 'CN-M8100', spec: '', attrs: { speed: 12, flatTop: false } };
const chainSram12: Part = { id: 'ch-sram12', type: 'chain', brand: 'SRAM', name: 'Force Flattop', spec: '', attrs: { speed: 12, flatTop: true } };
const chainShim11: Part = { id: 'ch-shim11', type: 'chain', brand: 'Shimano', name: '105 11s', spec: '', attrs: { speed: 11, flatTop: false } };

const crank10: Part = { id: 'c-10', type: 'crankset', brand: 'Shimano', name: 'Tiagra', spec: '', attrs: { spindle: '24HTII', group: 'shimano10', speed: 10 } };
const cass10: Part = { id: 'k-10', type: 'cassette', brand: 'Shimano', name: 'Tiagra 10', spec: '', attrs: { freehub: 'HG', group: 'shimano10', speed: 10 } };
const frameBB86: Part = { id: 'f-bb86', type: 'frame', brand: 'Giant', name: 'TCR', spec: '', attrs: { bbShell: 'BB86', axle: '142x12', brake: 'disc', steerer: 'tapered' } };
const bbBB86: Part = { id: 'b-bb86', type: 'bb', brand: 'Shimano', name: 'SM-BB72', spec: '', attrs: { shell: 'BB86', bbBore: '24' } };

const failingRow = (r: ReturnType<typeof compat>) => r.detail.find((d) => !d.ok);

describe('frame × crankset', () => {
  it('fits a threaded-spindle crank (right BB adapts the shell)', () => {
    const r = compat(frameBSAdisc, crank24);
    expect(r.tone).toBe('fits');
    expect(r.detail.every((d) => d.ok)).toBe(true);
  });
  it('conflicts when the crank needs a press-fit frame (ProTech)', () => {
    const r = compat(frameBSAdisc, crankProTech);
    expect(r.tone).toBe('conflict');
    expect(r.reason).toMatch(/press-fit|ProTech/i);
    expect(failingRow(r)?.label).toBe('BB shell');
  });
});

describe('frame × wheelset', () => {
  it('fits when axle and brake match', () => {
    expect(compat(frameBSAdisc, wheelDiscBoth).tone).toBe('fits');
  });
  it('conflicts on axle mismatch (same brake)', () => {
    const r = compat(frameBSAdisc, wheelQR135disc);
    expect(r.tone).toBe('conflict');
    expect(failingRow(r)?.label).toBe('Axle');
  });
  it('is unrelated when the braking interface differs', () => {
    const r = compat(frameBSAdisc, wheelQR130rim);
    expect(r.tone).toBe('unrelated');
    expect(r.reason).toMatch(/braking interface/i);
  });
});

describe('frame × bb', () => {
  it('fits when shells match', () => {
    expect(compat(frameBSAdisc, bbBSA24).tone).toBe('fits');
  });
  it('conflicts when shells differ', () => {
    const r = compat(frameBSAdisc, bbT4724);
    expect(r.tone).toBe('conflict');
    expect(failingRow(r)?.label).toBe('Shell');
  });
});

describe('crankset × bb', () => {
  it('fits when bore matches the spindle (24HTII → 24)', () => {
    expect(compat(crank24, bbBSA24).tone).toBe('fits');
  });
  it('conflicts when bore is wrong for the spindle (24HTII vs 28.99)', () => {
    const r = compat(crank24, bbBSA2899);
    expect(r.tone).toBe('conflict');
    expect(failingRow(r)).toBeTruthy();
  });
  it('fits DUB spindle with a 28.99 bore', () => {
    expect(compat(crankDUB, bbBSA2899).tone).toBe('fits');
  });
  it('fits ProTech (no required bore)', () => {
    expect(compat(crankProTech, bbBSA24).tone).toBe('fits');
  });
});

describe('crankset × cassette', () => {
  it('fits same speed + same group', () => {
    expect(compat(crank24, cassHG12).tone).toBe('fits');
  });
  it('conflicts same speed, different indexing group', () => {
    const r = compat(crankDUB, cassHG12); // both 12-speed, sram vs shimano
    expect(r.tone).toBe('conflict');
    expect(failingRow(r)?.label).toBe('Indexing');
  });
  it('is unrelated when speed counts differ', () => {
    const r = compat(crank24, cassHG11); // 12 vs 11
    expect(r.tone).toBe('unrelated');
    expect(failingRow(r)?.label).toBe('Speed');
  });
});

describe('wheelset × cassette', () => {
  it('fits when the freehub body is available', () => {
    expect(compat(wheelDiscBoth, cassHG12).tone).toBe('fits');
  });
  it('conflicts when the wheel lacks the cassette freehub', () => {
    const r = compat(wheelDiscXDR, cassHG12); // XDR-only wheel, HG cassette
    expect(r.tone).toBe('conflict');
    expect(failingRow(r)?.label).toBe('Freehub');
  });
  it('fits an XDR cassette on an XDR-capable wheel', () => {
    expect(compat(wheelDiscBoth, cassXDR12).tone).toBe('fits');
  });
});

describe('wheelset × tire', () => {
  it('fits a hookless-approved wide tubeless tire on a hookless rim', () => {
    expect(compat(wheelDiscBoth, tire30HL).tone).toBe('fits');
  });
  it('conflicts when the tire is not hookless-rated on a hookless rim', () => {
    const r = compat(wheelDiscBoth, tire28Hooked);
    expect(r.tone).toBe('conflict');
    expect(failingRow(r)?.label).toBe('Rim type');
  });
  it('conflicts when a hookless-approved tire is too narrow (<28mm)', () => {
    const r = compat(wheelDiscBoth, tire25HL);
    expect(r.tone).toBe('conflict');
    expect(failingRow(r)?.label).toBe('Width');
  });
  it('fits anything on a hooked rim', () => {
    expect(compat(wheelQR135disc, tire25Hooked).tone).toBe('fits');
  });
});

describe('fork × frame', () => {
  it('fits when steerer and brake match', () => {
    expect(compat(forkDiscTapered, frameBSAdisc).tone).toBe('fits');
  });
  it('conflicts on steerer mismatch (same brake)', () => {
    const r = compat(forkDiscStraight, frameBSAdisc); // straight steerer vs tapered head tube, both disc
    expect(r.tone).toBe('conflict');
    expect(failingRow(r)?.label).toBe('Steerer');
  });
  it('is unrelated when the braking interface differs', () => {
    const r = compat(forkDiscTapered, frameBSArim); // disc fork vs rim frame
    expect(r.tone).toBe('unrelated');
    expect(r.reason).toMatch(/braking interface/i);
  });
});

describe('fork × wheelset', () => {
  it('fits when front axle and brake match', () => {
    expect(compat(forkDiscTapered, wheelDiscBoth).tone).toBe('fits');
  });
  it('conflicts on front-axle mismatch (same brake)', () => {
    const r = compat(forkDiscTapered, wheelQR135disc); // 100x12 fork vs QR100 disc wheel
    expect(r.tone).toBe('conflict');
    expect(failingRow(r)?.label).toBe('Front axle');
  });
  it('is unrelated when the braking interface differs', () => {
    const r = compat(forkRimStraight, wheelDiscBoth); // rim fork vs disc wheel
    expect(r.tone).toBe('unrelated');
  });
});

describe('chain × cassette / crankset', () => {
  it('fits a standard 12-speed chain with a Shimano 12-speed cassette', () => {
    expect(compat(chainShim12, cassHG12).tone).toBe('fits');
  });
  it('conflicts: SRAM AXS needs a Flattop chain (standard chain on sram12 cassette)', () => {
    const r = compat(chainShim12, cassXDR12);
    expect(r.tone).toBe('conflict');
    expect(failingRow(r)?.label).toBe('Chain type');
  });
  it('conflicts: Flattop chain on a Shimano crankset', () => {
    const r = compat(chainSram12, crank24);
    expect(r.tone).toBe('conflict');
    expect(failingRow(r)?.label).toBe('Chain type');
  });
  it('fits a Flattop chain with a SRAM 12-speed cassette', () => {
    expect(compat(chainSram12, cassXDR12).tone).toBe('fits');
  });
  it('is unrelated when speed counts differ', () => {
    const r = compat(chainShim12, cassHG11);
    expect(r.tone).toBe('unrelated');
    expect(failingRow(r)?.label).toBe('Speed');
  });
  it('checks against cranksets too (fits Shimano 12-speed crank)', () => {
    expect(compat(chainShim12, crank24).tone).toBe('fits');
  });
  it('fits an 11-speed chain with an 11-speed cassette', () => {
    expect(compat(chainShim11, cassHG11).tone).toBe('fits');
  });
});

describe('extended schema (entry-level + press-fit)', () => {
  it('fits a 10-speed crank with a 10-speed cassette', () => {
    expect(compat(crank10, cass10).tone).toBe('fits');
  });
  it('is unrelated across speed counts (10 vs 12)', () => {
    expect(compat(crank10, cassHG12).tone).toBe('unrelated');
  });
  it('fits a press-fit BB86 BB in a press-fit BB86 frame', () => {
    expect(compat(frameBB86, bbBB86).tone).toBe('fits');
  });
  it('conflicts: a press-fit BB in a threaded frame', () => {
    const r = compat(frameBSAdisc, bbBB86); // BSA frame, BB86 BB
    expect(r.tone).toBe('conflict');
    expect(failingRow(r)?.label).toBe('Shell');
  });
  it('conflicts: a threaded BB in a press-fit frame', () => {
    expect(compat(frameBB86, bbBSA24).tone).toBe('conflict');
  });
});

describe('unrelated pairs', () => {
  it('same type is unrelated', () => {
    expect(compat(frameBSAdisc, frameT47disc).tone).toBe('unrelated');
  });
  it('two cranksets are unrelated', () => {
    expect(compat(crank24, crankDUB).tone).toBe('unrelated');
  });
  it('parts with no shared interface are unrelated', () => {
    expect(compat(crank24, wheelDiscBoth).tone).toBe('unrelated');
    expect(compat(frameBSAdisc, cassHG12).tone).toBe('unrelated');
    expect(compat(bbBSA24, tire30HL).tone).toBe('unrelated');
  });
});

describe('engine invariants', () => {
  it('is order-independent (symmetric tone)', () => {
    const pairs: [Part, Part][] = [
      [frameBSAdisc, crank24],
      [frameBSAdisc, crankProTech],
      [frameBSAdisc, wheelQR135disc],
      [frameBSAdisc, wheelQR130rim],
      [crank24, bbBSA2899],
      [wheelDiscXDR, cassHG12],
      [wheelDiscBoth, tire25HL],
      [crankDUB, cassHG12],
      [forkDiscStraight, frameBSAdisc],
      [forkDiscTapered, wheelQR135disc],
      [forkRimStraight, wheelDiscBoth],
      [chainShim12, cassXDR12],
      [chainSram12, crank24],
      [chainShim12, cassHG11],
    ];
    for (const [a, b] of pairs) {
      expect(compat(a, b).tone).toBe(compat(b, a).tone);
    }
  });
  it('always returns a non-empty reason', () => {
    expect(compat(frameBSArim, wheelQR130rim).reason.length).toBeGreaterThan(0);
    expect(compat(frameBSAdisc, crank24).reason.length).toBeGreaterThan(0);
  });
});
