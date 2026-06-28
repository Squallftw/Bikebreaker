import type { Part } from '../types';
import { validateCatalog } from './validateCatalog';
import shimanoRoadRaw from './sources/shimano-road.json';

// ────────────────────────────────────────────────────────────────────────────
// The catalog = curated seed parts (frames, wheels, tires, forks, and non-Shimano
// drivetrain) + sourced datasets extracted from manufacturer spec PDFs.
//
// Sourced records are validated at load (see validateCatalog) so an extraction
// typo fails loudly here instead of showing a user a wrong answer. This module
// is the swap point: a real database/API can return the same `Part[]` shape.
// ────────────────────────────────────────────────────────────────────────────

// Curated seed — hand-authored reference parts. Drivetrain brands with a sourced
// dataset (Shimano) are intentionally NOT duplicated here.
const SEED: Part[] = [
  // ── Frames ────────────────────────────────────────────────────────────────
  { id: 'canyon-cfr', type: 'frame', brand: 'Canyon', name: 'Ultimate CFR Frameset', spec: 'BSA · 142×12 · disc · tapered', attrs: { bbShell: 'BSA', axle: '142x12', brake: 'disc', steerer: 'tapered' } },
  { id: 'spec-sl8', type: 'frame', brand: 'Specialized', name: 'Tarmac SL8 Frameset', spec: 'T47 · 142×12 · disc · tapered', attrs: { bbShell: 'T47', axle: '142x12', brake: 'disc', steerer: 'tapered' } },
  { id: 'cdale-caad', type: 'frame', brand: 'Cannondale', name: 'CAAD13 Rim Frameset', spec: 'BSA · QR 130 · rim · straight', attrs: { bbShell: 'BSA', axle: 'QR130', brake: 'rim', steerer: 'straight' } },
  { id: 'giant-tcr', type: 'frame', brand: 'Giant', name: 'TCR Advanced Pro Frameset', spec: 'BB86 · 142×12 · disc · tapered', attrs: { bbShell: 'BB86', axle: '142x12', brake: 'disc', steerer: 'tapered' } },

  // ── Cranksets (non-Shimano) ───────────────────────────────────────────────
  { id: 'sram-rival-crank', type: 'crankset', brand: 'SRAM', name: 'Rival AXS Wide', spec: 'DUB 28.99mm · 43/30T · 2×12', attrs: { spindle: 'DUB', group: 'sram12', speed: 12 } },
  { id: 'sram-red-crank', type: 'crankset', brand: 'SRAM', name: 'RED AXS', spec: 'DUB 28.99mm · 48/35T · 2×12', attrs: { spindle: 'DUB', group: 'sram12', speed: 12 } },
  { id: 'campy-sr-crank', type: 'crankset', brand: 'Campagnolo', name: 'Super Record 12', spec: 'ProTech axle · 2×12', attrs: { spindle: 'ProTech', group: 'campy12', speed: 12 } },

  // ── Bottom brackets (non-Shimano) ─────────────────────────────────────────
  { id: 'wm-bsa24', type: 'bb', brand: 'Wheels Mfg', name: 'BSA 24mm', spec: 'BSA threaded · 24mm cups', attrs: { shell: 'BSA', bbBore: '24' } },
  { id: 'sram-dub-bsa', type: 'bb', brand: 'SRAM', name: 'DUB BSA', spec: 'BSA threaded · 28.99mm bore', attrs: { shell: 'BSA', bbBore: '28.99' } },
  { id: 'praxis-m30', type: 'bb', brand: 'Praxis', name: 'M30 BSA', spec: 'BSA threaded · 30mm bore', attrs: { shell: 'BSA', bbBore: '30' } },
  { id: 'wm-t47', type: 'bb', brand: 'Wheels Mfg', name: 'T47 24mm', spec: 'T47 threaded · 24mm cups', attrs: { shell: 'T47', bbBore: '24' } },

  // ── Wheelsets ─────────────────────────────────────────────────────────────
  { id: 'zipp-303', type: 'wheelset', brand: 'Zipp', name: '303 Firecrest', spec: '142×12 / 100×12 · Center Lock · 25mm int', attrs: { axle: '142x12', frontAxle: '100x12', brake: 'disc', freehubs: ['HG', 'XDR'], rimInternal: 25, hookless: true } },
  { id: 'dt-erc1400', type: 'wheelset', brand: 'DT Swiss', name: 'ERC 1400 Dicut', spec: '142×12 / 100×12 · Center Lock · 20mm int', attrs: { axle: '142x12', frontAxle: '100x12', brake: 'disc', freehubs: ['HG'], rimInternal: 20, hookless: false } },
  { id: 'roval-rapide', type: 'wheelset', brand: 'Roval', name: 'Rapide CLX II', spec: '142×12 / 100×12 · Center Lock · 21mm int', attrs: { axle: '142x12', frontAxle: '100x12', brake: 'disc', freehubs: ['HG', 'XDR'], rimInternal: 21, hookless: true } },
  { id: 'fulcrum-r5', type: 'wheelset', brand: 'Fulcrum', name: 'Racing 5 DB', spec: 'QR 135 / QR 100 · 6-bolt disc', attrs: { axle: 'QR135', frontAxle: 'QR100', brake: 'disc', freehubs: ['HG'], rimInternal: 19, hookless: false } },
  { id: 'mavic-openpro', type: 'wheelset', brand: 'Mavic', name: 'Open Pro UST', spec: 'QR 130 / QR 100 · rim brake', attrs: { axle: 'QR130', frontAxle: 'QR100', brake: 'rim', freehubs: ['HG'], rimInternal: 19, hookless: false } },
  { id: 'zipp-404', type: 'wheelset', brand: 'Zipp', name: '404 Firecrest', spec: '142×12 / 100×12 · Center Lock · XDR only', attrs: { axle: '142x12', frontAxle: '100x12', brake: 'disc', freehubs: ['XDR'], rimInternal: 23, hookless: true } },

  // ── Cassettes (non-Shimano) ───────────────────────────────────────────────
  { id: 'sram-force-cass', type: 'cassette', brand: 'SRAM', name: 'Force XG-1270', spec: '12-speed · XDR freehub', attrs: { freehub: 'XDR', group: 'sram12', speed: 12 } },
  { id: 'sram-rival-cass', type: 'cassette', brand: 'SRAM', name: 'Rival XG-1250', spec: '12-speed · XDR freehub', attrs: { freehub: 'XDR', group: 'sram12', speed: 12 } },

  // ── Tires ─────────────────────────────────────────────────────────────────
  { id: 'conti-gp5000-30', type: 'tire', brand: 'Continental', name: 'GP5000 S TR 700×30', spec: '30mm · tubeless · hookless-OK', attrs: { width: 30, tubeless: true, hooklessOK: true } },
  { id: 'pirelli-pzero-28', type: 'tire', brand: 'Pirelli', name: 'P Zero Race TLR 700×28', spec: '28mm · tubeless · hookless-OK', attrs: { width: 28, tubeless: true, hooklessOK: true } },
  { id: 'conti-gp5000-28', type: 'tire', brand: 'Continental', name: 'GP5000 700×28', spec: '28mm · hooked clincher', attrs: { width: 28, tubeless: false, hooklessOK: false } },
  { id: 'vittoria-corsa-25', type: 'tire', brand: 'Vittoria', name: 'Corsa 700×25', spec: '25mm · tubed clincher', attrs: { width: 25, tubeless: false, hooklessOK: false } },

  // ── Forks ─────────────────────────────────────────────────────────────────
  { id: 'enve-disc-fork', type: 'fork', brand: 'ENVE', name: 'Road Disc Fork', spec: 'Tapered · 100×12 · flat-mount disc', attrs: { axle: '100x12', brake: 'disc', steerer: 'tapered' } },
  { id: 'whisky-no9-fork', type: 'fork', brand: 'Whisky', name: 'No.9 RD+ Fork', spec: 'Straight · QR 100 · flat-mount disc', attrs: { axle: 'QR100', brake: 'disc', steerer: 'straight' } },
  { id: 'columbus-futura-fork', type: 'fork', brand: 'Columbus', name: 'Futura Caliper Fork', spec: 'Straight · QR 100 · rim brake', attrs: { axle: 'QR100', brake: 'rim', steerer: 'straight' } },

  // ── Chains (non-Shimano) ──────────────────────────────────────────────────
  { id: 'sram-force-chain', type: 'chain', brand: 'SRAM', name: 'Force Flattop', spec: '12-speed · Flattop (AXS)', attrs: { speed: 12, flatTop: true } },

  // ── Groupsets (Shimano) ───────────────────────────────────────────────────
  // Bundles derived from the PDF-sourced Shimano component lineup + road
  // constants (all road cranks = 24mm Hollowtech II; road cassettes = HG freehub).
  // The PDF is a component matrix with no "groupset" rows, so these are tagged
  // as derived. 12-speed road is disc-only; 8–11-speed tiers are rim here.
  { id: 'shimano-gs-r9200', type: 'groupset', brand: 'Shimano', name: 'Dura-Ace R9200 Di2', spec: '12s · Di2 · disc · HG', attrs: { group: 'shimano12', speed: 12, actuation: 'Di2', brake: 'disc', crankSpindle: '24HTII', freehub: 'HG' }, source: 'Shimano 2026-2027 Compatibility v2.2 (groupset, derived)' },
  { id: 'shimano-gs-r8170', type: 'groupset', brand: 'Shimano', name: 'Ultegra R8170 Di2', spec: '12s · Di2 · disc · HG', attrs: { group: 'shimano12', speed: 12, actuation: 'Di2', brake: 'disc', crankSpindle: '24HTII', freehub: 'HG' }, source: 'Shimano 2026-2027 Compatibility v2.2 (groupset, derived)' },
  { id: 'shimano-gs-r7150', type: 'groupset', brand: 'Shimano', name: '105 R7150 Di2', spec: '12s · Di2 · disc · HG', attrs: { group: 'shimano12', speed: 12, actuation: 'Di2', brake: 'disc', crankSpindle: '24HTII', freehub: 'HG' }, source: 'Shimano 2026-2027 Compatibility v2.2 (groupset, derived)' },
  { id: 'shimano-gs-r7100', type: 'groupset', brand: 'Shimano', name: '105 R7100', spec: '12s · mechanical · disc · HG', attrs: { group: 'shimano12', speed: 12, actuation: 'mechanical', brake: 'disc', crankSpindle: '24HTII', freehub: 'HG' }, source: 'Shimano 2026-2027 Compatibility v2.2 (groupset, derived)' },
  { id: 'shimano-gs-r9100', type: 'groupset', brand: 'Shimano', name: 'Dura-Ace R9100', spec: '11s · mechanical · rim · HG', attrs: { group: 'shimano11', speed: 11, actuation: 'mechanical', brake: 'rim', crankSpindle: '24HTII', freehub: 'HG' }, source: 'Shimano 2026-2027 Compatibility v2.2 (groupset, derived)' },
  { id: 'shimano-gs-r8000', type: 'groupset', brand: 'Shimano', name: 'Ultegra R8000', spec: '11s · mechanical · rim · HG', attrs: { group: 'shimano11', speed: 11, actuation: 'mechanical', brake: 'rim', crankSpindle: '24HTII', freehub: 'HG' }, source: 'Shimano 2026-2027 Compatibility v2.2 (groupset, derived)' },
  { id: 'shimano-gs-r7000', type: 'groupset', brand: 'Shimano', name: '105 R7000', spec: '11s · mechanical · rim · HG', attrs: { group: 'shimano11', speed: 11, actuation: 'mechanical', brake: 'rim', crankSpindle: '24HTII', freehub: 'HG' }, source: 'Shimano 2026-2027 Compatibility v2.2 (groupset, derived)' },
  { id: 'shimano-gs-4700', type: 'groupset', brand: 'Shimano', name: 'Tiagra 4700', spec: '10s · mechanical · rim · HG', attrs: { group: 'shimano10', speed: 10, actuation: 'mechanical', brake: 'rim', crankSpindle: '24HTII', freehub: 'HG' }, source: 'Shimano 2026-2027 Compatibility v2.2 (groupset, derived)' },
  { id: 'shimano-gs-r3000', type: 'groupset', brand: 'Shimano', name: 'Sora R3000', spec: '9s · mechanical · rim · HG', attrs: { group: 'shimano9', speed: 9, actuation: 'mechanical', brake: 'rim', crankSpindle: '24HTII', freehub: 'HG' }, source: 'Shimano 2026-2027 Compatibility v2.2 (groupset, derived)' },
  { id: 'shimano-gs-r2000', type: 'groupset', brand: 'Shimano', name: 'Claris R2000', spec: '8s · mechanical · rim · HG', attrs: { group: 'shimano8', speed: 8, actuation: 'mechanical', brake: 'rim', crankSpindle: '24HTII', freehub: 'HG' }, source: 'Shimano 2026-2027 Compatibility v2.2 (groupset, derived)' },
];

// Sourced from the Shimano 2026-2027 Compatibility PDF (validated at load).
const SHIMANO_ROAD: Part[] = validateCatalog(shimanoRoadRaw);

// The in-memory catalog. Seeded with the bundled static data so the app works
// offline and tests have a populated fixture; `setCatalog` overwrites it in
// place once data is fetched from Supabase (see src/data/loadCatalog.ts).
export const CATALOG: Part[] = [...SEED, ...SHIMANO_ROAD];

/**
 * Replace the catalog contents IN PLACE (preserving array identity). The pure
 * engine receives CATALOG by value (see src/hooks.ts), so we must mutate rather
 * than reassign — splicing keeps every retained reference and live binding valid.
 */
export function setCatalog(parts: Part[]): void {
  CATALOG.splice(0, CATALOG.length, ...parts);
}

export function partById(id: string): Part | undefined {
  return CATALOG.find((p) => p.id === id);
}
