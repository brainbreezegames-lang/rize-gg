"use client";

import * as THREE from "three";
import { useMemo } from "react";

/** Shared voxel palette — gritty witch kitchen */
export const PALETTE = {
  stoneDark: "#1a1e24",
  stone: "#2a3038",
  stoneMid: "#3a424c",
  stoneLight: "#4a5560",
  woodDark: "#2c1810",
  wood: "#4a2e1a",
  woodLight: "#6b4226",
  woodPale: "#8b5a2b",
  iron: "#3d4450",
  ironDark: "#1e2228",
  ceramic: "#d4c4a8",
  ceramicDirty: "#9a8a6e",
  glass: "#a8d4e8",
  candle: "#f5e6c8",
  flame: "#ffaa33",
  flameCore: "#ffe6a0",
  moon: "#e8e0ff",
  sky: "#1a0a2e",
  purpleRug: "#4a2060",
  gold: "#d4a017",
  book: "#5a2080",
  herb: "#4a7a40",
  mist: "#c8b8ff",
} as const;

export type Voxel = {
  x: number;
  y: number;
  z: number;
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
};

/** Build a BufferGeometry from voxel cubes (merged) for performance */
export function voxelsToGeometry(voxels: Voxel[], size = 0.12): THREE.BufferGeometry {
  const geo = new THREE.BoxGeometry(size, size, size);
  const positions: number[] = [];
  const normals: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const color = new THREE.Color();
  const posAttr = geo.getAttribute("position");
  const normAttr = geo.getAttribute("normal");
  const idx = geo.getIndex();

  voxels.forEach((v) => {
    const base = positions.length / 3;
    color.set(v.color);
    // Slight grit variation
    color.offsetHSL(0, 0, (Math.sin(v.x * 12.3 + v.z * 7.1) * 0.04));

    for (let i = 0; i < posAttr.count; i++) {
      positions.push(
        posAttr.getX(i) + v.x * size,
        posAttr.getY(i) + v.y * size,
        posAttr.getZ(i) + v.z * size
      );
      normals.push(normAttr.getX(i), normAttr.getY(i), normAttr.getZ(i));
      colors.push(color.r, color.g, color.b);
    }
    if (idx) {
      for (let i = 0; i < idx.count; i++) {
        indices.push(idx.getX(i) + base);
      }
    }
  });

  const merged = new THREE.BufferGeometry();
  merged.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  merged.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  merged.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  merged.setIndex(indices);
  merged.computeBoundingSphere();
  return merged;
}

