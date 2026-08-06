"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import type { ShelfDef } from "../types";
import { VoxelItem } from "./VoxelItem";
import type { GameItem } from "../types";

export function Shelf({
  shelf,
  placedItems,
  glowing,
  onInteract,
}: {
  shelf: ShelfDef;
  placedItems: GameItem[];
  glowing: boolean;
  onInteract: () => void;
}) {
  const banner = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!banner.current) return;
    const mat = banner.current.material as THREE.MeshStandardMaterial;
    if (glowing) {
      mat.emissiveIntensity = 0.55 + Math.sin(performance.now() / 200) * 0.35;
    } else {
      mat.emissiveIntensity = 0.05;
    }
  });

  const [x, , z] = shelf.position;

  return (
    <group position={[x, 0, z]}>
      {/* Wood cabinet body */}
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow onClick={(e) => { e.stopPropagation(); onInteract(); }}>
        <boxGeometry args={[2.2, 2.8, 0.85]} />
        <meshStandardMaterial color="#6b4423" roughness={0.85} />
      </mesh>
      {/* Inner shadow shelves */}
      {[0.5, 1.1, 1.7, 2.3].map((y, i) => (
        <mesh key={i} position={[0, y, 0.1]} castShadow>
          <boxGeometry args={[1.95, 0.08, 0.65]} />
          <meshStandardMaterial color="#4a2f18" roughness={0.9} />
        </mesh>
      ))}
      {/* Side posts */}
      <mesh position={[-1.05, 1.4, 0.35]} castShadow>
        <boxGeometry args={[0.15, 2.8, 0.15]} />
        <meshStandardMaterial color="#5a3818" />
      </mesh>
      <mesh position={[1.05, 1.4, 0.35]} castShadow>
        <boxGeometry args={[0.15, 2.8, 0.15]} />
        <meshStandardMaterial color="#5a3818" />
      </mesh>
      {/* Banner */}
      <mesh ref={banner} position={[0, 3.05, 0.2]}>
        <boxGeometry args={[1.6, 0.45, 0.12]} />
        <meshStandardMaterial
          color={shelf.bannerColor}
          emissive={shelf.bannerColor}
          emissiveIntensity={0.05}
        />
      </mesh>
      <Text
        position={[0, 3.05, 0.28]}
        fontSize={0.22}
        color="#1a1208"
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {`${SHELF_NUM[shelf.id]}. ${shelf.name}`}
      </Text>

      {/* Slot silhouettes + placed items */}
      {Array.from({ length: shelf.slots }).map((_, slot) => {
        const col = slot % 2;
        const row = Math.floor(slot / 2);
        const sx = -0.4 + col * 0.8;
        const sy = 0.75 + row * 0.85;
        const placed = placedItems.find((p) => p.shelfSlot === slot);
        return (
          <group key={slot} position={[sx, sy, 0.25]}>
            {!placed && (
              <mesh>
                <boxGeometry args={[0.45, 0.45, 0.08]} />
                <meshStandardMaterial
                  color="#3a2510"
                  transparent
                  opacity={0.55}
                />
              </mesh>
            )}
            {placed && <VoxelItem kind={placed.kind} scale={0.7} />}
          </group>
        );
      })}

      {/* Interaction pad */}
      <mesh
        position={[0, 0.02, 1.1]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onInteract();
        }}
      >
        <circleGeometry args={[0.9, 24]} />
        <meshStandardMaterial
          color={glowing ? shelf.bannerColor : "#4a3a2a"}
          transparent
          opacity={glowing ? 0.45 : 0.2}
          emissive={glowing ? shelf.bannerColor : "#000"}
          emissiveIntensity={glowing ? 0.4 : 0}
        />
      </mesh>
    </group>
  );
}

const SHELF_NUM: Record<string, number> = {
  armory: 1,
  scrolls: 2,
  alchemy: 3,
  treasury: 4,
  trophies: 5,
};
