import { useMemo } from 'react';
import { useGroups } from '../hooks';
import { aggregateKpis } from '../lib/results';
import { ResultGroup } from '../components/ResultGroup';

function CompactKpi({
  label,
  value,
  valueClass = 'text-ink',
}: {
  label: string;
  value: number;
  valueClass?: string;
}) {
  return (
    <div className="rounded-[13px] border border-hairline bg-white px-4 py-3.5">
      <p className="mb-1.5 text-xs font-medium text-[#82858c]">{label}</p>
      <span className={`text-[23px] font-semibold tracking-tight ${valueClass}`}>{value}</span>
    </div>
  );
}

export function Results() {
  const groups = useGroups();
  const kpis = useMemo(() => aggregateKpis(groups), [groups]);

  return (
    <div className="flex flex-col gap-3.5">
      {/* Compact KPI row — the owned part itself lives in the global anchor above. */}
      <div className="grid grid-cols-3 gap-3">
        <CompactKpi label="Checked" value={kpis.checked} />
        <CompactKpi label="Compatible" value={kpis.fits} valueClass="text-fits-fg" />
        <CompactKpi
          label="Conflicts"
          value={kpis.conflicts}
          valueClass={kpis.conflicts ? 'text-conflict-fg' : 'text-ink'}
        />
      </div>

      {/* Relationship groups */}
      <div className="flex flex-col gap-4">
        {groups.map((g) => (
          <ResultGroup key={g.type} group={g} />
        ))}
      </div>
    </div>
  );
}
