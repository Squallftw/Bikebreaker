// ────────────────────────────────────────────────────────────────────────────
// The compatibility engine. Pure, deterministic, framework-free.
//
// `compat(a, b)` computes a structured result — never a hard-coded per-pair
// answer. It dispatches on the UNORDERED type pair, so compat(a,b) and
// compat(b,a) are equivalent. The returned `reason` + `detail` are plain data;
// the UI maps `tone` to colors via the theme tokens.
// ────────────────────────────────────────────────────────────────────────────

import type {
  Part,
  PartType,
  AttrsByType,
  CompatResult,
  DetailRow,
  ChainAttrs,
  BBShell,
  Axle,
  FrontAxle,
  Steerer,
  Brake,
  Spindle,
  Group,
} from '../types';

// ── Human-readable labels for the interface values ──────────────────────────
export function axleLabel(a: Axle): string {
  return { '142x12': '142×12mm', QR130: 'QR 130mm', QR135: 'QR 135mm' }[a] ?? a;
}
export function frontAxleLabel(a: FrontAxle): string {
  return a === '100x12' ? '100×12mm thru' : 'QR 100mm';
}
export function steererLabel(s: Steerer): string {
  return s === 'tapered' ? 'Tapered 1⅛–1½″' : 'Straight 1⅛″';
}
export function brakeLabel(b: Brake): string {
  return b === 'disc' ? 'Disc' : 'Rim brake';
}
export function spindleLabel(s: Spindle): string {
  return (
    {
      '24HTII': '24mm Hollowtech II',
      DUB: 'DUB 28.99mm',
      M30: 'M30 30mm',
      ProTech: 'ProTech press-fit',
    }[s] ?? s
  );
}
export function groupLabel(g: Group): string {
  return (
    {
      shimano12: 'Shimano 12-speed',
      shimano11: 'Shimano 11-speed',
      shimano10: 'Shimano 10-speed',
      shimano9: 'Shimano 9-speed',
      shimano8: 'Shimano 8-speed',
      sram12: 'SRAM AXS 12-speed',
      campy12: 'Campagnolo 12-speed',
    }[g] ?? g
  );
}
/** Shell standard, correctly distinguishing threaded vs press-fit. */
export function shellLabel(s: BBShell): string {
  return s === 'BB86' ? 'BB86 press-fit' : `${s} threaded`;
}

/** The spec chips shown for a part on the dashboard hero / lists. */
export function specsFor(p: Part): string[] {
  switch (p.type) {
    case 'frame': {
      const a = p.attrs;
      return [
        `${shellLabel(a.bbShell)} shell`,
        `${axleLabel(a.axle)} thru-axle`,
        a.brake === 'disc' ? 'Flat-mount disc' : 'Rim brake',
        `${steererLabel(a.steerer)} steerer`,
      ];
    }
    case 'crankset': {
      const a = p.attrs;
      return [spindleLabel(a.spindle), `${a.speed}-speed`, groupLabel(a.group)];
    }
    case 'bb': {
      const a = p.attrs;
      return [`${shellLabel(a.shell)} shell`, `${a.bbBore}mm bore`];
    }
    case 'wheelset': {
      const a = p.attrs;
      return [
        `${axleLabel(a.axle)} thru-axle`,
        a.brake === 'disc' ? 'Center Lock disc' : 'Rim brake',
        `${a.rimInternal}mm internal · ${a.hookless ? 'hookless' : 'hooked'}`,
        `${a.freehubs.join('/')} freehub`,
      ];
    }
    case 'cassette': {
      const a = p.attrs;
      return [`${a.speed}-speed`, `${a.freehub} freehub`, groupLabel(a.group)];
    }
    case 'tire': {
      const a = p.attrs;
      return [
        `700×${a.width}c`,
        a.tubeless ? 'Tubeless (TR)' : 'Clincher',
        a.hooklessOK ? 'Hookless-approved' : 'Hooked rims only',
      ];
    }
    case 'fork': {
      const a = p.attrs;
      return [
        `${frontAxleLabel(a.axle)} front`,
        a.brake === 'disc' ? 'Flat-mount disc' : 'Rim brake',
        `${steererLabel(a.steerer)} steerer`,
      ];
    }
    case 'chain': {
      const a = p.attrs;
      return [`${a.speed}-speed`, a.flatTop ? 'Flattop (SRAM AXS)' : 'Standard roller'];
    }
    default:
      return [];
  }
}

