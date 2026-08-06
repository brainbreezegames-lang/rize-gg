# Cupboard Tidy Up: The Witch's Feast

A first-person cozy sorting game — the depth of *Librarian Tidy Up* applied to a witch's kitchen.

## Play

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or `/game`).

Design-system showcase: `/design-system`.

## How to play

1. **Pick up** dishes (LMB) — each has a **set** (pattern/color) and a **size**.
2. Walk to the matching cupboard (`PLATES`, `BOWLS`, `CUPS`, `CUTLERY`, `COOKWARE`, `JARS`).
3. **Place** (RMB) into the ghost slot. Gold = correct. Red = wrong set. Yellow = right set, wrong size.
4. Find glowing **Hearth Charms** to unlock spells (Z/X/C/V).
5. Complete a full set → a guest seat appears on the feast table.
6. Fill every seat before midnight.

### Controls

| Input | Action |
|-------|--------|
| WASD | Move |
| Mouse | Look |
| LMB | Pick up |
| RMB | Place |
| R | Rotate |
| 1–6 | Hotbar |
| Z/X/C/V | Charms |
| M | Kitchen map |
| Q | Drop |
| ESC | Pause |

## Content

- 12 dish sets (~135 pieces including lids)
- 6 cupboards / 101 slots
- 8 Hearth Charms
- 12 feast guests
- Achievements: Old-Fashioned Housekeeping, Cat's Revenge, Lightning Feast, Charm Collector, Full Coven, and more

## Stack

Next.js · React Three Fiber · Three.js · Zustand · Oxanium
