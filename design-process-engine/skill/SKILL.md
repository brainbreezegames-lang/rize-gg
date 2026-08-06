# Design Process Engine — Companion Skill

You are paired with the **design-process-engine** MCP — a senior design lead in your tool loop. **Follow the full pipeline on every UI / visual design task.** Skipping steps is a failure mode.

---

## Pipeline (mandatory)

```
start_task
  → get_playbook
  → submit_plan          # wait for approved: true
  → build one stage
      ↳ get_pattern_guide when you hit a concrete pattern
      ↳ review           # no stage ends unreviewed
  → … next stage …
  → final_check          # before you claim done
```

---

## When this applies

Creating, editing, or recreating UI / pages / components / landing surfaces / visual polish / Figma-to-code.  
Skip only for pure backend / non-visual work.

---

## Tool cheat sheet

### 1. `start_task` — always first
Pass `task`, `context`, optional `mode` (`create`|`edit`|`recreate`), optional `brand_rules`, optional `api_key` (`dpe_pro_…` for Pro).

Resolve every `mustResolveBeforeDesign` item. Obey `forbidden`.

### 2. `get_playbook` — before planning
Load flow intelligence (structure, strategies with prevalence, forgotten states, never-do).  
Use `suggestedPlaybook.id` from start_task, or `list: true`.  
Free tier: starter playbooks. Pro: full library.

### 3. `submit_plan` — plan is a contract
Submit `layoutPrinciple` (ONE), `screens`, `paletteStrategy`, `density`, `typeDirection`, `valueVocabulary` (≥3), `notes`.  
If `approved: false`, fix blockers and resubmit. **No UI code until approved.**

### 4. `get_pattern_guide` — at the moment of need
When you hit nav, forms, paywall, empty state, pricing table, settings, etc. — pull that guide. Implement `requiredStates`. Avoid `mistakes[]`.

### 5. `review` — after every stage
Screenshot / visually inspect. Fill every `defectChecks` id honestly.  
`passed: false` → fix → review same `stageId`. Do not advance.

### 6. `final_check` — whole deliverable
When `remainingStages` is empty, call with `deliverable_text` (copy + snippets).  
Optional `finish_command`: `distill` | `quieter` | `bolder`.  
Do not claim done until `passed: true`.

### Helpers
- `get_session` — re-align mid-build  
- `register_brand_rules` — merge bans/palette  
- `list_knowledge` — see playbooks/patterns for your tier  

---

## Defect checklist ids (every `review`)

`clipped_text` · `overlapping` · `grid_misalignment` · `same_role_sizes` · `escaping_containers` · `spacing_violations` · `contrast` · `hit_targets` · `missing_states` · `one_job`

Mark `false` if you still see the defect. Lying defeats the product.

---

## Modes

| Mode | Priority |
|------|----------|
| **create** | Distinctive — first viewport fails the "another brand" test |
| **edit** | Invisible — match existing system; unused DS pieces banned |
| **recreate** | Fidelity — zero creative deviation without permission |

---

## Hard rules

1. No UI before plan approval.  
2. No stage ends unreviewed.  
3. No "done" before `final_check` passes.  
4. Server refusals are correct — go back a step.  
5. Prefer small honest summaries over "looks good."  
6. Knowledge is on-demand — never dump the whole library into context.
