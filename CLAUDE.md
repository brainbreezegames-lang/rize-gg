# Rize.gg Design System — AI Generation Rules

## CRITICAL: You MUST follow these rules when building ANY UI in this project.

### Rule 1: NEVER create new components. ALWAYS import from the design system.

Before writing ANY JSX, check `src/registry/component-registry.json` for an existing component.

- If a component exists → import and use it with the correct props
- If NO component exists → compose existing components together
- ONLY create new raw HTML/Tailwind as a LAST RESORT for truly novel elements

**WRONG:**
```tsx
// ❌ Never do this — recreating a button from scratch
<button className="bg-[#99F9EA] text-black px-4 py-2 rounded-md">Join</button>
```

**RIGHT:**
```tsx
// ✅ Always do this — import the existing component
import { Button } from "@/components/buttons";
<Button>Join</Button>
```

### Rule 2: ALWAYS use design tokens. NEVER use raw hex colors.

| Token | Value | Use for |
|-------|-------|---------|
| `bg-bg-primary` | #0B1211 | Page background |
| `bg-bg-secondary` | #121415 | Secondary background |
| `bg-bg-card` | #121415 | Card backgrounds |
| `bg-bg-surface` | #1A1F2E | Surface/elevated areas |
| `bg-bg-surface-hover` | #222838 | Hover states |
| `bg-bg-input` | #121415 | Input fields |
| `bg-bg-elevated` | #20272A | Modal/drawer backgrounds |
| `text-text-primary` | #FFFFFF | Primary text |
| `text-text-secondary` | #A2B4B1 | Secondary/muted text |
| `text-text-tertiary` | #5A6577 | Disabled/hint text |
| `text-text-accent` | #99F9EA | Accent text (links, highlights) |
| `text-accent-foreground` | #0B1211 | Text on accent backgrounds |
| `bg-accent` | #99F9EA | Primary accent (buttons, badges) |
| `bg-accent-hover` | #7EECD8 | Accent hover |
| `bg-accent-muted` | rgba(153,249,234,0.12) | Subtle accent bg |
| `bg-accent-subtle` | rgba(153,249,234,0.04) | Very subtle accent bg |
| `border-border-default` | #273139 | Default borders |
| `border-border-subtle` | #1E2535 | Subtle borders |
| `border-border-accent` | #99F9EA | Accent borders |
| `bg-destructive` | #A83A3A | Destructive actions |
| `bg-status-success` | #16A249 | Success/registration open |
| `bg-status-error` | #FF5252 | Error/live |
| `bg-status-warning` | #FBBD23 | Warning/idle |

**WRONG:** `bg-[#99F9EA]`, `text-[#A2B4B1]`, `border-[#273139]`
**RIGHT:** `bg-accent`, `text-text-secondary`, `border-border-default`

### Rule 3: Typography is ALWAYS Oxanium

- Font family: `font-[family-name:var(--font-oxanium)]` (already set on body)
- Never add `font-sans`, `font-mono`, or any other font family
- Text sizes: `text-xs` (12px), `text-sm` (14px), `text-base` (16px), `text-lg` (18px), `text-xl` (20px), `text-2xl` (24px), `text-3xl` (32px)
- Headlines: semibold or bold
- Body: regular (400)
- UI text: medium (500) for buttons, labels

### Rule 4: Spacing and layout rules

- **Border radius**: Always use CSS variables: `rounded-[var(--radius-sm)]` (6px), `rounded-[var(--radius-md)]` (8px), `rounded-[var(--radius-lg)]` (12px), `rounded-[var(--radius-xl)]` (16px), `rounded-full` (pills)
- **Card padding**: `p-4` (16px)
- **Section gap**: `gap-6` (24px) between sections
- **Component gap**: `gap-4` (16px) between components in a section
- **Page padding**: `px-6` horizontal, `py-8` or `py-12` vertical
- **Max content width**: `max-w-6xl` for main content

