# VeriAI Systems — Design System

## Naming

- Company: **VeriAI Systems**
- Product: **VeriCore.One**
- Engine: **VeriCore Engine**
- Workspace: **VeriCore Workbench**
- German positioning: **Anforderungsbasierte, signalgestützte Verifikation für Automotive-Systeme.**

## Company Overview

**VeriAI Systems** is an early-stage engineering company building **VeriCore.One**, a requirements-based, signal-driven verification platform for automotive systems. Their product transforms natural-language requirements into deterministic, signal-based validation rules — no cloud, no black-box AI, fully local and auditable.

**Tagline:** "From requirement to verification — without ambiguity."

**Domain:** Embedded systems engineering. Target users are automotive/industrial engineers validating CAN, UART, and CSV signal behavior against formal specifications.

**Status:** Prototype / Active Development (as of 2026)

**Website:** https://github.com/XianghuiZhao/veriaisystems-website (password-protected prototype, password: `veriaisystems2026`)

---

## Products

One primary surface: the **marketing/prototype website** (dark-first, auth-gated).

| Product | Description |
|---|---|
| Real-Time Signal Validation | Validate live CAN/UART signals against DSL rules in real time |
| Simulation Validation | SIL behavioral validation against DSL specs |
| HIL Testing | Hardware-in-the-loop ECU testing with deterministic rule evaluation |
| Log Replay & Analysis | Replay CAN candump, CSV timelines, UART logs against rule sets |

---

## Sources

- **GitHub Repo:** `https://github.com/XianghuiZhao/veriaisystems-website` (ref: `main`)
- Files imported: `index.html`, `pages/`, `components/`, `sections/`, `styles/main.css`, `scripts/navigation.js`
- No Figma link provided
- No logo image file — logo is rendered in code (blue rounded square + Lucide shield-check)

---

## Content Fundamentals

### Voice & Tone
- **Precise, technical, dry.** No marketing fluff. Every sentence earns its place.
- **Declarative statements** over questions or invitations. E.g. "Deterministic. Local. Traceable." not "We help you test better!"
- **No emoji.** Never used anywhere.
- **No exclamation marks.** The tone is engineering-confident, not enthusiastic.
- **"The platform"** not "we" — product-forward, almost impersonal.
- Short, clipped sentences. Periods after fragments are common.

### Casing
- **Section labels / tags:** ALL CAPS, mono, letter-spaced. `DETERMINISTIC VALIDATION ACTIVE`
- **Headings:** Title case, tracking-tight. `VeriCore.One — Automotive Verification`
- **Body copy:** Sentence case, technical vocabulary.
- **Step numbers:** Zero-padded. `01`, `02`, `03`

### Examples
> "Deterministic. Local. Traceable. From natural language requirement to executable validation — without black-box processing."

> "Every rule evaluation produces the same result given the same input. No probabilistic behavior, no runtime variance. Suitable for safety-critical environments."

> "Processed locally · No cloud · No black-box inference"

### Language
- Multilingual: English (primary), German, Chinese (`EN / DE / 中文` toggle)
- `data-i18n` attributes on every text node

---

## Visual Foundations

### Color System
See `colors_and_type.css` for full CSS variable definitions.

| Role | Value | Tailwind |
|---|---|---|
| Dark background | `#0a0f1a` | — |
| Login background | `#0f172a` | slate-900 |
| Surface dark | transparent / `#1e293b` | slate-800 |
| Border dark | `#1e293b` | slate-800 |
| Border light | `#e2e8f0` | slate-200 |
| Text primary (dark) | `#e2e8f0` | slate-200 |
| Text secondary | `#94a3b8` | slate-400 |
| Text muted | `#64748b` | slate-500 |
| Text ghost | `#334155` | slate-700 |
| Blue primary | `#2563eb` | blue-600 |
| Blue hover | `#3b82f6` | blue-500 |
| Blue active | `#1d4ed8` | blue-700 |
| Blue faint bg | `rgba(59,130,246,0.1)` | blue-600/10 |
| Engineering accent | `#3b82f6` | blue-500 |
| Compliance accent | `#f59e0b` | amber-500 |
| Error | `#f87171` | red-400 |
| Success | `#22c55e` | green-500 |
| Warning | `#f59e0b` | amber-500 |
| PASS verdict | green-500 + green-500/20 bg | — |
| FAIL verdict | red-400 | — |
| UNKNOWN verdict | amber-500 | — |

### Typography
- **Sans:** Inter — weights 400/500/600/700/800. Used for headings only.
- **Mono:** JetBrains Mono — weights 400/500/700. Used for **almost everything else**: body copy, labels, captions, code, nav links, buttons.
- **Label style:** `text-[10px] font-mono uppercase tracking-[0.2em] text-blue-500`
- **Heading style:** `text-2xl–text-5xl font-extrabold tracking-tight`
- **Body style:** `text-xs font-mono text-slate-500 leading-relaxed`

### Spacing & Layout
- Max content width: `max-w-4xl` (56rem) for page content, `max-w-7xl` for nav
- Section padding: `py-20 px-6`
- Card padding: `p-6` or `p-8`
- Nav height: `h-14` (56px), fixed top, `scroll-margin-top: 64px`
- Grid: 1-col mobile → 2-col or 3-col desktop

