# Sistema de Disseny i Llenguatge de Marca — GIRQUELL v2

## Concepte

**GIRQUELL Portfolio v2** és un sistema d'interfície inspirat en panells de control militars, terminalls CRT dels anys 80 i estètica HUD (Heads-Up Display). El disseny comunica precisió tècnica, identitat d'autor i capacitat de construcció sense renunciar a la llegibilitat.

El vocabulari visual s'articula al voltant de:
- Superfícies fosques amb detalls lluminosos puntuals
- Tipografia monoespaciada com a element estructural, no decoratiu
- Color accent com a signal — no com a decoració
- Grids estrictes, marges consistents, sense ornaments gratuïts

---

## Paleta de color

### Fons i superfícies

| Token | Valor | Ús |
|-------|-------|----|
| `bg-base` | `#0a0b0a` | Fons principal, inputs |
| `bg-raised` | `#0c0d0c` | Seccions elevades (Work, nav) |
| `bg-card` | `#0e0f0e` | Cards, panels, admin |
| `bg-hover` | `#101210` | Estat hover de rows/cards |
| `bg-deep` | `#090a09` | Expanded panels |

### Frontera i divisors

| Token | Valor | Ús |
|-------|-------|----|
| `border-strong` | `#2a2c2a` | Vores principals de cards |
| `border-mid` | `#1c1e1c` | Divisors de seccions |
| `border-subtle` | `#181a18` / `#161816` | Línies interiors |

### Text

| Token | Valor | Ús |
|-------|-------|----|
| `text-bright` | `#edeee8` | Títols, valors destacats |
| `text-body` | `#d6d8d1` / `#cfd2ca` | Cos de text |
| `text-secondary` | `#9a9d96` | Text secundari, labels |
| `text-dim` | `#8a8d83` / `#8a8d86` | Labels mono, placeholders |
| `text-muted` | `#7e8178` | Metadades, coordenades |
| `text-ghost` | `#5a5d57` | Elements inactius |
| `text-dead` | `#3a3d38` / `#4a4d47` | Elements molt apagats |

### Accents (variables CSS)

El color accent es gestiona via `--ac` i és intercanviable per l'usuari:

| Nom | Valor | Context |
|-----|-------|---------|
| **Lime** (default) | `#c7f536` | Accent principal — HUD verd |
| **Pink** | `#ff2d8e` | Accent alternatiu — alerta, hover destructiu |
| **Violet** | `#9d8dff` | Accent decoratiu — elements CJK, stack |

La variable `--ac` s'aplica a: botons primaris, highlights de nav, badges d'estat, indicadors actius, vores d'elements seleccionats, overlays duotone d'imatges.

`--pink` s'usa exclusivament per: estats d'error, botons ADMIN, hover de tancament.

---

## Tipografia

### Famílies

| Família | Variable CSS | Rol |
|---------|-------------|-----|
| **Archivo Black** | `'Archivo Black',sans-serif` | Display — títols grans, números decoratius |
| **Chakra Petch** | `'Chakra Petch',sans-serif` | Sans — noms de projecte, cos de text, UI |
| **JetBrains Mono** | `'JetBrains Mono',monospace` | Mono — labels, metadades, terminal, nav |

### Escala i ús

```
Archivo Black
  clamp(58px, 11vw, 168px)  → H1 display (nom principal)
  clamp(56px, 16vw, 230px)  → Wordmark de peu de pàgina
  clamp(34px, 5vw, 68px)    → Números de secció (*01, *02…)
  clamp(26px, 4vw, 40px)    → Títol en DetailPanel

Chakra Petch 700 (Bold)
  clamp(24px, 3.4vw, 44px)  → Títols de secció (H2)
  clamp(18px, 2.2vw, 26px)  → Noms de projecte a l'acordió
  21px                       → Noms de projecte a cards
  18px                       → Valors de canals de contacte

Chakra Petch 400 (Regular)
  clamp(18px, 2.4vw, 30px)  → Text de contacte destacat
  clamp(16px, 1.9vw, 22px)  → Bio paràgraf 1
  clamp(15px, 1.6vw, 18px)  → Bio paràgraf 2
  clamp(14px, 1.4vw, 17px)  → Descripció llarga de projecte
  15px                       → CV, detalls

JetBrains Mono
  clamp(13px, 1.5vw, 17px)  → Slogan
  13px, 14px                 → Body mono
  11px                       → Index de fila, labels grans
  10px                       → Labels estàndard, nav, botons
  9px                        → Microlabels, tags, coords
  8px                        → Labels molt secundaris
```

