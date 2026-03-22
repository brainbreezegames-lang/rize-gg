import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildStudioSystemPrompt, type StudioMode } from "@/lib/studio/prompts";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const OPENROUTER_BASE = "https://openrouter.ai/api/v1";
const AIMLAPI_KEY = process.env.AIMLAPI_KEY;
const AIMLAPI_BASE = "https://api.aimlapi.com/v1";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

type SupportedModel = "claude-opus-4.6" | "gemini-3.1-pro" | "chatgpt-5.4";

const OPENROUTER_MODEL_MAP: Record<SupportedModel, string> = {
  "claude-opus-4.6": "anthropic/claude-opus-4.6",
  "gemini-3.1-pro": "google/gemini-3.1-pro-preview",
  "chatgpt-5.4": "openai/gpt-5.4",
};

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
      "X-Title": "Rize.gg Studio",
    },
    body: JSON.stringify({
      model: upstreamModel,
      stream: true,
      temperature: 0.3,
      max_tokens: 8192,
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

async function streamGemini(options: {
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
    generationConfig: { temperature: 0.3, maxOutputTokens: 8192 },
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
      temperature: 0.3,
      [tokenField]: 8192,
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

export async function POST(request: Request) {
  const { currentCode, pageName, mode, model, apiKey, userPrompt } = await request.json();

  if (!currentCode) {
    return Response.json({ error: "currentCode required" }, { status: 400 });
  }

  const studioMode: StudioMode = mode || "full";
  const effectivePrompt = userPrompt
    ? `Improve this page (${studioMode} mode). User also requests: ${userPrompt}`
    : `Improve this page using the ${studioMode} audit. Apply every improvement you can find.`;

  const systemPrompt = buildStudioSystemPrompt(
    currentCode,
    pageName || "page",
    studioMode,
    userPrompt || undefined
  );

  const encoder = new TextEncoder();
  const requestOrigin = request.headers.get("origin") || "https://rize-gg.vercel.app";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const selectedModel: SupportedModel = model || "gemini-3.1-pro";

        if (apiKey) {
          // User-provided OpenRouter key
          await streamOpenRouter({
            apiKey,
            requestOrigin,
            upstreamModel: OPENROUTER_MODEL_MAP[selectedModel],
            systemPrompt,
            prompt: effectivePrompt,
            controller,
            encoder,
          });
        } else if (selectedModel === "gemini-3.1-pro") {
          await streamGemini({ systemPrompt, prompt: effectivePrompt, controller, encoder });
        } else if (selectedModel === "claude-opus-4.6" && AIMLAPI_KEY) {
          await streamLegacyChatCompletions({
            url: `${AIMLAPI_BASE}/chat/completions`,
            apiKey: AIMLAPI_KEY,
            providerLabel: "AIMLAPI/Claude",
            upstreamModel: "anthropic/claude-opus-4.6",
            tokenField: "max_tokens",
            systemPrompt,
            prompt: effectivePrompt,
            controller,
            encoder,
          });
        } else if (selectedModel === "chatgpt-5.4" && OPENAI_API_KEY) {
          await streamLegacyChatCompletions({
            url: "https://api.openai.com/v1/chat/completions",
            apiKey: OPENAI_API_KEY,
            providerLabel: "OpenAI",
            upstreamModel: "gpt-5.4",
            tokenField: "max_completion_tokens",
            systemPrompt,
            prompt: effectivePrompt,
            controller,
            encoder,
          });
        } else {
          // Fallback to Gemini
          await streamGemini({ systemPrompt, prompt: effectivePrompt, controller, encoder });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
      } finally {
        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
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
