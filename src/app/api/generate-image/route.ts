const OPENROUTER_BASE = "https://openrouter.ai/api/v1";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

function buildImagePrompt(prompt: string): string {
  return `Generate an image of a high-fidelity UI design showing: ${prompt}. Modern, clean, polished interface. The content fills the entire image from edge to edge. Desktop widescreen layout, 16:9 aspect ratio. Dark theme with mint/teal accent colors.`;
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
        modalities: ["image", "text"],
        stream: false,
        image_config: {
          aspect_ratio: "16:9",
          image_size: "2K",
        },
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
    const message = data.choices?.[0]?.message;

    console.log("[generate-image] Response received");
    console.log("[generate-image] Message keys:", message ? Object.keys(message) : "no message");

    // OpenRouter returns images in message.images array
    const images = message?.images;
    let imageDataUri: string | null = null;

    if (images && Array.isArray(images) && images.length > 0) {
      for (const img of images) {
        if (img.type === "image_url" && img.image_url?.url) {
          imageDataUri = img.image_url.url;
          break;
        }
      }
    }

    if (!imageDataUri) {
      // Fallback: check content array
      const content = message?.content;
      if (Array.isArray(content)) {
        for (const item of content) {
          if (item.type === "image_url" && item.image_url?.url) {
            imageDataUri = item.image_url.url;
            break;
          }
        }
      }
    }

    if (!imageDataUri) {
      const msgStr = message ? JSON.stringify(message).slice(0, 500) : "null";
      console.error("[generate-image] No image found. Message:", msgStr);
      return Response.json(
        { error: "No image in response. The model may not have generated an image." },
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
