"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { ItemKind } from "../types";
import { ITEM_COLORS } from "../constants";

function Box({
  args,
  position,
  color,
  rotation,
}: {
  args: [number, number, number];
  position?: [number, number, number];
  color: string;
  rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={0.75} metalness={0.1} />
    </mesh>
  );
}

export function VoxelItem({
  kind,
  scale = 1,
  highlighted = false,
  identified = false,
  categoryColor,
}: {
  kind: ItemKind;
  scale?: number;
  highlighted?: boolean;
  identified?: boolean;
  categoryColor?: string;
}) {
  const group = useRef<THREE.Group>(null);
  const color = ITEM_COLORS[kind];

  useFrame((_, dt) => {
    if (!group.current) return;
    if (highlighted) {
      group.current.position.y = 0.12 + Math.sin(performance.now() / 280) * 0.08;
      group.current.rotation.y += dt * 1.5;
    }
  });

  const mesh = useMemo(() => {
    switch (kind) {
      case "sword":
        return (
          <>
            <Box args={[0.08, 0.9, 0.08]} position={[0, 0.45, 0]} color={color} />
            <Box args={[0.28, 0.08, 0.08]} position={[0, 0.12, 0]} color="#6a5a4a" />
            <Box args={[0.1, 0.2, 0.1]} position={[0, 0, 0]} color="#4a3a2a" />
          </>
        );
      case "mace":
        return (
          <>
            <Box args={[0.08, 0.7, 0.08]} position={[0, 0.35, 0]} color="#5a4a3a" />
            <Box args={[0.28, 0.28, 0.28]} position={[0, 0.75, 0]} color={color} />
          </>
        );
      case "shield":
        return (
          <>
            <Box args={[0.55, 0.7, 0.1]} position={[0, 0.35, 0]} color={color} />
            <Box args={[0.2, 0.2, 0.12]} position={[0, 0.35, 0.02]} color="#efc84a" />
          </>
        );
      case "scroll":
        return (
          <>
            <Box args={[0.18, 0.55, 0.18]} position={[0, 0.28, 0]} color={color} />
            <Box args={[0.22, 0.08, 0.22]} position={[0, 0.55, 0]} color="#c8b888" />
            <Box args={[0.22, 0.08, 0.22]} position={[0, 0.02, 0]} color="#c8b888" />
          </>
        );
      case "potion_red":
      case "potion_blue":
      case "potion_green":
        return (
          <>
            <Box args={[0.28, 0.35, 0.28]} position={[0, 0.22, 0]} color={color} />
            <Box args={[0.14, 0.18, 0.14]} position={[0, 0.48, 0]} color="#d0e8f0" />
            <Box args={[0.2, 0.08, 0.2]} position={[0, 0.58, 0]} color="#6a4a2a" />
          </>
        );
      case "coin":
        return (
          <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.05, 12]} />
            <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
          </mesh>
        );
      case "gem":
        return (
          <mesh position={[0, 0.2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <octahedronGeometry args={[0.22, 0]} />
            <meshStandardMaterial
              color={color}
              metalness={0.4}
              roughness={0.2}
              emissive={color}
              emissiveIntensity={0.35}
            />
          </mesh>
        );
      case "chest":
        return (
          <>
            <Box args={[0.45, 0.28, 0.32]} position={[0, 0.16, 0]} color={color} />
            <Box args={[0.48, 0.12, 0.35]} position={[0, 0.36, 0]} color="#8b6914" />
            <Box args={[0.08, 0.1, 0.06]} position={[0, 0.28, 0.18]} color="#efc84a" />
          </>
        );
      case "skull":
        return (
          <>
            <Box args={[0.32, 0.28, 0.28]} position={[0, 0.28, 0]} color={color} />
            <Box args={[0.08, 0.08, 0.06]} position={[-0.08, 0.32, 0.14]} color="#1a1a1a" />
            <Box args={[0.08, 0.08, 0.06]} position={[0.08, 0.32, 0.14]} color="#1a1a1a" />
            <Box args={[0.22, 0.12, 0.2]} position={[0, 0.1, 0]} color="#d0c8b8" />
          </>
        );
      case "bone":
        return (
          <>
            <Box args={[0.1, 0.55, 0.1]} position={[0, 0.28, 0]} color={color} rotation={[0, 0, 0.4]} />
            <Box args={[0.16, 0.16, 0.16]} position={[-0.08, 0.5, 0]} color={color} />
            <Box args={[0.16, 0.16, 0.16]} position={[0.08, 0.05, 0]} color={color} />
          </>
        );
      default:
        return <Box args={[0.3, 0.3, 0.3]} color={color} />;
    }
  }, [kind, color]);

  return (
    <group ref={group} scale={scale}>
      {mesh}
      {highlighted && (
        <mesh position={[0, 0.02, 0]}>
          <ringGeometry args={[0.35, 0.48, 24]} />
          <meshBasicMaterial color="#c084fc" transparent opacity={0.85} side={THREE.DoubleSide} />
        </mesh>
      )}
      {identified && categoryColor && (
        <mesh position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color={categoryColor} />
        </mesh>
      )}
    </group>
  );
}
