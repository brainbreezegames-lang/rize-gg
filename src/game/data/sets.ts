/**
 * Dish sets = the "genres" of the library game.
 * Each set has a distinct visual identity you learn at a glance.
 */

export type Category =
  | "plates"
  | "bowls"
  | "cups"
  | "cutlery"
  | "cookware"
  | "jars";

export type SizeRank = 0 | 1 | 2 | 3 | 4; // 0 = largest

export interface DishSet {
  id: string;
  name: string;
  /** Primary ceramic / metal color */
  primary: string;
  /** Pattern / accent color */
  accent: string;
  /** Rim / metal highlight */
  rim: string;
  material: "ceramic" | "glass" | "wood" | "copper" | "iron" | "silver" | "stone";
  guestName: string;
  guestTitle: string;
  /** Which categories this set includes */
  categories: Category[];
  /** Pieces per category (size ranks present) */
  sizes: Partial<Record<Category, SizeRank[]>>;
}

export const DISH_SETS: DishSet[] = [
  {
    id: "moonlit-willow",
    name: "Moonlit Willow",
    primary: "#5B3A7A",
    accent: "#C9B8E0",
    rim: "#E8D5A3",
    material: "ceramic",
    guestName: "Willow",
    guestTitle: "the Soft-Spoken",
    categories: ["plates", "bowls", "cups", "cutlery"],
    sizes: {
      plates: [0, 1, 2],
      bowls: [0, 1, 2],
      cups: [0, 1],
      cutlery: [0, 1, 2],
    },
  },
  {
    id: "blue-floral",
    name: "Blue Floral",
    primary: "#3A6B8C",
    accent: "#A8D4E8",
    rim: "#F5F0E6",
    material: "ceramic",
    guestName: "Miriam",
    guestTitle: "of the Lake",
    categories: ["plates", "bowls", "cups"],
    sizes: {
      plates: [0, 1, 2],
      bowls: [0, 1, 2],
      cups: [0, 1],
    },
  },
  {
    id: "herb-garden",
    name: "Herb Garden",
    primary: "#E8E4D9",
    accent: "#4A7A4E",
    rim: "#8B7355",
    material: "ceramic",
    guestName: "Thornbark",
    guestTitle: "the Green",
    categories: ["plates", "bowls", "cups", "cutlery"],
    sizes: {
      plates: [0, 1, 2],
      bowls: [0, 1, 2],
      cups: [0, 1],
      cutlery: [0, 1, 2],
    },
  },
  {
    id: "coven-amethyst",
    name: "Coven Amethyst",
    primary: "#6B3FA0",
    accent: "#D4A5FF",
    rim: "#FFD700",
    material: "glass",
    guestName: "Elspeth",
    guestTitle: "Nightbloom",
    categories: ["plates", "bowls", "cups", "cutlery"],
    sizes: {
      plates: [0, 1, 2],
      bowls: [0, 1],
      cups: [0, 1],
      cutlery: [0, 1, 2],
    },
  },
  {
    id: "dragonfire-copper",
    name: "Dragonfire Copper",
    primary: "#B87333",
    accent: "#E8A05C",
    rim: "#5C3317",
    material: "copper",
    guestName: "Agatha",
    guestTitle: "Flamecaller",
    categories: ["cookware"],
    sizes: {
      cookware: [0, 1, 2, 3], // pot sizes; lids are separate items
    },
  },
  {
    id: "ironheart",
    name: "Ironheart",
    primary: "#8A8F98",
    accent: "#C0C4CC",
    rim: "#3A3D44",
    material: "iron",
    guestName: "Belladonna",
    guestTitle: "Ironwill",
    categories: ["cookware"],
    sizes: {
      cookware: [0, 1, 2],
    },
  },
  {
    id: "shadow-cauldron",
    name: "Shadow Cauldron",
    primary: "#2A2A32",
    accent: "#4A4A58",
    rim: "#1A1A20",
    material: "iron",
    guestName: "Mortimer",
    guestTitle: "the Hollow",
    categories: ["cookware"],
    sizes: {
      cookware: [0, 1, 2],
    },
  },
  {
    id: "golden-harvest",
    name: "Golden Harvest",
    primary: "#D4A84B",
    accent: "#F5E6C8",
    rim: "#8B6914",
    material: "ceramic",
    guestName: "Baba Yarrow",
    guestTitle: "of the Fields",
    categories: ["plates", "bowls", "cups", "cutlery"],
    sizes: {
      plates: [0, 1, 2],
      bowls: [0, 1, 2],
      cups: [0, 1],
      cutlery: [0, 1, 2],
    },
  },
  {
    id: "rustic-oak",
    name: "Rustic Oak",
    primary: "#8B5A2B",
    accent: "#C4A574",
    rim: "#5C3A1A",
    material: "wood",
    guestName: "Thistle",
    guestTitle: "the Green",
    categories: ["plates", "bowls", "cups"],
    sizes: {
      plates: [0, 1, 2],
      bowls: [0, 1],
      cups: [0],
    },
  },
  {
    id: "frost-crystal",
    name: "Frost Crystal",
    primary: "#A8D8E8",
    accent: "#E8F4F8",
    rim: "#6BA3B8",
    material: "glass",
    guestName: "Morwen",
    guestTitle: "the Wise",
    categories: ["plates", "bowls", "cups", "cutlery"],
    sizes: {
      plates: [0, 1],
      bowls: [0, 1],
      cups: [0, 1],
      cutlery: [0, 1, 2],
    },
  },
  {
    id: "ember-stoneware",
    name: "Ember Stoneware",
    primary: "#A0522D",
    accent: "#CD853F",
    rim: "#3D2314",
    material: "stone",
    guestName: "Hecate",
    guestTitle: "Ashborn",
    categories: ["plates", "bowls", "cups", "jars"],
    sizes: {
      plates: [0, 1, 2],
      bowls: [0, 1, 2],
      cups: [0],
      jars: [0, 1, 2],
    },
  },
  {
    id: "midnight-silver",
    name: "Midnight Silver",
    primary: "#C0C0C8",
    accent: "#E8E8F0",
    rim: "#4A4A60",
    material: "silver",
    guestName: "Selene",
    guestTitle: "Moonshard",
    categories: ["cutlery", "cups"],
    sizes: {
      cutlery: [0, 1, 2],
      cups: [0, 1],
    },
  },
];

export const CATEGORY_LABELS: Record<Category, string> = {
  plates: "PLATES",
  bowls: "BOWLS",
  cups: "CUPS",
  cutlery: "CUTLERY",
  cookware: "COOKWARE",
  jars: "JARS",
};

export const SIZE_LABELS: Record<Category, string[]> = {
  plates: ["Dinner", "Salad", "Bread", "Saucer", "Tiny"],
  bowls: ["Serving", "Soup", "Nesting", "Ramekin", "Thimble"],
  cups: ["Goblet", "Teacup", "Espresso", "Shot", "Thimble"],
  cutlery: ["Fork", "Knife", "Spoon", "Teaspoon", "Pick"],
  cookware: ["Stockpot", "Saucepan", "Skillet", "Saucepot", "Mini"],
  jars: ["Flour", "Sugar", "Tea", "Newt", "Spice"],
};

export function getSet(id: string): DishSet {
  const s = DISH_SETS.find((d) => d.id === id);
  if (!s) throw new Error(`Unknown set: ${id}`);
  return s;
}
