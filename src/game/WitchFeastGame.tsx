"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { KitchenEnvironment } from "./world/KitchenEnvironment";
import { Cupboards } from "./world/Cupboards";
import { WorldItems } from "./items/DishMesh";
import {
  PlayerController,
  CharmPickups,
} from "./systems/PlayerController";
import {
  CatFamiliar,
  FeastSeats,
  CallTheSetVFX,
} from "./world/CatAndFeast";
import { GameHUD } from "./ui/GameHUD";
import { useGameStore } from "./store/gameStore";

function Scene() {
  const phase = useGameStore((s) => s.phase);
  return (
    <>
      <KitchenEnvironment />
      <Cupboards />
      <WorldItems />
      <CatFamiliar />
      <FeastSeats />
      <CharmPickups />
      <CallTheSetVFX />
      {phase !== "title" && <PlayerController />}
    </>
  );
}

export default function WitchFeastGame() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#0B0A10",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#E8D5B0",
          fontFamily: "var(--font-oxanium), Oxanium, sans-serif",
        }}
      >
        Lighting the hearth…
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "#0B0A10",
        cursor: "crosshair",
      }}
    >
      <Canvas
        shadows
        dpr={[1, 1.25]}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          toneMappingExposure: 1.35,
        }}
        camera={{ fov: 72, near: 0.1, far: 50, position: [0, 1.55, 3.5] }}
        onCreated={({ gl }) => {
          gl.setClearColor("#1A1520");
          gl.toneMapping = 4; // ACESFilmicToneMapping
          gl.toneMappingExposure = 1.35;
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <GameHUD />
      {/* Scanline / grit overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 15,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
          mixBlendMode: "multiply",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 14,
          boxShadow: "inset 0 0 120px rgba(0,0,0,0.45)",
        }}
      />
    </div>
  );
}
