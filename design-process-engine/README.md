# Design Process Engine

**A strict senior design lead inside whatever AI coding agent you already run.**

Stateful MCP + companion skill. Tools are the steps of the process. Knowledge (playbooks + pattern guides) is injected at the moment of need. A Factory produces that knowledge; this Engine serves it.

## Pipeline

```
start_task → get_playbook → submit_plan → get_pattern_guide*
→ (build → review)* → final_check
```

| Tool | Job |
|------|-----|
| `start_task` | Classify Create / Edit / Recreate; return mode contract |
| `get_playbook` | Flow intelligence before planning |
| `submit_plan` | Critique + approve → **session contract** |
| `get_pattern_guide` | On-demand pattern prescription while building |
| `review` | After every stage: defects, drift, slop |
| `final_check` | Whole-deliverable audit + finishing commands |
| `register_brand_rules` / `get_session` / `list_knowledge` | Helpers |

## Install

```bash
cd design-process-engine
npm install
npm run build
npm test
```

### MCP config (Cursor / Claude Code)

```json
{
  "mcpServers": {
    "design-process-engine": {
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/design-process-engine/src/index.ts"],
      "env": {
        "DESIGN_ENGINE_API_KEY": "dpe_free_local"
      }
    }
  }
}
```

Pro: set `DESIGN_ENGINE_API_KEY=dpe_pro_<your-key>` or `DESIGN_ENGINE_TIER=pro`.

Companion skill: [`skill/SKILL.md`](./skill/SKILL.md)

## Tiers

| | Free | Pro (~$19/mo) |
|--|------|----------------|
| Process pipeline | ✓ | ✓ |
| Starter playbooks (2) + patterns (20) | ✓ | ✓ |
| Full playbooks (10) + patterns (100) | | ✓ |
| Monthly slop catalog in `final_check` | | ✓ |

## Knowledge

```bash
npm run knowledge:generate   # regenerate playbooks/patterns/slop JSON
```

Library lives in `knowledge/` (10 playbooks, 100 patterns, monthly slop).

## Factory (Product A)

Semi-automated capture → draft → human curate pipeline:

```bash
npm run factory:capture
npm run factory:draft
npm run factory:status
```

See [`factory/README.md`](./factory/README.md).

## Public site

```bash
npx serve website
# or open website/index.html
```

Landing, pricing, docs, install — [`website/`](./website/).

## Develop

```bash
npm run dev       # stdio MCP
npm test
npm run build
```

## Thesis

Enforcement + right-time knowledge beats `design.md`. Blind designer preference target: ≥ 80%.

## License

MIT