const chainTypeLabel = (flatTop: boolean) => (flatTop ? 'Flattop' : 'Standard roller');

/** A chain vs any speed+group drivetrain part (cassette or crankset). */
function chainCompat(chain: ChainAttrs, other: { speed: number; group: Group }): CompatResult {
  const speedOk = chain.speed === other.speed;
  const needFlatTop = other.group === 'sram12';
  const typeOk = chain.flatTop === needFlatTop;
  const detail: DetailRow[] = [
    { label: 'Speed', you: `${chain.speed}-speed`, them: `${other.speed}-speed`, ok: speedOk },
    {
      label: 'Chain type',
      you: chainTypeLabel(chain.flatTop),
      them: needFlatTop ? 'Flattop (SRAM AXS)' : 'Standard roller',
      ok: typeOk,
    },
  ];
  if (!speedOk)
    return {
      tone: 'unrelated',
      reason: `Different speed count — ${chain.speed}-speed vs ${other.speed}-speed`,
      detail,
    };
  if (!typeOk)
    return {
      tone: 'conflict',
      reason: needFlatTop
        ? `Needs a Flattop chain — ${groupLabel(other.group)} won’t index a standard chain`
        : `Flattop chain only fits SRAM AXS — won’t index ${groupLabel(other.group)}`,
      detail,
    };
  return {
    tone: 'fits',
    reason: `${chain.speed}-speed ${chainTypeLabel(chain.flatTop).toLowerCase()} chain matches`,
    detail,
  };
}

// ── Dispatch helpers ────────────────────────────────────────────────────────
function pairHas(a: Part, b: Part, t1: PartType, t2: PartType): boolean {
  if (a.type === b.type) return false;
  const types = [a.type, b.type];
  return types.includes(t1) && types.includes(t2);
}

/** Returns the attrs of whichever of `a`/`b` is of type `t`. */
function attrsOf<T extends PartType>(a: Part, b: Part, t: T): AttrsByType[T] {
  const p = a.type === t ? a : b;
  return p.attrs as AttrsByType[T];
}

const BORE_FOR_SPINDLE: Partial<Record<Spindle, string>> = {
  '24HTII': '24',
  DUB: '28.99',
  M30: '30',
  // ProTech intentionally omitted — press-fit, no threaded bore requirement.
};

