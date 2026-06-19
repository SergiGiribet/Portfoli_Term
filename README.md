# GIRQUELL — Portfolio Terminal v2

Personal portfolio with a CRT / HUD terminal aesthetic. Built with Next.js 15, Supabase, and next-intl. Fully CMS-driven via a private admin panel — no redeployments needed to update content.

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Database & Auth | Supabase (Postgres + Auth + Storage) |
| i18n | next-intl (CAT / ES / EN) |
| Styling | Inline styles + CSS custom properties |
| Fonts | Archivo Black · Chakra Petch · JetBrains Mono |

## Features

- **CMS admin panel** at `/admin` — projects, profile, CV, channels, messages, settings
- **Contact form** with in-panel reply workflow
- **Interactive terminal** (`~` key) with live data from the database
- **CV modal** with PDF print
- **Boot sequence, scanlines, HUD cursor** — all toggleable from settings
- **Accent colour** switcher (Lime / Pink / Violet) persisted per visitor
- **Three-language** UI (CAT / ES / EN) with per-language content

## Local Setup

```bash
git clone https://github.com/SergiGiribet/Portfoli_Term
cd Portfoli_Term
npm install
cp .env.example .env.local   # fill in your Supabase credentials + ADMIN_EMAIL
npm run dev
```

## Database Setup

Run the migrations in order in the Supabase SQL Editor:

```
supabase/migrations/001_projects.sql
supabase/migrations/002_seed_projects.sql
supabase/migrations/003_storage.sql
supabase/migrations/004_admin_tables.sql
supabase/migrations/005_settings_messages_extend.sql
supabase/migrations/006_settings_status.sql
supabase/migrations/007_profile_photo.sql
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-side only) |
| `ADMIN_EMAIL` | Email address of the admin user in Supabase Auth |

## Admin Panel

Navigate to `/admin` and sign in with the password you set for `ADMIN_EMAIL` in Supabase Auth.

Sections: Dashboard · Projects · Profile · CV · Channels · Messages · Settings

## Project Structure

```
src/
├── app/
│   ├── admin/          Admin CMS pages
│   ├── api/            API routes (public + admin)
│   └── actions/        Server actions (mutations)
├── components/
│   ├── sections/       Public page sections
│   ├── ui/             UI components (Terminal, CvModal, BootScreen…)
│   └── admin/          Admin-only components
└── lib/
    ├── store.tsx        Global React context (lang, accent, siteSettings…)
    ├── content.ts       Static fallback data
    └── supabase/        Supabase client + TypeScript types
```
