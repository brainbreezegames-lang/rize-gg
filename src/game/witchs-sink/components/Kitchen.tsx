"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { boxVoxels, PALETTE, VoxelMesh, type Voxel } from "../utils/voxels";

function buildRoom(): Voxel[] {
  const v: Voxel[] = [];
  // Floor — warmer readable stone
  for (let x = -40; x <= 40; x++) {
    for (let z = -30; z <= 30; z++) {
      const checker = (x + z) % 2 === 0 ? "#2e343c" : "#3a424c";
      v.push({ x, y: 0, z, color: checker });
    }
  }
  // Back wall
  for (let x = -40; x <= 40; x++) {
    for (let y = 1; y <= 28; y++) {
      const c = (x + y) % 3 === 0 ? "#4a5560" : "#3a424c";
      if (x >= -28 && x <= -16 && y >= 10 && y <= 22) continue;
      v.push({ x, y, z: -28, color: c });
    }
  }
  // Ceiling beams
  for (let x = -38; x <= 38; x++) {
    v.push({ x, y: 28, z: -20, color: PALETTE.woodDark });
    v.push({ x, y: 28, z: -8, color: PALETTE.woodDark });
    v.push({ x, y: 28, z: 4, color: PALETTE.woodDark });
  }
  // Left wall
  for (let z = -28; z <= 28; z++) {
    for (let y = 1; y <= 28; y++) {
      v.push({ x: -40, y, z, color: (z + y) % 2 === 0 ? "#3a424c" : "#2a3038" });
    }
  }
  // Right wall
  for (let z = -28; z <= 16; z++) {
    for (let y = 1; y <= 28; y++) {
      v.push({ x: 40, y, z, color: "#3a424c" });
    }
  }
  return v;
}

function buildWindowFrame(): Voxel[] {
  const v: Voxel[] = [];
  for (let x = -28; x <= -16; x++) {
    v.push({ x, y: 10, z: -27, color: PALETTE.woodDark });
    v.push({ x, y: 22, z: -27, color: PALETTE.woodDark });
  }
  for (let y = 10; y <= 22; y++) {
    v.push({ x: -28, y, z: -27, color: PALETTE.woodDark });
    v.push({ x: -16, y, z: -27, color: PALETTE.woodDark });
    v.push({ x: -22, y, z: -27, color: PALETTE.wood });
  }
  return v;
}

function buildSinkBody(): Voxel[] {
  const v: Voxel[] = [];
  // Stone counter
  v.push(...boxVoxels(-14, 1, -8, 28, 8, 14, PALETTE.stoneMid));
  // Hollow basins (carve tops)
  const basins = [
    { cx: -8, color: "#2a1840" },
    { cx: 0, color: "#402010" },
    { cx: 8, color: "#102030" },
  ];
  basins.forEach((b) => {
    for (let x = b.cx - 3; x <= b.cx + 3; x++) {
      for (let z = -5; z <= 1; z++) {
        for (let y = 6; y <= 8; y++) {
          // Remove center for basin hole — we'll skip adding in overlay
        }
      }
    }
  });
  // Basin rims
  basins.forEach((b) => {
    for (let x = b.cx - 4; x <= b.cx + 4; x++) {
      for (let z = -6; z <= 2; z++) {
        const edge = Math.abs(x - b.cx) === 4 || z === -6 || z === 2;
        if (edge) v.push({ x, y: 9, z, color: PALETTE.stoneLight });
      }
    }
  });
  // Faucet stems
  basins.forEach((b) => {
    for (let y = 10; y <= 14; y++) v.push({ x: b.cx, y, z: -6, color: PALETTE.iron });
    v.push({ x: b.cx, y: 14, z: -5, color: PALETTE.iron });
    v.push({ x: b.cx, y: 13, z: -4, color: PALETTE.iron });
  });
  return v;
}

