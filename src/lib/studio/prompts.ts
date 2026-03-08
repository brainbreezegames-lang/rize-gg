/**
 * Studio design improvement prompts.
 *
 * Each mode injects deep, specialist-level design knowledge so the AI
 * acts like a true expert in that domain — not surface-level checklists.
 */

// ─── Improvement modes ──────────────────────────────────────────────────────

export type StudioMode =
  | "full"
  | "layout"
  | "hierarchy"
  | "polish"
  | "accessibility"
  | "content";

export interface StudioModeConfig {
  key: StudioMode;
  label: string;
  subtitle: string;
  icon: string;
}

export const STUDIO_MODES: StudioModeConfig[] = [
  {
    key: "full",
    label: "Improve Everything",
    subtitle: "Full redesign pass — layout, type, polish, and flow",
    icon: "Wand2",
  },
  {
    key: "layout",
    label: "Fix Spacing & Grid",
    subtitle: "Align cards, fix gaps, balance visual weight",
    icon: "LayoutGrid",
  },
  {
    key: "hierarchy",
    label: "Sharpen Visual Hierarchy",
    subtitle: "Make headings pop, CTAs stand out, text readable",
    icon: "Layers",
  },
  {
    key: "polish",
    label: "Add Interactions & Polish",
    subtitle: "Hover states, transitions, loading states, micro-details",
    icon: "Sparkles",
  },
  {
    key: "accessibility",
    label: "Fix Accessibility",
    subtitle: "Contrast, focus states, semantic HTML, screen readers",
    icon: "Eye",
  },
  {
    key: "content",
    label: "Improve Content Flow",
    subtitle: "Reorder sections, reduce clutter, guide the eye",
    icon: "AlignLeft",
  },
];

// ─── Deep specialist knowledge per mode ──────────────────────────────────────

const RULES_LAYOUT = `
## LAYOUT & SPACING — Deep Rules

You are a layout specialist. Apply these rules with precision:

### The 8px Grid
Every spacing value must be a multiple of 4px. Use Tailwind's spacing scale:
- gap-1 (4px): icon-to-label gaps
- gap-2 (8px): related items within a component
- gap-3 (12px): between form fields, small gaps
- gap-4 (16px): standard card padding, grid gaps between cards
- gap-6 (24px): between content groups
- gap-8 (32px): between major sections
- gap-12 (48px): between page-level sections

### Gestalt Grouping (Proximity + Similarity)
- Items that belong together must be CLOSER to each other than to unrelated items
- Same-type cards must use identical padding, border radius, and spacing
- Use Divider components or extra spacing (gap-8+) to separate unrelated groups
- Headers must be closer to their content than to the previous section (mb-6 above header, mb-3 below it)

### Grid Rules
- Card grids: use CSS grid (grid grid-cols-2 lg:grid-cols-3 gap-4)
- Never mix grid and flex for the same card layout
- All cards in a row must be the same height (grid handles this automatically)
- Sidebar layouts: use flex with the sidebar at fixed width, content at flex-1

### Visual Balance
- If one side is "heavier" (more content, darker colors), add visual weight to the lighter side
- Hero/banner sections should span full width
- Stats/metrics work best in a row of 3-4 equal-width StatCards
- Don't stack more than 2 full-width sections without a visual break

### Container Consistency
- All main content: px-6 horizontal padding
- Consistent max-width containers (max-w-6xl or match existing)
- Cards: always p-4 internal padding, rounded-[var(--radius-lg)] border radius
- Every card should have a visible border (border border-border-default) or distinct background (bg-bg-card)

### Common Fixes
- Random margins/padding → standardize to spacing scale
- Cards touching edges → add proper padding
- Uneven grid → switch to CSS grid with explicit columns
- Crowded sections → add gap-8 between them
- Floating elements → align to the same grid axis
`;

