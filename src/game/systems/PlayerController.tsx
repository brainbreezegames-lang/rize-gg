"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useGameStore } from "../store/gameStore";
import { DishMesh } from "../items/DishMesh";
import { CUPBOARDS, slotWorldPosition } from "../data/cupboards";
import { CHARM_DEFS } from "../data/items";

const MOVE_SPEED = 4.2;
const LOOK_SENS = 0.0022;
const REACH = 2.8;
const PLAYER_HEIGHT = 1.55;
const PLAYER_RADIUS = 0.35;

const bounds = {
  minX: -8.2,
  maxX: 8.2,
  minZ: -5.2,
  maxZ: 6.2,
};

/** Thin AABB shells — block walking *into* cabinets, keep front aisle free */
const OBSTACLES: { minX: number; maxX: number; minZ: number; maxZ: number }[] = [
  // Back-wall cupboards (face +Z): block only the cabinet body
  { minX: -3.5, maxX: -0.9, minZ: -4.65, maxZ: -3.95 }, // plates
  { minX: 1.3, maxX: 3.7, minZ: -4.65, maxZ: -3.95 }, // bowls
  // Cookware (faces -Z / south)
  { minX: -3.7, maxX: -0.3, minZ: 4.5, maxZ: 5.5 },
  // Cups (faces -X)
  { minX: 4.7, maxX: 5.7, minZ: -2.5, maxZ: -0.5 },
  // Cutlery (faces +X)
  { minX: -5.9, maxX: -4.5, minZ: 0.6, maxZ: 2.4 },
  // Jars
  { minX: 6.0, maxX: 7.4, minZ: -4.4, maxZ: -2.6 },
  // Feast table / props
  { minX: -3.6, maxX: 3.6, minZ: 0.85, maxZ: 2.15 },
  { minX: -7.1, maxX: -5.9, minZ: -3.85, maxZ: -3.15 },
  { minX: 7.0, maxX: 8.1, minZ: -3.3, maxZ: -0.7 },
];

function collides(x: number, z: number): boolean {
  for (const o of OBSTACLES) {
    if (x > o.minX && x < o.maxX && z > o.minZ && z < o.maxZ) return true;
  }
  return false;
}

