import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildSystemPrompt } from "@/lib/generate/system-prompt";

export async function POST(request: Request) {
  const { prompt, apiKey, skills } = await request.json();

  if (!apiKey) {
    return Response.json({ error: "API key required" }, { status: 400 });
  }

  if (!prompt) {
    return Response.json({ error: "Prompt required" }, { status: 400 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-3.1-pro-preview",
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 16384,
    },
  });

  const activeSkills: string[] = skills || [];
  const systemPrompt = buildSystemPrompt(activeSkills);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await model.generateContentStream({
          systemInstruction: systemPrompt,
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Generation failed";
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
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
