"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../store";
import { ROOM_RADIUS } from "../constants";
import { sfx } from "../audio";

const SPEED = 4.6;
const KEYS = new Set<string>();

export function PlayerController() {
  const group = useRef<THREE.Group>(null);
  const vel = useRef(new THREE.Vector3());
  const facing = useRef(Math.PI);
  const stepAcc = useRef(0);
  const setPlayerPos = useGameStore((s) => s.setPlayerPos);
  const setMoveTarget = useGameStore((s) => s.setMoveTarget);
  const pickupNearest = useGameStore((s) => s.pickupNearest);
  const castSpell = useGameStore((s) => s.castSpell);
  const jumpUntil = useGameStore((s) => s.jumpUntil);
  const phase = useGameStore((s) => s.phase);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Ignore when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      KEYS.add(e.key.toLowerCase());
      // Keyboard cancels click-move
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(e.key.toLowerCase())) {
        setMoveTarget(null);
      }
      if (e.key === " " || e.key.toLowerCase() === "e") {
        e.preventDefault();
        const pos = useGameStore.getState().playerPos;
        if (pickupNearest(pos, 1.6)) sfx.pickup();
      }
      if (e.key === "1") castSpell("jump") && sfx.spell();
      if (e.key === "2") castSpell("identify") && sfx.spell();
      if (e.key === "3") castSpell("magnet") && sfx.spell();
      if (e.key === "4") castSpell("servant") && sfx.spell();
      if (e.key === "5") castSpell("scry") && sfx.spell();
      if (e.key === "[") {
        const s = useGameStore.getState();
        s.selectInventory(Math.max(0, s.selectedInv - 1));
      }
      if (e.key === "]") {
        const s = useGameStore.getState();
        s.selectInventory(Math.min(9, s.selectedInv + 1));
      }
    };
    const up = (e: KeyboardEvent) => KEYS.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [pickupNearest, castSpell, setMoveTarget]);

  useFrame((state, dt) => {
    if (!group.current || phase !== "playing") return;
    const now = performance.now() / 1000;
    const jumping = now < jumpUntil;

    let dx = 0;
    let dz = 0;
    if (KEYS.has("w") || KEYS.has("arrowup")) dz -= 1;
    if (KEYS.has("s") || KEYS.has("arrowdown")) dz += 1;
    if (KEYS.has("a") || KEYS.has("arrowleft")) dx -= 1;
    if (KEYS.has("d") || KEYS.has("arrowright")) dx += 1;

    const target = useGameStore.getState().moveTarget;
    if (!dx && !dz && target) {
      const g = group.current;
      const tdx = target[0] - g.position.x;
      const tdz = target[1] - g.position.z;
      const dist = Math.hypot(tdx, tdz);
      if (dist < 0.25) {
        setMoveTarget(null);
      } else {
        dx = tdx / dist;
        dz = tdz / dist;
      }
    }

    if (dx || dz) {
      const len = Math.hypot(dx, dz) || 1;
      dx /= len;
      dz /= len;
      facing.current = Math.atan2(dx, dz);
      const spd = SPEED * (jumping ? 1.85 : 1);
      vel.current.x = dx * spd;
      vel.current.z = dz * spd;
      stepAcc.current += dt;
      if (stepAcc.current > 0.32) {
        stepAcc.current = 0;
        sfx.step();
      }
    } else {
      vel.current.x *= 0.75;
      vel.current.z *= 0.75;
    }

    const g = group.current;
    let nx = g.position.x + vel.current.x * dt;
    let nz = g.position.z + vel.current.z * dt;
    const r = Math.hypot(nx, nz);
    const maxR = ROOM_RADIUS - 1.4;
    if (r > maxR) {
      nx = (nx / r) * maxR;
      nz = (nz / r) * maxR;
    }
    if (nz < -5.6) nz = -5.6;

    g.position.x = nx;
    g.position.z = nz;
    g.position.y = jumping
      ? Math.sin(((jumpUntil - now) / 0.55) * Math.PI) * 1.1
      : 0;
    g.rotation.y = facing.current;

    setPlayerPos([nx, g.position.y, nz], facing.current);

    if (dx || dz) {
      const invLen = useGameStore.getState().inventory.length;
      if (invLen < 10 && pickupNearest([nx, 0, nz], 0.9)) {
        sfx.pickup();
      }
    }

    // Soft follow camera (isometric three-quarter)
    const cam = state.camera;
    const targetCam = new THREE.Vector3(nx + 2.5, 12, nz + 12.5);
    cam.position.lerp(targetCam, 1 - Math.pow(0.002, dt));
    cam.lookAt(nx, 0.8, nz - 2);
  });

  return (
    <group ref={group} position={[0, 0, 3]}>
      {/* Shadow disc */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.4, 16]} />
        <meshBasicMaterial color="#000" transparent opacity={0.35} />
      </mesh>
      {/* Body robe */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[0.58, 0.95, 0.42]} />
        <meshStandardMaterial color="#7c3aed" roughness={0.65} />
      </mesh>
      {/* Cape */}
      <mesh position={[0, 0.75, -0.28]} castShadow>
        <boxGeometry args={[0.5, 0.85, 0.1]} />
        <meshStandardMaterial color="#4c1d95" roughness={0.8} />
      </mesh>
      {/* Hood */}
      <mesh position={[0, 1.28, -0.02]} castShadow>
        <boxGeometry args={[0.52, 0.42, 0.5]} />
        <meshStandardMaterial color="#5b21b6" />
      </mesh>
      {/* Face */}
      <mesh position={[0, 1.18, 0.22]}>
        <boxGeometry args={[0.3, 0.24, 0.14]} />
        <meshStandardMaterial color="#f0c9a0" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.08, 1.2, 0.3]}>
        <boxGeometry args={[0.07, 0.07, 0.04]} />
        <meshStandardMaterial color="#1a1020" />
      </mesh>
      <mesh position={[0.08, 1.2, 0.3]}>
        <boxGeometry args={[0.07, 0.07, 0.04]} />
        <meshStandardMaterial color="#1a1020" />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.42, 0.72, 0]} castShadow>
        <boxGeometry args={[0.2, 0.58, 0.2]} />
        <meshStandardMaterial color="#7c3aed" />
      </mesh>
      <mesh position={[0.42, 0.72, 0]} castShadow>
        <boxGeometry args={[0.2, 0.58, 0.2]} />
        <meshStandardMaterial color="#7c3aed" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.16, 0.18, 0]} castShadow>
        <boxGeometry args={[0.2, 0.4, 0.22]} />
        <meshStandardMaterial color="#3b0764" />
      </mesh>
      <mesh position={[0.16, 0.18, 0]} castShadow>
        <boxGeometry args={[0.2, 0.4, 0.22]} />
        <meshStandardMaterial color="#3b0764" />
      </mesh>
    </group>
  );
}
