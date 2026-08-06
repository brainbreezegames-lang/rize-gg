"use client";

import { useEffect, useState } from "react";
import { CUPBOARDS } from "../data/cupboards";
import { CATEGORY_LABELS } from "../data/sets";
import { useGameStore } from "../store/gameStore";

/** Library-style geography: where each category lives */
export function KitchenMap() {
  const [open, setOpen] = useState(false);
  const items = useGameStore((s) => s.items);
  const phase = useGameStore((s) => s.phase);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "KeyM") setOpen((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (phase !== "playing" && phase !== "paused") return null;

  const parchment: React.CSSProperties = {
    background: "linear-gradient(145deg, #E8D5B0 0%, #D4C09A 100%)",
    border: "3px solid #5C3A1E",
    boxShadow: "0 4px 20px rgba(0,0,0,0.55)",
    color: "#2A1A0A",
    fontFamily: "var(--font-oxanium), Oxanium, monospace",
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 160,
        left: 20,
        zIndex: 25,
        pointerEvents: "auto",
        fontFamily: "var(--font-oxanium), Oxanium, sans-serif",
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          ...parchment,
          padding: "8px 14px",
          fontWeight: 700,
          fontSize: 12,
          cursor: "pointer",
          letterSpacing: 1,
        }}
      >
        {open ? "Hide Map" : "Kitchen Map [M]"}
      </button>
      {open && (
        <div
          style={{
            ...parchment,
            marginTop: 8,
            padding: 14,
            width: 220,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 2,
              color: "#6B3FA0",
              marginBottom: 8,
            }}
          >
            CUPBOARD GUIDE
          </div>
          {CUPBOARDS.map((c) => {
            const total = items.filter(
              (i) =>
                i.category === c.category &&
                (i.kind === "dish" || i.kind === "lid")
            ).length;
            const placed = items.filter(
              (i) =>
                i.category === c.category &&
                i.placedSlotId &&
                (i.kind === "dish" || i.kind === "lid")
            ).length;
            return (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  padding: "4px 0",
                  borderBottom: "1px solid rgba(92,58,30,0.2)",
                }}
              >
                <span style={{ fontWeight: 600 }}>
                  {CATEGORY_LABELS[c.category]}
                </span>
                <span>
                  {placed}/{total}
                </span>
              </div>
            );
          })}
          <p style={{ fontSize: 10, margin: "10px 0 0", opacity: 0.7 }}>
            Gold glow = correct spot. Red = wrong set. Yellow = right set, wrong
            size.
          </p>
        </div>
      )}
    </div>
  );
}
