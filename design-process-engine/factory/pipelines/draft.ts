/**
 * Draft pipeline — turn stacked journeys into playbook / pattern drafts.
 *
 * Runnable via: npx tsx factory/pipelines/draft.ts --flow=fintech-onboarding
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CAPTURED_PATH,
  QUEUE_DIR,
  normalizeJourney,
  stackJourneys,
  writeStatus,
  type JourneyStack,
  type NormalizedJourney,
} from "./capture.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const DRAFTS_DIR = join(QUEUE_DIR, "drafts");

export type Prevalence = {
  count: number;
  total: number;
  label: string;
};

export type StrategyDraft = {
  name: string;
  prevalence: string;
  count: number;
  total: number;
  tradeoffs: string;
  when: string;
};

export type PlaybookDraft = {
  id: string;
  kind: "playbook-draft";
  title: string;
  productType: string;
  flow: string;
  flowType: string;
  status: "draft" | "pending-review" | "approved" | "rejected";
  proposedTier: "free" | "pro";
  summary: string;
  structure: string[];
  strategies: StrategyDraft[];
  forgottenStates: string[];
  neverDo: string[];
  sourceJourneyIds: string[];
  prevalence: Record<string, Prevalence>;
  evidenceNotes: string;
  draftedAt: string;
};

export type PatternExample = {
  app: string;
  journeyId: string;
  stepName?: string;
  screenshotRef?: string;
  notes?: string;
  states?: string[];
  patterns?: string[];
  mistakes?: string[];
};

export type PatternDraft = {
  id: string;
  kind: "pattern-draft";
  title: string;
  category: string;
  status: "draft" | "pending-review" | "approved" | "rejected";
  proposedTier: "free" | "pro";
  structure: string[];
  requiredStates: string[];
  codeExample: string;
  mistakes: string[];
  relatedPatterns: string[];
  sourceExamples: PatternExample[];
  prevalence: Prevalence;
  draftedAt: string;
};

function ensureDrafts(): void {
  if (!existsSync(DRAFTS_DIR)) mkdirSync(DRAFTS_DIR, { recursive: true });
}

/** Format prevalence as "N of T". */
export function formatPrevalence(count: number, total: number): string {
  return `${count} of ${total}`;
}

/** Count how often each string appears across bags; return prevalence map. */
export function countPrevalence(
  bags: string[][],
  totalOverride?: number,
): Record<string, Prevalence> {
  const total = totalOverride ?? bags.length;
  const counts = new Map<string, number>();
  for (const bag of bags) {
    const unique = new Set(bag.map((s) => String(s).trim()).filter(Boolean));
    for (const item of unique) {
      counts.set(item, (counts.get(item) ?? 0) + 1);
    }
  }
  const out: Record<string, Prevalence> = {};
  for (const [key, count] of [...counts.entries()].sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    out[key] = {
      count,
      total,
      label: formatPrevalence(count, total),
    };
  }
  return out;
}

/** Ordered structure: steps sorted by mean index, then by prevalence. */
export function aggregateStructure(stack: JourneyStack): {
  structure: string[];
  prevalence: Record<string, Prevalence>;
} {
  const total = stack.journeys.length;
  const indexSums = new Map<string, { sum: number; count: number }>();
  const bags = stack.journeys.map((j) => j.steps.map((s) => s.name));

  for (const journey of stack.journeys) {
    for (const step of journey.steps) {
      const cur = indexSums.get(step.name) ?? { sum: 0, count: 0 };
      cur.sum += step.index;
      cur.count += 1;
      indexSums.set(step.name, cur);
    }
  }

  const prevalence = countPrevalence(bags, total);
  const structure = Object.keys(prevalence).sort((a, b) => {
    const pa = prevalence[a];
    const pb = prevalence[b];
    if (pb.count !== pa.count) return pb.count - pa.count;
    const ma = (indexSums.get(a)?.sum ?? 0) / (indexSums.get(a)?.count ?? 1);
    const mb = (indexSums.get(b)?.sum ?? 0) / (indexSums.get(b)?.count ?? 1);
    if (ma !== mb) return ma - mb;
    return a.localeCompare(b);
  });

  // Prefer mean-index order for the canonical spine when coverage is high
  const highCoverage = structure.filter((s) => prevalence[s].count >= Math.ceil(total / 2));
  highCoverage.sort((a, b) => {
    const ma = (indexSums.get(a)?.sum ?? 0) / (indexSums.get(a)?.count ?? 1);
    const mb = (indexSums.get(b)?.sum ?? 0) / (indexSums.get(b)?.count ?? 1);
    return ma - mb || a.localeCompare(b);
  });
  const rest = structure.filter((s) => !highCoverage.includes(s));
  return { structure: [...highCoverage, ...rest], prevalence };
}

