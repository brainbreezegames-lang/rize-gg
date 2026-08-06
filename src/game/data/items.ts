/**
 * Spawn every dish piece from set definitions.
 * Cookware gets matching lids as separate items (the "missing lid" puzzle).
 */

import { DISH_SETS, type Category, type SizeRank } from "./sets";

export type ItemKind = "dish" | "lid" | "charm";

export interface WorldItem {
  id: string;
  kind: ItemKind;
  setId: string;
  category: Category;
  size: SizeRank;
  /** For lids: matches cookware pot of same set+size */
  isLid?: boolean;
  /** World position when loose */
  position: [number, number, number];
  rotation: [number, number, number];
  /** If placed in a cupboard slot */
  placedSlotId: string | null;
  /** In player inventory index 0-5, or null */
  inventorySlot: number | null;
  /** Hidden until Cat's Eye / discovery */
  hidden?: boolean;
}

export interface CharmDef {
  id: string;
  name: string;
  description: string;
  icon: "glimmer" | "call" | "snap" | "cats-eye";
  /** Max uses / charges before cooldown scaling */
  baseCooldown: number;
  position: [number, number, number];
  hidden: boolean;
}

export const CHARM_DEFS: CharmDef[] = [
  {
    id: "charm-glimmer",
    name: "Guiding Glimmer",
    description: "Highlights one missing item.",
    icon: "glimmer",
    baseCooldown: 8,
    position: [3.2, 0.35, -2.4],
    hidden: false,
  },
  {
    id: "charm-call",
    name: "Call the Set",
    description: "Calls matching set items to you.",
    icon: "call",
    baseCooldown: 12,
    position: [-4.5, 1.1, 1.8],
    hidden: true,
  },
  {
    id: "charm-snap",
    name: "Tidy Snap",
    description: "Automatically snaps one item into place.",
    icon: "snap",
    baseCooldown: 18,
    position: [0.5, 0.2, 5.5],
    hidden: true,
  },
  {
    id: "charm-catseye",
    name: "Cat's Eye",
    description: "Reveals 3 hidden items.",
    icon: "cats-eye",
    baseCooldown: 20,
    position: [-6.2, 0.9, -3.5],
    hidden: true,
  },
  // Extra charms for longer play / collector achievement
  {
    id: "charm-glimmer-2",
    name: "Guiding Glimmer II",
    description: "A second glimmer — shorter cooldown.",
    icon: "glimmer",
    baseCooldown: 5,
    position: [7.5, 0.4, 2.0],
    hidden: true,
  },
  {
    id: "charm-call-2",
    name: "Call the Set II",
    description: "Pulls more of the set at once.",
    icon: "call",
    baseCooldown: 10,
    position: [-2.0, 0.15, -6.8],
    hidden: true,
  },
  {
    id: "charm-snap-2",
    name: "Tidy Snap II",
    description: "Snaps two held items at once.",
    icon: "snap",
    baseCooldown: 14,
    position: [5.8, 1.4, -5.2],
    hidden: true,
  },
  {
    id: "charm-catseye-2",
    name: "Cat's Eye II",
    description: "Reveals 5 hidden items.",
    icon: "cats-eye",
    baseCooldown: 16,
    position: [1.2, 2.2, 0.3],
    hidden: true,
  },
];

