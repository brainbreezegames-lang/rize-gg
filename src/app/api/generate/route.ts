import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildSystemPrompt } from "@/lib/generate/system-prompt";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE = "https://openrouter.ai/api/v1";
const AIMLAPI_KEY = process.env.AIMLAPI_KEY;
const AIMLAPI_BASE = "https://api.aimlapi.com/v1";
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

type SupportedModel = "claude-opus-4.6" | "gemini-3.1-pro" | "chatgpt-5.4";

type ReferenceImage = {
  base64: string;
  mimeType: string;
};

const OPENROUTER_MODEL_MAP: Record<SupportedModel, string> = {
  "claude-opus-4.6": "anthropic/claude-opus-4.6",
  "gemini-3.1-pro": "google/gemini-3.1-pro-preview",
  "chatgpt-5.4": "openai/gpt-5.4",
};

function buildVisionPromptContent(prompt: string, referenceImage?: ReferenceImage) {
  const userContent: Array<
    | { type: "image_url"; image_url: { url: string } }
    | { type: "text"; text: string }
  > = [];

  if (referenceImage) {
    userContent.push({
      type: "image_url",
      image_url: {
        url: `data:${referenceImage.mimeType};base64,${referenceImage.base64}`,
      },
    });
    userContent.push({
      type: "text",
      text: "Use the above image as a visual reference for the design style, layout, and aesthetic inspiration.\n\n",
    });
  }

  userContent.push({ type: "text", text: prompt });
  return userContent;
}

async function streamOpenRouter(options: {
  apiKey: string;
  requestOrigin: string;
  upstreamModel: string;
  systemPrompt: string;
  prompt: string;
  referenceImage?: ReferenceImage;
  controller: ReadableStreamDefaultController<Uint8Array>;
  encoder: TextEncoder;
}) {
  const {
    apiKey,
    requestOrigin,
    upstreamModel,
    systemPrompt,
    prompt,
    referenceImage,
    controller,
    encoder,
  } = options;

  console.log(`[generate] Using openrouter → ${upstreamModel}`);

  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": requestOrigin,
      "X-Title": "Rize.gg",
    },
    body: JSON.stringify({
      model: upstreamModel,
      stream: true,
      temperature: 0.7,
      max_tokens: 16384,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: buildVisionPromptContent(prompt, referenceImage) },
      ],
    }),
  });

  console.log(`[generate] OpenRouter response status: ${res.status}`);

  if (!res.ok) {
    const errText = await res.text();
    console.error(`[generate] OpenRouter error: ${errText.slice(0, 500)}`);
    throw new Error(`openrouter ${res.status}: ${errText.slice(0, 200)}`);
  }

  const reader = res.body?.getReader();
  if (!reader) {
    throw new Error("No response stream from OpenRouter");
  }

  const decoder = new TextDecoder();
  let buffer = "";
  let firstChunkLogged = false;

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
      if (data === "[DONE]") {
        return;
      }

      try {
        const parsed = JSON.parse(data);
        if (!firstChunkLogged) {
          console.log(
            `[generate] First chunk model (openrouter): ${parsed.model || "unknown"}`
          );
          firstChunkLogged = true;
        }

        const text = parsed.choices?.[0]?.delta?.content;
        if (typeof text === "string" && text) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
        }
      } catch {
        continue;
      }
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
  referenceImage?: ReferenceImage;
  controller: ReadableStreamDefaultController<Uint8Array>;
  encoder: TextEncoder;
}) {
  const {
    url,
    apiKey,
    providerLabel,
    upstreamModel,
    tokenField,
    systemPrompt,
    prompt,
    referenceImage,
    controller,
    encoder,
  } = options;

  console.log(`[generate] Using ${providerLabel} → ${upstreamModel}`);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: upstreamModel,
      stream: true,
      temperature: 0.7,
      [tokenField]: 16384,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: buildVisionPromptContent(prompt, referenceImage) },
      ],
    }),
  });

  console.log(`[generate] ${providerLabel} response status: ${res.status}`);

  if (!res.ok) {
    const errText = await res.text();
    console.error(`[generate] ${providerLabel} error: ${errText.slice(0, 500)}`);
    throw new Error(`${providerLabel} ${res.status}: ${errText.slice(0, 200)}`);
  }

  const reader = res.body?.getReader();
  if (!reader) {
    throw new Error(`No response stream from ${providerLabel}`);
  }

  const decoder = new TextDecoder();
  let buffer = "";
  let firstChunkLogged = false;

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
      if (data === "[DONE]") {
        return;
      }

      try {
        const parsed = JSON.parse(data);
        if (!firstChunkLogged) {
          console.log(
            `[generate] First chunk model (${providerLabel}): ${parsed.model || "unknown"}`
          );
          firstChunkLogged = true;
        }

        const text = parsed.choices?.[0]?.delta?.content;
        if (typeof text === "string" && text) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
        }
      } catch {
        continue;
      }
    }
  }
}

