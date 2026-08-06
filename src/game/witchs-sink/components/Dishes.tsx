"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { dishVoxels, VoxelMesh } from "../utils/voxels";
import { GRIME_COLORS, type DishShape, type DishMaterial, type GrimeType } from "../types";
import { useGameStore } from "../store/gameStore";

interface DishMeshProps {
  id: string;
  shape: DishShape;
  material: DishMaterial;
  grime: GrimeType;
  status: string;
  position: [number, number, number];
  rotationY: number;
  highlight: boolean;
  scentGlow: boolean;
  chainGlow: boolean;
}

export function DishMesh({
  id,
  shape,
  material,
  grime,
  status,
  position,
  rotationY,
  highlight,
  scentGlow,
  chainGlow,
}: DishMeshProps) {
  const group = useRef<THREE.Group>(null);
  const pickDish = useGameStore((s) => s.pickDish);
  const hoverDish = useGameStore((s) => s.hoverDish);
  const heldDishId = useGameStore((s) => s.heldDishId);
  const dirty = status === "dirty" || status === "held" || status === "in_pile";
  const hidden = status === "on_board" || status === "cupboarded" || status === "washing";

  const voxels = useMemo(
    () => dishVoxels(shape, material, GRIME_COLORS[grime], dirty),
    [shape, material, grime, dirty]
  );

  useFrame(({ clock }) => {
    if (!group.current || hidden) return;
    if (status === "held" || heldDishId === id) {
      const target = new THREE.Vector3(0, 1.6, 1.1);
      group.current.position.lerp(target, 0.12);
      group.current.rotation.y = clock.elapsedTime * 0.8;
      return;
    }
    if (status === "clean") {
      const target = new THREE.Vector3(1.8, 1.45, 0.2);
      group.current.position.lerp(target, 0.08);
      group.current.rotation.y = clock.elapsedTime * 0.4;
      return;
    }
    group.current.position.set(position[0], position[1], position[2]);
    group.current.rotation.y = rotationY;
    if (highlight || chainGlow) {
      group.current.position.y = position[1] + Math.sin(clock.elapsedTime * 3) * 0.06;
    }
  });

  if (hidden) return null;

  const outlineColor = highlight || chainGlow ? "#FFD700" : scentGlow ? GRIME_COLORS[grime] : null;

  return (
    <group ref={group} position={position}>
      <VoxelMesh
        voxels={voxels}
        size={0.09}
        onClick={(e) => {
          e.stopPropagation();
          if (status === "dirty" || status === "in_pile") pickDish(id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
          hoverDish(id);
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
          hoverDish(null);
        }}
      />
      {outlineColor && (
        <mesh>
          <sphereGeometry args={[0.28, 8, 8]} />
          <meshBasicMaterial color={outlineColor} transparent opacity={0.15} depthWrite={false} />
        </mesh>
      )}
      {outlineColor && (
        <pointLight color={outlineColor} intensity={0.8} distance={1.2} />
      )}
      {/* Grime drip particles when dirty */}
      {dirty && (
        <mesh position={[0.05, 0.15, 0]}>
          <boxGeometry args={[0.04, 0.08, 0.04]} />
          <meshStandardMaterial
            color={GRIME_COLORS[grime]}
            emissive={GRIME_COLORS[grime]}
            emissiveIntensity={0.6}
          />
        </mesh>
      )}
    </group>
  );
}

export function DishField() {
  const dishes = useGameStore((s) => s.dishes);
  const chainGlowDishId = useGameStore((s) => s.chainGlowDishId);

  return (
    <group>
      {dishes.map((d) => (
        <DishMesh
          key={d.id}
          id={d.id}
          shape={d.shape}
          material={d.material}
          grime={d.grime}
          status={d.status}
          position={d.position}
          rotationY={d.rotationY}
          highlight={d.highlight}
          scentGlow={d.scentGlow}
          chainGlow={chainGlowDishId === d.id}
        />
      ))}
    </group>
  );
}