### Letter-spacing

El mono utilitza `letter-spacing` ampli com a element de disseny:

| Valor | Context |
|-------|---------|
| `0.34em` | Subtítols de secció (DEV.SYS_v2) |
| `0.3em` | Slogan |
| `0.26em` | Tags de secció (FIELD LOG, OPEN CHANNEL) |
| `0.22em` | Coordenades, HUD strips |
| `0.2em` | Labels generals |
| `0.18em` | Botons, nav links |
| `0.16em` | Tags de projectes, valors de metadades |
| `0.14em` | Kind badges, controls |
| `0.1em` | Tags tecnologies |

---

## Iconografia i simbologia

El projecte no usa llibreries d'icones. Tots els símbols són text:

| Símbol | Ús |
|--------|----|
| `●` | Indicador actiu (nav, panel header) |
| `◆` | Indicador stack/violet |
| `↗` | Link extern, acció d'obrir |
| `↓` | Scroll cue |
| `+` | Expand (accordion) |
| `×` | Collapse (accordion rotat 45°) |
| `✕` | Tancament de modal |
| `✓` | Confirmat, guardat |
| `>_` | Terminal |
| `>` | Prompt de terminal |

### Brackets de cantonada

Recurs visual recurrent: `L`-shapes de 1-2px a les cantonades d'imatges i contenidors clau. Transmeten "sistema d'enquadrament" / visor tàctic.

```css
/* Cantonada superior esquerra (accent) */
width: 14px; height: 14px;
border-top: 1px solid var(--ac); border-left: 1px solid var(--ac);

/* Cantonada inferior dreta (tènue) */
border-bottom: 1px solid var(--ac); border-right: 1px solid var(--ac);
```

### Text CJK

Caràcters japonesos / xinesos usats com a element decoratiu i d'identitat:
- `接続` (connexió) — secció Contact
- `選抜作品` (obra seleccionada) — secció Work
- `プロフィール` (perfil) — secció Profile
- `OPERATOR // 開発者` — Hero strip
- `夕` — accent decoratiu al Hero

Funcionen com a contrapunt cultural al vocabulari tècnic occidental.

---

## Efectes visuals

### Scanlines
Overlay fix de `repeating-linear-gradient` amb línies d'1px cada 3px, `opacity ~0.022`, `mix-blend-mode: overlay`. Animació `gq-scan` llisca verticalment cada 8s. Activable/desactivable des del CMS.

### Duotone en imatges
Totes les imatges de projecte apliquen:
1. `filter: grayscale(1) contrast(1.12) brightness(0.88-0.92)` — elimina color
2. Capa `background: var(--ac)` amb `mix-blend-mode: multiply; opacity: 0.38-0.42` — tenyeix amb l'accent
3. Scanlines locals (`repeating-linear-gradient`)
4. Vignette radial (`radial-gradient`)

El resultat és una imatge monocromàtica amb el color accent.

### Animacions (keyframes globals)

| Keyframe | Durada | Ús |
|----------|--------|----|
| `gq-rise` | 0.25s | Aparició d'elements, DetailPanel |
| `gq-blink` | 1.8s loop | Indicadors d'estat (●) |
| `gq-scan` | 8s loop | Overlay scanlines |
| `gq-float` | 2.4s loop | Scroll cue |
| `gq-mq` | 26s loop | Marquee de text |
| `gq-glitch` | 7s loop | Títol H1 — glitch ocasional |
| `gq-vdrift` | 2.6s alt | Drift vertical scanlines hero |
| `gq-langfx` | 0.4s | Transició de canvi d'idioma |
| `gq-boot-rise` | 0.25s | Línies del boot screen |

### Animacions locals (components)

