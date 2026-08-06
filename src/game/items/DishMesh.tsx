"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { dishMaterial, PALETTE } from "../utils/voxel";
import { getSet, type Category, type SizeRank } from "../data/sets";
import type { WorldItem } from "../data/items";
import { useGameStore } from "../store/gameStore";
import { CUPBOARDS, slotWorldPosition } from "../data/cupboards";

function sizeScale(size: SizeRank): number {
  return 1 - size * 0.18;
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
  const mat = useMemo(
    () => dishMaterial(set.primary, set.accent, set.rim, set.material),
    [set]
  );
  const s = sizeScale(item.size);
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current || !magic) return;
    group.current.position.y += Math.sin(clock.elapsedTime * 4) * 0.002;
  });

  const outline = highlight || magic;

  return (
    <group ref={group} scale={s}>
      {item.isLid ? (
        <LidGeom material={mat} />
      ) : (
        <CategoryGeom category={item.category} material={mat} size={item.size} />
      )}
      {outline && (
        <mesh scale={1.08}>
          <boxGeometry args={[0.45, 0.2, 0.45]} />
          <meshStandardMaterial
            color={magic ? PALETTE.purpleMagic : PALETTE.gold}
            transparent
            opacity={0.25}
            emissive={magic ? PALETTE.purpleMagic : PALETTE.gold}
            emissiveIntensity={1.5}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
  );
}

function CategoryGeom({
  category,
  material,
  size,
}: {
  category: Category;
  material: THREE.Material;
  size: SizeRank;
}) {
  switch (category) {
    case "plates":
      return (
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.04, 8]} />
          <primitive object={material} attach="material" />
        </mesh>
      );
    case "bowls":
      return (
        <mesh castShadow>
          <cylinderGeometry args={[0.22, 0.16, 0.14, 8]} />
          <primitive object={material} attach="material" />
        </mesh>
      );
    case "cups":
      return (
        <group>
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.08, 0.18, 8]} />
            <primitive object={material} attach="material" />
          </mesh>
          <mesh position={[0.12, 0, 0]} castShadow>
            <torusGeometry args={[0.06, 0.015, 4, 8, Math.PI]} />
            <primitive object={material} attach="material" />
          </mesh>
        </group>
      );
    case "cutlery":
      return (
        <group rotation={[0, 0, size === 1 ? 0.2 : 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.04, 0.28, 0.02]} />
            <primitive object={material} attach="material" />
          </mesh>
          <mesh position={[0, 0.12, 0]} castShadow>
            <boxGeometry
              args={[size === 0 ? 0.08 : size === 1 ? 0.05 : 0.06, 0.08, 0.01]}
            />
            <primitive object={material} attach="material" />
          </mesh>
        </group>
      );
    case "cookware":
      return (
        <mesh castShadow>
          <cylinderGeometry
            args={[0.2 + (3 - size) * 0.04, 0.16 + (3 - size) * 0.03, 0.22, 8]}
          />
          <primitive object={material} attach="material" />
        </mesh>
      );
    case "jars":
      return (
        <group>
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.12, 0.22, 8]} />
            <primitive object={material} attach="material" />
          </mesh>
          <mesh position={[0, 0.13, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.05, 8]} />
            <meshStandardMaterial color="#5C3A1E" />
          </mesh>
        </group>
      );
    default:
      return (
        <mesh>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <primitive object={material} attach="material" />
        </mesh>
      );
  }
}

function LidGeom({ material }: { material: THREE.Material }) {
  return (
    <group>
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.04, 8]} />
        <primitive object={material} attach="material" />
      </mesh>
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[0.06, 0.06, 0.06]} />
        <primitive object={material} attach="material" />
      </mesh>
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
          activeCharm?.includes("call");

        return (
          <group
            key={item.id}
            position={position}
            rotation={rotation}
            userData={{ itemId: item.id, interact: "item" }}
          >
            {/* Larger invisible hit volume for easier pickup */}
            <mesh visible={false}>
              <boxGeometry args={[0.55, 0.45, 0.55]} />
              <meshBasicMaterial />
            </mesh>
            <DishMesh item={item} highlight={highlight} magic={!!magic} />
          </group>
        );
      })}
    </group>
  );
}
