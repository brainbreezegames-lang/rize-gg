import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Witch’s Sink — A Sudsy Sorting Spell",
  description:
    "Sort magical grime, wash in enchanted basins, and complete the recipe ritual in a gritty voxel witch’s kitchen.",
};

export default function WitchsSinkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
