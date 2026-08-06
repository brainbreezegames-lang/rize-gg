"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { useGameStore } from "../store/gameStore";
import type { BasinId } from "../types";
import { BASIN_COLORS } from "../types";

const BASINS: { id: BasinId; position: [number, number, number] }[] = [
  { id: "moonwater", position: [-0.96, 1.05, -0.24] },
  { id: "sunfire", position: [0, 1.05, -0.24] },
  { id: "still", position: [0.96, 1.05, -0.24] },
];

export function InteractiveSink() {
  const heldDishId = useGameStore((s) => s.heldDishId);
  const washInBasin = useGameStore((s) => s.washInBasin);
  const washFx = useGameStore((s) => s.washFx);
  const dishes = useGameStore((s) => s.dishes);
  const held = dishes.find((d) => d.id === heldDishId);
  const cleanReady = dishes.some((d) => d.status === "clean");

  return (
    <group>
      {BASINS.map((b) => (
        <BasinHitbox
          key={b.id}
          id={b.id}
          position={b.position}
          active={!!held}
          flash={washFx?.basin === b.id ? washFx.ok : null}
          onWash={() => washInBasin(b.id)}
        />
      ))}
      {held && (
        <Text
          position={[0, 2.1, 0.5]}
          fontSize={0.12}
          color="#e8dcc8"
          anchorX="center"
          outlineWidth={0.008}
          outlineColor="#000"
        >
          Drop into matching basin
        </Text>
      )}
      {cleanReady && !held && (
        <Text
          position={[2.4, 1.9, 0]}
          fontSize={0.1}
          color="#99F9EA"
          anchorX="center"
          outlineWidth={0.006}
          outlineColor="#000"
        >
          Place on Serving Board →
        </Text>
      )}
    </group>
  );
}

