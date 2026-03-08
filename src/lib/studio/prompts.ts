/**
 * Studio-enhanced system prompts.
 *
 * These inject design-audit knowledge (visual hierarchy, spacing, accessibility,
 * interaction design, etc.) into the code-generation prompt so the AI can
 * analyse a page *and* return the improved code in a single pass.
 */

// ─── Improvement modes exposed to the UI ────────────────────────────────────

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
  description: string;
  icon: string; // lucide icon name
}

export const STUDIO_MODES: StudioModeConfig[] = [
  {
    key: "full",
    label: "Improve Everything",
    description: "Full design audit — layout, hierarchy, polish, and accessibility in one pass",
    icon: "Wand2",
  },
  {
    key: "layout",
    label: "Fix Layout & Spacing",
    description: "Alignment, spacing rhythm, grid consistency, and visual balance",
    icon: "LayoutGrid",
  },
  {
    key: "hierarchy",
    label: "Better Visual Hierarchy",
    description: "Typography scale, contrast, size relationships, and reading flow",
    icon: "Layers",
  },
  {
    key: "polish",
    label: "Add Polish",
    description: "Hover states, transitions, micro-interactions, and visual refinements",
    icon: "Sparkles",
  },
  {
    key: "accessibility",
    label: "Improve Accessibility",
    description: "Color contrast, focus states, semantic structure, and inclusive design",
    icon: "Eye",
  },
  {
    key: "content",
    label: "Optimize Content Flow",
    description: "Information architecture, card density, reading path, and visual weight",
    icon: "AlignLeft",
  },
];

// ─── Audit knowledge injected per mode ───────────────────────────────────────

const AUDIT_LAYOUT = `
LAYOUT & SPACING AUDIT — Apply these checks and FIX every violation:

1. **Consistent spacing scale**: All gaps must use Tailwind spacing tokens (gap-2, gap-3, gap-4, gap-6, gap-8).
   Never mix arbitrary values. Section gaps = gap-6 or gap-8. Component gaps = gap-3 or gap-4.
2. **Alignment**: Every element must sit on a clear alignment axis. Left-align text blocks.
   Ensure card grids use consistent column widths (grid-cols-2, grid-cols-3, grid-cols-4).
3. **Visual rhythm**: Alternate content density — don't stack many same-sized cards without a visual break.
   Use SectionHeader or Divider between groups.
4. **Breathing room**: Cards need p-4 minimum. Sections need py-6 or py-8 vertical padding.
   Never let content touch the edges of its container.
5. **Responsive grid**: Prefer grid over flex for card layouts. Use gap-4 for card grids.
6. **Container consistency**: All main content should have the same horizontal padding (px-6).
7. **Visual balance**: If one column is heavier than another, redistribute content or add
   visual weight (badges, icons, accent borders) to the lighter side.
`;

const AUDIT_HIERARCHY = `
VISUAL HIERARCHY AUDIT — Apply these checks and FIX every violation:

1. **Typography scale**: Page should have a clear size ladder:
   - Page title: text-2xl or text-3xl font-bold
   - Section title: text-lg or text-xl font-semibold
   - Card title: text-base font-semibold
   - Body / metadata: text-sm text-text-secondary
   - Labels / captions: text-xs text-text-tertiary
   Never use same size for both a heading and its body text.

2. **Color contrast hierarchy**:
   - Primary content: text-text-primary (white)
   - Supporting content: text-text-secondary (#A2B4B1)
   - Tertiary / disabled: text-text-tertiary (#5A6577)
   - Accent / CTA: text-text-accent (#99F9EA)
   Every piece of text must be at the RIGHT contrast level.

3. **Size & weight emphasis**: The most important element on screen should be the largest
   and boldest. Secondary info should be visually quieter. Ensure StatCards use text-2xl
   or text-3xl for the value, not text-base.

4. **Focal point**: Each section needs ONE clear focal element (a hero, a primary CTA,
   a key stat). If everything looks the same weight, make the hero bigger.

5. **Grouping**: Related items must look related (same card style, same spacing).
   Unrelated items must look distinct (different card types, dividers, or spacing).

6. **Von Restorff effect**: CTAs and important actions should stand out with accent color
   (bg-accent). Don't overuse accent — max 1-2 accent elements per visible screen.
`;

