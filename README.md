# BikeBreaker

A road-bike parts compatibility checker. **"I have this part — what fits?"** Pick the
one part you own and BikeBreaker computes every other catalog part (any brand) that is
mechanically compatible with it — grouped by relationship, each with an unambiguous
**fits / conflict / unrelated** status and an expandable, per-dimension "Why?" panel.

It's an assembly/compatibility tool — there is **no pricing** anywhere.

## Stack

- **React + TypeScript + Vite**
- **Tailwind CSS** (light theme), token-driven status + part-type colors
- **React Router** for the three-step flow: **Your part → What fits → Your build**
- **Zustand** (`persist` middleware) — `{ ownedPartId, build }` saved to `localStorage`
- **Vitest** + **Testing Library** (jsdom) — engine unit tests *and* UI/integration tests

Eight part types are modeled and checkable: frame, crankset, bottom bracket, wheelset,
cassette, tire, **fork** (front-axle + steerer), and **chain** (speed + Flattop standard).
A side-view **bike picker** lets you tap the part you own; parts the engine doesn't model
(handlebar, derailleurs, brakes…) are drawn faded and labelled "not checked yet".

## Scripts

```bash
npm install
npm run dev        # start the dev server (http://localhost:5173)
npm run test       # run all tests — engine, store, components, screens, flows
npm run build      # typecheck (tsc -b) and build for production
npm run preview    # preview the production build
```

## Architecture

The compatibility logic is a **pure, framework-free, unit-tested module** — the UI never
hard-codes a status. A real database/API can replace the static catalog without touching
the UI: just return the same `Part[]` shape.

```
src/
  types.ts            # domain model (Part, attrs unions, CompatResult)
  data/               # SWAP POINT — catalog + relations (static today, API later)
    catalog.ts        # curated seed + sourced datasets, merged & validated
    sources/*.json    # data extracted from manufacturer spec PDFs (e.g. Shimano)
    validateCatalog.ts# runtime schema/enum validation — fails fast on bad data
    relations.ts      # candidate relationships per owned-part type
  lib/                # PURE engine (no React, no colors)
    compat.ts         # compat(a, b) → { tone, reason, detail }
    results.ts        # generateGroups · aggregateKpis · crossCheckBuild (holistic)
    *.test.ts         # engine cases covering every rule branch + symmetry
  theme/tokens.ts     # the only place a tone / PartType maps to colors
  store/useStore.ts   # Zustand store + localStorage persistence
  components/          # Sidebar, TopBar, OwnedPartBar (global anchor), BikeDiagram,
                       # PartChip, PartTypeIcon, StatusBadge, SpecCompare, ResultGroup, …
  screens/            # PickPart (Your part · bike + list) · Results (What fits) · MyBuild
  test/setup.ts       # jsdom + jest-dom matchers for component tests
```

`*.test.ts` / `*.test.tsx` files sit next to what they cover — engine rules, the store,
components, screens, and the pick → results flow (67 tests in total).

### The engine

`compat(a, b)` dispatches on the **unordered** type pair and returns plain data:

- `tone`: `'fits' | 'conflict' | 'unrelated'`
- `reason`: a short human sentence (e.g. _"Axle mismatch — QR 135mm won't hold in a 142×12 frame"_)
- `detail`: per-dimension `{ label, you, them, ok }` rows powering the "Why?" panel

`crossCheckBuild` validates a whole build **holistically** — every part against every other
part — so a clash between two added parts (not just with the owned part) is flagged live.

## Quality

- Engine is pure and unit-tested; the UI computes every status.
- Keyboard-accessible, semantic HTML, 44px min hit targets, `prefers-reduced-motion` respected.
- Fully responsive: the sidebar collapses to a hamburger + slide-in overlay below 900px.
- `localStorage` persistence survives reload.
