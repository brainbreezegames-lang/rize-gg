"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { CUPBOARDS, type CupboardDef } from "../data/cupboards";
import { woodMaterial, PALETTE } from "../utils/voxel";
import { useGameStore } from "../store/gameStore";
import { getSet } from "../data/sets";

function CupboardMesh({ def }: { def: CupboardDef }) {
  const wood = useMemo(() => woodMaterial(0), []);
  const woodDark = useMemo(() => woodMaterial(1), []);
  const [w, h, d] = def.size;

  const held = useGameStore((s) => s.getHeldItem());
  const feedback = useGameStore((s) => s.feedback);
  const feedbackSlotId = useGameStore((s) => s.feedbackSlotId);
  const slots = useGameStore((s) => s.slots);
  const items = useGameStore((s) => s.items);
  const glowingSetId = useGameStore((s) => s.glowingSetId);

  const relevantSlots = slots.filter((s) => s.cupboardId === def.id);

  return (
    <group
      position={def.position}
      rotation={[0, def.rotationY, 0]}
    >
      {/* Cabinet body */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[w, h, d]} />
        <primitive object={wood} attach="material" />
      </mesh>
      {/* Interior hollow (darker) */}
      <mesh position={[0, 0, d * 0.15]}>
        <boxGeometry args={[w - 0.2, h - 0.25, d * 0.7]} />
        <meshStandardMaterial color="#1A120C" roughness={1} />
      </mesh>
      {/* Shelves */}
      {[0.25, -0.35, -0.95].map((y, i) => (
        <mesh key={i} position={[0, y, d * 0.1]} castShadow>
          <boxGeometry args={[w - 0.25, 0.06, d * 0.55]} />
          <primitive object={woodDark} attach="material" />
        </mesh>
      ))}
      {/* Vertical dividers */}
      {[-w * 0.28, w * 0.28].map((x, i) => (
        <mesh key={i} position={[x, 0, d * 0.1]}>
          <boxGeometry args={[0.05, h - 0.3, d * 0.5]} />
          <meshStandardMaterial color="#2A1A10" />
        </mesh>
      ))}

      {/* Sign */}
      <mesh position={[0, h / 2 + 0.18, d / 2 + 0.02]} castShadow>
        <boxGeometry args={[Math.min(w * 0.7, 1.4), 0.28, 0.08]} />
        <meshStandardMaterial color="#5C3A1E" />
      </mesh>
      <Text
        position={[0, h / 2 + 0.18, d / 2 + 0.08]}
        fontSize={0.14}
        color="#E8D5B0"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.2}
      >
        {def.label}
      </Text>

      {/* Decorative flowers on sign */}
      <mesh position={[-Math.min(w * 0.32, 0.65), h / 2 + 0.18, d / 2 + 0.08]}>
        <boxGeometry args={[0.1, 0.1, 0.04]} />
        <meshStandardMaterial color="#5B8EC8" />
      </mesh>
      <mesh position={[Math.min(w * 0.32, 0.65), h / 2 + 0.18, d / 2 + 0.08]}>
        <boxGeometry args={[0.1, 0.1, 0.04]} />
        <meshStandardMaterial color="#5B8EC8" />
      </mesh>

      {/* Set labels for cookware */}
      {def.category === "cookware" && (
        <>
          <Text
            position={[-0.9, h / 2 - 0.35, d / 2 + 0.05]}
            fontSize={0.08}
            color="#E8A05C"
            anchorX="center"
          >
            DRAGONFIRE
          </Text>
          <Text
            position={[0.1, h / 2 - 0.35, d / 2 + 0.05]}
            fontSize={0.08}
            color="#C0C4CC"
            anchorX="center"
          >
            IRONHEART
          </Text>
          <Text
            position={[1.0, h / 2 - 0.35, d / 2 + 0.05]}
            fontSize={0.08}
            color="#8888AA"
            anchorX="center"
          >
            SHADOW
          </Text>
        </>
      )}

      {/* Ghost slots */}
      {relevantSlots.map((slot) => {
        const occupied = items.some((i) => i.placedSlotId === slot.id);
        const isTarget =
          held &&
          held.category === slot.category &&
          held.setId === slot.setId &&
          held.size === slot.size &&
          !!held.isLid === !!slot.isLidSlot &&
          !occupied;

        const isNear =
          held &&
          held.category === slot.category &&
          held.setId === slot.setId &&
          !occupied &&
          !isTarget;

        const isFeedback = feedbackSlotId === slot.id;
        let color = "#FFFFFF";
        let opacity = 0.08;
        let emissive = "#000000";
        let emissiveIntensity = 0;

        if (isTarget) {
          color = PALETTE.gold;
          opacity = 0.45;
          emissive = PALETTE.goldGlow;
          emissiveIntensity = 1.2;
        } else if (isNear) {
          color = PALETTE.yellowNudge;
          opacity = 0.25;
          emissive = PALETTE.yellowNudge;
          emissiveIntensity = 0.4;
        } else if (isFeedback && feedback === "wrong-set") {
          color = PALETTE.redReject;
          opacity = 0.4;
          emissive = PALETTE.redReject;
          emissiveIntensity = 0.8;
        } else if (isFeedback && feedback === "correct") {
          color = PALETTE.gold;
          opacity = 0.5;
          emissive = PALETTE.gold;
          emissiveIntensity = 1.5;
        } else if (glowingSetId === slot.setId && !occupied) {
          color = PALETTE.purpleMagic;
          opacity = 0.2;
          emissive = PALETTE.purpleMagic;
          emissiveIntensity = 0.6;
        } else if (!occupied) {
          // ghost outline circle suggestion
          opacity = 0.12;
        } else {
          opacity = 0;
        }

        const set = getSet(slot.setId);
        const sizeScale = 1 - slot.size * 0.18;

        return (
          <group key={slot.id} position={slot.localPos}>
            {!occupied && (
              <mesh>
                <boxGeometry
                  args={[
                    0.35 * sizeScale,
                    0.08,
                    0.35 * sizeScale,
                  ]}
                />
                <meshStandardMaterial
                  color={color}
                  transparent
                  opacity={opacity}
                  emissive={emissive}
                  emissiveIntensity={emissiveIntensity}
                  depthWrite={false}
                />
              </mesh>
            )}
            {isTarget && <Sparkles local />}
            {/* Tiny set color hint on back */}
            {!occupied && (
              <mesh position={[0, 0.15, -0.12]}>
                <circleGeometry args={[0.06 * sizeScale, 8]} />
                <meshStandardMaterial
                  color={set.primary}
                  transparent
                  opacity={0.5}
                />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

function Sparkles({ local }: { local?: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.children.forEach((c, i) => {
      const t = clock.elapsedTime * 2 + i;
      c.position.y = 0.1 + Math.sin(t) * 0.08;
      c.rotation.y = t;
    });
  });
  return (
    <group ref={ref}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i / 5) * Math.PI * 2) * 0.15,
            0.1,
            Math.sin((i / 5) * Math.PI * 2) * 0.15,
          ]}
        >
          <boxGeometry args={[0.03, 0.03, 0.03]} />
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

export function Cupboards() {
  return (
    <group>
      {CUPBOARDS.map((c) => (
        <CupboardMesh key={c.id} def={c} />
      ))}
    </group>
  );
}
