# Rize.gg Master Design Prompt

> Use this prompt when generating UI designs, screens, or components for Rize.gg. Paste it into any AI design tool (Figma AI, Pencil, v0, etc.) to ensure outputs match the design system exactly.

---

## Brand Identity

Rize.gg is a **competitive gaming and esports platform** serving the MENA region. The visual identity is **dark, premium, and performance-focused** — like a high-end gaming monitor UI crossed with a professional sports analytics dashboard. Think Discord's density meets a luxury watch brand's precision.

The platform is NOT playful, cartoony, or neon-heavy. It is **calm, confident, and data-rich** — a space where serious competitors track stats, find teams, and enter tournaments.

---

## Color System

### Foundation: Dark Mode Only

The entire platform is dark-mode-only. There is no light theme. The background palette uses deep, cool-toned darks that feel like looking into a premium display.

| Role | Hex | Description |
|------|-----|-------------|
| **Page Background** | `#0B1211` | Near-black with a subtle green-teal undertone. This is the canvas. |
| **Card / Input Background** | `#121415` | Slightly lighter than page bg. Used for all cards, inputs, and secondary surfaces. |
| **Surface / Elevated** | `#1A1F2E` | Blue-gray surface for hover states, active elements, and elevated areas. |
| **Surface Hover** | `#222838` | Lighter blue-gray for interactive hover states on surfaces. |
| **Elevated Panels** | `#20272A` | Modals, drawers, and floating panels. Slightly warmer than surface. |

### Accent: Mint Teal

The signature accent color is a **cool mint/teal** — not neon green, not cyan. It sits between green and blue, giving the platform a distinctive, premium feel that separates it from the typical red/orange gaming aesthetic.

| Role | Value | Usage |
|------|-------|-------|
| **Accent** | `#99F9EA` | Primary buttons, active states, links, highlights, badges |
| **Accent Hover** | `#7EECD8` | Hover state for accent elements — slightly darker/warmer |
| **Accent Muted** | `rgba(153, 249, 234, 0.12)` | Subtle accent backgrounds, inactive tab highlights |
| **Accent Subtle** | `rgba(153, 249, 234, 0.04)` | Very faint accent wash, countdown timer segments, background tints |
| **Accent Foreground** | `#0B1211` | Dark text placed ON accent backgrounds (buttons, badges) |

### Text Hierarchy

| Role | Hex | Usage |
|------|-----|-------|
| **Primary** | `#FFFFFF` | Headlines, card titles, player names, primary content |
| **Secondary** | `#A2B4B1` | Descriptions, meta text, labels, secondary information |
| **Tertiary** | `#5A6577` | Disabled text, placeholders, hints, timestamps |
| **Accent** | `#99F9EA` | Links, active navigation items, highlighted values |

### Borders

| Role | Hex | Usage |
|------|-----|-------|
| **Default** | `#273139` | Card borders, dividers, input borders, table lines |
| **Subtle** | `#1E2535` | Very light separation lines, low-emphasis dividers |
| **Accent** | `#99F9EA` | Active card borders, focused inputs, selected states |

### Status Colors

| Status | Hex | Usage |
|--------|-----|-------|
| **Success / Online** | `#16A249` | Registration open, recruiting, playing, online indicators |
| **Error / Live** | `#FF5252` | Live tournaments, errors, destructive warnings |
| **Warning** | `#FBBD23` | Idle status, expiring timers, caution states |
| **Info** | `#4DA6FF` | Informational badges, neutral status |
| **Online Dot** | `#44DD77` | Avatar online indicator (brighter green than success) |
| **Offline Dot** | `#5A6577` | Avatar offline indicator (matches tertiary text) |

### Rank Colors (Badges & Leaderboard)

| Rank | Hex | Usage |
|------|-----|-------|
| **Gold** | `#FFD700` | 1st place, gold badges, premium tiers |
| **Silver** | `#C0C0C0` | 2nd place, silver badges |
| **Bronze** | `#CD7F32` | 3rd place, bronze badges |
| **Diamond** | `#B9F2FF` | Top tier, diamond badges, elite status |

### Destructive

