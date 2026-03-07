import { GoogleGenerativeAI } from "@google/generative-ai";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE = "https://openrouter.ai/api/v1";
const AIMLAPI_KEY = process.env.AIMLAPI_KEY;
const AIMLAPI_BASE = "https://api.aimlapi.com/v1";
// Fallback Google key for /edit testing — does not affect /generate
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "AIzaSyD8sNXhfWietyPEEn67xSMoXoRHA5shDH8";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

type SupportedModel = "claude-opus-4.6" | "gemini-3.1-pro" | "chatgpt-5.4";

const OPENROUTER_MODEL_MAP: Record<SupportedModel, string> = {
  "claude-opus-4.6": "anthropic/claude-opus-4.6",
  "gemini-3.1-pro": "google/gemini-3.1-pro-preview",
  "chatgpt-5.4": "openai/gpt-5.4",
};

function buildEditSystemPrompt(currentCode: string, pageName: string): string {
  return `You are an AI editor for Rize.gg, a gaming platform UI built with React and Tailwind CSS.

You are editing the "${pageName}" page. Here is the CURRENT page code:

\`\`\`jsx
${currentCode}
\`\`\`

YOUR TASK: Apply the requested edit to this page.

STRICT RULES:
1. Return ONLY the complete modified component function(s) — NO import statements, NO export statements
2. The main component MUST be named exactly "GeneratedPage"
3. All design system components are already in scope: Sidebar, TopBar, Breadcrumbs, Button, SearchInput, FilterChip, Toggle, Select, SessionCard, TournamentCard, ClubCard, MissionCard, PlayerCard, StatCard, ArticleCard, SectionHeader, HeroBanner, Avatar, Badge, StatusPill, ProgressBar, Divider, Modal, etc.
4. All Lucide icons are in scope — use them directly (e.g. <Plus size={16} />) without import
5. React hooks (useState, useEffect, useMemo, useCallback) are in scope
6. Use ONLY design tokens — never raw hex colors:
   bg-bg-primary, bg-bg-secondary, bg-bg-card, bg-bg-surface, bg-bg-input,
   text-text-primary, text-text-secondary, text-text-tertiary, text-text-accent,
   bg-accent, bg-accent-hover, bg-accent-muted, border-border-default, border-border-subtle
7. Keep ALL existing functionality and data that is NOT being changed
8. Keep all existing data arrays (CLUBS_DATA, PLAYERS, SESSIONS etc.) intact unless the edit requires changing them
9. Preserve the overall page structure (Sidebar + TopBar + main content)
10. Use rounded-[var(--radius-sm/md/lg/xl)] for border radius

Return the raw JSX/JS code only — no markdown fences, no explanation, just the code.`;
}

async function streamOpenRouter(options: {
  apiKey: string;
  requestOrigin: string;
  upstreamModel: string;
  systemPrompt: string;
  prompt: string;
  controller: ReadableStreamDefaultController<Uint8Array>;
  encoder: TextEncoder;
}) {
  const { apiKey, requestOrigin, upstreamModel, systemPrompt, prompt, controller, encoder } = options;

  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": requestOrigin,
      "X-Title": "Rize.gg Editor",
    },
    body: JSON.stringify({
      model: upstreamModel,
      stream: true,
      temperature: 0.5,
      max_tokens: 16384,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`openrouter ${res.status}: ${errText.slice(0, 200)}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response stream from OpenRouter");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data: ")) continue;
      const data = trimmed.slice(6);
      if (data === "[DONE]") return;
      try {
        const parsed = JSON.parse(data);
        const text = parsed.choices?.[0]?.delta?.content;
        if (typeof text === "string" && text) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
        }
      } catch { continue; }
    }
  }
}

async function streamLegacyChatCompletions(options: {
  url: string;
  apiKey: string;
  providerLabel: string;
  upstreamModel: string;
  tokenField: "max_tokens" | "max_completion_tokens";
  systemPrompt: string;
  prompt: string;
  controller: ReadableStreamDefaultController<Uint8Array>;
  encoder: TextEncoder;
}) {
  const { url, apiKey, providerLabel, upstreamModel, tokenField, systemPrompt, prompt, controller, encoder } = options;

  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: upstreamModel,
      stream: true,
      temperature: 0.5,
      [tokenField]: 16384,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`${providerLabel} ${res.status}: ${errText.slice(0, 200)}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error(`No response stream from ${providerLabel}`);

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data: ")) continue;
      const data = trimmed.slice(6);
      if (data === "[DONE]") return;
      try {
        const parsed = JSON.parse(data);
        const text = parsed.choices?.[0]?.delta?.content;
        if (typeof text === "string" && text) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
        }
      } catch { continue; }
    }
  }
}

async function streamLegacyGemini(options: {
  systemPrompt: string;
  prompt: string;
  controller: ReadableStreamDefaultController<Uint8Array>;
  encoder: TextEncoder;
}) {
  const { systemPrompt, prompt, controller, encoder } = options;
  if (!GOOGLE_API_KEY) throw new Error("GOOGLE_API_KEY is not configured");

  const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-3.1-pro-preview",
    systemInstruction: systemPrompt,
    generationConfig: { temperature: 0.5, maxOutputTokens: 16384 },
  });

  const result = await model.generateContentStream({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
    }
  }
}

export async function POST(request: Request) {
  const { prompt, currentCode, pageName, model, apiKey } = await request.json();

  if (!prompt || !currentCode) {
    return Response.json({ error: "prompt and currentCode required" }, { status: 400 });
  }

  const systemPrompt = buildEditSystemPrompt(currentCode, pageName || "page");
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Always use Gemini for /edit (Google key is hardcoded for testing)
        await streamLegacyGemini({ systemPrompt, prompt, controller, encoder });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
