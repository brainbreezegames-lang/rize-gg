export interface Violation {
  type: "error" | "warning";
  rule: string;
  message: string;
  suggestion?: string;
}

const COMPONENT_MAP: Record<string, string> = {
  "<button": "Button",
  "<input": "TextInput / SearchInput / PasswordInput",
  "<select": "Select",
  "<table": "DataTable",
  "<textarea": "ChatInput / TextInput",
};

const TOKEN_SUGGESTIONS: Record<string, string> = {
  "font-sans": "Remove — Oxanium is set globally",
  "font-mono": "Remove — Oxanium is set globally",
  "font-serif": "Remove — Oxanium is set globally",
  "rounded-sm": "rounded-[var(--radius-sm)]",
  "rounded-md": "rounded-[var(--radius-md)]",
  "rounded-lg": "rounded-[var(--radius-lg)]",
  "rounded-xl": "rounded-[var(--radius-xl)]",
};

// Props that were renamed in the design system — catch stale AI output
const DEPRECATED_PROPS: Array<{ pattern: RegExp; rule: string; message: string; suggestion: string }> = [
  {
    pattern: /<HeroBanner[^>]*\btitle=/,
    rule: "Deprecated prop",
    message: "HeroBanner: `title` prop was renamed",
    suggestion: "Use `userName` for the greeting name, `headline` for the bold line, `tagline` for the subtitle",
  },
  {
    pattern: /<HeroBanner[^>]*\bsubtitle=/,
    rule: "Deprecated prop",
    message: "HeroBanner: `subtitle` prop was renamed",
    suggestion: "Use `tagline` instead of `subtitle`",
  },
  {
    pattern: /<HeroBanner[^>]*\boverlay=/,
    rule: "Deprecated prop",
    message: "HeroBanner: `overlay` prop no longer exists",
    suggestion: "Remove `overlay` — the gradient overlay is always applied automatically",
  },
  {
    pattern: /<StatCard[^>]*\bunit=/,
    rule: "Deprecated prop",
    message: "StatCard: `unit` prop was renamed",
    suggestion: "Use `subtitle` instead of `unit`",
  },
  {
    pattern: /<StatCard[^>]*\bcta=/,
    rule: "Deprecated prop",
    message: "StatCard: `cta` prop no longer exists",
    suggestion: "Remove `cta` — use a SectionHeader with `onAction` next to the StatCard instead",
  },
  {
    pattern: /<SessionCard[^>]*\bavailability=/,
    rule: "Deprecated prop",
    message: "SessionCard: `availability` prop was replaced",
    suggestion: "Use `time` (e.g. `time=\"Starting in 18:15\"`) instead of `availability`",
  },
];

export function validateGeneratedCode(code: string): Violation[] {
  const violations: Violation[] = [];

  // Check for deprecated props
  for (const { pattern, rule, message, suggestion } of DEPRECATED_PROPS) {
    if (pattern.test(code)) {
      violations.push({ type: "error", rule, message, suggestion });
    }
  }

  // Check for raw hex colors
  const hexMatches = code.match(/#[0-9a-fA-F]{3,8}/g);
  if (hexMatches) {
    const unique = [...new Set(hexMatches)];
    for (const hex of unique) {
      violations.push({
        type: "warning",
        rule: "No raw hex colors",
        message: `Found raw hex color: ${hex}`,
        suggestion: "Use design token classes (bg-accent, text-text-secondary, etc.)",
      });
    }
  }

  // Check for raw HTML elements that have component equivalents
  for (const [tag, component] of Object.entries(COMPONENT_MAP)) {
    const regex = new RegExp(`${tag}[\\s>]`, "gi");
    if (regex.test(code)) {
      violations.push({
        type: "error",
        rule: "Use design system components",
        message: `Found raw ${tag}> — use ${component} instead`,
        suggestion: `Import and use <${component} /> from the design system`,
      });
    }
  }

  // Check for font classes
  for (const [cls, suggestion] of Object.entries(TOKEN_SUGGESTIONS)) {
    if (code.includes(cls)) {
      violations.push({
        type: "warning",
        rule: "Use design tokens",
        message: `Found "${cls}" — non-token class`,
        suggestion,
      });
    }
  }

  // Check for page shell pattern
  if (code.includes("GeneratedPage") && !code.includes("<Sidebar")) {
    violations.push({
      type: "warning",
      rule: "Page composition",
      message: "Missing <Sidebar /> — pages should follow the standard shell pattern",
      suggestion: "Wrap content in: Sidebar + TopBar + Breadcrumbs + main",
    });
  }

  if (code.includes("GeneratedPage") && !/(md:|lg:|xl:)/.test(code)) {
    violations.push({
      type: "warning",
      rule: "Responsive layout",
      message: "Generated page has no responsive breakpoint classes",
      suggestion: "Add md:/lg:/xl: classes so the layout works at desktop and mobile widths",
    });
  }

  // Check for invented remote URLs (not from MEDIA_LIBRARY, not from /placeholders)
  const urlMatches = code.match(/https?:\/\/[^\s"'`]+/g);
  if (urlMatches) {
    const knownDomains = ["unsplash.com", "images.unsplash.com"];
    const invented = urlMatches.filter(
      (url) => !knownDomains.some((d) => url.includes(d))
    );
    if (invented.length > 0) {
      violations.push({
        type: "warning",
        rule: "Image sources",
        message: `Found ${invented.length} invented remote URL(s): ${invented.slice(0, 2).join(", ")}`,
        suggestion: "Use MEDIA_LIBRARY.heroes.*, MEDIA_LIBRARY.avatars.*, MEDIA_LIBRARY.articles.* or /placeholders/* assets",
      });
    }
  }

  // Warn when /placeholders/ SVGs are used for images that MEDIA_LIBRARY could cover
  const placeholderMatches = code.match(/\/placeholders\/(hero|avatar|article)[^"'`\s]*/g);
  if (placeholderMatches && placeholderMatches.length > 0) {
    violations.push({
      type: "warning",
      rule: "Image quality",
      message: `Found ${placeholderMatches.length} placeholder SVG(s) where MEDIA_LIBRARY photos could be used`,
      suggestion: "Replace /placeholders/hero-*.svg → MEDIA_LIBRARY.heroes.*, /placeholders/avatar-*.svg → MEDIA_LIBRARY.avatars.*",
    });
  }

  // Check for import statements (should not exist in generated code)
  if (/^import\s+/m.test(code)) {
    violations.push({
      type: "warning",
      rule: "No imports",
      message: "Generated code contains import statements — these will be ignored by the renderer",
      suggestion: "All components are available in scope, imports are not needed",
    });
  }

  return violations;
}
