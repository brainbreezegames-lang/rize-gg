/**
 * Stage review: defects + drift + slop signatures.
 * Phase 1 is heuristic + structured self-report (no vision model yet).
 * The companion skill still requires a screenshot + honest defectChecks.
 */

import { DEFECT_HUNT_LIST, REQUIRED_DEFECT_IDS } from "./review-defects.js";
import { scanForSlop } from "./slop-signatures.js";
import type {
  BrandRules,
  DesignPlan,
  ReviewFinding,
  ReviewSubmission,
} from "../session/types.js";

function normalizeStageKey(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function stageMatchesPlan(stageId: string, plan: DesignPlan): boolean {
  const key = normalizeStageKey(stageId);
  return plan.screens.some((screen) => {
    const sk = normalizeStageKey(screen);
    return sk === key || sk.includes(key) || key.includes(sk);
  });
}

export function reviewStage(
  submission: ReviewSubmission,
  plan: DesignPlan,
  brand: BrandRules,
  alreadyReviewed: string[]
): { passed: boolean; findings: ReviewFinding[] } {
  const findings: ReviewFinding[] = [];
  const artifact = [
    submission.summary,
    submission.artifactSnippet ?? "",
    submission.notes ?? "",
  ].join("\n");

  // --- Drift: stage must be on the plan ---
  if (!stageMatchesPlan(submission.stageId, plan)) {
    findings.push({
      kind: "drift",
      severity: "blocker",
      message: `Stage "${submission.stageId}" is not on the approved plan.`,
      fix: `Approved screens/sections: ${plan.screens.map((s) => `"${s}"`).join(", ")}. Rename this stage to match, or revise the plan (not supported mid-build in Phase 1 — finish or restart with start_task).`,
    });
  }

  if (alreadyReviewed.some((s) => normalizeStageKey(s) === normalizeStageKey(submission.stageId))) {
    findings.push({
      kind: "drift",
      severity: "suggestion",
      message: `Stage "${submission.stageId}" was already reviewed. Re-review is fine if you changed it — treat findings as a fresh pass.`,
    });
  }

  // Summary quality
  if (!submission.summary || submission.summary.trim().length < 20) {
    findings.push({
      kind: "defect",
      severity: "blocker",
      message: "Review summary is too thin to judge drift or defects.",
      fix: "Describe what you built: structure, key components, density, and how it follows the layout principle.",
    });
  }

  // Drift vs layout principle / vocabulary
  const principleWords = plan.layoutPrinciple
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 4)
    .slice(0, 6);
  const summaryLower = submission.summary.toLowerCase();
  const principleMention =
    summaryLower.includes("layout") ||
    summaryLower.includes("principle") ||
    principleWords.some((w) => summaryLower.includes(w));
  if (!principleMention) {
    findings.push({
      kind: "drift",
      severity: "warning",
      message: `Summary does not show how this stage holds the layout principle: "${plan.layoutPrinciple}".`,
      fix: "State explicitly how this section follows the approved principle (or fix the UI so it does).",
    });
  }

  for (const token of plan.valueVocabulary.slice(0, 8)) {
    // Soft check: if snippet present and vocabulary looks like class/token names, prefer seeing them
    if (
      submission.artifactSnippet &&
      /^[a-zA-Z0-9_./#[\]%-]+$/.test(token) &&
      token.length > 2 &&
      !submission.artifactSnippet.includes(token) &&
      !summaryLower.includes(token.toLowerCase())
    ) {
      // only flag a couple to avoid noise
      if (findings.filter((f) => f.message.includes("vocabulary")).length < 2) {
        findings.push({
          kind: "drift",
          severity: "suggestion",
          message: `Approved vocabulary value "${token}" not visible in this stage's artifact/summary.`,
          fix: "Reuse the constrained vocabulary from the plan; do not invent parallel tokens.",
        });
      }
    }
  }

  // Brand bans
  for (const ban of brand.bans ?? []) {
    if (ban && artifact.toLowerCase().includes(ban.toLowerCase())) {
      findings.push({
        kind: "drift",
        severity: "blocker",
        message: `Brand ban appears in this stage: "${ban}".`,
        fix: "Remove the banned pattern and restyle with approved brand rules.",
      });
    }
  }

  // --- Defects: require complete checklist ---
  const missingChecks = REQUIRED_DEFECT_IDS.filter(
    (id) => submission.defectChecks[id] === undefined
  );
  if (missingChecks.length > 0) {
    findings.push({
      kind: "defect",
      severity: "blocker",
      message: `Incomplete defect checklist. Missing keys: ${missingChecks.join(", ")}.`,
      fix: "Submit every defect id as true/false after visually checking the screenshot.",
    });
  }

  for (const def of DEFECT_HUNT_LIST) {
    if (submission.defectChecks[def.id] === false) {
      findings.push({
        kind: "defect",
        severity: "blocker",
        message: `Defect admitted: ${def.label}.`,
        fix: def.fix,
      });
    }
  }

  // Heuristic defect smells in snippet
  if (submission.artifactSnippet) {
    if (/overflow-hidden/.test(submission.artifactSnippet) && /truncate|line-clamp/.test(submission.artifactSnippet)) {
      findings.push({
        kind: "defect",
        severity: "suggestion",
        message: "Snippet uses overflow-hidden with truncation — confirm text is not clipped by accident.",
        fix: DEFECT_HUNT_LIST.find((d) => d.id === "clipped_text")!.fix,
      });
    }
    if (/position:\s*absolute|absolute inset/.test(submission.artifactSnippet)) {
      findings.push({
        kind: "defect",
        severity: "suggestion",
        message: "Absolute positioning detected — verify nothing overlaps or escapes its container.",
        fix: DEFECT_HUNT_LIST.find((d) => d.id === "overlapping")!.fix,
      });
    }
  }

  // --- Slop signatures ---
  const slopHits = scanForSlop(artifact);
  for (const hit of slopHits) {
    findings.push({
      kind: "slop",
      severity: hit.signature.severity,
      message: `Slop signature "${hit.signature.name}" matched (${hit.matched}). ${hit.signature.why}`,
      fix: hit.signature.fix,
    });
  }

  // Praise when clean
  const blockers = findings.filter((f) => f.severity === "blocker");
  if (blockers.length === 0) {
    findings.push({
      kind: "praise",
      severity: "info",
      message: `Stage "${submission.stageId}" clears blockers. Continue to the next planned screen — do not end a stage unreviewed.`,
    });
  }

  const passed = blockers.length === 0;
  return { passed, findings };
}

export function remainingStages(
  plan: DesignPlan,
  reviewed: string[]
): string[] {
  const reviewedKeys = new Set(reviewed.map(normalizeStageKey));
  return plan.screens.filter((s) => !reviewedKeys.has(normalizeStageKey(s)));
}
