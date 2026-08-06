import { describe, it, expect, beforeEach } from "vitest";
import { classifyMode, getModeContract } from "../src/process/modes.js";
import { critiquePlan, planIsApprovable } from "../src/process/plan-critique.js";
import { reviewStage, remainingStages } from "../src/process/review-engine.js";
import { scanForSlop } from "../src/process/slop-signatures.js";
import {
  approvePlan,
  getSession,
  recordReview,
  resetSession,
  startSession,
  setPendingPlan,
} from "../src/session/store.js";
import type { DesignPlan } from "../src/session/types.js";

const cleanChecks = {
  clipped_text: true,
  overlapping: true,
  grid_misalignment: true,
  same_role_sizes: true,
  escaping_containers: true,
  spacing_violations: true,
  contrast: true,
  hit_targets: true,
  missing_states: true,
  one_job: true,
};

function goodCreatePlan(): DesignPlan {
  return {
    layoutPrinciple: "single full-bleed hero composition with vertical rhythm below",
    screens: ["Hero", "Product story", "CTA close"],
    paletteStrategy: "dark cool canvas with mint accent tokens only",
    density: "comfortable",
    typeDirection: "Oxanium only; semibold headlines, regular body",
    valueVocabulary: ["bg-bg-primary", "bg-accent", "gap-6", "rounded-[var(--radius-lg)]"],
    notes: "Brand test: product name is the hero signal. No stats in first viewport.",
  };
}

describe("classifyMode", () => {
  it("honors explicit mode", () => {
    expect(classifyMode("make a landing page", "", "edit")).toBe("edit");
  });

  it("detects recreate from figma language", () => {
    expect(classifyMode("Recreate this from the Figma link", "", undefined)).toBe(
      "recreate"
    );
  });

  it("detects edit from existing-product language", () => {
    expect(
      classifyMode("Update the existing settings page in the codebase", "", undefined)
    ).toBe("edit");
  });

  it("defaults to create", () => {
    expect(classifyMode("Build a new portfolio landing page", "", undefined)).toBe(
      "create"
    );
  });
});

describe("critiquePlan", () => {
  it("blocks thin plans", () => {
    const mode = "create" as const;
    const issues = critiquePlan(
      {
        layoutPrinciple: "x",
        screens: [],
        paletteStrategy: "x",
        density: "weird",
        typeDirection: "x",
        valueVocabulary: ["a"],
      },
      mode,
      getModeContract(mode),
      {}
    );
    expect(planIsApprovable(issues)).toBe(false);
    expect(issues.some((i) => i.severity === "blocker")).toBe(true);
  });

  it("approves a solid create plan", () => {
    const mode = "create" as const;
    const issues = critiquePlan(
      goodCreatePlan(),
      mode,
      getModeContract(mode),
      {}
    );
    expect(planIsApprovable(issues)).toBe(true);
  });

  it("requires existing-system language in edit mode", () => {
    const mode = "edit" as const;
    const plan: DesignPlan = {
      layoutPrinciple: "keep the page shell and swap the hero copy block",
      screens: ["Hero copy tweak"],
      paletteStrategy: "whatever looks fresh and bold",
      density: "comfortable",
      typeDirection: "something expressive and new",
      valueVocabulary: ["big-padding", "loud-accent", "novel-radius"],
      notes: "totally new look, ignore the old UI",
    };
    const issues = critiquePlan(plan, mode, getModeContract(mode), {});
    expect(planIsApprovable(issues)).toBe(false);
  });
});

describe("slop signatures", () => {
  it("flags purple gradient defaults", () => {
    const hits = scanForSlop("bg-gradient-to-r from-purple-500 to-indigo-500");
    expect(hits.some((h) => h.signature.id === "purple-gradient-default")).toBe(
      true
    );
  });

  it("flags generic SaaS headlines", () => {
    const hits = scanForSlop("Unlock your potential with our seamless experience");
    expect(hits.length).toBeGreaterThan(0);
  });
});

describe("reviewStage", () => {
  const plan = goodCreatePlan();

  it("blocks incomplete defect checklist", () => {
    const { passed, findings } = reviewStage(
      {
        stageId: "Hero",
        summary: "Built a full-bleed hero holding the layout principle with brand name dominant.",
        defectChecks: { clipped_text: true },
      },
      plan,
      {},
      []
    );
    expect(passed).toBe(false);
    expect(findings.some((f) => f.message.includes("Incomplete defect"))).toBe(
      true
    );
  });

  it("blocks stage not on the plan", () => {
    const { passed } = reviewStage(
      {
        stageId: "Pricing table extravaganza",
        summary:
          "Built pricing with layout principle mentioned somehow for density comfortable.",
        defectChecks: cleanChecks,
      },
      plan,
      {},
      []
    );
    expect(passed).toBe(false);
  });

  it("passes a clean on-plan stage", () => {
    const { passed, findings } = reviewStage(
      {
        stageId: "Hero",
        summary:
          "Full-bleed hero composition with product name as hero signal, one headline, one CTA. Holds the single full-bleed hero layout principle. Uses bg-bg-primary and bg-accent.",
        artifactSnippet: '<div className="bg-bg-primary"><Button className="bg-accent">Join</Button></div>',
        defectChecks: cleanChecks,
      },
      plan,
      {},
      []
    );
    expect(passed).toBe(true);
    expect(findings.some((f) => f.kind === "praise")).toBe(true);
  });

  it("flags admitted defects", () => {
    const { passed, findings } = reviewStage(
      {
        stageId: "Hero",
        summary:
          "Hero built with full-bleed layout principle but text is clipped on mobile.",
        defectChecks: { ...cleanChecks, clipped_text: false },
      },
      plan,
      {},
      []
    );
    expect(passed).toBe(false);
    expect(findings.some((f) => f.message.includes("Clipped"))).toBe(true);
  });
});

describe("session store pipeline", () => {
  beforeEach(() => resetSession());

  it("enforces start → plan → review order", () => {
    expect(getSession()).toBeNull();

    const mode = "create" as const;
    const session = startSession({
      task: "New landing page",
      context: "Next.js",
      mode,
      modeContract: getModeContract(mode),
    });
    expect(session.phase).toBe("classified");

    const plan = goodCreatePlan();
    const critique = critiquePlan(plan, mode, getModeContract(mode), {});
    setPendingPlan(plan, critique);
    approvePlan(plan);
    expect(getSession()?.phase).toBe("plan_approved");

    const { passed, findings } = reviewStage(
      {
        stageId: "Hero",
        summary:
          "Full-bleed hero composition with brand-first signal holding the layout principle.",
        defectChecks: cleanChecks,
      },
      plan,
      {},
      []
    );
    expect(passed).toBe(true);

    recordReview({
      stageId: "Hero",
      submittedAt: new Date().toISOString(),
      passed,
      findings,
    });

    const remaining = remainingStages(plan, getSession()!.reviewedStages);
    expect(remaining).toEqual(["Product story", "CTA close"]);
  });
});
