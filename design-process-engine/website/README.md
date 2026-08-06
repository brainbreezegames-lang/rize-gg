# Design Process Engine — Public Website

Static multi-page site for the Design Process Engine product (not a framework app).

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Landing — brand-first hero, CTA |
| `pricing.html` | Free vs Pro (~$19/mo) |
| `docs.html` | Pipeline tool sequence |
| `install.html` | MCP install for Cursor / Claude Code / generic |
| `styles.css` | Shared tokens + layout |
| `main.js` | Nav toggle + reveal motion |

## Run locally

Zero install required — open the file:

```bash
open website/index.html
# or
xdg-open website/index.html
```

Or serve with any static server:

```bash
npx serve website
# → http://localhost:3000 (port may vary)
```

```bash
python3 -m http.server 8080 --directory website
```

## Visual direction

Near-black canvas, electric lime accent, Syne + IBM Plex Sans. Editorial-tech — not purple gradients, cream/terracotta, or broadsheet.
