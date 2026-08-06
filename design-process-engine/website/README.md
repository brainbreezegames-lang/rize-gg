# Design Process Engine — Public site

Static site + browser playground. No GitHub skills required to use it.

## Local

Open `index.html`, or:

```bash
npx serve .
```

Then open **Playground** to run the full pipeline in your browser.

## Deploy to Vercel

From `design-process-engine/`:

```bash
npm run website:sync-knowledge
npx vercel deploy website --prod --yes
```

Needs a Vercel account token in `VERCEL_TOKEN` (or interactive login).

Or in the Vercel dashboard: **Add New Project → Import** this repo, set:

- **Root Directory:** `design-process-engine/website`
- **Framework Preset:** Other
- **Build Command:** (empty)
- **Output Directory:** `.`
