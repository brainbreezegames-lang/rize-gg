"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AbilityId,
  Achievement,
  BasinId,
  DishDef,
  DishStatus,
  GamePhase,
  PlayMode,
  RecipeStep,
} from "../types";
import { buildRecipe, generateDishes, KITCHEN_REACTIONS, SEQUENCE_LENGTH, SPEED_LIMIT_SECONDS } from "../data/dishes";
import { abilityUnlockThreshold, canUseAbility, resolveWash } from "../systems/washLogic";
import { sfx } from "../audio/sfx";

export interface RuntimeDish extends DishDef {
  status: DishStatus;
  position: [number, number, number];
  highlight: boolean;
  scentGlow: boolean;
}

interface Toast {
  id: number;
  text: string;
  kind: "info" | "success" | "error" | "magic";
}

interface GameState {
  phase: GamePhase;
  mode: PlayMode;
  dishes: RuntimeDish[];
  recipe: RecipeStep[];
  sequenceIndex: number;
  heldDishId: string | null;
  selectedBasin: BasinId | null;
  scentActiveUntil: number;
  chainGlowDishId: string | null;
  greatRinseUsed: boolean;
  drainSpriteBusy: boolean;
  mistakes: number;
  wrongWashes: number;
  correctWashes: number;
  usedGuidance: boolean;
  cleanKitchenCount: number;
  totalDishes: number;
  elapsedMs: number;
  speedDeadlineMs: number;
  toasts: Toast[];
  lastReaction: string | null;
  kitchenEffects: Set<string> | string[];
  achievements: Achievement[];
  tutorialStep: number;
  washFx: { basin: BasinId; ok: boolean; dishId: string } | null;
  boardSlots: (string | null)[];
  hoveredDishId: string | null;

  startGame: (mode: PlayMode) => void;
  pause: () => void;
  resume: () => void;
  returnToTitle: () => void;
  tick: (dtMs: number) => void;
  hoverDish: (id: string | null) => void;
  pickDish: (id: string) => void;
  dropHeld: () => void;
  washInBasin: (basin: BasinId) => void;
  placeOnBoard: () => void;
  putInCupboard: (id: string) => void;
  activateScent: () => void;
  askDrainSprite: () => void;
  useGreatRinse: () => void;
  dismissToast: (id: number) => void;
  advanceTutorial: () => void;
  clearWashFx: () => void;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "recipe_devotee",
    title: "Recipe Devotee",
    description: "Complete the grand spell with no guidance abilities.",
    unlocked: false,
  },
  {
    id: "suds_of_chaos",
    title: "Suds of Chaos",
    description: "Brew disaster by mismatching every wash.",
    unlocked: false,
  },
  {
    id: "timeless_tidying",
    title: "Timeless Tidying",
    description: "Finish the full recipe under the time limit.",
    unlocked: false,
  },
  {
    id: "spotless_spirit",
    title: "Spotless Spirit",
    description: "Wash and put away every dish in the kitchen.",
    unlocked: false,
  },
  {
    id: "grand_spell",
    title: "Grand Spell Complete",
    description: "Finish the 30-dish washing order.",
    unlocked: false,
  },
];

let toastSeq = 1;

function makeRuntime(dishes: DishDef[]): RuntimeDish[] {
  return dishes.map((d) => ({
    ...d,
    status: "dirty" as DishStatus,
    highlight: false,
    scentGlow: false,
  }));
}

