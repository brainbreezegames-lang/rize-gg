# Design Process Engine

**A strict senior design lead, rented into whatever AI coding agent you already run.**

This is **Product B — the Engine** (Phase 1): a stateful MCP + companion skill that enforces classify → plan → staged build → review. Knowledge playbooks come later; **enforcement alone** is the thesis to prove.

> Working name TBD · Phase 1 (process only) · August 2026

## Why this exists

Agents produce slop not because they lack references, but because nothing disciplines them. `design.md` is knowledge without enforcement. This MCP makes the **tools the steps of the process**, and **holds state** so the approved plan is a contract.

## Install

```bash
cd design-process-engine
npm install
npm run build
```

### Cursor / Claude Code MCP config

```json
{
  "mcpServers": {
    "design-process-engine": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/design-process-engine/src/index.ts"]
    }
  }
}
```

Or after build:

```json
{
  "mcpServers": {
    "design-process-engine": {
      "command": "node",
      "args": ["/absolute/path/to/design-process-engine/dist/index.js"]
    }
  }
}
```

### Companion skill

Copy or point your agent at [`skill/SKILL.md`](./skill/SKILL.md). That file makes the pipeline **default behavior**. The server refuses later steps without earlier ones; the skill tells the agent not to fight that.

## Tools (Phase 1)

| Tool | Job |
|------|-----|
| `start_task` | Classify Create / Edit / Recreate; return mode contract |
| `register_brand_rules` | Merge brand bans/palette/type into the session |
| `submit_plan` | Critique + approve plan → **session contract** |
| `review` | After every stage: defects, drift, slop signatures |
| `get_session` | Inspect contract and remaining stages |

Phase 2 will add `get_playbook` + `get_pattern_guide`. Phase 3 adds `final_check` + Factory-fed slop updates.

## Pipeline

```
start_task → submit_plan → build one stage → review → … → done
```

**Rules the server enforces:**

1. No session → no plan / review  
2. No approved plan → no review  
3. Stage must map to the approved screen list  
4. Full defect checklist required every review  
5. Blockers (defects, drift, brand bans, slop) fail the stage  

## Modes

| Mode | Priority |
|------|----------|
| **create** | Intentional, distinctive |
| **edit** | Invisibility — match the existing product; unused DS pieces banned |
| **recreate** | Fidelity — zero creative deviation |

## Develop

```bash
npm test          # vitest
npm run dev       # stdio server via tsx
npm run build     # emit dist/
```

## Thesis to verify

In blind comparisons, designers prefer Engine output over the same agent with a `design.md` **≥ 80%** of the time. Phase 1 ships enough to run that test with hand-written rules only.

## License

MIT
