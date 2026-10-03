-- ============================================================
-- Shared cart (Stage 3)
--
-- A signed-in customer's bag lives here, so the website and the
-- mobile app see the same cart. Adding a bottle on one shows up on
-- the other straight away through Supabase Realtime.
--
-- Guests keep using the browser cart (localStorage); it is merged
-- into this table the moment they sign in.
--
-- Re-runnable: every statement is guarded.
-- ============================================================

create table if not exists public.cart_items (
  user_id     uuid not null references auth.users (id) on delete cascade,
  slug        text not null,                    -- matches Product.slug
  qty         integer not null default 1 check (qty between 1 and 10),
  updated_at  timestamptz not null default now(),
  primary key (user_id, slug)
);

-- Each customer can see and change only their own bag.
alter table public.cart_items enable row level security;

drop policy if exists "cart_select_own" on public.cart_items;
create policy "cart_select_own" on public.cart_items
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "cart_insert_own" on public.cart_items;
create policy "cart_insert_own" on public.cart_items
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "cart_update_own" on public.cart_items;
create policy "cart_update_own" on public.cart_items
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "cart_delete_own" on public.cart_items;
create policy "cart_delete_own" on public.cart_items
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Keep updated_at honest on every change.
create or replace function public.cart_items_touch()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists cart_items_touch on public.cart_items;
create trigger cart_items_touch
  before update on public.cart_items
  for each row execute function public.cart_items_touch();

-- Realtime: broadcast inserts, updates and deletes. Full replica
-- identity lets DELETE events carry user_id so clients can filter.
alter table public.cart_items replica identity full;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'cart_items'
  ) then
    alter publication supabase_realtime add table public.cart_items;
  end if;
end;
$$;
