/**
 * Capture pipeline — normalize raw journeys and stack them by flow type.
 *
 * Runnable via: npx tsx factory/pipelines/capture.ts
 * Or through:   node factory/scripts/run-pipeline.mjs capture --input=...
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const FACTORY_ROOT = resolve(__dirname, "..");
export const QUEUE_DIR = join(FACTORY_ROOT, "queue");
export const CAPTURED_PATH = join(QUEUE_DIR, "captured.json");
export const STATUS_PATH = join(QUEUE_DIR, "status.json");

export type JourneyStepState = {
  name: string;
  screenshotRef?: string;
  notes?: string;
};

export type JourneyStep = {
  index: number;
  name: string;
  screen: string;
  intent?: string;
  screenshotRef?: string;
  states: JourneyStepState[];
  patterns: string[];
  copySignals: string[];
};

export type NormalizedJourney = {
  id: string;
  app: {
    name: string;
    productType: string;
    platform: string;
    url?: string;
  };
  flowType: string;
  flow: string;
  capturedAt: string;
  capturer?: string;
  notes?: string;
  steps: JourneyStep[];
  forgottenStates: string[];
  strategiesObserved: string[];
  antiPatterns: string[];
};

export type CaptureJob = {
  id: string;
  inputPath: string;
  createdAt: string;
  status: "pending" | "captured" | "failed";
  journeyIds: string[];
  error?: string;
};

export type JourneyStack = {
  flowType: string;
  productType: string;
  flow: string;
  journeys: NormalizedJourney[];
  count: number;
};

function slugify(value: unknown, fallback = "untitled"): string {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return raw || fallback;
}

function asArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value == null) return [];
  return [value as T];
}

function ensureQueue(): void {
  if (!existsSync(QUEUE_DIR)) mkdirSync(QUEUE_DIR, { recursive: true });
  const drafts = join(QUEUE_DIR, "drafts");
  if (!existsSync(drafts)) mkdirSync(drafts, { recursive: true });
}

/** Normalize a raw journey object into a standard comparable structure. */
export function normalizeJourney(raw: unknown): NormalizedJourney {
  if (!raw || typeof raw !== "object") {
    throw new Error("normalizeJourney: expected an object");
  }
  const r = raw as Record<string, unknown>;
  const appRaw =
    r.app && typeof r.app === "object"
      ? (r.app as Record<string, unknown>)
      : {};

  const productType = slugify(
    appRaw.productType ?? r.productType ?? "other",
    "other",
  );
  const flow = slugify(r.flow ?? "flow", "flow");
  const flowType = slugify(
    r.flowType ?? r.flow_type ?? `${productType}-${flow}`,
    `${productType}-${flow}`,
  );

  const stepsIn = asArray<Record<string, unknown>>(r.steps);
  const steps: JourneyStep[] = stepsIn.map((step, i) => {
    const name = slugify(step.name ?? step.id ?? step.screen ?? `step-${i}`, `step-${i}`);
    const states = asArray<Record<string, unknown> | string>(step.states).map(
      (s) => {
        if (typeof s === "string") return { name: slugify(s, "default") };
        return {
          name: slugify(s.name ?? "default", "default"),
          screenshotRef:
            typeof s.screenshotRef === "string" ? s.screenshotRef : undefined,
          notes: typeof s.notes === "string" ? s.notes : undefined,
        };
      },
    );
    if (states.length === 0) states.push({ name: "default" });

    return {
      index: typeof step.index === "number" ? step.index : i,
      name,
      screen: String(step.screen ?? step.title ?? name),
      intent: typeof step.intent === "string" ? step.intent : undefined,
      screenshotRef:
        typeof step.screenshotRef === "string"
          ? step.screenshotRef
          : typeof step.screenshot === "string"
            ? step.screenshot
            : undefined,
      states,
      patterns: asArray<string>(step.patterns)
        .map((p) => slugify(p))
        .filter(Boolean),
      copySignals: asArray<string>(step.copySignals ?? step.copy).map(String),
    };
  });

  steps.sort((a, b) => a.index - b.index);

  const id = slugify(
    r.id ?? `${slugify(appRaw.name ?? "app")}-${flowType}`,
    "journey",
  );

  return {
    id,
    app: {
      name: String(appRaw.name ?? r.appName ?? "Unknown App"),
      productType,
      platform: slugify(appRaw.platform ?? "web", "web"),
      url: typeof appRaw.url === "string" ? appRaw.url : undefined,
    },
    flowType,
    flow,
    capturedAt:
      typeof r.capturedAt === "string"
        ? r.capturedAt
        : new Date().toISOString(),
    capturer: typeof r.capturer === "string" ? r.capturer : undefined,
    notes: typeof r.notes === "string" ? r.notes : undefined,
    steps,
    forgottenStates: asArray<string>(r.forgottenStates).map(String),
    strategiesObserved: asArray<string>(
      r.strategiesObserved ?? r.strategies,
    ).map(String),
    antiPatterns: asArray<string>(r.antiPatterns ?? r.neverDo).map(String),
  };
}

