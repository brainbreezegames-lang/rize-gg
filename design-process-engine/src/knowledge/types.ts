/** Knowledge artifacts served by the Engine (produced by the Factory). */

export type KnowledgeTier = "free" | "pro";

export interface PlaybookStrategy {
  name: string;
  prevalence: string;
  tradeoffs: string;
  when: string;
}

export interface Playbook {
  id: string;
  title: string;
  productType: string;
  flow: string;
  tier: KnowledgeTier;
  summary: string;
  structure: string[];
  strategies: PlaybookStrategy[];
  forgottenStates: string[];
  neverDo: string[];
  evidenceNotes: string;
}

export interface PatternGuide {
  id: string;
  title: string;
  category: string;
  tier: KnowledgeTier;
  structure: string[];
  requiredStates: string[];
  codeExample: string;
  mistakes: string[];
  relatedPatterns: string[];
}

export interface SlopSignatureRecord {
  id: string;
  name: string;
  patterns: string[];
  why: string;
  fix: string;
  severity: "blocker" | "warning" | "suggestion";
}

export interface SlopCatalog {
  month: string;
  signatures: SlopSignatureRecord[];
}

export interface KnowledgeIndexEntry {
  kind: "playbook" | "pattern";
  id: string;
  title: string;
  tier: KnowledgeTier;
  category?: string;
  productType?: string;
  flow?: string;
}

export interface KnowledgeIndex {
  generatedAt: string;
  playbooks: KnowledgeIndexEntry[];
  patterns: KnowledgeIndexEntry[];
  slopMonth: string;
}
