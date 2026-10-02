-- ============================================================
-- Aaya Perfume — initial schema
--
-- This is the canonical, versioned copy of what used to live in
-- supabase/schema.sql. It is picked up automatically by the
-- Supabase GitHub integration ("Deploy to production"), which
-- applies any unapplied file in supabase/migrations whenever
-- `main` is updated.
--
-- It is written to be re-runnable on purpose. The schema was
-- originally created by pasting SQL into the dashboard editor, so
-- the production tables already exist and this migration will run
-- against them. Every statement is guarded, so re-applying it is a
-- no-op that still succeeds.
--
-- The migration history lives in supabase_migrations.schema_migrations.
-- Applying this file by hand in the SQL editor does NOT record it
-- there, which is why the GitHub integration is the better path.
-- ============================================================

create table if not exists public.orders (
  id                text primary key,             -- e.g. AAYA-7QK4M2
  reference         text not null unique,          -- customer-facing code
  user_id           uuid references auth.users (id) on delete set null,
  customer_name     text not null,
  customer_email    text not null,
  shipping_address  text not null,
  items             jsonb not null default '[]'::jsonb,
  subtotal_minor    integer not null check (subtotal_minor >= 0),
  shipping_minor    integer not null default 0 check (shipping_minor >= 0),
  total_minor       integer not null check (total_minor >= 0),
  status            text not null default 'paid'
                    check (status in ('paid', 'processing', 'shipped')),
  created_at        timestamptz not null default now()
);

-- Customers look their orders up by email; the app lists by user_id.
create index if not exists orders_user_id_idx
  on public.orders (user_id, created_at desc);
create index if not exists orders_email_idx
  on public.orders (customer_email);

-- Only the signed-in owner can read their orders. Guests get no
-- `user_id` row access, so they use /orders/AAYA-XXXXXX instead.
alter table public.orders enable row level security;

drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own" on public.orders
  for select
  using (auth.uid() = user_id);

-- No insert/update/delete policies on purpose: writes go through the
-- server action, which uses the service-role key and is never exposed
-- to the browser.

-- ============================================================
-- The catalogue (optional — src/lib/data/*.ts ships as a
-- fallback so the site renders even before this table is filled).
-- Every column matches the Product type in src/lib/types.ts.
-- ============================================================

create table if not exists public.products (
  id             text primary key,
  slug           text not null unique,
  name           text not null,
  family         text not null,
  blurb          text not null,
  notes          jsonb not null default '{}'::jsonb,
  size_ml        integer not null default 24,
  price_minor    integer not null check (price_minor >= 0),
  compare_minor  integer not null default 0,
  stock          integer not null default 0,
  hue            text not null default '#b08d57',
  audience       text not null default 'unisex'
                 check (audience in ('women', 'men', 'unisex')),
  intensity      smallint not null default 2 check (intensity between 1 and 3),
  seasons        text[] not null default '{}',
  occasion       text[] not null default '{}',
  created_at     timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "products_read_all" on public.products;
create policy "products_read_all" on public.products
  for select
  using (true);

-- RLS only governs the `anon` and `authenticated` roles. Grant table
-- access explicitly so a fresh database matches the one the live site
-- is already talking to. `service_role` bypasses RLS regardless, which
-- is how the checkout writes orders.
grant usage on schema public to anon, authenticated, service_role;
grant select on public.orders, public.products to anon, authenticated;
grant all on public.orders, public.products to service_role;