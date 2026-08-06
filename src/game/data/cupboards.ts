/**
 * Cupboard geography — the "library map".
 * Each cupboard owns slots keyed by set + size (+ lid flag for cookware).
 */

import type { Category, SizeRank } from "./sets";
import { DISH_SETS } from "./sets";

export interface CupboardSlot {
  id: string;
  cupboardId: string;
  category: Category;
  setId: string;
  size: SizeRank;
  isLidSlot?: boolean;
  /** Local position relative to cupboard origin */
  localPos: [number, number, number];
  /** World-space computed at runtime */
  worldPos?: [number, number, number];
}

export interface CupboardDef {
  id: string;
  category: Category;
  label: string;
  /** World position of cupboard center */
  position: [number, number, number];
  /** Width / height / depth of cabinet body */
  size: [number, number, number];
  rotationY: number;
}

export const CUPBOARDS: CupboardDef[] = [
  {
    id: "cupboard-plates",
    category: "plates",
    label: "PLATES",
    position: [-2.2, 1.2, -4.2],
    size: [2.4, 2.4, 0.7],
    rotationY: 0,
  },
  {
    id: "cupboard-bowls",
    category: "bowls",
    label: "BOWLS",
    position: [2.5, 1.2, -4.2],
    size: [2.2, 2.4, 0.7],
    rotationY: 0,
  },
  {
    id: "cupboard-cups",
    category: "cups",
    label: "CUPS",
    position: [5.2, 1.2, -1.5],
    size: [1.8, 2.4, 0.7],
    rotationY: -Math.PI / 2,
  },
  {
    id: "cupboard-cutlery",
    category: "cutlery",
    label: "CUTLERY",
    position: [-5.0, 0.7, 1.5],
    size: [1.6, 1.2, 0.7],
    rotationY: Math.PI / 2,
  },
  {
    id: "cupboard-cookware",
    category: "cookware",
    label: "COOKWARE",
    position: [-2.0, 1.3, 5.0],
    size: [3.2, 2.6, 0.8],
    rotationY: Math.PI,
  },
  {
    id: "cupboard-jars",
    category: "jars",
    label: "JARS",
    position: [6.5, 1.2, -3.5],
    size: [1.6, 2.4, 0.7],
    rotationY: -Math.PI / 2,
  },
];

export function buildSlots(): CupboardSlot[] {
  const slots: CupboardSlot[] = [];
  let n = 0;

  for (const cupboard of CUPBOARDS) {
    const setsHere = DISH_SETS.filter((s) =>
      s.categories.includes(cupboard.category)
    );
    const colCount = Math.max(setsHere.length, 1);
    const cupboardWidth = cupboard.size[0] - 0.3;

    setsHere.forEach((set, setIndex) => {
      const sizes = set.sizes[cupboard.category] ?? [];
      const xBase =
        -cupboardWidth / 2 +
        (cupboardWidth / colCount) * (setIndex + 0.5);

      sizes.forEach((size, sizeIndex) => {
        const y =
          cupboard.category === "cutlery"
            ? 0.15 + sizeIndex * 0.25
            : 0.35 + sizeIndex * 0.45;
        const z = -0.05;

        slots.push({
          id: `slot-${n++}`,
          cupboardId: cupboard.id,
          category: cupboard.category,
          setId: set.id,
          size: size as SizeRank,
          localPos: [xBase, y - cupboard.size[1] / 2 + 0.4, z],
        });

        // Lid column for cookware — offset to the right of pots
        if (cupboard.category === "cookware") {
          slots.push({
            id: `slot-${n++}`,
            cupboardId: cupboard.id,
            category: "cookware",
            setId: set.id,
            size: size as SizeRank,
            isLidSlot: true,
            localPos: [
              xBase + cupboardWidth / colCount * 0.28,
              y - cupboard.size[1] / 2 + 0.4,
              z,
            ],
          });
        }
      });
    });
  }

  return slots;
}

export function slotWorldPosition(
  cupboard: CupboardDef,
  slot: CupboardSlot
): [number, number, number] {
  const [lx, ly, lz] = slot.localPos;
  const cos = Math.cos(cupboard.rotationY);
  const sin = Math.sin(cupboard.rotationY);
  const wx = cupboard.position[0] + lx * cos - lz * sin;
  const wz = cupboard.position[2] + lx * sin + lz * cos;
  const wy = cupboard.position[1] + ly;
  return [wx, wy, wz];
}
