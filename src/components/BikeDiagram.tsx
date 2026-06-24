import { useState } from 'react';
import type { PartType } from '../types';
import { TYPE_TOKENS, TYPE_HEX } from '../theme/tokens';

interface Props {
  selectedType: PartType | null;
  onSelectType: (t: PartType) => void;
  /** Called when a not-checked part is tapped, with an explanatory note. */
  onSelectFaded: (note: string) => void;
}

const GREY = '#9a9ca1';
const GREY_LIGHT = '#cfd1d6';

// The modeled, checkable types and where they sit on the bike.
const ACTIVE: { type: PartType; cx: number; cy: number }[] = [
  { type: 'frame', cx: 415, cy: 175 },
  { type: 'crankset', cx: 315, cy: 250 },
  { type: 'wheelset', cx: 530, cy: 235 },
  { type: 'cassette', cx: 175, cy: 235 },
  { type: 'bb', cx: 288, cy: 283 },
  { type: 'tire', cx: 175, cy: 308 },
  { type: 'fork', cx: 515, cy: 180 },
  { type: 'chain', cx: 248, cy: 230 },
];

// Real parts the engine doesn't model — drawn faded, informational only.
const FADED: { label: string; cx: number; cy: number }[] = [
  { label: 'Handlebar', cx: 525, cy: 100 },
  { label: 'Stem', cx: 508, cy: 111 },
  { label: 'Headset', cx: 497, cy: 138 },
  { label: 'Saddle', cx: 311, cy: 100 },
  { label: 'Seatpost', cx: 325, cy: 126 },
  { label: 'Pedals', cx: 336, cy: 286 },
  { label: 'Front derailleur', cx: 323, cy: 201 },
  { label: 'Rear derailleur', cx: 180, cy: 281 },
  { label: 'Brakes', cx: 511, cy: 209 },
];

export function BikeDiagram({ selectedType, onSelectType, onSelectFaded }: Props) {
  const [focused, setFocused] = useState<PartType | null>(null);

  return (
    <svg
      viewBox="0 0 680 340"
      width="100%"
      role="group"
      aria-label="Road bike — select the part you own"
    >
      <g aria-hidden="true" fill="none" strokeLinecap="round">
        <circle cx="175" cy="235" r="82" stroke={GREY} strokeWidth="3" />
        <circle cx="175" cy="235" r="67" stroke={GREY_LIGHT} strokeWidth="2" />
        <circle cx="175" cy="235" r="4" fill={GREY} />
        <circle cx="530" cy="235" r="82" stroke={GREY} strokeWidth="3" />
        <circle cx="530" cy="235" r="67" stroke={GREY_LIGHT} strokeWidth="2" />
        <circle cx="530" cy="235" r="4" fill={GREY} />

        <line x1="315" y1="250" x2="330" y2="112" stroke={GREY} strokeWidth="4" />
        <line x1="315" y1="250" x2="498" y2="122" stroke={GREY} strokeWidth="4" />
        <line x1="330" y1="112" x2="498" y2="122" stroke={GREY} strokeWidth="4" />
        <line x1="330" y1="112" x2="175" y2="235" stroke={GREY} strokeWidth="4" />
        <line x1="315" y1="250" x2="175" y2="235" stroke={GREY} strokeWidth="4" />

        <line x1="498" y1="122" x2="530" y2="235" stroke={GREY} strokeWidth="4" />
        <line x1="498" y1="122" x2="516" y2="104" stroke={GREY} strokeWidth="4" />
        <path d="M516 104 q 20 -2 16 17" stroke={GREY} strokeWidth="4" />
        <path d="M300 109 q 17 -8 35 -1" stroke={GREY} strokeWidth="5" />

        <line x1="313" y1="231" x2="178" y2="228" stroke={GREY_LIGHT} strokeWidth="2" />
        <circle cx="315" cy="250" r="18" stroke={GREY} strokeWidth="3" />
        <line x1="315" y1="250" x2="333" y2="283" stroke={GREY} strokeWidth="4" />
        <rect x="329" y="283" width="14" height="5" rx="2" fill={GREY} />
      </g>

      {/* Not-checked parts — faded, pointer-only affordance (caption covers a11y) */}
      <g aria-hidden="true">
        {FADED.map((f) => (
          <circle
            key={f.label}
            cx={f.cx}
            cy={f.cy}
            r="7"
            fill="#eef0f3"
            stroke="#bfc2c8"
            strokeWidth="1.5"
            style={{ cursor: 'pointer' }}
            onClick={() => onSelectFaded(`${f.label} isn’t checked by the engine yet.`)}
          />
        ))}
      </g>

      {/* Active, checkable parts — keyboard-accessible buttons */}
      {ACTIVE.map(({ type, cx, cy }) => {
        const hex = TYPE_HEX[type];
        const isOn = selectedType === type || focused === type;
        return (
          <g
            key={type}
            role="button"
            tabIndex={0}
            aria-label={`Select the ${TYPE_TOKENS[type].label.toLowerCase()} you own`}
            aria-pressed={selectedType === type}
            onClick={() => onSelectType(type)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectType(type);
              }
            }}
            onFocus={() => setFocused(type)}
            onBlur={() => setFocused(null)}
            style={{ cursor: 'pointer', outline: 'none' }}
          >
            {/* 44px transparent hit target */}
            <circle cx={cx} cy={cy} r="22" fill="transparent" />
            {isOn && (
              <circle
                cx={cx}
                cy={cy}
                r="20"
                fill="none"
                stroke={hex.fg}
                strokeWidth="2"
                opacity={focused === type ? 0.85 : 0.45}
              />
            )}
            <circle cx={cx} cy={cy} r="15" fill={hex.bg} stroke={hex.fg} strokeWidth="1.5" />
            <text
              x={cx}
              y={cy + 5}
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="14"
              fontWeight="500"
              fill={hex.fg}
            >
              {TYPE_TOKENS[type].letter}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
