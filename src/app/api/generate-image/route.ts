const OPENROUTER_BASE = "https://openrouter.ai/api/v1";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

function buildImagePrompt(prompt: string): string {
  return `A high-fidelity UI design showing: ${prompt}. Modern, clean, polished interface. The content fills the entire image from edge to edge. Desktop widescreen layout, 16:9 aspect ratio. Dark theme with mint/teal accent colors.`;
}

export async function POST(request: Request) {
  const { prompt, apiKey } = await request.json();

  if (!prompt) {
    return Response.json({ error: "Prompt required" }, { status: 400 });
  }

  const key = apiKey || OPENROUTER_API_KEY;
  if (!key) {
    return Response.json(
      { error: "OpenRouter API key required. Add your key in the API Key field." },
      { status: 400 }
    );
  }

  const requestOrigin = new URL(request.url).origin;
  const imagePrompt = buildImagePrompt(prompt);

  try {
    console.log("[generate-image] Calling OpenRouter gemini-3.1-flash-image-preview");

    const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": requestOrigin,
        "X-Title": "Rize.gg",
      },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-image-preview",
        messages: [
          {
            role: "user",
            content: imagePrompt,
          },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[generate-image] OpenRouter error: ${errText.slice(0, 500)}`);
      return Response.json(
        { error: `Image generation failed: ${errText.slice(0, 200)}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("[generate-image] Response received, extracting image");

    // OpenRouter returns the image as a base64 data URL in the content
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return Response.json(
        { error: "No content in response" },
        { status: 500 }
      );
    }

    // Check if the response contains inline image data (multimodal response)
    const parts = data.choices?.[0]?.message?.parts;
    let imageDataUri: string | null = null;

    // OpenRouter may return image as base64 in different formats
    // Format 1: parts array with inlineData
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          imageDataUri = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    // Format 2: content is an array with image_url type
    if (!imageDataUri && Array.isArray(content)) {
      for (const item of content) {
        if (item.type === "image_url" && item.image_url?.url) {
          imageDataUri = item.image_url.url;
          break;
        }
      }
    }

    // Format 3: content contains markdown image with base64
    if (!imageDataUri && typeof content === "string") {
      // Check for markdown image: ![...](data:image/...)
      const mdMatch = content.match(/!\[.*?\]\((data:image\/[^)]+)\)/);
      if (mdMatch) {
        imageDataUri = mdMatch[1];
      }

      // Check for raw base64 data URI
      if (!imageDataUri && content.startsWith("data:image/")) {
        imageDataUri = content;
      }

      // Check for inline base64 without data: prefix
      if (!imageDataUri) {
        const b64Match = content.match(/base64,([A-Za-z0-9+/=\n]+)/);
        if (b64Match) {
          imageDataUri = `data:image/png;base64,${b64Match[1].replace(/\n/g, "")}`;
        }
      }
    }

    if (!imageDataUri) {
      console.error("[generate-image] Could not extract image. Content type:", typeof content);
      console.error("[generate-image] Content preview:", typeof content === "string" ? content.slice(0, 200) : JSON.stringify(content).slice(0, 200));
      return Response.json(
        { error: "Could not extract image from response. The model may not have generated an image." },
        { status: 500 }
      );
    }

    // Build minimal HTML wrapper for preview
    const html = `<div class="img-screen"><img src="${imageDataUri}" /></div>`;
    const css = `.img-screen{margin:0;padding:0;width:100%;height:100vh;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#0B1211}.img-screen img{width:100%;height:100%;display:block;object-fit:cover}`;

    return Response.json({
      imageDataUri,
      webDesign: { html, css },
    });
  } catch (err) {
    console.error("[generate-image] ERROR:", err);
    const message = err instanceof Error ? err.message : "Image generation failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
