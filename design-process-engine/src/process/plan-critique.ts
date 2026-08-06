/**
 * Critiques a submitted design plan against the mode contract
 * and process rules. Approval turns the plan into the session contract.
 */

import type {
  BrandRules,
  DesignMode,
  DesignPlan,
  ModeContract,
  PlanCritiqueIssue,
} from "../session/types.js";

const DENSITY_OK = new Set([
  "sparse",
  "comfortable",
  "dense",
  "information-rich",
  "information rich",
]);

export function critiquePlan(
  plan: DesignPlan,
  mode: DesignMode,
  contract: ModeContract,
  brand: BrandRules
): PlanCritiqueIssue[] {
  const issues: PlanCritiqueIssue[] = [];

  // Layout principle
  if (!plan.layoutPrinciple || plan.layoutPrinciple.trim().length < 8) {
    issues.push({
      severity: "blocker",
      message:
        "Pick one layout principle and hold it (e.g. 'single full-bleed hero composition', 'strict 12-column dashboard', 'editorial vertical rhythm').",
    });
  } else if (
    /and|&|;|,/.test(plan.layoutPrinciple) &&
    plan.layoutPrinciple.split(/and|&/).length > 2
  ) {
    issues.push({
      severity: "warning",
      message:
        "That looks like multiple layout principles. Pick one primary principle; secondary rhythm can live in notes.",
    });
  }

  // Screens / sections
  if (!plan.screens || plan.screens.length === 0) {
    issues.push({
      severity: "blocker",
      message: "List the screens or sections you will build, in order.",
    });
  } else {
    if (plan.screens.length === 1 && mode === "create") {
      const only = plan.screens[0].toLowerCase();
      if (!/landing|hero|single|page|screen/.test(only)) {
        issues.push({
          severity: "suggestion",
          message:
            "Only one section listed. Confirm empty/error/loading states are either in-scope as sub-states or explicitly out of scope in notes.",
        });
      }
    }
    const joined = plan.screens.join(" ").toLowerCase();
    // Common forgotten states for multi-step / form flows
    if (
      /onboard|signup|sign-up|checkout|paywall|form|wizard|multi-?step/.test(
        joined
      )
    ) {
      const hasFailure = /fail|error|invalid|denied/.test(joined);
      const hasEmpty = /empty|zero|no results/.test(joined);
      if (!hasFailure) {
        issues.push({
          severity: "warning",
          message:
            "Flow looks multi-step/form-like but no verification-failure or error screen/state is listed. Add it or justify omission in notes.",
        });
      }
      if (!hasEmpty && /list|inbox|dashboard|library/.test(joined)) {
        issues.push({
          severity: "suggestion",
          message: "Consider an empty state for list/dashboard surfaces.",
        });
      }
    }
  }

  // Palette
  if (!plan.paletteStrategy || plan.paletteStrategy.trim().length < 8) {
    issues.push({
      severity: "blocker",
      message:
        "Describe palette strategy (e.g. 'dark cool canvas + mint accent tokens only' or 'brand navy + single coral CTA').",
    });
  } else {
    const p = plan.paletteStrategy.toLowerCase();
    if (/purple|violet|indigo/.test(p) && !brand.palette?.some((c) => /purple|violet|indigo/i.test(c))) {
      issues.push({
        severity: "warning",
        message:
          "Purple/indigo palette without brand requiring it is a known AI-slop signature. Confirm this is intentional brand color.",
      });
    }
  }

  // Density
  if (!plan.density || !DENSITY_OK.has(plan.density.trim().toLowerCase())) {
    issues.push({
      severity: "blocker",
      message:
        "Density must be one of: sparse | comfortable | dense | information-rich.",
    });
  }

  // Type
  if (!plan.typeDirection || plan.typeDirection.trim().length < 8) {
    issues.push({
      severity: "blocker",
      message:
        "State type direction (e.g. 'Oxanium only; semibold headlines, regular body, medium UI labels').",
    });
  } else if (/inter|roboto|arial|system/i.test(plan.typeDirection)) {
    issues.push({
      severity: "warning",
      message:
        "Default/system fonts erase brand. Prefer a purposeful family from the brand or project.",
    });
  }

  // Value vocabulary
  if (!plan.valueVocabulary || plan.valueVocabulary.length < 3) {
    issues.push({
      severity: "blocker",
      message:
        "Constrained value vocabulary needs at least 3 committed values (e.g. spacing steps, radii, accent token names).",
    });
  }

  // Mode-specific
  if (mode === "edit") {
    const hay = JSON.stringify(plan).toLowerCase();
    if (!/exist|current|token|component|match|system|already/.test(hay)) {
      issues.push({
        severity: "blocker",
        message:
          "Edit mode: the plan must show you studied how the project already does it (name existing components/tokens you will reuse).",
      });
    }
  }

  if (mode === "recreate") {
    const hay = JSON.stringify(plan).toLowerCase();
    if (!/reference|figma|screenshot|fidelity|match/.test(hay)) {
      issues.push({
        severity: "blocker",
        message:
          "Recreate mode: the plan must name the reference and commit to fidelity (what maps 1:1 vs design-system equivalents).",
      });
    }
  }

  if (mode === "create") {
    const hay = `${plan.layoutPrinciple} ${plan.notes ?? ""}`.toLowerCase();
    if (/saas hero|generic landing|template/.test(hay)) {
      issues.push({
        severity: "warning",
        message:
          "Sounds like a generic SaaS hero on a non-SaaS surface (or a template mindset). Name a distinctive composition for THIS product.",
      });
    }
  }

  // Brand bans
  if (brand.bans?.length) {
    const hay = JSON.stringify(plan).toLowerCase();
    for (const ban of brand.bans) {
      if (ban && hay.includes(ban.toLowerCase())) {
        issues.push({
          severity: "blocker",
          message: `Brand ban violated in plan: "${ban}".`,
        });
      }
    }
  }

  // Contract reminder as suggestion when notes empty in create
  if (mode === "create" && (!plan.notes || plan.notes.length < 10)) {
    issues.push({
      severity: "suggestion",
      message: `Mode priority: ${contract.priority} Confirm the first viewport brand test in notes.`,
    });
  }

  return issues;
}

export function planIsApprovable(issues: PlanCritiqueIssue[]): boolean {
  return !issues.some((i) => i.severity === "blocker");
}
