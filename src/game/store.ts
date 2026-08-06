"use client";

import { create } from "zustand";
import {
  createLevelItems,
  MAX_ENERGY,
  MAX_INVENTORY,
  SHELVES,
  SPELLS,
} from "./constants";
import type { GameItem, GamePhase, ItemCategory, SpellId } from "./types";

export interface Toast {
  id: number;
  text: string;
  kind: "info" | "success" | "error" | "spell";
}

interface GameState {
  phase: GamePhase;
  items: GameItem[];
  inventory: string[]; // item ids
  selectedInv: number;
  energy: number;
  heartPower: number; // 0-5 sections complete
  placedCount: number;
  totalSlots: number;
  day: number;
  level: number;
  elapsed: number;
  identifyUntil: number;
  scryShelf: ItemCategory | null;
  scryUntil: number;
  highlightedItemId: string | null;
  unlockedSpells: SpellId[];
  chaosMode: boolean;
  toasts: Toast[];
  tutorialStep: number;
  tutorialDismissed: boolean;
  missorts: number;
  playerPos: [number, number, number];
  playerFacing: number;
  moveTarget: [number, number] | null;
  jumpUntil: number;
  servantBusy: boolean;
  heartAwakened: boolean;

  startGame: () => void;
  resetGame: () => void;
  setPhase: (p: GamePhase) => void;
  tick: (dt: number) => void;
  setPlayerPos: (pos: [number, number, number], facing: number) => void;
  setMoveTarget: (t: [number, number] | null) => void;
  tryPickup: (itemId: string) => boolean;
  pickupNearest: (pos: [number, number, number], radius?: number) => boolean;
  selectInventory: (index: number) => void;
  tryPlaceOnShelf: (shelfId: ItemCategory) => boolean;
  castSpell: (id: SpellId) => boolean;
  dismissTutorial: () => void;
  nextTutorial: () => void;
  addToast: (text: string, kind?: Toast["kind"]) => void;
  setHighlighted: (id: string | null) => void;
  toggleChaos: () => void;
}

let toastSeq = 1;

function computeUnlocked(placed: number): SpellId[] {
  return SPELLS.filter((s) => placed >= s.unlockAt).map((s) => s.id);
}

