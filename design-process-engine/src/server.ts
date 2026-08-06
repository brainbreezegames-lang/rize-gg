/**
 * Design Process Engine — MCP server
 *
 * Tools are the steps of the process. The server remembers the session's
 * plan and holds the agent to it. Phase 1: start_task, submit_plan, review.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { classifyMode, getModeContract } from "./process/modes.js";
import { critiquePlan, planIsApprovable } from "./process/plan-critique.js";
import { formatDefectChecklistForAgent } from "./process/review-defects.js";
import { remainingStages, reviewStage } from "./process/review-engine.js";
import {
  approvePlan,
  getSession,
  recordReview,
  requireSession,
  resetSession,
  SessionError,
  setBrandRules,
  setPendingPlan,
  startSession,
} from "./session/store.js";
import type { DesignMode, DesignPlan, ReviewSubmission } from "./session/types.js";
import { fail, ok } from "./tools/responses.js";

const modeEnum = z.enum(["create", "edit", "recreate"]);

export function createServer(): McpServer {
  const server = new McpServer({
    name: "design-process-engine",
    version: "0.1.0",
  });

  // ─────────────────────────────────────────────────────────────
  // 1. start_task
  // ─────────────────────────────────────────────────────────────
  server.tool(
    "start_task",
    `Begin a design session. Classifies the work into Create / Edit / Recreate and returns the mode contract. You MUST call this before planning or building UI. Designing without an approved plan is forbidden.`,
    {
      task: z
        .string()
        .describe("What you are building, in plain language."),
      context: z
        .string()
        .optional()
        .describe(
          "Framework, existing product notes, reference links, audience, constraints."
        ),
      mode: modeEnum
        .optional()
        .describe(
          "Optional explicit mode. If omitted, the server classifies from task+context."
        ),
      brand_rules: z
        .object({
          productName: z.string().optional(),
          voice: z.string().optional(),
          palette: z.array(z.string()).optional(),
          typography: z.array(z.string()).optional(),
          bans: z.array(z.string()).optional(),
          extra: z.array(z.string()).optional(),
        })
        .optional()
        .describe("Optional brand rules merged into every contract."),
      reset: z
        .boolean()
        .optional()
        .describe("If true, discard any existing session and start fresh."),
    },
    async (args) => {
      try {
        if (args.reset || getSession()) {
          // Starting a new task replaces the previous session
          resetSession();
        }

        const context = args.context ?? "";
        const mode = classifyMode(args.task, context, args.mode as DesignMode | undefined);
        const modeContract = getModeContract(mode);
        const session = startSession({
          task: args.task,
          context,
          mode,
          modeContract,
          brandRules: args.brand_rules,
        });

        return ok({
          sessionId: session.id,
          phase: session.phase,
          mode: session.mode,
          priority: modeContract.priority,
          contract: {
            mustResolveBeforeDesign: modeContract.mustResolveBeforeDesign,
            forbidden: modeContract.forbidden,
            successLooksLike: modeContract.successLooksLike,
          },
          brandRules: session.brandRules,
          nextStep: {
            tool: "submit_plan",
            instruction:
              "Resolve every mustResolveBeforeDesign item, then submit a design plan (layout principle, screens, palette, density, type direction, value vocabulary). Do NOT write UI code until the plan is approved.",
          },
          note: "Phase 1 is process-only. Playbooks (get_playbook) arrive in Phase 2 — proceed to submit_plan.",
        });
      } catch (e) {
        return fail(e instanceof Error ? e.message : String(e));
      }
    }
  );

  // ─────────────────────────────────────────────────────────────
  // register_brand_rules (optional helper)
  // ─────────────────────────────────────────────────────────────
  server.tool(
    "register_brand_rules",
    `Merge brand rules into the active session. Call after start_task (or pass brand_rules into start_task). Rules are enforced in plan critique and review.`,
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
        const session = setBrandRules(args);
        return ok({
          sessionId: session.id,
          brandRules: session.brandRules,
          message: "Brand rules merged into the session contract.",
        });
      } catch (e) {
        if (e instanceof SessionError) return fail(e.message, { code: e.code });
        return fail(e instanceof Error ? e.message : String(e));
      }
    }
  );

  // ─────────────────────────────────────────────────────────────
  // 2. submit_plan
  // ─────────────────────────────────────────────────────────────
  server.tool(
    "submit_plan",
    `Submit the design plan. The server critiques it against the mode contract. On approval, the plan becomes the CONTRACT for the rest of the session — build only what was planned, hold the layout principle, use the vocabulary.`,
    {
      layoutPrinciple: z
        .string()
        .describe("ONE layout principle you will hold for the whole deliverable."),
      screens: z
        .array(z.string())
        .describe("Ordered list of screens or sections to build."),
      paletteStrategy: z.string().describe("Palette strategy in plain language."),
      density: z
        .string()
        .describe("sparse | comfortable | dense | information-rich"),
      typeDirection: z.string().describe("Type direction and families/weights."),
      valueVocabulary: z
        .array(z.string())
        .describe(
          "Constrained values you commit to (tokens, spacing steps, radii, accent names)."
        ),
      notes: z.string().optional().describe("Acknowledgements, out-of-scope, brand test."),
    },
    async (args) => {
      try {
        const session = requireSession();
        if (!session.mode || !session.modeContract) {
          return fail("Session missing mode classification. Call start_task.");
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

        const critique = critiquePlan(
          plan,
          session.mode,
          session.modeContract,
          session.brandRules
        );
        setPendingPlan(plan, critique);

        if (!planIsApprovable(critique)) {
          return ok({
            approved: false,
            sessionId: session.id,
            phase: "planning",
            critique,
            instruction:
              "Fix every blocker and call submit_plan again. Do not build UI until approved.",
          });
        }

        approvePlan(plan);

        return ok({
          approved: true,
          sessionId: session.id,
          phase: "plan_approved",
          contract: plan,
          critique,
          buildOrder: plan.screens,
          nextStep: {
            tool: "review",
            instruction:
              "Build ONE stage at a time in buildOrder. After each stage, screenshot your work, fill the defect checklist, and call review. No stage ends unreviewed.",
            defectChecklist: formatDefectChecklistForAgent(),
          },
        });
      } catch (e) {
        if (e instanceof SessionError) return fail(e.message, { code: e.code });
        return fail(e instanceof Error ? e.message : String(e));
      }
    }
  );

  // ─────────────────────────────────────────────────────────────
  // 3. review
  // ─────────────────────────────────────────────────────────────
  server.tool(
    "review",
    `Mandatory stage review. Call after every screen/section. Checks defects (clipped text, overlap, grid, spacing, states…), drift from the approved plan, and current AI-slop signatures. The companion skill rule: no stage ends unreviewed.`,
    {
      stageId: z
        .string()
        .describe("Must match (or clearly map to) a screen/section from the approved plan."),
      summary: z
        .string()
        .describe(
          "What you built: structure, components, how it follows the layout principle."
        ),
      artifactSnippet: z
        .string()
        .optional()
        .describe("Optional code/markup snippet for heuristic slop/defect checks."),
      defectChecks: z
        .record(z.string(), z.boolean())
        .describe(
          "Map of defect id → true if clean, false if you still see the defect. Required ids: clipped_text, overlapping, grid_misalignment, same_role_sizes, escaping_containers, spacing_violations, contrast, hit_targets, missing_states, one_job."
        ),
      notes: z.string().optional(),
    },
    async (args) => {
      try {
        const session = requireSession();
        if (!session.approvedPlan) {
          return fail(
            "No approved plan. Call submit_plan and get approval before review.",
            { code: "no_plan" }
          );
        }

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

        recordReview({
          stageId: args.stageId,
          submittedAt: new Date().toISOString(),
          passed,
          findings,
        });

        const remaining = remainingStages(
          session.approvedPlan,
          // re-read after recordReview
          requireSession().reviewedStages
        );

        return ok({
          passed,
          stageId: args.stageId,
          findings,
          reviewedStages: requireSession().reviewedStages,
          remainingStages: remaining,
          nextStep: passed
            ? remaining.length > 0
              ? {
                  instruction: `Build the next stage: "${remaining[0]}", then call review again.`,
                }
              : {
                  instruction:
                    "All planned stages have passed review. Deliver the work. (final_check arrives in Phase 3 — for now, do a last human/self pass against the plan contract.)",
                }
            : {
                instruction:
                  "Fix every blocker finding, then call review again for this same stageId. Do not advance.",
              },
        });
      } catch (e) {
        if (e instanceof SessionError) return fail(e.message, { code: e.code });
        return fail(e instanceof Error ? e.message : String(e));
      }
    }
  );

  // ─────────────────────────────────────────────────────────────
  // get_session — inspect contract / progress
  // ─────────────────────────────────────────────────────────────
  server.tool(
    "get_session",
    `Return the active session: mode, approved plan contract, reviewed stages, and remaining work. Use when you need to re-align mid-build.`,
    {
      _: z
        .boolean()
        .optional()
        .describe("Unused. Present so clients with strict schemas can call with {}."),
    },
    async () => {
      const session = getSession();
      if (!session) {
        return fail("No active session. Call start_task.", { code: "no_session" });
      }
      return ok({
        sessionId: session.id,
        phase: session.phase,
        mode: session.mode,
        priority: session.modeContract?.priority,
        brandRules: session.brandRules,
        approvedPlan: session.approvedPlan,
        lastPlanCritique: session.lastPlanCritique,
        reviewedStages: session.reviewedStages,
        remainingStages: session.approvedPlan
          ? remainingStages(session.approvedPlan, session.reviewedStages)
          : [],
        recentReviews: session.stageReviews.slice(-3),
      });
    }
  );

  return server;
}
