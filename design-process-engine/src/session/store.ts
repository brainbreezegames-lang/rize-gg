/**
 * In-memory session store.
 * One active session per MCP server process (typical local stdio connector).
 * Statefulness is the moat — .md files cannot hold the agent to a contract.
 */

import { randomUUID } from "node:crypto";
import type {
  BrandRules,
  DesignPlan,
  DesignSession,
  ModeContract,
  PlanCritiqueIssue,
  StageReview,
} from "./types.js";
import type { AccessTier } from "../tier/access.js";

let active: DesignSession | null = null;

export function getSession(): DesignSession | null {
  return active;
}

export function requireSession(): DesignSession {
  if (!active) {
    throw new SessionError(
      "No active design session. Call start_task first.",
      "no_session"
    );
  }
  return active;
}

export function startSession(input: {
  task: string;
  context: string;
  mode: DesignSession["mode"];
  modeContract: ModeContract;
  brandRules?: BrandRules;
  tier?: AccessTier;
}): DesignSession {
  const now = new Date().toISOString();
  active = {
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
    phase: "classified",
    task: input.task,
    context: input.context,
    mode: input.mode,
    modeContract: input.modeContract,
    brandRules: input.brandRules ?? {},
    pendingPlan: null,
    approvedPlan: null,
    lastPlanCritique: [],
    reviewedStages: [],
    stageReviews: [],
    playbookId: null,
    patternGuideIds: [],
    finalCheckPassed: false,
    tier: input.tier ?? "free",
    skipConfig: { allowSkipPlaybook: true },
  };
  return active;
}

export function setBrandRules(rules: BrandRules): DesignSession {
  const s = requireSession();
  s.brandRules = { ...s.brandRules, ...rules };
  s.updatedAt = new Date().toISOString();
  return s;
}

export function setPlaybookId(id: string): DesignSession {
  const s = requireSession();
  s.playbookId = id;
  s.phase = s.phase === "classified" ? "planning" : s.phase;
  s.updatedAt = new Date().toISOString();
  return s;
}

export function recordPatternGuide(id: string): DesignSession {
  const s = requireSession();
  if (!s.patternGuideIds.includes(id)) s.patternGuideIds.push(id);
  s.updatedAt = new Date().toISOString();
  return s;
}

export function setPendingPlan(
  plan: DesignPlan,
  critique: PlanCritiqueIssue[]
): DesignSession {
  const s = requireSession();
  if (s.phase === "idle") {
    throw new SessionError("Session not classified.", "bad_phase");
  }
  s.pendingPlan = plan;
  s.lastPlanCritique = critique;
  s.phase = "planning";
  s.updatedAt = new Date().toISOString();
  return s;
}

export function approvePlan(plan: DesignPlan): DesignSession {
  const s = requireSession();
  s.approvedPlan = plan;
  s.pendingPlan = plan;
  s.phase = "plan_approved";
  s.reviewedStages = [];
  s.stageReviews = [];
  s.finalCheckPassed = false;
  s.updatedAt = new Date().toISOString();
  return s;
}

export function recordReview(review: StageReview): DesignSession {
  const s = requireSession();
  if (!s.approvedPlan) {
    throw new SessionError(
      "No approved plan. Call submit_plan and get approval before review.",
      "no_plan"
    );
  }
  s.phase = "reviewing";
  s.stageReviews.push(review);
  if (review.passed) {
    const key = review.stageId;
    if (!s.reviewedStages.includes(key)) {
      s.reviewedStages.push(key);
    }
    s.phase = "building";
  }
  s.updatedAt = new Date().toISOString();
  return s;
}

export function markFinalCheck(passed: boolean): DesignSession {
  const s = requireSession();
  s.finalCheckPassed = passed;
  if (passed) s.phase = "complete";
  s.updatedAt = new Date().toISOString();
  return s;
}

export function resetSession(): void {
  active = null;
}

export class SessionError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = "SessionError";
  }
}