| Role | Hex | Usage |
|------|-----|-------|
| **Destructive** | `#A83A3A` | Delete buttons, leave actions, danger zones |
| **Destructive Hover** | `#923232` | Hover state for destructive buttons |
| **Destructive Foreground** | `#F8FAFC` | White text on destructive backgrounds |

### Platform

| Platform | Hex |
|----------|-----|
| **Discord** | `#5865F2` |

---

## Typography

### Font: Oxanium

The entire platform uses **Oxanium** — a geometric, slightly squared sans-serif from Google Fonts. It has a technical, gaming-appropriate feel without being overly stylized. No other fonts are used anywhere.

Oxanium gives the platform a cohesive, engineered aesthetic. Its slightly angular letterforms echo the precision of esports while remaining highly legible at all sizes.

### Type Scale

| Size | Pixels | Weight | Usage |
|------|--------|--------|-------|
| `xs` | 12px | 400 Regular | Timestamps, tiny labels, badge text, secondary meta |
| `sm` | 14px | 400-500 | Form labels, input text, card meta, button text (sm/md) |
| `base` | 16px | 400-500 | Body text, descriptions, button text (lg), navigation |
| `lg` | 18px | 600 Semibold | Card titles, section headers, chat headers |
| `xl` | 20px | 600 Semibold | Component titles (GameTabCard), sub-page headers |
| `2xl` | 24px | 600-700 | Page headers, modal titles, player profile names |
| `3xl` | 32px | 700 Bold | Large stat values (StatCard), hero titles, big numbers |

### Weight Rules

- **400 Regular**: Body text, descriptions, any text that isn't a heading or label
- **500 Medium**: Button text, form labels, interactive text, navigation items
- **600 Semibold**: Card titles, section headers, sidebar labels, most headings
- **700 Bold**: Page-level headlines, stat numbers, hero banner titles, major emphasis

### Letter Spacing

- Default: Normal (0)
- Large headings (24px+): Slight negative tracking (`-0.1px` to `-0.14px`) for tighter, more premium feel
- Never add positive letter-spacing or wide tracking

### Text Overflow

- Long text in cards: `line-clamp-2` (two-line truncation with ellipsis)
- Single-line overflow: `truncate` (one-line with ellipsis)
- Player names: Always single-line truncated

---

## Spacing & Layout

### Spacing Scale

The platform uses a **4px base grid** with Tailwind's default spacing scale:

| Token | Value | Usage |
|-------|-------|-------|
| `1` | 4px | Icon-to-text micro gaps |
| `1.5` | 6px | Small internal gaps, button icon-text gap (sm) |
| `2` | 8px | Icon gaps, small padding, tight lists |
| `3` | 12px | Medium internal spacing, button icon-text gap (md) |
| `4` | 16px | **Standard card padding**, component gap, internal sections |
| `5` | 20px | Sidebar item horizontal padding |
| `6` | 24px | **Section gap**, page horizontal padding |
| `8` | 32px | Page vertical padding, large spacing |
| `12` | 48px | Hero vertical padding, major section breaks |

### Layout Constants

| Element | Value |
|---------|-------|
| Sidebar expanded width | 240px |
| Sidebar collapsed width | 60px |
| Page horizontal padding | 24px (px-6) |
| Page vertical padding | 32px (py-8) |
| Max content width | max-w-6xl |
| Card internal padding | 16px (p-4) |
| Gap between sections | 24px (gap-6) |
| Gap between cards in grid | 16px (gap-4) |

### Grid Patterns

