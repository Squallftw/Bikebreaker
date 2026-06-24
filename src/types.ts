// ────────────────────────────────────────────────────────────────────────────
// Domain model — the typed mechanical interfaces every part exposes.
// The compatibility engine (src/lib) reasons purely over these shapes, so a real
// database/API can later supply the same Part records without any UI changes.
// ────────────────────────────────────────────────────────────────────────────

export type PartType =
  | 'frame'
  | 'crankset'
  | 'bb'
  | 'wheelset'
  | 'cassette'
  | 'tire'
  | 'fork'
  | 'chain';

export type Tone = 'fits' | 'conflict' | 'unrelated';

// Interface-value unions (the real mechanical standards we match on)
// Threaded (BSA, T47) and press-fit (BB86) bottom-bracket shell standards.
export type BBShell = 'BSA' | 'T47' | 'BB86';
export type Axle = '142x12' | 'QR130' | 'QR135';
export type Brake = 'disc' | 'rim';
export type Spindle = '24HTII' | 'DUB' | 'M30' | 'ProTech';
export type Group =
  | 'shimano12'
  | 'shimano11'
  | 'shimano10'
  | 'shimano9'
  | 'shimano8'
  | 'sram12'
  | 'campy12';
export type BBBore = '24' | '28.99' | '30';
export type Freehub = 'HG' | 'XDR';
// Front-axle standards (forks + front wheels) — distinct from the rear `Axle`.
export type FrontAxle = '100x12' | 'QR100';
// Steerer / head-tube standard.
export type Steerer = 'tapered' | 'straight';

export interface FrameAttrs {
  bbShell: BBShell;
  axle: Axle;
  brake: Brake;
  /** Head-tube standard the fork steerer must match. */
  steerer: Steerer;
}
export interface CranksetAttrs {
  spindle: Spindle;
  group: Group;
  speed: number;
}
export interface BBAttrs {
  shell: BBShell;
  bbBore: BBBore;
}
export interface WheelsetAttrs {
  /** Rear axle (matched against frames). */
  axle: Axle;
  /** Front axle (matched against forks). */
  frontAxle: FrontAxle;
  brake: Brake;
  freehubs: Freehub[];
  rimInternal: number;
  hookless: boolean;
}
export interface CassetteAttrs {
  freehub: Freehub;
  group: Group;
  speed: number;
}
export interface TireAttrs {
  width: number;
  tubeless: boolean;
  hooklessOK: boolean;
}
export interface ForkAttrs {
  /** Front axle the fork accepts. */
  axle: FrontAxle;
  brake: Brake;
  steerer: Steerer;
}
export interface ChainAttrs {
  speed: number;
  /** SRAM AXS 12-speed uses a Flattop chain — not cross-compatible with standard chains. */
  flatTop: boolean;
}

/** Maps each part type to the shape of its `attrs`. */
export interface AttrsByType {
  frame: FrameAttrs;
  crankset: CranksetAttrs;
  bb: BBAttrs;
  wheelset: WheelsetAttrs;
  cassette: CassetteAttrs;
  tire: TireAttrs;
  fork: ForkAttrs;
  chain: ChainAttrs;
}

/** A catalog part — a discriminated union keyed on `type`. */
export type Part = {
  [K in PartType]: {
    id: string;
    type: K;
    brand: string;
    name: string;
    /** Human-readable one-line spec shown in lists (mono). */
    spec: string;
    attrs: AttrsByType[K];
    /** Provenance — where this record's data was sourced from (e.g. a spec PDF). */
    source?: string;
  };
}[PartType];

/** One row of the per-dimension spec comparison powering the "Why?" panel. */
export interface DetailRow {
  label: string;
  you: string;
  them: string;
  /** false → this dimension is the reason for a conflict; highlight it. */
  ok: boolean;
}

/** The result of comparing two parts. Pure data — never colors or JSX. */
export interface CompatResult {
  tone: Tone;
  reason: string;
  detail: DetailRow[];
}

/** A candidate relationship for an owned part type, rendered as a group. */
export interface Relation {
  type: PartType;
  title: string;
  subtitle: string;
}
