"use client";

import { create } from "zustand";
import {
  CHARM_DEFS,
  generateWorldItems,
  type WorldItem,
  type CharmDef,
} from "../data/items";
import { buildSlots, CUPBOARDS, type CupboardSlot } from "../data/cupboards";
import { DISH_SETS, getSet, type Category } from "../data/sets";
import { OBJECTIVES, WITCH_NOTES } from "../data/lore";

export type GamePhase =
  | "title"
  | "playing"
  | "paused"
  | "feast"
  | "achievements";

export type PlacementFeedback = "none" | "correct" | "wrong-set" | "wrong-size" | "near";

interface CooldownMap {
  [charmId: string]: number; // timestamp when ready
}

interface GameState {
  phase: GamePhase;
  seed: number;
  items: WorldItem[];
  slots: CupboardSlot[];
  inventory: (string | null)[]; // item ids, 6 slots
  selectedSlot: number;
  unlockedCharms: string[];
  charmCharges: Record<string, number>;
  cooldowns: CooldownMap;
  activeCharm: string | null;
  completedSets: string[];
  placedCount: number;
  totalCount: number;
  charmsUsed: number;
  startTime: number | null;
  elapsedMs: number;
  achievements: string[];
  objectiveIndex: number;
  witchNoteIndex: number;
  feedback: PlacementFeedback;
  feedbackSlotId: string | null;
  guidingItemId: string | null;
  glowingSetId: string | null;
  catPetted: boolean;
  message: string | null;
  pointerLocked: boolean;
  chaosMode: boolean;

  // actions
  startGame: (seed?: number) => void;
  pause: () => void;
  resume: () => void;
  setPhase: (p: GamePhase) => void;
  selectSlot: (i: number) => void;
  pickUpItem: (itemId: string) => boolean;
  placeIntoSlot: (slotId: string) => PlacementFeedback;
  dropSelected: () => void;
  unlockCharm: (charmId: string) => void;
  useCharm: (charmId: string) => boolean;
  tick: (dt: number) => void;
  petCat: () => void;
  setPointerLocked: (v: boolean) => void;
  setMessage: (msg: string | null) => void;
  clearFeedback: () => void;
  rotateSelected: () => void;
  checkSetCompletion: (setId: string) => void;
  grantAchievement: (id: string) => void;
  enableChaosMode: () => void;
  getHeldItem: () => WorldItem | null;
  getProgress: () => number;
  getObjective: () => { title: string; detail: string };
  getWitchNote: () => string;
}

function emptyInventory(): (string | null)[] {
  return [null, null, null, null, null, null];
}

