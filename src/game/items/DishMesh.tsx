"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PALETTE } from "../utils/voxel";
import { getSet, type Category, type SizeRank } from "../data/sets";
import type { WorldItem } from "../data/items";
import { useGameStore } from "../store/gameStore";
import { CUPBOARDS, slotWorldPosition } from "../data/cupboards";

function sizeScale(size: SizeRank): number {
  return 1 - size * 0.16;
}

/** Voxel brick helper */
function Brick({
  position,
  args,
  color,
  emissive,
}: {
  position: [number, number, number];
  args: [number, number, number];
  color: string;
  emissive?: string;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial
        color={color}
        emissive={emissive ?? color}
        emissiveIntensity={emissive ? 0.35 : 0.08}
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
}

export function DishMesh({
  item,
  highlight,
  magic,
}: {
  item: WorldItem;
  highlight?: boolean;
  magic?: boolean;
}) {
  const set = getSet(item.setId);
  const s = sizeScale(item.size);
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current || !magic) return;
    group.current.position.y += Math.sin(clock.elapsedTime * 4) * 0.002;
  });

  return (
    <group ref={group} scale={s}>
      {item.isLid ? (
        <VoxelLid primary={set.primary} accent={set.accent} rim={set.rim} />
      ) : (
        <VoxelDish
          category={item.category}
          size={item.size}
          primary={set.primary}
          accent={set.accent}
          rim={set.rim}
        />
      )}
      {highlight && (
        <mesh scale={1.15} position={[0, 0.05, 0]}>
          <boxGeometry args={[0.5, 0.25, 0.5]} />
          <meshStandardMaterial
            color={PALETTE.gold}
            transparent
            opacity={0.22}
            emissive={PALETTE.gold}
            emissiveIntensity={1.4}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      )}
      {magic && (
        <mesh scale={1.2} position={[0, 0.08, 0]}>
          <boxGeometry args={[0.45, 0.3, 0.45]} />
          <meshStandardMaterial
            color={PALETTE.purpleMagic}
            transparent
            opacity={0.2}
            emissive={PALETTE.purpleMagic}
            emissiveIntensity={1.6}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
}

function VoxelDish({
  category,
  size,
  primary,
  accent,
  rim,
}: {
  category: Category;
  size: SizeRank;
  primary: string;
  accent: string;
  rim: string;
}) {
  const w = 0.42 - size * 0.05;

  switch (category) {
    case "plates":
      return (
        <group>
          {/* Flat plate base */}
          <Brick position={[0, 0, 0]} args={[w, 0.04, w]} color={primary} />
          {/* Rim ring as 4 edge bricks */}
          <Brick position={[0, 0.03, w / 2 - 0.02]} args={[w, 0.03, 0.04]} color={rim} />
          <Brick position={[0, 0.03, -w / 2 + 0.02]} args={[w, 0.03, 0.04]} color={rim} />
          <Brick position={[w / 2 - 0.02, 0.03, 0]} args={[0.04, 0.03, w - 0.08]} color={rim} />
          <Brick position={[-w / 2 + 0.02, 0.03, 0]} args={[0.04, 0.03, w - 0.08]} color={rim} />
          {/* Pattern center */}
          <Brick position={[0, 0.025, 0]} args={[w * 0.45, 0.02, w * 0.45]} color={accent} />
        </group>
      );
    case "bowls":
      return (
        <group>
          <Brick position={[0, 0.02, 0]} args={[w * 0.7, 0.04, w * 0.7]} color={primary} />
          <Brick position={[0, 0.08, w * 0.32]} args={[w * 0.75, 0.1, 0.05]} color={primary} />
          <Brick position={[0, 0.08, -w * 0.32]} args={[w * 0.75, 0.1, 0.05]} color={primary} />
          <Brick position={[w * 0.32, 0.08, 0]} args={[0.05, 0.1, w * 0.65]} color={primary} />
          <Brick position={[-w * 0.32, 0.08, 0]} args={[0.05, 0.1, w * 0.65]} color={primary} />
          <Brick position={[0, 0.1, 0]} args={[w * 0.3, 0.02, w * 0.3]} color={accent} />
        </group>
      );
    case "cups":
      return (
        <group>
          <Brick position={[0, 0.08, 0]} args={[0.14, 0.18, 0.14]} color={primary} />
          <Brick position={[0, 0.18, 0]} args={[0.16, 0.03, 0.16]} color={rim} />
          <Brick position={[0.12, 0.08, 0]} args={[0.08, 0.03, 0.03]} color={accent} />
          <Brick position={[0.15, 0.08, 0]} args={[0.03, 0.1, 0.03]} color={accent} />
        </group>
      );
    case "cutlery":
      return (
        <group rotation={[0, 0, size === 1 ? 0.15 : 0]}>
          <Brick position={[0, 0.1, 0]} args={[0.04, 0.28, 0.03]} color={rim} />
          {size === 0 && (
            <Brick position={[0, 0.26, 0]} args={[0.1, 0.08, 0.02]} color={primary} />
          )}
          {size === 1 && (
            <Brick position={[0, 0.26, 0]} args={[0.05, 0.1, 0.02]} color={primary} />
          )}
          {size >= 2 && (
            <Brick position={[0, 0.24, 0]} args={[0.08, 0.06, 0.03]} color={primary} />
          )}
        </group>
      );
    case "cookware":
      return (
        <group>
          <Brick position={[0, 0.08, 0]} args={[w * 0.85, 0.18, w * 0.85]} color={primary} />
          <Brick position={[0, 0.18, 0]} args={[w * 0.9, 0.04, w * 0.9]} color={rim} />
          <Brick position={[w * 0.5, 0.1, 0]} args={[0.1, 0.04, 0.04]} color={accent} />
          <Brick position={[-w * 0.5, 0.1, 0]} args={[0.1, 0.04, 0.04]} color={accent} />
        </group>
      );
    case "jars":
      return (
        <group>
          <Brick position={[0, 0.1, 0]} args={[0.16, 0.22, 0.16]} color={primary} />
          <Brick position={[0, 0.24, 0]} args={[0.12, 0.06, 0.12]} color={rim} />
          <Brick position={[0, 0.12, 0.09]} args={[0.1, 0.08, 0.02]} color={accent} />
        </group>
      );
    default:
      return <Brick position={[0, 0.05, 0]} args={[0.2, 0.2, 0.2]} color={primary} />;
  }
}

function VoxelLid({
  primary,
  accent,
  rim,
}: {
  primary: string;
  accent: string;
  rim: string;
}) {
  return (
    <group>
      <Brick position={[0, 0.02, 0]} args={[0.36, 0.04, 0.36]} color={primary} />
      <Brick position={[0, 0.05, 0]} args={[0.38, 0.03, 0.38]} color={rim} />
      <Brick position={[0, 0.1, 0]} args={[0.08, 0.08, 0.08]} color={accent} />
    </group>
  );
}

export function WorldItems() {
  const items = useGameStore((s) => s.items);
  const slots = useGameStore((s) => s.slots);
  const guidingItemId = useGameStore((s) => s.guidingItemId);
  const glowingSetId = useGameStore((s) => s.glowingSetId);
  const activeCharm = useGameStore((s) => s.activeCharm);

  const cupboardMap = useMemo(() => {
    const m = new Map(CUPBOARDS.map((c) => [c.id, c]));
    return m;
  }, []);

  return (
    <group>
      {items.map((item) => {
        if (item.inventorySlot !== null) return null;
        if (item.hidden) return null;

        let position: [number, number, number] = item.position;
        let rotation: [number, number, number] = item.rotation;

        if (item.placedSlotId) {
          const slot = slots.find((s) => s.id === item.placedSlotId);
          if (slot) {
            const cupboard = cupboardMap.get(slot.cupboardId);
            if (cupboard) {
              position = slotWorldPosition(cupboard, slot);
              rotation = [0, cupboard.rotationY, 0];
            }
          }
        }

        const highlight = guidingItemId === item.id;
        const magic =
          glowingSetId === item.setId &&
          !item.placedSlotId &&
          !!activeCharm?.includes("call");

        return (
          <group
            key={item.id}
            position={position}
            rotation={rotation}
            userData={{ itemId: item.id, interact: "item" }}
          >
            <mesh visible={false}>
              <boxGeometry args={[0.6, 0.5, 0.6]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>
            <DishMesh item={item} highlight={highlight} magic={magic} />
          </group>
        );
      })}
    </group>
  );
}
