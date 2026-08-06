"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  woodMaterial,
  stoneMaterial,
  floorMaterial,
  PALETTE,
} from "../utils/voxel";

function Box({
  position,
  args,
  material,
  rotation,
}: {
  position: [number, number, number];
  args: [number, number, number];
  material: THREE.Material;
  rotation?: [number, number, number];
}) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      material={material}
      castShadow
      receiveShadow
    >
      <boxGeometry args={args} />
    </mesh>
  );
}

function Candle({
  position,
}: {
  position: [number, number, number];
}) {
  const flame = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const flicker = 0.85 + Math.sin(t * 9 + position[0] * 3) * 0.12 + Math.sin(t * 17) * 0.05;
    if (flame.current) {
      flame.current.scale.setScalar(flicker);
    }
    if (light.current) {
      light.current.intensity = 1.2 * flicker;
    }
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.16, 6]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.8} />
      </mesh>
      <mesh ref={flame} position={[0, 0.2, 0]}>
        <coneGeometry args={[0.035, 0.1, 5]} />
        <meshStandardMaterial
          color={PALETTE.candle}
          emissive={PALETTE.candle}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        ref={light}
        position={[0, 0.25, 0]}
        color={PALETTE.candle}
        intensity={2.4}
        distance={8}
        decay={2}
      />
    </group>
  );
}

function LavenderBunch({
  position,
  rotationY = 0,
}: {
  position: [number, number, number];
  rotationY?: number;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[(i - 2) * 0.04, 0.15, 0]}
          rotation={[0.2, 0, (i - 2) * 0.1]}
        >
          <boxGeometry args={[0.04, 0.35, 0.04]} />
          <meshStandardMaterial color={i % 2 ? "#6B4C9A" : "#8B6BB8"} />
        </mesh>
      ))}
    </group>
  );
}

function WindowWithMoon({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      {/* Frame */}
      <Box
        position={[0, 0, 0]}
        args={[2.2, 2.2, 0.15]}
        material={woodMaterial(1)}
      />
      {/* Night sky pane */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[1.8, 1.8]} />
        <meshStandardMaterial
          color="#0A1220"
          emissive="#152038"
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* Moon */}
      <mesh position={[0.35, 0.4, 0.05]}>
        <boxGeometry args={[0.45, 0.45, 0.05]} />
        <meshStandardMaterial
          color={PALETTE.moon}
          emissive={PALETTE.moon}
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
      {/* Forest silhouettes */}
      {[-0.6, -0.2, 0.3, 0.7].map((x, i) => (
        <mesh key={i} position={[x, -0.55, 0.04]}>
          <boxGeometry args={[0.25 + (i % 2) * 0.1, 0.5 + i * 0.08, 0.04]} />
          <meshStandardMaterial color="#0D1A12" />
        </mesh>
      ))}
      <pointLight
        position={[0, 0, 0.5]}
        color={PALETTE.moon}
        intensity={0.55}
        distance={8}
        decay={2}
      />
    </group>
  );
}

function Banner({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.7, 0.9, 0.04]} />
        <meshStandardMaterial color="#4A2A6A" roughness={0.7} />
      </mesh>
      {/* Crescent moon emblem */}
      <mesh position={[0, 0.1, 0.03]}>
        <boxGeometry args={[0.2, 0.2, 0.02]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#AA8800"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
}

