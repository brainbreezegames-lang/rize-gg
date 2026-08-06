"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import * as THREE from "three";
import { KitchenEnvironment } from "./Kitchen";
import { DishField } from "./Dishes";
import { InteractiveSink, ServingBoard3D, RecipeScroll3D, DrainSprite } from "./Interactables";
import { WashParticles } from "./WashParticles";
import { useGameStore } from "../store/gameStore";

function GameTicker() {
  useFrame((_, dt) => {
    useGameStore.getState().tick(dt * 1000);
  });
  return null;
}

function Scene() {
  const effects = useGameStore((s) =>
    Array.isArray(s.kitchenEffects) ? s.kitchenEffects : [...s.kitchenEffects]
  );
  const phase = useGameStore((s) => s.phase);

  return (
    <>
      <color attach="background" args={["#140a1c"]} />
      <fog attach="fog" args={["#1a0e24", 10, 28]} />
      {/* Always show the kitchen — menu floats over it */}
      <KitchenEnvironment effects={effects} />
      <DishField />
      <InteractiveSink />
      <ServingBoard3D />
      <RecipeScroll3D />
      <DrainSprite />
      <WashParticles />
      <GameTicker />
      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={4}
        maxDistance={10}
        target={[0, 1, 0]}
        enableDamping
        dampingFactor={0.08}
        enabled={phase !== "title"}
      />
    </>
  );
}

export function GameCanvas() {
  useEffect(() => {
    // Warm audio context on first gesture
    const unlock = () => {
      document.removeEventListener("pointerdown", unlock);
    };
    document.addEventListener("pointerdown", unlock);
    return () => document.removeEventListener("pointerdown", unlock);
  }, []);

  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [5.2, 4.8, 6.8], fov: 40, near: 0.1, far: 50 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.35,
        }}
        onPointerMissed={() => {
          const s = useGameStore.getState();
          if (s.heldDishId) {
            const dish = s.dishes.find((d) => d.id === s.heldDishId);
            if (dish?.status === "held") s.dropHeld();
          }
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