function buildFurniture(): Voxel[] {
  const v: Voxel[] = [];
  // Left dirty table
  v.push(...boxVoxels(-32, 1, -6, 12, 7, 10, PALETTE.wood));
  v.push(...boxVoxels(-32, 8, -6, 12, 1, 10, PALETTE.woodLight));
  // Crates
  v.push(...boxVoxels(-36, 1, 8, 6, 6, 6, PALETTE.woodDark));
  v.push(...boxVoxels(-34, 7, 9, 4, 4, 4, PALETTE.wood));
  // Right serving counter
  v.push(...boxVoxels(16, 1, -10, 18, 7, 12, PALETTE.woodDark));
  v.push(...boxVoxels(16, 8, -10, 18, 1, 12, PALETTE.wood));
  // Purple runner
  v.push(...boxVoxels(18, 9, -6, 12, 1, 4, PALETTE.purpleRug));
  v.push({ x: 24, y: 10, z: -4, color: PALETTE.gold });
  // Shelf
  v.push(...boxVoxels(20, 16, -12, 14, 1, 4, PALETTE.wood));
  // Book
  v.push(...boxVoxels(26, 17, -11, 4, 3, 3, PALETTE.book));
  v.push({ x: 27, y: 19, z: -10, color: PALETTE.gold });
  // Potion
  v.push(...boxVoxels(22, 17, -11, 2, 3, 2, "#7B3FE4"));
  // Candle on shelf
  v.push({ x: 30, y: 17, z: -10, color: PALETTE.candle });
  v.push({ x: 30, y: 18, z: -10, color: PALETTE.candle });
  // Herbs
  for (let i = 0; i < 5; i++) {
    v.push({ x: 21 + i, y: 20, z: -11, color: PALETTE.herb });
    v.push({ x: 21 + i, y: 21, z: -11, color: "#5a9a50" });
  }
  // Left lantern
  v.push(...boxVoxels(-34, 12, 10, 2, 2, 2, PALETTE.iron));
  // Purple plant
  v.push({ x: -33, y: 11, z: 11, color: "#3a6040" });
  v.push({ x: -33, y: 12, z: 11, color: "#8B3FE4" });
  v.push({ x: -32, y: 12, z: 11, color: "#9B59F5" });
  // Chalkboard board back
  v.push(...boxVoxels(18, 10, -11, 12, 8, 1, "#1a1a14"));
  // Drying rack
  for (let y = 12; y <= 20; y++) {
    v.push({ x: -18, y, z: -12, color: PALETTE.wood });
    v.push({ x: -10, y, z: -12, color: PALETTE.wood });
  }
  for (let x = -18; x <= -10; x++) {
    v.push({ x, y: 20, z: -12, color: PALETTE.woodLight });
    v.push({ x, y: 16, z: -12, color: PALETTE.woodLight });
  }
  // Broom in corner
  for (let y = 1; y <= 14; y++) v.push({ x: 36, y, z: 8, color: PALETTE.woodPale });
  for (let x = 34; x <= 38; x++) {
    for (let z = 7; z <= 9; z++) v.push({ x, y: 1, z, color: "#8a7a40" });
  }
  // Extra bottles on left table
  v.push(...boxVoxels(-30, 9, -2, 2, 3, 2, "#3a8060"));
  v.push(...boxVoxels(-27, 9, 0, 2, 4, 2, "#8030a0"));
  // Cobweb corners (sparse)
  for (let i = 0; i < 6; i++) {
    v.push({ x: -38 + i, y: 26 - i, z: -26, color: "#8a8a9a" });
    v.push({ x: 34 + (i % 3), y: 25 - i, z: -26, color: "#7a7a8a" });
  }
  return v;
}

