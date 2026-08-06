/**
 * Curate pipeline — human taste gate for factory drafts.
 *
 * approveArtifact → writes into knowledge/ with tier tags
 * rejectArtifact  → appends to factory/queue/rejected.jsonl
 */

import {
  readFileSync,
  writeFileSync,
  appendFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { QUEUE_DIR, writeStatus, readStatus } from "./capture.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const FACTORY_ROOT = resolve(__dirname, "..");
export const KNOWLEDGE_ROOT = resolve(FACTORY_ROOT, "..", "knowledge");
export const REJECTED_LOG = join(QUEUE_DIR, "rejected.jsonl");
export const APPROVED_LOG = join(QUEUE_DIR, "approved.jsonl");

export type Tier = "free" | "pro";

export type CuratorNotes = {
  notes?: string;
  tier?: Tier;
  curator?: string;
};

function ensureQueueFiles(): void {
  if (!existsSync(QUEUE_DIR)) mkdirSync(QUEUE_DIR, { recursive: true });
  for (const p of [REJECTED_LOG, APPROVED_LOG]) {
    if (!existsSync(p)) writeFileSync(p, "", "utf8");
  }
  const drafts = join(QUEUE_DIR, "drafts");
  if (!existsSync(drafts)) mkdirSync(drafts, { recursive: true });
}

function appendJsonl(path: string, row: unknown): void {
  ensureQueueFiles();
  appendFileSync(path, JSON.stringify(row) + "\n", "utf8");
}

function loadDraft(input: unknown): Record<string, unknown> {
  if (typeof input === "string") {
    const abs = resolve(input);
    return JSON.parse(readFileSync(abs, "utf8")) as Record<string, unknown>;
  }
  if (input && typeof input === "object") {
    return { ...(input as Record<string, unknown>) };
  }
  throw new Error("approveArtifact: draft must be a path or object");
}

function isPlaybookDraft(draft: Record<string, unknown>): boolean {
  return (
    draft.kind === "playbook-draft" ||
    (Array.isArray(draft.structure) &&
      Array.isArray(draft.strategies) &&
      !draft.requiredStates)
  );
}

function isPatternDraft(draft: Record<string, unknown>): boolean {
  return (
    draft.kind === "pattern-draft" ||
    (Array.isArray(draft.requiredStates) && Array.isArray(draft.structure))
  );
}

function toPlaybookKnowledge(
  draft: Record<string, unknown>,
  tier: Tier,
  curatorNotes: string,
): Record<string, unknown> {
  const id = String(draft.id);
  return {
    id,
    title: String(draft.title ?? id),
    productType: String(draft.productType ?? "other"),
    flow: String(draft.flow ?? "flow"),
    tier,
    summary: String(draft.summary ?? ""),
    structure: Array.isArray(draft.structure) ? draft.structure : [],
    strategies: Array.isArray(draft.strategies)
      ? (draft.strategies as Record<string, unknown>[]).map((s) => ({
          name: String(s.name ?? ""),
          prevalence: String(s.prevalence ?? ""),
          tradeoffs: String(s.tradeoffs ?? ""),
          when: String(s.when ?? ""),
        }))
      : [],
    forgottenStates: Array.isArray(draft.forgottenStates)
      ? draft.forgottenStates
      : [],
    neverDo: Array.isArray(draft.neverDo) ? draft.neverDo : [],
    evidenceNotes: [
      String(draft.evidenceNotes ?? ""),
      curatorNotes ? `Curator: ${curatorNotes}` : "",
    ]
      .filter(Boolean)
      .join(" "),
  };
}

function toPatternKnowledge(
  draft: Record<string, unknown>,
  tier: Tier,
): Record<string, unknown> {
  const id = String(draft.id);
  return {
    id,
    title: String(draft.title ?? id),
    category: String(draft.category ?? "general"),
    tier,
    structure: Array.isArray(draft.structure) ? draft.structure : [],
    requiredStates: Array.isArray(draft.requiredStates)
      ? draft.requiredStates
      : ["default"],
    codeExample: String(draft.codeExample ?? ""),
    mistakes: Array.isArray(draft.mistakes) ? draft.mistakes : [],
    relatedPatterns: Array.isArray(draft.relatedPatterns)
      ? draft.relatedPatterns
      : [],
  };
}

/**
 * Approve a draft artifact and write it into knowledge/ with tier tags.
 * Returns the written file path.
 */
export function approveArtifact(
  draft: unknown,
  curatorNotes: CuratorNotes | string = {},
): { path: string; id: string; kind: string; tier: Tier } {
  ensureQueueFiles();
  const notesObj: CuratorNotes =
    typeof curatorNotes === "string"
      ? { notes: curatorNotes }
      : (curatorNotes ?? {});
  const tier: Tier = notesObj.tier === "free" ? "free" : "pro";
  const noteText = notesObj.notes ?? "";
  const data = loadDraft(draft);

  let kind: "playbook" | "pattern";
  let knowledge: Record<string, unknown>;
  let outDir: string;

  if (isPlaybookDraft(data)) {
    kind = "playbook";
    knowledge = toPlaybookKnowledge(data, tier, noteText);
    outDir = join(KNOWLEDGE_ROOT, "playbooks");
  } else if (isPatternDraft(data)) {
    kind = "pattern";
    knowledge = toPatternKnowledge(data, tier);
    outDir = join(KNOWLEDGE_ROOT, "patterns");
  } else {
    throw new Error(
      "approveArtifact: unrecognized draft (need playbook-draft or pattern-draft)",
    );
  }

  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const id = String(knowledge.id);
  const outPath = join(outDir, `${id}.json`);
  writeFileSync(outPath, JSON.stringify(knowledge, null, 2) + "\n", "utf8");

  const record = {
    at: new Date().toISOString(),
    action: "approve",
    id,
    kind,
    tier,
    path: outPath,
    curator: notesObj.curator ?? "anonymous",
    notes: noteText,
  };
  appendJsonl(APPROVED_LOG, record);
  writeStatus({
    curate: {
      lastAction: "approve",
      ...record,
    },
  });

  return { path: outPath, id, kind, tier };
}

/** Reject an artifact by id; log reason to rejected.jsonl. */
export function rejectArtifact(
  id: string,
  reason: string,
): { id: string; reason: string } {
  ensureQueueFiles();
  if (!id) throw new Error("rejectArtifact: id is required");
  const record = {
    at: new Date().toISOString(),
    action: "reject",
    id,
    reason: reason || "No reason provided",
  };
  appendJsonl(REJECTED_LOG, record);
  writeStatus({
    curate: {
      lastAction: "reject",
      ...record,
    },
  });
  return { id, reason: record.reason };
}

/** Status snapshot for the factory queue. */
export function readQueueStatus(): Record<string, unknown> {
  ensureQueueFiles();
  const status = readStatus();
  const draftsDir = join(QUEUE_DIR, "drafts");
  const draftFiles = existsSync(draftsDir)
    ? readdirSync(draftsDir).filter((f) => f.endsWith(".json"))
    : [];
  const rejectedCount = existsSync(REJECTED_LOG)
    ? readFileSync(REJECTED_LOG, "utf8").split("\n").filter(Boolean).length
    : 0;
  const approvedCount = existsSync(APPROVED_LOG)
    ? readFileSync(APPROVED_LOG, "utf8").split("\n").filter(Boolean).length
    : 0;

  return {
    ...status,
    queue: {
      draftsDir,
      draftFiles,
      rejectedCount,
      approvedCount,
      rejectedLog: REJECTED_LOG,
      approvedLog: APPROVED_LOG,
      capturedExists: existsSync(join(QUEUE_DIR, "captured.json")),
    },
  };
}

/** @deprecated use readQueueStatus */
export function getQueueStatus(): Record<string, unknown> {
  return readQueueStatus();
}

function isMain(): boolean {
  const entry = process.argv[1] ? resolve(process.argv[1]) : "";
  return entry === fileURLToPath(import.meta.url);
}

if (isMain()) {
  const approveArg = process.argv.find((a) => a.startsWith("--approve="));
  const rejectArg = process.argv.find((a) => a.startsWith("--reject="));
  const tierArg = process.argv.find((a) => a.startsWith("--tier="));
  const reasonArg = process.argv.find((a) => a.startsWith("--reason="));
  const notesArg = process.argv.find((a) => a.startsWith("--notes="));

  if (approveArg) {
    const path = approveArg.slice("--approve=".length);
    const tier = (tierArg?.slice("--tier=".length) as Tier) || "pro";
    const notes = notesArg?.slice("--notes=".length) ?? "";
    const result = approveArtifact(path, { tier, notes });
    console.log(JSON.stringify({ ok: true, ...result }, null, 2));
  } else if (rejectArg) {
    const id = rejectArg.slice("--reject=".length);
    const reason = reasonArg?.slice("--reason=".length) ?? "rejected";
    const result = rejectArtifact(id, reason);
    console.log(JSON.stringify({ ok: true, ...result }, null, 2));
  } else {
    console.log(JSON.stringify(readQueueStatus(), null, 2));
  }
}
