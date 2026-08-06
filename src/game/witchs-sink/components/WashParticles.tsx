"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "../store/gameStore";
import { BASIN_COLORS } from "../types";

/** Burst of voxel bubbles when a wash succeeds or fails */
export function WashParticles() {
  const washFx = useGameStore((s) => s.washFx);
  const group = useRef<THREE.Group>(null);
  const particles = useMemo(() => {
    return Array.from({ length: 28 }, () => ({
      vx: (Math.random() - 0.5) * 1.5,
      vy: 0.8 + Math.random() * 1.5,
      vz: (Math.random() - 0.5) * 1.5,
      life: Math.random(),
    }));
  }, [washFx?.dishId, washFx?.basin]);

  useFrame((_, dt) => {
    if (!group.current || !washFx) return;
    group.current.children.forEach((child, i) => {
      const p = particles[i];
      if (!p) return;
      child.position.x += p.vx * dt;
      child.position.y += p.vy * dt;
      child.position.z += p.vz * dt;
      p.vy -= 2 * dt;
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, mat.opacity - dt * 1.2);
    });
  });

  if (!washFx) return null;

  const basinX = washFx.basin === "moonwater" ? -0.96 : washFx.basin === "sunfire" ? 0 : 0.96;
  const color = washFx.ok ? BASIN_COLORS[washFx.basin] : "#ff3333";

  return (
    <group ref={group} position={[basinX, 1.2, -0.2]}>
      {particles.map((_, i) => (
        <mesh key={i} position={[0, 0, 0]}>
          <boxGeometry args={[0.06, 0.06, 0.06]} />
          <meshBasicMaterial color={color} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}
