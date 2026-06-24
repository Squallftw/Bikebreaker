// Small stroke-based icon set (no emoji). currentColor + configurable size.
interface IconProps {
  size?: number;
  className?: string;
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export function IconDashboard({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function IconSearch({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function IconLink({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
    </svg>
  );
}

export function IconBuild({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <path d="m12 2 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </svg>
  );
}

export function IconHelp({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9a2.5 2.5 0 0 1 4.7 1.2c0 1.7-2.4 2-2.4 3.3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function IconPlus({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2} className={className} aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconChevronRight({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2} className={className} aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function IconMenu({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={1.8} className={className} aria-hidden="true">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

export function IconCheck({ size = 22, className }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2.4} className={className} aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function IconAlert({ size = 22, className }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2.4} className={className} aria-hidden="true">
      <path d="M12 8v5M12 17h.01" />
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    </svg>
  );
}
