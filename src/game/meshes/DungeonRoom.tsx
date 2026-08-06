"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { ROOM_RADIUS } from "../constants";

function Torch({ position }: { position: [number, number, number] }) {
  const light = useRef<THREE.PointLight>(null);
  useFrame(() => {
    if (!light.current) return;
    light.current.intensity = 1.4 + Math.sin(performance.now() / 140) * 0.25 + Math.random() * 0.1;
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.15, 0.7, 0.15]} />
        <meshStandardMaterial color="#4a3020" />
      </mesh>
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[0.22, 0.28, 0.22]} />
        <meshStandardMaterial
          color="#ff9a3c"
          emissive="#ff6a1a"
          emissiveIntensity={1.2}
        />
      </mesh>
      <pointLight
        ref={light}
        position={[0, 1.1, 0.3]}
        color="#ffb060"
        intensity={1.5}
        distance={8}
        castShadow
      />
    </group>
  );
}

export function DungeonRoom() {
  const floorTiles = useMemo(() => {
    const tiles: { x: number; z: number; shade: number }[] = [];
    for (let x = -11; x <= 11; x++) {
      for (let z = -11; z <= 11; z++) {
        if (x * x + z * z > ROOM_RADIUS * ROOM_RADIUS + 4) continue;
        tiles.push({
          x,
          z,
          shade: ((x + z) & 1) === 0 ? 0 : 1,
        });
      }
    }
    return tiles;
  }, []);

  const wallSegments = useMemo(() => {
    const segs: { x: number; z: number; rot: number }[] = [];
    const n = 48;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      // Leave opening? Full circle room
      segs.push({
        x: Math.cos(a) * ROOM_RADIUS,
        z: Math.sin(a) * ROOM_RADIUS,
        rot: -a + Math.PI / 2,
      });
    }
    return segs;
  }, []);

  return (
    <group>
      {/* Floor */}
      {floorTiles.map((t, i) => (
        <mesh
          key={i}
          position={[t.x, 0, t.z]}
          receiveShadow
        >
          <boxGeometry args={[0.98, 0.2, 0.98]} />
          <meshStandardMaterial
            color={t.shade ? "#6a6358" : "#7a7368"}
            roughness={0.92}
          />
        </mesh>
      ))}

      {/* Center mosaic ring */}
      <mesh position={[0, 0.12, 1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[2.2, 2.6, 32]} />
        <meshStandardMaterial color="#8a7a5a" roughness={0.8} />
      </mesh>

      {/* Walls */}
      {wallSegments.map((s, i) => (
        <group key={i} position={[s.x, 0, s.z]} rotation={[0, s.rot, 0]}>
          <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.45, 4.4, 0.7]} />
            <meshStandardMaterial color="#8a8070" roughness={0.95} />
          </mesh>
          {/* Brick darker bands */}
          <mesh position={[0, 1.2, 0.2]}>
            <boxGeometry args={[1.4, 0.25, 0.35]} />
            <meshStandardMaterial color="#6e6658" />
          </mesh>
          <mesh position={[0, 2.8, 0.2]}>
            <boxGeometry args={[1.4, 0.25, 0.35]} />
            <meshStandardMaterial color="#6e6658" />
          </mesh>
        </group>
      ))}

      {/* Torches */}
      <Torch position={[-7.5, 2.2, -3]} />
      <Torch position={[7.5, 2.2, -3]} />
      <Torch position={[-8.2, 2.2, 3]} />
      <Torch position={[8.2, 2.2, 3]} />
      <Torch position={[0, 2.4, 8.5]} />

      {/* Ambient fill */}
      <ambientLight intensity={0.35} color="#c8b89a" />
      <hemisphereLight args={["#ffe0b0", "#2a2018", 0.45]} />
      <directionalLight
        position={[4, 10, 2]}
        intensity={0.55}
        color="#ffd9a0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={30}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
    </group>
  );
}