/** Scatter positions across kitchen, pantry, rafters */
const SCATTER_ZONES: [number, number, number][] = [
  // Floor near plates cupboard
  [-1.5, 0.12, 1.2],
  [-0.8, 0.12, 1.8],
  [-2.2, 0.12, 0.6],
  [0.2, 0.12, 2.0],
  // Center floor mess
  [0.5, 0.12, 0.0],
  [1.2, 0.12, -0.5],
  [-0.3, 0.12, -1.0],
  [2.0, 0.12, 0.8],
  [-2.5, 0.12, -1.5],
  [1.8, 0.12, 2.5],
  // Table spill
  [-0.5, 0.95, -0.2],
  [0.8, 0.95, 0.3],
  [1.5, 0.95, -0.4],
  [-1.2, 0.95, 0.1],
  // Near bowls cupboard
  [3.5, 0.12, -1.0],
  [4.0, 0.12, -0.3],
  [3.2, 0.12, 0.5],
  [4.5, 0.35, -1.5],
  // Near cookware
  [-3.5, 0.12, 2.5],
  [-4.0, 0.12, 3.2],
  [-3.0, 0.55, 3.5],
  [-4.5, 0.12, 1.5],
  // Cups area
  [2.5, 0.12, 3.5],
  [3.0, 0.12, 4.0],
  [1.5, 0.12, 4.2],
  // Cutlery / drawers
  [-1.0, 0.12, 4.0],
  [0.0, 0.45, 4.5],
  [0.8, 0.12, 3.8],
  // Jars / pantry
  [6.0, 0.12, -2.0],
  [6.5, 0.12, -1.0],
  [5.5, 0.55, -2.5],
  [7.0, 0.12, -3.0],
  [6.2, 0.95, -1.5],
  // Rafters / high shelves
  [-2.0, 2.4, -2.0],
  [1.0, 2.5, 1.5],
  [4.0, 2.3, 2.0],
  [-5.0, 2.2, 0.5],
  [2.0, 2.6, -3.0],
  // Window sill area
  [-5.5, 1.35, -1.0],
  [-5.8, 1.35, 0.5],
  // Bench / cat area
  [-4.8, 0.65, -2.5],
  [-4.2, 0.12, -3.0],
  // Far corner chaos
  [5.0, 0.12, 4.5],
  [-5.5, 0.12, 4.0],
  [0.0, 0.12, -5.5],
  [3.5, 0.12, -5.0],
  [-2.5, 0.12, -5.2],
  // Under table
  [0.3, 0.12, -0.8],
  [-0.7, 0.12, 0.4],
  [1.1, 0.12, 0.2],
  // Pantry deep
  [7.5, 0.12, -0.5],
  [7.2, 0.55, -2.8],
  [6.8, 1.1, -0.8],
  // Behind cupboards
  [-3.8, 0.12, -0.5],
  [4.8, 0.12, 1.2],
];

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateWorldItems(seed = 42): WorldItem[] {
  const rng = mulberry32(seed);
  const items: WorldItem[] = [];
  let idx = 0;
  const positions = [...SCATTER_ZONES];

  // Shuffle positions
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  const takePos = (): [number, number, number] => {
    if (positions.length === 0) {
      return [
        (rng() - 0.5) * 12,
        0.12 + rng() * 0.3,
        (rng() - 0.5) * 10,
      ];
    }
    const p = positions.pop()!;
    // slight jitter
    return [
      p[0] + (rng() - 0.5) * 0.4,
      p[1],
      p[2] + (rng() - 0.5) * 0.4,
    ];
  };

  for (const set of DISH_SETS) {
    for (const cat of set.categories) {
      const sizes = set.sizes[cat] ?? [];
      for (const size of sizes) {
        // 1–2 of common dish pieces for nesting feel (except cookware pots)
        const count =
          cat === "cookware" || cat === "cutlery"
            ? 1
            : cat === "jars"
              ? 1
              : 1 + (rng() > 0.55 ? 1 : 0);

        for (let c = 0; c < count; c++) {
          const pos = takePos();
          items.push({
            id: `item-${idx++}`,
            kind: "dish",
            setId: set.id,
            category: cat,
            size: size as SizeRank,
            position: pos,
            rotation: [0, rng() * Math.PI * 2, (rng() - 0.5) * 0.3],
            placedSlotId: null,
            inventorySlot: null,
            hidden: rng() > 0.92,
          });
        }

        // Matching lids for cookware
        if (cat === "cookware") {
          const lidPos = takePos();
          items.push({
            id: `item-${idx++}`,
            kind: "lid",
            setId: set.id,
            category: "cookware",
            size: size as SizeRank,
            isLid: true,
            position: lidPos,
            rotation: [0, rng() * Math.PI * 2, 0],
            placedSlotId: null,
            inventorySlot: null,
            hidden: rng() > 0.85,
          });
        }
      }
    }
  }

  return items;
}

export function countTotalDishPieces(items: WorldItem[]): number {
  return items.filter((i) => i.kind === "dish" || i.kind === "lid").length;
}
