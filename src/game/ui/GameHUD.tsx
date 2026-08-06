"use client";

import { useEffect, useState } from "react";
import { useGameStore, inventoryStacks } from "../store/gameStore";
import { CHARM_DEFS } from "../data/items";
import { ACHIEVEMENTS } from "../data/lore";
import { getSet, DISH_SETS } from "../data/sets";
import { KitchenMap } from "./KitchenMap";

const parchment: React.CSSProperties = {
  background: "linear-gradient(145deg, #E8D5B0 0%, #D4C09A 50%, #C9B48A 100%)",
  border: "3px solid #5C3A1E",
  boxShadow: "0 4px 20px rgba(0,0,0,0.55), inset 0 0 30px rgba(90,50,20,0.15)",
  color: "#2A1A0A",
  fontFamily: "var(--font-oxanium), Oxanium, monospace",
  imageRendering: "pixelated" as const,
};

export function GameHUD() {
  const phase = useGameStore((s) => s.phase);
  if (phase === "title") return <TitleScreen />;
  if (phase === "feast") return <FeastEnding />;
  if (phase === "achievements") return <AchievementsScreen />;
  return (
    <>
      <PlayingHUD />
      <KitchenMap />
      {phase === "paused" && <PauseMenu />}
    </>
  );
}

function TitleScreen() {
  const startGame = useGameStore((s) => s.startGame);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at center, #1A1028 0%, #0B0A10 70%)",
        color: "#E8D5B0",
        fontFamily: "var(--font-oxanium), Oxanium, sans-serif",
      }}
    >
      <div
        style={{
          ...parchment,
          padding: "48px 56px",
          maxWidth: 560,
          textAlign: "center",
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.6s ease",
        }}
      >
        <div
          style={{
            fontSize: 12,
            letterSpacing: 4,
            color: "#6B3FA0",
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          A COZY HEARTH TALE
        </div>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 800,
            lineHeight: 1.15,
            margin: "0 0 12px",
            color: "#2A1A0A",
          }}
        >
          Cupboard Tidy Up
        </h1>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            margin: "0 0 24px",
            color: "#6B3FA0",
          }}
        >
          The Witch&apos;s Feast
        </h2>
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.55,
            margin: "0 0 28px",
            color: "#3A2A1A",
          }}
        >
          A mischievous cat familiar scattered every dish across the kitchen.
          Put each piece back by <strong>set</strong> and <strong>size</strong>{" "}
          before midnight — and set the table for the coven.
        </p>
        <button
          onClick={() => startGame()}
          style={{
            background: "#6B3FA0",
            color: "#F5E6FF",
            border: "3px solid #2A1A0A",
            padding: "14px 36px",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
            letterSpacing: 1,
            boxShadow: "0 4px 0 #2A1A0A",
          }}
        >
          BEGIN TIDYING
        </button>
        <p style={{ fontSize: 11, marginTop: 20, opacity: 0.7 }}>
          WASD move · Mouse look · LMB pick up · RMB place · R rotate · 1–6 hotbar
        </p>
      </div>
      <p style={{ marginTop: 24, fontSize: 12, opacity: 0.45 }}>
        Simple to grasp. Deep to master.
      </p>
    </div>
  );
}

