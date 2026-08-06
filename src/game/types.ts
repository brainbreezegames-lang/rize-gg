export type ItemCategory = "armory" | "scrolls" | "alchemy" | "treasury" | "trophies";

export type ItemKind =
  | "sword"
  | "mace"
  | "shield"
  | "scroll"
  | "potion_red"
  | "potion_blue"
  | "potion_green"
  | "coin"
  | "gem"
  | "chest"
  | "skull"
  | "bone";

export interface GameItem {
  id: string;
  kind: ItemKind;
  category: ItemCategory;
  position: [number, number, number];
  rotation: number;
  collected: boolean;
  placed: boolean;
  shelfSlot?: number;
}

export interface ShelfDef {
  id: ItemCategory;
  name: string;
  color: string;
  bannerColor: string;
  position: [number, number, number];
  slots: number;
  kinds: ItemKind[];
}

export type SpellId =
  | "jump"
  | "identify"
  | "magnet"
  | "servant"
  | "scry";

export interface SpellDef {
  id: SpellId;
  name: string;
  hotkey: string;
  cost: number;
  description: string;
  unlockAt: number; // items placed required
}

export type GamePhase = "title" | "playing" | "paused" | "victory";
