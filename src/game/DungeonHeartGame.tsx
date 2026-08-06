"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { HUD } from "./ui/HUD";
import { TitleScreen, PauseScreen, VictoryScreen } from "./ui/Screens";
import { useGameStore } from "./store";
import { sfx } from "./audio";

const GameCanvas = dynamic(
  () => import("./GameCanvas").then((m) => m.GameCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#1a1510] text-[#c4b090]">
        Summoning the dungeon…
      </div>
    ),
  }
);

export default function DungeonHeartGame() {
  const phase = useGameStore((s) => s.phase);
  const setPhase = useGameStore((s) => s.setPhase);
  const tryPlaceOnShelf = useGameStore((s) => s.tryPlaceOnShelf);
  const playerPos = useGameStore((s) => s.playerPos);
  const scryShelf = useGameStore((s) => s.scryShelf);

  // F to place on nearest shelf
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const p = useGameStore.getState().phase;
        if (p === "playing") setPhase("paused");
        else if (p === "paused") setPhase("playing");
      }
      if (e.key.toLowerCase() === "f" && useGameStore.getState().phase === "playing") {
        // Find nearest shelf
        const shelves = [
          { id: "armory" as const, pos: [-6.5, -7.2] },
          { id: "scrolls" as const, pos: [-3.25, -7.8] },
          { id: "alchemy" as const, pos: [0, -8.1] },
          { id: "treasury" as const, pos: [3.25, -7.8] },
          { id: "trophies" as const, pos: [6.5, -7.2] },
        ];
        const [px, , pz] = useGameStore.getState().playerPos;
        let best = shelves[0];
        let bestD = Infinity;
        for (const sh of shelves) {
          const d = Math.hypot(sh.pos[0] - px, sh.pos[1] - pz);
          if (d < bestD) {
            bestD = d;
            best = sh;
          }
        }
        if (bestD < 3.2) {
          const ok = tryPlaceOnShelf(best.id);
          if (ok) sfx.place();
          else sfx.wrong();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setPhase, tryPlaceOnShelf, playerPos, scryShelf]);

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#1a1510]">
      {(phase === "playing" || phase === "paused" || phase === "victory") && (
        <GameCanvas />
      )}
      {phase === "title" && (
        <div className="absolute inset-0">
          <GameCanvas />
        </div>
      )}
      <HUD />
      <TitleScreen />
      <PauseScreen />
      <VictoryScreen />
    </div>
  );
}