function BasinHitbox({
  id,
  position,
  active,
  flash,
  onWash,
}: {
  id: BasinId;
  position: [number, number, number];
  active: boolean;
  flash: boolean | null;
  onWash: () => void;
}) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ring.current) {
      ring.current.rotation.z = clock.elapsedTime;
      const mat = ring.current.material as THREE.MeshBasicMaterial;
      mat.opacity = active ? 0.35 + Math.sin(clock.elapsedTime * 4) * 0.15 : 0.08;
    }
  });

  return (
    <group position={position}>
      <mesh
        position={[0, 0.2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (active) onWash();
        }}
        onPointerOver={() => {
          if (active) document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <boxGeometry args={[0.85, 0.5, 0.8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.25, 0]}>
        <torusGeometry args={[0.4, 0.03, 4, 12]} />
        <meshBasicMaterial
          color={flash === true ? "#44ff88" : flash === false ? "#ff4444" : BASIN_COLORS[id]}
          transparent
          opacity={0.2}
        />
      </mesh>
      {flash !== null && (
        <pointLight
          color={flash ? "#88ffaa" : "#ff4444"}
          intensity={3}
          distance={2}
          position={[0, 0.3, 0]}
        />
      )}
    </group>
  );
}

export function ServingBoard3D() {
  const boardSlots = useGameStore((s) => s.boardSlots);
  const sequenceIndex = useGameStore((s) => s.sequenceIndex);
  const placeOnBoard = useGameStore((s) => s.placeOnBoard);
  const dishes = useGameStore((s) => s.dishes);
  const hasClean = dishes.some((d) => d.status === "clean");

  return (
    <group position={[2.5, 1.15, -0.5]}>
      {/* Chalkboard */}
      <mesh position={[0, 0.45, -0.35]}>
        <boxGeometry args={[1.4, 1, 0.08]} />
        <meshStandardMaterial color="#1a1a14" flatShading />
      </mesh>
      <Text position={[0, 0.95, -0.3]} fontSize={0.09} color="#e8dcc8" anchorX="center">
        SERVING BOARD
      </Text>
      {[0, 1, 2, 3].map((i) => {
        const filled = boardSlots[i];
        const isNext = sequenceIndex % 4 === i && hasClean;
        return (
          <group key={i} position={[-0.45 + i * 0.3, 0.35, -0.28]}>
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                if (hasClean) placeOnBoard();
              }}
              onPointerOver={() => {
                if (hasClean) document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                document.body.style.cursor = "auto";
              }}
            >
              <boxGeometry args={[0.25, 0.25, 0.04]} />
              <meshStandardMaterial
                color={filled ? "#5a2080" : "#2a2a22"}
                emissive={isNext ? "#9B59F5" : filled ? "#7B3FE4" : "#000000"}
                emissiveIntensity={isNext ? 0.8 : filled ? 0.3 : 0}
                flatShading
              />
            </mesh>
            <Text position={[0, 0, 0.04]} fontSize={0.08} color="#ccc" anchorX="center" anchorY="middle">
              {String(i + 1)}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

export function RecipeScroll3D() {
  const recipe = useGameStore((s) => s.recipe);
  const sequenceIndex = useGameStore((s) => s.sequenceIndex);
  const window = recipe.slice(sequenceIndex, sequenceIndex + 4);

  const icon = (grime: string) => {
    if (grime === "illusion") return "☾";
    if (grime === "elemental") return "☀";
    return "💧";
  };
  const shapeIcon = (shape: string) => {
    const map: Record<string, string> = {
      plate: "🍽",
      bowl: "🥣",
      goblet: "🏆",
      cauldron: "🍲",
      cup: "☕",
      spoon: "🥄",
    };
    return map[shape] ?? "•";
  };

  return (
    <group position={[0, 2.35, -0.9]}>
      <mesh>
        <boxGeometry args={[2.2, 0.7, 0.05]} />
        <meshStandardMaterial color="#c4a574" flatShading />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[2.0, 0.55, 0.02]} />
        <meshStandardMaterial color="#e8d5b0" flatShading />
      </mesh>
      <Text position={[0, 0.2, 0.05]} fontSize={0.08} color="#5a3a1a" anchorX="center">
        RECIPE ORDER
      </Text>
      <Text position={[0, -0.02, 0.05]} fontSize={0.11} color="#3a2810" anchorX="center">
        {window.length === 0
          ? "✦ COMPLETE ✦"
          : window.map((s, i) => `${shapeIcon(s.shape)}${icon(s.grime)}${i < window.length - 1 ? " → " : ""}`).join("")}
      </Text>
    </group>
  );
}

export function DrainSprite() {
  const sequenceIndex = useGameStore((s) => s.sequenceIndex);
  const mode = useGameStore((s) => s.mode);
  const busy = useGameStore((s) => s.drainSpriteBusy);
  const ref = useRef<THREE.Group>(null);
  const unlocked = mode !== "devotee" && sequenceIndex >= 10;

  useFrame(({ clock }) => {
    if (!ref.current || !unlocked) return;
    ref.current.position.y = 1.15 + Math.sin(clock.elapsedTime * 2.5) * 0.08;
    ref.current.position.x = 0.3 + Math.sin(clock.elapsedTime * 0.8) * 0.2;
    if (busy) ref.current.rotation.y = clock.elapsedTime * 4;
  });

  if (!unlocked) return null;

  return (
    <group ref={ref} position={[0.3, 1.15, 0.2]}>
      <mesh>
        <boxGeometry args={[0.15, 0.2, 0.15]} />
        <meshStandardMaterial
          color="#5ED4FF"
          emissive="#2ECCF0"
          emissiveIntensity={0.9}
          transparent
          opacity={0.75}
          flatShading
        />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.12, 0.1, 0.12]} />
        <meshStandardMaterial color="#88e8ff" emissive="#88e8ff" emissiveIntensity={0.5} flatShading />
      </mesh>
      <pointLight color="#5ED4FF" intensity={0.6} distance={1.5} />
    </group>
  );
}
