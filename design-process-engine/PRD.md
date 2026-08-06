# PRD — Design Process Engine for AI Agents

Working name TBD · Version 1.0 · August 2026

This package implements **Phase 1** of the product described below.

---

## One-liner

An MCP that turns any AI coding agent into a disciplined designer. It enforces classify → plan → staged build → review, and (later) feeds knowledge extracted from real successful apps at the moment it's needed.

**Two products:**

- **Product A — the Factory (internal):** produces and maintains knowledge.
- **Product B — the Engine (public):** the MCP + companion skill. **This repo folder.**

## Thesis

Everyone else ships knowledge; we ship **enforcement**, with knowledge injected at the right moments. Enforcement alone should beat `design.md` in blind designer judgments (≥ 80%).

## Phase 1 scope (shipped here)

- Hand-written process rules (modes, plan critique, defect hunt list, starter slop signatures)
- Companion skill (`skill/SKILL.md`)
- MCP tools: `start_task`, `submit_plan`, `review` (+ `register_brand_rules`, `get_session`)
- Stateful session: approved plan is the contract

## Later phases (not in this package yet)

- **Phase 2:** `get_playbook`, `get_pattern_guide`, first hand-written playbooks/guides
- **Phase 3:** Factory capture pipeline, `final_check`, monthly slop updates, public site / pricing

## Success metric

Designers prefer Engine output over the same agent with design.md ≥ 80% of the time in blind comparisons.
