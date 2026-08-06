/**
 * Living catalog of current AI-design tells.
 * Updated monthly — perishable knowledge on purpose.
 *
 * Phase 1 ships a hand-written August 2026 starter set.
 * The Factory (Product A) will refresh this later.
 */

export interface SlopSignature {
  id: string;
  name: string;
  /** Patterns to hunt in artifact text / summaries (case-insensitive) */
  patterns: RegExp[];
  why: string;
  fix: string;
  severity: "blocker" | "warning" | "suggestion";
}

export const SLOP_SIGNATURES: SlopSignature[] = [
  {
    id: "purple-gradient-default",
    name: "Purple / indigo default theme",
    patterns: [
      /purple[- ]?to[- ]?indigo/i,
      /from-purple|to-indigo|bg-purple|text-purple|#6366f1|#8b5cf6|#7c3aed/i,
      /violet[- ]?gradient/i,
    ],
    why: "The most recognized AI-default look. Reads as template, not brand.",
    fix: "Pick a brand-specific accent. If the brand is not purple, ban purple entirely.",
    severity: "blocker",
  },
  {
    id: "cream-terracotta",
    name: "Cream background + terracotta accent cluster",
    patterns: [
      /#f4f1ea|cream background|terracotta/i,
      /warm cream|off-white serif/i,
    ],
    why: "A second AI cluster that looks 'designed' but is now a tell.",
    fix: "Choose a different atmosphere: real imagery, brand color, or a sharper contrast story.",
    severity: "warning",
  },
  {
    id: "inter-roboto-system",
    name: "Default system / Inter / Roboto typography",
    patterns: [
      /font-sans\b/,
      /\binter\b/i,
      /\broboto\b/i,
      /\barial\b/i,
      /system-ui/,
    ],
    why: "Expressive type is a brand signal. Default stacks erase personality.",
    fix: "Commit to a purposeful display + body pairing already in the brand or plan.",
    severity: "warning",
  },
  {
    id: "glow-multishadow",
    name: "Glow effects and stacked shadows",
    patterns: [
      /shadow-2xl|drop-shadow-2xl|glow/i,
      /shadow-\[0_0_.*\]/,
      /blur-3xl.*bg-.*\/[123]\d/,
    ],
    why: "Decorative glow and multi-layer shadows are common AI polish that rarely earns its place.",
    fix: "Prefer flat surfaces, one subtle border, or a single restrained shadow if elevation is required.",
    severity: "suggestion",
  },
  {
    id: "pill-cluster",
    name: "Pill / badge / chip clusters",
    patterns: [
      /rounded-full.*(badge|chip|pill|tag)/i,
      /pill cluster|chip row|badge strip/i,
    ],
    why: "Clusters of pills compete for attention and clutter the first viewport.",
    fix: "One badge max near a headline if needed. Otherwise use plain text hierarchy.",
    severity: "suggestion",
  },
  {
    id: "hero-stat-strip",
    name: "Stats / schedules in the hero",
    patterns: [
      /hero.*\b(stats?|kpi|metric)/i,
      /\bthis week\b.*hero/i,
      /stat strip|metric row/i,
    ],
    why: "Hero budget: brand, one headline, one sentence, one CTA group, one dominant image.",
    fix: "Move stats and schedules below the first viewport into their own single-purpose section.",
    severity: "warning",
  },
  {
    id: "card-everything",
    name: "Everything-in-a-card layout",
    patterns: [
      /card grid in hero/i,
      /hero.*rounded-.*shadow/i,
      /every section.*card/i,
    ],
    why: "Cards are for interaction containers. Carding everything flattens hierarchy.",
    fix: "Remove card chrome wherever border/shadow/radius do not aid interaction or understanding.",
    severity: "warning",
  },
  {
    id: "raw-hex-with-tokens",
    name: "Raw hex colors instead of tokens",
    patterns: [
      /bg-\[#|text-\[#|border-\[#/,
      /style=\{\{[^}]*(color|background)/i,
    ],
    why: "Bypassing design tokens creates drift and off-brand one-offs.",
    fix: "Use the project's token classes or CSS variables from the approved plan vocabulary.",
    severity: "blocker",
  },
  {
    id: "emoji-decoration",
    name: "Emoji as UI decoration",
    patterns: [
      /[\u{1F300}-\u{1FAFF}]/u,
      /emoji icon|use emoji/i,
    ],
    why: "Emojis as decoration read as casual AI filler, not product UI.",
    fix: "Use the project's icon set (e.g. lucide) at consistent sizes.",
    severity: "suggestion",
  },
  {
    id: "generic-headline",
    name: "Generic SaaS headline voice",
    patterns: [
      /unlock (your )?potential/i,
      /revolutionize (your|the)/i,
      /seamless(ly)? (experience|integration)/i,
      /next-?gen(eration)? (platform|solution)/i,
      /empower(ing)? (teams|users|creators)/i,
    ],
    why: "These phrases are interchangeable across products — brand signal is zero.",
    fix: "Write a headline only this product could claim. Specificity beats grandeur.",
    severity: "warning",
  },
];

export function scanForSlop(text: string): Array<{
  signature: SlopSignature;
  matched: string;
}> {
  const hits: Array<{ signature: SlopSignature; matched: string }> = [];
  for (const signature of SLOP_SIGNATURES) {
    for (const pattern of signature.patterns) {
      const match = text.match(pattern);
      if (match) {
        hits.push({ signature, matched: match[0] });
        break;
      }
    }
  }
  return hits;
}
