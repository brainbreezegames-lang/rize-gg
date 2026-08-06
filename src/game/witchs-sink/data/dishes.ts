import type { DishDef, DishShape, DishMaterial, GrimeType, RecipeStep } from "../types";

const SHAPES: DishShape[] = ["plate", "bowl", "goblet", "cauldron", "cup", "spoon"];
const MATERIALS: DishMaterial[] = ["wood", "stone", "glass", "iron", "ceramic"];
const GRIMES: GrimeType[] = ["illusion", "elemental", "temporal"];

const GRIME_LABELS: Record<GrimeType, string[]> = {
  illusion: ["Dream-Syrup", "Nightmare-Honey", "Glamour-Film", "Enchant-Muck"],
  elemental: ["Frost-Ash", "Fire-Crust", "Lightning-Scorch", "Ember-Soot"],
  temporal: ["Hex-Grease", "Time-Rust", "Petrified-Soup", "Aging-Sludge"],
};

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Layout piles around the sink: left dirty table, floor piles by grime, crates */
function pilePosition(
  index: number,
  rand: () => number,
  grime?: "illusion" | "elemental" | "temporal"
): [number, number, number] {
  const jitter = () => (rand() - 0.5) * 0.4;
  // First recipe dishes spawn near the sink front so the player finds them
    if (index < 30) {
      if (index === 0) {
        return [-1.2, 0.2, 1.2]; // first dish front-and-center
      }
      if (index < 8) {
        return [-3.1 + (index % 4) * 0.35 + jitter() * 0.3, 1.0 + Math.floor(index / 4) * 0.12, -0.2 + jitter() * 0.5];
      }
    // Soft-sort floor piles by grime family for readability (still mixed)
    if (grime === "illusion" || index % 3 === 0) {
      return [-1.7 + jitter(), 0.14 + (index % 4) * 0.05, 1.5 + jitter()];
    }
    if (grime === "elemental" || index % 3 === 1) {
      return [-0.1 + jitter(), 0.14 + (index % 4) * 0.05, 1.85 + jitter()];
    }
    return [1.5 + jitter(), 0.14 + (index % 4) * 0.05, 1.45 + jitter()];
  }
  // Extras: crates, table overflow, far floor
  const e = index - 30;
  if (e < 15) {
    return [-3.9 + (e % 3) * 0.3 + jitter() * 0.2, 0.6 + Math.floor(e / 3) * 0.1, 0.9 + jitter()];
  }
  if (e < 30) {
    return [-3.0 + jitter(), 1.0 + ((e - 15) % 5) * 0.08, 0.3 + jitter()];
  }
  return [-2.2 + (e % 5) * 0.45 + jitter(), 0.14, 2.2 + Math.floor((e % 10) / 5) * 0.35 + jitter()];
}

/** Generate the full kitchen dish set: 30 recipe + 50 practice extras */
export function generateDishes(seed = 42): DishDef[] {
  const rand = mulberry32(seed);
  const dishes: DishDef[] = [];

  // 30 recipe dishes — carefully mixed for variety
  const recipePlan: Array<{ shape: DishShape; grime: GrimeType; material: DishMaterial }> = [
    { shape: "plate", grime: "illusion", material: "ceramic" },
    { shape: "goblet", grime: "elemental", material: "glass" },
    { shape: "bowl", grime: "temporal", material: "wood" },
    { shape: "cup", grime: "illusion", material: "ceramic" },
    { shape: "cauldron", grime: "elemental", material: "iron" },
    { shape: "plate", grime: "temporal", material: "stone" },
    { shape: "spoon", grime: "illusion", material: "wood" },
    { shape: "goblet", grime: "temporal", material: "glass" },
    { shape: "bowl", grime: "elemental", material: "ceramic" },
    { shape: "cup", grime: "temporal", material: "stone" },
    { shape: "plate", grime: "elemental", material: "wood" },
    { shape: "cauldron", grime: "illusion", material: "iron" },
    { shape: "goblet", grime: "illusion", material: "glass" },
    { shape: "bowl", grime: "illusion", material: "ceramic" },
    { shape: "plate", grime: "illusion", material: "ceramic" },
    { shape: "spoon", grime: "elemental", material: "iron" },
    { shape: "cup", grime: "elemental", material: "glass" },
    { shape: "cauldron", grime: "temporal", material: "iron" },
    { shape: "goblet", grime: "elemental", material: "stone" },
    { shape: "bowl", grime: "temporal", material: "wood" },
    { shape: "plate", grime: "temporal", material: "ceramic" },
    { shape: "cup", grime: "illusion", material: "glass" },
    { shape: "spoon", grime: "temporal", material: "wood" },
    { shape: "cauldron", grime: "elemental", material: "iron" },
    { shape: "plate", grime: "elemental", material: "stone" },
    { shape: "goblet", grime: "temporal", material: "glass" },
    { shape: "bowl", grime: "elemental", material: "ceramic" },
    { shape: "cup", grime: "temporal", material: "wood" },
    { shape: "plate", grime: "illusion", material: "ceramic" },
    { shape: "cauldron", grime: "illusion", material: "iron" },
  ];

  recipePlan.forEach((plan, i) => {
    const labels = GRIME_LABELS[plan.grime];
    dishes.push({
      id: `recipe-${i}`,
      shape: plan.shape,
      material: plan.material,
      grime: plan.grime,
      grimeLabel: labels[i % labels.length],
      inRecipe: true,
      position: pilePosition(i, rand, plan.grime),
      rotationY: rand() * Math.PI * 2,
    });
  });

  // 50 extra dishes for Spotless Spirit / practice
  for (let i = 0; i < 50; i++) {
    const shape = SHAPES[Math.floor(rand() * SHAPES.length)];
    const material = MATERIALS[Math.floor(rand() * MATERIALS.length)];
    const grime = GRIMES[Math.floor(rand() * GRIMES.length)];
    const labels = GRIME_LABELS[grime];
    dishes.push({
      id: `extra-${i}`,
      shape,
      material,
      grime,
      grimeLabel: labels[Math.floor(rand() * labels.length)],
      inRecipe: false,
      position: pilePosition(30 + i, rand, grime),
      rotationY: rand() * Math.PI * 2,
    });
  }

  return dishes;
}

export function buildRecipe(dishes: DishDef[]): RecipeStep[] {
  return dishes
    .filter((d) => d.inRecipe)
    .map((d) => ({
      dishId: d.id,
      shape: d.shape,
      grime: d.grime,
    }));
}

export const KITCHEN_REACTIONS = [
  { threshold: 3, message: "The hearth crackles with blue sparks…", effect: "hearth" as const },
  { threshold: 5, message: "Hanging herbs swing and release fragrance.", effect: "herbs" as const },
  { threshold: 10, message: "The window opens to invite moonlight.", effect: "moonlight" as const },
  { threshold: 15, message: "Spoons begin to stir the air.", effect: "spoons" as const },
  { threshold: 20, message: "The oven hums a lullaby.", effect: "oven" as const },
  { threshold: 30, message: "A hidden pantry door creaks open!", effect: "pantry" as const },
];

export const SEQUENCE_LENGTH = 30;
export const SPEED_LIMIT_SECONDS = 25 * 60; // 25 minutes for Timeless Tidying
