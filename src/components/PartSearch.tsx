import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { Part } from '../types';
import { CATALOG } from '../data/catalog';
import { searchCatalog } from '../lib/search';
import { TYPE_TOKENS } from '../theme/tokens';
import { PartTypeIcon } from './PartTypeIcon';
import { IconSearch } from './icons';

type Variant = 'full' | 'compact' | 'icon';

/**
 * Always-visible, cross-type catalog search. An accessible combobox/listbox:
 * arrow keys move the active option, Enter selects, Esc clears, click-away closes.
 * Selecting a result is delegated to `onSelect` (the picker/top bar wires it to
 * set the owned part and route to results).
 */
export function PartSearch({
  onSelect,
  placeholder = 'Search any part — brand, model, type, or spec…',
  variant = 'full',
  autoFocus = false,
}: {
  onSelect: (id: string) => void;
  placeholder?: string;
  variant?: Variant;
  autoFocus?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [iconOpen, setIconOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const results = useMemo(() => searchCatalog(CATALOG, query).slice(0, 8), [query]);
  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setIconOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const choose = (p: Part) => {
    setQuery('');
    setOpen(false);
    setIconOpen(false);
    onSelect(p.id);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setQuery('');
      setOpen(false);
      return;
    }
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(results[active]);
    }
  };

  // Collapsed mobile icon — expands to the input on tap.
  if (variant === 'icon' && !iconOpen) {
    return (
      <button
        type="button"
        aria-label="Search parts"
        onClick={() => {
          setIconOpen(true);
          setOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className="flex h-11 w-11 flex-none items-center justify-center rounded-[9px] border border-[#e1e2e5] bg-white text-[#3a3d44]"
      >
        <IconSearch />
      </button>
    );
  }

  const showList = open && query.trim().length > 0;
  const widthClass =
    variant === 'full' ? 'w-full' : 'w-[220px] max-w-[55vw]';

  return (
    <div ref={rootRef} className={`relative ${variant === 'full' ? 'w-full' : 'flex-none'}`}>
      <div
        className={`flex items-center gap-2.5 rounded-xl border border-[#e7e8ea] bg-white px-3.5 py-2.5 ${widthClass}`}
      >
        <IconSearch className="flex-none text-[#adb0b6]" />
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && results.length ? `${listId}-opt-${active}` : undefined}
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label="Search parts"
          className="w-full bg-transparent text-[14.5px] text-ink outline-none placeholder:text-[#abaeb4]"
        />
      </div>

      {showList && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Search results"
          className="absolute left-0 right-0 z-40 mt-2 max-h-[360px] list-none overflow-auto rounded-xl border border-hairline bg-white p-1.5 shadow-[0_12px_30px_rgba(20,20,30,0.12)]"
        >
          {results.length === 0 ? (
            <li className="px-3 py-3 text-[13px] text-[#abaeb4]">No parts match “{query}”.</li>
          ) : (
            results.map((p, i) => (
              <li key={p.id} id={`${listId}-opt-${i}`} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(p)}
                  className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left ${
                    i === active ? 'bg-[#f4f5f7]' : ''
                  }`}
                >
                  <PartTypeIcon type={p.type} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-semibold text-ink">
                      {p.name}
                    </span>
                    <span className="block truncate font-mono text-[11px] text-[#abaeb4]">
                      {p.brand} · {TYPE_TOKENS[p.type].label}
                    </span>
                  </span>
                  <span className="hidden flex-none font-mono text-[11px] text-[#cdcfd3] sm:block">
                    {p.spec}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
