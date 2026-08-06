import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

/** Small, step-specific payloads — keep the pipeline chatty but cheap. */
export function ok(payload: unknown): CallToolResult {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(payload, null, 2),
      },
    ],
  };
}

export function fail(message: string, extra?: Record<string, unknown>): CallToolResult {
  return {
    isError: true,
    content: [
      {
        type: "text",
        text: JSON.stringify({ error: message, ...extra }, null, 2),
      },
    ],
  };
}
