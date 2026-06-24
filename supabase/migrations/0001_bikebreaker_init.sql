-- BikeBreaker schema, isolated inside the Butchapp project.
-- A Supabase project has one Postgres database, so the "separate db" is a
-- dedicated schema; its tables never touch Butchapp's public schema.
--
-- Run this FIRST in the Supabase SQL editor, then run supabase/seed.sql.

create schema if not exists bikebreaker;

create table if not exists bikebreaker.parts (
  id     text primary key,
  type   text not null,
  brand  text not null,
  name   text not null,
  spec   text not null,
  attrs  jsonb not null,
  source text
);

-- The catalog is public, read-only reference data. Enable RLS and allow only
-- SELECT to the public roles; no insert/update/delete from the client.
alter table bikebreaker.parts enable row level security;

drop policy if exists "public read" on bikebreaker.parts;
create policy "public read"
  on bikebreaker.parts
  for select
  to anon, authenticated
  using (true);

-- PostgREST (the supabase-js data API) needs schema usage + table select grants.
grant usage on schema bikebreaker to anon, authenticated;
grant select on bikebreaker.parts to anon, authenticated;

-- IMPORTANT: also expose the schema to the API, otherwise the client can't see it:
--   Dashboard → Settings → API → Exposed schemas → add `bikebreaker`.
