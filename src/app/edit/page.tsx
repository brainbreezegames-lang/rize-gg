"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import { liveScope } from "@/lib/generate/scope";
import { MEDIA_LIBRARY } from "@/lib/media-library";
import { PAGE_SOURCES } from "@/lib/generate/page-sources";
import { EditContext } from "@/lib/edit-context";
import { Sparkles, Send, X, RotateCcw, Loader2, ChevronDown } from "lucide-react";

// Real page components (shown before any AI edit)
import HomePage from "@/app/home/page";
import RizeLFGPage from "@/app/rize-lfg/page";
import FederationsPage from "@/app/federations/page";
import TournamentsPage from "@/app/tournaments/page";
import ScrimsPage from "@/app/scrims/page";
import TeamFinderPage from "@/app/team-finder/page";
import ClubsPage from "@/app/clubs/page";
import PlayersPage from "@/app/players/page";
import LeaderboardPage from "@/app/leaderboard/page";
import ReferralsPage from "@/app/referrals/page";
import MissionsPage from "@/app/missions-and-rewards/page";
import MessagesPage from "@/app/messages/page";

// ─── Config ───────────────────────────────────────────────────────────────────

const PAGES = [
  { key: "home",                  label: "Home",               component: HomePage },
  { key: "messages",              label: "Messages",           component: MessagesPage },
  { key: "rize-lfg",              label: "Rize LFG",           component: RizeLFGPage },
  { key: "federations",           label: "Federations",        component: FederationsPage },
  { key: "tournaments",           label: "Tournaments",        component: TournamentsPage },
  { key: "scrims",                label: "Scrims",             component: ScrimsPage },
  { key: "team-finder",           label: "Team Finder",        component: TeamFinderPage },
  { key: "clubs",                 label: "Clubs",              component: ClubsPage },
  { key: "players",               label: "Players",            component: PlayersPage },
  { key: "leaderboard",           label: "Leaderboard",        component: LeaderboardPage },
  { key: "referrals",             label: "Referrals",          component: ReferralsPage },
  { key: "missions-and-rewards",  label: "Missions & Rewards", component: MissionsPage },
] as const;

type PageKey = (typeof PAGES)[number]["key"];
type Model = "claude-opus-4.6" | "gemini-3.1-pro" | "chatgpt-5.4";

const LS_OVERRIDE = (key: PageKey) => `rize-edit-${key}`;
const LS_MODEL = "rize-edit-model";
const LS_API_KEY = "rize-api-key";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadOverride(key: PageKey): string | null {
  try { return localStorage.getItem(LS_OVERRIDE(key)); } catch { return null; }
}
function saveOverride(key: PageKey, code: string) {
  try { localStorage.setItem(LS_OVERRIDE(key), code); } catch {}
}
function clearOverride(key: PageKey) {
  try { localStorage.removeItem(LS_OVERRIDE(key)); } catch {}
}

