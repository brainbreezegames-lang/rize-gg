import type { GameItem, ItemCategory, ItemKind, ShelfDef, SpellDef } from "./types";

export const ROOM_RADIUS = 10;
export const MAX_INVENTORY = 10;
export const MAX_ENERGY = 6;

export const SHELVES: ShelfDef[] = [
  {
    id: "armory",
    name: "Armory",
    color: "#c45c4a",
    bannerColor: "#e85d4c",
    position: [-6.5, 0, -7.2],
    slots: 4,
    kinds: ["sword", "mace", "shield"],
  },
  {
    id: "scrolls",
    name: "Scrolls",
    color: "#7b4fc4",
    bannerColor: "#9b6bdb",
    position: [-3.25, 0, -7.8],
    slots: 4,
    kinds: ["scroll"],
  },
  {
    id: "alchemy",
    name: "Alchemy",
    color: "#3d9b5c",
    bannerColor: "#4ecf70",
    position: [0, 0, -8.1],
    slots: 4,
    kinds: ["potion_red", "potion_blue", "potion_green"],
  },
  {
    id: "treasury",
    name: "Treasury",
    color: "#c9a227",
    bannerColor: "#efc84a",
    position: [3.25, 0, -7.8],
    slots: 4,
    kinds: ["coin", "gem", "chest"],
  },
  {
    id: "trophies",
    name: "Trophies",
    color: "#3a7ec4",
    bannerColor: "#4a9eef",
    position: [6.5, 0, -7.2],
    slots: 4,
    kinds: ["skull", "bone"],
  },
];

export const SPELLS: SpellDef[] = [
  {
    id: "jump",
    name: "Jump",
    hotkey: "1",
    cost: 1,
    description: "Hop over clutter to reach distant loot.",
    unlockAt: 0,
  },
  {
    id: "identify",
    name: "Identify",
    hotkey: "2",
    cost: 1,
    description: "Reveal the true category of nearby items.",
    unlockAt: 2,
  },
  {
    id: "magnet",
    name: "Loot Magnet",
    hotkey: "3",
    cost: 2,
    description: "Pull nearby floor items into your hands.",
    unlockAt: 5,
  },
  {
    id: "servant",
    name: "Unseen Servant",
    hotkey: "4",
    cost: 3,
    description: "A ghost places one held item correctly.",
    unlockAt: 8,
  },
  {
    id: "scry",
    name: "Scrying Pulse",
    hotkey: "5",
    cost: 2,
    description: "Highlight the shelf that matches your selected item.",
    unlockAt: 4,
  },
];

export const ITEM_COLORS: Record<ItemKind, string> = {
  sword: "#a8b4c4",
  mace: "#8a7a6a",
  shield: "#6a8ab0",
  scroll: "#e8d9a8",
  potion_red: "#e05050",
  potion_blue: "#5080e0",
  potion_green: "#50c070",
  coin: "#efc84a",
  gem: "#70e0d0",
  chest: "#b8860b",
  skull: "#e8e0d0",
  bone: "#d8c8a8",
};

export const CATEGORY_OF: Record<ItemKind, ItemCategory> = {
  sword: "armory",
  mace: "armory",
  shield: "armory",
  scroll: "scrolls",
  potion_red: "alchemy",
  potion_blue: "alchemy",
  potion_green: "alchemy",
  coin: "treasury",
  gem: "treasury",
  chest: "treasury",
  skull: "trophies",
  bone: "trophies",
};

const KIND_POOL: ItemKind[] = [
  "sword",
  "sword",
  "mace",
  "shield",
  "scroll",
  "scroll",
  "scroll",
  "potion_red",
  "potion_blue",
  "potion_green",
  "potion_red",
  "coin",
  "coin",
  "gem",
  "chest",
  "skull",
  "skull",
  "bone",
  "bone",
  "sword",
];

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createLevelItems(seed = 42): GameItem[] {
  const rand = mulberry32(seed);
  const items: GameItem[] = [];

  // Ensure each shelf can be filled exactly once (4 slots × 5 = 20)
  const guaranteed: ItemKind[] = [
    "sword",
    "mace",
    "shield",
    "sword",
    "scroll",
    "scroll",
    "scroll",
    "scroll",
    "potion_red",
    "potion_blue",
    "potion_green",
    "potion_red",
    "coin",
    "gem",
    "chest",
    "coin",
    "skull",
    "bone",
    "skull",
    "bone",
  ];

  // Shuffle
  for (let i = guaranteed.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [guaranteed[i], guaranteed[j]] = [guaranteed[j], guaranteed[i]];
  }

  guaranteed.forEach((kind, i) => {
    // Scatter in arc of room, avoid walls and heart pedestal
    const angle = (rand() * Math.PI * 1.4) - Math.PI * 0.7 + Math.PI; // front half-ish
    const radius = 2.2 + rand() * 5.5;
    let x = Math.cos(angle) * radius;
    let z = Math.sin(angle) * radius * 0.85 + 1.5;
    // Keep inside room and not too close to shelves
    if (z < -4.5) z = -4.5 + rand() * 2;
    if (Math.hypot(x, z + 6) < 2.5) {
      x += (rand() > 0.5 ? 2 : -2);
      z += 2;
    }
    items.push({
      id: `item-${i}`,
      kind,
      category: CATEGORY_OF[kind],
      position: [x, 0.15, z],
      rotation: rand() * Math.PI * 2,
      collected: false,
      placed: false,
    });
  });

  // A few extra clutter items for atmosphere (optional pickup, count toward chaos)
  for (let i = 0; i < 6; i++) {
    const kind = KIND_POOL[Math.floor(rand() * KIND_POOL.length)];
    const angle = rand() * Math.PI * 2;
    const radius = 1.5 + rand() * 6;
    const x = Math.cos(angle) * radius * 0.7;
    let z = Math.sin(angle) * radius * 0.55 + 2;
    if (z < -4) z = -3 + rand();
    items.push({
      id: `extra-${i}`,
      kind,
      category: CATEGORY_OF[kind],
      position: [x, 0.15, z],
      rotation: rand() * Math.PI * 2,
      collected: false,
      placed: false,
    });
  }

  return items;
}

export const ITEM_LABELS: Record<ItemKind, string> = {
  sword: "Sword",
  mace: "Mace",
  shield: "Shield",
  scroll: "Scroll",
  potion_red: "Red Potion",
  potion_blue: "Blue Potion",
  potion_green: "Green Potion",
  coin: "Gold Coin",
  gem: "Gem",
  chest: "Treasure Chest",
  skull: "Skull",
  bone: "Bone",
};
