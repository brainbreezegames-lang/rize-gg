#!/usr/bin/env node
/**
 * Public HTTP MCP endpoint — this is how users ship/consume the product today.
 *
 * Cursor / Claude Code:
 * {
 *   "mcpServers": {
 *     "design-process-engine": {
 *       "url": "https://YOUR_HOST/mcp"
 *     }
 *   }
 * }
 *
 * Each MCP session gets its own SessionStore (the contract lives on the server).
 */

import { createServer as createHttpServer, type IncomingMessage, type ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { createServer } from "./server.js";
import { SessionStore } from "./session/store.js";

const PORT = Number(process.env.PORT || process.env.DPE_HTTP_PORT || 8787);
const HOST = process.env.HOST || "0.0.0.0";

type SessionRec = {
  transport: StreamableHTTPServerTransport;
  store: SessionStore;
};

const sessions = new Map<string, SessionRec>();

function sendJson(res: ServerResponse, status: number, body: unknown) {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Content-Type, Accept, Mcp-Session-Id, Last-Event-ID, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Expose-Headers": "Mcp-Session-Id",
  });
  res.end(data);
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(Buffer.from(c)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

async function handleMcp(req: IncomingMessage, res: ServerResponse) {
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Content-Type, Accept, Mcp-Session-Id, Last-Event-ID, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Expose-Headers": "Mcp-Session-Id",
    });
    res.end();
    return;
  }

  const sessionId = req.headers["mcp-session-id"] as string | undefined;

  if (req.method === "POST") {
    const raw = await readBody(req);
    let body: unknown = undefined;
    if (raw) {
      try {
        body = JSON.parse(raw);
      } catch {
        sendJson(res, 400, { error: "Invalid JSON body" });
        return;
      }
    }

    let rec = sessionId ? sessions.get(sessionId) : undefined;

    if (!rec) {
      if (!sessionId && body && isInitializeRequest(body)) {
        const store = new SessionStore();
        const server = createServer(store);
        const transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: (sid) => {
            sessions.set(sid, { transport, store });
            console.error(`[dpe-http] session started ${sid}`);
          },
        });
        transport.onclose = () => {
          const sid = transport.sessionId;
          if (sid) {
            sessions.delete(sid);
            console.error(`[dpe-http] session closed ${sid}`);
          }
        };
        await server.connect(transport);
        await transport.handleRequest(req, res, body);
        return;
      }
      sendJson(res, 400, {
        error:
          "Bad session. Send an initialize request without Mcp-Session-Id, or reuse a valid session id.",
      });
      return;
    }

    await rec.transport.handleRequest(req, res, body);
    return;
  }

  if (req.method === "GET" || req.method === "DELETE") {
    if (!sessionId || !sessions.has(sessionId)) {
      sendJson(res, 400, { error: "Invalid or missing Mcp-Session-Id" });
      return;
    }
    await sessions.get(sessionId)!.transport.handleRequest(req, res);
    return;
  }

  sendJson(res, 405, { error: "Method not allowed" });
}

async function handler(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  // Product landing for browsers hitting the MCP host
  if (url.pathname === "/" && req.method === "GET") {
    sendJson(res, 200, {
      name: "design-process-engine",
      version: "1.0.0",
      product:
        "Stateful MCP design process engine — classify, playbook, plan, pattern guides, review, final_check.",
      mcp: "/mcp",
      health: "/health",
      install: {
        cursor: {
          mcpServers: {
            "design-process-engine": {
              url: `https://YOUR_PUBLIC_HOST/mcp`,
            },
          },
        },
      },
      tools: [
        "start_task",
        "get_playbook",
        "submit_plan",
        "get_pattern_guide",
        "review",
        "final_check",
        "register_brand_rules",
        "get_session",
        "list_knowledge",
      ],
      activeSessions: sessions.size,
    });
    return;
  }

  if (url.pathname === "/health") {
    sendJson(res, 200, { ok: true, sessions: sessions.size });
    return;
  }

  if (url.pathname === "/mcp") {
    try {
      await handleMcp(req, res);
    } catch (err) {
      console.error("[dpe-http] error", err);
      if (!res.headersSent) {
        sendJson(res, 500, { error: "Internal server error" });
      }
    }
    return;
  }

  sendJson(res, 404, { error: "Not found", try: ["/", "/mcp", "/health"] });
}

const server = createHttpServer(handler);
server.listen(PORT, HOST, () => {
  console.error(
    `design-process-engine HTTP MCP on http://${HOST}:${PORT}/mcp (${sessions.size} sessions)`
  );
});

function shutdown() {
  for (const [sid, rec] of sessions) {
    void rec.transport.close();
    sessions.delete(sid);
  }
  server.close(() => process.exit(0));
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