export function VoxelMesh({
  voxels,
  size = 0.12,
  castShadow = true,
  receiveShadow = true,
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
  onClick,
  onPointerOver,
  onPointerOut,
}: {
  voxels: Voxel[];
  size?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
  position?: [number, number, number];
  rotation?: [number, number, number];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (e: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPointerOver?: (e: any) => void;
  onPointerOut?: () => void;
}) {
  const geometry = useMemo(() => voxelsToGeometry(voxels, size), [voxels, size]);
  return (
    <mesh
      geometry={geometry}
      position={position}
      rotation={rotation}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <meshStandardMaterial vertexColors flatShading roughness={0.85} metalness={0.05} />
    </mesh>
  );
}

/** Helper to fill a box region with voxels */
export function boxVoxels(
  x0: number,
  y0: number,
  z0: number,
  w: number,
  h: number,
  d: number,
  color: string,
  predicate?: (x: number, y: number, z: number) => boolean
): Voxel[] {
  const out: Voxel[] = [];
  for (let x = x0; x < x0 + w; x++) {
    for (let y = y0; y < y0 + h; y++) {
      for (let z = z0; z < z0 + d; z++) {
        if (predicate && !predicate(x, y, z)) continue;
        out.push({ x, y, z, color });
      }
    }
  }
  return out;
}

export function dishVoxels(
  shape: string,
  material: string,
  grimeColor: string,
  dirty: boolean
): Voxel[] {
  const matColor =
    material === "wood"
      ? PALETTE.wood
      : material === "iron"
        ? PALETTE.iron
        : material === "glass"
          ? "#7ec8e8"
          : material === "stone"
            ? PALETTE.stoneLight
            : "#e8dcc0";

  const base = dirty ? mixHex(matColor, grimeColor, 0.25) : matColor;
  const v: Voxel[] = [];
  const add = (x: number, y: number, z: number, c = base) => v.push({ x, y, z, color: c });

  switch (shape) {
    case "plate":
      for (let x = -3; x <= 3; x++) {
        for (let z = -3; z <= 3; z++) {
          const r2 = x * x + z * z;
          if (r2 <= 10) add(x, 0, z);
          if (r2 <= 8 && r2 >= 6) add(x, 1, z); // raised rim
          if (dirty && r2 <= 5 && (x + z) % 2 === 0) add(x, 1, z, grimeColor);
        }
      }
      break;
    case "bowl":
      for (let x = -3; x <= 3; x++) {
        for (let z = -3; z <= 3; z++) {
          const r2 = x * x + z * z;
          if (r2 <= 4) add(x, 0, z);
          if (r2 <= 10 && r2 >= 5) {
            add(x, 0, z);
            add(x, 1, z);
            add(x, 2, z);
            add(x, 3, z);
          }
          if (dirty && r2 <= 4) add(x, 1, z, grimeColor);
        }
      }
      break;
    case "goblet":
      for (let x = -1; x <= 1; x++) {
        for (let z = -1; z <= 1; z++) {
          if (Math.abs(x) + Math.abs(z) <= 1) {
            add(x, 0, z);
            add(x, 1, z);
          }
        }
      }
      add(0, 2, 0);
      add(0, 3, 0);
      for (let x = -2; x <= 2; x++) {
        for (let z = -2; z <= 2; z++) {
          const r2 = x * x + z * z;
          if (r2 <= 5 && r2 >= 2) {
            add(x, 4, z);
            add(x, 5, z);
          }
          if (r2 <= 2) add(x, 4, z);
          if (dirty && r2 <= 2) add(x, 5, z, grimeColor);
        }
      }
      break;
    case "cauldron":
      for (let x = -3; x <= 3; x++) {
        for (let z = -3; z <= 3; z++) {
          const r2 = x * x + z * z;
          if (r2 <= 10) {
            for (let y = 0; y <= 4; y++) {
              const edge = r2 >= 6;
              if (edge || y === 0) add(x, y, z, PALETTE.ironDark);
            }
          }
          if (dirty && r2 <= 5) add(x, 4, z, grimeColor);
        }
      }
      // feet
      add(-2, -1, -2, PALETTE.iron);
      add(2, -1, -2, PALETTE.iron);
      add(-2, -1, 2, PALETTE.iron);
      add(2, -1, 2, PALETTE.iron);
      break;
    case "cup":
      for (let x = -2; x <= 2; x++) {
        for (let z = -2; z <= 2; z++) {
          const edge = Math.abs(x) === 2 || Math.abs(z) === 2;
          if (edge) {
            add(x, 0, z);
            add(x, 1, z);
            add(x, 2, z);
            add(x, 3, z);
          } else if (Math.abs(x) < 2 && Math.abs(z) < 2) {
            add(x, 0, z);
            if (dirty) add(x, 1, z, grimeColor);
          }
        }
      }
      add(3, 1, 0);
      add(3, 2, 0);
      add(2, 2, 0);
      break;
    default: // spoon
      for (let z = 0; z <= 5; z++) add(0, 0, z, base);
      add(0, 0, 6);
      for (let x = -1; x <= 1; x++) {
        for (let z = 6; z <= 8; z++) add(x, 0, z);
      }
      if (dirty) {
        add(0, 1, 7, grimeColor);
        add(0, 1, 6, grimeColor);
        add(-1, 1, 7, grimeColor);
      }
      break;
  }
  return v;
}

function mixHex(a: string, b: string, t: number): string {
  const ca = new THREE.Color(a);
  const cb = new THREE.Color(b);
  ca.lerp(cb, t);
  return `#${ca.getHexString()}`;
}