function titleCaseId(id: string): string {
  return id
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of values) {
    const t = v.trim();
    if (!t || seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

/** Draft a playbook JSON from a journey stack. */
export function draftPlaybookFromStack(stack: JourneyStack): PlaybookDraft {
  const total = stack.journeys.length;
  const { structure, prevalence } = aggregateStructure(stack);

  const strategyBags = stack.journeys.map((j) => j.strategiesObserved);
  const strategyPrev = countPrevalence(strategyBags, total);
  const strategies: StrategyDraft[] = Object.entries(strategyPrev)
    .sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]))
    .map(([name, prev]) => ({
      name,
      prevalence: prev.label,
      count: prev.count,
      total: prev.total,
      tradeoffs: "Factory-inferred — curator should refine tradeoffs.",
      when: "Factory-inferred — curator should refine when-to-use.",
    }));

  const forgottenStates = uniqueStrings(
    stack.journeys.flatMap((j) => j.forgottenStates),
  );
  const neverDo = uniqueStrings(stack.journeys.flatMap((j) => j.antiPatterns));

  const apps = uniqueStrings(stack.journeys.map((j) => j.app.name));
  const summary = `Draft playbook for ${stack.flowType} from ${total} captured journey${total === 1 ? "" : "s"} (${apps.join(", ")}).`;

  return {
    id: stack.flowType,
    kind: "playbook-draft",
    title: titleCaseId(stack.flowType),
    productType: stack.productType,
    flow: stack.flow,
    flowType: stack.flowType,
    status: "pending-review",
    proposedTier: "pro",
    summary,
    structure,
    strategies,
    forgottenStates,
    neverDo,
    sourceJourneyIds: stack.journeys.map((j) => j.id),
    prevalence,
    evidenceNotes: `Stacked from ${total} journeys. Step prevalence attached. Awaiting human taste gate.`,
    draftedAt: new Date().toISOString(),
  };
}

/** Draft a pattern guide from example observations. */
export function draftPatternFromExamples(
  examples: PatternExample[],
  options: { id?: string; category?: string; totalJourneys?: number } = {},
): PatternDraft {
  if (!examples.length) {
    throw new Error("draftPatternFromExamples: need at least one example");
  }

  const id =
    options.id ??
    slugFromExamples(examples) ??
    "pattern";

  const stateBags = examples.map((e) => e.states ?? ["default"]);
  const statePrev = countPrevalence(stateBags, examples.length);
  const requiredStates = Object.entries(statePrev)
    .sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]))
    .map(([name]) => name);
  if (!requiredStates.includes("default")) requiredStates.unshift("default");

  const related = uniqueStrings(examples.flatMap((e) => e.patterns ?? [])).filter(
    (p) => p !== id,
  );
  const mistakes = uniqueStrings(examples.flatMap((e) => e.mistakes ?? []));
  if (mistakes.length === 0) {
    mistakes.push(`Treating ${titleCaseId(id)} as decoration without pending state`);
  }

  const title = titleCaseId(id);
  const structure = [
    `${id}-root`,
    `${id}-identity-input`,
    `${id}-verify`,
    `${id}-error`,
    `${id}-success`,
  ];

  const total = options.totalJourneys ?? examples.length;
  const prevalence: Prevalence = {
    count: examples.length,
    total,
    label: formatPrevalence(examples.length, total),
  };

  return {
    id,
    kind: "pattern-draft",
    title,
    category: options.category ?? "general",
    status: "pending-review",
    proposedTier: "pro",
    structure,
    requiredStates: uniqueStrings(requiredStates),
    codeExample: [
      "```tsx",
      `export function ${title.replace(/\s/g, "")}Example() {`,
      `  // Minimal ${title} pattern`,
      `  return (`,
      `    <section aria-label="${title}" data-pattern="${id}">`,
      `      <header><h2>${title}</h2></header>`,
      `      <div className="pattern-body">`,
      `        {/* Implement required states: ${uniqueStrings(requiredStates).join(", ")} */}`,
      `      </div>`,
      `    </section>`,
      `  );`,
      `}`,
      "```",
    ].join("\n"),
    mistakes,
    relatedPatterns: related.slice(0, 6),
    sourceExamples: examples.map((e) => ({
      app: e.app,
      journeyId: e.journeyId,
      stepName: e.stepName,
      screenshotRef: e.screenshotRef,
      notes: e.notes,
    })),
    prevalence,
    draftedAt: new Date().toISOString(),
  };
}

