"use client";

import { useGameStore } from "../store";
import { sfx } from "../audio";

export function TitleScreen() {
  const phase = useGameStore((s) => s.phase);
  const startGame = useGameStore((s) => s.startGame);
  if (phase !== "title") return null;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center overflow-hidden bg-[#0c0a08]">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-[#a855f7] blur-[100px]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#1a1208] to-transparent" />
      </div>
      <div className="relative z-10 mx-4 max-w-lg text-center">
        <div className="mb-2 text-sm tracking-[0.35em] text-[#c084fc]">BRAINBREEZE GAMES</div>
        <h1
          className="mb-3 text-5xl font-bold tracking-wide text-[#f5e6c8] md:text-6xl"
          style={{ textShadow: "0 0 24px #a855f780, 0 4px 0 #3a2a18" }}
        >
          Dungeon Heart
        </h1>
        <p className="mx-auto mb-8 max-w-md text-[15px] leading-relaxed text-[#c4b090]">
          Sort the scattered relics into their rightful shelves. Fill every
          cabinet, awaken the crystal, and restore quiet order to the deep.
        </p>
        <button
          type="button"
          className="btn-wood px-10 py-3 text-lg font-bold"
          onClick={() => {
            sfx.spell();
            startGame();
          }}
        >
          Enter the Dungeon
        </button>
        <div className="mt-8 grid grid-cols-2 gap-3 text-left text-[12px] text-[#a89068] md:grid-cols-4">
          {[
            ["Pick up", "Walk & press E"],
            ["Sort", "Match shelf colors"],
            ["Spells", "Keys 1–5"],
            ["Awaken", "Fill all 5 shelves"],
          ].map(([t, d]) => (
            <div key={t} className="rounded-sm border border-[#5a4028]/60 bg-[#1a1208]/70 p-2">
              <div className="font-bold text-[#efc84a]">{t}</div>
              <div>{d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PauseScreen() {
  const phase = useGameStore((s) => s.phase);
  const setPhase = useGameStore((s) => s.setPhase);
  const resetGame = useGameStore((s) => s.resetGame);
  if (phase !== "paused") return null;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="panel w-[320px] text-center">
        <div className="panel-title text-xl">Paused</div>
        <p className="mb-4 text-[13px] text-[#4a3820]">
          The Heart waits patiently…
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="btn-wood"
            onClick={() => {
              sfx.click();
              setPhase("playing");
            }}
          >
            Resume
          </button>
          <button
            type="button"
            className="btn-wood"
            onClick={() => {
              sfx.click();
              resetGame();
            }}
          >
            Restart
          </button>
          <button
            type="button"
            className="btn-wood"
            onClick={() => {
              sfx.click();
              useGameStore.setState({ phase: "title" });
            }}
          >
            Title
          </button>
        </div>
      </div>
    </div>
  );
}

export function VictoryScreen() {
  const phase = useGameStore((s) => s.phase);
  const elapsed = useGameStore((s) => s.elapsed);
  const missorts = useGameStore((s) => s.missorts);
  const chaosMode = useGameStore((s) => s.chaosMode);
  const resetGame = useGameStore((s) => s.resetGame);

  if (phase !== "victory") return null;

  const m = Math.floor(elapsed / 60);
  const s = Math.floor(elapsed % 60);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#0c0a08]/75 backdrop-blur-sm">
      <div className="panel mx-4 w-[min(420px,94vw)] text-center">
        <div className="mb-1 text-sm tracking-widest text-[#a855f7]">AWAKENED</div>
        <h2 className="panel-title mb-2 text-3xl">The Dungeon Heart Beats</h2>
        <p className="mb-4 text-[13px] leading-relaxed text-[#4a3820]">
          Relics rest in their rightful homes. Purple light floods the hall.
          Somewhere deep below, something ancient sighs in relief.
        </p>
        <div className="mb-5 grid grid-cols-3 gap-2 text-[12px]">
          <div className="rounded-sm bg-[#2a2010]/30 p-2">
            <div className="text-[#8a6a30]">Time</div>
            <div className="font-bold text-[#3a2a18]">
              {m}:{String(s).padStart(2, "0")}
            </div>
          </div>
          <div className="rounded-sm bg-[#2a2010]/30 p-2">
            <div className="text-[#8a6a30]">Missorts</div>
            <div className="font-bold text-[#3a2a18]">{missorts}</div>
          </div>
          <div className="rounded-sm bg-[#2a2010]/30 p-2">
            <div className="text-[#8a6a30]">Chaos</div>
            <div className="font-bold text-[#3a2a18]">
              {chaosMode ? "Yes!" : "No"}
            </div>
          </div>
        </div>
        <button
          type="button"
          className="btn-wood px-8 py-2.5 font-bold"
          onClick={() => {
            sfx.spell();
            resetGame();
          }}
        >
          Sort Again
        </button>
      </div>
    </div>
  );
}