export function compat(a: Part, b: Part): CompatResult {
  const fits = (reason: string, detail: DetailRow[]): CompatResult => ({ tone: 'fits', reason, detail });
  const conflict = (reason: string, detail: DetailRow[]): CompatResult => ({ tone: 'conflict', reason, detail });
  const unrelated = (reason: string, detail: DetailRow[] = []): CompatResult => ({ tone: 'unrelated', reason, detail });

  // frame × crankset — the right BB adapts a threaded shell; only ProTech needs press-fit.
  if (pairHas(a, b, 'frame', 'crankset')) {
    const f = attrsOf(a, b, 'frame');
    const c = attrsOf(a, b, 'crankset');
    const ok = c.spindle !== 'ProTech';
    const detail: DetailRow[] = [
      { label: 'BB shell', you: shellLabel(f.bbShell), them: spindleLabel(c.spindle), ok },
    ];
    return ok
      ? fits(`${f.bbShell} shell takes this spindle with the right BB`, detail)
      : conflict('BB shell mismatch — ProTech needs a press-fit frame', detail);
  }

  // frame × wheelset — brake interface first, then axle spacing.
  if (pairHas(a, b, 'frame', 'wheelset')) {
    const f = attrsOf(a, b, 'frame');
    const w = attrsOf(a, b, 'wheelset');
    const brakeOk = f.brake === w.brake;
    const axleOk = f.axle === w.axle;
    const detail: DetailRow[] = [
      { label: 'Brake', you: brakeLabel(f.brake), them: brakeLabel(w.brake), ok: brakeOk },
      { label: 'Axle', you: axleLabel(f.axle), them: axleLabel(w.axle), ok: axleOk },
    ];
    if (!brakeOk) return unrelated(`${brakeLabel(w.brake)} wheel — different braking interface`, detail);
    if (!axleOk)
      return conflict(
        `Axle mismatch — ${axleLabel(w.axle)} won’t hold in a ${axleLabel(f.axle)} frame`,
        detail,
      );
    return fits(`${axleLabel(f.axle)} thru-axle and disc mount match`, detail);
  }

  // frame × bb — threaded shell standard must match.
  if (pairHas(a, b, 'frame', 'bb')) {
    const f = attrsOf(a, b, 'frame');
    const bb = attrsOf(a, b, 'bb');
    const ok = f.bbShell === bb.shell;
    const detail: DetailRow[] = [
      { label: 'Shell', you: shellLabel(f.bbShell), them: shellLabel(bb.shell), ok },
    ];
    return ok
      ? fits(`${shellLabel(f.bbShell)} shell matches`, detail)
      : conflict(`Shell mismatch — frame is ${f.bbShell}, this BB is ${bb.shell}`, detail);
  }

  // crankset × bb — the BB bore must suit the crank spindle.
  if (pairHas(a, b, 'crankset', 'bb')) {
    const c = attrsOf(a, b, 'crankset');
    const bb = attrsOf(a, b, 'bb');
    const need = BORE_FOR_SPINDLE[c.spindle];
    const ok = !need || bb.bbBore === need;
    const detail: DetailRow[] = [
      { label: 'Spindle', you: spindleLabel(c.spindle), them: `${bb.bbBore}mm bore`, ok },
    ];
    return ok
      ? fits(`${bb.bbBore}mm bore fits the ${spindleLabel(c.spindle)} spindle`, detail)
      : conflict(`Spindle mismatch — needs a ${need}mm bore, this is ${bb.bbBore}mm`, detail);
  }

  // crankset × cassette — speed count, then indexing group.
  if (pairHas(a, b, 'crankset', 'cassette')) {
    const c = attrsOf(a, b, 'crankset');
    const k = attrsOf(a, b, 'cassette');
    const speedOk = c.speed === k.speed;
    const groupOk = c.group === k.group;
    const detail: DetailRow[] = [
      { label: 'Speed', you: `${c.speed}-speed`, them: `${k.speed}-speed`, ok: speedOk },
      { label: 'Indexing', you: groupLabel(c.group), them: groupLabel(k.group), ok: groupOk },
    ];
    if (!speedOk)
      return unrelated(`Different speed count — ${c.speed}-speed vs ${k.speed}-speed`, detail);
    if (!groupOk)
      return conflict(
        `Cog-pitch mismatch — ${groupLabel(c.group)} isn’t indexed for ${groupLabel(k.group)}`,
        detail,
      );
    return fits(`${c.speed}-speed ${groupLabel(c.group)} indexing matches`, detail);
  }

  // wheelset × cassette — the freehub body must be available on the wheel.
  if (pairHas(a, b, 'wheelset', 'cassette')) {
    const w = attrsOf(a, b, 'wheelset');
    const k = attrsOf(a, b, 'cassette');
    const ok = w.freehubs.includes(k.freehub);
    const detail: DetailRow[] = [
      { label: 'Freehub', you: `${w.freehubs.join('/')} body`, them: `${k.freehub} cassette`, ok },
    ];
    return ok
      ? fits(`${k.freehub} freehub body available on this wheel`, detail)
      : conflict(
          `Freehub mismatch — needs a ${k.freehub} body, wheel has ${w.freehubs.join('/')}`,
          detail,
        );
  }

  // wheelset × tire — hookless rims demand a hookless-approved tire ≥ 28mm.
  if (pairHas(a, b, 'wheelset', 'tire')) {
    const w = attrsOf(a, b, 'wheelset');
    const t = attrsOf(a, b, 'tire');
    if (w.hookless) {
      const rateOk = t.hooklessOK;
      const widthOk = t.width >= 28;
      const detail: DetailRow[] = [
        {
          label: 'Rim type',
          you: 'Hookless tubeless',
          them: t.hooklessOK ? 'Hookless-approved' : 'Not hookless-rated',
          ok: rateOk,
        },
        { label: 'Width', you: '28mm minimum', them: `${t.width}mm`, ok: widthOk },
      ];
      if (!rateOk)
        return conflict('Not hookless-rated — this rim needs a hookless-approved tire', detail);
      if (!widthOk)
        return conflict(
          `Too narrow — hookless rims require a 28mm minimum (this is ${t.width}mm)`,
          detail,
        );
      return fits(`${t.width}mm hookless-approved tubeless — good match`, detail);
    }
    const detail: DetailRow[] = [
      {
        label: 'Rim type',
        you: 'Hooked rim',
        them: `${t.width}mm ${t.tubeless ? 'tubeless' : 'clincher'}`,
        ok: true,
      },
    ];
    return fits(`${t.width}mm on a hooked rim — fits`, detail);
  }

  // fork × frame — head-tube/steerer standard, then brake mount.
  if (pairHas(a, b, 'fork', 'frame')) {
    const fk = attrsOf(a, b, 'fork');
    const f = attrsOf(a, b, 'frame');
    const brakeOk = fk.brake === f.brake;
    const steerOk = fk.steerer === f.steerer;
    const detail: DetailRow[] = [
      { label: 'Brake', you: brakeLabel(fk.brake), them: brakeLabel(f.brake), ok: brakeOk },
      { label: 'Steerer', you: steererLabel(fk.steerer), them: steererLabel(f.steerer), ok: steerOk },
    ];
    if (!brakeOk) return unrelated(`${brakeLabel(f.brake)} frame — different braking interface`, detail);
    if (!steerOk)
      return conflict(
        `Steerer mismatch — a ${steererLabel(fk.steerer)} steerer won’t seat in a ${steererLabel(f.steerer)} head tube`,
        detail,
      );
    return fits(`${steererLabel(fk.steerer)} steerer and ${brakeLabel(fk.brake).toLowerCase()} mount match`, detail);
  }

  // fork × wheelset — front-axle spacing first, then brake mount.
  if (pairHas(a, b, 'fork', 'wheelset')) {
    const fk = attrsOf(a, b, 'fork');
    const w = attrsOf(a, b, 'wheelset');
    const brakeOk = fk.brake === w.brake;
    const axleOk = fk.axle === w.frontAxle;
    const detail: DetailRow[] = [
      { label: 'Brake', you: brakeLabel(fk.brake), them: brakeLabel(w.brake), ok: brakeOk },
      { label: 'Front axle', you: frontAxleLabel(fk.axle), them: frontAxleLabel(w.frontAxle), ok: axleOk },
    ];
    if (!brakeOk) return unrelated(`${brakeLabel(w.brake)} wheel — different braking interface`, detail);
    if (!axleOk)
      return conflict(
        `Front axle mismatch — ${frontAxleLabel(w.frontAxle)} won’t fit a ${frontAxleLabel(fk.axle)} fork`,
        detail,
      );
    return fits(`${frontAxleLabel(fk.axle)} front axle and ${brakeLabel(fk.brake).toLowerCase()} mount match`, detail);
  }

  // chain × cassette / chain × crankset — speed count then chain standard.
  if (pairHas(a, b, 'chain', 'cassette')) {
    return chainCompat(attrsOf(a, b, 'chain'), attrsOf(a, b, 'cassette'));
  }
  if (pairHas(a, b, 'chain', 'crankset')) {
    return chainCompat(attrsOf(a, b, 'chain'), attrsOf(a, b, 'crankset'));
  }

  if (a.type === b.type) return unrelated('Same part category — not an interface to check');
  return unrelated('Different interface — these parts don’t share a contact point');
}
