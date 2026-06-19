# Documentació Tècnica — GIRQUELL Portfolio v2

## Arquitectura general

```
Browser
  └─ Next.js 15 App Router (Vercel)
       ├─ Pàgina pública  /          → Server Component + Client Components
       ├─ Panel admin     /admin/**  → Client Components (auth guard)
       ├─ API routes      /api/**    → Edge/Node handlers
       └─ Server actions             → Mutations server-side
            └─ Supabase (Postgres + Auth + Storage)
```

Tot el contingut és CMS-driven. El client llegeix `/api/settings` en muntar i propaga els valors al store global (`StoreProvider`). Cada secció pública tira el seu propi endpoint per tenir les dades locals en cas de fallada de Supabase.

---

## Estructura de directoris

```
src/
├── app/
│   ├── page.tsx                    Arrel pública — compon totes les seccions
│   ├── layout.tsx                  Metadades globals (OG, favicon, fonts)
│   ├── globals.css                 Tokens CSS, keyframes, scrollbar
│   ├── admin/
│   │   ├── layout.tsx              Auth guard (redirigeix si no és admin)
│   │   ├── _components/Topbar.tsx  Capçalera reutilitzable de l'admin
│   │   ├── dashboard/page.tsx      KPIs dinàmics (stats API)
│   │   ├── projects/page.tsx       Llista de projectes + reordenació
│   │   ├── projects/[id]/page.tsx  Edició de projecte individual
│   │   ├── profile/page.tsx        Edició bio, datasheet, stack, foto
│   │   ├── cv/page.tsx             Edició CV (exp, edu, skills, langs, vol)
│   │   ├── channels/page.tsx       Gestió canals de contacte
│   │   ├── messages/page.tsx       Safata missatges + resposta
│   │   └── settings/page.tsx       Configuració global (accent, idioma, UI)
│   ├── api/
│   │   ├── auth/route.ts           GET (check session) · POST (login) · DELETE (logout)
│   │   ├── settings/route.ts       GET públic — display_name, slogan, accent, etc.
│   │   ├── profile/route.ts        GET públic — bio, datasheet, stack, photo
│   │   ├── projects/route.ts       GET públic — llista de projectes (param: lang)
│   │   ├── channels/route.ts       GET públic — canals live
│   │   ├── cv/route.ts             GET públic — dades del CV
│   │   ├── upload/route.ts         POST admin — puja imatge al bucket Supabase
│   │   └── admin/
│   │       ├── settings/route.ts   GET/POST — configuració (requereix auth)
│   │       ├── profile/route.ts    GET/POST — perfil (requereix auth)
│   │       ├── projects/reorder/route.ts  POST — reordenació (requereix auth)
│   │       ├── channels/route.ts   GET/POST — canals (requereix auth)
│   │       ├── messages/route.ts   GET/POST — missatges (requereix auth)
│   │       ├── messages/[id]/route.ts  PATCH/DELETE — missatge individual
│   │       ├── cv/route.ts         GET/POST — cv_data (requereix auth)
│   │       └── stats/route.ts      GET — KPIs del dashboard
│   └── actions/
│       ├── settings.ts             saveSettings() — upsert settings
│       ├── profile.ts              saveProfile() — upsert profile
│       └── projects.ts             saveProject(), deleteProject()
├── components/
│   ├── sections/
│   │   ├── Nav.tsx                 Nav fixa — logo, links, lang, terminal, badge
│   │   ├── Hero.tsx                Secció hero — nom, foto, rols, clock
│   │   ├── Marquee.tsx             Banda de text animada
│   │   ├── Profile.tsx             Bio, datasheet, stack
│   │   ├── Work.tsx                Acordió de projectes
│   │   └── Contact.tsx             Canals + formulari de contacte
│   ├── ui/
│   │   ├── BootScreen.tsx          Pantalla de boot inicial (condicionada per settings)
│   │   ├── HudCursor.tsx           Cursor personalitzat (condicionat per settings)
│   │   ├── ScanlinesOverlay.tsx    Overlay de scanlines (condicionat per settings)
│   │   ├── Terminal.tsx            Terminal interactiu (`~`)
│   │   ├── DetailPanel.tsx         Modal de detall de projecte
│   │   ├── CvModal.tsx             Modal CV amb impressió PDF
│   │   ├── DotCanvas.tsx           Canvas de punts de fons animats
│   │   ├── ScrollProgress.tsx      Barra de progrés de scroll
│   │   └── IntlProvider.tsx        Proveïdor next-intl (client)
│   └── admin/
│       └── ProjectEditModal.tsx    Modal d'edició de projecte (inline a Work)
└── lib/
    ├── store.tsx                   StoreProvider + useStore hook
    ├── content.ts                  Dades estàtiques de fallback
    ├── imgSrc.ts                   Helper URL d'imatge (Supabase Storage / local)
    ├── constants.ts                ADMIN_EMAIL (llegit de process.env)
    └── supabase/
        ├── client.ts               Client browser (@supabase/ssr)
        ├── server.ts               Client server (@supabase/ssr + cookies)
        └── types.ts                Tipus TypeScript del schema
```

---

## Esquema de base de dades

### `projects`
| Camp | Tipus | Descripció |
|------|-------|------------|
| `id` | uuid | Clau primària |
| `no` | text | Índex visual (ex: `NM·01`) |
| `org` | text | Organització |
| `cjk` | text | Text CJK decoratiu |
| `kind` | text | Tipus de projecte (WEB APP, etc.) |
| `img` | text | URL imatge (Supabase Storage o http) |
| `href` | text | URL del repositori |
| `tags` | text[] | Array de tecnologies |
| `role` | text | Rol al projecte |
| `year` | text | Any |
| `name` | text | Nom del projecte |
| `desc_cat/es/en` | text | Descripció curta (3 idiomes) |
| `long_cat/es/en` | text | Descripció llarga (3 idiomes) |
| `sort_order` | integer | Ordre a la llista |

