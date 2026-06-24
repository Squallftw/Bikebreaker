import type { PartType, Relation } from '../types';

// ────────────────────────────────────────────────────────────────────────────
// For each type a user might own, which candidate types to surface and how to
// title each relationship group. Everything shown on the Results/Dashboard
// screens is generated from this map + the engine — never hand-authored per pair.
// ────────────────────────────────────────────────────────────────────────────

export const RELATIONS: Record<PartType, Relation[]> = {
  frame: [
    { type: 'crankset', title: 'Cranksets that fit this frame', subtitle: 'Checked against the frame’s bottom-bracket shell standard.' },
    { type: 'wheelset', title: 'Wheelsets that fit this frame', subtitle: 'Matched on thru-axle spacing and brake mounting.' },
    { type: 'fork', title: 'Forks that fit this frame', subtitle: 'Matched on head-tube standard and brake mounting.' },
    { type: 'bb', title: 'Bottom brackets that fit this frame', subtitle: 'Matched to the frame’s threaded shell.' },
  ],
  crankset: [
    { type: 'bb', title: 'Bottom brackets that fit this crank', subtitle: 'Matched to the crank’s spindle diameter.' },
    { type: 'frame', title: 'Frames that accept this crank', subtitle: 'Compatible bottom-bracket shells for this spindle.' },
    { type: 'cassette', title: 'Cassettes for this drivetrain', subtitle: 'Matched to drivetrain speed and indexing.' },
    { type: 'chain', title: 'Chains for this drivetrain', subtitle: 'Matched to speed count and chain standard.' },
  ],
  wheelset: [
    { type: 'frame', title: 'Frames that fit these wheels', subtitle: 'Matched on thru-axle spacing and brake mounting.' },
    { type: 'fork', title: 'Forks that fit these wheels', subtitle: 'Matched on front-axle spacing and brake mounting.' },
    { type: 'cassette', title: 'Cassettes that fit this freehub', subtitle: 'Matched to the wheel’s freehub body.' },
    { type: 'tire', title: 'Tires that fit these rims', subtitle: 'Validated against rim width and hookless rating.' },
  ],
  cassette: [
    { type: 'wheelset', title: 'Wheels that accept this cassette', subtitle: 'Matched to the cassette’s freehub standard.' },
    { type: 'crankset', title: 'Cranksets for this drivetrain', subtitle: 'Matched to drivetrain speed and indexing.' },
    { type: 'chain', title: 'Chains for this cassette', subtitle: 'Matched to speed count and chain standard.' },
  ],
  tire: [
    { type: 'wheelset', title: 'Wheels these tires fit', subtitle: 'Validated against rim width and hookless rating.' },
  ],
  bb: [
    { type: 'crankset', title: 'Cranks that fit this bottom bracket', subtitle: 'Matched to spindle diameter.' },
    { type: 'frame', title: 'Frames with a matching shell', subtitle: 'Matched to the bottom bracket’s shell standard.' },
  ],
  chain: [
    { type: 'cassette', title: 'Cassettes this chain fits', subtitle: 'Matched to speed count and chain standard.' },
    { type: 'crankset', title: 'Cranksets this chain fits', subtitle: 'Matched to speed count and chain standard.' },
  ],
  fork: [
    { type: 'frame', title: 'Frames that accept this fork', subtitle: 'Matched on thru-axle spacing and brake mounting.' },
    { type: 'wheelset', title: 'Front wheels that fit this fork', subtitle: 'Matched on thru-axle spacing and brake mounting.' },
  ],
};
