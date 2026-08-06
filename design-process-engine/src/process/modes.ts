/**
 * Mode classification + contracts.
 *
 * Adopted from Framer's public behavior: Create / Edit / Recreate.
 * Classification is the first gate — designing is not allowed until
 * the mode contract's prerequisites are acknowledged.
 */

import type { DesignMode, ModeContract } from "../session/types.js";

export const MODE_CONTRACTS: Record<DesignMode, ModeContract> = {
  create: {
    mode: "create",
    priority:
      "Intentional and distinctive. New work must have a clear point of view — not a generic template.",
    mustResolveBeforeDesign: [
      "Who is this for, and what single job does the first viewport do?",
      "What is the brand or product name signal at hero level (not just nav text)?",
      "Pick ONE layout principle and hold it across the deliverable.",
      "Define a constrained value vocabulary (colors, radii, spacing steps) before building.",
      "Decide density and type direction before choosing components.",
    ],
    forbidden: [
      "Starting to code UI before an approved plan exists.",
      "Purple-on-white / purple-to-indigo default AI themes unless brand requires it.",
      "Warm cream + terracotta + high-contrast serif default cluster unless brand requires it.",
      "Broadsheet dense newspaper layout unless the product is editorial.",
      "Stat strips, pill clusters, and secondary marketing in the first viewport of a landing page.",
      "Cards in the hero. Cards only when they contain a user interaction.",
      "Detached labels, floating badges, or promo stickers on hero media.",
    ],
    successLooksLike:
      "A first viewport that could not belong to another brand after removing the nav. One composition, one job, clear hierarchy.",
  },
  edit: {
    mode: "edit",
    priority:
      "Invisibility. Match how the project already does things. The best edit looks like it was always there.",
    mustResolveBeforeDesign: [
      "Study existing components, tokens, spacing, and type before proposing anything new.",
      "List what patterns the project already uses for similar UI (buttons, cards, forms, nav).",
      "Golden rule: anything present in the design system but unused in this change is banned — do not invent parallel patterns.",
      "Identify the smallest change that achieves the goal.",
      "Confirm you will import existing components rather than recreate them.",
    ],
    forbidden: [
      "Introducing a new visual language alongside the existing one.",
      "Raw hex colors when design tokens exist.",
      "Recreating buttons, inputs, cards, or nav from scratch.",
      "Adding a second font family, radius scale, or shadow language.",
      "Drive-by refactors of unrelated UI during the edit.",
    ],
    successLooksLike:
      "A teammate cannot tell which parts were AI-edited. Same components, same tokens, same rhythm.",
  },
  recreate: {
    mode: "recreate",
    priority:
      "Fidelity. Match the reference. Zero creative deviation unless the user explicitly allows it.",
    mustResolveBeforeDesign: [
      "Identify the reference (Figma node, screenshot, URL, or description) and what 'done' means.",
      "Inventory every section, state, and interaction visible in the reference.",
      "Note spacing, type sizes, and color roles from the reference — do not improvise.",
      "Flag any ambiguity in the reference before building (ask, don't invent).",
      "Decide mapping: pixel-faithful vs. design-system equivalent components.",
    ],
    forbidden: [
      "Improving or restyling the reference without permission.",
      "Skipping states that appear in the reference (empty, error, loading, hover).",
      "Substituting a 'cleaner' layout that changes hierarchy or content.",
      "Adding decorative elements not in the reference.",
    ],
    successLooksLike:
      "Side-by-side with the reference, structure and hierarchy match. Deviations are only those the user approved.",
  },
};

/**
 * Classify a task into Create / Edit / Recreate.
 * Prefer explicit mode from the agent; otherwise infer from keywords.
 */
export function classifyMode(
  task: string,
  context: string,
  explicitMode?: DesignMode
): DesignMode {
  if (explicitMode) return explicitMode;

  const text = `${task}\n${context}`.toLowerCase();

  const recreateSignals = [
    "recreate",
    "match this",
    "pixel perfect",
    "pixel-perfect",
    "from figma",
    "figma link",
    "from the screenshot",
    "match the reference",
    "clone this",
    "replicate",
  ];
  if (recreateSignals.some((s) => text.includes(s))) return "recreate";

  const editSignals = [
    "edit",
    "update",
    "fix",
    "change",
    "tweak",
    "adjust",
    "existing",
    "current page",
    "this component",
    "refactor the ui",
    "in the codebase",
    "match the design system",
  ];
  if (editSignals.some((s) => text.includes(s))) return "edit";

  return "create";
}

export function getModeContract(mode: DesignMode): ModeContract {
  return MODE_CONTRACTS[mode];
}