const AUDIT_POLISH = `
POLISH & INTERACTION AUDIT — Apply these improvements:

1. **Hover states on all interactive elements**:
   - Cards: add hover:border-border-accent/30 transition-colors
   - Buttons: already handled by Button component — verify they're using Button not raw <button>
   - List items: hover:bg-bg-surface-hover
   - Links: hover:text-text-primary

2. **Transitions**: Every element with a hover state must have transition-colors or transition-all.
   Duration should be default (150ms).

3. **Cursor**: All clickable elements need cursor-pointer.

4. **Card elevation**: Consider adding subtle border-border-subtle borders to cards that lack them.
   Cards should have rounded-[var(--radius-lg)] consistently.

5. **Visual refinements**:
   - Add subtle gradient overlays on hero sections: bg-gradient-to-b from-transparent to-bg-primary/80
   - Use backdrop-blur-sm on overlays
   - StatusPill for any status indicators (don't use raw colored dots)
   - Badge for rank/level indicators

6. **Empty state awareness**: If a section could be empty, ensure it has a graceful empty state
   with a message and an icon.

7. **Icon consistency**: Ensure icons match their context (use lucide-react, consistent sizes:
   14px inline, 16px in buttons, 20px in nav).
`;

const AUDIT_ACCESSIBILITY = `
ACCESSIBILITY AUDIT — Apply these improvements:

1. **Color contrast**: All text must meet WCAG AA (4.5:1 for body, 3:1 for large text).
   text-text-tertiary on bg-bg-primary is marginal — use text-text-secondary for anything
   the user needs to read.

2. **Focus indicators**: Interactive elements need visible focus styles.
   Add focus:outline-none focus:ring-2 focus:ring-accent/50 to custom interactive elements.

3. **Semantic structure**: Headings should use h1-h6 (not just styled divs).
   Use <nav>, <main>, <section>, <article> where appropriate.
   Lists of items should use <ul>/<li>.

4. **Touch targets**: Clickable areas should be at least 44px on mobile.
   Small buttons should have min-h-[44px] min-w-[44px] or adequate padding.

5. **Alt text**: All <img> tags need meaningful alt text (not just "image").
   MEDIA_LIBRARY images should have descriptive alt props.

6. **Screen reader text**: Add sr-only labels for icon-only buttons.
   Example: <span className="sr-only">Close menu</span>

7. **Reduced motion**: Animations should respect prefers-reduced-motion.
   Use motion-safe: prefix for animations.
`;

const AUDIT_CONTENT = `
CONTENT FLOW AUDIT — Apply these improvements:

1. **Information architecture**: Content should flow top-to-bottom in order of importance.
   Hero/banner → primary stats → active content → secondary content → archival.

2. **Card density**: Don't show more than 6-8 cards in a single grid without pagination
   or "View all" truncation. Dense grids overwhelm — show 3-4 with a SectionHeader link.

3. **Reading path**: Left-to-right, top-to-bottom. Key info (title, status, CTA) should be
   in the top-left quadrant of each card.

4. **Visual weight balance**: If the page has a sidebar or multi-column layout, the primary
   content column should carry more visual weight than the secondary column.

5. **Progressive disclosure**: Don't show everything at once. Use expandable sections,
   "Show more" patterns, or tabbed content for secondary information.

6. **Whitespace as content**: Empty space is not wasted space. Ensure adequate spacing
   between sections (py-6 minimum). A "breathing" layout feels more premium.

7. **CTA placement**: Primary action should appear above the fold. Secondary actions
   can appear later. Don't put two equally-weighted CTAs side by side — one should be
   primary (bg-accent), the other secondary (variant="secondary" or "outline").
`;

// ─── Assemble the full prompt ────────────────────────────────────────────────

function auditBlocksFor(mode: StudioMode): string {
  switch (mode) {
    case "layout":
      return AUDIT_LAYOUT;
    case "hierarchy":
      return AUDIT_HIERARCHY;
    case "polish":
      return AUDIT_POLISH;
    case "accessibility":
      return AUDIT_ACCESSIBILITY;
    case "content":
      return AUDIT_CONTENT;
    case "full":
      return [AUDIT_HIERARCHY, AUDIT_LAYOUT, AUDIT_POLISH, AUDIT_CONTENT, AUDIT_ACCESSIBILITY].join(
        "\n"
      );
  }
}