function firstEmptySlot(inv: (string | null)[]): number {
  return inv.findIndex((s) => s === null);
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: "title",
  seed: 42,
  items: [],
  slots: [],
  inventory: emptyInventory(),
  selectedSlot: 0,
  unlockedCharms: [],
  charmCharges: {},
  cooldowns: {},
  activeCharm: null,
  completedSets: [],
  placedCount: 0,
  totalCount: 0,
  charmsUsed: 0,
  startTime: null,
  elapsedMs: 0,
  achievements: [],
  objectiveIndex: 0,
  witchNoteIndex: 0,
  feedback: "none",
  feedbackSlotId: null,
  guidingItemId: null,
  glowingSetId: null,
  catPetted: false,
  message: null,
  pointerLocked: false,
  chaosMode: false,

  startGame: (seed = Date.now() % 100000) => {
    const items = generateWorldItems(seed);
    const slots = buildSlots();
    const dishCount = items.filter(
      (i) => i.kind === "dish" || i.kind === "lid"
    ).length;
    set({
      phase: "playing",
      seed,
      items,
      slots,
      inventory: emptyInventory(),
      selectedSlot: 0,
      unlockedCharms: [],
      charmCharges: {},
      cooldowns: {},
      activeCharm: null,
      completedSets: [],
      placedCount: 0,
      totalCount: dishCount,
      charmsUsed: 0,
      startTime: Date.now(),
      elapsedMs: 0,
      achievements: [],
      objectiveIndex: 0,
      witchNoteIndex: 0,
      feedback: "none",
      feedbackSlotId: null,
      guidingItemId: null,
      glowingSetId: null,
      catPetted: false,
      message: "The cat did this. Midnight approaches…",
      pointerLocked: false,
      chaosMode: false,
    });
  },

  pause: () => set({ phase: "paused" }),
  resume: () => set({ phase: "playing" }),
  setPhase: (p) => set({ phase: p }),
  setPointerLocked: (v) => set({ pointerLocked: v }),
  setMessage: (msg) => set({ message: msg }),
  clearFeedback: () => set({ feedback: "none", feedbackSlotId: null }),
  selectSlot: (i) => set({ selectedSlot: Math.max(0, Math.min(5, i)) }),

  getHeldItem: () => {
    const { inventory, selectedSlot, items } = get();
    const id = inventory[selectedSlot];
    if (!id) return null;
    return items.find((it) => it.id === id) ?? null;
  },

  getProgress: () => {
    const { placedCount, totalCount } = get();
    if (totalCount === 0) return 0;
    return Math.round((placedCount / totalCount) * 100);
  },

  getObjective: () => {
    const { objectiveIndex, completedSets, placedCount, totalCount } = get();
    const progress = totalCount ? placedCount / totalCount : 0;
    if (progress > 0.9) return OBJECTIVES[5];
    if (completedSets.includes("moonlit-willow")) return OBJECTIVES[5];
    if (completedSets.includes("dragonfire-copper")) return OBJECTIVES[4];
    if (completedSets.includes("herb-garden")) return OBJECTIVES[3];
    if (completedSets.includes("blue-floral")) return OBJECTIVES[2];
    if (placedCount > 0) return OBJECTIVES[1];
    return OBJECTIVES[objectiveIndex] ?? OBJECTIVES[0];
  },

  getWitchNote: () => {
    const { witchNoteIndex, completedSets, getProgress } = get();
    const p = getProgress();
    if (p >= 90) return WITCH_NOTES[2];
    if (completedSets.length >= 3) return WITCH_NOTES[1];
    return WITCH_NOTES[witchNoteIndex] ?? WITCH_NOTES[0];
  },

  pickUpItem: (itemId) => {
    const state = get();
    if (state.phase !== "playing") return false;
    const item = state.items.find((i) => i.id === itemId);
    if (!item || item.placedSlotId || item.inventorySlot !== null) return false;
    if (item.hidden) return false;

    const inv = [...state.inventory];
    let slot = firstEmptySlot(inv);
    if (slot === -1) {
      // replace selected if held empty? or reject
      if (inv[state.selectedSlot] !== null) {
        set({ message: "Inventory full — place something first." });
        return false;
      }
      slot = state.selectedSlot;
    }

    // Stack same type into existing stack slot
    const stackSlot = inv.findIndex((id) => {
      if (!id) return false;
      const other = state.items.find((i) => i.id === id);
      return (
        other &&
        other.setId === item.setId &&
        other.category === item.category &&
        other.size === item.size &&
        !!other.isLid === !!item.isLid
      );
    });
    // We don't merge IDs (each item unique) — just prefer empty; visual stack via count

    inv[slot === -1 ? (stackSlot >= 0 ? stackSlot : 0) : slot] =
      inv[slot] === null ? itemId : itemId;
    // find truly empty
    const empty = firstEmptySlot([...state.inventory]);
    if (empty === -1) {
      set({ message: "Inventory full — place something first." });
      return false;
    }

    const newItems = state.items.map((i) =>
      i.id === itemId ? { ...i, inventorySlot: empty, placedSlotId: null } : i
    );
    const newInv = [...state.inventory];
    newInv[empty] = itemId;

    set({
      items: newItems,
      inventory: newInv,
      selectedSlot: empty,
      message: null,
    });
    return true;
  },

  placeIntoSlot: (slotId) => {
    const state = get();
    const heldId = state.inventory[state.selectedSlot];
    if (!heldId) return "none";
    const item = state.items.find((i) => i.id === heldId);
    const slot = state.slots.find((s) => s.id === slotId);
    if (!item || !slot) return "none";

    // Slot already occupied?
    const occupied = state.items.some((i) => i.placedSlotId === slotId);
    if (occupied) {
      set({ message: "That spot is taken.", feedback: "wrong-set", feedbackSlotId: slotId });
      return "wrong-set";
    }

    const needsLid = !!item.isLid;
    const slotIsLid = !!slot.isLidSlot;

    let feedback: PlacementFeedback = "correct";

    if (state.chaosMode) {
      // Chaos: allow anything
      feedback = "correct";
    } else if (item.category !== slot.category) {
      feedback = "wrong-set";
    } else if (item.setId !== slot.setId) {
      feedback = "wrong-set";
    } else if (needsLid !== slotIsLid) {
      feedback = "wrong-size";
    } else if (item.size !== slot.size) {
      // Same set, wrong size — yellow nudge
      feedback = "wrong-size";
    }

    if (feedback !== "correct") {
      set({
        feedback,
        feedbackSlotId: slotId,
        message:
          feedback === "wrong-set"
            ? "Wrong set — look for matching pattern."
            : "Right set, wrong size — try another shelf.",
      });
      return feedback;
    }

    // Place successfully
    const newInv = [...state.inventory];
    newInv[state.selectedSlot] = null;
    const newItems = state.items.map((i) =>
      i.id === heldId
        ? { ...i, placedSlotId: slotId, inventorySlot: null }
        : i
    );
    const placedCount = newItems.filter((i) => i.placedSlotId).length;

    set({
      items: newItems,
      inventory: newInv,
      placedCount,
      feedback: "correct",
      feedbackSlotId: slotId,
      message: "Perfect fit.",
    });

    if (placedCount === 1) get().grantAchievement("first-glow");
    get().checkSetCompletion(item.setId);

    // Lid whisperer
    if (item.setId === "dragonfire-copper" && item.isLid) {
      const copperLids = newItems.filter(
        (i) => i.setId === "dragonfire-copper" && i.isLid
      );
      if (copperLids.every((i) => i.placedSlotId)) {
        get().grantAchievement("lid-finder");
      }
    }

    return "correct";
  },

  dropSelected: () => {
    const state = get();
    const heldId = state.inventory[state.selectedSlot];
    if (!heldId) return;
    // Drop at player feet — position updated by world system via message
    const newInv = [...state.inventory];
    newInv[state.selectedSlot] = null;
    const newItems = state.items.map((i) =>
      i.id === heldId ? { ...i, inventorySlot: null, placedSlotId: null } : i
    );
    set({ items: newItems, inventory: newInv, message: "Dropped." });
  },

  rotateSelected: () => {
    const state = get();
    const heldId = state.inventory[state.selectedSlot];
    if (!heldId) return;
    set({
      items: state.items.map((i) =>
        i.id === heldId
          ? {
              ...i,
              rotation: [
                i.rotation[0],
                i.rotation[1] + Math.PI / 4,
                i.rotation[2],
              ] as [number, number, number],
            }
          : i
      ),
    });
  },

  unlockCharm: (charmId) => {
    const state = get();
    if (state.unlockedCharms.includes(charmId)) return;
    const charm = CHARM_DEFS.find((c) => c.id === charmId);
    const unlocked = [...state.unlockedCharms, charmId];
    set({
      unlockedCharms: unlocked,
      activeCharm: charmId,
      message: charm
        ? `Hearth Charm unlocked: ${charm.name}`
        : "Charm unlocked!",
      charmCharges: { ...state.charmCharges, [charmId]: 3 },
    });
    if (unlocked.length >= CHARM_DEFS.length) {
      get().grantAchievement("charm-collector");
    }
  },

  useCharm: (charmId) => {
    const state = get();
    if (!state.unlockedCharms.includes(charmId)) return false;
    const now = Date.now();
    if ((state.cooldowns[charmId] ?? 0) > now) {
      set({ message: "Charm still cooling…" });
      return false;
    }
    const charm = CHARM_DEFS.find((c) => c.id === charmId);
    if (!charm) return false;

    const baseId = charm.icon;
    let items = [...state.items];
    let message = "";
    let guidingItemId = state.guidingItemId;
    let glowingSetId = state.glowingSetId;

    if (baseId === "glimmer") {
      // Highlight one unplaced item matching held, or any unplaced
      const held = state.getHeldItem();
      const target =
        items.find(
          (i) =>
            !i.placedSlotId &&
            i.inventorySlot === null &&
            (i.kind === "dish" || i.kind === "lid") &&
            (!held ||
              (i.setId === held.setId &&
                i.category === held.category &&
                i.size !== held.size))
        ) ||
        items.find(
          (i) =>
            !i.placedSlotId &&
            i.inventorySlot === null &&
            (i.kind === "dish" || i.kind === "lid")
        );
      if (target) {
        guidingItemId = target.id;
        items = items.map((i) =>
          i.id === target.id ? { ...i, hidden: false } : i
        );
        message = "A glimmer shows the way…";
      }
    } else if (baseId === "call") {
      const held = state.getHeldItem();
      if (!held) {
        set({ message: "Hold a dish to Call its set." });
        return false;
      }
      const inv = [...state.inventory];
      let pulled = 0;
      const maxPull = charmId.includes("-2") ? 6 : 4;
      for (const i of items) {
        if (pulled >= maxPull) break;
        if (
          i.setId === held.setId &&
          !i.placedSlotId &&
          i.inventorySlot === null &&
          (i.kind === "dish" || i.kind === "lid")
        ) {
          const empty = inv.findIndex((s) => s === null);
          if (empty === -1) break;
          inv[empty] = i.id;
          i.inventorySlot = empty;
          i.hidden = false;
          pulled++;
        }
      }
      items = items.map((i) => {
        const idx = inv.indexOf(i.id);
        if (idx >= 0) return { ...i, inventorySlot: idx, hidden: false };
        return i;
      });
      set({
        inventory: inv,
        items,
        charmsUsed: state.charmsUsed + 1,
        cooldowns: {
          ...state.cooldowns,
          [charmId]: now + charm.baseCooldown * 1000,
        },
        activeCharm: charmId,
        message: pulled
          ? `Called ${pulled} pieces of ${getSet(held.setId).name}!`
          : "No more of that set to call.",
      });
      return true;
    } else if (baseId === "snap") {
      const held = state.getHeldItem();
      if (!held) {
        set({ message: "Hold a dish near its cupboard." });
        return false;
      }
      const slot = state.slots.find(
        (s) =>
          s.category === held.category &&
          s.setId === held.setId &&
          s.size === held.size &&
          !!s.isLidSlot === !!held.isLid &&
          !state.items.some((i) => i.placedSlotId === s.id)
      );
      if (!slot) {
        set({ message: "No free matching slot." });
        return false;
      }
      get().placeIntoSlot(slot.id);
      set({
        charmsUsed: get().charmsUsed + 1,
        cooldowns: {
          ...get().cooldowns,
          [charmId]: now + charm.baseCooldown * 1000,
        },
        activeCharm: charmId,
        message: "Tidy Snap!",
      });
      return true;
    } else if (baseId === "cats-eye") {
      const count = charmId.includes("-2") ? 5 : 3;
      let revealed = 0;
      items = items.map((i) => {
        if (revealed >= count) return i;
        if (i.hidden && !i.placedSlotId) {
          revealed++;
          return { ...i, hidden: false };
        }
        return i;
      });
      const held = state.getHeldItem();
      glowingSetId = held?.setId ?? items.find((i) => !i.placedSlotId)?.setId ?? null;
      message = `Cat's Eye reveals ${revealed} hidden pieces…`;
    }

    set({
      items,
      guidingItemId,
      glowingSetId,
      charmsUsed: state.charmsUsed + 1,
      cooldowns: {
        ...state.cooldowns,
        [charmId]: now + charm.baseCooldown * 1000,
      },
      activeCharm: charmId,
      message,
    });
    return true;
  },

  checkSetCompletion: (setId) => {
    const state = get();
    if (state.completedSets.includes(setId)) return;
    const pieces = state.items.filter(
      (i) =>
        i.setId === setId && (i.kind === "dish" || i.kind === "lid")
    );
    if (pieces.length === 0) return;
    if (!pieces.every((i) => i.placedSlotId)) return;

    const completedSets = [...state.completedSets, setId];
    const setDef = getSet(setId);
    set({
      completedSets,
      message: `${setDef.guestName} ${setDef.guestTitle} takes a seat…`,
      witchNoteIndex: Math.min(
        WITCH_NOTES.length - 1,
        state.witchNoteIndex + 1
      ),
    });

    if (completedSets.length >= DISH_SETS.length) {
      get().grantAchievement("full-coven");
      const elapsed = Date.now() - (state.startTime ?? Date.now());
      if (state.charmsUsed === 0) get().grantAchievement("old-fashioned");
      if (elapsed < 25 * 60 * 1000) get().grantAchievement("lightning-feast");
      setTimeout(() => get().setPhase("feast"), 1200);
    }
  },

  grantAchievement: (id) => {
    const state = get();
    if (state.achievements.includes(id)) return;
    set({
      achievements: [...state.achievements, id],
      message: `Achievement: ${id.replace(/-/g, " ")}`,
    });
  },

  petCat: () => {
    if (get().catPetted) {
      set({ message: "The familiar purrs." });
      return;
    }
    set({ catPetted: true, message: "The cat forgives you. Mostly." });
    get().grantAchievement("cat-friend");
  },

  enableChaosMode: () => {
    set({
      chaosMode: true,
      message: "Cat's Revenge — place anything anywhere.",
    });
    get().grantAchievement("cats-revenge");
  },

  tick: (dt) => {
    const state = get();
    if (state.phase !== "playing" || !state.startTime) return;
    set({ elapsedMs: Date.now() - state.startTime });
    // Clear ephemeral glow after time
    if (state.glowingSetId && state.elapsedMs % 10000 < dt * 1000) {
      // keep glow until next charm
    }
  },
}));

export function getCharmDef(id: string): CharmDef | undefined {
  return CHARM_DEFS.find((c) => c.id === id);
}

export function inventoryStacks(
  inventory: (string | null)[],
  items: WorldItem[]
): { item: WorldItem | null; count: number }[] {
  return inventory.map((id) => {
    if (!id) return { item: null, count: 0 };
    const item = items.find((i) => i.id === id) ?? null;
    if (!item) return { item: null, count: 0 };
    // count same type still in inventory
    const count = inventory.filter((oid) => {
      if (!oid) return false;
      const o = items.find((i) => i.id === oid);
      return (
        o &&
        o.setId === item.setId &&
        o.category === item.category &&
        o.size === item.size &&
        !!o.isLid === !!item.isLid
      );
    }).length;
    return { item, count };
  });
}

export type { WorldItem, Category };
