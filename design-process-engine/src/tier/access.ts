/**
 * Free vs Pro tier gating.
 *
 * Free: process engine + starter guides (2 playbooks, 20 patterns)
 * Pro (~$15–25/mo): full playbooks, review depth, monthly slop updates
 *
 * Auth: DESIGN_ENGINE_API_KEY env, or per-call apiKey.
 * Keys prefixed `dpe_pro_` → pro. `dpe_free_` or missing → free.
 * DESIGN_ENGINE_TIER=pro forces pro (local/dev).
 */

import type { KnowledgeTier } from "../knowledge/types.js";

export type AccessTier = KnowledgeTier;

export interface AccessContext {
  tier: AccessTier;
  apiKey?: string;
  reason: string;
}

export function resolveAccess(apiKey?: string): AccessContext {
  const forced = process.env.DESIGN_ENGINE_TIER?.toLowerCase();
  if (forced === "pro") {
    return { tier: "pro", apiKey, reason: "DESIGN_ENGINE_TIER=pro" };
  }
  if (forced === "free") {
    return { tier: "free", apiKey, reason: "DESIGN_ENGINE_TIER=free" };
  }

  const key = apiKey ?? process.env.DESIGN_ENGINE_API_KEY ?? "";
  if (key.startsWith("dpe_pro_")) {
    return { tier: "pro", apiKey: key, reason: "pro api key" };
  }
  if (key.startsWith("dpe_free_")) {
    return { tier: "free", apiKey: key, reason: "free api key" };
  }
  // Local stdio without a key: free tier (process still fully works)
  return {
    tier: "free",
    apiKey: key || undefined,
    reason: "default free (no pro key)",
  };
}

export function assertTier(
  required: AccessTier,
  access: AccessContext,
  feature: string
): { ok: true } | { ok: false; message: string } {
  if (required === "free") return { ok: true };
  if (access.tier === "pro") return { ok: true };
  return {
    ok: false,
    message: `${feature} requires Pro ($${process.env.DESIGN_ENGINE_PRO_PRICE ?? "19"}/mo). Set DESIGN_ENGINE_API_KEY=dpe_pro_<your-key> or upgrade at the Engine site. Free tier still includes the full process pipeline + starter playbooks/guides.`,
  };
}

export function canAccessKnowledge(
  knowledgeTier: KnowledgeTier,
  access: AccessContext
): boolean {
  if (knowledgeTier === "free") return true;
  return access.tier === "pro";
}