function pushToast(get: () => GameState, set: (p: Partial<GameState>) => void, text: string, kind: Toast["kind"]) {
  const id = toastSeq++;
  const toasts = [...get().toasts, { id, text, kind }].slice(-4);
  set({ toasts });
  setTimeout(() => {
    const cur = get().toasts.filter((t) => t.id !== id);
    set({ toasts: cur });
  }, 4200);
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      phase: "title",
      mode: "normal",
      dishes: [],
      recipe: [],
      sequenceIndex: 0,
      heldDishId: null,
      selectedBasin: null,
      scentActiveUntil: 0,
      chainGlowDishId: null,
      greatRinseUsed: false,
      drainSpriteBusy: false,
      mistakes: 0,
      wrongWashes: 0,
      correctWashes: 0,
      usedGuidance: false,
      cleanKitchenCount: 0,
      totalDishes: 0,
      elapsedMs: 0,
      speedDeadlineMs: SPEED_LIMIT_SECONDS * 1000,
      toasts: [],
      lastReaction: null,
      kitchenEffects: [],
      achievements: DEFAULT_ACHIEVEMENTS,
      tutorialStep: 0,
      washFx: null,
      boardSlots: [null, null, null, null],
      hoveredDishId: null,

      startGame: (mode) => {
        const defs = generateDishes(mode === "chaos" ? 99 : 42);
        const recipe = buildRecipe(defs);
        const dishes = makeRuntime(defs);
        // Highlight first recipe dish
        const first = recipe[0];
        if (first) {
          const d = dishes.find((x) => x.id === first.dishId);
          if (d) d.highlight = true;
        }
        set({
          phase: "playing",
          mode,
          dishes,
          recipe,
          sequenceIndex: 0,
          heldDishId: null,
          selectedBasin: null,
          scentActiveUntil: 0,
          chainGlowDishId: null,
          greatRinseUsed: false,
          drainSpriteBusy: false,
          mistakes: 0,
          wrongWashes: 0,
          correctWashes: 0,
          usedGuidance: false,
          cleanKitchenCount: 0,
          totalDishes: dishes.length,
          elapsedMs: 0,
          speedDeadlineMs: SPEED_LIMIT_SECONDS * 1000,
          toasts: [],
          lastReaction: null,
          kitchenEffects: [],
          tutorialStep: 0,
          washFx: null,
          boardSlots: [null, null, null, null],
          hoveredDishId: null,
        });
        pushToast(get, set, "The apprentice’s charm failed. Sort the grime. Follow the scroll.", "magic");
        sfx.unlock();
      },

      pause: () => {
        if (get().phase === "playing") set({ phase: "paused" });
      },
      resume: () => {
        if (get().phase === "paused") set({ phase: "playing" });
      },
      returnToTitle: () => set({ phase: "title", heldDishId: null, washFx: null }),

      tick: (dtMs) => {
        const s = get();
        if (s.phase !== "playing") return;
        const elapsedMs = s.elapsedMs + dtMs;
        let scentGlowUpdate = false;
        const now = Date.now();
        const scentOn = now < s.scentActiveUntil;
        const dishes = s.dishes.map((d) => {
          const shouldGlow = scentOn && (d.status === "dirty" || d.status === "held");
          if (d.scentGlow !== shouldGlow) scentGlowUpdate = true;
          return shouldGlow === d.scentGlow ? d : { ...d, scentGlow: shouldGlow };
        });

        const patch: Partial<GameState> = { elapsedMs };
        if (scentGlowUpdate) patch.dishes = dishes;

        if (s.mode === "speed" && elapsedMs >= s.speedDeadlineMs) {
          pushToast(get, set, "Time’s up! The moonlight fades…", "error");
          set({ ...patch, phase: "paused" });
          return;
        }
        set(patch);
      },

      hoverDish: (id) => set({ hoveredDishId: id }),

      pickDish: (id) => {
        const s = get();
        if (s.phase !== "playing" || s.heldDishId) return;
        const dish = s.dishes.find((d) => d.id === id);
        if (!dish || (dish.status !== "dirty" && dish.status !== "in_pile")) return;

        // Soft guidance: prefer recipe dish but allow practice extras
        const dishes = s.dishes.map((d) =>
          d.id === id ? { ...d, status: "held" as DishStatus } : d
        );
        set({ dishes, heldDishId: id });
        sfx.pickup();
      },

      dropHeld: () => {
        const s = get();
        if (!s.heldDishId) return;
        const dishes = s.dishes.map((d) =>
          d.id === s.heldDishId && d.status === "held"
            ? { ...d, status: "dirty" as DishStatus }
            : d
        );
        set({ dishes, heldDishId: null });
      },

      washInBasin: (basin) => {
        const s = get();
        if (s.phase !== "playing" || !s.heldDishId) return;
        const dish = s.dishes.find((d) => d.id === s.heldDishId);
        if (!dish) return;

        const result = resolveWash(dish.grime, basin, s.mode);

        if (result.ok) {
          sfx.washOk();
          const dishes = s.dishes.map((d) =>
            d.id === dish.id ? { ...d, status: "clean" as DishStatus, scentGlow: false } : d
          );
          set({
            dishes,
            heldDishId: null,
            correctWashes: s.correctWashes + 1,
            wrongWashes: s.mode === "chaos" ? s.wrongWashes + 1 : s.wrongWashes,
            washFx: { basin, ok: true, dishId: dish.id },
            selectedBasin: basin,
            phase: "washing_fx",
          });
          pushToast(get, set, `Stain dissolves in ${basin}…`, "success");
          setTimeout(() => {
            if (get().phase === "washing_fx") set({ phase: "playing", washFx: null });
          }, 700);
        } else {
          sfx.washBad();
          set({
            mistakes: s.mistakes + 1,
            washFx: { basin, ok: false, dishId: dish.id },
            phase: "washing_fx",
          });
          pushToast(get, set, result.message, "error");
          setTimeout(() => {
            if (get().phase === "washing_fx") set({ phase: "playing", washFx: null });
          }, 700);
        }
      },

      placeOnBoard: () => {
        const s = get();
        if (s.phase !== "playing") return;

        const nextStep = s.recipe[s.sequenceIndex];
        // Prefer the next recipe dish if it's already clean
        let dish =
          (nextStep &&
            s.dishes.find((d) => d.id === nextStep.dishId && d.status === "clean")) ||
          s.dishes.find((d) => d.id === s.heldDishId && d.status === "clean") ||
          s.dishes.find((d) => d.status === "clean" && !d.inRecipe) ||
          s.dishes.find((d) => d.status === "clean");

        if (!dish) {
          pushToast(get, set, "Wash a dish first, then place it on the board.", "info");
          return;
        }

        const isNextRecipe = !!(nextStep && dish.id === nextStep.dishId);

        if (dish.inRecipe && !isNextRecipe) {
          // Out-of-order recipe dish — park it clean until its turn
          pushToast(
            get,
            set,
            "Clean, but not next on the scroll. It waits on the rack until its turn.",
            "info"
          );
          return;
        }

        if (!isNextRecipe && !dish.inRecipe) {
          get().putInCupboard(dish.id);
          return;
        }

        if (isNextRecipe) {
          const slotIndex = s.sequenceIndex % 4;
          const boardSlots = [...s.boardSlots] as (string | null)[];
          boardSlots[slotIndex] = dish.id;
          const sequenceIndex = s.sequenceIndex + 1;
          const dishes = s.dishes.map((d) => {
            if (d.id === dish!.id) return { ...d, status: "on_board" as DishStatus, highlight: false };
            if (sequenceIndex < s.recipe.length && d.id === s.recipe[sequenceIndex].dishId) {
              return { ...d, highlight: true };
            }
            return { ...d, highlight: false };
          });

          const effects = new Set(
            Array.isArray(s.kitchenEffects) ? s.kitchenEffects : [...s.kitchenEffects]
          );
          let lastReaction: string | null = s.lastReaction;
          for (const r of KITCHEN_REACTIONS) {
            if (sequenceIndex === r.threshold) {
              effects.add(r.effect);
              lastReaction = r.message;
              pushToast(get, set, r.message, "magic");
              sfx.unlock();
            }
          }

          (["scent_of_sorting", "drain_sprite", "chain_rinsing", "great_rinse"] as AbilityId[]).forEach(
            (ab) => {
              if (s.mode !== "devotee" && sequenceIndex === abilityUnlockThreshold(ab)) {
                const names: Record<AbilityId, string> = {
                  scent_of_sorting: "Scent of Sorting",
                  drain_sprite: "Drain-Sprite",
                  chain_rinsing: "Chain-Rinsing",
                  great_rinse: "The Great Rinse",
                };
                pushToast(get, set, `Unlocked: ${names[ab]}!`, "magic");
              }
            }
          );

          let chainGlowDishId: string | null = null;
          if (
            canUseAbility("chain_rinsing", sequenceIndex, s.mode, s.greatRinseUsed) &&
            sequenceIndex < s.recipe.length
          ) {
            chainGlowDishId = s.recipe[sequenceIndex].dishId;
          }

          set({
            dishes,
            boardSlots,
            sequenceIndex,
            heldDishId: null,
            lastReaction,
            kitchenEffects: [...effects],
            chainGlowDishId,
            cleanKitchenCount: s.cleanKitchenCount + 1,
          });
          sfx.place();

          if (sequenceIndex >= SEQUENCE_LENGTH) {
            finishSequence(get, set);
          }
        }
      },

      putInCupboard: (id) => {
        const s = get();
        const dish = s.dishes.find((d) => d.id === id);
        if (!dish || dish.status !== "clean") return;
        const dishes = s.dishes.map((d) =>
          d.id === id ? { ...d, status: "cupboarded" as DishStatus } : d
        );
        const cleanKitchenCount = s.cleanKitchenCount + 1;
        set({ dishes, cleanKitchenCount, heldDishId: null });
        sfx.place();
        pushToast(get, set, "The cupboard accepts it with a soft thump.", "success");

        const allDone = dishes.every(
          (d) => d.status === "cupboarded" || d.status === "on_board"
        );
        if (allDone) {
          unlockAchievement(get, set, "spotless_spirit");
          pushToast(get, set, "Spotless Spirit! A mural glows behind the drying rack…", "magic");
          if (s.sequenceIndex >= SEQUENCE_LENGTH) {
            set({ phase: "epilogue" });
          }
        }
      },

      activateScent: () => {
        const s = get();
        if (!canUseAbility("scent_of_sorting", s.sequenceIndex, s.mode, s.greatRinseUsed)) {
          pushToast(get, set, "Scent of Sorting unlocks after 5 correct placements.", "info");
          return;
        }
        sfx.scent();
        set({
          scentActiveUntil: Date.now() + 12000,
          usedGuidance: true,
        });
        pushToast(get, set, "Aroma rises — grime glows by scent!", "magic");
      },

      askDrainSprite: () => {
        const s = get();
        if (!canUseAbility("drain_sprite", s.sequenceIndex, s.mode, s.greatRinseUsed)) {
          pushToast(get, set, "Drain-Sprite awakens after 10 placements.", "info");
          return;
        }
        if (s.drainSpriteBusy || s.heldDishId) return;

        const next = s.recipe[s.sequenceIndex];
        const target = next
          ? s.dishes.find((d) => d.id === next.dishId && d.status === "dirty")
          : s.dishes.find((d) => d.status === "dirty");
        if (!target) {
          pushToast(get, set, "Nothing left for the sprite to sort.", "info");
          return;
        }

        set({ drainSpriteBusy: true, usedGuidance: true });
        pushToast(get, set, "Drain-Sprite nudges the dish toward you…", "magic");
        sfx.scent();

        setTimeout(() => {
          const cur = get();
          const dishes = cur.dishes.map((d) =>
            d.id === target.id ? { ...d, status: "held" as DishStatus } : d
          );
          set({ dishes, heldDishId: target.id, drainSpriteBusy: false });
          sfx.pickup();
        }, 600);
      },

      useGreatRinse: () => {
        const s = get();
        if (!canUseAbility("great_rinse", s.sequenceIndex, s.mode, s.greatRinseUsed)) {
          pushToast(get, set, "The Great Rinse unlocks after 20 placements.", "info");
          return;
        }
        // Wash all dirty dishes that are currently "sorted" — we treat all dirty as washable if matching
        // Instantly clean every dirty dish whose grime matches — actually wash ALL dirty correctly
        const dishes = s.dishes.map((d) => {
          if (d.status !== "dirty" && d.status !== "held" && d.status !== "in_pile") return d;
          if (s.mode === "chaos") {
            // In chaos, great rinse "wrong-washes" them all
            return { ...d, status: "clean" as DishStatus };
          }
          return { ...d, status: "clean" as DishStatus, scentGlow: false };
        });
        set({
          dishes,
          greatRinseUsed: true,
          usedGuidance: true,
          heldDishId: null,
          correctWashes: s.correctWashes + dishes.filter((d) => d.status === "clean").length,
        });
        sfx.victory();
        pushToast(get, set, "THE GREAT RINSE! Every sorted stain dissolves!", "magic");
      },

      dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
      advanceTutorial: () => set({ tutorialStep: Math.min(3, get().tutorialStep + 1) }),
      clearWashFx: () => set({ washFx: null }),
    }),
    {
      name: "witchs-sink-save",
      partialize: (s) => ({ achievements: s.achievements }),
    }
  )
);