function NightSky() {
  const stars = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 40; i++) {
      pts.push([-3.2 + Math.random() * 1.4, 1.4 + Math.random() * 1.2, -3.5]);
    }
    return pts;
  }, []);
  return (
    <group>
      <mesh position={[-2.6, 1.9, -3.35]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial color="#1a0a2e" />
      </mesh>
      {/* Moon */}
      <mesh position={[-2.3, 2.3, -3.3]}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshBasicMaterial color="#e8e0ff" />
      </mesh>
      {/* Tree silhouettes */}
      {[-3.1, -2.7, -2.2].map((x, i) => (
        <mesh key={i} position={[x, 1.5, -3.32]}>
          <boxGeometry args={[0.12 + i * 0.02, 0.5 + i * 0.1, 0.05]} />
          <meshBasicMaterial color="#0a0810" />
        </mesh>
      ))}
      {stars.map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.03, 0.03, 0.03]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}

function Candle({ position }: { position: [number, number, number] }) {
  const flame = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (flame.current) {
      const t = clock.elapsedTime;
      flame.current.scale.y = 1 + Math.sin(t * 8) * 0.15;
      flame.current.position.y = position[1] + 0.18 + Math.sin(t * 10) * 0.01;
    }
  });
  return (
    <group>
      <mesh position={position} castShadow>
        <boxGeometry args={[0.1, 0.22, 0.1]} />
        <meshStandardMaterial color={PALETTE.candle} flatShading />
      </mesh>
      <mesh ref={flame} position={[position[0], position[1] + 0.18, position[2]]}>
        <coneGeometry args={[0.05, 0.14, 5]} />
        <meshStandardMaterial
          color={PALETTE.flame}
          emissive={PALETTE.flame}
          emissiveIntensity={2}
          flatShading
        />
      </mesh>
      <pointLight
        position={[position[0], position[1] + 0.25, position[2]]}
        color="#ffaa55"
        intensity={1.2}
        distance={4}
        decay={2}
      />
    </group>
  );
}

function MagicalWater({
  position,
  color,
  emissive,
}: {
  position: [number, number, number];
  color: string;
  emissive: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 2 + position[0]) * 0.02;
    }
  });
  return (
    <group>
      <mesh ref={ref} position={position}>
        <boxGeometry args={[0.7, 0.15, 0.65]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={0.85}
          transparent
          opacity={0.85}
          flatShading
          roughness={0.3}
        />
      </mesh>
      {/* Stream from faucet */}
      <mesh position={[position[0], position[1] + 0.45, position[2] - 0.15]}>
        <boxGeometry args={[0.06, 0.4, 0.06]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={1.2}
          transparent
          opacity={0.7}
        />
      </mesh>
      <pointLight position={[position[0], position[1] + 0.2, position[2]]} color={emissive} intensity={1.5} distance={3} />
    </group>
  );
}

function FloatingSparkles() {
  const group = useRef<THREE.Group>(null);
  const sparks = useMemo(
    () =>
      Array.from({ length: 24 }, () => ({
        x: (Math.random() - 0.5) * 4,
        y: 0.8 + Math.random() * 1.5,
        z: (Math.random() - 0.5) * 2,
        speed: 0.3 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      })),
    []
  );
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      const s = sparks[i];
      child.position.y = s.y + Math.sin(clock.elapsedTime * s.speed + s.phase) * 0.15;
      child.rotation.z = clock.elapsedTime;
    });
  });
  return (
    <group ref={group} position={[0, 1, 0]}>
      {sparks.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, s.z]}>
          <boxGeometry args={[0.04, 0.04, 0.04]} />
          <meshBasicMaterial color={i % 3 === 0 ? "#c9a0ff" : i % 3 === 1 ? "#ffcc66" : "#88e0ff"} />
        </mesh>
      ))}
    </group>
  );
}