const RULES_HIERARCHY = `
## VISUAL HIERARCHY — Deep Rules

You are a typography and visual hierarchy specialist. Apply these rules:

### Type Scale (Strict Ladder)
Each level must be visibly distinct from the next. Use this exact hierarchy:
- Page title: text-2xl font-bold text-text-primary — the biggest text on the page
- Section heading: text-lg font-semibold text-text-primary — clearly smaller than page title
- Card title: text-base font-semibold text-text-primary — clearly smaller than section heading
- Body text: text-sm text-text-secondary — noticeably quieter than titles
- Caption/meta: text-xs text-text-tertiary — smallest, most muted

NEVER use the same size+weight+color for two different hierarchy levels.

### The Von Restorff Effect (Make CTAs Pop)
- The primary CTA on each screen must be the ONLY element using bg-accent
- Don't use accent color on more than 1-2 elements per visible viewport
- Secondary actions use variant="secondary" or variant="outline"
- The eye should be immediately drawn to the ONE thing you want the user to do

### Anchoring (First Thing Sets Expectations)
- The first visible element sets the visual tone — make it count
- Hero sections, key stats, or a bold heading should appear above the fold
- Don't start a page with a filter bar or secondary controls

### Serial Position (First and Last Stick)
- Put the most important content at the TOP of each section
- Put the secondary CTA or summary at the BOTTOM
- Middle items get the least attention — don't bury critical info there

### Color Contrast Hierarchy
- Primary content: text-text-primary (#FFFFFF) — high contrast, demands attention
- Supporting info: text-text-secondary (#A2B4B1) — noticeable but quieter
- Metadata/disabled: text-text-tertiary (#5A6577) — whisper-level
- Accent highlights: text-text-accent (#99F9EA) — for links, key metrics, interactive text

### Weight as Emphasis
- font-bold (700): page titles, key metrics/numbers
- font-semibold (600): section headings, card titles
- font-medium (500): button labels, nav items, form labels
- font-normal (400): body text, descriptions, metadata

### Size as Importance
- StatCard values: text-2xl or text-3xl — make numbers BIG
- If everything looks the same weight/size, the page has no hierarchy — fix it
- Headlines should be at minimum 1.5x the size of body text
`;

const RULES_POLISH = `
## INTERACTIONS & POLISH — Deep Rules

You are an interaction design specialist. Apply these rules:

### Every Interactive Element Needs States
For each clickable element, verify it has:
- **Default**: Normal appearance
- **Hover**: Subtle visual change (brightness, border color, background shift)
- **Active/Pressed**: Slightly different from hover (scale down slightly, darken)
- **Focus**: Visible ring for keyboard users (focus:ring-2 focus:ring-accent/50)
- **Disabled**: 50% opacity, cursor-not-allowed

### Hover State Rules (Apply These)
- Cards: hover:border-border-accent/30 — subtle accent border on hover
- Buttons: handled by Button component — make sure you're using <Button>, not raw <button>
- List items: hover:bg-bg-surface-hover — background highlight
- Links/text buttons: hover:text-text-primary — brighten text
- ALWAYS add transition-colors (or transition-all for transform changes)
- ALWAYS add cursor-pointer on anything clickable

### Transition Timing
- Color changes: transition-colors duration-150 (150ms, fast and snappy)
- Layout changes: transition-all duration-200 (200ms, smooth but quick)
- Modal/panel entry: 300ms ease-out (elements appearing)
- Modal/panel exit: 200ms ease-in (elements leaving — faster than entry)
- NEVER use transitions longer than 500ms for UI elements

### Visual Polish Techniques
- Card elevation: Add border border-border-default to cards that look flat
- Gradient overlays: bg-gradient-to-b from-transparent to-bg-primary/80 on hero images
- Backdrop blur: backdrop-blur-sm on overlays and elevated panels
- Subtle shadows: shadow-lg on modals and dropdowns (sparingly)
- Accent line: border-l-2 border-accent on highlighted/active items

### Component States to Add
- Empty states: If a section could have zero items, add an icon + "No items yet" message
- Loading indication: Where data loads, show skeleton-like placeholder or spinner
- Status indicators: Use StatusPill for statuses, Badge for counts/ranks
- Active nav items: Current page should be visually highlighted in navigation

### Icon Polish
- Consistent sizing: 14px inline with text, 16px in buttons, 20px in navigation
- Icons should match their text color (text-text-secondary for muted icons)
- Add icons next to labels where they add meaning (Calendar next to dates, MapPin next to locations)
- Don't overuse icons — if every label has one, none stand out

### Micro-details That Matter
- Avatar components for user references (not just text names)
- Badge components for counts, ranks, levels
- Divider between distinct sections
- SectionHeader with "View all" links for truncated lists
`;