| Pattern | CSS | Usage |
|---------|-----|-------|
| Card grid | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4` | Tournament cards, session cards, article cards |
| Stat row | `grid grid-cols-2 md:grid-cols-4 gap-4` | StatCard rows, KPI displays |
| Player grid | `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4` | PlayerCard grids |
| Two-column detail | `grid grid-cols-1 lg:grid-cols-3 gap-6` | Tournament detail (2/3 + 1/3 split) |
| Toolbar | `flex items-center gap-3 flex-wrap` | Search + filters + view toggle |
| Leaderboard | `flex flex-col gap-1` | Stacked LeaderboardRow items |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 6px | Small buttons (sm/md), input icon containers, small interactive elements |
| `md` | 8px | **Standard for most components** — cards, inputs, tabs, large buttons |
| `lg` | 12px | Hero banners, modals, large containers, decorative panels |
| `xl` | 16px | Extra large decorative elements |
| `full` | 9999px | Avatars, badges, status pills, toggles, pill-shaped elements |

### Rule of Thumb

- If it's a **card or input**: 8px (`md`)
- If it's a **badge, pill, or avatar**: fully round (`full`)
- If it's a **button**: 6px (`sm`) for sm/md size, 8px (`md`) for lg size
- If it's a **modal or hero**: 12px (`lg`)

---

## Component Anatomy

### Cards

Every card follows this structure:

```
┌─ Card Container ─────────────────────────────────────┐
│  bg: #121415 (bg-card)                               │
│  border: 1px solid #273139 (border-default)          │
│  radius: 8px (radius-md)                             │
│  padding: 16px                                       │
│                                                      │
│  ┌─ Header ────────────────────────────────────────┐ │
│  │  Title (18px semibold, text-primary)             │ │
│  │  Subtitle (14px regular, text-secondary)        │ │
│  └─────────────────────────────────────────────────┘ │
│                                                      │
│  ── Divider (1px, border-default) ──                 │
│                                                      │
│  ┌─ Content ───────────────────────────────────────┐ │
│  │  Data rows, stats, descriptions                 │ │
│  │  (14px regular, text-secondary)                 │ │
│  └─────────────────────────────────────────────────┘ │
│                                                      │
│  ┌─ Footer / Actions ─────────────────────────────┐ │
│  │  Buttons, links, CTAs                           │ │
│  └─────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

**Hover state**: `border-color → rgba(153, 249, 234, 0.3)` (accent at 30% opacity) with `transition-colors`

### Buttons

Six variants, all with `font-medium`, `cursor-pointer`, `transition-all duration-150`:

| Variant | Background | Text | Border | Hover |
|---------|-----------|------|--------|-------|
| **Primary** | `#99F9EA` | `#0B1211` | none | `#7EECD8` |
| **Secondary** | `#1A1F2E` | `#FFFFFF` | `#273139` | `#222838` |
| **Outline** | transparent | `#FFFFFF` | `#273139` | `#222838` bg |
| **Ghost** | transparent | `#A2B4B1` | none | `#222838` bg, white text |
| **Destructive** | `#A83A3A` | `#F8FAFC` | none | `#923232` |
| **Discord** | `#5865F2` | white | none | brightness +10% |

Three sizes:

| Size | Height | Horizontal Padding | Radius | Font |
|------|--------|--------------------|--------|------|
| `sm` | 32px | 12px | 6px | 14px |
| `md` | 40px | 16px | 6px | 14px |
| `lg` | 48px | 24px | 8px | 16px |

### Status Pills

Pill-shaped (`border-radius: full`) indicators with dot + label:

| Variant | Dot Color | Text Color | Background |
|---------|-----------|------------|------------|
| Online | `#44DD77` | `#A2B4B1` | transparent |
| Offline | `#5A6577` | `#5A6577` | transparent |
| Live | `#FF5252` | `#FF5252` | `rgba(255,82,82,0.1)` |
| Registration Open | `#16A249` | `#16A249` | `rgba(22,162,73,0.1)` |

### Badges

Pill-shaped with border + tinted background:

| Variant | Border | Text | Background |
|---------|--------|------|------------|
| Default | `#273139` | `#A2B4B1` | transparent |
| Accent | `#99F9EA` | `#99F9EA` | `rgba(153,249,234,0.1)` |
| Gold | `#FFD700` | `#FFD700` | `rgba(255,215,0,0.1)` |
| Silver | `#C0C0C0` | `#C0C0C0` | `rgba(192,192,192,0.1)` |
| Bronze | `#CD7F32` | `#CD7F32` | `rgba(205,127,50,0.1)` |
| Diamond | `#B9F2FF` | `#B9F2FF` | `rgba(185,242,255,0.1)` |

