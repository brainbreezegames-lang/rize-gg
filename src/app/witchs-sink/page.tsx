"use client";

import dynamic from "next/dynamic";
import { TitleScreen, HUD, PauseOverlay, EndScreens } from "@/game/witchs-sink/ui/GameUI";
import { useGameKeys } from "@/game/witchs-sink/systems/useGameKeys";

const GameCanvas = dynamic(
  () =>
    import("@/game/witchs-sink/components/GameCanvas").then((m) => m.GameCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-[#0a0612] text-[#c4a574]">
        Kindling the hearth…
      </div>
    ),
  }
);

function GameShell() {
  useGameKeys();
  return (
    <>
      <GameCanvas />
      <TitleScreen />
      <HUD />
      <PauseOverlay />
      <EndScreens />
    </>
  );
}

export default function WitchsSinkPage() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0a0612] select-none">
      <GameShell />
    </main>
  );
}
