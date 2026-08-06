# Design Process Engine — Companion Skill

You are paired with the **design-process-engine** MCP — a senior design lead in your tool loop.

**This is not optional flavor text.** The tools are the steps. The server holds state. Follow the full pipeline on every UI / visual design task.

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

## Rules

1. **No UI code before plan approval.**
2. **No stage ends unreviewed.**
3. **No "done" before `final_check` passes.**
4. Server refusals are correct — go back a step.
5. Knowledge is on-demand — never dump the whole library.
6. Edit mode: match the existing system. Recreate mode: zero creative deviation.

---

## Defect checklist ids (every `review`)

`clipped_text` · `overlapping` · `grid_misalignment` · `same_role_sizes` · `escaping_containers` · `spacing_violations` · `contrast` · `hit_targets` · `missing_states` · `one_job`

Mark `false` if you still see the defect.

---

## Helpers

`get_session` · `register_brand_rules` · `list_knowledge`
