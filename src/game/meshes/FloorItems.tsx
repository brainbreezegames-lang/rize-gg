"use client";

import { useMemo } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { VoxelItem } from "./VoxelItem";
import { useGameStore } from "../store";
import { SHELVES } from "../constants";
import { sfx } from "../audio";

export function FloorItems() {
  const items = useGameStore((s) => s.items);
  const highlighted = useGameStore((s) => s.highlightedItemId);
  const identifyUntil = useGameStore((s) => s.identifyUntil);
  const tryPickup = useGameStore((s) => s.tryPickup);
  const setHighlighted = useGameStore((s) => s.setHighlighted);
  const playerPos = useGameStore((s) => s.playerPos);

  const identifying = performance.now() / 1000 < identifyUntil;

  const floor = useMemo(
    () => items.filter((i) => !i.collected && !i.placed),
    [items]
  );

  // Auto-highlight nearest
  let nearestId: string | null = null;
  let nearestD = 1.5;
  for (const item of floor) {
    const d = Math.hypot(
      item.position[0] - playerPos[0],
      item.position[2] - playerPos[2]
    );
    if (d < nearestD) {
      nearestD = d;
      nearestId = item.id;
    }
  }

  return (
    <group>
      {floor.map((item) => {
        const isNear = item.id === nearestId || item.id === highlighted;
        const catColor = SHELVES.find((s) => s.id === item.category)?.bannerColor;
        return (
          <group
            key={item.id}
            position={item.position}
            rotation={[0, item.rotation, 0]}
            onClick={(e: ThreeEvent<MouseEvent>) => {
              e.stopPropagation();
              if (tryPickup(item.id)) sfx.pickup();
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHighlighted(item.id);
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              setHighlighted(null);
              document.body.style.cursor = "default";
            }}
          >
            <VoxelItem
              kind={item.kind}
              highlighted={isNear}
              identified={identifying}
              categoryColor={catColor}
            />
          </group>
        );
      })}
    </group>
  );
}