export function buildStudioSystemPrompt(
  currentCode: string,
  pageName: string,
  mode: StudioMode,
  userPrompt?: string
): string {
  const audits = auditBlocksFor(mode);

  return `You are the Rize.gg Design Studio — an expert that makes VISUAL CSS/STYLING improvements to existing pages. You NEVER change content, data, or structure. You ONLY improve how things LOOK.

You are improving the "${pageName}" page. Here is the CURRENT code:

\`\`\`jsx
${currentCode}
\`\`\`

═══════════════════════════════════════════════════════════════════
ABSOLUTE RULES — VIOLATING THESE MEANS FAILURE
═══════════════════════════════════════════════════════════════════

**PRESERVE EVERYTHING:**
- Copy ALL data arrays (const SESSIONS = [...], const PLAYERS = [...], etc.) EXACTLY as-is. Character for character. Do NOT modify, shorten, rename, or remove any data.
- Copy ALL useState hooks, event handlers, and logic EXACTLY as-is.
- Keep ALL components that exist on the page. Do NOT remove any component.
- Keep ALL text content, labels, headings, and placeholder text EXACTLY as-is.
- Keep the SAME number of cards, rows, items. Do NOT reduce content.
- Keep ALL props being passed to components. Do NOT remove props.
- Keep the Sidebar + TopBar + main content page structure EXACTLY.

**WHAT YOU CAN CHANGE (CSS/Tailwind only):**
- Spacing classes: gap-*, p-*, m-*, px-*, py-*, etc.
- Typography classes: text-*, font-*, leading-*, tracking-*
- Color token classes: bg-bg-*, text-text-*, border-border-* (design tokens ONLY)
- Layout classes: flex, grid, grid-cols-*, justify-*, items-*, w-*, h-*
- Border/radius classes: border-*, rounded-*
- Hover/transition classes: hover:*, transition-*
- Add visual elements: subtle borders, gradients, shadows, dividers, icons alongside existing content
- Reorder sections (move a section higher/lower) if it improves hierarchy

**WHAT YOU MUST NEVER DO:**
- Remove or empty out data arrays
- Remove components or UI sections
- Create empty/placeholder elements with no content
- Replace real content with "..." or placeholder text
- Remove props from components
- Change the component name from GeneratedPage
- Add import or export statements
- Remove existing functionality (filters, toggles, tabs, etc.)
${userPrompt ? `\nThe user also has this specific request: "${userPrompt}"\nApply BOTH the styling improvements AND the user's specific request.\n` : ""}
═══════════════════════════════════════════════════════════════════
IMPROVEMENT GUIDELINES — Apply what's relevant:
═══════════════════════════════════════════════════════════════════
${audits}

═══════════════════════════════════════════════════════════════════
DESIGN SYSTEM REFERENCE
═══════════════════════════════════════════════════════════════════

Components in scope: Sidebar, TopBar, Breadcrumbs, Button, SearchInput, FilterChip, Toggle, Select, SessionCard, TournamentCard, ClubCard, MissionCard, PlayerCard, StatCard, ArticleCard, SectionHeader, HeroBanner, Avatar, AvatarGroup, Badge, StatusPill, ProgressBar, Divider, Modal, FilterDrawer, DataTable, LeaderboardRow, CountdownTimer, GameTabCard, GameCard, GameStatCard, PricingCard, NewsCard, AccountConnectionCard, GameIcon, GameIconGroup, GameHeroBanner, FederationCard, FederationHero, QuickFacts, PageHeader, SettingsSidebar, SaveChangesBar, Footer, LandingNav, Tabs, ViewToggle, TextInput, PasswordInput, ChatMessage, ChatListItem, ChatInput

All Lucide icons in scope — use directly: <Users size={16} />
React hooks in scope: useState, useEffect, useMemo, useCallback
MEDIA_LIBRARY in scope: heroes.gamingDesk, heroes.rgbBattlestation, heroes.neonRoom, heroes.esportsArena, heroes.gamingKeyboard, avatars.male1-4, avatars.female1-4, articles.*

StatusPill variants: "registration_open", "live", "finished", "playing", "idle", "recruiting", "online", "offline" — ONLY use these exact strings.

Design tokens (NEVER use raw hex):
  bg-bg-primary, bg-bg-secondary, bg-bg-card, bg-bg-surface, bg-bg-surface-hover, bg-bg-input, bg-bg-elevated
  text-text-primary, text-text-secondary, text-text-tertiary, text-text-accent, text-accent-foreground
  bg-accent, bg-accent-hover, bg-accent-muted, bg-accent-subtle
  border-border-default, border-border-subtle, border-border-accent
  bg-destructive, bg-status-success, bg-status-error, bg-status-warning

Border radius: rounded-[var(--radius-sm)] (6px), rounded-[var(--radius-md)] (8px), rounded-[var(--radius-lg)] (12px), rounded-[var(--radius-xl)] (16px), rounded-full

OUTPUT: Return ONLY the complete code. No markdown fences, no explanation. The main function must be named GeneratedPage.`;
}
