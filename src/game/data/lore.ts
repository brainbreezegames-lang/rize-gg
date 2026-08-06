/** Feast guests — one seat per completed set */

import { DISH_SETS } from "./sets";

export interface GuestSeat {
  setId: string;
  name: string;
  title: string;
  /** Position along the feast table (local) */
  tableIndex: number;
}

export const FEAST_GUESTS: GuestSeat[] = DISH_SETS.map((s, i) => ({
  setId: s.id,
  name: s.guestName,
  title: s.guestTitle,
  tableIndex: i,
}));

export const WITCH_NOTES = [
  "The coven arrives at midnight. Everything must be in its place.",
  "A proper feast begins with everything in its proper place.",
  "The final seat awakens the feast. Hurry, Witch.",
  "Did the familiar get into the catnip again? Try again, dear.",
  "Put everything back in its proper place. The feast depends on it. No pressure.",
  "Blue floral goes with blue floral. Even familiars know that.",
  "Lids have souls too — reunite them with their pots.",
];

export const OBJECTIVES = [
  {
    id: "start",
    title: "Tidy the kitchen for the feast!",
    detail: "Store dishes by set and size (largest to smallest).",
  },
  {
    id: "plates",
    title: "Store blue floral plates by size",
    detail: "Largest to smallest — muscle memory.",
  },
  {
    id: "bowls",
    title: "Store the green bowls by size",
    detail: "Nest green bowls large to small.",
  },
  {
    id: "cookware",
    title: "Match the lids to the Dragonfire Copper pot set",
    detail: "All lids must be in their correct size and set.",
  },
  {
    id: "moonlit",
    title: "Collect all Moonlit Willow dishes",
    detail: "They'll be needed for the feast!",
  },
  {
    id: "finale",
    title: "Complete the final Willow set before midnight!",
    detail: "Earn your place at the Coven Feast.",
  },
];

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "old-fashioned",
    name: "Old-Fashioned Housekeeping",
    description: "Complete the kitchen without using any Hearth Charms.",
  },
  {
    id: "cats-revenge",
    name: "Cat's Revenge",
    description: "Unlock chaos mode — deliberately misplace everything.",
  },
  {
    id: "lightning-feast",
    name: "Lightning Feast",
    description: "Complete all main cupboards under 25 minutes.",
  },
  {
    id: "charm-collector",
    name: "Charm Collector",
    description: "Find every Hearth Charm in one playthrough.",
  },
  {
    id: "full-coven",
    name: "The Full Coven",
    description: "Complete every dish set and fill every feast seat.",
  },
  {
    id: "first-glow",
    name: "First Golden Glow",
    description: "Place your first dish correctly.",
  },
  {
    id: "lid-finder",
    name: "Lid Whisperer",
    description: "Match all Dragonfire Copper lids to their pots.",
  },
  {
    id: "cat-friend",
    name: "Familiar Friend",
    description: "Pet the cat (walk up and interact).",
  },
];