function PlayingHUD() {
  const objective = useGameStore((s) => s.getObjective());
  const note = useGameStore((s) => s.getWitchNote());
  const progress = useGameStore((s) => s.getProgress());
  const inventory = useGameStore((s) => s.inventory);
  const items = useGameStore((s) => s.items);
  const selectedSlot = useGameStore((s) => s.selectedSlot);
  const selectSlot = useGameStore((s) => s.selectSlot);
  const unlockedCharms = useGameStore((s) => s.unlockedCharms);
  const activeCharm = useGameStore((s) => s.activeCharm);
  const useCharm = useGameStore((s) => s.useCharm);
  const cooldowns = useGameStore((s) => s.cooldowns);
  const message = useGameStore((s) => s.message);
  const completedSets = useGameStore((s) => s.completedSets);
  const pointerLocked = useGameStore((s) => s.pointerLocked);
  const elapsedMs = useGameStore((s) => s.elapsedMs);

  const stacks = inventoryStacks(inventory, items);

  const mins = Math.floor(elapsedMs / 60000);
  const secs = Math.floor((elapsedMs % 60000) / 1000);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        pointerEvents: "none",
        fontFamily: "var(--font-oxanium), Oxanium, sans-serif",
      }}
    >
      {/* Crosshair */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 10,
          height: 10,
          margin: "-5px 0 0 -5px",
          border: "2px solid rgba(232,213,176,0.7)",
          borderRadius: 2,
        }}
      />

      {/* Objective */}
      <div
        style={{
          ...parchment,
          position: "absolute",
          top: 20,
          left: 20,
          padding: "12px 16px",
          maxWidth: 320,
          pointerEvents: "auto",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 2,
            color: "#6B3FA0",
            marginBottom: 6,
            borderBottom: "2px solid #6B3FA0",
            paddingBottom: 4,
            display: "inline-block",
          }}
        >
          OBJECTIVE
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35 }}>
          {objective.title}
        </div>
        <div style={{ fontSize: 12, marginTop: 4, opacity: 0.8 }}>
          {objective.detail}
        </div>
      </div>

      {/* Feast table status */}
      <div
        style={{
          ...parchment,
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "10px 18px",
          minWidth: 200,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>
          FEAST TABLE
        </div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>
          Seats completed: {completedSets.length} / {DISH_SETS.length}
        </div>
        <div
          style={{
            marginTop: 6,
            height: 8,
            background: "#5C3A1E",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${(completedSets.length / DISH_SETS.length) * 100}%`,
              background: "linear-gradient(90deg, #4A9A4A, #7ACC5A)",
              transition: "width 0.4s",
            }}
          />
        </div>
      </div>

      {/* Witch's note / Hearth charms */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          maxWidth: 280,
          pointerEvents: "auto",
        }}
      >
        <div style={{ ...parchment, padding: "12px 14px" }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 1,
              color: "#6B3FA0",
              marginBottom: 6,
            }}
          >
            🧙 WITCH&apos;S NOTE
          </div>
          <div style={{ fontSize: 12, fontStyle: "italic", lineHeight: 1.4 }}>
            {note}
          </div>
        </div>

        {unlockedCharms.length > 0 && (
          <div style={{ ...parchment, padding: "12px 14px" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 1,
                color: "#6B3FA0",
                marginBottom: 8,
              }}
            >
              ♥ HEARTH CHARM · {unlockedCharms.length}
            </div>
            {unlockedCharms.map((id, idx) => {
              const def = CHARM_DEFS.find((c) => c.id === id)!;
              const readyAt = cooldowns[id] ?? 0;
              const ready = Date.now() >= readyAt;
              const keys = ["Z", "X", "C", "V"];
              return (
                <button
                  key={id}
                  onClick={() => useCharm(id)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    background:
                      activeCharm === id
                        ? "rgba(107,63,160,0.2)"
                        : "transparent",
                    border:
                      activeCharm === id
                        ? "2px solid #6B3FA0"
                        : "2px solid transparent",
                    padding: "6px 8px",
                    marginBottom: 4,
                    cursor: ready ? "pointer" : "not-allowed",
                    opacity: ready ? 1 : 0.5,
                    fontFamily: "inherit",
                    color: "#2A1A0A",
                    pointerEvents: "auto",
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700 }}>
                    [{keys[idx] ?? "?"}] {def.name}
                  </div>
                  <div style={{ fontSize: 10, opacity: 0.75 }}>
                    {def.description}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Kitchen progress */}
      <div
        style={{
          ...parchment,
          position: "absolute",
          bottom: 110,
          left: 20,
          padding: "10px 14px",
          minWidth: 200,
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>
          KITCHEN PROGRESS
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <div
            style={{
              flex: 1,
              height: 12,
              background: "#5C3A1E",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #2E8B4A, #5ACC6A)",
                transition: "width 0.3s",
              }}
            />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{progress}%</span>
          <span style={{ fontSize: 16 }}>🍲</span>
        </div>
        <div style={{ fontSize: 10, marginTop: 4, opacity: 0.7 }}>
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
      </div>

      {/* Hotbar */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 6,
          pointerEvents: "auto",
        }}
      >
        {stacks.map((stack, i) => (
          <button
            key={i}
            onClick={() => selectSlot(i)}
            style={{
              width: 64,
              height: 64,
              background: "linear-gradient(145deg, #3A2818, #2A1A10)",
              border:
                selectedSlot === i
                  ? "3px solid #FFD700"
                  : "3px solid #5C3A1E",
              boxShadow:
                selectedSlot === i
                  ? "0 0 12px rgba(255,215,0,0.5)"
                  : "inset 0 0 8px rgba(0,0,0,0.5)",
              borderRadius: 4,
              position: "relative",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 2,
                left: 5,
                fontSize: 10,
                color: "#E8D5B0",
                fontWeight: 700,
              }}
            >
              {i + 1}
            </span>
            {stack.item ? (
              <>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    margin: "16px auto 0",
                    background: getSet(stack.item.setId).primary,
                    border: `2px solid ${getSet(stack.item.setId).rim}`,
                    borderRadius: stack.item.category === "plates" ? "50%" : 4,
                    boxShadow: `inset 0 0 6px ${getSet(stack.item.setId).accent}`,
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: 2,
                    right: 5,
                    fontSize: 11,
                    color: "#FFD700",
                    fontWeight: 700,
                  }}
                >
                  {stack.count}
                </span>
              </>
            ) : (
              <div
                style={{
                  marginTop: 20,
                  fontSize: 14,
                  opacity: 0.3,
                  color: "#E8D5B0",
                }}
              >
                ✦
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          right: 20,
          ...parchment,
          padding: "10px 12px",
          fontSize: 11,
          lineHeight: 1.6,
        }}
      >
        <div>🖱 LMB — PICK UP</div>
        <div>🖱 RMB — PLACE</div>
        <div>R — ROTATE</div>
        <div style={{ opacity: 0.6 }}>ESC — Pause</div>
      </div>

      {/* Toast message */}
      {message && (
        <div
          style={{
            position: "absolute",
            bottom: 120,
            left: "50%",
            transform: "translateX(-50%)",
            ...parchment,
            padding: "8px 20px",
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          {message}
        </div>
      )}

      {!pointerLocked && phasePlayingHint()}
    </div>
  );
}

function phasePlayingHint() {
  return (
    <div
      style={{
        position: "absolute",
        top: "55%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        ...parchment,
        padding: "12px 24px",
        fontSize: 14,
        fontWeight: 600,
        pointerEvents: "none",
      }}
    >
      Click to look around
    </div>
  );
}

function PauseMenu() {
  const resume = useGameStore((s) => s.resume);
  const setPhase = useGameStore((s) => s.setPhase);
  const enableChaosMode = useGameStore((s) => s.enableChaosMode);
  const startGame = useGameStore((s) => s.startGame);
  const achievements = useGameStore((s) => s.achievements);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        background: "rgba(10,8,16,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-oxanium), Oxanium, sans-serif",
      }}
    >
      <div style={{ ...parchment, padding: 36, minWidth: 300, textAlign: "center" }}>
        <h2 style={{ margin: "0 0 20px", fontSize: 24 }}>Paused</h2>
        <MenuBtn onClick={resume}>Resume</MenuBtn>
        <MenuBtn onClick={() => setPhase("achievements")}>
          Achievements ({achievements.length}/{ACHIEVEMENTS.length})
        </MenuBtn>
        <MenuBtn onClick={enableChaosMode}>Cat&apos;s Revenge Mode</MenuBtn>
        <MenuBtn onClick={() => startGame()}>New Kitchen (shuffle)</MenuBtn>
        <MenuBtn onClick={() => setPhase("title")}>Title Screen</MenuBtn>
      </div>
    </div>
  );
}

function MenuBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "block",
        width: "100%",
        marginBottom: 10,
        padding: "12px 16px",
        background: "#6B3FA0",
        color: "#F5E6FF",
        border: "2px solid #2A1A0A",
        fontFamily: "inherit",
        fontWeight: 700,
        fontSize: 14,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function FeastEnding() {
  const completedSets = useGameStore((s) => s.completedSets);
  const achievements = useGameStore((s) => s.achievements);
  const elapsedMs = useGameStore((s) => s.elapsedMs);
  const charmsUsed = useGameStore((s) => s.charmsUsed);
  const setPhase = useGameStore((s) => s.setPhase);
  const startGame = useGameStore((s) => s.startGame);
  const mins = Math.floor(elapsedMs / 60000);
  const secs = Math.floor((elapsedMs % 60000) / 1000);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 60,
        background:
          "radial-gradient(ellipse at center, rgba(80,40,120,0.85), rgba(10,8,16,0.95))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-oxanium), Oxanium, sans-serif",
        animation: "fadeIn 1s ease",
      }}
    >
      <div
        style={{
          ...parchment,
          padding: 48,
          maxWidth: 520,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 12, letterSpacing: 3, color: "#6B3FA0" }}>
          THE COVEN ARRIVES
        </div>
        <h1 style={{ fontSize: 28, margin: "12px 0" }}>The Feast Begins</h1>
        <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
          The chandelier candles ignite. The hearth roars. The front door creaks
          open. The head witch places a hand on your shoulder.
        </p>
        <p
          style={{
            fontSize: 16,
            fontStyle: "italic",
            color: "#6B3FA0",
            marginBottom: 24,
          }}
        >
          &ldquo;You&apos;ve done more than tidy. You&apos;ve brought us
          together. Stay. Eat.&rdquo;
        </p>
        <div style={{ fontSize: 13, marginBottom: 8 }}>
          Seats filled: {completedSets.length}/{DISH_SETS.length}
        </div>
        <div style={{ fontSize: 13, marginBottom: 8 }}>
          Time: {mins}m {secs}s · Charms used: {charmsUsed}
        </div>
        <div style={{ fontSize: 13, marginBottom: 24 }}>
          Achievements: {achievements.length}/{ACHIEVEMENTS.length}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <MenuBtn onClick={() => setPhase("achievements")}>
            View Achievements
          </MenuBtn>
        </div>
        <MenuBtn onClick={() => startGame()}>Tidy Another Night</MenuBtn>
        <MenuBtn onClick={() => setPhase("title")}>Title</MenuBtn>
      </div>
    </div>
  );
}

function AchievementsScreen() {
  const achievements = useGameStore((s) => s.achievements);
  const setPhase = useGameStore((s) => s.setPhase);
  const phase = useGameStore((s) => s.phase);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 55,
        background: "rgba(10,8,16,0.88)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-oxanium), Oxanium, sans-serif",
      }}
    >
      <div
        style={{
          ...parchment,
          padding: 32,
          maxWidth: 480,
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Achievements</h2>
        {ACHIEVEMENTS.map((a) => {
          const got = achievements.includes(a.id);
          return (
            <div
              key={a.id}
              style={{
                padding: "10px 0",
                borderBottom: "1px solid rgba(92,58,30,0.3)",
                opacity: got ? 1 : 0.45,
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 14 }}>
                {got ? "★" : "☆"} {a.name}
              </div>
              <div style={{ fontSize: 12 }}>{a.description}</div>
            </div>
          );
        })}
        <div style={{ marginTop: 16 }}>
          <MenuBtn
            onClick={() =>
              setPhase(phase === "feast" ? "feast" : "paused")
            }
          >
            Back
          </MenuBtn>
        </div>
      </div>
    </div>
  );
}
