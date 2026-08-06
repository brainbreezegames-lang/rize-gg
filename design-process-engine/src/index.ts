#!/usr/bin/env node
/**
 * Design Process Engine MCP — stdio entrypoint.
 *
 * Wire into Cursor / Claude Code / any MCP client:
 * {
 *   "mcpServers": {
 *     "design-process-engine": {
 *       "command": "npx",
 *       "args": ["tsx", "/path/to/design-process-engine/src/index.ts"]
 *     }
 *   }
 * }
 *
 * IMPORTANT: log only to stderr — stdout is the JSON-RPC stream.
 */

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";

async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("design-process-engine MCP v1 listening on stdio");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
