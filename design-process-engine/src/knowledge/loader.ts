/**
 * Loads Factory-produced knowledge from disk.
 * Small, step-specific payloads — never dump the whole library.
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type {
  KnowledgeIndex,
  PatternGuide,
  Playbook,
  SlopCatalog,
} from "./types.js";

const HERE = dirname(fileURLToPath(import.meta.url));

/** knowledge/ sits at package root whether we run from src/ or dist/ */
function knowledgeRoot(): string {
  const candidates = [
    join(HERE, "../../knowledge"),
    join(HERE, "../../../knowledge"),
    join(process.cwd(), "knowledge"),
  ];
  for (const c of candidates) {
    if (existsSync(join(c, "index.json"))) return c;
  }
  throw new Error(
    "Knowledge library not found. Run: node scripts/generate-knowledge.mjs"
  );
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

let cachedIndex: KnowledgeIndex | null = null;
let cachedSlop: SlopCatalog | null = null;

export function getIndex(): KnowledgeIndex {
  if (!cachedIndex) {
    cachedIndex = readJson<KnowledgeIndex>(join(knowledgeRoot(), "index.json"));
  }
  return cachedIndex;
}

export function listPlaybooks(): KnowledgeIndex["playbooks"] {
  return getIndex().playbooks;
}

export function listPatterns(filter?: {
  category?: string;
  query?: string;
}): KnowledgeIndex["patterns"] {
  let items = getIndex().patterns;
  if (filter?.category) {
    const cat = filter.category.toLowerCase();
    items = items.filter((p) => (p.category ?? "").toLowerCase() === cat);
  }
  if (filter?.query) {
    const q = filter.query.toLowerCase();
    items = items.filter(
      (p) =>
        p.id.includes(q) ||
        p.title.toLowerCase().includes(q) ||
        (p.category ?? "").toLowerCase().includes(q)
    );
  }
  return items;
}

export function getPlaybook(id: string): Playbook | null {
  const path = join(knowledgeRoot(), "playbooks", `${id}.json`);
  if (!existsSync(path)) {
    // fuzzy: match by substring against index
    const hit = getIndex().playbooks.find(
      (p) =>
        p.id === id ||
        p.id.includes(id) ||
        p.title.toLowerCase().includes(id.toLowerCase())
    );
    if (!hit) return null;
    return readJson<Playbook>(
      join(knowledgeRoot(), "playbooks", `${hit.id}.json`)
    );
  }
  return readJson<Playbook>(path);
}

export function matchPlaybook(task: string, context: string): Playbook | null {
  const text = `${task}\n${context}`.toLowerCase();
  const scored = getIndex().playbooks
    .map((entry) => {
      let score = 0;
      const tokens = [
        entry.id,
        entry.title,
        entry.productType ?? "",
        entry.flow ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((t) => t.length > 3);
      for (const t of tokens) {
        if (text.includes(t)) score += 1;
      }
      // strong hints
      if (/fintech|bank|kyc|wallet|card/.test(text) && entry.id.includes("fintech"))
        score += 5;
      if (/dashboard|saas|analytics|admin/.test(text) && entry.id.includes("saas"))
        score += 5;
      if (/checkout|cart|ecommerce|e-commerce/.test(text) && entry.id.includes("checkout"))
        score += 5;
      if (/onboard|signup|sign-up|register/.test(text) && /onboard|signup/.test(entry.id))
        score += 3;
      if (/settings|security|2fa|account/.test(text) && entry.id.includes("settings"))
        score += 4;
      return { entry, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) return null;
  return getPlaybook(scored[0].entry.id);
}

export function getPatternGuide(id: string): PatternGuide | null {
  const exact = join(knowledgeRoot(), "patterns", `${id}.json`);
  if (existsSync(exact)) return readJson<PatternGuide>(exact);

  const hit = getIndex().patterns.find(
    (p) =>
      p.id === id ||
      p.id.replace(/-/g, "") === id.replace(/-/g, "") ||
      p.title.toLowerCase() === id.toLowerCase() ||
      p.id.includes(id.toLowerCase()) ||
      id.toLowerCase().includes(p.id)
  );
  if (!hit) return null;
  return readJson<PatternGuide>(
    join(knowledgeRoot(), "patterns", `${hit.id}.json`)
  );
}

export function getSlopCatalog(): SlopCatalog {
  if (!cachedSlop) {
    const root = knowledgeRoot();
    const month = getIndex().slopMonth;
    const path = join(root, "slop", `${month}.json`);
    if (existsSync(path)) {
      cachedSlop = readJson<SlopCatalog>(path);
    } else {
      // fallback: newest file in slop/
      const dir = join(root, "slop");
      const files = readdirSync(dir)
        .filter((f) => f.endsWith(".json"))
        .sort()
        .reverse();
      if (!files.length) throw new Error("No slop catalogs found");
      cachedSlop = readJson<SlopCatalog>(join(dir, files[0]));
    }
  }
  return cachedSlop;
}

/** Compact digest for agents — keep tokens low. */
export function playbookDigest(pb: Playbook): Record<string, unknown> {
  return {
    id: pb.id,
    title: pb.title,
    tier: pb.tier,
    summary: pb.summary,
    structure: pb.structure,
    strategies: pb.strategies,
    forgottenStates: pb.forgottenStates,
    neverDo: pb.neverDo,
    evidenceNotes: pb.evidenceNotes,
  };
}

export function patternDigest(g: PatternGuide): Record<string, unknown> {
  return {
    id: g.id,
    title: g.title,
    category: g.category,
    tier: g.tier,
    structure: g.structure,
    requiredStates: g.requiredStates,
    codeExample: g.codeExample,
    mistakes: g.mistakes,
    relatedPatterns: g.relatedPatterns,
  };
}