export function PlayerController() {
  const { camera, gl, scene } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const euler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));
  const velocity = useRef(new THREE.Vector3());
  const raycaster = useRef(new THREE.Raycaster());
  const lookTarget = useRef(new THREE.Vector3());
  const handRef = useRef<THREE.Group>(null);
  const phase = useGameStore((s) => s.phase);
  const pointerLocked = useGameStore((s) => s.pointerLocked);
  const setPointerLocked = useGameStore((s) => s.setPointerLocked);
  const held = useGameStore((s) => s.getHeldItem());
  const selectedSlot = useGameStore((s) => s.selectedSlot);

  // Init camera — face the plate cupboard / floor mess
  useEffect(() => {
    camera.position.set(0.2, PLAYER_HEIGHT, 2.8);
    euler.current.set(-0.15, 0.15, 0);
    camera.quaternion.setFromEuler(euler.current);
  }, [camera]);

  // Pointer lock + input
  useEffect(() => {
    const canvas = gl.domElement;

    const onKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      const store = useGameStore.getState();
      if (store.phase === "title") return;

      if (e.code === "Escape") {
        if (store.phase === "playing") store.pause();
        else if (store.phase === "paused") store.resume();
        return;
      }

      if (store.phase !== "playing") return;

      // Hotbar 1-6
      if (e.code.startsWith("Digit")) {
        const n = parseInt(e.code.replace("Digit", ""), 10);
        if (n >= 1 && n <= 6) store.selectSlot(n - 1);
      }

      if (e.code === "KeyR") store.rotateSelected();
      if (e.code === "KeyF" || e.code === "KeyE") {
        // Keyboard place — same as RMB (friendlier than right-click)
        tryInteract("place");
      }
      if (e.code === "Home" || e.code === "KeyH") {
        camera.position.set(0.2, PLAYER_HEIGHT, 2.8);
        euler.current.set(-0.15, 0.15, 0);
        store.setMessage("Returned to the hearth.");
      }
      if (e.code === "KeyQ") {
        const heldId = store.inventory[store.selectedSlot];
        if (heldId) {
          const dropPos: [number, number, number] = [
            camera.position.x + Math.sin(euler.current.y) * -0.8,
            0.12,
            camera.position.z + Math.cos(euler.current.y) * -0.8,
          ];
          useGameStore.setState({
            items: store.items.map((i) =>
              i.id === heldId
                ? {
                    ...i,
                    inventorySlot: null,
                    placedSlotId: null,
                    position: dropPos,
                  }
                : i
            ),
            inventory: store.inventory.map((id, idx) =>
              idx === store.selectedSlot ? null : id
            ),
            message: "Dropped.",
          });
        }
      }

      // Charm hotkeys F1-F4 / keys Z X C V
      if (e.code === "KeyZ" && store.unlockedCharms[0])
        store.useCharm(store.unlockedCharms[0]);
      if (e.code === "KeyX" && store.unlockedCharms[1])
        store.useCharm(store.unlockedCharms[1]);
      if (e.code === "KeyC" && store.unlockedCharms[2])
        store.useCharm(store.unlockedCharms[2]);
      if (e.code === "KeyV" && store.unlockedCharms[3])
        store.useCharm(store.unlockedCharms[3]);

      // Number row charm use with Shift
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    const onMouseDown = (e: MouseEvent) => {
      const store = useGameStore.getState();
      if (store.phase === "title") return;
      if (document.pointerLockElement !== canvas) {
        canvas.requestPointerLock();
        return;
      }
      if (store.phase !== "playing") return;

      if (e.button === 0) {
        // Left click — pick up
        tryInteract("pickup");
      } else if (e.button === 2) {
        // Right click — place
        tryInteract("place");
      }
    };

    const onContextMenu = (e: Event) => e.preventDefault();

    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement !== canvas) return;
      if (useGameStore.getState().phase !== "playing") return;
      euler.current.y -= e.movementX * LOOK_SENS;
      euler.current.x -= e.movementY * LOOK_SENS;
      euler.current.x = Math.max(
        -Math.PI / 2.2,
        Math.min(Math.PI / 2.2, euler.current.x)
      );
    };

    const onLockChange = () => {
      setPointerLocked(document.pointerLockElement === canvas);
    };

    const tryInteract = (mode: "pickup" | "place") => {
      const store = useGameStore.getState();
      raycaster.current.setFromCamera(new THREE.Vector2(0, 0), camera);
      raycaster.current.far = REACH + 1.2;
      // Collect interactables from scene
      const targets: THREE.Object3D[] = [];
      scene.traverse((obj) => {
        if (obj.userData?.interact || obj.userData?.itemId || obj.userData?.charmId)
          targets.push(obj);
      });
      const hits = raycaster.current.intersectObjects(targets, true);

      if (mode === "pickup") {
        for (const hit of hits) {
          let o: THREE.Object3D | null = hit.object;
          while (o) {
            if (o.userData?.itemId && hit.distance <= REACH + 0.6) {
              store.pickUpItem(o.userData.itemId);
              return;
            }
            if (o.userData?.charmId && hit.distance <= REACH + 0.6) {
              store.unlockCharm(o.userData.charmId);
              return;
            }
            if (o.userData?.interact === "cat" && hit.distance <= REACH + 0.6) {
              store.petCat();
              return;
            }
            o = o.parent;
          }
        }

        // Fallback: nearest loose item in look cone (friendlier targeting)
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(
          camera.quaternion
        );
        let bestId: string | null = null;
        let bestScore = Infinity;
        for (const item of store.items) {
          if (item.placedSlotId || item.inventorySlot !== null || item.hidden)
            continue;
          if (item.kind !== "dish" && item.kind !== "lid") continue;
          const pos = new THREE.Vector3(...item.position);
          const to = pos.clone().sub(camera.position);
          const dist = to.length();
          if (dist > REACH + 0.8) continue;
          to.normalize();
          const align = forward.dot(to);
          if (align < 0.55) continue;
          const score = dist + (1 - align) * 2;
          if (score < bestScore) {
            bestScore = score;
            bestId = item.id;
          }
        }
        if (bestId) {
          store.pickUpItem(bestId);
          return;
        }

        // Charms by proximity
        for (const charm of CHARM_DEFS) {
          if (store.unlockedCharms.includes(charm.id)) continue;
          const dist = camera.position.distanceTo(
            new THREE.Vector3(...charm.position)
          );
          if (dist < 2.2) {
            store.unlockCharm(charm.id);
            return;
          }
        }
        store.setMessage("Nothing in reach — walk closer and look at a dish.");
        return;
      }

      // Place into nearest valid slot in look direction
      const held = store.getHeldItem();
      if (!held) {
        store.setMessage("Pick up a dish first (LMB).");
        return;
      }

      lookTarget.current
        .set(0, 0, -1)
        .applyQuaternion(camera.quaternion)
        .normalize();

      let bestSlot: string | null = null;
      let bestScore = Infinity;

      for (const slot of store.slots) {
        if (store.items.some((i) => i.placedSlotId === slot.id)) continue;
        // Only consider same-category cupboards (or chaos mode anything)
        if (!store.chaosMode && slot.category !== held.category) continue;

        const cupboard = CUPBOARDS.find((c) => c.id === slot.cupboardId);
        if (!cupboard) continue;
        const wp = slotWorldPosition(cupboard, slot);
        const slotPos = new THREE.Vector3(wp[0], wp[1], wp[2]);
        const dist = camera.position.distanceTo(slotPos);
        if (dist > REACH + 2.2) continue;

        const toSlot = slotPos.clone().sub(camera.position).normalize();
        const align = lookTarget.current.dot(toSlot);
        if (align < 0.15) continue;

        const exact =
          held.setId === slot.setId &&
          held.size === slot.size &&
          !!held.isLid === !!slot.isLidSlot;
        const sameSet =
          held.setId === slot.setId && !!held.isLid === !!slot.isLidSlot;

        // Heavily prefer the correct slot so RMB "just works" when facing the cupboard
        const matchBonus = exact ? -8 : sameSet ? -3 : 0;
        const score = dist * 0.6 + (1 - align) * 3 + matchBonus;
        if (score < bestScore) {
          bestScore = score;
          bestSlot = slot.id;
        }
      }

      // Last resort: snap to exact matching free slot if player is near that cupboard
      if (!bestSlot) {
        const exact = store.slots.find((s) => {
          if (store.items.some((i) => i.placedSlotId === s.id)) return false;
          if (s.category !== held.category) return false;
          if (s.setId !== held.setId || s.size !== held.size) return false;
          if (!!s.isLidSlot !== !!held.isLid) return false;
          const cupboard = CUPBOARDS.find((c) => c.id === s.cupboardId);
          if (!cupboard) return false;
          return (
            camera.position.distanceTo(
              new THREE.Vector3(...cupboard.position)
            ) < 5.5
          );
        });
        if (exact) bestSlot = exact.id;
      }

      if (bestSlot) {
        store.placeIntoSlot(bestSlot);
        setTimeout(() => store.clearFeedback(), 700);
      } else {
        store.setMessage(
          `Walk closer to the ${held.category.toUpperCase()} cupboard and look at a shelf.`
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("pointerlockchange", onLockChange);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("pointerlockchange", onLockChange);
    };
  }, [camera, gl, scene, setPointerLocked]);

  useFrame((_, dt) => {
    const store = useGameStore.getState();
    store.tick(dt);

    if (store.phase !== "playing") return;

    camera.quaternion.setFromEuler(euler.current);

    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    const wish = new THREE.Vector3();
    if (keys.current["KeyW"]) wish.add(forward);
    if (keys.current["KeyS"]) wish.sub(forward);
    if (keys.current["KeyD"]) wish.add(right);
    if (keys.current["KeyA"]) wish.sub(right);
    if (wish.lengthSq() > 0) wish.normalize().multiplyScalar(MOVE_SPEED);

    velocity.current.lerp(wish, 1 - Math.pow(0.001, dt));
    const nextX = camera.position.x + velocity.current.x * dt;
    const nextZ = camera.position.z + velocity.current.z * dt;
    const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, nextX));
    const clampedZ = Math.max(bounds.minZ, Math.min(bounds.maxZ, nextZ));
    // Slide along obstacles on each axis
    if (!collides(clampedX, camera.position.z)) {
      camera.position.x = clampedX;
    } else {
      velocity.current.x = 0;
    }
    if (!collides(camera.position.x, clampedZ)) {
      camera.position.z = clampedZ;
    } else {
      velocity.current.z = 0;
    }
    // Soft unstick if somehow inside
    if (collides(camera.position.x, camera.position.z)) {
      camera.position.x = 0.2;
      camera.position.z = 2.8;
    }
    camera.position.y = PLAYER_HEIGHT;

    // Hand follows camera
    if (handRef.current) {
      const handPos = new THREE.Vector3(0.35, -0.28, -0.55);
      handPos.applyQuaternion(camera.quaternion);
      handRef.current.position.copy(camera.position).add(handPos);
      handRef.current.quaternion.copy(camera.quaternion);
      // bob
      const t = performance.now() / 1000;
      const moving = wish.lengthSq() > 0.01;
      handRef.current.position.y += moving ? Math.sin(t * 10) * 0.02 : Math.sin(t * 2) * 0.008;
    }
  });

  const currentHeld = useGameStore((s) => {
    const id = s.inventory[s.selectedSlot];
    return id ? s.items.find((i) => i.id === id) ?? null : null;
  });

  return (
    <group ref={handRef}>
      {/* Voxel arm / sleeve */}
      <mesh position={[0.05, -0.05, 0.1]} castShadow>
        <boxGeometry args={[0.18, 0.18, 0.35]} />
        <meshStandardMaterial color="#3A1A5C" roughness={0.7} />
      </mesh>
      <mesh position={[0.05, -0.05, -0.05]}>
        <boxGeometry args={[0.16, 0.12, 0.12]} />
        <meshStandardMaterial color="#C9A227" metalness={0.4} roughness={0.4} />
      </mesh>
      {/* Hand */}
      <mesh position={[0.05, -0.08, -0.18]} castShadow>
        <boxGeometry args={[0.14, 0.14, 0.14]} />
        <meshStandardMaterial color="#C4A574" roughness={0.8} />
      </mesh>
      {/* Fingers */}
      {[-0.04, 0.02, 0.08].map((x, i) => (
        <mesh key={i} position={[x, -0.08, -0.28]}>
          <boxGeometry args={[0.04, 0.04, 0.1]} />
          <meshStandardMaterial color="#C4A574" />
        </mesh>
      ))}
      {/* Held dish — keep modest so it doesn't fill the view */}
      {currentHeld && (
        <group position={[0.02, -0.05, -0.42]} scale={0.55}>
          <DishMesh item={currentHeld} highlight />
        </group>
      )}
    </group>
  );
}