### Rule 5: Page composition pattern

Every page follows this structure:
```tsx
import { Sidebar } from "@/components/navigation";
import { TopBar } from "@/components/navigation";
import { Breadcrumbs } from "@/components/navigation";

export default function PageName() {
  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumb={<Breadcrumbs items={[...]} />} />
        <main className="flex-1 overflow-y-auto px-6 py-8">
          {/* Page content using design system components */}
        </main>
      </div>
    </div>
  );
}
```

### Rule 6: Component reference guide

When building a screen, use these components (check registry for full props):

**Navigation:** `Sidebar`, `TopBar`, `Breadcrumbs`, `LandingNav`
**Buttons:** `Button` (6 variants), `SocialAuthButton`, `FilterChip`
**Cards:** `SessionCard`, `TournamentCard`, `ClubCard`, `MissionCard`, `FederationCard`, `PlayerCard`, `StatCard`, `ArticleCard`, `GameTabCard`
**Forms:** `TextInput`, `SearchInput`, `Select`, `Toggle`, `PasswordInput`, `ChatInput`
**Data:** `DataTable`, `LeaderboardRow`, `StatusPill`, `Badge`, `ProgressBar`, `CountdownTimer`
**Chat:** `ChatMessage`, `ChatListItem`
**Layout:** `PageHeader`, `SectionHeader`, `HeroBanner`, `SettingsSidebar`
**Overlays:** `Modal`, `FilterDrawer`
**Micro:** `Avatar`, `AvatarGroup`, `Divider`

### Rule 7: When receiving a Figma link

1. Use the Figma MCP to get the design context
2. Read `src/registry/component-registry.json` to find matching components
3. Check `figmaNodeIds` in the registry for direct matches
4. Compose the screen using ONLY registry components
5. Only add raw Tailwind for layout containers (flex, grid, spacing)

### Rule 8: Icons

- Always use `lucide-react` for icons
- Import specific icons: `import { Home, Users, Trophy } from "lucide-react"`
- Default icon sizes: 14px (inline), 16px (buttons), 18px (nav), 20px (sidebar), 24px (cards)

### Rule 9: Hover and interaction states

- Card hover: `hover:border-border-accent/30` or `hover:brightness-105`
- Button hover: defined per variant in Button component
- List item hover: `hover:bg-bg-surface-hover`
- Link hover: `hover:text-text-primary` or `hover:underline`
- Always include `transition-colors` or `transition-all`
- Always include `cursor-pointer` on interactive elements

### Rule 10: Figma Component ID → Code Mapping

| Figma Node ID | Component | Import Path |
|--------------|-----------|-------------|
| `2917:4230` | Sidebar (Expanded) | `@/components/navigation/Sidebar` |
| `6851:702888` | Sidebar (Collapsed) | `@/components/navigation/Sidebar` |
| `8536:208963` | Tournament Card | `@/components/cards/TournamentCard` |
| `8540:232516` | Tournament Header (Organizer) | compose with `PageHeader` + `TournamentCard` |
| `8839:302812` | Tournament Header (Player) | compose with `PageHeader` + `TournamentCard` |
| `9996:564279` | Event Card (Default) | `@/components/cards/SessionCard` |
| `9996:564289` | Event Card (Open) | `@/components/cards/SessionCard` |
| `9031:206928` | Tab Button Default | `@/components/cards/GameTabCard` |
| `9031:206936` | Tab Button Active | `@/components/cards/GameTabCard` with `active` |
| `3691:70141` | Settings Sidebar | `@/components/layout/SettingsSidebar` |
| `4716:98051` | Leaderboard Badge Card | `@/components/data/LeaderboardRow` |
| `6825:52526` | Tournament Status | `@/components/data/StatusPill` |

## Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Font**: Oxanium (Google Fonts, loaded via next/font)
- **Icons**: lucide-react
- **Utilities**: clsx + tailwind-merge via `cn()` from `@/lib/utils`
