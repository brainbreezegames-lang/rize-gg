# Design Process Engine

**Stateful MCP that turns any AI coding agent into a disciplined designer.**

This is the product from the PRD — not a prompt generator.

```
start_task → get_playbook → submit_plan → get_pattern_guide*
→ (build → review)* → final_check
```

The approved plan is a **server-side contract**. Skipping steps fails. Knowledge is injected at the moment of need.

## Ship / install for users

### Remote MCP (recommended)

Point Cursor (or any URL-capable MCP client) at the hosted endpoint:

```json
{
  "mcpServers": {
    "design-process-engine": {
      "url": "https://YOUR_HOST/mcp"
    }
  }
}
```

Live host URL is written to `website/runtime.json` when the HTTP server is tunneled/deployed.

### Local stdio

```bash
cd design-process-engine
npm install && npm run build
```

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

Install [`skill/SKILL.md`](./skill/SKILL.md) so the pipeline is default agent behavior.

## Run the HTTP product yourself

```bash
npm run build
npm run start:http   # http://0.0.0.0:8787/mcp
```

## Factory (Product A)

```bash
npm run factory:capture
npm run factory:draft
npm run factory:status
```

## Knowledge

- 10 playbooks · 100 pattern guides · monthly slop catalog  
- Free: process + starters · Pro: full library (`dpe_pro_*` / `DESIGN_ENGINE_TIER=pro`)

```bash
npm run knowledge:generate
```

## Site

```bash
npx serve website
```

Install-first marketing site (not a toy demo).

## Tests

```bash
npm test
```

## License

MIT
