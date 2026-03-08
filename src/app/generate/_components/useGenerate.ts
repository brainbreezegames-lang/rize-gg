"use client";

import { useState, useCallback } from "react";
import { extractCodeFromResponse } from "@/lib/generate/parse-response";
import { normalizeCode } from "@/lib/generate/normalize";
import { validateGeneratedCode, type Violation } from "@/lib/generate/validate";

export function useGenerate() {
  const [code, setCode] = useState("");
  const [streamingCode, setStreamingCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [violations, setViolations] = useState<Violation[]>([]);

  const generate = useCallback(async (prompt: string, model: string, skills?: string[], referenceImage?: { base64: string; mimeType: string } | null, apiKey?: string) => {
    setIsGenerating(true);
    setError(null);
    setStreamingCode("");
    setCode("");
    setViolations([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model, skills, referenceImage, apiKey }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.error) throw new Error(parsed.error);
            accumulated += parsed.text;
            setStreamingCode(accumulated);
          } catch (e) {
            if (e instanceof SyntaxError) continue;
            throw e;
          }
        }
      }

      const finalCode = normalizeCode(extractCodeFromResponse(accumulated));
      setCode(finalCode);
      setViolations(validateGeneratedCode(finalCode));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { code, streamingCode, isGenerating, error, violations, generate, setCode };
}
