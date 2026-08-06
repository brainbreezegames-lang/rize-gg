/**
 * Framer-style defect hunt list.
 * Review after every section/screen checks these systematically.
 */

export interface DefectCheckDef {
  id: string;
  label: string;
  description: string;
  /** Hint returned when the agent marks this unchecked or fails heuristic */
  fix: string;
}

export const DEFECT_HUNT_LIST: DefectCheckDef[] = [
  {
    id: "clipped_text",
    label: "Clipped or overflowing text",
    description: "No text is cut off by containers, truncated without purpose, or overflowing bounds.",
    fix: "Widen the container, allow wrap, or shorten copy. Never rely on overflow:hidden to hide bad layout.",
  },
  {
    id: "overlapping",
    label: "Overlapping elements",
    description: "No text, icons, or controls overlap unintentionally.",
    fix: "Fix stacking/positioning. Prefer normal document flow over absolute positioning for content.",
  },
  {
    id: "grid_misalignment",
    label: "Grid / column misalignment",
    description: "Same-column edges align. Cards and list rows share a consistent grid.",
    fix: "Use a shared grid/gap scale. Align to the page's horizontal padding rhythm.",
  },
  {
    id: "same_role_sizes",
    label: "Inconsistent same-role sizes",
    description: "Elements with the same role (primary buttons, card titles, icons) share size and weight.",
    fix: "Pick one size per role and reuse the component. Do not invent a second button scale.",
  },
  {
    id: "escaping_containers",
    label: "Elements escaping containers",
    description: "Nothing bleeds outside cards, modals, or section bounds unintentionally.",
    fix: "Check padding, overflow, and image object-fit. Constrain media to the container.",
  },
  {
    id: "spacing_violations",
    label: "Spacing violations",
    description: "Spacing uses the plan's scale. Related items are closer than unrelated groups.",
    fix: "Use the approved spacing steps only. Group by proximity (gap inside << gap between sections).",
  },
  {
    id: "contrast",
    label: "Contrast / legibility",
    description: "Primary text is readable on its background. Secondary text is clearly secondary, not invisible.",
    fix: "Raise contrast for body text. Reserve muted colors for metadata only.",
  },
  {
    id: "hit_targets",
    label: "Hit targets",
    description: "Interactive controls are large enough and have clear hover/focus states.",
    fix: "Primary actions ≥ 40–44px tall. Icon-only buttons need aria-labels and adequate padding.",
  },
  {
    id: "missing_states",
    label: "Missing states",
    description: "Empty, loading, error, and success states are handled when the plan requires them.",
    fix: "Add the missing state or explicitly mark it out of scope in the next plan revision.",
  },
  {
    id: "one_job",
    label: "One job per section",
    description: "This stage has one purpose, one headline, and usually one short supporting sentence.",
    fix: "Split competing jobs into separate sections. Cut secondary marketing from this stage.",
  },
];

export const REQUIRED_DEFECT_IDS = DEFECT_HUNT_LIST.map((d) => d.id);

export function formatDefectChecklistForAgent(): string {
  return DEFECT_HUNT_LIST.map(
    (d) => `- \`${d.id}\`: ${d.label} — ${d.description}`
  ).join("\n");
}
