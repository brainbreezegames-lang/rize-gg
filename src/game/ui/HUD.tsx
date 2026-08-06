"use client";

import { useGameStore } from "../store";
import { ITEM_LABELS, MAX_ENERGY, MAX_INVENTORY, SHELVES, SPELLS } from "../constants";
import { sfx } from "../audio";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function HUD() {
  const phase = useGameStore((s) => s.phase);
  if (phase !== "playing" && phase !== "paused") return null;

  return (
    <div className="hud-root pointer-events-none absolute inset-0 z-10 select-none">
      <ObjectivePanel />
      <TutorialPanel />
      <SpellsPanel />
      <InventoryBar />
      <LevelPanel />
      <Toasts />
      <ControlsHint />
    </div>
  );
}

function ObjectivePanel() {
  const placed = useGameStore((s) => s.placedCount);
  const total = useGameStore((s) => s.totalSlots);
  const heart = useGameStore((s) => s.heartPower);
  const pct = Math.round((placed / total) * 100);

  return (
    <div className="pointer-events-auto absolute left-4 top-4 w-[280px]">
      <div className="panel">
        <div className="panel-title">Objective</div>
        <p className="text-[13px] leading-snug text-[#3a2a18]">
          Sort all items to awaken the Dungeon Heart!
        </p>
        <div className="mt-2">
          <div className="mb-1 flex justify-between text-[11px] font-semibold text-[#5a4020]">
            <span>Progress</span>
            <span>{pct}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-sm border border-[#8a6a30] bg-[#2a2010]">
            <div
              className="h-full bg-gradient-to-r from-[#a855f7] to-[#c084fc] transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div className="mt-3">
          <div className="mb-1 text-[11px] font-semibold text-[#5a4020]">Heart Power</div>
          <div className="flex gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex h-8 w-8 items-center justify-center"
                style={{
                  clipPath:
                    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  background: i < heart ? "#a855f7" : "#4a3a28",
                  boxShadow: i < heart ? "0 0 8px #c084fc" : "none",
                }}
              >
                {i < heart && (
                  <span className="text-[10px] text-white">◆</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const TUTORIAL = [
  {
    title: "1. Pick Up Items",
    body: "Walk over items and press E / Space, or click them.",
  },
  {
    title: "2. Check Category",
    body: "Each shelf has a category. Match swords to Armory, potions to Alchemy…",
  },
  {
    title: "3. Place Correctly",
    body: "Stand on a shelf pad (or click the shelf) with an item selected.",
  },
  {
    title: "4. Complete & Restore",
    body: "Fill all slots to send power to the Heart!",
  },
];

function TutorialPanel() {
  const step = useGameStore((s) => s.tutorialStep);
  const dismissed = useGameStore((s) => s.tutorialDismissed);
  const dismiss = useGameStore((s) => s.dismissTutorial);
  if (dismissed) return null;

  return (
    <div className="pointer-events-auto absolute left-4 top-[210px] flex w-[240px] flex-col gap-2">
      {TUTORIAL.map((t, i) => (
        <div
          key={t.title}
          className={`panel py-2 transition-opacity ${
            i === step ? "opacity-100 ring-2 ring-[#c9a227]" : "opacity-55"
          }`}
        >
          <div className="panel-title text-[12px]">{t.title}</div>
          <p className="text-[11px] leading-snug text-[#4a3820]">{t.body}</p>
        </div>
      ))}
      <button
        type="button"
        className="btn-wood self-start text-[11px]"
        onClick={() => {
          sfx.click();
          dismiss();
        }}
      >
        Got it
      </button>
    </div>
  );
}

function SpellsPanel() {
  const energy = useGameStore((s) => s.energy);
  const unlocked = useGameStore((s) => s.unlockedSpells);
  const castSpell = useGameStore((s) => s.castSpell);
  const placed = useGameStore((s) => s.placedCount);

  return (
    <div className="pointer-events-auto absolute right-4 top-4 w-[220px]">
      <div className="panel">
        <div className="panel-title">Spells</div>
        <ul className="space-y-1.5">
          {SPELLS.map((sp) => {
            const open = unlocked.includes(sp.id);
            return (
              <li key={sp.id}>
                <button
                  type="button"
                  disabled={!open || energy < sp.cost}
                  className={`flex w-full items-center gap-2 rounded-sm px-1.5 py-1 text-left text-[12px] transition ${
                    open
                      ? "hover:bg-[#e8d5a8]/60 cursor-pointer text-[#2a1a08]"
                      : "cursor-not-allowed text-[#8a7a60] opacity-60"
                  }`}
                  onClick={() => {
                    if (castSpell(sp.id)) sfx.spell();
                  }}
                  title={
                    open
                      ? sp.description
                      : `Unlocks after placing ${sp.unlockAt} items`
                  }
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-[#3a2a18] text-[10px] font-bold text-[#efc84a]">
                    {sp.hotkey}
                  </span>
                  <span className="flex-1 font-medium">
                    {open ? sp.name : "Locked"}
                  </span>
                  <span className="text-[10px] text-[#6a5020]">
                    {open ? `${sp.cost}✦` : `${sp.unlockAt}↑`}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-3 border-t border-[#c9a870]/50 pt-2">
          <div className="mb-1 text-[11px] font-semibold text-[#5a4020]">
            Spell Energy
          </div>
          <div className="flex gap-1">
            {Array.from({ length: MAX_ENERGY }).map((_, i) => (
              <div
                key={i}
                className="h-4 w-4 rounded-full border border-[#4a80c0]"
                style={{
                  background:
                    i < energy
                      ? "radial-gradient(circle at 30% 30%, #a0d8ff, #3a80e0)"
                      : "#2a3040",
                  boxShadow: i < energy ? "0 0 6px #60a5fa" : "none",
                }}
              />
            ))}
          </div>
          <p className="mt-1 text-[10px] text-[#6a5528]">
            Placed {placed} · Energy restores every 3 correct placements
          </p>
        </div>
      </div>
    </div>
  );
}

function InventoryBar() {
  const inventory = useGameStore((s) => s.inventory);
  const items = useGameStore((s) => s.items);
  const selected = useGameStore((s) => s.selectedInv);
  const selectInventory = useGameStore((s) => s.selectInventory);

  return (
    <div className="pointer-events-auto absolute bottom-5 left-1/2 w-[min(640px,94vw)] -translate-x-1/2">
      <div className="panel px-3 py-2">
        <div className="mb-1.5 flex items-center justify-between">
          <div className="panel-title mb-0">Items in Hand</div>
          <div className="text-[12px] font-semibold text-[#5a4020]">
            {inventory.length}/{MAX_INVENTORY}
          </div>
        </div>
        <div className="flex justify-center gap-1.5">
          {Array.from({ length: MAX_INVENTORY }).map((_, i) => {
            const id = inventory[i];
            const item = id ? items.find((it) => it.id === id) : null;
            const shelf = item
              ? SHELVES.find((s) => s.id === item.category)
              : null;
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  sfx.click();
                  selectInventory(i);
                }}
                className={`relative flex h-12 w-12 flex-col items-center justify-center rounded-sm border-2 bg-[#2a2010] transition ${
                  selected === i
                    ? "border-[#efc84a] shadow-[0_0_10px_#efc84a80]"
                    : "border-[#6a5028] hover:border-[#c9a870]"
                }`}
                title={item ? ITEM_LABELS[item.kind] : `Slot ${i + 1}`}
              >
                {item && (
                  <>
                    <span
                      className="h-5 w-5 rounded-sm"
                      style={{ background: shelf?.bannerColor ?? "#888" }}
                    />
                    <span className="mt-0.5 max-w-full truncate px-0.5 text-[8px] text-[#e8d5a8]">
                      {ITEM_LABELS[item.kind].split(" ")[0]}
                    </span>
                  </>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 text-[8px] text-[#8a7a50]">
                  {i + 1 > 9 ? "" : ""}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-1.5 text-center text-[10px] text-[#6a5528]">
          Click a shelf pad or press F near it · [ ] cycle selection · E pickup
        </p>
      </div>
    </div>
  );
}

function LevelPanel() {
  const level = useGameStore((s) => s.level);
  const day = useGameStore((s) => s.day);
  const elapsed = useGameStore((s) => s.elapsed);
  const playerPos = useGameStore((s) => s.playerPos);
  const items = useGameStore((s) => s.items);
  const toggleChaos = useGameStore((s) => s.toggleChaos);
  const setPhase = useGameStore((s) => s.setPhase);

  // Simple minimap coords: room -10..10 → 0..100%
  const px = ((playerPos[0] + 10) / 20) * 100;
  const pz = ((playerPos[2] + 10) / 20) * 100;

  return (
    <div className="pointer-events-auto absolute bottom-5 right-4 w-[180px]">
      <div className="panel py-2">
        <div className="flex items-center justify-between text-[12px] font-bold text-[#3a2a18]">
          <span>Dungeon Level {level}</span>
        </div>
        <div className="mt-0.5 flex justify-between text-[11px] text-[#5a4020]">
          <span>Day {day}</span>
          <span className="font-mono">{formatTime(elapsed)}</span>
        </div>
        <div className="relative mt-2 h-[110px] overflow-hidden rounded-sm border border-[#8a6a30] bg-[#1a2418]">
          {/* shelves markers */}
          {SHELVES.map((s) => {
            const x = ((s.position[0] + 10) / 20) * 100;
            const z = ((s.position[2] + 10) / 20) * 100;
            return (
              <div
                key={s.id}
                className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-sm"
                style={{ left: `${x}%`, top: `${z}%`, background: s.bannerColor }}
              />
            );
          })}
          {/* floor items */}
          {items
            .filter((i) => !i.collected && !i.placed)
            .map((i) => (
              <div
                key={i.id}
                className="absolute h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e8d5a8]"
                style={{
                  left: `${((i.position[0] + 10) / 20) * 100}%`,
                  top: `${((i.position[2] + 10) / 20) * 100}%`,
                }}
              />
            ))}
          {/* player */}
          <div
            className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 text-[10px] leading-none text-[#c084fc]"
            style={{ left: `${px}%`, top: `${pz}%` }}
          >
            ★
          </div>
          {/* heart */}
          <div
            className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#a855f7]"
            style={{ left: "50%", top: "19%" }}
          />
        </div>
        <div className="mt-2 flex gap-1">
          <button
            type="button"
            className="btn-wood flex-1 text-[10px]"
            onClick={() => {
              sfx.click();
              setPhase("paused");
            }}
          >
            Pause
          </button>
          <button
            type="button"
            className="btn-wood flex-1 text-[10px]"
            title="Chaos achievement — scatter everything!"
            onClick={() => {
              sfx.wrong();
              toggleChaos();
            }}
          >
            Chaos!
          </button>
        </div>
      </div>
    </div>
  );
}

function Toasts() {
  const toasts = useGameStore((s) => s.toasts);
  return (
    <div className="pointer-events-none absolute left-1/2 top-24 z-20 flex w-[min(420px,90vw)] -translate-x-1/2 flex-col items-center gap-1">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-sm border px-3 py-1.5 text-[12px] font-semibold shadow-lg animate-[fadeUp_0.3s_ease] ${
            t.kind === "success"
              ? "border-[#4ade80] bg-[#14532d]/90 text-[#bbf7d0]"
              : t.kind === "error"
                ? "border-[#f87171] bg-[#7f1d1d]/90 text-[#fecaca]"
                : t.kind === "spell"
                  ? "border-[#c084fc] bg-[#3b0764]/90 text-[#e9d5ff]"
                  : "border-[#efc84a] bg-[#1a1208]/90 text-[#fde68a]"
          }`}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}

function ControlsHint() {
  return (
    <div className="absolute bottom-36 left-4 hidden text-[10px] text-[#e8d5a8]/70 md:block">
      WASD move · E / click pickup · Click shelf to place · 1–5 spells
    </div>
  );
}
