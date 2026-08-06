"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../store";
import { ROOM_RADIUS } from "../constants";
import { sfx } from "../audio";

const SPEED = 4.2;
const KEYS = new Set<string>();

export function PlayerController() {
  const group = useRef<THREE.Group>(null);
  const vel = useRef(new THREE.Vector3());
  const facing = useRef(Math.PI);
  const stepAcc = useRef(0);
  const setPlayerPos = useGameStore((s) => s.setPlayerPos);
  const pickupNearest = useGameStore((s) => s.pickupNearest);
  const castSpell = useGameStore((s) => s.castSpell);
  const jumpUntil = useGameStore((s) => s.jumpUntil);
  const phase = useGameStore((s) => s.phase);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      KEYS.add(e.key.toLowerCase());
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
      // Inventory number keys via Q/R cycle handled in HUD; also [ ]
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
  }, [pickupNearest, castSpell]);

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
      vel.current.x *= 0.8;
      vel.current.z *= 0.8;
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
    // Keep away from shelf wall a bit
    if (nz < -5.6) nz = -5.6;

    g.position.x = nx;
    g.position.z = nz;
    g.position.y = jumping
      ? Math.sin(((jumpUntil - now) / 0.55) * Math.PI) * 1.1
      : 0;
    g.rotation.y = facing.current;

    setPlayerPos([nx, g.position.y, nz], facing.current);

    // Walk-over pickup (cozy magnet feel, short range)
    if (dx || dz) {
      const invLen = useGameStore.getState().inventory.length;
      if (invLen < 10 && pickupNearest([nx, 0, nz], 0.85)) {
        sfx.pickup();
      }
    }

    // Soft follow camera (isometric)
    const cam = state.camera;
    const target = new THREE.Vector3(nx + 0, 11, nz + 11);
    cam.position.lerp(target, 1 - Math.pow(0.001, dt));
    cam.lookAt(nx, 0.5, nz - 1.5);
  });

  return (
    <group ref={group} position={[0, 0, 3]}>
      {/* Body robe */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[0.55, 0.9, 0.4]} />
        <meshStandardMaterial color="#6b21a8" roughness={0.7} />
      </mesh>
      {/* Hood */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <boxGeometry args={[0.5, 0.4, 0.48]} />
        <meshStandardMaterial color="#581c87" />
      </mesh>
      {/* Face */}
      <mesh position={[0, 1.15, 0.2]}>
        <boxGeometry args={[0.28, 0.22, 0.12]} />
        <meshStandardMaterial color="#e8c4a0" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.07, 1.18, 0.27]}>
        <boxGeometry args={[0.06, 0.06, 0.04]} />
        <meshStandardMaterial color="#1a1020" />
      </mesh>
      <mesh position={[0.07, 1.18, 0.27]}>
        <boxGeometry args={[0.06, 0.06, 0.04]} />
        <meshStandardMaterial color="#1a1020" />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.4, 0.75, 0]} castShadow>
        <boxGeometry args={[0.18, 0.55, 0.18]} />
        <meshStandardMaterial color="#6b21a8" />
      </mesh>
      <mesh position={[0.4, 0.75, 0]} castShadow>
        <boxGeometry args={[0.18, 0.55, 0.18]} />
        <meshStandardMaterial color="#6b21a8" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.15, 0.2, 0]} castShadow>
        <boxGeometry args={[0.18, 0.4, 0.2]} />
        <meshStandardMaterial color="#3b0764" />
      </mesh>
      <mesh position={[0.15, 0.2, 0]} castShadow>
        <boxGeometry args={[0.18, 0.4, 0.2]} />
        <meshStandardMaterial color="#3b0764" />
      </mesh>
    </group>
  );
}