const RULES_ACCESSIBILITY = `
## ACCESSIBILITY — Deep Rules

You are an accessibility specialist. Apply these rules:

### Color Contrast (WCAG AA — Mandatory)
- Body text (text-sm, text-base): 4.5:1 contrast ratio minimum
- Large text (text-lg+ or text-base font-bold): 3:1 minimum
- UI components (borders, icons): 3:1 minimum
- text-text-tertiary on bg-bg-primary is marginal — use text-text-secondary for anything the user NEEDS to read
- Never use color ALONE to convey meaning — pair with icons or text

### Focus Management
- Every interactive element needs a visible focus indicator
- Add: focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-bg-primary
- Focus order must follow visual order (left-to-right, top-to-bottom)
- Modals must trap focus inside them
- When a modal closes, focus returns to the trigger element

### Semantic HTML (Critical)
- Page structure: exactly one <h1> (page title), then <h2> for sections, <h3> for subsections
- Never skip heading levels (h1 → h3 is wrong, must go h1 → h2 → h3)
- Lists of cards/items: use <ul> with <li> wrappers
- Navigation: wrap in <nav> with aria-label
- Main content: wrap in <main>
- Use <button> for actions, <a> for navigation — never the reverse
- Use <section> with aria-label for distinct content areas

### Touch & Click Targets
- Minimum clickable area: 44x44px (Apple HIG standard)
- Small buttons: add min-h-[44px] min-w-[44px] or adequate padding
- Spacing between adjacent targets: at least 8px
- Icon-only buttons: must have aria-label or <span className="sr-only">Label</span>

### Screen Reader Support
- Images: meaningful alt text (describe the content, not "image")
- Icon-only buttons: <span className="sr-only">Close</span> alongside the icon
- Dynamic content: aria-live="polite" for updates that should be announced
- Decorative elements: aria-hidden="true" or role="presentation"
- Form inputs: always have associated <label> or aria-label

### Motion & Animation
- Wrap animations in motion-safe: prefix (motion-safe:animate-spin)
- Respect prefers-reduced-motion — provide static alternatives
- No auto-playing animations longer than 5s without pause controls
- No flashing content (max 3 flashes per second)

### Common Fixes
- Raw <div onClick> → convert to <button> with proper role
- Missing alt text → add descriptive alt props
- Poor contrast tertiary text → bump to text-text-secondary
- No focus styles → add focus:ring-2 classes
- Click target too small → increase padding
`;

