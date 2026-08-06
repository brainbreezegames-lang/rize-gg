import type { AbilityId, BasinId, GrimeType, PlayMode } from "../types";
import { GRIME_TO_BASIN } from "../types";

export function correctBasinFor(grime: GrimeType): BasinId {
  return GRIME_TO_BASIN[grime];
}

export function isCorrectWash(grime: GrimeType, basin: BasinId, mode: PlayMode): boolean {
  const correct = GRIME_TO_BASIN[grime] === basin;
  // Chaos mode: "success" means deliberately wrong wash
  if (mode === "chaos") return !correct;
  return correct;
}

export function abilityUnlockThreshold(ability: AbilityId): number {
  switch (ability) {
    case "scent_of_sorting":
      return 5;
    case "drain_sprite":
      return 10;
    case "chain_rinsing":
      return 15;
    case "great_rinse":
      return 20;
  }
}

export function canUseAbility(
  ability: AbilityId,
  sequenceProgress: number,
  mode: PlayMode,
  greatRinseUsed: boolean
): boolean {
  if (mode === "devotee") return false;
  if (sequenceProgress < abilityUnlockThreshold(ability)) return false;
  if (ability === "great_rinse" && greatRinseUsed) return false;
  return true;
}

export type WashResult =
  | { ok: true; effect: "hiss" | "smoke" | "chime" }
  | { ok: false; effect: "angry_hiss" | "soot_spray"; message: string };

export function resolveWash(grime: GrimeType, basin: BasinId, mode: PlayMode): WashResult {
  const correct = GRIME_TO_BASIN[grime] === basin;

  if (mode === "chaos") {
    if (!correct) {
      return { ok: true, effect: "smoke" };
    }
    return {
      ok: false,
      effect: "angry_hiss",
      message: "Too clean! The chaos demands mismatch!",
    };
  }

  if (correct) {
    const effects = ["hiss", "smoke", "chime"] as const;
    return { ok: true, effect: effects[Math.floor(Math.random() * effects.length)] };
  }

  return {
    ok: false,
    effect: "soot_spray",
    message: "Wrong basin! The stain spreads angrily…",
  };
}
