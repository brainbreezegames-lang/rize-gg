/**
 * Design Process Engine — MCP server (full product)
 *
 * Pipeline:
 *   start_task → get_playbook → submit_plan → get_pattern_guide*
 *   → (build stage → review)* → final_check
 *
 * State lives on the server. Knowledge is injected at the moment of need.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  getPatternGuide,
  getPlaybook,
  listPatterns,
  listPlaybooks,
  matchPlaybook,
  patternDigest,
  playbookDigest,
} from "./knowledge/loader.js";
import { runFinalCheck } from "./process/final-check.js";
import { classifyMode, getModeContract } from "./process/modes.js";
import { critiquePlan, planIsApprovable } from "./process/plan-critique.js";
import { formatDefectChecklistForAgent } from "./process/review-defects.js";
import { remainingStages, reviewStage } from "./process/review-engine.js";
import {
  SessionError,
  SessionStore,
  defaultStore,
} from "./session/store.js";
import type { DesignMode, DesignPlan, ReviewSubmission } from "./session/types.js";
import {
  assertTier,
  canAccessKnowledge,
  resolveAccess,
} from "./tier/access.js";
import { fail, ok } from "./tools/responses.js";

const modeEnum = z.enum(["create", "edit", "recreate"]);
const finishEnum = z.enum(["distill", "quieter", "bolder", "none"]);

function accessFromArgs(apiKey?: string) {
  return resolveAccess(apiKey);
}

export function createServer(store: SessionStore = defaultStore): McpServer {
  const server = new McpServer({
    name: "design-process-engine",
    version: "1.0.0",
  });

  // ─── 1. start_task ───────────────────────────────────────────
  server.tool(
    "start_task",
    `Begin a design session. Classifies Create / Edit / Recreate and returns the mode contract. MUST be first. Do not design before an approved plan.`,
    {
      task: z.string().describe("What you are building."),
      context: z.string().optional().describe("Framework, product notes, references, audience."),
      mode: modeEnum.optional(),
      brand_rules: z
        .object({
          productName: z.string().optional(),
          voice: z.string().optional(),
          palette: z.array(z.string()).optional(),
          typography: z.array(z.string()).optional(),
          bans: z.array(z.string()).optional(),
          extra: z.array(z.string()).optional(),
        })
        .optional(),
      api_key: z.string().optional().describe("dpe_free_* or dpe_pro_* key. Optional for local free tier."),
      reset: z.boolean().optional(),
    },
    async (args) => {
      try {
        if (args.reset || store.getSession()) store.resetSession();
        const access = accessFromArgs(args.api_key);
        const context = args.context ?? "";
        const mode = classifyMode(args.task, context, args.mode as DesignMode | undefined);
        const modeContract = getModeContract(mode);
        const session = store.startSession({
          task: args.task,
          context,
          mode,
          modeContract,
          brandRules: args.brand_rules,
          tier: access.tier,
        });

        const suggested = matchPlaybook(args.task, context);

        return ok({
          sessionId: session.id,
          phase: session.phase,
          mode: session.mode,
          tier: access.tier,
          priority: modeContract.priority,
          contract: {
            mustResolveBeforeDesign: modeContract.mustResolveBeforeDesign,
            forbidden: modeContract.forbidden,
            successLooksLike: modeContract.successLooksLike,
          },
          brandRules: session.brandRules,
          suggestedPlaybook: suggested
            ? { id: suggested.id, title: suggested.title, tier: suggested.tier }
            : null,
          nextStep: {
            tool: "get_playbook",
            instruction:
              "Call get_playbook before planning (use suggestedPlaybook.id or a flow id). Then submit_plan. Skip playbook only for tiny one-line edits — set skip in notes if you must.",
          },
        });
      } catch (e) {
        return fail(e instanceof Error ? e.message : String(e));
      }
    }
  );

  // ─── register_brand_rules ────────────────────────────────────
  server.tool(
    "register_brand_rules",
    `Merge brand rules into the active session. Enforced in plan critique, review, and final_check.`,
    {
      productName: z.string().optional(),
      voice: z.string().optional(),
      palette: z.array(z.string()).optional(),
      typography: z.array(z.string()).optional(),
      bans: z.array(z.string()).optional(),
      extra: z.array(z.string()).optional(),
    },
    async (args) => {
      try {
        const session = store.setBrandRules(args);
        return ok({ sessionId: session.id, brandRules: session.brandRules });
      } catch (e) {
        if (e instanceof SessionError) return fail(e.message, { code: e.code });
        return fail(e instanceof Error ? e.message : String(e));
      }
    }
  );

  // ─── 2. get_playbook ─────────────────────────────────────────
  server.tool(
    "get_playbook",
    `Before planning: load digested flow intelligence for this product type — structure successful apps use, strategy tradeoffs with prevalence, forgotten states, and never-do list.`,
    {
      playbook_id: z
        .string()
        .optional()
        .describe("Playbook id (e.g. fintech-onboarding). Omit to auto-match from the session task."),
      list: z.boolean().optional().describe("If true, list available playbooks instead of loading one."),
    },
    async (args) => {
      try {
        const session = store.requireSession();
        const access = resolveAccess(undefined);
        // session tier wins if start_task set it
        const tier = session.tier ?? access.tier;

        if (args.list) {
          const items = listPlaybooks().map((p) => ({
            id: p.id,
            title: p.title,
            tier: p.tier,
            locked: !canAccessKnowledge(p.tier, { tier, reason: "" }),
          }));
          return ok({ playbooks: items, yourTier: tier });
        }

        const pb =
          (args.playbook_id ? getPlaybook(args.playbook_id) : null) ??
          matchPlaybook(session.task, session.context);

        if (!pb) {
          return ok({
            found: false,
            message:
              "No playbook matched. Call get_playbook with list:true, pick an id, or proceed to submit_plan with skip noted.",
            available: listPlaybooks().map((p) => p.id),
            nextStep: { tool: "submit_plan" },
          });
        }

        if (!canAccessKnowledge(pb.tier, { tier, reason: "" })) {
          const gate = assertTier("pro", { tier, reason: "" }, `Playbook "${pb.id}"`);
          return fail(gate.ok === false ? gate.message : "Pro required", {
            code: "pro_required",
            playbookId: pb.id,
            starterPlaybooks: listPlaybooks()
              .filter((p) => p.tier === "free")
              .map((p) => p.id),
          });
        }

        store.setPlaybookId(pb.id);

        return ok({
          found: true,
          playbook: playbookDigest(pb),
          nextStep: {
            tool: "submit_plan",
            instruction:
              "Write your plan using this playbook: cover structure screens, account for forgottenStates, avoid neverDo, pick one strategy deliberately.",
          },
        });
      } catch (e) {
        if (e instanceof SessionError) return fail(e.message, { code: e.code });
        return fail(e instanceof Error ? e.message : String(e));
      }
    }
  );

  // ─── 3. submit_plan ──────────────────────────────────────────
  server.tool(
    "submit_plan",
    `Submit the design plan. Server critiques against mode contract (+ playbook if loaded). Approval makes it the session CONTRACT.`,
    {
      layoutPrinciple: z.string(),
      screens: z.array(z.string()),
      paletteStrategy: z.string(),
      density: z.string().describe("sparse | comfortable | dense | information-rich"),
      typeDirection: z.string(),
      valueVocabulary: z.array(z.string()),
      notes: z.string().optional(),
    },
    async (args) => {
      try {
        const session = store.requireSession();
        if (!session.mode || !session.modeContract) {
          return fail("Session missing mode. Call start_task.");
        }

        const plan: DesignPlan = {
          layoutPrinciple: args.layoutPrinciple,
          screens: args.screens,
          paletteStrategy: args.paletteStrategy,
          density: args.density,
          typeDirection: args.typeDirection,
          valueVocabulary: args.valueVocabulary,
          notes: args.notes,
        };

        let critique = critiquePlan(
          plan,
          session.mode,
          session.modeContract,
          session.brandRules
        );

        // Playbook-aware critique
        if (session.playbookId) {
          const pb = getPlaybook(session.playbookId);
          if (pb) {
            const joined = plan.screens.join(" ").toLowerCase();
            for (const state of pb.forgottenStates.slice(0, 4)) {
              const key = state.toLowerCase().split(/\s+/).slice(0, 2).join(" ");
              if (key.length > 4 && !joined.includes(key.split(" ")[0]!)) {
                critique.push({
                  severity: "warning",
                  message: `Playbook "${pb.id}" often needs: "${state}". Add a screen/state or justify omission in notes.`,
                });
              }
            }
            for (const never of pb.neverDo.slice(0, 3)) {
              if (JSON.stringify(plan).toLowerCase().includes(never.toLowerCase().slice(0, 24))) {
                critique.push({
                  severity: "blocker",
                  message: `Plan conflicts with playbook neverDo: "${never}"`,
                });
              }
            }
          }
        }

        store.setPendingPlan(plan, critique);

        if (!planIsApprovable(critique)) {
          return ok({
            approved: false,
            sessionId: session.id,
            phase: "planning",
            critique,
            instruction: "Fix blockers and resubmit. No UI until approved.",
          });
        }

        store.approvePlan(plan);

        return ok({
          approved: true,
          sessionId: session.id,
          phase: "plan_approved",
          contract: plan,
          critique,
          buildOrder: plan.screens,
          nextStep: {
            tool: "get_pattern_guide",
            instruction:
              "Build ONE stage at a time. When you hit a concrete pattern (nav, form, paywall, empty state…), call get_pattern_guide. After each stage, call review. No stage ends unreviewed.",
            defectChecklist: formatDefectChecklistForAgent(),
          },
        });
      } catch (e) {
        if (e instanceof SessionError) return fail(e.message, { code: e.code });
        return fail(e instanceof Error ? e.message : String(e));
      }
    }
  );

  // ─── 4. get_pattern_guide ────────────────────────────────────
  server.tool(
    "get_pattern_guide",
    `On-demand prescriptive guide for a UI pattern: structure, required states, code example, known mistakes. Call at the moment of need — not as a dump.`,
    {
      pattern_id: z
        .string()
        .optional()
        .describe("e.g. nav-drawer, multi-step-form, paywall, empty-state"),
      query: z.string().optional().describe("Search patterns by name/category"),
      category: z.string().optional(),
      list: z.boolean().optional(),
    },
    async (args) => {
      try {
        const session = store.requireSession();
        if (!session.approvedPlan) {
          return fail("Approve a plan with submit_plan before pulling pattern guides.", {
            code: "no_plan",
          });
        }

        const tier = session.tier;

        if (args.list || (!args.pattern_id && (args.query || args.category))) {
          const items = listPatterns({
            category: args.category,
            query: args.query,
          }).map((p) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            tier: p.tier,
            locked: !canAccessKnowledge(p.tier, { tier, reason: "" }),
          }));
          return ok({ patterns: items.slice(0, 40), yourTier: tier, total: items.length });
        }

        if (!args.pattern_id) {
          return ok({
            message: "Pass pattern_id, or list/query to discover ids.",
            examples: listPatterns().slice(0, 12).map((p) => p.id),
          });
        }

        const guide = getPatternGuide(args.pattern_id);
        if (!guide) {
          return fail(`Unknown pattern "${args.pattern_id}". Use list:true or query.`, {
            code: "not_found",
          });
        }

        if (!canAccessKnowledge(guide.tier, { tier, reason: "" })) {
          const gate = assertTier("pro", { tier, reason: "" }, `Pattern "${guide.id}"`);
          return fail(gate.ok === false ? gate.message : "Pro required", {
            code: "pro_required",
            patternId: guide.id,
          });
        }

        store.recordPatternGuide(guide.id);

        return ok({
          guide: patternDigest(guide),
          reminder:
            "Implement requiredStates. Avoid mistakes[]. After the stage is built, call review.",
        });
      } catch (e) {
        if (e instanceof SessionError) return fail(e.message, { code: e.code });
        return fail(e instanceof Error ? e.message : String(e));
      }
    }
  );

  // ─── 5. review ───────────────────────────────────────────────
  server.tool(
    "review",
    `Mandatory stage review after every screen/section. Defects + drift + slop. Pro unlocks deeper monthly slop catalog emphasis (same tool; catalog refreshes for Pro).`,
    {
      stageId: z.string(),
      summary: z.string(),
      artifactSnippet: z.string().optional(),
      defectChecks: z.record(z.string(), z.boolean()),
      notes: z.string().optional(),
    },
    async (args) => {
      try {
        const session = store.requireSession();
        if (!session.approvedPlan) {
          return fail("No approved plan.", { code: "no_plan" });
        }

        // Review itself is available on free (process engine). Pro is for knowledge depth.
        const submission: ReviewSubmission = {
          stageId: args.stageId,
          summary: args.summary,
          artifactSnippet: args.artifactSnippet,
          defectChecks: args.defectChecks,
          notes: args.notes,
        };

        const { passed, findings } = reviewStage(
          submission,
          session.approvedPlan,
          session.brandRules,
          session.reviewedStages
        );

        store.recordReview({
          stageId: args.stageId,
          submittedAt: new Date().toISOString(),
          passed,
          findings,
        });

        const s = store.requireSession();
        const remaining = remainingStages(s.approvedPlan!, s.reviewedStages);

        return ok({
          passed,
          stageId: args.stageId,
          findings,
          reviewedStages: s.reviewedStages,
          remainingStages: remaining,
          nextStep: passed
            ? remaining.length > 0
              ? {
                  instruction: `Build next stage "${remaining[0]}". Use get_pattern_guide if needed, then review.`,
                }
              : {
                  tool: "final_check",
                  instruction:
                    "All stages reviewed. Call final_check on the whole deliverable before claiming done.",
                }
            : {
                instruction:
                  "Fix blocker findings, then review the same stageId again. Do not advance.",
              },
        });
      } catch (e) {
        if (e instanceof SessionError) return fail(e.message, { code: e.code });
        return fail(e instanceof Error ? e.message : String(e));
      }
    }
  );

  // ─── 6. final_check ──────────────────────────────────────────
  server.tool(
    "final_check",
    `Whole-deliverable audit: every planned screen reviewed, contract honored, scan against monthly slop signatures. Optional finishing commands: distill | quieter | bolder.`,
    {
      deliverable_text: z
        .string()
        .optional()
        .describe("Concatenated summaries/snippets/copy from the finished work for slop scan."),
      finish_command: finishEnum.optional(),
      api_key: z.string().optional(),
    },
    async (args) => {
      try {
        const session = store.requireSession();
        if (!session.approvedPlan) {
          return fail("No approved plan.", { code: "no_plan" });
        }

        const access = accessFromArgs(args.api_key ?? undefined);
        const isPro = session.tier === "pro" || access.tier === "pro";

        const result = runFinalCheck({
          plan: session.approvedPlan,
          brand: session.brandRules,
          reviewedStages: session.reviewedStages,
          stageReviews: session.stageReviews,
          deliverableText: args.deliverable_text,
          finishCommand: args.finish_command ?? "none",
        });

        // Free: coverage + builtin slop. Pro: also monthly catalog findings.
        const findings = isPro
          ? result.findings
          : result.findings.filter((f) => {
              if (f.kind !== "slop") return true;
              if (f.message.startsWith("[builtin]")) return true;
              if (/^\[\d{4}-\d{2}\]/.test(f.message)) return false;
              return true;
            });

        const passed = !findings.some((f) => f.severity === "blocker");
        store.markFinalCheck(passed);

        return ok({
          passed,
          tier: session.tier,
          coverage: result.coverage,
          findings,
          finishGuidance: result.finishGuidance,
          slopMonth: result.slopMonth,
          proSlopUnlocked: isPro,
          nextStep: passed
            ? { instruction: "Deliver. Session contract satisfied." }
            : {
                instruction:
                  "Fix blockers (build/review missing stages or remove slop), then final_check again.",
              },
        });
      } catch (e) {
        if (e instanceof SessionError) return fail(e.message, { code: e.code });
        return fail(e instanceof Error ? e.message : String(e));
      }
    }
  );

  // ─── get_session ─────────────────────────────────────────────
  server.tool(
    "get_session",
    `Inspect active session: mode, plan contract, playbook, reviews, remaining work.`,
    {
      _: z.boolean().optional(),
    },
    async () => {
      const session = store.getSession();
      if (!session) {
        return fail("No active session. Call start_task.", { code: "no_session" });
      }
      return ok({
        sessionId: session.id,
        phase: session.phase,
        mode: session.mode,
        tier: session.tier,
        priority: session.modeContract?.priority,
        brandRules: session.brandRules,
        playbookId: session.playbookId,
        patternGuideIds: session.patternGuideIds,
        approvedPlan: session.approvedPlan,
        lastPlanCritique: session.lastPlanCritique,
        reviewedStages: session.reviewedStages,
        remainingStages: session.approvedPlan
          ? remainingStages(session.approvedPlan, session.reviewedStages)
          : [],
        finalCheckPassed: session.finalCheckPassed,
        recentReviews: session.stageReviews.slice(-3),
      });
    }
  );

  // ─── list_knowledge ──────────────────────────────────────────
  server.tool(
    "list_knowledge",
    `List playbooks and pattern guides available to your tier.`,
    {
      kind: z.enum(["playbooks", "patterns", "all"]).optional(),
    },
    async (args) => {
      const session = store.getSession();
      const tier = session?.tier ?? resolveAccess().tier;
      const kind = args.kind ?? "all";
      const payload: Record<string, unknown> = { yourTier: tier };
      if (kind === "playbooks" || kind === "all") {
        payload.playbooks = listPlaybooks().map((p) => ({
          ...p,
          locked: !canAccessKnowledge(p.tier, { tier, reason: "" }),
        }));
      }
      if (kind === "patterns" || kind === "all") {
        payload.patterns = listPatterns().map((p) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          tier: p.tier,
          locked: !canAccessKnowledge(p.tier, { tier, reason: "" }),
        }));
      }
      return ok(payload);
    }
  );

  return server;
}