### Backgrounds & Surfaces
- **No gradients.** Background is flat `#0a0f1a` or `#fff`.
- **Alternating sections** use `bg-slate-50/50` (light) or `dark:bg-transparent` (dark) for subtle rhythm.
- **No background images, no illustrations, no textures.**
- **No hand-drawn elements.** Purely code/data-driven visuals.
- The only decorative element is the **SVG signal line** (animated `stroke-dashoffset`).

### Cards
- Border: `border border-slate-200 dark:border-slate-800`
- Radius: `rounded-xl`
- Background: `bg-white dark:bg-transparent`
- Hover: `hover:border-blue-500/40 hover:bg-blue-500/5 dark:hover:bg-slate-900/40`
- No box-shadow used anywhere (border-only cards)

### Icon Containers
- Size: `w-8 h-8` or `w-9 h-9`
- Background: `bg-blue-600/10 rounded-lg`
- Icon: `text-blue-500 w-4 h-4`
- Hover state: bg → `bg-blue-600`, text → `text-white`

### Buttons
- Primary: `bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded px-5 py-2.5 text-sm font-medium`
- Ghost/outline: `border border-slate-300 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-300 text-sm font-medium rounded`
- Mono buttons (login): `font-mono font-bold text-sm tracking-widest uppercase`
- No pill/capsule buttons. Radius is `rounded` (4px) for buttons.

### Animations
- **Cursor blink:** `animation: blink 1s step-end infinite` (opacity 0/1)
- **Signal line draw:** `stroke-dashoffset` from 1000→0 over 2s ease-forward
- **Status pulse:** Tailwind `animate-pulse` on status dots
- **Loading spinner:** `animate-spin` on a `border-t-transparent` circle
- **Transitions:** `transition-colors duration-200` (150ms on hover states)
- No bounce, no spring, no scale press effects.

### Borders & Dividers
- Full-width section dividers: `border-b border-slate-200 dark:border-slate-800`
- Vertical dividers in grid: `divide-x divide-slate-200 dark:divide-slate-800`
- Left-accent (philosophy quote): `border-l-2 border-blue-500/30 pl-4`
- Domain marker: `w-1 h-5 bg-blue-500 rounded-full` vertical bar

### Hover/Press States
- Color transitions only (`transition-colors`)
- Border color → blue
- Icon bg → solid blue-600
- Text → blue-500 or white
- No scale, no shadow on hover

### Corner Radii
- Cards, panels: `rounded-xl` (12px)
- Buttons: `rounded` (4px)
- Icon containers: `rounded-lg` (8px)
- Logo mark: `rounded` (4px) or `rounded` — small square
- Status pills/tags: `rounded-full`

### Color Vibe / Imagery
- No photography, no illustration
- Signal timeline SVGs (monochrome lines, blue/red)
- Pure data-visual aesthetic
- Dark mode is the designed state; light mode is secondary

---

## Iconography

**System:** [Lucide Icons](https://unpkg.com/lucide@latest) — loaded from CDN via `<script src="https://unpkg.com/lucide@latest"></script>`, rendered as `<i data-lucide="...">` elements, initialized via `lucide.createIcons()`.

**Style:** Outlined stroke icons, `stroke-width: 2`, 16×16px (`w-4 h-4`), occasionally `w-3.5 h-3.5` in tight spaces.

**No custom SVG icons** are used — all iconography is Lucide. No emoji. No unicode icon chars.

**Icons used in the product:**
| Icon | Usage |
|---|---|
| `shield-check` | Logo mark, brand identity |
| `activity` | Real-Time Signal product |
| `layers` | Simulation / paradigm |
| `cpu` | HIL Testing / VeriCore Engine |
| `file-text` | Log Replay product |
| `terminal` | DSL interface |
| `zap` | VeriCore Engine |
| `database` | Multi-source Replay |
| `bar-chart-2` | Validation Optimization |
| `alert-circle` | Signal Quality Diagnostics |
| `hard-drive` | Local Execution |
| `repeat` | Reproducible Workflows |
| `arrow-right` | Flow indicators |
| `play` | Demo run button |
| `check-circle` | Pass verdict |
| `sun` / `moon` | Theme toggle |
| `lock` | Session lock |
| `menu` / `x` | Mobile hamburger |

**Assets location:** See `assets/` folder.

---

## File Index

```
README.md                     ← You are here
SKILL.md                      ← Agent skill definition
colors_and_type.css           ← CSS variables: colors, type, semantic tokens
assets/                       ← Brand assets (logo SVG, icon reference)
preview/                      ← Design system card HTML files
  colors-base.html
  colors-semantic.html
  type-scale.html
  type-specimens.html
  components-buttons.html
  components-cards.html
  components-badges.html
  components-nav.html
  spacing-tokens.html
  brand-logo.html
ui_kits/
  website/
    README.md
    index.html                ← Website UI kit (click-thru prototype)
    Navbar.jsx
    Footer.jsx
    Hero.jsx
    PlatformPage.jsx
    ProductsPage.jsx

Source repo (read-only reference):
  index.html                  ← Password gate
  pages/                      ← Platform, Products pages
  sections/                   ← Hero, product sections
  components/                 ← Navbar, footer HTML fragments
  scripts/navigation.js       ← i18n + auth + theme logic
  styles/main.css             ← Shared CSS (animations, domain vars)
```
