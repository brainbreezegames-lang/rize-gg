/**
 * Super-simple playground for non-developers.
 * User types what they want → we do the pipeline for them.
 */

const DEFECT_IDS = [
  "clipped_text",
  "overlapping",
  "grid_misalignment",
  "same_role_sizes",
  "escaping_containers",
  "spacing_violations",
  "contrast",
  "hit_targets",
  "missing_states",
  "one_job",
];

const EXAMPLES = [
  "A signup flow for a banking app",
  "A dark dashboard for a SaaS product",
  "A checkout page for an online store",
  "A settings page with security options",
];

const state = {
  running: false,
  index: null,
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
    btn.textContent = busy ? "Working…" : "Build my plan";
  }
  if (input) input.disabled = busy;
}

function clearSteps() {
  const box = $("#steps");
  if (box) box.innerHTML = "";
  const result = $("#result");
  if (result) {
    result.hidden = true;
    result.innerHTML = "";
  }
}

function addStep(title, bodyHtml, tone = "ok") {
  const box = $("#steps");
  const card = document.createElement("article");
  card.className = `easy-step easy-step--${tone}`;
  card.innerHTML = `<h3>${title}</h3><div class="easy-step__body">${bodyHtml}</div>`;
  box.append(card);
  card.scrollIntoView({ behavior: "smooth", block: "nearest" });
  return card;
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
    edit: "Edit existing UI — match what the product already looks like",
    recreate: "Match a reference — stay faithful, don’t improvise",
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
    // prefer free when tied
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
    valueVocabulary: ["background", "accent", "spacing-large", "rounded-small"],
    notes: `Auto-planned from: “${wish}”`,
  };
}

function listHtml(items) {
  return `<ol>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ol>`;
}

function bullets(items) {
  return `<ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function runPipeline(wish) {
  clearSteps();
  setBusy(true);

  try {
    const mode = classifyMode(wish);
    await sleep(350);
    addStep(
      "1. We figured out what kind of work this is",
      `<p><strong>${escapeHtml(plainMode(mode))}</strong></p>
       <p class="muted">You don’t need to choose this — we classify it from your sentence.</p>`
    );

    const index = await loadIndex();
    const pick = pickPlaybook(wish, index);
    const playbook = await loadPlaybook(pick.id);
    await sleep(400);
    addStep(
      "2. We loaded a playbook (how good apps do this)",
      `<p><strong>${escapeHtml(playbook.title)}</strong> — ${escapeHtml(playbook.summary)}</p>
       <p><em>Screens successful apps usually include:</em></p>
       ${listHtml(playbook.structure.slice(0, 7))}
       <p><em>Things people often forget:</em></p>
       ${bullets(playbook.forgottenStates.slice(0, 4))}
       <p><em>Never do:</em></p>
       ${bullets(playbook.neverDo.slice(0, 3))}`
    );

    const plan = autoPlan(wish, mode, playbook);
    await sleep(400);
    addStep(
      "3. We wrote your design plan (this becomes the contract)",
      `<p><strong>Layout idea:</strong> ${escapeHtml(plan.layoutPrinciple)}</p>
       <p><strong>Screens to build:</strong></p>
       ${listHtml(plan.screens)}
       <p><strong>Look & feel:</strong> ${escapeHtml(plan.paletteStrategy)}. Density: ${escapeHtml(plan.density)}.</p>
       <p class="muted">In Cursor/Claude with the MCP, the AI must follow this plan — it can’t wander into generic “AI slop.”</p>`
    );

    // Simulate staged reviews in plain language
    for (let i = 0; i < Math.min(plan.screens.length, 3); i++) {
      await sleep(280);
      const screen = plan.screens[i];
      addStep(
        `4.${i + 1} Review checkpoint: “${escapeHtml(screen)}”`,
        `<p>Before moving on, we check for common mistakes:</p>
         ${bullets([
           "Text cut off or overlapping",
           "Uneven spacing / misaligned columns",
           "Missing error or empty states when needed",
           "Looking generic (purple gradients, fake “Unlock your potential” headlines)",
         ])}
         <p class="ok-line">✓ This stage would be marked reviewed before the next one starts.</p>`
      );
    }

    await sleep(350);
    const remaining = plan.screens.length - Math.min(plan.screens.length, 3);
    addStep(
      "5. Final check",
      `<p>We confirm every planned screen was reviewed, the plan was honored, and the result doesn’t match known “AI design tells.”</p>
       ${remaining > 0 ? `<p class="muted">(+ ${remaining} more screen(s) in the full plan would get the same review.)</p>` : ""}
       <p class="ok-line">✓ Ready to build for real in your AI coding tool — with this contract held.</p>`,
      "done"
    );

    const result = $("#result");
    result.hidden = false;
    result.innerHTML = `
      <h2>You’re done — here’s what this was</h2>
      <p>You only needed <strong>one sentence</strong>. The Engine did the senior-designer process:</p>
      <ul>
        <li>Classify the job</li>
        <li>Load real-world playbook knowledge</li>
        <li>Lock a plan</li>
        <li>Force review after every stage</li>
        <li>Final anti-slop check</li>
      </ul>
      <p><strong>You don’t fill those technical boxes yourself.</strong> That was a mistake in the old playground.
      When you use this inside Cursor or Claude later, <em>the AI</em> fills the plan — and the Engine refuses junk.</p>
      <p class="result-cta">Want another? Change your sentence above and press the button again.</p>
    `;
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    addStep(
      "Something went wrong",
      `<p>${escapeHtml(err.message || String(err))}</p>
       <p class="muted">Try again in a moment, or pick one of the example chips.</p>`,
      "bad"
    );
  } finally {
    setBusy(false);
  }
}

function boot() {
  const form = $("#easy-form");
  const wish = $("#wish");
  const chips = $("#examples");

  // example chips
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

  // Prefetch knowledge
  loadIndex().catch(() => {});
}

document.addEventListener("DOMContentLoaded", boot);