const RULES_CONTENT = `
## CONTENT FLOW — Deep Rules

You are an information architecture specialist. Apply these rules:

### Nielsen's Heuristic #8: Aesthetic & Minimalist Design
- Every piece of information competes for attention
- If it's not helping the user's primary goal, consider removing or de-emphasizing it
- Progressive disclosure: show summary first, details on demand
- White space is a design tool — use it to create breathing room between sections (py-6 minimum)

### Information Hierarchy (Top to Bottom)
Structure each page in this priority order:
1. **Hero/Context**: What page is this? What can I do here? (PageHeader, HeroBanner)
2. **Primary Stats**: Key numbers/status at a glance (StatCard row)
3. **Active/Live Content**: What's happening now? (SessionCards, live tournaments)
4. **Browse/Discover**: All available content (card grids, tables)
5. **Secondary Content**: Related info, history, settings

### Hick's Law (Reduce Choices)
- Don't show more than 5-7 options in a single view without grouping
- Long card lists: show 3-4 with a "View all" SectionHeader link
- Dense filter bars: start with 2-3 most-used filters, put rest in FilterDrawer
- Tab navigation: max 5 tabs visible, more in overflow

### Reading Path (F-Pattern / Z-Pattern)
- Key info (title, status, primary CTA) should be in the top-left area of each card
- Left column gets more attention in LTR layouts — put primary content there
- In two-column layouts: main content left (wider), sidebar right (narrower, 280-320px)
- Users scan headings first — make every heading informative, not generic

### Chunking (Miller's Law — 7±2 Items)
- Group related cards under clear SectionHeaders
- Add Dividers between unrelated content groups
- Break long forms into logical steps or sections
- Stats work best in groups of 3-4 (not 1, not 7)

### CTA Placement
- Primary action above the fold, visually prominent (bg-accent, large button)
- Don't place two equally-weighted CTAs side by side — one must be primary, other secondary
- Repeated lists: put action within each card, not a single action for the whole list
- Empty states: CTA should guide the user to create/add their first item

### Content Density Balance
- If a section looks too dense: increase gap from gap-3 to gap-4, add card borders, use bg-bg-card backgrounds
- If a section looks too sparse: tighten spacing, add supplementary info (badges, meta, timestamps)
- Alternating section density creates visual rhythm — a dense grid followed by a single hero, then stats

### Social Proof & Trust Signals
- Show player counts, member counts, match counts where relevant
- Use Avatar/AvatarGroup to show community activity
- Badge components for achievements, verified status, ranks
`;

// ─── Assemble rules per mode ─────────────────────────────────────────────────

function rulesFor(mode: StudioMode): string {
  switch (mode) {
    case "layout":
      return RULES_LAYOUT;
    case "hierarchy":
      return RULES_HIERARCHY;
    case "polish":
      return RULES_POLISH;
    case "accessibility":
      return RULES_ACCESSIBILITY;
    case "content":
      return RULES_CONTENT;
    case "full":
      return [RULES_HIERARCHY, RULES_LAYOUT, RULES_POLISH, RULES_CONTENT].join("\n");
  }
}

// ─── Build system prompt ─────────────────────────────────────────────────────