| Keyframe | Component | Ús |
|----------|-----------|----|
| `gq-wipe` | Work.tsx | Revelació d'imatge (clip-path d'esquerra a dreta) |
| `gq-scanbar` | Work.tsx | Barra de scan animada sobre imatges expandides |
| `gq-panel-open` | Work.tsx | Aparició del panell expandit de l'acordió |

### Boot Screen
Seqüència de 5 línies de log amb progress bar. Es mostra una sola vegada per sessió del navegador (`sessionStorage.gq_booted`). Condicionat per `settings.boot_sequence`.

### HUD Cursor
Ring de 26px que segueix el cursor amb lag (interpolació 0.22). Expandeix a 40px i canvia a `--pink` sobre elements interactius. Oculta el cursor natiu. Condicionat per `settings.hud_cursor` (default: off).

---

## Layout i grid

### Macro-estructura

Pàgina de scroll vertical. Totes les seccions a ample complet (`100vw`), contingut centrat a `max-width: 1280px` amb `padding: 0 28px`.

Nav fixa de `54px` d'alçada amb `backdrop-filter: blur(10px)`.

### Grids de seccions

| Secció | Grid |
|--------|------|
| Hero | `1.55fr 1fr` (text / foto) |
| Profile | `0.85fr 1.3fr 0.85fr` (datasheet / bio / stack) |
| Work | Acordió full-width; panell expandit `0.95fr 1.05fr` |
| Contact | Canals `repeat(2, 1fr)`; formulari full-width |

### Breakpoints

| Punt | Valor | Canvi |
|------|-------|-------|
| Nav collapse | `860px` | Links de nav ocults |
| Hero stack | `860px` | Grid 2 col → 1 col |
| Profile stack | `860px` | Grid 3 col → 1 col |
| Work panel | `900px` | Panel expandit 2 col → 1 col |
| Contact grid | `620px` | Canals + formulari → 1 col |

---

## Patrons de components

### Card / Panel
- `border: 1px solid #2a2c2a`
- `background: #0e0f0e`
- Capçalera interna: `padding: 10-11px 14-16px`, `border-bottom: 1px solid #1c1e1c`, text mono 9px `#8a8d83`
- Indicador actiu `●` en accent a la dreta de la capçalera

### Botó primari
```css
background: var(--ac);
color: #0a0b0a;
border: none;
font-family: JetBrains Mono;
font-size: 10-11px;
letter-spacing: 0.16-0.18em;
font-weight: 700;
text-transform: uppercase;
padding: 9-12px 16-20px;
```

### Botó secundari (ghost)
```css
background: none;
border: 1px solid #2a2c2a;
color: #9a9d96;
/* hover: borderColor → var(--ac); color → var(--ac) */
```

### Input / Textarea
```css
background: #0a0b0a;
border: 1px solid #2a2c2a;
color: #e8e9e4;
font-family: Chakra Petch;
font-size: 14px;
padding: 10px 12px;
outline: none;
/* error: borderColor → var(--pink) */
```

### Tag / Badge
```css
font-family: JetBrains Mono;
font-size: 9px;
letter-spacing: 0.1em;
text-transform: uppercase;
color: #9a9d96;
border: 1px solid #2a2c2a;
padding: 4-5px 8-9px;
```

---

## Veu visual de marca

**Precís però no fred.** L'estètica terminal és una metàfora de competència tècnica, no una barrera d'entrada. El contingut és accessible; la forma és específica.

**Identitat d'autor.** Cada element tipogràfic, cada bracket de cantonada, cada caràcter CJK reforcen que hi ha una persona concreta darrere — no un template.

**Jerarquia per contrast, no per mida.** Els canvis de color (accent sobre fosc) transmeten importància. La mida fa el treball secundari.

**Animació funcional.** Cap animació és merament decorativa: o revela contingut (`gq-wipe`, `gq-rise`), o indica estat (`gq-blink`), o afegeix vida sense distreure (`gq-scan`).

**L'accent és senyal.** `var(--ac)` assenyala: "aquí hi ha una acció, un valor important, o l'estat actiu". Quan canvia el color accent (Lime / Pink / Violet), tota la personalitat visual canvia amb ell.
