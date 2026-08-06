/**
 * Whole-deliverable audit before the agent claims done.
 * Checks plan coverage, states, contract honor, and living slop catalog.
 * Finishing commands: distill | quieter | bolder
 */

import { getSlopCatalog } from "../knowledge/loader.js";
import { remainingStages } from "./review-engine.js";
import { scanForSlop } from "./slop-signatures.js";
import type {
  BrandRules,
  DesignPlan,
  ReviewFinding,
  StageReview,
} from "../session/types.js";

export type FinishCommand = "distill" | "quieter" | "bolder" | "none";

export interface FinalCheckInput {
  plan: DesignPlan;
  brand: BrandRules;
  reviewedStages: string[];
  stageReviews: StageReview[];
  /** Optional concatenated artifact / summaries for slop scan */
  deliverableText?: string;
  finishCommand?: FinishCommand;
}

export interface FinalCheckResult {
  passed: boolean;
  findings: ReviewFinding[];
  coverage: {
    planned: string[];
    reviewed: string[];
    missing: string[];
  };
  finishGuidance: string[];
  slopMonth: string;
}

const FINISH_COPY: Record<Exclude<FinishCommand, "none">, string[]> = {
  distill: [
    "Cut every element that does not earn its place in the approved plan.",
    "Collapse competing CTAs to one primary per viewport.",
    "Shorten headlines; delete decorative chrome (extra cards, glows, pill clusters).",
  ],
  quieter: [
    "Reduce accent usage — accent for primary actions only.",
    "Lower visual volume: fewer borders, lighter type contrast on meta, more whitespace between groups.",
    "Remove motion that does not create hierarchy.",
  ],
  bolder: [
    "Amplify the brand signal in the first viewport (name/mark scale).",
    "Push type contrast on the single headline; keep body calm.",
    "Commit harder to the layout principle — exaggerate the intentional asymmetry or full-bleed, don't hedge.",
  ],
};

export function runFinalCheck(input: FinalCheckInput): FinalCheckResult {
  const findings: ReviewFinding[] = [];
  const missing = remainingStages(input.plan, input.reviewedStages);

  if (missing.length > 0) {
    findings.push({
      kind: "drift",
      severity: "blocker",
      message: `Planned stages not reviewed: ${missing.map((m) => `"${m}"`).join(", ")}.`,
      fix: "Build and review each missing stage before final_check can pass.",
    });
  }

  // Failed last reviews on any stage
  const failed = input.stageReviews.filter((r) => !r.passed);
  const latestByStage = new Map<string, StageReview>();
  for (const r of input.stageReviews) {
    latestByStage.set(r.stageId, r);
  }
  for (const [stageId, r] of latestByStage) {
    if (!r.passed) {
      findings.push({
        kind: "defect",
        severity: "blocker",
        message: `Latest review for "${stageId}" still has blockers.`,
        fix: "Re-fix and call review until passed.",
      });
    }
  }
  void failed;

  // Contract honor — density / principle mentioned across reviews
  const allText = [
    input.deliverableText ?? "",
    ...input.stageReviews.map((r) =>
      r.findings.map((f) => f.message).join(" ")
    ),
    ...input.reviewedStages,
    JSON.stringify(input.plan),
  ].join("\n");

  if (input.plan.screens.length > 0 && input.reviewedStages.length === 0) {
    findings.push({
      kind: "drift",
      severity: "blocker",
      message: "No stages reviewed. The contract requires review after every stage.",
      fix: "Walk build → review for each planned screen.",
    });
  }

  // Brand bans
  for (const ban of input.brand.bans ?? []) {
    if (ban && (input.deliverableText ?? "").toLowerCase().includes(ban.toLowerCase())) {
      findings.push({
        kind: "drift",
        severity: "blocker",
        message: `Brand ban present in deliverable: "${ban}".`,
        fix: "Remove before shipping.",
      });
    }
  }

  // Living slop catalog (Factory monthly) + built-in heuristics
  const catalog = getSlopCatalog();
  const builtinHits = scanForSlop(input.deliverableText ?? "");
  for (const hit of builtinHits) {
    findings.push({
      kind: "slop",
      severity: hit.signature.severity,
      message: `[builtin] ${hit.signature.name}: matched "${hit.matched}". ${hit.signature.why}`,
      fix: hit.signature.fix,
    });
  }

  const text = (input.deliverableText ?? "").toLowerCase();
  for (const sig of catalog.signatures) {
    for (const pat of sig.patterns) {
      try {
        const re = new RegExp(pat, "i");
        if (re.test(text) || text.includes(pat.toLowerCase())) {
          findings.push({
            kind: "slop",
            severity: sig.severity,
            message: `[${catalog.month}] ${sig.name}. ${sig.why}`,
            fix: sig.fix,
          });
          break;
        }
      } catch {
        if (text.includes(pat.toLowerCase())) {
          findings.push({
            kind: "slop",
            severity: sig.severity,
            message: `[${catalog.month}] ${sig.name}. ${sig.why}`,
            fix: sig.fix,
          });
          break;
        }
      }
    }
  }

  // Forgotten states hint from plan notes
  const planBlob = JSON.stringify(input.plan).toLowerCase();
  if (
    /onboard|checkout|form|wizard/.test(planBlob) &&
    !/error|fail|invalid/.test(planBlob + text)
  ) {
    findings.push({
      kind: "defect",
      severity: "warning",
      message: "Flow-like plan without visible error/failure handling in final deliverable text.",
      fix: "Confirm error states exist or document explicit omission.",
    });
  }

  const cmd = input.finishCommand && input.finishCommand !== "none"
    ? input.finishCommand
    : null;

  const finishGuidance = cmd
    ? FINISH_COPY[cmd]
    : [
        "Optional finishing commands: distill (cut), quieter (reduce volume), bolder (amplify brand).",
        "Re-run final_check with finishCommand after applying one.",
      ];

  if (!findings.some((f) => f.severity === "blocker")) {
    findings.push({
      kind: "praise",
      severity: "info",
      message:
        "Deliverable clears blockers against the session contract. Apply a finishing command if you want a last-mile pass.",
    });
  }

  return {
    passed: !findings.some((f) => f.severity === "blocker"),
    findings,
    coverage: {
      planned: input.plan.screens,
      reviewed: [...input.reviewedStages],
      missing,
    },
    finishGuidance,
    slopMonth: catalog.month,
  };
}