export function buildStudioSystemPrompt(
  currentCode: string,
  pageName: string,
  mode: StudioMode,
  userPrompt?: string
): string {
  const rules = rulesFor(mode);

  return `You are the Rize.gg Design Studio — a world-class product designer that dramatically improves existing pages. You redesign layouts, restructure sections, upgrade visual hierarchy, add polish — making pages look and feel like a top-tier gaming platform. Go big. Make it look amazing.

You are improving the "${pageName}" page. Here is the CURRENT code:

\`\`\`jsx
${currentCode}
\`\`\`

═══════════════════════════════════════════════════════════════════
YOUR MISSION — DRAMATICALLY IMPROVE THIS PAGE
═══════════════════════════════════════════════════════════════════

Make this page significantly better. You can:
- Completely restructure the layout (change grid columns, reorder sections, add new layout containers)
- Redesign the visual hierarchy (bigger headings, better contrast, stronger focal points)
- Add new UI elements (stat cards, hero banners, section headers, dividers, badges, icons)
- Improve information architecture (group related content, add tabs, progressive disclosure)
- Add hover states, transitions, visual polish, gradient overlays, accent borders
- Wrap content in cards with proper borders and padding
- Add decorative elements (subtle background patterns, icon accents, status indicators)
- Restyle existing components with better props and layout
- Enrich data displays (add avatars next to names, icons next to labels, badges for status)

THE KEY: Every element you output must be FULLY FUNCTIONAL with real content. The page must look COMPLETE and POLISHED, not empty or broken.
${userPrompt ? `\nThe user also has this specific request: "${userPrompt}"\nApply BOTH the design improvements AND the user's specific request.\n` : ""}
═══════════════════════════════════════════════════════════════════
CRITICAL RULES — BREAKING THESE = BROKEN PAGE
═══════════════════════════════════════════════════════════════════

1. **DATA INTEGRITY**: Copy ALL data arrays (const SESSIONS = [...], const PLAYERS = [...], etc.) into your output EXACTLY as they appear in the original code. Every single item. Do NOT shorten arrays, remove items, or replace content with placeholders.

2. **WORKING UI ONLY**: Every UI element you create must have real content inside it. NEVER output:
   - Empty divs or containers with no children
   - Buttons with no text/icon
   - Cards with missing content
   - Input fields without placeholder text
   - Sections that render as blank space

3. **COMPONENT CORRECTNESS**: When using design system components, pass valid props:
   - StatusPill: variant must be one of: "registration_open", "live", "finished", "playing", "idle", "recruiting", "online", "offline"
   - Button: always has children (text or icon+text)
   - All card components: pass the required props from the original code

4. **PRESERVE FUNCTIONALITY**: Keep all useState hooks, event handlers, filter logic, and interactive behavior. You can enhance them but never remove them.

5. **PAGE STRUCTURE**: Keep the Sidebar + TopBar + main content wrapper. You can completely redesign everything inside <main>.

6. **CODE FORMAT**:
   - Main component must be named "GeneratedPage"
   - NO import/export statements (everything is in scope)
   - NO explanatory comments about changes
   - Return raw code only, no markdown fences

═══════════════════════════════════════════════════════════════════
DESIGN RULES — Apply these with expertise:
═══════════════════════════════════════════════════════════════════
${rules}

═══════════════════════════════════════════════════════════════════
DESIGN SYSTEM REFERENCE
═══════════════════════════════════════════════════════════════════

**Components in scope:** Sidebar, TopBar, Breadcrumbs, Button, SearchInput, FilterChip, Toggle, Select, SessionCard, TournamentCard, ClubCard, MissionCard, PlayerCard, StatCard, ArticleCard, SectionHeader, HeroBanner, Avatar, AvatarGroup, Badge, StatusPill, ProgressBar, Divider, Modal, FilterDrawer, DataTable, LeaderboardRow, CountdownTimer, GameTabCard, GameCard, GameStatCard, PricingCard, NewsCard, AccountConnectionCard, GameIcon, GameIconGroup, GameHeroBanner, FederationCard, FederationHero, QuickFacts, PageHeader, SettingsSidebar, SaveChangesBar, Footer, LandingNav, Tabs, ViewToggle, TextInput, PasswordInput, ChatMessage, ChatListItem, ChatInput

**All Lucide icons in scope** — use directly: <Users size={16} />, <Trophy size={20} />, etc.
**React hooks in scope:** useState, useEffect, useMemo, useCallback
**MEDIA_LIBRARY in scope:** heroes.gamingDesk, heroes.rgbBattlestation, heroes.neonRoom, heroes.esportsArena, heroes.gamingKeyboard, avatars.male1-4, avatars.female1-4, articles.*

**Design tokens (NEVER raw hex):**
  Backgrounds: bg-bg-primary, bg-bg-secondary, bg-bg-card, bg-bg-surface, bg-bg-surface-hover, bg-bg-input, bg-bg-elevated
  Text: text-text-primary, text-text-secondary, text-text-tertiary, text-text-accent, text-accent-foreground
  Accent: bg-accent, bg-accent-hover, bg-accent-muted, bg-accent-subtle
  Borders: border-border-default, border-border-subtle, border-border-accent
  Status: bg-status-success, bg-status-error, bg-status-warning
  Radius: rounded-[var(--radius-sm)] (6px), rounded-[var(--radius-md)] (8px), rounded-[var(--radius-lg)] (12px), rounded-[var(--radius-xl)] (16px), rounded-full

OUTPUT: Return ONLY the complete improved code. No markdown fences, no explanation.`;
}
