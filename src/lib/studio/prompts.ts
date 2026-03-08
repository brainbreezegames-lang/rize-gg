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
  | "content"
  | "psychology"
  | "microcopy";

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
  {
    key: "psychology",
    label: "Apply UX Psychology",
    subtitle: "Cognitive biases, social proof, loss aversion, nudges",
    icon: "Brain",
  },
  {
    key: "microcopy",
    label: "Rewrite All Copy",
    subtitle: "CTAs, empty states, labels, error text — every word earns its place",
    icon: "PenLine",
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

### CTA Accent Rule
- The primary CTA on each screen must be the ONLY element using bg-accent
- Don't use accent color on more than 1-2 elements per visible viewport
- Secondary actions use variant="secondary" or variant="outline"

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

### Information Hierarchy (Top to Bottom)
Structure each page in this priority order:
1. **Hero/Context**: What page is this? What can I do here? (PageHeader, HeroBanner)
2. **Primary Stats**: Key numbers/status at a glance (StatCard row)
3. **Active/Live Content**: What's happening now? (SessionCards, live tournaments)
4. **Browse/Discover**: All available content (card grids, tables)
5. **Secondary Content**: Related info, history, settings

### Reading Path (F-Pattern / Z-Pattern)
- Key info (title, status, primary CTA) should be in the top-left area of each card
- Left column gets more attention in LTR layouts — put primary content there
- In two-column layouts: main content left (wider), sidebar right (narrower, 280-320px)
- Users scan headings first — make every heading informative, not generic

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

const RULES_UX_PSYCHOLOGY = `
## UX PSYCHOLOGY — Deep Rules

You are a behavioral psychology specialist. Apply cognitive biases to make every screen more persuasive, intuitive, and engaging. Don't just make it look better — make users FEEL the right thing at the right moment.

### INFORMATION FILTERING (How Users Process What They See)

**Hick's Law — Reduce Choices**
- More than 5 options visible? Group them, add tabs, or use progressive disclosure
- Long card lists: show 3-4 with a "View all" SectionHeader link
- Dense filter bars: show 2-3 most-used filters, put the rest in FilterDrawer
- Tab navigation: max 5 tabs visible, overflow the rest

**Cognitive Load — Reduce Mental Effort**
- Break complex sections into chunks using SectionHeaders and Dividers
- Use familiar patterns (users already know how card grids, tabs, search bars work)
- If a section has both stats AND a list AND filters, separate them visually with spacing (gap-8+)
- Remove any text that doesn't help the user's primary goal

**Fitts's Law — Make Targets Easy to Hit**
- Primary CTAs: large (min 44px height), prominent position, plenty of spacing
- Icon-only buttons: add sufficient padding (p-3 minimum) for touch targets
- Place the most important action where the user's cursor/thumb naturally rests

**Banner Blindness — Don't Look Like an Ad**
- Important CTAs placed in right sidebars or top banners get ignored
- Critical info should be WITHIN the content flow, not in a separate promotional-looking box
- Avoid "ad-shaped" rectangles for important announcements

**Progressive Disclosure — Show Core First, Details on Demand**
- Show summary first, expand for details (collapsible sections, "Show more" links)
- New users see simple options; advanced features reveal as they explore
- Don't overwhelm with everything at once — layer the complexity

**Anchoring — First Thing Seen Sets the Reference**
- Start pages with the most impressive content (hero stats, key numbers, bold heading)
- On pricing/stats: show the biggest/best number first
- Don't start with filters, settings, or secondary controls

**Priming — Set the Emotional Context**
- Imagery before actions influences behavior: show success stories before signup forms
- Use positive hero images before asking users to commit (gaming victories, team celebrations)
- Color and imagery prime the user's emotional state

**Framing — Same Info, Different Perception**
- "Join 10,000+ players" (positive) vs "Don't miss out" (loss frame)
- "95% win rate" vs "Only 5% lose" — choose the frame that drives the desired action
- Frame benefits positively, risks as things to avoid

### MEANING MAKING (How Users Interpret and Decide)

**Social Proof — People Follow Others**
- Add player counts: "Join 10,000+ players", "1,234 online now"
- Use AvatarGroup to show active community members
- Add "Most popular" Badge to the preferred option
- Show activity feeds, recent joins, live match counts

**Scarcity — Limited Availability Increases Desire**
- Use CountdownTimer for time-limited events
- Show remaining spots: "Only 3 slots left" with StatusPill
- Tournament registration closing soon → use bg-status-warning urgency
- NEVER fake scarcity — users detect it and lose trust permanently

**Loss Aversion — Losses Hurt 2x More Than Gains**
- Frame CTAs as avoiding loss: "Don't lose your spot" > "Register now"
- Show what they'll miss: "Registration closes in 2 hours"
- Progress they've built: "You've completed 60% — keep going!"

**Goal Gradient — Motivation Increases Near Completion**
- Add ProgressBar components to show completion toward goals
- Pre-fill progress slightly (start at 15-20%, not 0%)
- Break long processes into milestones with visual checkmarks
- Mission progress, profile completion, tournament advancement — all benefit from visible progress

**Commitment & Consistency — Small Actions Lead to Bigger Ones**
- Start with easy, low-commitment actions (browse, follow, watch)
- Build up to bigger commitments (join team, enter tournament, subscribe)
- Show past commitments: "Member since 2024", "12 tournaments completed"

**Curiosity Gap — Tease What They Don't Know Yet**
- Blur or partially show premium/locked content
- "Top 3 strategies used by champions" — reveal on click
- Show partial leaderboard data with "See full rankings →"

**Familiarity Bias — Use Patterns Users Already Know**
- Standard UI patterns: card grids, tab navigation, search bars, sidebar nav
- Don't reinvent common interactions — innovation should be incremental
- If it looks like a button, it must behave like a button

**Singularity Effect — One Person > Statistics**
- "Alex won 3 tournaments this month" beats "Users win an average of 2.4 tournaments"
- Use real player names, real avatars, real stories in testimonials
- Featured player spotlights > aggregate statistics

### TIME & DECISIONS (How Users Act)

**Default Bias — 90% Keep Defaults**
- Set smart defaults on filters, sorting, view modes
- Pre-select the recommended option in any choice UI
- Toggle defaults should favor the most helpful setting

**Labor Illusion — Show the Work**
- "Searching 500+ tournaments..." makes results feel more valuable than instant display
- "Analyzing your stats..." before showing personalized recommendations
- Brief loading with descriptive text > instant but unexplained results

**Reactance — People Resist Being Forced**
- Always show clear exit paths (close buttons, back navigation, cancel options)
- Never trap users in flows they can't escape
- Provide "Skip" or "Maybe later" without guilt-tripping language

**Nudge — Guide Without Mandating**
- Highlight the recommended option with a Badge or accent border
- Show the most popular choice: "Most players choose this"
- Use visual emphasis (size, color, position) to guide toward the best option

### MEMORY & RETENTION (What Users Remember)

**Peak-End Rule — Users Remember Peaks and Endings**
- Create memorable high moments: celebrations after wins, achievement unlocks, confetti moments
- End flows on a positive note: "You're all set!" with a clear next step
- The last thing users see before leaving shapes their memory of the whole experience

**Von Restorff Effect — The Odd One Out Gets Remembered**
- The ONE thing you want users to do should be visually distinct from everything else
- Primary CTA: bg-accent — the ONLY element with that color in view
- Featured card: accent border, different background, or a Badge to make it stand out

**Serial Position — First and Last Items Stick**
- Put the most important content FIRST in each section
- Put the CTA or summary LAST
- Middle items get the least attention — don't bury critical info there
`;

const RULES_MICROCOPY = `
## MICROCOPY & UX WRITING — Deep Rules

You are a UX writing specialist. Every word in the interface is part of the design. Bad copy kills conversion more than bad layout. Users don't fail because they can't click — they fail because they don't understand, don't trust, or don't feel motivated.

### THE THREE JOBS OF EVERY PIECE OF TEXT

1. **MOTIVATE ACTION** — Give users a reason to do the thing (headlines, CTAs, value props)
2. **GUIDE THROUGH PROCESS** — Show the way (labels, placeholders, progress text, tooltips)
3. **REDUCE FRICTION & ANXIETY** — Remove reasons NOT to act (reassurance, error recovery, privacy notices)

If a piece of text doesn't do one of these jobs, it shouldn't be there.

### CTA BUTTONS — The Moment of Truth

**Rule 1: Start every button with a specific verb.** The verb describes what the user GETS, not what the system DOES.
- BAD: "Submit", "OK", "Click here", "Yes", "Next"
- GOOD: "Join tournament", "Start match", "Find players", "Create team", "Save changes"

**Rule 2: Complete this sentence — "I want to ___."**
- "I want to... Join tournament" ✓
- "I want to... Submit" ✗
- "I want to... Find my team" ✓
- "I want to... Process" ✗

**Rule 3: Reduce anxiety next to high-commitment CTAs.**
- "Join tournament" + "Free entry • 128 spots left" underneath
- "Create account" + "Takes 30 seconds" underneath
- "Start match" + "You can leave anytime" underneath
- These micro-reassurances address the unspoken "but what if..." objection

**Rule 4: Primary and secondary actions must be visually AND verbally distinct.**
- Primary: filled Button, strong verb ("Save changes")
- Secondary: outline Button, softer verb ("Discard" or "Cancel")
- Destructive: use variant="destructive", explicit verb ("Delete team" not just "Delete")

### EMPTY STATES — The Most Underrated Opportunity

Every empty state must have three things:
1. **WHY it's empty** — "No tournaments yet"
2. **WHAT to do** — "Browse upcoming tournaments or create your own"
3. **A CTA button** — <Button>Browse tournaments</Button>

**Match the emotional tone:**
- First-use empty: encouraging and welcoming ("Your journey starts here")
- No-results empty: helpful and constructive ("Try different filters or browse all")
- Cleared empty: celebratory ("All caught up! Time for a break")

**NEVER** leave an empty state with just "No data" or blank space. That's abandonment, not design.

### ERROR MESSAGES — Build Trust or Destroy It

**Formula: [What happened] + [Why (if helpful)] + [What to do next]**

- BAD: "Error", "Invalid input", "Error 500"
- GOOD: "Couldn't join tournament — registration is full. Join the waitlist instead."
- GOOD: "That username is taken. Try adding a number or try: ShadowWolf42"
- GOOD: "Something went wrong on our end. Your data is safe — try again in a moment."

**Never blame the user.** Even when it IS their fault.
- BAD: "You entered an invalid email"
- GOOD: "This doesn't look like an email address — check for typos"

### FORM LABELS & PLACEHOLDERS

**Labels describe the input. Placeholders show the format. They are NOT the same thing.**
- Label: "Team name" — always visible, persistent
- Placeholder: "e.g., Shadow Wolves" — example format, disappears on focus
- NEVER use placeholder as the only label (accessibility violation, disappears on focus)

**Use familiar words, not system words.**
- "Name" not "Full Name String"
- "Player tag" not "User Identifier"
- "Game" not "Supported Title"

**Mark optional fields, not required ones.** Most fields should be required (you removed the unnecessary ones, right?). Mark exceptions: "Phone (optional)"

### HEADINGS & SECTION COPY

**Headlines should be scannable.** A user should understand any page by reading ONLY the headings, buttons, and labels — without reading body text.

**Write headlines as outcomes, not tasks.**
- BAD: "Step 1: Enter your information"
- GOOD: "Step 1: Set up your profile"
- BAD: "Configure settings"
- GOOD: "Make it yours"

**Section headers should set expectations.**
- BAD: "Data" — data about what?
- GOOD: "Your match history" — the user knows exactly what's below

### LOADING & PROGRESS TEXT

**Tell users what's happening, not that something is happening.**
- BAD: "Loading..."
- GOOD: "Finding the best matches for you..."
- GOOD: "Saving your changes..."
- GOOD: "Connecting to game server..."

**Set expectations for long waits:** "This usually takes a few seconds"
**Reassure nothing is lost:** "Your progress is safe"

### CONFIRMATION DIALOGS

**State the specific consequence.** Not "Are you sure?"
- BAD: "Are you sure?" with "Yes" / "No"
- GOOD: "Leave team 'Shadow Wolves'? You'll lose access to team chat and upcoming matches." with "Leave team" / "Stay"

**Button labels must describe the action** — the user should understand what each button does without reading the dialog body.

### VOICE & TONE FOR RIZE.GG

**Voice (consistent everywhere):** Competitive, confident, clear — like a sharp esports commentator who respects the player.
- Competitive, not aggressive
- Confident, not arrogant
- Clear, not dumbed-down
- Energetic, not manic

**Tone adapts to the moment:**
- Victory/success: celebratory, validating ("Nice! You're in.")
- Error/failure: calm, helpful, no blame ("Let's fix that")
- Empty/new: encouraging, guiding ("Your first match awaits")
- Settings/admin: concise, neutral ("Saved")
- Destructive actions: serious, specific, respectful

### THE 10 MICROCOPY TESTS (Apply All)

1. **Verb Test** — Every CTA starts with a specific action verb
2. **Blame Test** — Error messages blame the system, not the user
3. **Void Test** — Every empty state explains why + what to do + has a CTA
4. **Jargon Test** — A first-time user understands every label without Googling
5. **Placeholder Test** — Placeholders are format hints, not labels
6. **Anxiety Test** — Reassurance text near every high-commitment CTA
7. **Consequence Test** — Destructive confirmations state the specific impact
8. **Consistency Test** — Same action = same label everywhere
9. **Tone Test** — Tone matches the user's emotional state at each moment
10. **Scanability Test** — User understands the page by reading only headings, labels, and buttons
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
    case "psychology":
      return RULES_UX_PSYCHOLOGY;
    case "microcopy":
      return RULES_MICROCOPY;
    case "full":
      // Only send the 3 most impactful rule sets — too many overwhelms the model
      return [RULES_LAYOUT, RULES_HIERARCHY, RULES_POLISH].join("\n");
  }
}

// ─── Build system prompt ─────────────────────────────────────────────────────

/**
 * Patch-based approach: The AI outputs a JSON array of className replacements.
 * The client applies these patches to the ORIGINAL code — making it impossible
 * to remove content, change text, or break layouts.
 */
export function buildStudioSystemPrompt(
  currentCode: string,
  pageName: string,
  mode: StudioMode,
  userPrompt?: string
): string {
  const rules = rulesFor(mode);

  return `You are a senior UI polisher. You receive a React page and output ONLY className patches as a JSON array.

YOU DO NOT REWRITE THE CODE. You output a JSON array of find-and-replace operations on className strings.

CURRENT CODE for the "${pageName}" page:

\`\`\`jsx
${currentCode}
\`\`\`
${userPrompt ? `\nUSER REQUEST: "${userPrompt}"\n` : ""}
═══════════════════════════════════════════════════════════════════
YOUR TASK
═══════════════════════════════════════════════════════════════════

Analyze the code and identify className strings that can be improved.
Output a JSON array of patches. Each patch replaces one className string.

FORMAT — output ONLY this JSON array, nothing else:
[
  {"find": "the exact current className value", "replace": "the improved className value"},
  {"find": "another exact className value", "replace": "improved version"}
]

RULES:
1. "find" must be the EXACT className string value from the code (copy-paste it precisely)
2. "replace" must be a valid Tailwind className string
3. Only modify className values — never change text, JSX structure, component types, or data
4. Each "find" string must be UNIQUE in the code (if duplicates exist, include enough surrounding context)
5. Output 5-20 patches per improvement pass — focus on highest-impact changes
6. Use design tokens, NEVER raw hex values

**Design tokens:**
  BG: bg-bg-primary, bg-bg-secondary, bg-bg-card, bg-bg-surface, bg-bg-surface-hover, bg-bg-input, bg-bg-elevated
  Text: text-text-primary, text-text-secondary, text-text-tertiary, text-text-accent
  Accent: bg-accent, bg-accent-hover, bg-accent-muted, bg-accent-subtle
  Borders: border-border-default, border-border-subtle, border-border-accent
  Radius: rounded-[var(--radius-sm)], rounded-[var(--radius-md)], rounded-[var(--radius-lg)], rounded-[var(--radius-xl)]

═══════════════════════════════════════════════════════════════════
WHAT TO IMPROVE (based on ${mode} mode)
═══════════════════════════════════════════════════════════════════
${rules}

═══════════════════════════════════════════════════════════════════
EXAMPLES
═══════════════════════════════════════════════════════════════════

Good patches:
[
  {"find": "grid grid-cols-2 gap-4", "replace": "grid grid-cols-2 md:grid-cols-4 gap-4"},
  {"find": "text-sm text-text-primary", "replace": "text-lg font-semibold text-text-primary"},
  {"find": "p-4 rounded-lg", "replace": "p-4 rounded-[var(--radius-lg)] border border-border-default hover:border-border-accent/30 transition-colors cursor-pointer"},
  {"find": "bg-bg-primary", "replace": "bg-bg-primary min-h-screen"}
]

Bad patches (NEVER do these):
- Changing text content: {"find": "Federations", "replace": "All Federations"} ← NO
- Adding new elements: patches cannot add JSX, only modify className strings
- Removing elements: patches cannot remove anything
- Non-unique finds: if "flex gap-4" appears 10 times, use a longer unique substring

OUTPUT: Return ONLY the JSON array. No markdown fences, no explanation, no other text.`;
}
