"use client";

import { useEffect } from "react";
import { useGameStore } from "../store/gameStore";
import { sfx } from "../audio/sfx";

/** Keyboard shortcuts for accessibility & speed runs */
export function useGameKeys() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = useGameStore.getState();
      if (e.key === "Escape") {
        if (s.phase === "playing") s.pause();
        else if (s.phase === "paused") s.resume();
        return;
      }
      if (s.phase !== "playing" && s.phase !== "washing_fx") return;

      if (e.key === "1" && s.heldDishId) {
        s.washInBasin("moonwater");
        sfx.click();
      } else if (e.key === "2" && s.heldDishId) {
        s.washInBasin("sunfire");
      } else if (e.key === "3" && s.heldDishId) {
        s.washInBasin("still");
      } else if (e.key === " " || e.key === "e" || e.key === "E") {
        e.preventDefault();
        const clean = s.dishes.find((d) => d.status === "clean");
        if (clean) {
          if (clean.inRecipe) s.placeOnBoard();
          else s.putInCupboard(clean.id);
        }
      } else if (e.key === "q" || e.key === "Q") {
        s.activateScent();
      } else if (e.key === "f" || e.key === "F") {
        s.askDrainSprite();
      } else if (e.key === "r" || e.key === "R") {
        s.useGreatRinse();
      } else if (e.key === "x" || e.key === "X") {
        s.dropHeld();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