export function KitchenEnvironment({
  effects,
}: {
  effects: string[];
}) {
  const room = useMemo(() => buildRoom(), []);
  const windowFrame = useMemo(() => buildWindowFrame(), []);
  const sink = useMemo(() => buildSinkBody(), []);
  const furniture = useMemo(() => buildFurniture(), []);
  const size = 0.12;

  return (
    <group>
      <VoxelMesh voxels={room} size={size} castShadow={false} />
      <VoxelMesh voxels={windowFrame} size={size} />
      <VoxelMesh voxels={sink} size={size} position={[0, 0, 0]} />
      <VoxelMesh voxels={furniture} size={size} />
      <NightSky />
      <FloatingSparkles />

      {/* Basin waters — world positions matching voxel sink */}
      <MagicalWater position={[-0.96, 1.05, -0.24]} color="#6B2FD4" emissive="#9B59F5" />
      <MagicalWater position={[0, 1.05, -0.24]} color="#FF8C22" emissive="#FFAA33" />
      <MagicalWater position={[0.96, 1.05, -0.24]} color="#2ECCF0" emissive="#5ED4FF" />

      {/* Basin icon markers */}
      <BasinSign position={[-0.96, 1.55, -0.75]} color="#9B59F5" kind="moon" label="Moonwater" />
      <BasinSign position={[0, 1.55, -0.75]} color="#FF8C22" kind="sun" label="Sunfire" />
      <BasinSign position={[0.96, 1.55, -0.75]} color="#2ECCF0" kind="drop" label="Still" />

      <Candle position={[2.55, 1.15, -0.7]} />
      <Candle position={[3.5, 2.1, -1.15]} />
      <Candle position={[-3.8, 1.5, 1.1]} />

      {/* Purple rug */}
      <mesh position={[2.6, 0.13, 1.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.4, 1]} />
        <meshStandardMaterial color={PALETTE.purpleRug} flatShading />
      </mesh>
      <mesh position={[2.6, 0.14, 1.2]}>
        <boxGeometry args={[0.15, 0.02, 0.15]} />
        <meshStandardMaterial color={PALETTE.gold} emissive={PALETTE.gold} emissiveIntensity={0.3} />
      </mesh>

      {/* Moonlight shaft when unlocked */}
      {effects.includes("moonlight") && (
        <mesh position={[-2.4, 1.8, -1.5]} rotation={[0.4, 0.2, 0]}>
          <planeGeometry args={[1.2, 2.5]} />
          <meshBasicMaterial color="#b8a0ff" transparent opacity={0.12} depthWrite={false} />
        </mesh>
      )}

      {/* Hearth glow */}
      {effects.includes("hearth") && (
        <pointLight position={[-3.5, 1.2, -2]} color="#6688ff" intensity={2} distance={5} />
      )}

      {/* Ambient kitchen fill — brighter for readable voxels */}
      <ambientLight intensity={0.55} color="#3a2a48" />
      <hemisphereLight args={["#6a5080", "#1a1018", 0.7]} />
      <directionalLight
        position={[5, 9, 4]}
        intensity={0.65}
        color="#ffd8b0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* Moon light through window */}
      <spotLight
        position={[-2.5, 2.8, -1.5]}
        angle={0.55}
        penumbra={0.5}
        intensity={2.2}
        color="#c8b8ff"
        castShadow
      />
      {/* Fill from front so dishes read clearly */}
      <pointLight position={[0, 3, 3]} color="#ffcc99" intensity={0.9} distance={12} />
      <pointLight position={[-2, 2, 2]} color="#8866aa" intensity={0.5} distance={8} />
    </group>
  );
}

function BasinSign({
  position,
  color,
  kind,
}: {
  position: [number, number, number];
  color: string;
  kind: "moon" | "sun" | "drop";
  label: string;
}) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.35, 0.2, 0.06]} />
        <meshStandardMaterial color={PALETTE.wood} flatShading />
      </mesh>
      {kind === "moon" && (
        <mesh position={[0, 0.22, 0.02]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} flatShading />
        </mesh>
      )}
      {kind === "sun" && (
        <mesh position={[0, 0.22, 0.02]}>
          <sphereGeometry args={[0.09, 6, 6]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} flatShading />
        </mesh>
      )}
      {kind === "drop" && (
        <mesh position={[0, 0.22, 0.02]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.07, 0.14, 5]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} flatShading />
        </mesh>
      )}
    </group>
  );
}
