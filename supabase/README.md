# Supabase setup (Butchapp project → `bikebreaker` schema)

BikeBreaker's parts catalog lives in a dedicated **`bikebreaker`** schema inside the
existing **Butchapp** Supabase project, isolated from Butchapp's `public` schema.

## One-time setup

1. **Create the schema + table.** Open the Butchapp project → **SQL Editor** → paste and
   run [`migrations/0001_bikebreaker_init.sql`](migrations/0001_bikebreaker_init.sql).

2. **Load the data.** In the SQL Editor, paste and run [`seed.sql`](seed.sql)
   (idempotent — safe to re-run; it upserts on `id`).

3. **Expose the schema to the API.** Dashboard → **Settings → API → Exposed schemas** →
   add **`bikebreaker`** and save. Without this, the supabase-js client cannot query the
   schema and the app silently falls back to its bundled catalog.

4. **Wire the app.** Dashboard → **Settings → API** → copy the **Project URL** and the
   **anon / public** key into:
   - local dev: a `.env.local` file at the repo root (see [`.env.example`](../.env.example));
   - production: GitHub repo **Settings → Secrets and variables → Actions** as
     `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

   The anon key is public-by-design and protected by the read-only RLS policy above —
   it's safe to ship in the static bundle.

## Updating the catalog

`seed.sql` is generated from the in-code catalog so the two never drift:

```bash
npm run seed:sql   # regenerates supabase/seed.sql from src/data/catalog.ts
```

Re-run the new `seed.sql` in the SQL Editor to push changes to the database.

## Notes for future data

- `attrs` is a single `jsonb` column. Keep numbers (`speed`, `width`, `rimInternal`)
  as JSON numbers and booleans as JSON booleans — they round-trip cleanly. Keep
  `bbBore` as a **string** (`"24"`, `"28.99"`, `"30"`) to match the validator enum.
- Every row is re-validated client-side at load (`src/data/validateCatalog.ts`), so a
  bad record fails fast into the bundled fallback rather than reaching users.
