export interface DesignSkill {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  defaultOn: boolean;
  promptSnippet: string;
}

export const DESIGN_SKILLS: DesignSkill[] = [
  {
    id: "gestalt",
    name: "Gestalt Layout",
    description: "Visual perception principles for clear groupings and hierarchy",
    icon: "LayoutGrid",
    defaultOn: false,
    promptSnippet: `## SKILL: Gestalt Visual Perception
Apply these principles to your layout:
- PROXIMITY: Related items CLOSE together (gap-2 to gap-4), separate sections with gap-6 or Divider. Spacing between groups must be 2-3x spacing within groups.
- SIMILARITY: Same-function elements must look identical (all cards same component, all actions same Button variant). Different functions look different.
- FIGURE-GROUND: Clear contrast between foreground content and background. Cards on bg-card against bg-primary. Modals on elevated bg with backdrop blur.
- HIERARCHY: One focal point per section. PageHeader/HeroBanner is the primary focal point. StatCards are secondary. Content grids are tertiary.
- CONTINUITY: Layout flows top-to-bottom naturally. Hero → Stats → Tabs → Content. Eye follows the vertical flow.
- COMMON REGION: Group related items inside a container div with bg-bg-card/bg-bg-surface and rounded-[var(--radius-lg)]. Example: wrap filter bar + grid in one container.`,
  },
  {
    id: "accessibility",
    name: "Accessibility",
    description: "WCAG 2.2 AA compliance for inclusive design",
    icon: "Eye",
    defaultOn: false,
    promptSnippet: `## SKILL: Accessibility (WCAG 2.2 AA)
Ensure your output meets these standards:
- Every icon-only Button must have an aria-label: <Button size="icon" aria-label="Open settings"><Settings size={16} /></Button>
- Images must have alt text. Use meaningful descriptions, not "image" or "photo".
- Form inputs must have labels (TextInput/SearchInput/Select all accept a label prop — USE IT).
- Color is never the ONLY indicator. Pair color with text/icons: StatusPill already does this, Badge has label prop.
- Interactive elements must be obvious: use Button component (not clickable divs). Button has built-in focus/hover states.
- Headings in logical order: PageHeader (h1) → SectionHeader (h2). Don't skip levels.
- Touch targets minimum 44x44px: Button sm is 32px — use md or lg for primary actions.
- Text contrast: text-text-primary on bg-bg-primary (white on dark) passes 4.5:1. text-text-tertiary is for supplementary info only.`,
  },
  {
    id: "typography",
    name: "Typography",
    description: "Professional type hierarchy and readability",
    icon: "Type",
    defaultOn: false,
    promptSnippet: `## SKILL: Typography
Apply professional type hierarchy:
- MAX 3-4 text size levels per screen. Don't use 6 different font sizes.
- Page title: text-2xl font-semibold (PageHeader handles this)
- Section title: text-lg font-semibold (SectionHeader handles this)
- Card titles: text-base font-medium
- Body/description: text-sm text-text-secondary
- Metadata/captions: text-xs text-text-tertiary
- Line height: body text needs leading-relaxed (1.625). Headings can use leading-tight.
- Max line length: descriptions should be max-w-2xl or 3 lines. Use line-clamp-3 for card descriptions.
- Text hierarchy creates visual scanning pattern: users read titles first, then stats, then descriptions last.`,
  },
  {
    id: "design-system",
    name: "System Patterns",
    description: "Atomic design composition and consistent patterns",
    icon: "Layers",
    defaultOn: false,
    promptSnippet: `## SKILL: Design System Patterns
Follow atomic design composition:
- ATOMS: Button, Badge, StatusPill, Avatar, Divider, GameIcon, ProgressBar, Toggle — never recreate these
- MOLECULES: SearchInput, FilterChip, CountdownTimer, ChatInput, LeaderboardRow — functional units
- ORGANISMS: SessionCard, TournamentCard, DataTable, Sidebar, Modal — complex components
- TEMPLATES: Page Shell (Sidebar + TopBar + main) — the universal layout
- PAGES: Your output — organisms composed into a full screen

Composition rules:
- Every page has exactly ONE page shell
- Every main section opens with SectionHeader
- Stat overviews use grid of StatCard (4 columns on desktop)
- Content listings use grid of cards (3 columns on desktop)
- Toolbars combine SearchInput + FilterChip row + ViewToggle
- Data views offer both DataTable (table view) and card grid (grid view)
- Use consistent 8px spacing system: gap-1(4px), gap-2(8px), gap-3(12px), gap-4(16px), gap-6(24px), gap-8(32px)`,
  },
  {
    id: "usability",
    name: "Usability",
    description: "Nielsen's heuristics for user-friendly interfaces",
    icon: "MousePointer",
    defaultOn: false,
    promptSnippet: `## SKILL: Usability (Nielsen's Heuristics)
Apply usability best practices:
- SYSTEM STATUS: Show counts (e.g., "234 Active Sessions"), use StatusPill for live/offline states, CountdownTimer for time-sensitive content
- MATCH REAL WORLD: Use gaming language (sessions, scrims, rank, ELO) not tech jargon. Dates in human format ("2 days ago", "Mar 4")
- USER CONTROL: Always provide "back" via Breadcrumbs. Allow filtering/search on list pages. Include clear/reset on filters.
- CONSISTENCY: Same action = same component everywhere. "Join" always uses primary Button. "Details" always uses outline Button.
- ERROR PREVENTION: Use Select (dropdown) over free text when options are finite. Pre-fill sensible defaults.
- RECOGNITION > RECALL: Use FilterChip to show active filters visually. Show game icons next to game names. Show avatar next to player names.
- FLEXIBILITY: Provide ViewToggle (table/grid) on list pages. Provide SearchInput for quick filtering. Offer both browse (grid) and search paths.
- MINIMALIST DESIGN: Every element earns its place. Remove decorative elements that don't help the user complete a task.`,
  },
  {
    id: "emotional",
    name: "Emotional Design",
    description: "Create interfaces people love, not just use",
    icon: "Heart",
    defaultOn: false,
    promptSnippet: `## SKILL: Emotional Design
Design for feeling, not just function:
- VISCERAL (first impression): The dark gaming aesthetic with mint accent (#99F9EA) creates a premium, powerful feel. Maintain this by using bg-bg-primary + text-text-accent consistently. HeroBanner creates immediate emotional impact — always use one on key pages.
- BEHAVIORAL (during use): Every interaction should feel rewarding. Use ProgressBar to show advancement. MissionCard with progress creates satisfaction. LeaderboardRow with rank 1-3 special styling creates aspiration.
- REFLECTIVE (after use): The page should feel like it belongs to a premium esports platform. Use AvatarGroup to create social proof. Use Badge with gold/diamond variants to show achievement. StatCard with impressive numbers creates pride.
- MICRO-MOMENTS: Celebrate with Badge variant="gold". Show progress with ProgressBar. Create urgency with CountdownTimer. Build community with AvatarGroup and ChatListItem.
- EMPTY STATES: When sections could be empty, don't leave blank space. Show encouraging messages like "No sessions yet — create one!" with a Button.`,
  },
  {
    id: "gamification",
    name: "Gamification",
    description: "Engagement through achievements, progress, and competition",
    icon: "Trophy",
    defaultOn: false,
    promptSnippet: `## SKILL: Gamification (Octalysis Framework)
Add engagement mechanics using existing components:
- ACCOMPLISHMENT: Use MissionCard with progress tracking. Show Badge with bronze/silver/gold/diamond tiers. Display ProgressBar for completion.
- SOCIAL INFLUENCE: Use LeaderboardRow to show rankings. AvatarGroup for social proof ("24 members"). PlayerCard to highlight top players.
- OWNERSHIP: StatCard showing personal stats ("Your Stats: 23 wins, 68% WR"). GameTabCard showing "your" games and ranks.
- SCARCITY: CountdownTimer for tournament registration deadlines. StatusPill variant="live" for time-sensitive sessions. Capacity indicators ("8/10 spots").
- EPIC MEANING: HeroBanner with inspiring copy ("Rise to the top"). SectionHeader framing actions as missions ("Your Active Missions").
- When the page involves missions/rewards, always use: MissionCard + ProgressBar + Badge + LeaderboardRow together for maximum engagement.`,
  },
  {
    id: "microcopy",
    name: "Microcopy",
    description: "UX writing that motivates action and reduces friction",
    icon: "MessageSquare",
    defaultOn: false,
    promptSnippet: `## SKILL: Microcopy & UX Writing
Write interface text that drives action:
- BUTTON LABELS: Use specific action verbs, not generic. "Join Session" not "Submit". "Create Tournament" not "Continue". "Find Your Team" not "Search".
- CTA HIERARCHY: Primary Button text = the desired outcome ("Join Now", "Start Competing"). Secondary = the alternative ("View Details", "Learn More").
- SECTION HEADERS: Frame as benefits or actions, not categories. "Your Active Missions" not "Missions". "Find Your Next Match" not "Sessions".
- EMPTY STATES: Always provide a clear next action. "No tournaments yet — Create your first tournament" with a Button.
- DESCRIPTIONS: Lead with value, not features. "Compete against the best teams in MENA" not "This is a tournament page".
- NUMBERS: Use social proof numbers. "12,450 active players" "89 live tournaments" "3 spots left". Numbers create urgency and trust.
- PLACEHOLDER TEXT: Be helpful and specific. "Search by player name, game, or rank..." not "Search...".
- REASSURANCE: Near action buttons, add trust signals. "Free to join" "No credit card required" "Cancel anytime".
- GAMING VOICE: Confident, competitive, community-driven. Use "Rise", "Compete", "Conquer", "Dominate", "Unite". Never corporate speak.`,
  },
  {
    id: "ux-psychology",
    name: "UX Psychology",
    description: "Cognitive biases that improve conversion and engagement",
    icon: "Brain",
    defaultOn: false,
    promptSnippet: `## SKILL: UX Psychology (Cognitive Biases)
Apply these psychological principles:
- SOCIAL PROOF: Show user counts next to key sections ("12,450 players competing"). Use AvatarGroup to show real people. Add Badge "Most Popular" to highlight popular items.
- SCARCITY: Use CountdownTimer on tournaments. Show capacity "8/10 spots". StatusPill variant="live" creates urgency. "Registration closes in 2 days".
- LOSS AVERSION: Frame as losses not gains. "Don't miss the Valorant Champions TOUR" not "Join the tournament". "3 spots remaining" not "Join now".
- GOAL GRADIENT: Use ProgressBar showing near-completion (70%+ feels compelling). MissionCard with 7/10 progress motivates more than 2/10.
- ANCHORING: Show the best/most impressive stat first in StatCard rows. Show the premium option first in PricingCard grids.
- HICK'S LAW: Max 4-5 FilterChips visible. Max 3-4 Tabs. Don't overwhelm with choices — use progressive disclosure (FilterDrawer for advanced filters).
- PEAK-END RULE: Make the top of the page memorable (HeroBanner with bold copy). End sections with a clear CTA (SectionHeader actionLabel).
- VARIABLE REWARDS: Mix content types in sections — don't show 6 identical cards. Mix SessionCard + TournamentCard + ArticleCard for visual variety.`,
  },
  {
    id: "behavior",
    name: "Behavior Design",
    description: "Fogg's B=MAP model for driving user action and habits",
    icon: "Zap",
    defaultOn: false,
    promptSnippet: `## SKILL: Behavior Design (B=MAP)
Design for action using Fogg's Behavior Model — Behavior = Motivation × Ability × Prompt:
- PROMPTS: Every section needs a clear call-to-action. SectionHeader with actionLabel. Button after card grids. Never show content without a next step.
- ABILITY: Make the desired action easy. "Join" buttons prominent and primary variant. SearchInput + FilterChip reduce effort to find content. ViewToggle lets users choose their preferred view.
- MOTIVATION: Show the reward before asking for action. StatCard with impressive numbers creates aspiration. LeaderboardRow shows what success looks like. Badge shows achievable rewards.
- HOOK MODEL (Trigger → Action → Reward → Investment):
  - Trigger: HeroBanner headline + CTA. "Find Your Team. Compete. Rise."
  - Action: Button "Join Now" / "Find Your Team" — make it the easiest action on the page
  - Reward: StatCard showing achievements. MissionCard showing progress. LeaderboardRow showing rank.
  - Investment: GameTabCard showing "your" games. ProgressBar showing "your" progress. The more invested, the more they return.
- MOTIVATION WAVE: Design for low motivation too. Even when users aren't excited, the page should still be useful (browse, search, filter). Don't require high motivation for basic navigation.`,
  },
  {
    id: "dark-pattern-check",
    name: "Ethical Design",
    description: "Detect and avoid manipulative patterns",
    icon: "ShieldCheck",
    defaultOn: false,
    promptSnippet: `## SKILL: Ethical Design (Anti-Dark Patterns)
Ensure your design is ethical:
- NO FORCED ACTIONS: Every modal/overlay must have a clear close/dismiss option. FilterDrawer has onClose. Modal has onClose.
- NO FAKE URGENCY: CountdownTimer should reflect real deadlines. Don't add countdown to things that don't have time limits.
- NO HIDDEN COSTS: PricingCard must show the real price clearly. Don't hide fees in small text.
- CLEAR ACTIONS: Button labels must describe what happens. "Delete Account" not "Continue". Destructive actions use variant="destructive".
- EASY EXIT: Every page has Breadcrumbs for navigation back. Sidebar provides global navigation. Users are never trapped.
- HONEST NUMBERS: StatCard values should be realistic. Don't inflate "active players" or "live tournaments" to misleading levels.
- OPT-IN NOT OPT-OUT: Toggle components default to off for marketing/sharing. Users actively choose to enable.
- CONFIRMATION FOR DESTRUCTIVE: Wrap delete/leave actions in Modal with explicit confirmation. "Are you sure you want to leave this club?"`,
  },
  {
    id: "brand-guidelines",
    name: "Brand Guidelines",
    description: "Full Rize.gg visual style guide — colors, typography, spacing, effects, and anti-patterns",
    icon: "Palette",
    defaultOn: true,
    promptSnippet: `## RULE: Rize.gg Brand Guidelines (Visual Style Guide)

### BRAND IDENTITY
Rize.gg is a competitive gaming/esports platform for MENA. The visual identity is DARK, PREMIUM, and PERFORMANCE-FOCUSED — like a high-end gaming monitor UI crossed with a professional sports analytics dashboard. Think Discord's density meets a luxury watch brand's precision. NOT playful, NOT cartoony, NOT neon-heavy. Calm, confident, data-rich.

### DESIGN SYSTEM FIDELITY
- Match the existing Rize.gg design language before trying to be novel.
- Prefer the shipped design-system components and their documented compositions over custom raw markup.
- Reuse the existing page shell, spacing rhythm, border treatments, and component density unless the brief explicitly asks for a departure.
- Keep the interface product-grade and believable for the current app, not a disconnected concept shot.
- When in doubt, choose stronger hierarchy and cleaner composition rather than adding more widgets.

### COLOR SYSTEM (Dark Mode Only — No Light Theme)

BACKGROUNDS:
- Page background: #0B1211 (bg-bg-primary) — near-black with subtle green-teal undertone
- Card/Input: #121415 (bg-bg-card / bg-bg-input) — slightly lighter
- Surface: #1A1F2E (bg-bg-surface) — blue-gray for hover states & elevated areas
- Surface Hover: #222838 (bg-bg-surface-hover) — interactive hover
- Elevated: #20272A (bg-bg-elevated) — modals, drawers, floating panels

ACCENT (Mint Teal — NOT neon green, NOT cyan):
- Primary: #99F9EA (bg-accent) — buttons, active states, links, highlights
- Hover: #7EECD8 (bg-accent-hover) — slightly darker/warmer
- Muted: rgba(153,249,234,0.12) (bg-accent-muted) — subtle accent backgrounds
- Subtle: rgba(153,249,234,0.04) (bg-accent-subtle) — very faint accent wash
- Foreground: #0B1211 (text-accent-foreground) — dark text ON accent backgrounds

TEXT:
- Primary: #FFFFFF — headlines, card titles, player names
- Secondary: #A2B4B1 — descriptions, meta text, labels
- Tertiary: #5A6577 — disabled, placeholders, hints
- Accent: #99F9EA — links, active nav items, highlighted values

BORDERS:
- Default: #273139 — card borders, dividers, input borders
- Subtle: #1E2535 — low-emphasis dividers
- Accent: #99F9EA — active cards, focused inputs

STATUS (always semantic, never decorative):
- Success/Online: #16A249 — registration open, recruiting
- Error/Live: #FF5252 — live tournaments, errors
- Warning: #FBBD23 — idle, expiring timers
- Info: #4DA6FF — informational badges
- Online dot: #44DD77 — avatar indicator
- Offline dot: #5A6577 — avatar indicator

RANK COLORS:
- Gold: #FFD700 | Silver: #C0C0C0 | Bronze: #CD7F32 | Diamond: #B9F2FF

DESTRUCTIVE:
- Background: #A83A3A | Hover: #923232 | Text: #F8FAFC

### TYPOGRAPHY

FONT: Oxanium only — geometric, slightly squared sans-serif. Technical, gaming-appropriate. No other fonts anywhere.

TYPE SCALE:
- 12px (xs) regular — timestamps, tiny labels, badge text
- 14px (sm) regular-medium — form labels, input text, card meta, button text
- 16px (base) regular-medium — body, descriptions, navigation
- 18px (lg) semibold — card titles, section headers
- 20px (xl) semibold — component titles, sub-page headers
- 24px (2xl) semibold-bold — page headers, modal titles
- 32px (3xl) bold — large stat values, hero titles

WEIGHT RULES:
- 400: body text, descriptions
- 500: button text, form labels, nav items
- 600: card titles, section headers, most headings
- 700: page headlines, stat numbers, hero titles

LETTER SPACING: Default normal. Large headings (24px+): slight negative (-0.1px to -0.14px). Never positive tracking.
TEXT OVERFLOW: line-clamp-2 for card descriptions. truncate for single-line (player names).

### SPACING

4px base grid. Standard patterns:
- Card padding: 16px (p-4)
- Component gap: 16px (gap-4)
- Section gap: 24px (gap-6)
- Page padding: px-6 py-8
- Sidebar: 240px expanded, 60px collapsed
- Max content width: max-w-6xl

### BORDER RADIUS

- sm (6px): small/medium buttons, input icons
- md (8px): cards, inputs, tabs, large buttons — THE DEFAULT
- lg (12px): hero banners, modals, large containers
- xl (16px): extra large decorative elements
- full (9999px): avatars, badges, status pills, toggles

RULE: Cards = md. Badges/pills/avatars = full. Buttons = sm (sm/md size) or md (lg size). Modals/heroes = lg.

### CARD ANATOMY

All cards share: bg-bg-card, border border-border-default, rounded-[var(--radius-md)], p-4
Structure: Header (title + subtitle) → Divider → Content → Footer/Actions
Hover: border-color transitions to rgba(153,249,234,0.3) with transition-colors

### BUTTON VARIANTS

| Variant | BG | Text | Hover |
|---------|-----|------|-------|
| primary | #99F9EA | #0B1211 (dark) | #7EECD8 |
| secondary | #1A1F2E | #FFFFFF | #222838 |
| outline | transparent | #FFFFFF | #222838 bg |
| ghost | transparent | #A2B4B1 | #222838 bg + white text |
| destructive | #A83A3A | #F8FAFC | #923232 |
| discord | #5865F2 | white | brightness +10% |

Sizes: sm (32px h, 12px px), md (40px h, 16px px), lg (48px h, 24px px)

### GRADIENTS & EFFECTS

IMAGE OVERLAYS: Top-down gradient from bg-primary/90 → bg-primary/40 → transparent. Ensures text readability over images.
ACCENT GLOW: ClubCard uses gradient from rgba(153,249,234,0.02) → rgba(153,249,234,0.08) — premium "glow from within".
BACKDROP BLUR: Modals use bg black/60 + blur(4px). Countdown segments use blur(5px) + accent-subtle bg.
SHADOWS: Cards = NO shadow (use borders). Modals/drawers = shadow-2xl. Rule: floats = shadow, in-flow = border.

### INTERACTION STATES

HOVER: Cards get accent border at 30% opacity. Buttons follow variant rules. List items fill to #222838. Links shift to white or underline.
FOCUS: Inputs get accent border. Buttons keep default ring.
ACTIVE: Sidebar active = accent-muted bg + accent text + left border. Active tab = surface bg + primary text. Active filter = accent bg + dark text.
DISABLED: 50% opacity, pointer-events-none, no hover effects.
TRANSITIONS: All interactive elements have transitions. Default 150ms. Progress bars 500ms. Use transition-colors or transition-all.

### VISUAL PRINCIPLES

1. DENSITY OVER EMPTINESS — fill screens with useful data, stat cards, player counts, countdowns
2. HIERARCHY THROUGH WEIGHT NOT SIZE — use font-weight and text-color, not oversized headlines
3. BORDERS DEFINE, SHADOWS FLOAT — 1px borders for in-flow elements, shadows only for floating UI
4. ACCENT IS SURGICAL — #99F9EA used precisely for CTAs, active states, links. Never splashed broadly
5. STATUS COLORS ARE SEMANTIC — green=success, red=error, yellow=warning, blue=info. Never decorative
6. COMPONENT CONSISTENCY — all cards share the same skeleton. Content differentiates them
7. DESKTOP-FIRST — grids collapse 3→2→1. Sidebar stays fixed. No layout drama

### ANTI-PATTERNS (NEVER DO THESE)

- No neon colors (#00FF00, glowing borders)
- No gradients as backgrounds (only for image overlays and ClubCard effect)
- No rounded-xl on cards (always radius-md/8px)
- No white or light backgrounds — ever
- No drop shadows on cards — use borders
- No colored text on colored backgrounds — dark text on accent, light text on dark
- No excessive animation — 150ms, subtle. No bouncing or sliding
- No rounded corners > 16px
- No raw HTML elements — use design system components`,
  },
  {
    id: "data-heavy",
    name: "Data-Heavy Design",
    description: "Dashboard layouts, KPI panels, data tables, and analytics patterns",
    icon: "BarChart3",
    defaultOn: false,
    promptSnippet: `## SKILL: Data-Heavy Design (Dashboards & Analytics)
Apply expert patterns for data-dense interfaces:
- INFORMATION HIERARCHY: Primary KPIs at top (StatCard grid, 4 columns). Controls/filters in toolbar below. Trend charts in middle zone. Detailed DataTable at bottom.
- 5-METRIC RULE: Max 5 primary KPIs visible at once. More causes cognitive overload. Group secondary metrics in expandable sections.
- KPI ANATOMY: Every StatCard needs: label + value + delta indicator (↑12% or ↓3%) + context ("vs last week"). Use ProgressBar for goal tracking.
- DATA TABLE RULES: Text columns left-aligned. Number columns right-aligned. Date columns left-aligned. Status columns center-aligned. Use DataTable component with proper column config.
- ROW DENSITY: Default 48px row height. Compact 40px for power users (ViewToggle). Comfortable 56px for touch.
- REAL-TIME UPDATES: Show data freshness indicator ("Updated 2m ago"). Use StatusPill variant="live" for real-time data. Skeleton loading for initial load, not spinners.
- PROGRESSIVE DISCLOSURE: Summary view by default, expand for details. FilterDrawer for advanced filters. Don't show every data point at once.
- COGNITIVE LOAD: Use whitespace between data groups. Color-code categories consistently. Max 5 chart series. Direct labels on charts, not legends.`,
  },
  {
    id: "anti-generic",
    name: "Anti-Generic Design",
    description: "Avoid AI slop — create distinctive, intentional interfaces",
    icon: "Sparkles",
    defaultOn: false,
    promptSnippet: `## SKILL: Anti-Generic Design (Avoid AI Slop)
Your output must feel INTENTIONAL and DISTINCTIVE, not generic:
- RED FLAGS TO AVOID: Don't use predictable symmetric layouts (hero → 3 cards → CTA). Don't default to boring grids of identical cards. Don't use generic placeholder text ("Lorem ipsum", "Description here"). Don't create flat, lifeless layouts.
- VISUAL RHYTHM: Vary card sizes in grids (feature card larger than others). Mix component types in sections (SessionCard + StatCard + LeaderboardRow). Create visual variety through asymmetry.
- CONTENT DENSITY: Gaming platforms are information-rich. Fill the screen with useful data. Empty space should be intentional, not lazy. Show real-looking data (player names, game stats, rankings).
- ATMOSPHERIC DESIGN: Use the dark gaming aesthetic fully. HeroBanner with bold copy for key pages. Badge with gold/diamond variants for premium feel. StatusPill variant="live" for energy.
- DISTINCTIVE PATTERNS: Lead sections with unexpected layouts (stats bar + hero, not just a title). Use AvatarGroup for social proof in unexpected places. Combine CountdownTimer with tournament cards for urgency.
- CONTENT QUALITY: Every text string should feel real and specific to gaming/esports. Player names like "ShadowStrike", "NexusGaming". Stats like "2,450 ELO", "89% WR". Tournament names like "MENA Champions Cup".
- COMPOSITION: Create focal points. Not everything is equal weight. One hero element per section, supporting elements around it.`,
  },
  {
    id: "component-states",
    name: "Component States",
    description: "Proper interactive states: hover, focus, loading, empty, error",
    icon: "ToggleRight",
    defaultOn: false,
    promptSnippet: `## SKILL: Component States & Interactions
Ensure all components show proper states:
- LOADING STATE: Use skeleton loading for initial page load. Show ProgressBar or spinner for async actions. Button has loading state — use it for form submissions.
- EMPTY STATE: Never leave sections blank. Show encouraging messages: "No tournaments yet — Create your first!" with a primary Button CTA. Use relevant icons.
- ERROR STATE: Show inline error messages near the source. Use text-text-destructive for error text. Provide recovery actions ("Try again" Button).
- INTERACTIVE STATES: All Button components have built-in hover/focus/active states. Don't recreate them with custom CSS. Use proper variant props (primary, secondary, outline, ghost, destructive).
- DISABLED STATE: Gray out unavailable actions. Show tooltip explaining why disabled. Use Button disabled prop, not custom opacity.
- STATUS INDICATORS: Use StatusPill for live/offline/pending states. Use Badge for counts and labels. Use ProgressBar for completion tracking.
- FEEDBACK: Every user action should have visible feedback. Form submit → loading state → success/error. Filter click → filtered results update. Search → results or "No results found".
- CAPACITY: Show limits visually. "8/10 spots" with ProgressBar at 80%. Tournament registration closing → CountdownTimer.`,
  },
];

export function buildSkillPrompts(activeSkillIds: string[]): string {
  const activeSkills = DESIGN_SKILLS.filter((s) =>
    activeSkillIds.includes(s.id)
  );
  if (activeSkills.length === 0) return "";

  return (
    "\n\n## ACTIVE DESIGN RULES\n" +
    activeSkills.map((s) => s.promptSnippet).join("\n\n")
  );
}