### Avatars

- Shape: Perfect circle (`border-radius: full`)
- Sizes: `sm` (32px), `md` (40px), `lg` (48px), `xl` (56px), `2xl` (64px)
- Default: Gray placeholder with User icon
- Online indicator: 12px green dot at bottom-right with 2px white ring
- Grouped avatars: Overlap with `-space-x-2`, each with `ring-2 ring-bg-primary`

---

## Gradients & Effects

### Image Overlays

Cards and banners that show background images use a gradient overlay to ensure text readability:

```
Top-down overlay (HeroBanner):
  0%:   rgba(11, 18, 17, 0.9)   — nearly opaque at top
  40%:  rgba(11, 18, 17, 0.4)   — semi-transparent
  100%: transparent               — fully transparent at bottom
```

```
Diagonal overlay (GameTabCard):
  0%:   rgba(18, 20, 21, 0.7)   — top-left corner
  52%:  rgba(18, 20, 21, 1.0)   — solid past middle
```

### Accent Glow Effects

The ClubCard uses a subtle accent gradient on its background:

```
Direction: top to bottom
From: rgba(153, 249, 234, 0.02)  — nearly invisible
To:   rgba(153, 249, 234, 0.08)  — very subtle teal wash
Border: solid accent (#99F9EA)
```

This creates a premium "glow from within" effect without being garish.

### Backdrop Blur

Modal overlays use:
```
Background: rgba(0, 0, 0, 0.6)
Backdrop filter: blur(4px)
```

Countdown timer segments use:
```
Backdrop filter: blur(5px)
Background: accent-subtle (rgba(153, 249, 234, 0.04))
```

### Shadows

The platform uses shadows sparingly — dark themes already have depth through color:

- **Cards**: No shadow (borders provide edge definition)
- **Modals/Drawers**: `shadow-2xl` (large, soft shadow for floating UI)
- **General rule**: If it floats above the page, it gets a shadow. If it sits in the flow, it gets a border.

---

## Interaction States

### Hover Patterns

| Element | Hover Effect |
|---------|-------------|
| Cards | `border-color: rgba(153, 249, 234, 0.3)` — accent border fades in |
| Buttons (primary) | Background shifts to `#7EECD8` |
| Buttons (outline/ghost) | Background fills to `#222838` |
| List items | Background fills to `#222838` |
| Links | Color shifts to `#FFFFFF` (primary) or underline appears |
| Sidebar items | Background fills to surface-hover |

### Focus States

