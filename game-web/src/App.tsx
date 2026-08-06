import { GameCanvas } from "@/game/witchs-sink/components/GameCanvas";
import { TitleScreen, HUD, PauseOverlay, EndScreens } from "@/game/witchs-sink/ui/GameUI";
import { useGameKeys } from "@/game/witchs-sink/systems/useGameKeys";

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

export default function App() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#0a0612] select-none">
      <GameShell />
    </main>
  );
}
