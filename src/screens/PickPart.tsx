import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATALOG } from '../data/catalog';
import { useStore } from '../store/useStore';
import { PICKABLE_TYPES, TYPE_TOKENS } from '../theme/tokens';
import type { PartType } from '../types';
import { PartChip } from '../components/PartChip';
import { PartList } from '../components/PartList';
import { PartTypeIcon } from '../components/PartTypeIcon';
import { BikeDiagram } from '../components/BikeDiagram';
import { IconSearch } from '../components/icons';

type Mode = 'bike' | 'list';

export function PickPart() {
  const navigate = useNavigate();
  const setOwnedPart = useStore((s) => s.setOwnedPart);
  const [mode, setMode] = useState<Mode>('bike');
  const [selectedType, setSelectedType] = useState<PartType | null>(null);
  const [query, setQuery] = useState('');
  const [fadedNote, setFadedNote] = useState<string | null>(null);

  const parts = useMemo(() => {
    if (!selectedType) return [];
    const q = query.trim().toLowerCase();
    return CATALOG.filter((p) => p.type === selectedType).filter(
      (p) => !q || `${p.brand} ${p.name}`.toLowerCase().includes(q),
    );
  }, [selectedType, query]);

  const pick = (id: string) => {
    setOwnedPart(id);
    navigate('/results');
  };

  const tapType = (t: PartType) => {
    setSelectedType(t);
    setQuery('');
    setFadedNote(null);
  };

  const switchMode = (m: Mode) => {
    if (m === 'list' && selectedType === null) setSelectedType('frame');
    setMode(m);
  };

  const search = (
    <div className="flex items-center gap-2.5 rounded-xl border border-[#e7e8ea] bg-white px-3.5 py-3">
      <IconSearch className="flex-none text-[#adb0b6]" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by brand or model…"
        aria-label="Search parts by brand or model"
        className="w-full bg-transparent text-[15px] text-ink outline-none"
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* mode toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] text-[#6f7178]">
          {mode === 'bike'
            ? 'Tap the part you own on the bike.'
            : 'Choose a category, then pick your part.'}
        </p>
        <div
          role="group"
          aria-label="Picker view"
          className="flex items-center gap-1 rounded-[10px] border border-[#e7e8ea] bg-white p-1"
        >
          {(['bike', 'list'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              aria-pressed={mode === m}
              className={`min-h-9 rounded-[7px] px-3.5 py-1.5 text-[13px] font-semibold capitalize ${
                mode === m ? 'bg-ink text-white' : 'text-[#6f7178] hover:bg-[#f4f5f7]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {mode === 'bike' ? (
        <>
          <div className="rounded-2xl border border-hairline bg-white p-4">
            <div className="mx-auto max-w-[600px]">
              <BikeDiagram
                selectedType={selectedType}
                onSelectType={tapType}
                onSelectFaded={setFadedNote}
              />
            </div>
          </div>

          {fadedNote && (
            <div className="flex items-start gap-2.5 rounded-xl border border-[#e7e6e1] bg-[#f1f1ef] px-4 py-3 text-[13px] text-[#6f6b64]">
              <span className="mt-1.5 h-2 w-2 flex-none rounded-full bg-unrelated-dot" />
              <span className="flex-1">
                {fadedNote} BikeBreaker only verifies parts with a mechanical interface to
                compare.
              </span>
              <button
                type="button"
                onClick={() => setFadedNote(null)}
                aria-label="Dismiss"
                className="flex-none px-1 font-mono text-[16px] leading-none text-[#aaa6a0] hover:text-[#6f6b64]"
              >
                ×
              </button>
            </div>
          )}

          {selectedType ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <PartTypeIcon type={selectedType} size="md" />
                <div className="flex-1">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.05em] text-[#abaeb4]">
                    You tapped
                  </p>
                  <p className="text-[16px] font-semibold tracking-tight">
                    {TYPE_TOKENS[selectedType].label} — which one?
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedType(null)}
                  className="min-h-9 rounded-lg border border-[#e7e8ea] bg-white px-3 py-1.5 text-[12.5px] font-semibold text-[#6f7178] hover:bg-[#f4f5f7]"
                >
                  Pick another
                </button>
              </div>
              {search}
              <PartList parts={parts} query={query} onPick={pick} />
            </div>
          ) : (
            <p className="px-1 text-[13.5px] text-[#abaeb4]">
              Tap a colored part on the bike to see what fits it.
            </p>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-wrap gap-2.5">
            {PICKABLE_TYPES.map((t) => (
              <PartChip
                key={t}
                type={t}
                active={selectedType === t}
                onClick={() => {
                  setSelectedType(t);
                  setQuery('');
                }}
              />
            ))}
          </div>
          {search}
          <PartList parts={parts} query={query} onPick={pick} />
        </>
      )}
    </div>
  );
}
