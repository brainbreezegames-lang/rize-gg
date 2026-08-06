"use client";

import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { DungeonRoom } from "./meshes/DungeonRoom";
import { DungeonHeartCrystal } from "./meshes/DungeonHeartCrystal";
import { Shelf } from "./meshes/Shelf";
import { PlayerController } from "./meshes/Player";
import { FloorItems } from "./meshes/FloorItems";
import { SHELVES } from "./constants";
import { useGameStore } from "./store";
import { sfx } from "./audio";

function SceneContents() {
  const items = useGameStore((s) => s.items);
  const heartPower = useGameStore((s) => s.heartPower);
  const heartAwakened = useGameStore((s) => s.heartAwakened);
  const scryShelf = useGameStore((s) => s.scryShelf);
  const scryUntil = useGameStore((s) => s.scryUntil);
  const tryPlaceOnShelf = useGameStore((s) => s.tryPlaceOnShelf);
  const tick = useGameStore((s) => s.tick);

  useEffect(() => {
    let last = performance.now();
    let raf = 0;
    const loop = (t: number) => {
      tick((t - last) / 1000);
      last = t;
      // Expire scry
      const s = useGameStore.getState();
      if (s.scryShelf && performance.now() / 1000 > s.scryUntil) {
        useGameStore.setState({ scryShelf: null });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [tick]);

  const now = performance.now() / 1000;

  return (
    <>
      <DungeonRoom />
      <DungeonHeartCrystal power={heartPower} awakened={heartAwakened} />
      {SHELVES.map((shelf) => {
        const placed = items.filter(
          (i) => i.placed && i.category === shelf.id
        );
        const glowing =
          (scryShelf === shelf.id && now < scryUntil) ||
          placed.length >= shelf.slots;
        return (
          <Shelf
            key={shelf.id}
            shelf={shelf}
            placedItems={placed}
            glowing={glowing}
            onInteract={() => {
              const beforePower = useGameStore.getState().heartPower;
              const hadItem = !!useGameStore.getState().inventory[
                useGameStore.getState().selectedInv
              ];
              const ok = tryPlaceOnShelf(shelf.id);
              const after = useGameStore.getState();
              if (ok) {
                if (after.phase === "victory") sfx.victory();
                else if (after.heartPower > beforePower) sfx.complete();
                else sfx.place();
              } else if (hadItem) {
                sfx.wrong();
              }
            }}
          />
        );
      })}
      <FloorItems />
      <PlayerController />
      {/* Path dots toward heart */}
      <PathDots />
    </>
  );
}

function PathDots() {
  const playerPos = useGameStore((s) => s.playerPos);
  const dots = [];
  const target = [0, -5.5] as const;
  for (let i = 1; i <= 8; i++) {
    const t = i / 9;
    const x = playerPos[0] * (1 - t) + target[0] * t;
    const z = playerPos[2] * (1 - t) + target[1] * t;
    dots.push(
      <mesh key={i} position={[x, 0.18, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.08, 8]} />
        <meshBasicMaterial color="#e9d5ff" transparent opacity={0.35} />
      </mesh>
    );
  }
  return <group>{dots}</group>;
}

export function GameCanvas() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [0, 11, 14], fov: 42, near: 0.1, far: 80 }}
      gl={{ antialias: true, toneMapping: 3 }}
      style={{ width: "100%", height: "100%", background: "#1a1510" }}
      onPointerMissed={() => {
        document.body.style.cursor = "default";
      }}
    >
      <fog attach="fog" args={["#1a1510", 18, 36]} />
      <SceneContents />
    </Canvas>
  );
}
