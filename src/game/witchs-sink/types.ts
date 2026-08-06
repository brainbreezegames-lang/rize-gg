/** Magical grime types that map to wash basins */
export type GrimeType = "illusion" | "elemental" | "temporal";

/** Basin attuned to each grime family */
export type BasinId = "moonwater" | "sunfire" | "still";

export type DishShape = "plate" | "bowl" | "goblet" | "cauldron" | "cup" | "spoon";

export type DishMaterial = "wood" | "stone" | "glass" | "iron" | "ceramic";

export type DishStatus =
  | "dirty"
  | "held"
  | "in_pile"
  | "washing"
  | "clean"
  | "on_board"
  | "cupboarded";

export type GamePhase =
  | "title"
  | "playing"
  | "paused"
  | "washing_fx"
  | "sequence_complete"
  | "victory"
  | "chaos_ending"
  | "epilogue";

export type PlayMode =
  | "normal"
  | "devotee" // no guidance abilities
  | "chaos" // deliberately wrong basins for comedy ending
  | "speed" // timed run
  | "spotless"; // 100% all dishes

export type AbilityId =
  | "scent_of_sorting"
  | "drain_sprite"
  | "chain_rinsing"
  | "great_rinse";

export interface DishDef {
  id: string;
  shape: DishShape;
  material: DishMaterial;
  grime: GrimeType;
  /** Secondary visual cue icon on the dish */
  grimeLabel: string;
  /** Whether this dish appears in the main recipe sequence */
  inRecipe: boolean;
  /** Spawn position in kitchen world space */
  position: [number, number, number];
  rotationY: number;
}

export interface RecipeStep {
  dishId: string;
  shape: DishShape;
  grime: GrimeType;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export interface KitchenReaction {
  threshold: number;
  message: string;
  effect: "hearth" | "herbs" | "moonlight" | "spoons" | "oven" | "pantry";
}

export const GRIME_TO_BASIN: Record<GrimeType, BasinId> = {
  illusion: "moonwater",
  elemental: "sunfire",
  temporal: "still",
};

export const BASIN_TO_GRIME: Record<BasinId, GrimeType> = {
  moonwater: "illusion",
  sunfire: "elemental",
  still: "temporal",
};

export const GRIME_COLORS: Record<GrimeType, string> = {
  illusion: "#9B59F5",
  elemental: "#FF8C22",
  temporal: "#3DB8FF",
};

export const BASIN_COLORS: Record<BasinId, string> = {
  moonwater: "#7B3FE4",
  sunfire: "#FF9A1F",
  still: "#2ECCF0",
};

export const GRIME_NAMES: Record<GrimeType, string> = {
  illusion: "Dream-Syrup / Illusion",
  elemental: "Frost-Ash / Elemental",
  temporal: "Hex-Grease / Temporal",
};

export const BASIN_NAMES: Record<BasinId, string> = {
  moonwater: "Moonwater",
  sunfire: "Sunfire",
  still: "Still",
};

export const SHAPE_LABELS: Record<DishShape, string> = {
  plate: "Plate",
  bowl: "Bowl",
  goblet: "Goblet",
  cauldron: "Cauldron",
  cup: "Cup",
  spoon: "Spoon",
};