export function CharmPickups() {
  const unlocked = useGameStore((s) => s.unlockedCharms);
  const items = useGameStore((s) => s.items);

  return (
    <group>
      {CHARM_DEFS.map((charm) => {
        if (unlocked.includes(charm.id)) return null;
        // Hide truly hidden until nearby items cleared? Show with slight glow if not hidden, else very dim
        return (
          <CharmMesh
            key={charm.id}
            id={charm.id}
            position={charm.position}
            hidden={charm.hidden}
            icon={charm.icon}
          />
        );
      })}
    </group>
  );
}

function CharmMesh({
  id,
  position,
  hidden,
  icon,
}: {
  id: string;
  position: [number, number, number];
  hidden: boolean;
  icon: string;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 2) * 0.08;
    ref.current.rotation.y = clock.elapsedTime;
  });

  const color =
    icon === "glimmer"
      ? "#FFE566"
      : icon === "call"
        ? "#B44AFF"
        : icon === "snap"
          ? "#FFAA44"
          : "#44FF88";

  return (
    <group
      ref={ref}
      position={position}
      userData={{ charmId: id, interact: "charm" }}
    >
      <mesh>
        <boxGeometry args={[0.18, 0.18, 0.18]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hidden ? 0.4 : 1.5}
          transparent
          opacity={hidden ? 0.35 : 0.95}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        color={color}
        intensity={hidden ? 0.3 : 1}
        distance={2}
      />
    </group>
  );
}
