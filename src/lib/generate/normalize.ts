/**
 * Code normalizer — runtime post-processor for AI-generated JSX.
 *
 * Runs between generation and render to fix common AI mistakes:
 *   1. Strip import statements (components are already in scope)
 *   2. Replace raw hex Tailwind classes with design tokens
 *   3. Fix border-radius to use CSS variables
 *   4. Strip unwanted font-family classes
 *   5. Fix deprecated component props
 */

// ─── Color token maps ────────────────────────────────────────────────────────

type TokenEntry = { rgb: [number, number, number]; token: string };

function hexToRgb(hex: string): [number, number, number] | null {
  const h = hex.replace("#", "");
  if (h.length === 3) {
    return [
      parseInt(h[0] + h[0], 16),
      parseInt(h[1] + h[1], 16),
      parseInt(h[2] + h[2], 16),
    ];
  }
  if (h.length === 6) {
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  }
  return null;
}

function colorDist(a: [number, number, number], b: [number, number, number]): number {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}

function buildEntries(map: Record<string, string>): TokenEntry[] {
  return Object.entries(map).map(([hex, token]) => ({
    rgb: hexToRgb(hex)!,
    token,
  }));
}

// Background tokens: hex → Tailwind class
const BG_MAP: Record<string, string> = {
  "#99F9EA": "bg-accent",
  "#7EECD8": "bg-accent-hover",
  "#0B1211": "bg-bg-primary",
  "#121415": "bg-bg-secondary",
  "#1A1F2E": "bg-bg-surface",
  "#222838": "bg-bg-surface-hover",
  "#20272A": "bg-bg-elevated",
  "#A83A3A": "bg-destructive",
  "#16A249": "bg-status-success",
  "#FF5252": "bg-status-error",
  "#FBBD23": "bg-status-warning",
};

const TEXT_MAP: Record<string, string> = {
  "#FFFFFF": "text-text-primary",
  "#A2B4B1": "text-text-secondary",
  "#5A6577": "text-text-tertiary",
  "#99F9EA": "text-text-accent",
  "#0B1211": "text-accent-foreground",
};

const BORDER_MAP: Record<string, string> = {
  "#273139": "border-border-default",
  "#1E2535": "border-border-subtle",
  "#99F9EA": "border-border-accent",
};

const BG_ENTRIES = buildEntries(BG_MAP);
const TEXT_ENTRIES = buildEntries(TEXT_MAP);
const BORDER_ENTRIES = buildEntries(BORDER_MAP);

const MAX_COLOR_DIST = 35; // ~±12 per channel

function findClosestToken(hex: string, entries: TokenEntry[]): string | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  let best: TokenEntry | null = null;
  let bestDist = Infinity;
  for (const entry of entries) {
    const d = colorDist(rgb, entry.rgb);
    if (d < bestDist) {
      bestDist = d;
      best = entry;
    }
  }
  return best && bestDist <= MAX_COLOR_DIST ? best.token : null;
}

// ─── Normalizers ─────────────────────────────────────────────────────────────

/** Strip import statements — components are already in react-live scope */
function stripImports(code: string): string {
  return code.replace(/^import\s+.*$/gm, "").replace(/^\s*\n/gm, "\n");
}

/** Replace raw hex Tailwind classes with design tokens (fuzzy matching) */
function replaceHexColors(code: string): string {
  // Match: bg-[#XXXXXX], text-[#XXXXXX], border-[#XXXXXX]
  return code.replace(
    /\b(bg|text|border|from|to|via|ring|divide|shadow|outline|fill|stroke)-\[#([0-9a-fA-F]{3,6})\]/g,
    (match, prefix: string, hex: string) => {
      const fullHex = `#${hex.toUpperCase()}`;
      let entries: TokenEntry[];
      if (prefix === "bg" || prefix === "from" || prefix === "to" || prefix === "via") {
        entries = BG_ENTRIES;
      } else if (prefix === "text" || prefix === "fill") {
        entries = TEXT_ENTRIES;
      } else if (prefix === "border" || prefix === "ring" || prefix === "divide" || prefix === "outline") {
        entries = BORDER_ENTRIES;
      } else {
        return match;
      }
      const token = findClosestToken(fullHex, entries);
      return token ?? match;
    }
  );
}

/** Fix border-radius classes to use CSS custom properties */
function fixBorderRadius(code: string): string {
  const map: Record<string, string> = {
    "rounded-sm": "rounded-[var(--radius-sm)]",
    "rounded-md": "rounded-[var(--radius-md)]",
    "rounded-lg": "rounded-[var(--radius-lg)]",
    "rounded-xl": "rounded-[var(--radius-xl)]",
  };
  let result = code;
  for (const [raw, token] of Object.entries(map)) {
    // Match whole class only (not already wrapped in var())
    result = result.replace(
      new RegExp(`\\b${raw}\\b(?!\\[)`, "g"),
      token
    );
  }
  return result;
}

/** Strip font-family classes — Oxanium is set globally */
function stripFontFamilies(code: string): string {
  return code.replace(/\bfont-(sans|mono|serif)\b\s*/g, "");
}

/** Fix deprecated component props by renaming them */
function fixDeprecatedProps(code: string): string {
  let result = code;

  // HeroBanner: title= → userName=
  result = result.replace(
    /(<HeroBanner\b[^>]*)\btitle=/g,
    "$1userName="
  );
  // HeroBanner: subtitle= → tagline=
  result = result.replace(
    /(<HeroBanner\b[^>]*)\bsubtitle=/g,
    "$1tagline="
  );
  // HeroBanner: overlay= → remove
  result = result.replace(
    /(<HeroBanner\b[^>]*)\boverlay=\{[^}]*\}\s*/g,
    "$1"
  );
  result = result.replace(
    /(<HeroBanner\b[^>]*)\boverlay="[^"]*"\s*/g,
    "$1"
  );

  // StatCard: unit= → subtitle=
  result = result.replace(
    /(<StatCard\b[^>]*)\bunit=/g,
    "$1subtitle="
  );
  // StatCard: cta= → remove
  result = result.replace(
    /(<StatCard\b[^>]*)\bcta=\{[^}]*\}\s*/g,
    "$1"
  );
  result = result.replace(
    /(<StatCard\b[^>]*)\bcta="[^"]*"\s*/g,
    "$1"
  );

  // SessionCard: availability= → time=
  result = result.replace(
    /(<SessionCard\b[^>]*)\bavailability=/g,
    "$1time="
  );

  return result;
}

// ─── Main ────────────────────────────────────────────────────────────────────

export function normalizeCode(code: string): string {
  let result = code;
  result = stripImports(result);
  result = replaceHexColors(result);
  result = fixBorderRadius(result);
  result = stripFontFamilies(result);
  result = fixDeprecatedProps(result);
  return result;
}
