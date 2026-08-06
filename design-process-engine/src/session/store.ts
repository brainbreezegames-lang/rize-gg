/**
 * Stateful design-session store.
 * Each MCP connection (stdio process or HTTP session) gets its own store.
 * That statefulness is the moat — .md files cannot hold the agent to a contract.
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

export class SessionStore {
  private active: DesignSession | null = null;

  getSession(): DesignSession | null {
    return this.active;
  }

  requireSession(): DesignSession {
    if (!this.active) {
      throw new SessionError(
        "No active design session. Call start_task first.",
        "no_session"
      );
    }
    return this.active;
  }

  startSession(input: {
    task: string;
    context: string;
    mode: DesignSession["mode"];
    modeContract: ModeContract;
    brandRules?: BrandRules;
    tier?: AccessTier;
  }): DesignSession {
    const now = new Date().toISOString();
    this.active = {
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
    return this.active;
  }

  setBrandRules(rules: BrandRules): DesignSession {
    const s = this.requireSession();
    s.brandRules = { ...s.brandRules, ...rules };
    s.updatedAt = new Date().toISOString();
    return s;
  }

  setPlaybookId(id: string): DesignSession {
    const s = this.requireSession();
    s.playbookId = id;
    s.phase = s.phase === "classified" ? "planning" : s.phase;
    s.updatedAt = new Date().toISOString();
    return s;
  }

  recordPatternGuide(id: string): DesignSession {
    const s = this.requireSession();
    if (!s.patternGuideIds.includes(id)) s.patternGuideIds.push(id);
    s.updatedAt = new Date().toISOString();
    return s;
  }

  setPendingPlan(plan: DesignPlan, critique: PlanCritiqueIssue[]): DesignSession {
    const s = this.requireSession();
    if (s.phase === "idle") {
      throw new SessionError("Session not classified.", "bad_phase");
    }
    s.pendingPlan = plan;
    s.lastPlanCritique = critique;
    s.phase = "planning";
    s.updatedAt = new Date().toISOString();
    return s;
  }

  approvePlan(plan: DesignPlan): DesignSession {
    const s = this.requireSession();
    s.approvedPlan = plan;
    s.pendingPlan = plan;
    s.phase = "plan_approved";
    s.reviewedStages = [];
    s.stageReviews = [];
    s.finalCheckPassed = false;
    s.updatedAt = new Date().toISOString();
    return s;
  }

  recordReview(review: StageReview): DesignSession {
    const s = this.requireSession();
    if (!s.approvedPlan) {
      throw new SessionError(
        "No approved plan. Call submit_plan and get approval before review.",
        "no_plan"
      );
    }
    s.phase = "reviewing";
    s.stageReviews.push(review);
    if (review.passed) {
      if (!s.reviewedStages.includes(review.stageId)) {
        s.reviewedStages.push(review.stageId);
      }
      s.phase = "building";
    }
    s.updatedAt = new Date().toISOString();
    return s;
  }

  markFinalCheck(passed: boolean): DesignSession {
    const s = this.requireSession();
    s.finalCheckPassed = passed;
    if (passed) s.phase = "complete";
    s.updatedAt = new Date().toISOString();
    return s;
  }

  resetSession(): void {
    this.active = null;
  }
}

/** Default store for stdio / unit tests */
export const defaultStore = new SessionStore();

export const getSession = () => defaultStore.getSession();
export const requireSession = () => defaultStore.requireSession();
export const startSession = (...args: Parameters<SessionStore["startSession"]>) =>
  defaultStore.startSession(...args);
export const setBrandRules = (...args: Parameters<SessionStore["setBrandRules"]>) =>
  defaultStore.setBrandRules(...args);
export const setPlaybookId = (...args: Parameters<SessionStore["setPlaybookId"]>) =>
  defaultStore.setPlaybookId(...args);
export const recordPatternGuide = (
  ...args: Parameters<SessionStore["recordPatternGuide"]>
) => defaultStore.recordPatternGuide(...args);
export const setPendingPlan = (...args: Parameters<SessionStore["setPendingPlan"]>) =>
  defaultStore.setPendingPlan(...args);
export const approvePlan = (...args: Parameters<SessionStore["approvePlan"]>) =>
  defaultStore.approvePlan(...args);
export const recordReview = (...args: Parameters<SessionStore["recordReview"]>) =>
  defaultStore.recordReview(...args);
export const markFinalCheck = (...args: Parameters<SessionStore["markFinalCheck"]>) =>
  defaultStore.markFinalCheck(...args);
export const resetSession = () => defaultStore.resetSession();

export class SessionError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = "SessionError";
  }
}
