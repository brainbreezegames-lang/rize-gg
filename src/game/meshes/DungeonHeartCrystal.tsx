"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export function DungeonHeartCrystal({
  power,
  awakened,
}: {
  power: number;
  awakened: boolean;
}) {
  const crystal = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.PointLight>(null);
  const pedestal = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (crystal.current) {
      crystal.current.rotation.y += dt * (awakened ? 1.2 : 0.35);
      const pulse = 1 + Math.sin(performance.now() / 400) * (0.05 + power * 0.02);
      crystal.current.scale.setScalar(pulse * (awakened ? 1.25 : 1));
    }
    if (glow.current) {
      glow.current.intensity =
        0.6 + power * 0.55 + (awakened ? 2 : 0) + Math.sin(performance.now() / 300) * 0.2;
    }
  });

  const intensity = 0.2 + power * 0.25;

  return (
    <group position={[0, 0, -6.2]} ref={pedestal}>
      {/* Stone pedestal */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 1.15, 0.8, 8]} />
        <meshStandardMaterial color="#6a655c" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.85, 0.35, 8]} />
        <meshStandardMaterial color="#7a756c" roughness={0.85} />
      </mesh>

      {/* Crystal */}
      <mesh ref={crystal} position={[0, 2.1, 0]} castShadow>
        <octahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#7c3aed"
          emissiveIntensity={intensity}
          metalness={0.3}
          roughness={0.15}
          transparent
          opacity={0.92}
        />
      </mesh>
      {/* Inner core */}
      <mesh position={[0, 2.1, 0]}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color="#e9d5ff"
          emissive="#c084fc"
          emissiveIntensity={0.8 + power * 0.3}
        />
      </mesh>

      <pointLight
        ref={glow}
        position={[0, 2.4, 0.5]}
        color="#c084fc"
        intensity={1}
        distance={12}
      />

      {/* Power runes around base */}
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const lit = i < power;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 1.15, 1.2, Math.sin(a) * 1.15]}
          >
            <boxGeometry args={[0.22, 0.12, 0.22]} />
            <meshStandardMaterial
              color={lit ? "#c084fc" : "#3a3040"}
              emissive={lit ? "#a855f7" : "#000"}
              emissiveIntensity={lit ? 0.8 : 0}
            />
          </mesh>
        );
      })}
    </group>
  );
}