async function streamLegacyGemini(options: {
  systemPrompt: string;
  prompt: string;
  referenceImage?: ReferenceImage;
  controller: ReadableStreamDefaultController<Uint8Array>;
  encoder: TextEncoder;
}) {
  const { systemPrompt, prompt, referenceImage, controller, encoder } = options;

  if (!GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-3.1-pro-preview",
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 16384,
    },
  });

  const parts: Array<
    | { text: string }
    | { inlineData: { data: string; mimeType: string } }
  > = [];

  if (referenceImage) {
    parts.push({
      inlineData: {
        data: referenceImage.base64,
        mimeType: referenceImage.mimeType,
      },
    });
    parts.push({
      text: "Use the above image as a visual reference for the design style, layout, and aesthetic inspiration.\n\n",
    });
  }

  parts.push({ text: prompt });

  console.log("[generate] Using google → gemini-3.1-pro-preview");

  const result = await model.generateContentStream({
    contents: [{ role: "user", parts }],
  });

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
    }
  }
}

export async function POST(request: Request) {
  const { prompt, model, skills, referenceImage, apiKey } = await request.json();

  if (!prompt) {
    return Response.json({ error: "Prompt required" }, { status: 400 });
  }

  const selectedModel: SupportedModel = model || "claude-opus-4.6";
  const activeSkills: string[] = skills || [];
  const systemPrompt = buildSystemPrompt(activeSkills);
  const encoder = new TextEncoder();
  const requestOrigin = new URL(request.url).origin;

  // Client-provided key takes priority, then env var
  const openRouterKey = apiKey || OPENROUTER_API_KEY;

  const stream = new ReadableStream({
    async start(controller) {
      try {
        if (openRouterKey) {
          await streamOpenRouter({
            apiKey: openRouterKey,
            requestOrigin,
            upstreamModel: OPENROUTER_MODEL_MAP[selectedModel],
            systemPrompt,
            prompt,
            referenceImage,
            controller,
            encoder,
          });
        } else if (selectedModel === "gemini-3.1-pro") {
          await streamLegacyGemini({
            systemPrompt,
            prompt,
            referenceImage,
            controller,
            encoder,
          });
        } else if (selectedModel === "chatgpt-5.4") {
          if (!OPENAI_API_KEY) {
            throw new Error("OPENROUTER_API_KEY is not configured");
          }

          await streamLegacyChatCompletions({
            url: "https://api.openai.com/v1/chat/completions",
            apiKey: OPENAI_API_KEY,
            providerLabel: "openai",
            upstreamModel: "gpt-5.4",
            tokenField: "max_completion_tokens",
            systemPrompt,
            prompt,
            referenceImage,
            controller,
            encoder,
          });
        } else {
          if (!AIMLAPI_KEY) {
            throw new Error("OPENROUTER_API_KEY is not configured");
          }

          await streamLegacyChatCompletions({
            url: `${AIMLAPI_BASE}/chat/completions`,
            apiKey: AIMLAPI_KEY,
            providerLabel: "aimlapi",
            upstreamModel: "anthropic/claude-opus-4-6",
            tokenField: "max_tokens",
            systemPrompt,
            prompt,
            referenceImage,
            controller,
            encoder,
          });
        }

        console.log("[generate] Stream complete");
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        console.error("[generate] ERROR:", err);
        const message = err instanceof Error ? err.message : "Generation failed";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