/** Group normalized journeys by flow type for drafting. */
export function stackJourneys(journeys: NormalizedJourney[]): JourneyStack[] {
  const map = new Map<string, JourneyStack>();
  for (const journey of journeys) {
    const existing = map.get(journey.flowType);
    if (existing) {
      existing.journeys.push(journey);
      existing.count = existing.journeys.length;
    } else {
      map.set(journey.flowType, {
        flowType: journey.flowType,
        productType: journey.app.productType,
        flow: journey.flow,
        journeys: [journey],
        count: 1,
      });
    }
  }
  return [...map.values()].sort((a, b) =>
    a.flowType.localeCompare(b.flowType),
  );
}

export function readStatus(): Record<string, unknown> {
  ensureQueue();
  if (!existsSync(STATUS_PATH)) {
    return { updatedAt: null, capture: null, draft: null, curate: null };
  }
  try {
    return JSON.parse(readFileSync(STATUS_PATH, "utf8")) as Record<
      string,
      unknown
    >;
  } catch {
    return { updatedAt: null, capture: null, draft: null, curate: null };
  }
}

export function writeStatus(patch: Record<string, unknown>): void {
  ensureQueue();
  const current = readStatus();
  const next = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  writeFileSync(STATUS_PATH, JSON.stringify(next, null, 2) + "\n", "utf8");
}

/** Load raw journeys from a JSON file (array or { journeys: [] }). */
export function loadJourneysFromFile(inputPath: string): unknown[] {
  const abs = resolve(inputPath);
  const raw = JSON.parse(readFileSync(abs, "utf8")) as unknown;
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object" && Array.isArray((raw as { journeys?: unknown }).journeys)) {
    return (raw as { journeys: unknown[] }).journeys;
  }
  throw new Error(`Expected array or { journeys: [] } in ${abs}`);
}

/** CLI-callable: capture + normalize + stack, persist to queue. */
export function runCapture(inputPath: string): {
  job: CaptureJob;
  journeys: NormalizedJourney[];
  stacks: JourneyStack[];
} {
  ensureQueue();
  const job: CaptureJob = {
    id: `capture-${Date.now()}`,
    inputPath: resolve(inputPath),
    createdAt: new Date().toISOString(),
    status: "pending",
    journeyIds: [],
  };

  try {
    const rawList = loadJourneysFromFile(inputPath);
    const journeys = rawList.map((r) => normalizeJourney(r));
    const stacks = stackJourneys(journeys);

    job.status = "captured";
    job.journeyIds = journeys.map((j) => j.id);

    const payload = {
      job,
      capturedAt: new Date().toISOString(),
      journeys,
      stacks: stacks.map((s) => ({
        flowType: s.flowType,
        productType: s.productType,
        flow: s.flow,
        count: s.count,
        journeyIds: s.journeys.map((j) => j.id),
      })),
    };

    writeFileSync(CAPTURED_PATH, JSON.stringify(payload, null, 2) + "\n", "utf8");
    writeStatus({
      capture: {
        jobId: job.id,
        inputPath: job.inputPath,
        journeyCount: journeys.length,
        flowTypes: stacks.map((s) => s.flowType),
        at: job.createdAt,
      },
    });

    return { job, journeys, stacks };
  } catch (err) {
    job.status = "failed";
    job.error = err instanceof Error ? err.message : String(err);
    writeStatus({
      capture: {
        jobId: job.id,
        status: "failed",
        error: job.error,
        at: job.createdAt,
      },
    });
    throw err;
  }
}

function isMain(): boolean {
  const entry = process.argv[1] ? resolve(process.argv[1]) : "";
  return entry === fileURLToPath(import.meta.url);
}

if (isMain()) {
  const inputArg = process.argv.find((a) => a.startsWith("--input="));
  const input =
    inputArg?.slice("--input=".length) ??
    join(FACTORY_ROOT, "fixtures", "sample-journeys.json");
  const { job, journeys, stacks } = runCapture(input);
  console.log(
    JSON.stringify(
      {
        ok: true,
        jobId: job.id,
        journeys: journeys.length,
        stacks: stacks.map((s) => ({ flowType: s.flowType, count: s.count })),
      },
      null,
      2,
    ),
  );
}
