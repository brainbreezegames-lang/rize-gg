/**
 * Session types for the Design Process Engine.
 *
 * The server is STATEFUL: once a plan is approved, it becomes the contract
 * for the rest of the session. Later tools refuse to run without earlier ones.
 */

export type DesignMode = "create" | "edit" | "recreate";

export type SessionPhase =
  | "idle"
  | "classified"
  | "planning"
  | "plan_approved"
  | "building"
  | "reviewing";

/** What must be true before designing is allowed, per mode. */
export interface ModeContract {
  mode: DesignMode;
  priority: string;
  mustResolveBeforeDesign: string[];
  forbidden: string[];
  successLooksLike: string;
}

export interface BrandRules {
  productName?: string;
  /** Short brand voice / personality */
  voice?: string;
  /** Hex or token names the agent must prefer */
  palette?: string[];
  /** Fonts / type direction the brand requires */
  typography?: string[];
  /** Hard bans (e.g. "no purple gradients", "no Inter") */
  bans?: string[];
  /** Freeform extra rules merged into every contract */
  extra?: string[];
}

export interface DesignPlan {
  /** One layout principle the whole deliverable holds to */
  layoutPrinciple: string;
  /** Ordered list of screens or sections to build */
  screens: string[];
  /** Palette strategy in constrained vocabulary */
  paletteStrategy: string;
  /** Density: sparse | comfortable | dense | information-rich */
  density: string;
  /** Type direction (expressive display + quiet body, etc.) */
  typeDirection: string;
  /** Constrained value vocabulary the agent commits to */
  valueVocabulary: string[];
  /** Optional notes / rationale */
  notes?: string;
}

export interface PlanCritiqueIssue {
  severity: "blocker" | "warning" | "suggestion";
  message: string;
}

export interface ReviewSubmission {
  /** Which planned screen/section this review covers */
  stageId: string;
  /** What the agent built in this stage */
  summary: string;
  /** Optional code or markup snippet for heuristic checks */
  artifactSnippet?: string;
  /**
   * Agent self-report against the defect hunt list.
   * Keys are defect ids; true means "I checked and it's clean".
   */
  defectChecks: Record<string, boolean>;
  /** Freeform notes about intentional deviations (usually none) */
  notes?: string;
}

export interface ReviewFinding {
  kind: "defect" | "drift" | "slop" | "praise";
  severity: "blocker" | "warning" | "suggestion" | "info";
  message: string;
  fix?: string;
}

export interface StageReview {
  stageId: string;
  submittedAt: string;
  passed: boolean;
  findings: ReviewFinding[];
}

export interface DesignSession {
  id: string;
  createdAt: string;
  updatedAt: string;
  phase: SessionPhase;
  /** Original task description from the agent */
  task: string;
  /** Extra context (framework, existing product notes, reference) */
  context: string;
  mode: DesignMode | null;
  modeContract: ModeContract | null;
  brandRules: BrandRules;
  /** Plan drafts before approval */
  pendingPlan: DesignPlan | null;
  /** Approved plan = contract for the rest of the session */
  approvedPlan: DesignPlan | null;
  lastPlanCritique: PlanCritiqueIssue[];
  /** Stages that have passed review */
  reviewedStages: string[];
  stageReviews: StageReview[];
  /** Tiny tasks may skip some steps when configured */
  skipConfig: {
    allowSkipPlaybook: boolean;
  };
}