export function KitchenEnvironment() {
  const wood = useMemo(() => woodMaterial(0), []);
  const wood2 = useMemo(() => woodMaterial(1), []);
  const stone = useMemo(() => stoneMaterial(), []);
  const floor = useMemo(() => floorMaterial(), []);

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 18]} />
        <primitive object={floor} attach="material" />
      </mesh>

      {/* Walls */}
      {/* Back */}
      <mesh position={[0, 2.2, -6]} receiveShadow>
        <boxGeometry args={[20, 4.4, 0.4]} />
        <primitive object={stone} attach="material" />
      </mesh>
      {/* Front */}
      <mesh position={[0, 2.2, 7]} receiveShadow>
        <boxGeometry args={[20, 4.4, 0.4]} />
        <primitive object={stone.clone()} attach="material" />
      </mesh>
      {/* Left */}
      <mesh position={[-9, 2.2, 0.5]} receiveShadow>
        <boxGeometry args={[0.4, 4.4, 14]} />
        <primitive object={stone.clone()} attach="material" />
      </mesh>
      {/* Right / pantry divider */}
      <mesh position={[9, 2.2, 0.5]} receiveShadow>
        <boxGeometry args={[0.4, 4.4, 14]} />
        <primitive object={stone.clone()} attach="material" />
      </mesh>

      {/* Ceiling beams */}
      {[-4, -1.5, 1.5, 4].map((x) => (
        <Box
          key={x}
          position={[x, 4.1, 0.5]}
          args={[0.35, 0.35, 13]}
          material={wood2}
        />
      ))}
      {/* Ceiling plane */}
      <mesh position={[0, 4.3, 0.5]} receiveShadow>
        <boxGeometry args={[20, 0.2, 14]} />
        <meshStandardMaterial color="#1A1410" roughness={1} />
      </mesh>

      <WindowWithMoon position={[-8.7, 2.2, -2]} />
      <WindowWithMoon position={[-8.7, 2.2, 2.5]} />

      {/* Side table with candle + lavender */}
      <Box position={[-6.5, 0.4, -3.5]} args={[1.2, 0.8, 0.7]} material={wood} />
      <Candle position={[-6.3, 0.85, -3.5]} />
      <LavenderBunch position={[-6.7, 0.85, -3.3]} />
      <Banner position={[-6.5, 1.6, -3.8]} />

      {/* Wall candles — denser ring so the kitchen reads clearly */}
      <Candle position={[-3, 2.4, -5.7]} />
      <Candle position={[3, 2.4, -5.7]} />
      <Candle position={[0, 2.6, 6.6]} />
      <Candle position={[5, 1.8, 4]} />
      <Candle position={[-5, 1.8, 4]} />
      <Candle position={[0, 2.2, -5.5]} />
      <Candle position={[6.5, 2.0, -1]} />
      <Candle position={[-1.5, 1.1, 1.5]} />
      <Candle position={[1.5, 1.1, 1.5]} />

      {/* Bench for cat */}
      <Box position={[-6.2, 0.35, -1.2]} args={[1.4, 0.7, 0.55]} material={wood2} />

      {/* Hanging lavender */}
      <LavenderBunch position={[-1, 3.2, -5.6]} />
      <LavenderBunch position={[1.5, 3.3, -5.6]} rotationY={0.3} />
      <LavenderBunch position={[4, 3.1, -0.5]} rotationY={1} />

      {/* Feast table (long) */}
      <Box position={[0, 0.7, 1.5]} args={[7.5, 0.12, 1.4]} material={wood} />
      <Box position={[-3.4, 0.35, 1.5]} args={[0.15, 0.7, 0.15]} material={wood2} />
      <Box position={[3.4, 0.35, 1.5]} args={[0.15, 0.7, 0.15]} material={wood2} />
      <Box position={[-3.4, 0.35, 2.0]} args={[0.15, 0.7, 0.15]} material={wood2} />
      <Box position={[3.4, 0.35, 2.0]} args={[0.15, 0.7, 0.15]} material={wood2} />
      {/* Purple runner */}
      <mesh position={[0, 0.77, 1.5]} receiveShadow>
        <boxGeometry args={[7.2, 0.02, 0.55]} />
        <meshStandardMaterial color="#4A2A6A" roughness={0.75} />
      </mesh>

      {/* Pantry shelves (right) */}
      <Box position={[7.5, 1.5, -2]} args={[0.8, 3, 2.5]} material={wood} />
      {[0.5, 1.2, 1.9, 2.6].map((y) => (
        <Box
          key={y}
          position={[7.3, y, -2]}
          args={[0.6, 0.08, 2.3]}
          material={wood2}
        />
      ))}

      {/* Bright cozy fill — readable voxel kitchen, still night */}
      <ambientLight intensity={0.55} color="#6A5A78" />
      <hemisphereLight args={["#8AA0C8", "#3A2818", 0.7]} />
      <directionalLight
        position={[-6, 8, 2]}
        intensity={0.85}
        color="#FFE0B0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        position={[4, 6, -4]}
        intensity={0.35}
        color={PALETTE.moon}
      />
      {/* Room fill lamps — cover cupboard walls so navigation stays readable */}
      <pointLight position={[0, 3.2, 0]} color="#FFCC88" intensity={2.4} distance={16} decay={2} />
      <pointLight position={[-2, 2.5, -3]} color="#FFAA66" intensity={2.0} distance={12} decay={2} />
      <pointLight position={[3, 2.5, -3]} color="#FFAA66" intensity={2.0} distance={12} decay={2} />
      <pointLight position={[0, 2.5, 4]} color="#FFBB77" intensity={1.8} distance={12} decay={2} />
      <pointLight position={[-2, 2.8, 5]} color="#FFCC99" intensity={1.6} distance={10} decay={2} />
      <pointLight position={[5, 2.6, -1]} color="#FFCC99" intensity={1.5} distance={10} decay={2} />
      <pointLight position={[-6, 2.4, 0]} color="#CCD8FF" intensity={1.2} distance={10} decay={2} />

      {/* Soft night fog — keep depth without burying the room */}
      <fog attach="fog" args={["#1A1520", 16, 36]} />
    </group>
  );
}
