"use client";

import { useGameStore } from "../store/gameStore";
import {
  BASIN_NAMES,
  GRIME_COLORS,
  GRIME_NAMES,
  SHAPE_LABELS,
  type PlayMode,
} from "../types";
import { SEQUENCE_LENGTH, SPEED_LIMIT_SECONDS } from "../data/dishes";
import { canUseAbility } from "../systems/washLogic";
import { sfx } from "../audio/sfx";

export function TitleScreen() {
  const phase = useGameStore((s) => s.phase);
  const startGame = useGameStore((s) => s.startGame);
  const achievements = useGameStore((s) => s.achievements);

  if (phase !== "title") return null;

  const modes: { id: PlayMode; title: string; desc: string }[] = [
    {
      id: "normal",
      title: "Washing Ritual",
      desc: "Follow the recipe scroll. Unlock sink miracles as you progress.",
    },
    {
      id: "devotee",
      title: "Recipe Devotee",
      desc: "No scent, no sprite, no rinse — read the grime with your own eyes.",
    },
    {
      id: "speed",
      title: "Timeless Tidying",
      desc: `Complete all 30 washes within ${SPEED_LIMIT_SECONDS / 60} minutes.`,
    },
    {
      id: "chaos",
      title: "Suds of Chaos",
      desc: "Mismatch every basin on purpose. Brew a disaster.",
    },
    {
      id: "spotless",
      title: "Spotless Spirit",
      desc: "Wash every dish in the kitchen — recipe and extras alike.",
    },
  ];

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-b from-[#0a0612]/95 via-[#12081c]/90 to-[#0a0612]/95 pointer-events-auto">
      <div className="max-w-3xl w-full mx-4 flex flex-col gap-6 text-center">
        <div className="flex flex-col gap-2">
          <p className="text-[#c4a574] text-sm tracking-[0.25em] uppercase">A Sudsy Sorting Spell</p>
          <h1
            className="text-4xl md:text-5xl font-bold text-[#e8d5b0]"
            style={{ textShadow: "0 0 40px rgba(155,89,245,0.45)" }}
          >
            The Witch&apos;s Sink
          </h1>
          <p className="text-[#a290b8] text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            You are a nameless hearth-spirit in the drainpipe. An apprentice&apos;s charm failed.
            Sort magical grime, wash in the true basin, and cook a spell with soap and order.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {modes.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                sfx.click();
                startGame(m.id);
              }}
              className="text-left rounded-lg border border-[#3a2a50] bg-[#16101f]/90 hover:border-[#9B59F5] hover:bg-[#1e1528] transition-all p-4 cursor-pointer group"
            >
              <div className="text-[#e8d5b0] font-semibold group-hover:text-[#c9a0ff] transition-colors">
                {m.title}
              </div>
              <div className="text-[#8a7a9a] text-xs mt-1 leading-relaxed">{m.desc}</div>
            </button>
          ))}
        </div>

        <div className="border border-[#2a2035] rounded-lg p-4 bg-[#100c18]/80">
          <p className="text-[#c4a574] text-xs tracking-widest uppercase mb-2">Achievements</p>
          <div className="grid sm:grid-cols-2 gap-2 text-left">
            {achievements.map((a) => (
              <div key={a.id} className="flex gap-2 items-start">
                <span className={a.unlocked ? "text-[#FFD700]" : "text-[#3a3045]"}>★</span>
                <div>
                  <div className={`text-xs font-medium ${a.unlocked ? "text-[#e8d5b0]" : "text-[#5a4a6a]"}`}>
                    {a.title}
                  </div>
                  <div className="text-[10px] text-[#6a5a7a]">{a.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[#5a4a6a] text-xs">
          Drag to look · Gold marker = next recipe dish · Click dish → basin (1/2/3) → Place (E)
        </p>
      </div>
    </div>
  );
}

export function HUD() {
  const phase = useGameStore((s) => s.phase);
  const sequenceIndex = useGameStore((s) => s.sequenceIndex);
  const recipe = useGameStore((s) => s.recipe);
  const mode = useGameStore((s) => s.mode);
  const elapsedMs = useGameStore((s) => s.elapsedMs);
  const speedDeadlineMs = useGameStore((s) => s.speedDeadlineMs);
  const cleanKitchenCount = useGameStore((s) => s.cleanKitchenCount);
  const totalDishes = useGameStore((s) => s.totalDishes);
  const heldDishId = useGameStore((s) => s.heldDishId);
  const hoveredDishId = useGameStore((s) => s.hoveredDishId);
  const dishes = useGameStore((s) => s.dishes);
  const greatRinseUsed = useGameStore((s) => s.greatRinseUsed);
  const pause = useGameStore((s) => s.pause);
  const activateScent = useGameStore((s) => s.activateScent);
  const askDrainSprite = useGameStore((s) => s.askDrainSprite);
  const useGreatRinse = useGameStore((s) => s.useGreatRinse);
  const placeOnBoard = useGameStore((s) => s.placeOnBoard);
  const putInCupboard = useGameStore((s) => s.putInCupboard);
  const toasts = useGameStore((s) => s.toasts);
  const lastReaction = useGameStore((s) => s.lastReaction);

  if (phase === "title" || phase === "victory" || phase === "chaos_ending" || phase === "epilogue") {
    return null;
  }

  const next = recipe[sequenceIndex];
  const held = dishes.find((d) => d.id === heldDishId);
  const hovered = dishes.find((d) => d.id === hoveredDishId);
  const inspect = held ?? hovered;
  const clean = dishes.find((d) => d.status === "clean");

  const mins = Math.floor(elapsedMs / 60000);
  const secs = Math.floor((elapsedMs % 60000) / 1000);
  const remain = Math.max(0, speedDeadlineMs - elapsedMs);
  const rm = Math.floor(remain / 60000);
  const rs = Math.floor((remain % 60000) / 1000);

  const scentOk = canUseAbility("scent_of_sorting", sequenceIndex, mode, greatRinseUsed);
  const spriteOk = canUseAbility("drain_sprite", sequenceIndex, mode, greatRinseUsed);
  const rinseOk = canUseAbility("great_rinse", sequenceIndex, mode, greatRinseUsed);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Objective */}
      <div className="absolute top-4 left-4 pointer-events-auto">
        <div className="rounded-lg border border-[#3a2a50] bg-[#100c18]/90 backdrop-blur-sm px-4 py-3 min-w-[220px]">
          <div className="flex items-center gap-2 text-[#FFD700] text-xs font-semibold tracking-wide">
            <span>★</span>
            <span>OBJECTIVE</span>
          </div>
          <p className="text-[#e8d5b0] text-sm mt-1">Complete the recipe sequence</p>
          <div className="mt-2 h-2 rounded-full bg-[#1a1424] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#7B3FE4] to-[#c9a0ff] transition-all duration-500"
              style={{ width: `${(sequenceIndex / SEQUENCE_LENGTH) * 100}%` }}
            />
          </div>
          <p className="text-[#8a7a9a] text-xs mt-1">
            {sequenceIndex} / {SEQUENCE_LENGTH}
          </p>
          {mode === "speed" && (
            <p className="text-[#FF8C22] text-xs mt-1">
              Time left {rm}:{rs.toString().padStart(2, "0")}
            </p>
          )}
          {mode === "spotless" && (
            <p className="text-[#2ECCF0] text-xs mt-1">
              Clean kitchen {cleanKitchenCount} / {totalDishes}
            </p>
          )}
        </div>
      </div>

      {/* Abilities */}
      <div className="absolute top-4 right-4 pointer-events-auto flex flex-col gap-2">
        <button
          type="button"
          onClick={() => pause()}
          className="self-end text-xs px-3 py-1.5 rounded border border-[#3a2a50] bg-[#100c18]/90 text-[#c4a574] hover:border-[#9B59F5] cursor-pointer"
        >
          Pause
        </button>
        {mode !== "devotee" && (
          <div className="rounded-lg border border-[#3a2a50] bg-[#100c18]/90 p-3 flex flex-col gap-2 min-w-[200px]">
            <p className="text-[#c4a574] text-[10px] tracking-widest uppercase">Sink Miracles</p>
            <AbilityBtn
              label="Scent of Sorting"
              hint="Grime glows by scent"
              unlocked={scentOk}
              lockedAt="5"
              onClick={activateScent}
            />
            <AbilityBtn
              label="Drain-Sprite"
              hint="Fetches the next dish"
              unlocked={spriteOk}
              lockedAt="10"
              onClick={askDrainSprite}
            />
            <AbilityBtn
              label="Great Rinse"
              hint="Wash all dirty dishes"
              unlocked={rinseOk}
              lockedAt="20"
              onClick={useGreatRinse}
              spent={greatRinseUsed}
            />
          </div>
        )}
      </div>

      {/* Inspect tooltip */}
      {inspect && (
        <div className="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none">
          <div className="rounded-lg border border-[#3a2a50] bg-[#100c18]/95 px-3 py-2 max-w-[200px]">
            <p className="text-[#e8d5b0] text-sm font-medium">
              {SHAPE_LABELS[inspect.shape]} · {inspect.material}
            </p>
            <p className="text-xs mt-1" style={{ color: GRIME_COLORS[inspect.grime] }}>
              {inspect.grimeLabel}
            </p>
            <p className="text-[#8a7a9a] text-[10px] mt-1">
              Wash in {BASIN_NAMES[
                inspect.grime === "illusion"
                  ? "moonwater"
                  : inspect.grime === "elemental"
                    ? "sunfire"
                    : "still"
              ]}
            </p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-24 left-4 pointer-events-none">
        <div className="rounded-lg border border-[#2a2035] bg-[#100c18]/85 px-3 py-2 text-[10px] space-y-1">
          <p className="text-[#c4a574] tracking-wide uppercase mb-1">Scent Legend</p>
          <p>
            <span className="inline-block w-2 h-2 rounded-sm mr-2" style={{ background: GRIME_COLORS.illusion }} />
            {GRIME_NAMES.illusion} → Moonwater
          </p>
          <p>
            <span className="inline-block w-2 h-2 rounded-sm mr-2" style={{ background: GRIME_COLORS.elemental }} />
            {GRIME_NAMES.elemental} → Sunfire
          </p>
          <p>
            <span className="inline-block w-2 h-2 rounded-sm mr-2" style={{ background: GRIME_COLORS.temporal }} />
            {GRIME_NAMES.temporal} → Still
          </p>
        </div>
      </div>

      {/* Tutorial bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto w-[min(920px,94vw)]">
        <div className="rounded-xl border border-[#3a2a50] bg-[#100c18]/92 backdrop-blur-md px-4 py-3 flex flex-wrap items-center justify-center gap-4 md:gap-8">
          <Step n={1} label="Sort grime" active={!!held || !clean} />
          <Step n={2} label="Wash basin" active={!!held} />
          <Step n={3} label="Place on board" active={!!clean} />
          {clean && (
            <button
              type="button"
              onClick={() => {
                if (clean.inRecipe) placeOnBoard();
                else putInCupboard(clean.id);
              }}
              className="ml-2 px-4 py-2 rounded-md bg-[#7B3FE4] hover:bg-[#9B59F5] text-white text-sm font-medium cursor-pointer transition-colors"
            >
              {clean.inRecipe ? "Place on Board" : "Cupboard"}
            </button>
          )}
          {next && (
            <p className="text-[#8a7a9a] text-xs w-full text-center md:w-auto md:ml-auto">
              Next: {SHAPE_LABELS[next.shape]} · {GRIME_NAMES[next.grime]}
            </p>
          )}
        </div>
        {lastReaction && (
          <p className="text-center text-[#c9a0ff] text-xs mt-2 animate-pulse">{lastReaction}</p>
        )}
      </div>

      {/* Toasts */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 flex flex-col gap-2 items-center">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-none px-4 py-2 rounded-lg text-sm border backdrop-blur-sm ${
              t.kind === "success"
                ? "bg-[#0f2018]/90 border-[#16A249] text-[#9dffc0]"
                : t.kind === "error"
                  ? "bg-[#201010]/90 border-[#A83A3A] text-[#ffb0b0]"
                  : t.kind === "magic"
                    ? "bg-[#1a1030]/90 border-[#9B59F5] text-[#e0c8ff]"
                    : "bg-[#101018]/90 border-[#3a2a50] text-[#d0c8e0]"
            }`}
          >
            {t.text}
          </div>
        ))}
      </div>

      <p className="absolute top-4 left-1/2 -translate-x-1/2 text-[#5a4a6a] text-[10px]">
        {mins}:{secs.toString().padStart(2, "0")} · {mode}
      </p>
    </div>
  );
}

function Step({ n, label, active }: { n: number; label: string; active: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
          active ? "bg-[#7B3FE4] text-white" : "bg-[#2a2035] text-[#8a7a9a]"
        }`}
      >
        {n}
      </span>
      <span className={`text-xs ${active ? "text-[#e8d5b0]" : "text-[#6a5a7a]"}`}>{label}</span>
    </div>
  );
}

function AbilityBtn({
  label,
  hint,
  unlocked,
  lockedAt,
  onClick,
  spent,
}: {
  label: string;
  hint: string;
  unlocked: boolean;
  lockedAt: string;
  onClick: () => void;
  spent?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={!unlocked || spent}
      onClick={onClick}
      className={`text-left rounded px-2 py-1.5 text-xs border transition-colors cursor-pointer disabled:cursor-not-allowed ${
        spent
          ? "border-[#2a2035] text-[#4a3a5a] opacity-50"
          : unlocked
            ? "border-[#5a3080] bg-[#1a1030] text-[#e0c8ff] hover:border-[#9B59F5]"
            : "border-[#2a2035] text-[#4a3a5a]"
      }`}
    >
      <div className="font-medium">{label}</div>
      <div className="text-[10px] opacity-70">{spent ? "Spent" : unlocked ? hint : `Unlocks at ${lockedAt}`}</div>
    </button>
  );
}

export function PauseOverlay() {
  const phase = useGameStore((s) => s.phase);
  const resume = useGameStore((s) => s.resume);
  const returnToTitle = useGameStore((s) => s.returnToTitle);
  if (phase !== "paused") return null;
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 pointer-events-auto">
      <div className="bg-[#12081c] border border-[#3a2a50] rounded-xl p-8 flex flex-col gap-4 min-w-[260px] text-center">
        <h2 className="text-2xl text-[#e8d5b0] font-bold">Paused</h2>
        <button
          type="button"
          onClick={resume}
          className="px-4 py-2 rounded-md bg-[#7B3FE4] text-white cursor-pointer hover:bg-[#9B59F5]"
        >
          Resume
        </button>
        <button
          type="button"
          onClick={returnToTitle}
          className="px-4 py-2 rounded-md border border-[#3a2a50] text-[#c4a574] cursor-pointer hover:border-[#9B59F5]"
        >
          Return to Title
        </button>
      </div>
    </div>
  );
}

export function EndScreens() {
  const phase = useGameStore((s) => s.phase);
  const returnToTitle = useGameStore((s) => s.returnToTitle);
  const startGame = useGameStore((s) => s.startGame);
  const mode = useGameStore((s) => s.mode);
  const mistakes = useGameStore((s) => s.mistakes);
  const elapsedMs = useGameStore((s) => s.elapsedMs);
  const cleanKitchenCount = useGameStore((s) => s.cleanKitchenCount);

  if (phase !== "victory" && phase !== "chaos_ending" && phase !== "epilogue") return null;

  const mins = Math.floor(elapsedMs / 60000);
  const secs = Math.floor((elapsedMs % 60000) / 1000);

  if (phase === "chaos_ending") {
    return (
      <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#1a0505]/90 pointer-events-auto">
        <div className="max-w-lg mx-4 text-center flex flex-col gap-4">
          <h2 className="text-3xl font-bold text-[#ff6666]">Suds of Chaos</h2>
          <p className="text-[#e8b0b0] leading-relaxed">
            The oven sneezes flour. The spoons tangle into a knot. An angry broom animates and
            chases you from the kitchen.
          </p>
          <blockquote className="text-[#c4a574] italic border-l-2 border-[#A83A3A] pl-4 text-left">
            &ldquo;You have brewed a disaster. My soup is now a frog. Kindly never touch my sink
            again.&rdquo;
            <footer className="text-xs mt-2 not-italic text-[#8a7a6a]">— Note from the Witch</footer>
          </blockquote>
          <button
            type="button"
            onClick={returnToTitle}
            className="px-4 py-2 rounded-md bg-[#A83A3A] text-white cursor-pointer"
          >
            Flee to Title
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#0a0612]/92 pointer-events-auto">
      <div className="max-w-lg mx-4 text-center flex flex-col gap-4">
        <p className="text-[#c4a574] text-sm tracking-[0.2em] uppercase">
          {phase === "epilogue" ? "Spotless Spirit" : "Grand Spell Complete"}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#e8d5b0]">
          {phase === "epilogue" ? "The Mural Awakens" : "The Kitchen Lives"}
        </h2>
        <p className="text-[#a290b8] leading-relaxed">
          {phase === "epilogue"
            ? "Behind the drying rack, a hidden mural depicts your origin — a spark of dishwater given kindness, forever tending the witch’s hearth."
            : "Spoons stir the air. The oven hums a lullaby. A pantry door creaks open to the witch’s secret larder of rare ingredients — your reward."}
        </p>
        <div className="grid grid-cols-3 gap-3 text-xs text-[#8a7a9a]">
          <div className="rounded border border-[#2a2035] p-2">
            <div className="text-[#e8d5b0] text-lg font-semibold">
              {mins}:{secs.toString().padStart(2, "0")}
            </div>
            Time
          </div>
          <div className="rounded border border-[#2a2035] p-2">
            <div className="text-[#e8d5b0] text-lg font-semibold">{mistakes}</div>
            Mistakes
          </div>
          <div className="rounded border border-[#2a2035] p-2">
            <div className="text-[#e8d5b0] text-lg font-semibold">{cleanKitchenCount}</div>
            Cleared
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            type="button"
            onClick={() => startGame(mode)}
            className="px-4 py-2 rounded-md bg-[#7B3FE4] text-white cursor-pointer hover:bg-[#9B59F5]"
          >
            Wash Again
          </button>
          <button
            type="button"
            onClick={returnToTitle}
            className="px-4 py-2 rounded-md border border-[#3a2a50] text-[#c4a574] cursor-pointer"
          >
            Title
          </button>
        </div>
      </div>
    </div>
  );
}