function shelfFilled(items: GameItem[], shelfId: ItemCategory): boolean {
  const shelf = SHELVES.find((s) => s.id === shelfId)!;
  const placed = items.filter((i) => i.placed && i.category === shelfId).length;
  return placed >= shelf.slots;
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: "title",
  items: createLevelItems(7),
  inventory: [],
  selectedInv: 0,
  energy: MAX_ENERGY,
  heartPower: 0,
  placedCount: 0,
  totalSlots: SHELVES.reduce((a, s) => a + s.slots, 0),
  day: 7,
  level: 1,
  elapsed: 0,
  identifyUntil: 0,
  scryShelf: null,
  scryUntil: 0,
  highlightedItemId: null,
  unlockedSpells: ["jump"],
  chaosMode: false,
  toasts: [],
  tutorialStep: 0,
  tutorialDismissed: false,
  missorts: 0,
  playerPos: [0, 0, 3],
  playerFacing: Math.PI,
  moveTarget: null,
  jumpUntil: 0,
  servantBusy: false,
  heartAwakened: false,

  startGame: () => {
    const items = createLevelItems(Date.now() % 100000);
    set({
      phase: "playing",
      items,
      inventory: [],
      selectedInv: 0,
      energy: MAX_ENERGY,
      heartPower: 0,
      placedCount: 0,
      elapsed: 0,
      identifyUntil: 0,
      scryShelf: null,
      scryUntil: 0,
      highlightedItemId: null,
      unlockedSpells: ["jump"],
      toasts: [],
      tutorialStep: 0,
      tutorialDismissed: false,
      missorts: 0,
      playerPos: [0, 0, 3],
      playerFacing: Math.PI,
      moveTarget: null,
      jumpUntil: 0,
      servantBusy: false,
      heartAwakened: false,
    });
  },

  resetGame: () => get().startGame(),

  setPhase: (phase) => set({ phase }),

  tick: (dt) => {
    const s = get();
    if (s.phase !== "playing") return;
    set({ elapsed: s.elapsed + dt });
  },

  setPlayerPos: (pos, facing) => set({ playerPos: pos, playerFacing: facing }),
  setMoveTarget: (t) => set({ moveTarget: t }),

  tryPickup: (itemId) => {
    const s = get();
    if (s.phase !== "playing") return false;
    if (s.inventory.length >= MAX_INVENTORY) {
      get().addToast("Hands are full! (10/10)", "error");
      return false;
    }
    const item = s.items.find((i) => i.id === itemId);
    if (!item || item.collected || item.placed) return false;

    set({
      items: s.items.map((i) =>
        i.id === itemId ? { ...i, collected: true } : i
      ),
      inventory: [...s.inventory, itemId],
      highlightedItemId:
        s.highlightedItemId === itemId ? null : s.highlightedItemId,
    });
    if (s.tutorialStep === 0) set({ tutorialStep: 1 });
    get().addToast("Picked up!", "info");
    return true;
  },

  pickupNearest: (pos, radius = 1.4) => {
    const s = get();
    let best: GameItem | null = null;
    let bestD = radius;
    for (const item of s.items) {
      if (item.collected || item.placed) continue;
      const d = Math.hypot(item.position[0] - pos[0], item.position[2] - pos[2]);
      if (d < bestD) {
        bestD = d;
        best = item;
      }
    }
    if (!best) return false;
    return get().tryPickup(best.id);
  },

  selectInventory: (index) => {
    const s = get();
    if (index < 0 || index >= MAX_INVENTORY) return;
    set({ selectedInv: index });
  },

  tryPlaceOnShelf: (shelfId) => {
    const s = get();
    if (s.phase !== "playing") return false;
    const itemId = s.inventory[s.selectedInv];
    if (!itemId) {
      get().addToast("Select an item in your hands first", "error");
      return false;
    }
    const item = s.items.find((i) => i.id === itemId);
    if (!item) return false;

    const shelf = SHELVES.find((sh) => sh.id === shelfId)!;
    const already = s.items.filter(
      (i) => i.placed && i.category === shelfId
    ).length;
    if (already >= shelf.slots) {
      get().addToast(`${shelf.name} is full!`, "error");
      return false;
    }

    if (item.category !== shelfId) {
      set({ missorts: s.missorts + 1 });
      get().addToast(`Wrong shelf! That belongs in ${item.category}.`, "error");
      // Drop item back near shelf with bounce
      const dropPos: [number, number, number] = [
        shelf.position[0] + (Math.random() - 0.5) * 1.5,
        0.15,
        shelf.position[2] + 1.8,
      ];
      const newInv = s.inventory.filter((_, i) => i !== s.selectedInv);
      set({
        inventory: newInv,
        selectedInv: Math.min(s.selectedInv, Math.max(0, newInv.length - 1)),
        items: s.items.map((i) =>
          i.id === itemId
            ? { ...i, collected: false, position: dropPos }
            : i
        ),
        energy: Math.max(0, s.energy - 1),
      });
      return false;
    }

    const slot = already;
    const newItems = s.items.map((i) =>
      i.id === itemId
        ? { ...i, placed: true, collected: true, shelfSlot: slot }
        : i
    );
    const newInv = s.inventory.filter((_, i) => i !== s.selectedInv);
    const placedCount = s.placedCount + 1;
    const unlockedSpells = computeUnlocked(placedCount);

    // Check newly completed shelves for heart power
    let heartPower = 0;
    for (const sh of SHELVES) {
      if (shelfFilled(newItems, sh.id)) heartPower++;
    }

    const newlyUnlocked = unlockedSpells.filter(
      (id) => !s.unlockedSpells.includes(id)
    );

    set({
      items: newItems,
      inventory: newInv,
      selectedInv: Math.min(s.selectedInv, Math.max(0, newInv.length - 1)),
      placedCount,
      heartPower,
      unlockedSpells,
      scryShelf: null,
      energy: Math.min(MAX_ENERGY, s.energy + (placedCount % 3 === 0 ? 1 : 0)),
    });

    if (s.tutorialStep < 3) set({ tutorialStep: Math.max(s.tutorialStep, 2) });
    if (heartPower > s.heartPower) {
      get().addToast(`${shelf.name} restored! Power flows to the Heart!`, "success");
      if (s.tutorialStep < 4) set({ tutorialStep: 3 });
    } else {
      get().addToast(`Placed in ${shelf.name}!`, "success");
    }

    for (const id of newlyUnlocked) {
      const spell = SPELLS.find((sp) => sp.id === id)!;
      get().addToast(`Spell unlocked: ${spell.name}!`, "spell");
    }

    if (heartPower >= 5) {
      set({ heartAwakened: true, phase: "victory" });
      get().addToast("The Dungeon Heart awakens!", "success");
    }

    return true;
  },

  castSpell: (id) => {
    const s = get();
    if (s.phase !== "playing") return false;
    const spell = SPELLS.find((sp) => sp.id === id);
    if (!spell) return false;
    if (!s.unlockedSpells.includes(id)) {
      get().addToast("Spell not yet unlocked", "error");
      return false;
    }
    if (s.energy < spell.cost) {
      get().addToast("Not enough spell energy", "error");
      return false;
    }

    const now = performance.now() / 1000;

    if (id === "jump") {
      set({
        energy: s.energy - spell.cost,
        jumpUntil: now + 0.55,
      });
      get().addToast("Jump!", "spell");
      return true;
    }

    if (id === "identify") {
      set({
        energy: s.energy - spell.cost,
        identifyUntil: now + 12,
      });
      get().addToast("Items identified!", "spell");
      return true;
    }

    if (id === "magnet") {
      const [px, , pz] = s.playerPos;
      const nearby = s.items.filter((i) => {
        if (i.collected || i.placed) return false;
        return Math.hypot(i.position[0] - px, i.position[2] - pz) < 4.5;
      });
      let inv = [...s.inventory];
      let items = [...s.items];
      let pulled = 0;
      for (const item of nearby) {
        if (inv.length >= MAX_INVENTORY) break;
        inv.push(item.id);
        items = items.map((i) =>
          i.id === item.id ? { ...i, collected: true } : i
        );
        pulled++;
      }
      set({
        energy: s.energy - spell.cost,
        inventory: inv,
        items,
      });
      get().addToast(`Magnet pulled ${pulled} item(s)!`, "spell");
      return true;
    }

    if (id === "servant") {
      const itemId = s.inventory[s.selectedInv];
      if (!itemId) {
        get().addToast("Hold an item for the Servant", "error");
        return false;
      }
      const item = s.items.find((i) => i.id === itemId)!;
      set({ energy: s.energy - spell.cost });
      // Auto-place correctly
      const ok = get().tryPlaceOnShelf(item.category);
      if (ok) get().addToast("Unseen Servant places the item…", "spell");
      return ok;
    }

    if (id === "scry") {
      const itemId = s.inventory[s.selectedInv];
      if (!itemId) {
        get().addToast("Select an item to scry", "error");
        return false;
      }
      const item = s.items.find((i) => i.id === itemId)!;
      set({
        energy: s.energy - spell.cost,
        scryShelf: item.category,
        scryUntil: now + 8,
      });
      get().addToast(`Scrying… ${item.category} shelf glows!`, "spell");
      return true;
    }

    return false;
  },

  dismissTutorial: () => set({ tutorialDismissed: true }),
  nextTutorial: () =>
    set((s) => ({ tutorialStep: Math.min(3, s.tutorialStep + 1) })),

  addToast: (text, kind = "info") => {
    const id = toastSeq++;
    set((s) => ({ toasts: [...s.toasts.slice(-4), { id, text, kind }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 2800);
  },

  setHighlighted: (id) => set({ highlightedItemId: id }),

  toggleChaos: () => {
    const s = get();
    if (!s.chaosMode) {
      // Scatter all unplaced collected items back + shuffle floor
      const items = s.items.map((i) => {
        if (i.placed) return i;
        const angle = Math.random() * Math.PI * 2;
        const r = 2 + Math.random() * 5;
        return {
          ...i,
          collected: false,
          position: [
            Math.cos(angle) * r,
            0.15,
            Math.sin(angle) * r * 0.6 + 2,
          ] as [number, number, number],
          rotation: Math.random() * Math.PI * 2,
        };
      });
      set({
        chaosMode: true,
        items,
        inventory: [],
        selectedInv: 0,
      });
      get().addToast("CHAOS ACHIEVEMENT: Everything scattered!", "error");
    } else {
      set({ chaosMode: false });
    }
  },
}));
