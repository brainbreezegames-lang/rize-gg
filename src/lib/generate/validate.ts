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

export function validateGeneratedCode(code: string): Violation[] {
  const violations: Violation[] = [];

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
