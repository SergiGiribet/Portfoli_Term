-- Projects table
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  no          text not null,
  org         text not null default 'GIRQUELL',
  cjk         text not null default '',
  kind        text not null default '',
  img         text not null default '',
  href        text not null default '',
  tags        text[] not null default '{}',
  role        text not null default '',
  year        text not null default '',
  name        text not null,
  desc_cat    text not null default '',
  desc_es     text not null default '',
  desc_en     text not null default '',
  long_cat    text not null default '',
  long_es     text not null default '',
  long_en     text not null default '',
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger projects_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();

-- Row Level Security
alter table public.projects enable row level security;

-- Public read (portfolio is public)
create policy "projects_public_read"
  on public.projects for select
  using (true);

-- Admin write (authenticated users only)
create policy "projects_admin_insert"
  on public.projects for insert
  to authenticated
  with check (true);

create policy "projects_admin_update"
  on public.projects for update
  to authenticated
  using (true)
  with check (true);

create policy "projects_admin_delete"
  on public.projects for delete
  to authenticated
  using (true);
