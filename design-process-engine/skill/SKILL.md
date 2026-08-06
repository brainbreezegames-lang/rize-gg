# Design Process Engine — Companion Skill

You are paired with the **design-process-engine** MCP. It is a senior design lead living in your tool loop. Its tools are the steps of the process. **Follow the pipeline by default on every UI / visual design task.** Skipping steps is a failure mode, not an optimization.

---

## When this skill applies

Any time you are asked to:

- create, edit, or recreate UI / pages / components / landing surfaces
- improve visual design, layout, branding, or polish
- implement a screen from a reference (Figma, screenshot, URL)

If the task is purely backend, data, or non-visual, you may skip this pipeline.

---

## The pipeline (mandatory)

```
start_task → submit_plan → (build one stage) → review → … → done
```

### 1. `start_task` — always first

Call **before** writing design plans or UI code.

Pass:

- `task` — what you are building
- `context` — framework, existing patterns, audience, references
- `mode` — optional: `create` | `edit` | `recreate` (server can classify)
- `brand_rules` — optional product bans / palette / type

Read the returned **mode contract**. Resolve every `mustResolveBeforeDesign` item before planning. Obey `forbidden`.

### 2. `submit_plan` — plan is a contract

Submit:

- `layoutPrinciple` — **one** principle you will hold
- `screens` — ordered sections/screens (include error/empty states when relevant)
- `paletteStrategy`, `density`, `typeDirection`
- `valueVocabulary` — committed tokens/values (min 3)
- `notes` — brand test, out-of-scope, acknowledgements

If the server returns `approved: false`, fix every **blocker** and resubmit.  
**Do not write UI until `approved: true`.**

The approved plan is the contract for the rest of the session.

### 3. Build one stage at a time

Build only the next item in `buildOrder`. Stay inside the vocabulary and layout principle.

### 4. `review` — no stage ends unreviewed

After each stage:

1. Screenshot or visually inspect the result (use your environment’s screenshot tools when available).
2. Honestly fill `defectChecks` for every id (see list below).
3. Call `review` with `stageId`, `summary`, optional `artifactSnippet`, and `defectChecks`.

If `passed: false`, fix blockers and review the **same** stage again. Do not advance.

If `passed: true`, build the next remaining stage.

### 5. Finish

When `remainingStages` is empty, stop building. Deliver. (A fuller `final_check` tool ships in a later phase — still re-read the plan contract yourself before claiming done.)

---

## Defect checklist ids (required on every `review`)

Set each to `true` only if you verified it is clean:

| id | meaning |
|----|---------|
| `clipped_text` | No clipped/overflowing text |
| `overlapping` | No unintentional overlaps |
| `grid_misalignment` | Columns/edges align |
| `same_role_sizes` | Same-role elements share size |
| `escaping_containers` | Nothing bleeds out of containers |
| `spacing_violations` | Spacing matches the plan scale |
| `contrast` | Text is legible |
| `hit_targets` | Controls are usable |
| `missing_states` | Required states exist |
| `one_job` | This section has one job |

Lying on the checklist defeats the product. If you see a defect, mark `false`.

---

## Mode cheatsheet

| Mode | Priority | Golden rule |
|------|----------|-------------|
| **create** | Intentional, distinctive | First viewport must fail the "another brand" test |
| **edit** | Invisibility | Study how the project already does it; unused DS pieces are banned for this change |
| **recreate** | Fidelity | Zero creative deviation without permission |

---

## Hard rules

1. **No UI code before plan approval.**
2. **No stage ends unreviewed.**
3. **Server refusals are correct** — if a tool errors because you skipped a step, go back and do the step.
4. **Do not invent parallel patterns** in edit mode.
5. **Do not "improve" a reference** in recreate mode.
6. **Use `get_session`** if you lose the thread mid-build.
7. Prefer small, honest summaries over vague claims ("looks good").

---

## Tiny tasks

If the user asks for a one-line CSS tweak, you may still call `start_task` with mode `edit` and a one-screen plan — the process stays light when the plan is light. Do not skip the pipeline entirely for visual work.

---

## What this is not

- Not a design-system encyclopedia (that’s Phase 2 pattern guides).
- Not a post-hoc cleanup skill. Process runs **before and during** building.
- Not optional flavor text. The MCP holds state; your job is to walk the tools.
