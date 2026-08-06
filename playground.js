/**
 * Browser playground for the Design Process Engine.
 * Same pipeline as the MCP — runs entirely in your browser.
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

const state = {
  phase: "idle",
  mode: null,
  contract: null,
  task: "",
  context: "",
  playbook: null,
  plan: null,
  reviewed: [],
  log: [],
  index: null,
  tier: "free",
};

const $ = (sel) => document.querySelector(sel);
const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};

function log(title, payload) {
  state.log.unshift({ title, payload, at: new Date().toISOString() });
  renderLog();
}

function renderLog() {
  const box = $("#engine-log");
  if (!box) return;
  box.innerHTML = "";
  for (const item of state.log.slice(0, 12)) {
    const card = el("article", "play-log__item");
    card.append(el("h3", null, item.title));
    const pre = el("pre");
    pre.textContent =
      typeof item.payload === "string"
        ? item.payload
        : JSON.stringify(item.payload, null, 2);
    card.append(pre);
    box.append(card);
  }
}

function renderStatus() {
  const s = $("#engine-status");
  if (!s) return;
  s.textContent = [
    `phase: ${state.phase}`,
    state.mode ? `mode: ${state.mode}` : null,
    state.playbook ? `playbook: ${state.playbook.id}` : null,
    state.plan ? `screens: ${state.plan.screens.length}` : null,
    `reviewed: ${state.reviewed.length}`,
    `tier: ${state.tier}`,
  ]
    .filter(Boolean)
    .join(" · ");
}

function classifyMode(task, context) {
  const text = `${task}\n${context}`.toLowerCase();
  if (/recreate|figma|pixel|reference|screenshot|replicate/.test(text))
    return "recreate";
  if (/edit|update|fix|tweak|existing|codebase|component/.test(text))
    return "edit";
  return "create";
}

const CONTRACTS = {
  create: {
    priority: "Intentional and distinctive.",
    mustResolveBeforeDesign: [
      "Who is this for, and what single job does the first viewport do?",
      "Brand/product name as hero-level signal",
      "ONE layout principle",
      "Constrained value vocabulary",
      "Density + type direction",
    ],
    forbidden: [
      "UI before approved plan",
      "Purple/indigo default themes",
      "Stats/pills in the hero",
      "Cards in the hero",
    ],
  },
  edit: {
    priority: "Invisibility — match how the project already does it.",
    mustResolveBeforeDesign: [
      "Study existing components/tokens",
      "Reuse existing patterns",
      "Smallest change that works",
      "No parallel visual language",
    ],
    forbidden: [
      "New visual language",
      "Raw hex when tokens exist",
      "Recreating buttons/inputs from scratch",
    ],
  },
  recreate: {
    priority: "Fidelity — zero creative deviation.",
    mustResolveBeforeDesign: [
      "Name the reference",
      "Inventory sections/states",
      "Map spacing/type/color from reference",
      "Flag ambiguities before inventing",
    ],
    forbidden: [
      "Improving the reference without permission",
      "Skipping reference states",
      "Adding decoration not in the reference",
    ],
  },
};

function critiquePlan(plan) {
  const issues = [];
  if (!plan.layoutPrinciple || plan.layoutPrinciple.length < 8)
    issues.push({ severity: "blocker", message: "Need one clear layout principle." });
  if (!plan.screens?.length)
    issues.push({ severity: "blocker", message: "List screens/sections." });
  if (!plan.paletteStrategy || plan.paletteStrategy.length < 8)
    issues.push({ severity: "blocker", message: "Describe palette strategy." });
  if (!["sparse", "comfortable", "dense", "information-rich"].includes(
    (plan.density || "").toLowerCase()
  ))
    issues.push({
      severity: "blocker",
      message: "Density must be sparse | comfortable | dense | information-rich.",
    });
  if (!plan.typeDirection || plan.typeDirection.length < 8)
    issues.push({ severity: "blocker", message: "State type direction." });
  if (!plan.valueVocabulary || plan.valueVocabulary.length < 3)
    issues.push({
      severity: "blocker",
      message: "Value vocabulary needs at least 3 committed values.",
    });
  if (/purple|indigo|violet/i.test(plan.paletteStrategy || ""))
    issues.push({
      severity: "warning",
      message: "Purple/indigo without brand requirement is a slop signature.",
    });
  if (state.playbook) {
    for (const never of state.playbook.neverDo?.slice(0, 2) || []) {
      if (JSON.stringify(plan).toLowerCase().includes(never.toLowerCase().slice(0, 20))) {
        issues.push({
          severity: "blocker",
          message: `Conflicts with playbook neverDo: ${never}`,
        });
      }
    }
  }
  return issues;
}

async function loadIndex() {
  if (state.index) return state.index;
  const res = await fetch("./knowledge/index.json");
  state.index = await res.json();
  return state.index;
}

async function loadPlaybook(id) {
  const res = await fetch(`./knowledge/playbooks/${id}.json`);
  if (!res.ok) throw new Error(`Playbook not found: ${id}`);
  return res.json();
}

async function loadPattern(id) {
  const res = await fetch(`./knowledge/patterns/${id}.json`);
  if (!res.ok) throw new Error(`Pattern not found: ${id}`);
  return res.json();
}

function matchPlaybookId(task, context, index) {
  const text = `${task}\n${context}`.toLowerCase();
  let best = null;
  let score = 0;
  for (const p of index.playbooks) {
    let s = 0;
    for (const t of [p.id, p.title, p.productType, p.flow].join(" ").toLowerCase().split(/[^a-z0-9]+/)) {
      if (t.length > 3 && text.includes(t)) s++;
    }
    if (/fintech|kyc|wallet/.test(text) && p.id.includes("fintech")) s += 5;
    if (/dashboard|saas/.test(text) && p.id.includes("saas")) s += 5;
    if (/checkout|cart/.test(text) && p.id.includes("checkout")) s += 5;
    if (s > score) {
      score = s;
      best = p.id;
    }
  }
  return best || "fintech-onboarding";
}

function showPanel(id) {
  document.querySelectorAll("[data-panel]").forEach((p) => {
    p.hidden = p.dataset.panel !== id;
  });
  renderStatus();
}

async function onStartTask(e) {
  e.preventDefault();
  const task = $("#task").value.trim();
  const context = $("#context").value.trim();
  if (!task) return;
  state.task = task;
  state.context = context;
  state.mode = classifyMode(task, context);
  state.contract = CONTRACTS[state.mode];
  state.phase = "classified";
  state.playbook = null;
  state.plan = null;
  state.reviewed = [];
  log("start_task", {
    mode: state.mode,
    priority: state.contract.priority,
    contract: state.contract,
  });

  const index = await loadIndex();
  const free = index.playbooks.filter((p) => p.tier === "free");
  const suggested = matchPlaybookId(task, context, index);
  const select = $("#playbook-id");
  select.innerHTML = "";
  for (const p of index.playbooks) {
    const opt = el(
      "option",
      null,
      `${p.title} (${p.tier})${p.tier === "pro" && state.tier === "free" ? " — locked" : ""}`
    );
    opt.value = p.id;
    opt.disabled = p.tier === "pro" && state.tier === "free";
    if (p.id === suggested) opt.selected = true;
    select.append(opt);
  }
  // ensure a free default if suggested locked
  if (select.selectedOptions[0]?.disabled && free[0]) {
    select.value = free[0].id;
  }
  showPanel("playbook");
}

async function onGetPlaybook(e) {
  e.preventDefault();
  const id = $("#playbook-id").value;
  const pb = await loadPlaybook(id);
  if (pb.tier === "pro" && state.tier === "free") {
    log("get_playbook blocked", { error: "Pro required", id });
    alert("That playbook is Pro. Pick a Free starter playbook, or toggle Pro in the header.");
    return;
  }
  state.playbook = pb;
  state.phase = "planning";
  log("get_playbook", {
    id: pb.id,
    summary: pb.summary,
    structure: pb.structure,
    strategies: pb.strategies,
    forgottenStates: pb.forgottenStates,
    neverDo: pb.neverDo,
  });
  // Prefill screens from playbook structure
  $("#screens").value = pb.structure.slice(0, 6).join("\n");
  showPanel("plan");
}

function onSubmitPlan(e) {
  e.preventDefault();
  const plan = {
    layoutPrinciple: $("#layoutPrinciple").value.trim(),
    screens: $("#screens")
      .value.split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    paletteStrategy: $("#paletteStrategy").value.trim(),
    density: $("#density").value,
    typeDirection: $("#typeDirection").value.trim(),
    valueVocabulary: $("#valueVocabulary")
      .value.split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    notes: $("#notes").value.trim(),
  };
  const critique = critiquePlan(plan);
  const blockers = critique.filter((c) => c.severity === "blocker");
  if (blockers.length) {
    log("submit_plan rejected", { approved: false, critique });
    alert(
      "Plan not approved:\n\n" +
        blockers.map((b) => "• " + b.message).join("\n")
    );
    return;
  }
  state.plan = plan;
  state.phase = "plan_approved";
  state.reviewed = [];
  log("submit_plan approved", { approved: true, contract: plan, critique });
  fillStageSelect();
  buildDefectChecks();
  showPanel("build");
}

function fillStageSelect() {
  const sel = $("#stageId");
  sel.innerHTML = "";
  for (const s of state.plan.screens) {
    const opt = el("option", null, s);
    opt.value = s;
    if (state.reviewed.includes(s)) opt.textContent = `${s} ✓`;
    sel.append(opt);
  }
  // pick first unreviewed
  const next = state.plan.screens.find((s) => !state.reviewed.includes(s));
  if (next) sel.value = next;
}

function buildDefectChecks() {
  const box = $("#defect-checks");
  box.innerHTML = "";
  for (const id of DEFECT_IDS) {
    const label = el("label", "check");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = true;
    input.dataset.defect = id;
    label.append(input, document.createTextNode(` ${id}`));
    box.append(label);
  }
}

async function onPattern() {
  const id = $("#pattern-id").value.trim();
  if (!id) return;
  try {
    const g = await loadPattern(id);
    if (g.tier === "pro" && state.tier === "free") {
      log("get_pattern_guide blocked", { id, error: "Pro required" });
      alert("Pro pattern. Try: empty-state, modal, top-nav, pricing-table, settings-page");
      return;
    }
    log("get_pattern_guide", g);
    $("#review-summary").value =
      ($("#review-summary").value || "") +
      `\n\n[pattern:${g.id}] structure: ${g.structure.join(" → ")}; states: ${g.requiredStates.join(", ")}`;
  } catch (err) {
    alert(String(err.message || err));
  }
}

function onReview(e) {
  e.preventDefault();
  const stageId = $("#stageId").value;
  const summary = $("#review-summary").value.trim();
  const defectChecks = {};
  document.querySelectorAll("[data-defect]").forEach((input) => {
    defectChecks[input.dataset.defect] = input.checked;
  });
  const findings = [];
  if (summary.length < 20)
    findings.push({
      severity: "blocker",
      message: "Summary too thin — describe what you built.",
    });
  for (const [id, ok] of Object.entries(defectChecks)) {
    if (!ok)
      findings.push({
        severity: "blocker",
        message: `Defect admitted: ${id}`,
      });
  }
  if (/purple|from-purple|to-indigo|unlock your potential/i.test(summary))
    findings.push({
      severity: "blocker",
      message: "Slop signature detected in summary.",
    });
  const passed = !findings.some((f) => f.severity === "blocker");
  if (passed && !state.reviewed.includes(stageId)) state.reviewed.push(stageId);
  state.phase = "building";
  log("review", { stageId, passed, findings, reviewed: [...state.reviewed] });
  fillStageSelect();
  const remaining = state.plan.screens.filter((s) => !state.reviewed.includes(s));
  if (passed && remaining.length === 0) {
    showPanel("final");
  } else if (!passed) {
    alert("Review failed. Fix blockers and try again.\n\n" + findings.map((f) => "• " + f.message).join("\n"));
  } else {
    alert(`Stage passed. Next: ${remaining[0]}`);
    $("#review-summary").value = "";
  }
  renderStatus();
}

function onFinal(e) {
  e.preventDefault();
  const text = $("#deliverable").value.trim();
  const cmd = $("#finish-command").value;
  const missing = state.plan.screens.filter((s) => !state.reviewed.includes(s));
  const findings = [];
  if (missing.length)
    findings.push({
      severity: "blocker",
      message: `Missing reviews: ${missing.join(", ")}`,
    });
  if (/purple|indigo|unlock your potential|seamless experience/i.test(text))
    findings.push({
      severity: "blocker",
      message: "Slop signature in deliverable text.",
    });
  const passed = !findings.some((f) => f.severity === "blocker");
  if (passed) state.phase = "complete";
  const finish =
    cmd === "distill"
      ? ["Cut anything that does not earn its place.", "One primary CTA per viewport."]
      : cmd === "quieter"
        ? ["Reduce accent usage.", "More whitespace between groups."]
        : cmd === "bolder"
          ? ["Amplify brand in first viewport.", "Commit harder to the layout principle."]
          : ["Optional: distill | quieter | bolder"];
  log("final_check", { passed, findings, finishGuidance: finish, phase: state.phase });
  const out = $("#final-result");
  out.hidden = false;
  out.textContent = passed
    ? `✓ Passed. Session complete.\n\n${finish.join("\n")}`
    : `✗ Not passed.\n\n${findings.map((f) => "• " + f.message).join("\n")}`;
  renderStatus();
}

function onTierToggle() {
  state.tier = $("#tier-toggle").checked ? "pro" : "free";
  renderStatus();
  log("tier", { tier: state.tier });
}

function boot() {
  $("#form-start")?.addEventListener("submit", onStartTask);
  $("#form-playbook")?.addEventListener("submit", onGetPlaybook);
  $("#form-plan")?.addEventListener("submit", onSubmitPlan);
  $("#btn-pattern")?.addEventListener("click", onPattern);
  $("#form-review")?.addEventListener("submit", onReview);
  $("#form-final")?.addEventListener("submit", onFinal);
  $("#tier-toggle")?.addEventListener("change", onTierToggle);
  showPanel("start");
  renderStatus();
  loadIndex().then((index) => {
    log("knowledge ready", {
      playbooks: index.playbooks.length,
      patterns: index.patterns.length,
      slopMonth: index.slopMonth,
    });
  });
}

document.addEventListener("DOMContentLoaded", boot);