function stripFences(text: string): string {
  return text
    .replace(/^```(?:jsx?|tsx?|typescript|javascript)?\n?/gm, "")
    .replace(/^```\n?/gm, "")
    .trim();
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function EditPage() {
  const [activePage, setActivePage] = useState<PageKey>("home");
  const [overrides, setOverrides] = useState<Partial<Record<PageKey, string>>>({});
  const [model, setModel] = useState<Model>("claude-opus-4.6");
  const [apiKey, setApiKey] = useState("");

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingCode, setStreamingCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showModelPicker, setShowModelPicker] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewScope = useMemo(() => ({ ...liveScope, MEDIA_LIBRARY }), []);

  // Load from localStorage on mount
  useEffect(() => {
    const loaded: Partial<Record<PageKey, string>> = {};
    for (const page of PAGES) {
      const o = loadOverride(page.key);
      if (o) loaded[page.key] = o;
    }
    setOverrides(loaded);
    const savedModel = localStorage.getItem(LS_MODEL) as Model | null;
    if (savedModel) setModel(savedModel);
    const savedKey = localStorage.getItem(LS_API_KEY) || "";
    setApiKey(savedKey);
  }, []);

  const activeOverride = overrides[activePage] ?? null;
  const currentCode = activeOverride ?? PAGE_SOURCES[activePage] ?? "";
  const liveCode = activeOverride ? `${activeOverride}\nrender(<GeneratedPage />);` : null;
  const pageConfig = PAGES.find((p) => p.key === activePage)!;
  const PageComponent = pageConfig.component;

  // Navigation callback — sidebar items call this in edit mode
  const handleNavigate = useCallback((label: string) => {
    const page = PAGES.find((p) => p.label === label);
    if (page) setActivePage(page.key);
  }, []);

  const editContext = useMemo(() => ({ onNavigate: handleNavigate }), [handleNavigate]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isGenerating) return;
    const userPrompt = prompt.trim();
    setPrompt("");
    setIsGenerating(true);
    setError(null);
    setStreamingCode("");

    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userPrompt,
          currentCode,
          pageName: pageConfig.label,
          model,
          apiKey: apiKey || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;
          const data = trimmed.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) throw new Error(parsed.error);
            if (typeof parsed.text === "string") {
              accumulated += parsed.text;
              setStreamingCode(accumulated);
            }
          } catch (e) {
            if (e instanceof Error && e.message !== "Unexpected end of JSON input") throw e;
          }
        }
      }

      const clean = stripFences(accumulated);
      if (clean.length > 50) {
        setOverrides((prev) => ({ ...prev, [activePage]: clean }));
        saveOverride(activePage, clean);
      } else {
        throw new Error("Generated output was too short — try rephrasing.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(false);
      setStreamingCode("");
    }
  }, [prompt, isGenerating, currentCode, pageConfig.label, model, apiKey, activePage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleReset = () => {
    clearOverride(activePage);
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[activePage];
      return next;
    });
  };

  const handleModelChange = (m: Model) => {
    setModel(m);
    localStorage.setItem(LS_MODEL, m);
    setShowModelPicker(false);
  };

  const statusText = isGenerating
    ? streamingCode.length > 800
      ? "Finalizing the edit..."
      : streamingCode.length > 300
        ? "Applying changes..."
        : "Analyzing your request..."
    : error
      ? error
      : activeOverride
        ? "Page edited. Prompt again to keep iterating."
        : "Describe an edit to apply with AI.";

  return (
    <EditContext.Provider value={editContext}>
      <div className="flex h-screen bg-bg-primary text-text-primary overflow-hidden relative">

        {/* Page content — full page component with sidebar inside */}
        <div className="flex-1 overflow-hidden relative">
          {liveCode ? (
            <LiveProvider key={`${activePage}-${activeOverride?.length}`} code={liveCode} scope={previewScope} noInline>
              <div className="w-full h-full overflow-auto">
                <LivePreview />
              </div>
              <LiveError className="absolute bottom-0 left-0 right-0 bg-red-950/90 text-red-300 text-xs p-3 font-mono max-h-32 overflow-auto z-50" />
            </LiveProvider>
          ) : (
            <div className="w-full h-full overflow-auto">
              <PageComponent />
            </div>
          )}

          {/* Generating overlay */}
          {isGenerating && (
            <div className="absolute inset-0 bg-bg-primary/60 backdrop-blur-sm flex items-center justify-center pointer-events-none z-40">
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={28} className="text-text-accent animate-spin" />
                <p className="text-sm text-text-secondary">{statusText}</p>
              </div>
            </div>
          )}

          {/* Click-outside to close model picker */}
          {showModelPicker && (
            <div className="fixed inset-0 z-40" onClick={() => setShowModelPicker(false)} />
          )}

          {/* Floating chat bubble */}
          {!chatOpen && (
            <button
              onClick={() => { setChatOpen(true); setTimeout(() => textareaRef.current?.focus(), 50); }}
              className="fixed bottom-6 right-6 z-50 size-12 rounded-full bg-accent flex items-center justify-center shadow-[0_8px_32px_rgba(153,249,234,0.3)] hover:bg-accent-hover transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Sparkles size={18} className="text-accent-foreground" />
            </button>
          )}

          {/* Chat panel */}
          {chatOpen && (
            <div className="fixed bottom-6 right-6 z-50 w-[380px] rounded-[var(--radius-xl)] border border-border-default bg-bg-elevated shadow-[0_24px_64px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
              {/* Chat header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-[var(--radius-sm)] bg-accent/15 flex items-center justify-center">
                    <Sparkles size={12} className="text-text-accent" />
                  </div>
                  <span className="text-xs font-semibold text-text-primary">
                    Editing: {pageConfig.label}
                  </span>
                  {activeOverride && (
                    <span className="size-1.5 rounded-full bg-accent shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {activeOverride && (
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-1 text-[10px] text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"
                    >
                      <RotateCcw size={10} />
                      Reset
                    </button>
                  )}
                  {/* Model picker */}
                  <div className="relative">
                    <button
                      onClick={() => setShowModelPicker(!showModelPicker)}
                      className="flex items-center gap-1 text-[10px] font-medium text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer border border-border-default rounded-[var(--radius-sm)] px-2 py-1"
                    >
                      {model === "claude-opus-4.6" ? "Claude" : model === "gemini-3.1-pro" ? "Gemini" : "ChatGPT"}
                      <ChevronDown size={10} />
                    </button>
                    {showModelPicker && (
                      <div className="absolute right-0 top-full mt-1 z-50 w-44 rounded-[var(--radius-md)] border border-border-default bg-bg-elevated shadow-xl">
                        {(["claude-opus-4.6", "gemini-3.1-pro", "chatgpt-5.4"] as Model[]).map((m) => (
                          <button
                            key={m}
                            onClick={() => handleModelChange(m)}
                            className={`w-full text-left px-3 py-2.5 text-xs transition-colors cursor-pointer first:rounded-t-[var(--radius-md)] last:rounded-b-[var(--radius-md)] ${
                              model === m ? "text-text-accent bg-accent-subtle" : "text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary"
                            }`}
                          >
                            {m === "claude-opus-4.6" ? "Claude Opus 4.6" : m === "gemini-3.1-pro" ? "Gemini 3.1 Pro" : "ChatGPT 5.4"}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setChatOpen(false)}
                    className="text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="px-4 py-3 border-b border-border-subtle bg-bg-surface/40">
                <p className={`text-xs leading-relaxed ${error ? "text-red-400" : "text-text-secondary"}`}>
                  {statusText}
                </p>
              </div>

              {/* API key */}
              {!apiKey && (
                <div className="px-4 py-2 border-b border-border-subtle">
                  <p className="text-[10px] text-text-tertiary mb-1">OpenRouter API key (optional)</p>
                  <input
                    type="password"
                    placeholder="sk-or-..."
                    className="w-full bg-bg-input border border-border-default rounded-[var(--radius-sm)] px-2.5 py-1.5 text-xs text-text-primary outline-none placeholder:text-text-tertiary focus:border-border-accent"
                    onChange={(e) => {
                      const val = e.target.value;
                      setApiKey(val);
                      localStorage.setItem(LS_API_KEY, val);
                    }}
                  />
                </div>
              )}

              {/* Prompt input */}
              <div className="p-3 flex flex-col gap-2">
                <textarea
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`What would you like to change on the ${pageConfig.label} page?`}
                  rows={3}
                  disabled={isGenerating}
                  className="w-full resize-none rounded-[var(--radius-md)] border border-border-default bg-bg-input px-3 py-2.5 text-sm leading-relaxed text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-border-accent disabled:opacity-50"
                />

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {apiKey && (
                      <button
                        onClick={() => {
                          setApiKey("");
                          localStorage.removeItem(LS_API_KEY);
                        }}
                        className="text-[10px] text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"
                      >
                        Clear key
                      </button>
                    )}
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                  >
                    {isGenerating ? (
                      <><Loader2 size={12} className="animate-spin" /> Editing...</>
                    ) : (
                      <><Send size={12} /> Apply edit</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </EditContext.Provider>
  );
}
