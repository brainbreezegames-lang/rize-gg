/**
 * Non-dev playground:
 * Input one sentence → get a copy-paste brief for ChatGPT / Claude / Cursor.
 */

const EXAMPLES = [
  "A signup flow for a banking app",
  "A dark dashboard for a SaaS product",
  "A checkout page for an online store",
  "A settings page with security options",
];

const state = {
  running: false,
  index: null,
  lastBrief: "",
};

const $ = (sel) => document.querySelector(sel);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function setBusy(busy) {
  state.running = busy;
  const btn = $("#btn-go");
  const input = $("#wish");
  if (btn) {
    btn.disabled = busy;
    btn.textContent = busy ? "Running demo…" : "Run demo process";
  }
  if (input) input.disabled = busy;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function classifyMode(text) {
  const t = text.toLowerCase();
  if (/recreate|figma|screenshot|copy this|match this/.test(t)) return "recreate";
  if (/edit|fix|update|change|existing/.test(t)) return "edit";
  return "create";
}

function plainMode(mode) {
  return {
    create: "New design — make it distinctive, not generic",
    edit: "Edit existing UI — match what already exists",
    recreate: "Match a reference — stay faithful",
  }[mode];
}

async function loadIndex() {
  if (state.index) return state.index;
  const res = await fetch("./knowledge/index.json");
  state.index = await res.json();
  return state.index;
}

async function loadPlaybook(id) {
  const res = await fetch(`./knowledge/playbooks/${id}.json`);
  if (!res.ok) return null;
  return res.json();
}

function pickPlaybook(wish, index) {
  const text = wish.toLowerCase();
  const scored = index.playbooks.map((p) => {
    let score = 0;
    const blob = [p.id, p.title, p.productType, p.flow].join(" ").toLowerCase();
    for (const word of blob.split(/[^a-z0-9]+/)) {
      if (word.length > 3 && text.includes(word)) score += 1;
    }
    if (/bank|fintech|wallet|kyc|money|card/.test(text) && p.id.includes("fintech")) score += 8;
    if (/dashboard|saas|admin|analytics/.test(text) && p.id.includes("saas")) score += 8;
    if (/checkout|cart|shop|store|buy/.test(text) && p.id.includes("checkout")) score += 8;
    if (/signup|sign up|register|onboard/.test(text) && /onboard|signup/.test(p.id)) score += 5;
    if (/settings|security|password|2fa/.test(text) && p.id.includes("settings")) score += 8;
    if (/social|feed|posts/.test(text) && p.id.includes("social")) score += 6;
    if (/course|learn|lesson|education/.test(text) && p.id.includes("education")) score += 6;
    if (/health|patient|intake|clinic/.test(text) && p.id.includes("healthcare")) score += 6;
    if (p.tier === "free") score += 0.2;
    return { p, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.score > 0 ? scored[0].p : index.playbooks.find((p) => p.tier === "free");
}

function autoPlan(wish, mode, playbook) {
  const screens =
    playbook?.structure?.slice(0, 6) ||
    ["Hero", "Main content", "Call to action"];

  return {
    layoutPrinciple:
      mode === "edit"
        ? "Keep the existing page shell; only change the requested area"
        : mode === "recreate"
          ? "Match the reference layout section-by-section"
          : "One clear job per screen, strong brand in the first screen",
    screens,
    paletteStrategy: "Dark background with one bright accent color (not purple)",
    density: /dashboard|admin|table|data/.test(wish.toLowerCase())
      ? "information-rich"
      : "comfortable",
    typeDirection: "One bold display font for titles + one simple font for body text",
    notes: wish,
  };
}

function buildBrief(wish, mode, playbook, plan) {
  const screens = plan.screens.map((s, i) => `${i + 1}. ${s}`).join("\n");
  const forgotten = (playbook.forgottenStates || [])
    .slice(0, 5)
    .map((s) => `- ${s}`)
    .join("\n");
  const never = (playbook.neverDo || [])
    .slice(0, 4)
    .map((s) => `- ${s}`)
    .join("\n");
  const strategy = playbook.strategies?.[0];

  return `You are my design lead. Build this UI carefully. Follow this brief exactly.

## What I want
${wish}

## Mode
${plainMode(mode)}

## Playbook: ${playbook.title}
${playbook.summary}

Recommended strategy: ${strategy ? `${strategy.name} (${strategy.prevalence}). ${strategy.when}` : "Pick one clear approach and stick to it."}

## Screens to build (in order)
${screens}

## Layout rule
${plan.layoutPrinciple}

## Look and feel
- ${plan.paletteStrategy}
- Density: ${plan.density}
- Type: ${plan.typeDirection}
- Do NOT use purple gradients, generic SaaS slogans (“unlock your potential”), or emoji decoration.

## States you must include
${forgotten || "- Loading, empty, and error states where relevant"}

## Never do
${never || "- Don’t invent a second visual style mid-way"}

## How to work
1. Build ONE screen at a time.
2. After each screen, self-check: no clipped text, no overlap, consistent spacing, not generic.
3. When all screens are done, do a final pass against this brief.

Start with screen 1 now.`;
}

function addStep(title, bodyHtml) {
  const box = $("#steps");
  const card = document.createElement("article");
  card.className = "easy-step";
  card.innerHTML = `<h3>${title}</h3><div class="easy-step__body">${bodyHtml}</div>`;
  box.append(card);
}

async function runPipeline(wish) {
  const steps = $("#steps");
  const details = $("#process-details");
  const result = $("#result");
  steps.innerHTML = "";
  result.hidden = true;
  details.hidden = true;
  setBusy(true);

  try {
    await sleep(200);
    const mode = classifyMode(wish);
    const index = await loadIndex();
    const pick = pickPlaybook(wish, index);
    const playbook = await loadPlaybook(pick.id);
    const plan = autoPlan(wish, mode, playbook);
    const brief = buildBrief(wish, mode, playbook, plan);
    state.lastBrief = brief;

    // Optional process trail (collapsed)
    addStep(
      "Classified",
      `<p>${escapeHtml(plainMode(mode))}</p>`
    );
    addStep(
      "Playbook",
      `<p><strong>${escapeHtml(playbook.title)}</strong> — ${escapeHtml(playbook.summary)}</p>`
    );
    addStep(
      "Plan",
      `<p>${escapeHtml(plan.screens.length)} screens · ${escapeHtml(plan.paletteStrategy)}</p>`
    );
    details.hidden = false;

    result.hidden = false;
    result.innerHTML = `
      <p class="easy-kicker">Demo output (not the whole product)</p>
      <h2>What the real Engine does with this</h2>
      <ul>
        <li><strong>Remembers</strong> this plan as a session contract (a .md file can’t)</li>
        <li><strong>Blocks</strong> the AI from coding UI until the plan is approved</li>
        <li><strong>Injects</strong> playbooks/pattern guides at the moment of need</li>
        <li><strong>Requires</strong> a review after every screen — no stage ends unchecked</li>
        <li><strong>Runs</strong> final_check + monthly slop signatures before “done”</li>
      </ul>
      <p>Below is only a <em>sample brief</em> the demo can export. The PRD product is the MCP that enforces this loop while the agent builds.</p>
      <pre id="brief-text" class="brief-box">${escapeHtml(brief)}</pre>
      <button type="button" class="btn btn--ghost" id="btn-copy">Copy sample brief</button>
      <p id="copy-status" class="copy-status" hidden>Copied ✓</p>
      <p class="next-h"><a class="btn btn--primary" href="./docs.html">See the real product</a>
      <a class="btn btn--ghost" href="./install.html">Install MCP</a></p>
    `;

    $("#btn-copy")?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(state.lastBrief);
        const status = $("#copy-status");
        if (status) {
          status.hidden = false;
          status.textContent = "Copied ✓ — now paste it into ChatGPT / Claude / Cursor";
        }
      } catch {
        // fallback: select the text
        const pre = $("#brief-text");
        if (pre) {
          const range = document.createRange();
          range.selectNodeContents(pre);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
          alert("Press Ctrl+C (or Cmd+C) to copy the selected brief.");
        }
      }
    });

    result.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    result.hidden = false;
    result.innerHTML = `
      <h2>Something went wrong</h2>
      <p>${escapeHtml(err.message || String(err))}</p>
      <p>Try an example chip and click the button again.</p>
    `;
  } finally {
    setBusy(false);
  }
}

function boot() {
  const form = $("#easy-form");
  const wish = $("#wish");
  const chips = $("#examples");

  if (chips) {
    chips.innerHTML = "";
    for (const ex of EXAMPLES) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = ex;
      b.addEventListener("click", () => {
        wish.value = ex;
        wish.focus();
      });
      chips.append(b);
    }
  }

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = wish.value.trim();
    if (!text || state.running) return;
    runPipeline(text);
  });

  loadIndex().catch(() => {});
}

document.addEventListener("DOMContentLoaded", boot);
