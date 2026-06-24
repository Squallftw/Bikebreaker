import type { Part, PartType } from '../types';

// ────────────────────────────────────────────────────────────────────────────
// Runtime validation for catalog data sourced from outside TypeScript (JSON
// extracted from spec PDFs). TS can't typecheck JSON values, so we check enum
// membership and required attrs here and FAIL FAST — an extraction typo becomes
// a loud error at load/test time, never a wrong answer shown to a user.
// ────────────────────────────────────────────────────────────────────────────

const PART_TYPES: PartType[] = [
  'frame',
  'crankset',
  'bb',
  'wheelset',
  'cassette',
  'tire',
  'fork',
  'chain',
];

const ENUMS = {
  bbShell: ['BSA', 'T47', 'BB86'],
  axle: ['142x12', 'QR130', 'QR135'],
  frontAxle: ['100x12', 'QR100'],
  brake: ['disc', 'rim'],
  spindle: ['24HTII', 'DUB', 'M30', 'ProTech'],
  group: ['shimano12', 'shimano11', 'shimano10', 'shimano9', 'shimano8', 'sram12', 'campy12'],
  bbBore: ['24', '28.99', '30'],
  freehub: ['HG', 'XDR'],
  steerer: ['tapered', 'straight'],
} as const;

type Issue = string;

function checkEnum(issues: Issue[], where: string, field: string, value: unknown, allowed: readonly string[]) {
  if (!allowed.includes(value as string)) {
    issues.push(`${where}: ${field}=${JSON.stringify(value)} not in [${allowed.join(', ')}]`);
  }
}

function checkAttrs(issues: Issue[], where: string, type: PartType, a: Record<string, unknown>) {
  const num = (f: string) => typeof a[f] === 'number' || issues.push(`${where}: ${f} must be a number`);
  const bool = (f: string) => typeof a[f] === 'boolean' || issues.push(`${where}: ${f} must be a boolean`);
  switch (type) {
    case 'frame':
      checkEnum(issues, where, 'bbShell', a.bbShell, ENUMS.bbShell);
      checkEnum(issues, where, 'axle', a.axle, ENUMS.axle);
      checkEnum(issues, where, 'brake', a.brake, ENUMS.brake);
      checkEnum(issues, where, 'steerer', a.steerer, ENUMS.steerer);
      break;
    case 'crankset':
      checkEnum(issues, where, 'spindle', a.spindle, ENUMS.spindle);
      checkEnum(issues, where, 'group', a.group, ENUMS.group);
      num('speed');
      break;
    case 'bb':
      checkEnum(issues, where, 'shell', a.shell, ENUMS.bbShell);
      checkEnum(issues, where, 'bbBore', a.bbBore, ENUMS.bbBore);
      break;
    case 'wheelset':
      checkEnum(issues, where, 'axle', a.axle, ENUMS.axle);
      checkEnum(issues, where, 'frontAxle', a.frontAxle, ENUMS.frontAxle);
      checkEnum(issues, where, 'brake', a.brake, ENUMS.brake);
      if (!Array.isArray(a.freehubs)) issues.push(`${where}: freehubs must be an array`);
      else a.freehubs.forEach((f) => checkEnum(issues, where, 'freehubs[]', f, ENUMS.freehub));
      num('rimInternal');
      bool('hookless');
      break;
    case 'cassette':
      checkEnum(issues, where, 'freehub', a.freehub, ENUMS.freehub);
      checkEnum(issues, where, 'group', a.group, ENUMS.group);
      num('speed');
      break;
    case 'tire':
      num('width');
      bool('tubeless');
      bool('hooklessOK');
      break;
    case 'fork':
      checkEnum(issues, where, 'axle', a.axle, ENUMS.frontAxle);
      checkEnum(issues, where, 'brake', a.brake, ENUMS.brake);
      checkEnum(issues, where, 'steerer', a.steerer, ENUMS.steerer);
      break;
    case 'chain':
      num('speed');
      bool('flatTop');
      break;
  }
}

/** Validate raw catalog records and return them typed. Throws on any issue. */
export function validateCatalog(raw: unknown[]): Part[] {
  const issues: Issue[] = [];
  raw.forEach((r, i) => {
    const rec = r as Record<string, unknown>;
    const where = `#${i} (${rec.id ?? 'no-id'})`;
    for (const f of ['id', 'brand', 'name', 'spec'] as const) {
      if (typeof rec[f] !== 'string' || !rec[f]) issues.push(`${where}: ${f} must be a non-empty string`);
    }
    if (!PART_TYPES.includes(rec.type as PartType)) {
      issues.push(`${where}: type=${JSON.stringify(rec.type)} is not a known part type`);
    } else if (typeof rec.attrs !== 'object' || rec.attrs === null) {
      issues.push(`${where}: attrs missing`);
    } else {
      checkAttrs(issues, where, rec.type as PartType, rec.attrs as Record<string, unknown>);
    }
  });

  if (issues.length) {
    throw new Error(`Invalid catalog data (${issues.length}):\n - ${issues.join('\n - ')}`);
  }
  return raw as Part[];
}
