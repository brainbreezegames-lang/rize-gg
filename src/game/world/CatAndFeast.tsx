"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useGameStore } from "../store/gameStore";
import { FEAST_GUESTS } from "../data/lore";
import { getSet } from "../data/sets";
import { PALETTE } from "../utils/voxel";

export function CatFamiliar() {
  const ref = useRef<THREE.Group>(null);
  const eyeL = useRef<THREE.Mesh>(null);
  const eyeR = useRef<THREE.Mesh>(null);

  useFrame(({ clock, camera }) => {
    if (!ref.current) return;
    // Look vaguely toward player
    const dx = camera.position.x - ref.current.position.x;
    const dz = camera.position.z - ref.current.position.z;
    ref.current.rotation.y = Math.atan2(dx, dz) * 0.5;
    const blink = Math.sin(clock.elapsedTime * 0.7) > 0.95 ? 0.2 : 1;
    if (eyeL.current) eyeL.current.scale.y = blink;
    if (eyeR.current) eyeR.current.scale.y = blink;
  });

  return (
    <group
      ref={ref}
      position={[-6.2, 0.75, -1.2]}
      userData={{ interact: "cat" }}
    >
      {/* Body */}
      <mesh castShadow position={[0, 0.05, 0]}>
        <boxGeometry args={[0.35, 0.25, 0.5]} />
        <meshStandardMaterial color="#1A1A1E" roughness={0.9} />
      </mesh>
      {/* Head */}
      <mesh castShadow position={[0, 0.22, 0.22]}>
        <boxGeometry args={[0.28, 0.25, 0.28]} />
        <meshStandardMaterial color="#1A1A1E" />
      </mesh>
      {/* Ears */}
      <mesh position={[-0.1, 0.38, 0.22]}>
        <boxGeometry args={[0.08, 0.12, 0.06]} />
        <meshStandardMaterial color="#1A1A1E" />
      </mesh>
      <mesh position={[0.1, 0.38, 0.22]}>
        <boxGeometry args={[0.08, 0.12, 0.06]} />
        <meshStandardMaterial color="#1A1A1E" />
      </mesh>
      {/* Eyes */}
      <mesh ref={eyeL} position={[-0.07, 0.24, 0.36]}>
        <boxGeometry args={[0.06, 0.08, 0.02]} />
        <meshStandardMaterial
          color="#88FF44"
          emissive="#66CC22"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={eyeR} position={[0.07, 0.24, 0.36]}>
        <boxGeometry args={[0.06, 0.08, 0.02]} />
        <meshStandardMaterial
          color="#88FF44"
          emissive="#66CC22"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
      {/* Collar */}
      <mesh position={[0, 0.12, 0.2]}>
        <boxGeometry args={[0.3, 0.05, 0.3]} />
        <meshStandardMaterial color="#6B3FA0" />
      </mesh>
      <mesh position={[0, 0.08, 0.35]}>
        <boxGeometry args={[0.06, 0.06, 0.06]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      {/* Tail */}
      <mesh position={[0.05, 0.15, -0.32]} rotation={[0.4, 0, 0.3]}>
        <boxGeometry args={[0.06, 0.06, 0.35]} />
        <meshStandardMaterial color="#1A1A1E" />
      </mesh>
    </group>
  );
}

export function FeastSeats() {
  const completed = useGameStore((s) => s.completedSets);

  return (
    <group>
      {FEAST_GUESTS.map((guest, i) => {
        const done = completed.includes(guest.setId);
        // Arrange along table
        const x = -3.2 + (i % 6) * 1.2;
        const z = i < 6 ? 1.0 : 2.0;
        const set = getSet(guest.setId);

        return (
          <group key={guest.setId} position={[x, 0.78, z]}>
            {done ? (
              <>
                {/* Place setting */}
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
                  <cylinderGeometry args={[0.16, 0.16, 0.03, 8]} />
                  <meshStandardMaterial
                    color={set.primary}
                    emissive={PALETTE.gold}
                    emissiveIntensity={0.35}
                  />
                </mesh>
                <mesh position={[0.18, 0.05, 0]}>
                  <cylinderGeometry args={[0.05, 0.04, 0.12, 6]} />
                  <meshStandardMaterial color={set.accent} />
                </mesh>
                <mesh position={[-0.15, 0.03, 0.05]}>
                  <boxGeometry args={[0.08, 0.02, 0.1]} />
                  <meshStandardMaterial color="#3A6B3A" />
                </mesh>
                <SparkleBurst />
                <Text
                  position={[0, 0.12, -0.22]}
                  fontSize={0.07}
                  color="#FFD700"
                  anchorX="center"
                >
                  {guest.name.toUpperCase()}
                </Text>
              </>
            ) : (
              <mesh position={[0, 0.01, 0]}>
                <boxGeometry args={[0.35, 0.01, 0.35]} />
                <meshStandardMaterial
                  color="#FFFFFF"
                  transparent
                  opacity={0.06}
                />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

function SparkleBurst() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime;
    ref.current.children.forEach((c, i) => {
      c.position.y = 0.08 + Math.sin(clock.elapsedTime * 3 + i) * 0.05;
    });
  });
  return (
    <group ref={ref}>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 4) * Math.PI * 2) * 0.12,
            0.1,
            Math.sin((i / 4) * Math.PI * 2) * 0.12,
          ]}
        >
          <boxGeometry args={[0.025, 0.025, 0.025]} />
          <meshStandardMaterial
            color={PALETTE.gold}
            emissive={PALETTE.gold}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export function CallTheSetVFX() {
  const activeCharm = useGameStore((s) => s.activeCharm);
  const glowingSetId = useGameStore((s) => s.glowingSetId);
  const items = useGameStore((s) => s.items);
  const ref = useRef<THREE.Group>(null);

  useFrame(({ camera, clock }) => {
    if (!ref.current) return;
    if (!activeCharm?.includes("call") || !glowingSetId) {
      ref.current.visible = false;
      return;
    }
    ref.current.visible = true;
  });

  if (!glowingSetId) return null;

  const flying = items.filter(
    (i) =>
      i.setId === glowingSetId &&
      i.inventorySlot === null &&
      !i.placedSlotId &&
      !i.hidden
  );

  return (
    <group ref={ref}>
      {flying.slice(0, 6).map((item, i) => (
        <FlyingTrail key={item.id} index={i} color={PALETTE.purpleMagic} />
      ))}
    </group>
  );
}

function FlyingTrail({
  index,
  color,
}: {
  index: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ camera, clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * 2 + index;
    const orbit = 0.8 + index * 0.15;
    ref.current.position.set(
      camera.position.x + Math.cos(t) * orbit,
      camera.position.y - 0.2 + Math.sin(t * 1.3) * 0.3,
      camera.position.z + Math.sin(t) * orbit - 0.5
    );
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.08, 0.08, 0.08]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        toneMapped={false}
      />
    </mesh>
  );
}