function unlockAchievement(
  get: () => GameState,
  set: (p: Partial<GameState>) => void,
  id: string
) {
  const achievements = get().achievements.map((a) =>
    a.id === id ? { ...a, unlocked: true } : a
  );
  set({ achievements });
}

function finishSequence(get: () => GameState, set: (p: Partial<GameState>) => void) {
  const s = get();
  unlockAchievement(get, set, "grand_spell");

  if (s.mode === "chaos") {
    sfx.chaos();
    set({ phase: "chaos_ending" });
    pushToast(
      get,
      set,
      "You have brewed a disaster. My soup is now a frog.",
      "error"
    );
    unlockAchievement(get, set, "suds_of_chaos");
    return;
  }

  if (s.mode === "devotee" && !s.usedGuidance) {
    unlockAchievement(get, set, "recipe_devotee");
  }
  if (s.mode === "speed" || s.elapsedMs <= s.speedDeadlineMs) {
    if (s.mode === "speed") unlockAchievement(get, set, "timeless_tidying");
  }

  sfx.victory();
  set({ phase: "victory" });
  pushToast(get, set, "The grand spell completes. The pantry door opens…", "magic");
}

/** Selectors */
export const selectNextRecipe = (s: GameState) => s.recipe[s.sequenceIndex] ?? null;
export const selectProgress = (s: GameState) => ({
  current: s.sequenceIndex,
  total: SEQUENCE_LENGTH,
});