function slugFromExamples(examples: PatternExample[]): string | undefined {
  const counts = new Map<string, number>();
  for (const e of examples) {
    for (const p of e.patterns ?? []) {
      counts.set(p, (counts.get(p) ?? 0) + 1);
    }
  }
  const best = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  return best?.[0];
}

/** Extract pattern examples for a pattern id from a stack. */
export function collectPatternExamples(
  stack: JourneyStack,
  patternId: string,
): PatternExample[] {
  const examples: PatternExample[] = [];
  for (const journey of stack.journeys) {
    for (const step of journey.steps) {
      if (!step.patterns.includes(patternId)) continue;
      examples.push({
        app: journey.app.name,
        journeyId: journey.id,
        stepName: step.name,
        screenshotRef: step.screenshotRef,
        states: step.states.map((s) => s.name),
        patterns: step.patterns,
        mistakes: journey.antiPatterns,
      });
    }
  }
  return examples;
}

export function loadCapturedStacks(): JourneyStack[] {
  if (!existsSync(CAPTURED_PATH)) {
    throw new Error(
      `No captured journeys at ${CAPTURED_PATH}. Run capture first.`,
    );
  }
  const payload = JSON.parse(readFileSync(CAPTURED_PATH, "utf8")) as {
    journeys: unknown[];
  };
  const journeys = (payload.journeys ?? []).map((j) =>
    normalizeJourney(j),
  ) as NormalizedJourney[];
  return stackJourneys(journeys);
}

export function runDraft(flowType: string): {
  playbook: PlaybookDraft;
  patterns: PatternDraft[];
  paths: string[];
} {
  ensureDrafts();
  const stacks = loadCapturedStacks();
  const stack = stacks.find((s) => s.flowType === flowType);
  if (!stack) {
    const available = stacks.map((s) => s.flowType).join(", ") || "(none)";
    throw new Error(`Flow "${flowType}" not found. Available: ${available}`);
  }

  const playbook = draftPlaybookFromStack(stack);
  const playbookPath = join(DRAFTS_DIR, `${playbook.id}.playbook.json`);
  writeFileSync(playbookPath, JSON.stringify(playbook, null, 2) + "\n", "utf8");

  const patternCounts = countPrevalence(
    stack.journeys.map((j) => j.steps.flatMap((s) => s.patterns)),
    stack.journeys.length,
  );
  const topPatterns = Object.entries(patternCounts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([id]) => id);

  const patterns: PatternDraft[] = [];
  const paths = [playbookPath];

  for (const patternId of topPatterns) {
    const examples = collectPatternExamples(stack, patternId);
    if (!examples.length) continue;
    const category =
      patternId.includes("otp") ||
      patternId.includes("verify") ||
      patternId.includes("kyc") ||
      patternId.includes("password")
        ? "auth"
        : "general";
    const draft = draftPatternFromExamples(examples, {
      id: patternId,
      category,
      totalJourneys: stack.journeys.length,
    });
    patterns.push(draft);
    const pPath = join(DRAFTS_DIR, `${draft.id}.pattern.json`);
    writeFileSync(pPath, JSON.stringify(draft, null, 2) + "\n", "utf8");
    paths.push(pPath);
  }

  writeStatus({
    draft: {
      flowType,
      playbookId: playbook.id,
      patternIds: patterns.map((p) => p.id),
      paths,
      at: playbook.draftedAt,
    },
  });

  return { playbook, patterns, paths };
}

function isMain(): boolean {
  const entry = process.argv[1] ? resolve(process.argv[1]) : "";
  return entry === fileURLToPath(import.meta.url);
}

if (isMain()) {
  const flowArg = process.argv.find((a) => a.startsWith("--flow="));
  const flow = flowArg?.slice("--flow=".length) ?? "fintech-onboarding";
  const result = runDraft(flow);
  console.log(
    JSON.stringify(
      {
        ok: true,
        playbook: result.playbook.id,
        patterns: result.patterns.map((p) => p.id),
        paths: result.paths,
      },
      null,
      2,
    ),
  );
}
