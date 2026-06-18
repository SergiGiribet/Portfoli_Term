-- ─── channels ───────────────────────────────────────────────────────────────
create table if not exists channels (
  id         uuid primary key default gen_random_uuid(),
  label      text not null,
  value      text not null default '',
  href       text not null default '',
  live       boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table channels enable row level security;
create policy "public read channels"  on channels for select using (true);
create policy "auth write channels"   on channels for all    using (auth.role() = 'authenticated');

insert into channels (label, value, href, live, sort_order) values
  ('GITHUB',    '@SergiGiribet',   'https://github.com/SergiGiribet',        true, 1),
  ('ORG',       '@DuckHats',       'https://github.com/DuckHats',            true, 2),
  ('STUDIO',    'duckhats.cat',    'https://duckhats.cat',                   true, 3),
  ('EMAIL',     'info@duckhats.cat','mailto:info@duckhats.cat',              true, 4),
  ('X',         '@Hats4Ducks',     'https://x.com/Hats4Ducks',              true, 5),
  ('INSTAGRAM', '@hats4_ducks',    'https://instagram.com/hats4_ducks',      true, 6)
on conflict do nothing;

-- ─── messages ────────────────────────────────────────────────────────────────
create table if not exists messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  subject    text not null default '',
  body       text not null,
  read       boolean not null default false,
  archived   boolean not null default false,
  created_at timestamptz default now()
);

alter table messages enable row level security;
create policy "auth read messages"    on messages for select using (auth.role() = 'authenticated');
create policy "public send messages"  on messages for insert with check (true);
create policy "auth update messages"  on messages for update using (auth.role() = 'authenticated');
create policy "auth delete messages"  on messages for delete using (auth.role() = 'authenticated');

-- ─── profile (singleton id=1) ─────────────────────────────────────────────
create table if not exists profile (
  id         integer primary key default 1,
  sheet      jsonb not null default '[]',
  bio1_cat   text  not null default '',
  bio1_es    text  not null default '',
  bio1_en    text  not null default '',
  bio2_cat   text  not null default '',
  bio2_es    text  not null default '',
  bio2_en    text  not null default '',
  stack      jsonb not null default '[]',
  updated_at timestamptz default now()
);

alter table profile enable row level security;
create policy "public read profile"   on profile for select using (true);
create policy "auth write profile"    on profile for all    using (auth.role() = 'authenticated');

insert into profile (id, sheet, bio1_en, bio1_es, bio1_cat, bio2_en, bio2_es, bio2_cat, stack) values (
  1,
  '[{"k":"STATUS","v":"OPERATIONAL"},{"k":"BASE","v":"CATALONIA, ES"},{"k":"ROLE","v":"MULTIPLATFORM DEV"},{"k":"STUDY","v":"CS ENGINEERING"},{"k":"VENTURE","v":"DUCKHATS // FOUNDER"},{"k":"STATE","v":"ON BREAK"}]',
  'Multiplatform developer and Computer Engineering student. I build things for web, mobile and hardware — from the frontend down to the Raspberry Pi.',
  'Desarrollador multiplataforma y estudiante de Ingeniería Informática. Construyo cosas para web, móvil y hardware — del frontend a la Raspberry Pi.',
  'Desenvolupador multiplataforma i estudiant d''Enginyeria Informàtica. Construeixo coses per a web, mòbil i hardware — del frontend a la Raspberry Pi.',
  'Founder of DuckHats, where serious code meets creative chaos to leave a mark.',
  'Fundador de DuckHats, donde el código serio se encuentra con el caos creativo para dejar huella.',
  'Fundador de DuckHats, on el codi seriós es troba amb el caos creatiu per deixar empremta.',
  '[{"label":"LANGUAGES","items":"JavaScript · TypeScript · HTML/CSS"},{"label":"WEB / RUNTIME","items":"Node.js · React · REST"},{"label":"SYSTEMS","items":"Raspberry Pi · Linux · IoT"},{"label":"TOOLS","items":"Git · GitHub · Figma"}]'
) on conflict (id) do nothing;

-- ─── cv_data (singleton id=1) ─────────────────────────────────────────────
create table if not exists cv_data (
  id           integer primary key default 1,
  identity     jsonb not null default '{}',
  experience   jsonb not null default '[]',
  education    jsonb not null default '[]',
  skills       jsonb not null default '[]',
  languages    jsonb not null default '[]',
  volunteering jsonb not null default '{}',
  updated_at   timestamptz default now()
);

alter table cv_data enable row level security;
create policy "public read cv"        on cv_data for select using (true);
create policy "auth write cv"         on cv_data for all    using (auth.role() = 'authenticated');

insert into cv_data (id, identity, experience, education, skills, languages, volunteering) values (
  1,
  '{"name":"SERGI GIRIBET","tagline":"BORN TO USE. MADE TO CREATE.","location":"Girona, ES","phone":"+34 636 634 388","email":"sergi@giribet.cat"}',
  '[{"role":"Full-stack Developer","org":"DuckHats","meta":"2023 – Present"},{"role":"IoT Tinkerer","org":"Personal","meta":"2022 – Present"}]',
  '[{"role":"Computer Science Engineering","org":"UdG — Universitat de Girona","meta":"2023 – Present"}]',
  '[{"k":"Frontend","v":"React, Next.js, HTML/CSS, TypeScript"},{"k":"Backend","v":"Node.js, PHP, REST APIs"},{"k":"Systems","v":"Raspberry Pi, Linux, IoT"},{"k":"Tools","v":"Git, GitHub, Figma, Supabase"}]',
  '[{"lang":"Catalan","level":"Native"},{"lang":"Spanish","level":"Native"},{"lang":"English","level":"Conversational"}]',
  '{"role":"Volunteer","org":"Asperpol","meta":"Mar 2021 – May 2023","desc":"Prepared material donations for ASPERPOL''s international development projects in The Gambia."}'
) on conflict (id) do nothing;

-- ─── settings (singleton id=1) ────────────────────────────────────────────
create table if not exists settings (
  id            integer primary key default 1,
  display_name  text    not null default 'GIRQUELL',
  slogan        text    not null default 'BORN TO USE. MADE TO CREATE.',
  accent        text    not null default 'Lime',
  default_lang  text    not null default 'EN',
  scanlines     boolean not null default true,
  boot_sequence boolean not null default true,
  hud_cursor    boolean not null default false,
  updated_at    timestamptz default now()
);

alter table settings enable row level security;
create policy "public read settings"  on settings for select using (true);
create policy "auth write settings"   on settings for all    using (auth.role() = 'authenticated');

insert into settings (id) values (1) on conflict (id) do nothing;

-- ─── updated_at triggers ──────────────────────────────────────────────────
create or replace function handle_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'channels_updated_at') then
    create trigger channels_updated_at  before update on channels  for each row execute procedure handle_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'profile_updated_at') then
    create trigger profile_updated_at   before update on profile   for each row execute procedure handle_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'cv_data_updated_at') then
    create trigger cv_data_updated_at   before update on cv_data   for each row execute procedure handle_updated_at();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 'settings_updated_at') then
    create trigger settings_updated_at  before update on settings  for each row execute procedure handle_updated_at();
  end if;
end $$;
