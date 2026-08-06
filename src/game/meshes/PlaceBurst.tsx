"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../store";

export function PlaceBurst() {
  const placedCount = useGameStore((s) => s.placedCount);
  const heartPower = useGameStore((s) => s.heartPower);
  const last = useRef(0);
  const particles = useRef<THREE.Points>(null);
  const ages = useRef<Float32Array>(new Float32Array(40));
  const active = useRef(false);

  const positions = useMemo(() => {
    const arr = new Float32Array(40 * 3);
    return arr;
  }, []);

  useFrame((_, dt) => {
    if (placedCount > last.current) {
      last.current = placedCount;
      active.current = true;
      const shelfZ = -6.5;
      for (let i = 0; i < 40; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 2;
        positions[i * 3 + 1] = 1 + Math.random() * 2;
        positions[i * 3 + 2] = shelfZ + Math.random();
        ages.current[i] = Math.random() * 0.2;
      }
      if (particles.current) {
        particles.current.geometry.attributes.position.needsUpdate = true;
      }
    }
    if (!active.current || !particles.current) return;
    let alive = false;
    for (let i = 0; i < 40; i++) {
      ages.current[i] += dt;
      if (ages.current[i] < 1.2) {
        alive = true;
        positions[i * 3 + 1] += dt * (1.5 + (i % 5) * 0.2);
        positions[i * 3] += dt * ((i % 2 === 0 ? 1 : -1) * 0.4);
      }
    }
    particles.current.geometry.attributes.position.needsUpdate = true;
    const mat = particles.current.material as THREE.PointsMaterial;
    mat.opacity = alive ? 0.85 : 0;
    if (!alive) active.current = false;

    // Extra burst when heart gains power
    void heartPower;
  });

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#c084fc"
        size={0.18}
        transparent
        opacity={0}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
