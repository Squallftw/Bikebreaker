import type { ReactNode } from 'react';

/** Card shell for a single metric. The body is composed by each caller. */
export function KpiCard({
  label,
  children,
  className = '',
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[14px] border border-hairline bg-white p-[18px] ${className}`}>
      <p className="mb-2.5 text-[12.5px] font-medium text-[#82858c]">{label}</p>
      {children}
    </div>
  );
}