RLS: lectura pública, escriptura autenticada.

### `profile` (singleton id=1)
| Camp | Tipus | Descripció |
|------|-------|------------|
| `sheet` | jsonb | Array `{k,v}` del Data Sheet |
| `bio1_cat/es/en` | text | Primer paràgraf bio (3 idiomes) |
| `bio2_cat/es/en` | text | Segon paràgraf bio (3 idiomes) |
| `stack` | jsonb | Array `{label, items}` de l'stack |
| `photo` | text | URL foto de portada (Hero) |

RLS: lectura pública, escriptura autenticada.

### `settings` (singleton id=1)
| Camp | Tipus | Default |
|------|-------|---------|
| `display_name` | text | `GIRQUELL` |
| `slogan` | text | `BORN TO USE. MADE TO CREATE.` |
| `sub_name` | text | `SERGI GIRIBET` |
| `coords` | text | `41.97°N / 2.78°E` |
| `year` | text | `2026` |
| `accent` | text | `Lime` |
| `default_lang` | text | `EN` |
| `scanlines` | boolean | `true` |
| `boot_sequence` | boolean | `true` |
| `hud_cursor` | boolean | `false` |
| `contact_cat/es/en` | text | Textos de la secció de contacte |
| `status_text` | text | `EN PAUSA` |

RLS: lectura pública, escriptura autenticada.

### `channels`
| Camp | Tipus |
|------|-------|
| `label` | text — nom del canal (GITHUB, EMAIL…) |
| `value` | text — valor visible (@SergiGiribet) |
| `href` | text — URL |
| `live` | boolean — visible al públic |
| `sort_order` | integer |

RLS: lectura pública, escriptura autenticada.

### `messages`
| Camp | Tipus |
|------|-------|
| `name`, `email`, `subject`, `body` | text |
| `read`, `archived` | boolean |
| `reply` | text\|null — text de la resposta enviada |
| `replied_at` | timestamptz\|null |

RLS: inserció pública, resta autenticada.

### `cv_data` (singleton id=1)
Camps: `identity`, `experience`, `education`, `skills`, `languages`, `volunteering` — tots jsonb.

### Storage bucket: `project-images`
Accés públic de lectura. Upload autenticat. S'utilitza per a imatges de projectes i foto de perfil.

---

## Flux d'autenticació

```
POST /api/auth  { password }
  → supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password })
  → Supabase retorna session cookie (httpOnly)
  → Client store: setAdmin(true), mostra badge ADMIN al nav

GET /api/auth
  → supabase.auth.getUser()  (llegeix cookie)
  → Si user.email === ADMIN_EMAIL → { authenticated: true }
```

L'email de l'admin es llegeix de `process.env.ADMIN_EMAIL` (definit a `.env.local`). En cas que no estigui definit, `src/lib/constants.ts` usa `"sergi@giribet.cat"` com a fallback.

Cada endpoint admin comprova `user?.email !== ADMIN_EMAIL` i retorna 401 si no coincideix.

---

## Store global (`useStore`)

```typescript
interface Store {
  // Idioma i accent
  lang: "CAT" | "ES" | "EN"
  setLang(l)
  accent: "Lime" | "Pink" | "Violet"
  setAccent(a)

  // Navegació
  activeSection: "top" | "profile" | "work" | "contact"
  setActiveSection(s)

  // UI overlays
  termOpen: boolean        // terminal ~
  setTermOpen(v)
  cvOpen: boolean          // modal CV
  setCvOpen(v)
  detailProject: SelectedProject | null   // modal detall projecte
  openDetail(p) / closeDetail()

  // Admin
  isAdmin: boolean
  setAdmin(v)

  // Configuració CMS (carregada de /api/settings)
  siteSettings: SiteSettings
}
```

`lang` i `accent` es persisten a `localStorage`. Els canvis de `lang` disparen `langFxKey++` que activa l'animació de transició.

---

## i18n

Tres fitxers a `/messages/`: `ca.json`, `es.json`, `en.json`.

L'idioma per defecte es llegeix de:
1. `localStorage.gq_lang` (preferència del visitant)
2. `settings.default_lang` (configurable des de l'admin)
3. Fallback: `EN`

Els textos de contacte (`contact_cat/es/en`) vénen del CMS, no dels fitxers de traducció.

---

## Fallbacks estàtics

`src/lib/content.ts` conté còpies estàtiques de tots els continguts. Si Supabase no és accessible (build sense `.env`, CI, etc.), els components serveixen el contingut estàtic sense errors.

---

## Migracions (ordre d'execució)

| Fitxer | Contingut |
|--------|-----------|
| `001_projects.sql` | Taula `projects` + RLS + trigger `updated_at` |
| `002_seed_projects.sql` | Dades inicials de projectes |
| `003_storage.sql` | Bucket `project-images` + polítiques |
| `004_admin_tables.sql` | Taules `channels`, `messages`, `profile`, `cv_data`, `settings` + seeds |
| `005_settings_messages_extend.sql` | Afegeix `sub_name`, `coords`, `year`, `contact_*` a settings; `reply`, `replied_at` a messages |
| `006_settings_status.sql` | Afegeix `status_text` a settings |
| `007_profile_photo.sql` | Afegeix `photo` a profile |