- Inputs: `border-color: #99F9EA` (accent border replaces default)
- Buttons: Browser default focus ring (don't override)
- Interactive cards: Same as hover (accent border)

### Active/Selected States

- Sidebar active item: `bg-accent-muted`, `text-accent`, accent left border indicator
- Active tab: `bg-bg-surface`, `text-text-primary` (vs inactive `text-text-tertiary`)
- Active filter chip: `bg-accent`, `text-accent-foreground` (dark text on mint bg)

### Disabled States

- Opacity: 50%
- Cursor: `not-allowed` (via `pointer-events-none`)
- No hover effects

### Transitions

- **All interactive elements**: Include a transition
- **Default duration**: 150ms
- **Standard**: `transition-colors` for color-only changes
- **Complex**: `transition-all duration-150` for multi-property changes
- **Progress bars**: `transition-all duration-500` (slow fill animation)
- **Easing**: Default ease (Tailwind default)

---

## Page Structure

Every page follows this exact shell:

```
┌─ Full Viewport ──────────────────────────────────────────────┐
│ flex, h-screen, bg: #0B1211                                  │
│                                                              │
│  ┌─ Sidebar ─┐  ┌─ Main Column ──────────────────────────┐  │
│  │ 240px     │  │ flex-1, flex-col, overflow-hidden       │  │
│  │           │  │                                         │  │
│  │ Logo      │  │  ┌─ TopBar ──────────────────────────┐ │  │
│  │ Nav Items │  │  │ Breadcrumbs, search, actions       │ │  │
│  │ Games     │  │  └───────────────────────────────────┘ │  │
│  │ Clubs     │  │                                         │  │
│  │           │  │  ┌─ Main Content ─────────────────────┐ │  │
│  │           │  │  │ overflow-y-auto, px-6 py-8          │ │  │
│  │           │  │  │ flex-col gap-6                      │ │  │
│  │           │  │  │                                     │ │  │
│  │           │  │  │ PageHeader / HeroBanner             │ │  │
│  │           │  │  │ StatCard row                        │ │  │
│  │           │  │  │ Filters / Tabs                      │ │  │
│  │           │  │  │ Content grids                       │ │  │
│  │           │  │  │ SectionHeader + content             │ │  │
│  │           │  │  │ ...repeating sections               │ │  │
│  │           │  │  │                                     │ │  │
│  │           │  │  └─────────────────────────────────────┘ │  │
│  │ Settings  │  │                                         │  │
│  │ User      │  └─────────────────────────────────────────┘  │
│  └───────────┘                                               │
└──────────────────────────────────────────────────────────────┘
```

### Section Composition Pattern

Every page's main content follows a repeating pattern:

```
1. Hero or PageHeader (always first)
2. Stat cards row (optional, for data-heavy pages)
3. Toolbar: SearchInput + FilterChips + ViewToggle
4. Tabs (if page has multiple views)
5. Content grid (cards, tables, lists)
6. SectionHeader → content grid (repeat for each section)
7. Divider between unrelated sections
```

---

## Visual Principles

### 1. Density Over Emptiness
Gaming platforms are information-rich. Fill screens with useful data — stat cards, player counts, tournament slots, countdown timers. Empty space should be **intentional breathing room**, not laziness.

### 2. Hierarchy Through Weight, Not Size
Don't make headlines enormous. Use **font weight** (semibold vs regular) and **text color** (primary vs secondary) to create hierarchy. A 14px semibold white label is more prominent than a 16px regular gray one.

### 3. Borders Define, Shadows Float
Cards and containers are defined by **1px borders** in `#273139`. Shadows are reserved for **floating elements** (modals, drawers). This keeps the interface flat and clean while maintaining clear boundaries.

### 4. Accent is Surgical
The mint accent (`#99F9EA`) is used **precisely** — primary buttons, active states, links, and key highlights. It should never be splashed across large areas. When it appears, it draws the eye intentionally.

### 5. Status Colors Are Semantic
Green = open/success. Red = live/error. Yellow = warning/idle. Blue = info. Never use these colors decoratively — they always carry meaning.

### 6. Component Consistency
Every card type shares the same skeleton (bg-card, border-default, radius-md, p-4). The content inside differentiates them. This creates visual rhythm — users learn the card pattern once and can scan any page.

### 7. Responsive Without Breakpoints Drama
Grids collapse cleanly: 3 columns → 2 → 1. The sidebar stays fixed. No layout shifts, no hidden navigation on desktop. Mobile is a separate concern — the design system is desktop-first.

---

## Anti-Patterns (What NOT to Do)

- **No neon colors**: The accent is mint, not neon green. No `#00FF00`, no glowing borders.
- **No gradients as backgrounds**: Gradients are only for image overlays and the subtle ClubCard effect.
- **No rounded-xl on cards**: Cards are always `radius-md` (8px). Only modals and heroes get `radius-lg`.
- **No white backgrounds**: Nothing in the UI has a white or light gray background. Ever.
- **No sans-serif fallback visible**: If Oxanium doesn't load, the fallback should be system UI, not Arial.
- **No drop shadows on cards**: Cards use borders, not shadows.
- **No colored text on colored backgrounds**: Text on accent backgrounds is always dark (`#0B1211`). Text on dark backgrounds is always light.
- **No excessive animation**: Transitions are 150ms and subtle. No bouncing, no sliding in from off-screen, no attention-grabbing motion.
- **No rounded corners larger than 16px**: The largest radius in the system is `radius-xl` (16px). No `rounded-3xl` or `rounded-[24px]`.
- **No raw HTML elements**: Every UI element maps to a design system component. No `<button>`, `<input>`, `<table>` — use Button, TextInput, DataTable.
