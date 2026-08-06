/**
 * Procedural voxel textures — nearest-neighbor pixel look.
 */

import * as THREE from "three";

const texCache = new Map<string, THREE.CanvasTexture>();

export function pixelTexture(
  colors: string[],
  size = 16,
  key?: string
): THREE.CanvasTexture {
  const cacheKey = key ?? `${colors.join("|")}_${size}`;
  const cached = texCache.get(cacheKey);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // base
  ctx.fillStyle = colors[0];
  ctx.fillRect(0, 0, size, size);

  // noise grit
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (Math.random() > 0.72) {
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  // edge darken
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.fillRect(0, 0, size, 1);
  ctx.fillRect(0, size - 1, size, 1);
  ctx.fillRect(0, 0, 1, size);
  ctx.fillRect(size - 1, 0, 1, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  texCache.set(cacheKey, tex);
  return tex;
}

export function woodMaterial(variant = 0): THREE.MeshStandardMaterial {
  const palettes = [
    ["#5C3A1E", "#6B4423", "#4A2F15", "#7A5230", "#3D2410"],
    ["#4A3020", "#5A3A28", "#3A2418", "#6A4A30", "#2E1C12"],
    ["#6B4A2A", "#7A5838", "#5A3A20", "#8B6840", "#4A2E18"],
  ];
  const tex = pixelTexture(palettes[variant % 3], 16, `wood_${variant}`);
  tex.repeat.set(2, 2);
  return new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.85,
    metalness: 0.05,
  });
}

export function stoneMaterial(): THREE.MeshStandardMaterial {
  const tex = pixelTexture(
    ["#4A4E52", "#3A3E42", "#5A5E62", "#2E3236", "#6A6E72"],
    16,
    "stone"
  );
  tex.repeat.set(4, 2);
  return new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.95,
    metalness: 0.02,
  });
}

export function floorMaterial(): THREE.MeshStandardMaterial {
  const tex = pixelTexture(
    ["#3D2A1A", "#4A3220", "#2E1E12", "#5A3E28", "#352418"],
    16,
    "floor"
  );
  tex.repeat.set(8, 8);
  return new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.9,
    metalness: 0.0,
  });
}

export function dishMaterial(
  primary: string,
  accent: string,
  rim: string,
  material: string
): THREE.MeshStandardMaterial {
  const tex = pixelTexture(
    [primary, accent, rim, primary, accent],
    8,
    `dish_${primary}_${accent}`
  );
  const metalness =
    material === "copper" || material === "iron" || material === "silver"
      ? 0.65
      : material === "glass"
        ? 0.3
        : 0.08;
  const roughness =
    material === "glass" ? 0.25 : material === "wood" ? 0.9 : 0.45;
  return new THREE.MeshStandardMaterial({
    map: tex,
    color: primary,
    roughness,
    metalness,
    transparent: material === "glass",
    opacity: material === "glass" ? 0.85 : 1,
  });
}

export const PALETTE = {
  candle: "#FFAA55",
  moon: "#A8C8E8",
  gold: "#FFD700",
  goldGlow: "#FFE566",
  redReject: "#FF5252",
  yellowNudge: "#FBBD23",
  purpleMagic: "#B44AFF",
  parchment: "#E8D5B0",
  ink: "#2A1A0A",
  accent: "#6B3FA0",
};
