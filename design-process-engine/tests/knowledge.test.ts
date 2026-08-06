import { describe, it, expect, beforeEach } from "vitest";
import {
  getPlaybook,
  getPatternGuide,
  listPlaybooks,
  listPatterns,
  matchPlaybook,
  getSlopCatalog,
  getIndex,
} from "../src/knowledge/loader.js";
import { canAccessKnowledge, resolveAccess } from "../src/tier/access.js";
import { runFinalCheck } from "../src/process/final-check.js";
import {
  approvePlan,
  getSession,
  markFinalCheck,
  recordReview,
  resetSession,
  setPlaybookId,
  startSession,
} from "../src/session/store.js";
import { getModeContract } from "../src/process/modes.js";
import type { DesignPlan } from "../src/session/types.js";

describe("knowledge library", () => {
  it("has 10 playbooks and 100 patterns", () => {
    const index = getIndex();
    expect(index.playbooks).toHaveLength(10);
    expect(index.patterns).toHaveLength(100);
    expect(listPlaybooks()).toHaveLength(10);
    expect(listPatterns()).toHaveLength(100);
  });

  it("loads fintech-onboarding playbook with strategies", () => {
    const pb = getPlaybook("fintech-onboarding");
    expect(pb).not.toBeNull();
    expect(pb!.strategies.length).toBeGreaterThanOrEqual(2);
    expect(pb!.structure.length).toBeGreaterThanOrEqual(3);
    expect(pb!.tier).toBe("free");
  });

  it("loads nav-drawer pattern guide", () => {
    const g = getPatternGuide("nav-drawer");
    expect(g).not.toBeNull();
    expect(g!.requiredStates.length).toBeGreaterThan(0);
    expect(g!.mistakes.length).toBeGreaterThan(0);
    expect(g!.codeExample.length).toBeGreaterThan(10);
  });

  it("matches playbook from task text", () => {
    const pb = matchPlaybook("Build fintech KYC onboarding wallet signup", "");
    expect(pb?.id).toBe("fintech-onboarding");
  });

  it("has monthly slop catalog", () => {
    const slop = getSlopCatalog();
    expect(slop.month).toMatch(/^\d{4}-\d{2}$/);
    expect(slop.signatures.length).toBeGreaterThanOrEqual(8);
  });
});

describe("tier access", () => {
  it("defaults to free", () => {
    const prev = process.env.DESIGN_ENGINE_TIER;
    const prevKey = process.env.DESIGN_ENGINE_API_KEY;
    delete process.env.DESIGN_ENGINE_TIER;
    delete process.env.DESIGN_ENGINE_API_KEY;
    expect(resolveAccess().tier).toBe("free");
    if (prev) process.env.DESIGN_ENGINE_TIER = prev;
    if (prevKey) process.env.DESIGN_ENGINE_API_KEY = prevKey;
  });

  it("unlocks pro via key prefix", () => {
    expect(resolveAccess("dpe_pro_test").tier).toBe("pro");
    expect(canAccessKnowledge("pro", { tier: "pro", reason: "" })).toBe(true);
    expect(canAccessKnowledge("pro", { tier: "free", reason: "" })).toBe(false);
  });
});

describe("final_check", () => {
  const plan: DesignPlan = {
    layoutPrinciple: "single column vertical rhythm",
    screens: ["Hero", "Details"],
    paletteStrategy: "dark + lime accent",
    density: "comfortable",
    typeDirection: "Syne display + Plex body",
    valueVocabulary: ["--bg", "--accent", "gap-6"],
  };

  it("blocks when stages missing", () => {
    const result = runFinalCheck({
      plan,
      brand: {},
      reviewedStages: ["Hero"],
      stageReviews: [
        {
          stageId: "Hero",
          submittedAt: new Date().toISOString(),
          passed: true,
          findings: [],
        },
      ],
    });
    expect(result.passed).toBe(false);
    expect(result.coverage.missing).toContain("Details");
  });

  it("passes when all stages reviewed clean", () => {
    const result = runFinalCheck({
      plan,
      brand: {},
      reviewedStages: ["Hero", "Details"],
      stageReviews: [
        {
          stageId: "Hero",
          submittedAt: new Date().toISOString(),
          passed: true,
          findings: [],
        },
        {
          stageId: "Details",
          submittedAt: new Date().toISOString(),
          passed: true,
          findings: [],
        },
      ],
      deliverableText: "Hero with brand name and Details section using --accent",
      finishCommand: "distill",
    });
    expect(result.passed).toBe(true);
    expect(result.finishGuidance.length).toBeGreaterThan(0);
  });
});

describe("full session wiring", () => {
  beforeEach(() => resetSession());

  it("tracks playbook and final check on session", () => {
    const mode = "create" as const;
    startSession({
      task: "fintech onboarding",
      context: "",
      mode,
      modeContract: getModeContract(mode),
      tier: "pro",
    });
    setPlaybookId("fintech-onboarding");
    approvePlan({
      layoutPrinciple: "stepper with one job per screen",
      screens: ["Phone", "OTP"],
      paletteStrategy: "bank blue",
      density: "comfortable",
      typeDirection: "system brand sans",
      valueVocabulary: ["a", "b", "c"],
    });
    recordReview({
      stageId: "Phone",
      submittedAt: new Date().toISOString(),
      passed: true,
      findings: [],
    });
    recordReview({
      stageId: "OTP",
      submittedAt: new Date().toISOString(),
      passed: true,
      findings: [],
    });
    markFinalCheck(true);
    const s = getSession()!;
    expect(s.playbookId).toBe("fintech-onboarding");
    expect(s.finalCheckPassed).toBe(true);
    expect(s.phase).toBe("complete");
  });
});
