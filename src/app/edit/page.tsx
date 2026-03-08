"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import { liveScope } from "@/lib/generate/scope";
import { MEDIA_LIBRARY } from "@/lib/media-library";
import { PAGE_SOURCES } from "@/lib/generate/page-sources";
import { EditContext } from "@/lib/edit-context";
import { normalizeCode } from "@/lib/generate/normalize";
import { STUDIO_MODES, type StudioMode } from "@/lib/studio/prompts";
import {
  Sparkles, Send, X, RotateCcw, Loader2, ChevronDown, ChevronUp,
  Wand2, LayoutGrid, Layers, Eye, AlignLeft,
  Zap,
} from "lucide-react";

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

// Icon map for studio modes (skip "full" — it gets the hero button)
const STUDIO_ICONS: Record<string, React.ReactNode> = {
  Wand2:      <Wand2 size={13} />,
  LayoutGrid: <LayoutGrid size={13} />,
  Layers:     <Layers size={13} />,
  Sparkles:   <Sparkles size={13} />,
  Eye:        <Eye size={13} />,
  AlignLeft:  <AlignLeft size={13} />,
};

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

async function consumeStream(
  res: Response,
  onChunk: (accumulated: string) => void
): Promise<string> {
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
          onChunk(accumulated);
        }
      } catch (e) {
        if (e instanceof Error && e.message !== "Unexpected end of JSON input") throw e;
      }
    }
  }
  return accumulated;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function EditPage() {
  const [activePage, setActivePage] = useState<PageKey>("home");
  const [overrides, setOverrides] = useState<Partial<Record<PageKey, string>>>({});
  const [model, setModel] = useState<Model>("claude-opus-4.6");
  const [apiKey, setApiKey] = useState("");

  // Panel state
  const [chatOpen, setChatOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingCode, setStreamingCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [activeStudioMode, setActiveStudioMode] = useState<StudioMode | null>(null);
  const [showMoreRules, setShowMoreRules] = useState(false);

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

  const handleNavigate = useCallback((label: string) => {
    const page = PAGES.find((p) => p.label === label);
    if (page) setActivePage(page.key);
  }, []);

  const editContext = useMemo(() => ({ onNavigate: handleNavigate }), [handleNavigate]);

  // ─── Apply result ──────────────────────────────────────────────────────────

  const applyResult = useCallback((accumulated: string) => {
    const clean = normalizeCode(stripFences(accumulated));
    if (clean.length > 50) {
      setOverrides((prev) => ({ ...prev, [activePage]: clean }));
      saveOverride(activePage, clean);
    } else {
      throw new Error("Output was too short — try again.");
    }
  }, [activePage]);

  // ─── Custom edit ───────────────────────────────────────────────────────────

  const handleEdit = useCallback(async () => {
    if (!prompt.trim() || isGenerating) return;
    const userPrompt = prompt.trim();
    setPrompt("");
    setIsGenerating(true);
    setError(null);
    setStreamingCode("");
    setActiveStudioMode(null);

    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userPrompt, currentCode,
          pageName: pageConfig.label, model,
          apiKey: apiKey || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const accumulated = await consumeStream(res, setStreamingCode);
      applyResult(accumulated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
      setStreamingCode("");
    }
  }, [prompt, isGenerating, currentCode, pageConfig.label, model, apiKey, applyResult]);

  // ─── Studio improve ─────────────────────────────────────────────────────────

  const handleStudioImprove = useCallback(async (mode: StudioMode, userPrompt?: string) => {
    if (isGenerating) return;
    setIsGenerating(true);
    setError(null);
    setStreamingCode("");
    setActiveStudioMode(mode);

    try {
      const res = await fetch("/api/studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentCode, pageName: pageConfig.label,
          mode, model,
          apiKey: apiKey || undefined,
          userPrompt: userPrompt || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const accumulated = await consumeStream(res, setStreamingCode);
      applyResult(accumulated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
      setStreamingCode("");
      setActiveStudioMode(null);
    }
  }, [isGenerating, currentCode, pageConfig.label, model, apiKey, applyResult]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim()) handleEdit();
    }
  };

  const handleReset = () => {
    clearOverride(activePage);
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[activePage];
      return next;
    });
    setError(null);
  };

  const handleModelChange = (m: Model) => {
    setModel(m);
    localStorage.setItem(LS_MODEL, m);
    setShowModelPicker(false);
  };

  // ─── Progress text (conversational, encouraging) ────────────────────────────

  const studioModeLabel = activeStudioMode
    ? STUDIO_MODES.find((m) => m.key === activeStudioMode)?.label
    : null;

  const progressPercent = streamingCode.length;
  const progressText = isGenerating
    ? activeStudioMode
      ? progressPercent > 1200
        ? "Almost done — putting final touches on..."
        : progressPercent > 600
          ? `Rebuilding the ${pageConfig.label} page...`
          : progressPercent > 200
            ? `Applying ${studioModeLabel} rules...`
            : `Scanning ${pageConfig.label} for improvements...`
      : progressPercent > 800
        ? "Wrapping up your changes..."
        : progressPercent > 300
          ? "Writing the new code..."
          : "Working on it..."
    : null;

  // Specific modes (exclude "full" — that's the hero button)
  const specificModes = STUDIO_MODES.filter((m) => m.key !== "full");
  const visibleModes = showMoreRules ? specificModes : specificModes.slice(0, 3);

  return (
    <EditContext.Provider value={editContext}>
      <div className="flex h-screen bg-bg-primary text-text-primary overflow-hidden relative">
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
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="size-12 rounded-full border-2 border-accent/20 flex items-center justify-center">
                    <Loader2 size={24} className="text-text-accent animate-spin" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-text-primary">{progressText}</p>
                  <p className="text-xs text-text-tertiary mt-1">This usually takes 10-20 seconds</p>
                </div>
              </div>
            </div>
          )}

          {showModelPicker && (
            <div className="fixed inset-0 z-40" onClick={() => setShowModelPicker(false)} />
          )}

          {/* ─── Floating bubble ──────────────────────────────────────────── */}
          {!chatOpen && (
            <button
              onClick={() => setChatOpen(true)}
              className="fixed bottom-6 right-6 z-50 size-14 rounded-full bg-accent flex items-center justify-center shadow-[0_8px_32px_rgba(153,249,234,0.3)] hover:bg-accent-hover transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Wand2 size={20} className="text-accent-foreground" />
            </button>
          )}

          {/* ─── Panel (single unified view) ──────────────────────────────── */}
          {chatOpen && (
            <div className="fixed bottom-6 right-6 z-50 w-[380px] rounded-[var(--radius-xl)] border border-border-default bg-bg-elevated shadow-[0_24px_64px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden max-h-[calc(100vh-48px)]">

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-default shrink-0">
                <div className="flex items-center gap-2">
                  <div className="size-5 rounded-[var(--radius-sm)] bg-accent/15 flex items-center justify-center">
                    <Wand2 size={10} className="text-text-accent" />
                  </div>
                  <span className="text-xs font-semibold text-text-primary">
                    {pageConfig.label}
                  </span>
                  {activeOverride && (
                    <span className="text-[10px] text-text-accent font-medium">edited</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {activeOverride && (
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-1 text-[10px] text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer px-1.5 py-0.5 rounded-[var(--radius-sm)] hover:bg-bg-surface-hover"
                    >
                      <RotateCcw size={9} />
                      Undo all
                    </button>
                  )}
                  <div className="relative">
                    <button
                      onClick={() => setShowModelPicker(!showModelPicker)}
                      className="text-[10px] font-medium text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer border border-border-subtle rounded-[var(--radius-sm)] px-1.5 py-0.5"
                    >
                      {model === "claude-opus-4.6" ? "Claude" : model === "gemini-3.1-pro" ? "Gemini" : "GPT"}
                    </button>
                    {showModelPicker && (
                      <div className="absolute right-0 top-full mt-1 z-50 w-40 rounded-[var(--radius-md)] border border-border-default bg-bg-elevated shadow-xl">
                        {(["claude-opus-4.6", "gemini-3.1-pro", "chatgpt-5.4"] as Model[]).map((m) => (
                          <button
                            key={m}
                            onClick={() => handleModelChange(m)}
                            className={`w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer first:rounded-t-[var(--radius-md)] last:rounded-b-[var(--radius-md)] ${
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
                    className="text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer p-0.5"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-3 flex flex-col gap-3 overflow-y-auto">

                {/* Error */}
                {error && (
                  <div className="px-3 py-2 rounded-[var(--radius-md)] bg-red-950/30 border border-red-900/30">
                    <p className="text-xs text-red-400">{error}</p>
                  </div>
                )}

                {/* Hero CTA — Improve This Page */}
                {!isGenerating && (
                  <button
                    onClick={() => handleStudioImprove("full", prompt.trim() || undefined)}
                    disabled={isGenerating}
                    className="group w-full flex items-center gap-3 p-3.5 rounded-[var(--radius-lg)] bg-gradient-to-r from-accent/12 to-accent/4 border border-accent/20 hover:border-accent/40 hover:from-accent/18 hover:to-accent/8 transition-all cursor-pointer active:scale-[0.98]"
                  >
                    <div className="size-9 rounded-[var(--radius-md)] bg-accent/20 flex items-center justify-center shrink-0 group-hover:bg-accent/30 transition-colors">
                      <Wand2 size={16} className="text-text-accent" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-[13px] font-semibold text-text-primary">Improve this page</p>
                      <p className="text-[11px] text-text-secondary mt-0.5">
                        Redesign layout, fix hierarchy, add polish
                      </p>
                    </div>
                    <Zap size={13} className="text-accent/40 group-hover:text-text-accent transition-colors shrink-0" />
                  </button>
                )}

                {/* Loading state (replaces hero CTA) */}
                {isGenerating && (
                  <div className="flex items-center gap-3 p-3.5 rounded-[var(--radius-lg)] bg-accent-subtle border border-accent/10">
                    <Loader2 size={16} className="text-text-accent animate-spin shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-text-primary">{progressText}</p>
                      <p className="text-[10px] text-text-tertiary mt-0.5">~15 seconds</p>
                    </div>
                  </div>
                )}

                {/* Specific rules — inline pills */}
                {!isGenerating && (
                  <div>
                    <p className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider mb-2 px-0.5">
                      Or focus on one area
                    </p>
                    <div className="flex flex-col gap-1">
                      {visibleModes.map((mode) => (
                        <button
                          key={mode.key}
                          onClick={() => handleStudioImprove(mode.key, prompt.trim() || undefined)}
                          disabled={isGenerating}
                          className="group w-full flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-md)] hover:bg-bg-surface-hover transition-all cursor-pointer text-left"
                        >
                          <span className="text-text-tertiary group-hover:text-text-accent transition-colors shrink-0">
                            {STUDIO_ICONS[mode.icon]}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-text-primary">{mode.label}</p>
                            <p className="text-[10px] text-text-tertiary leading-snug truncate">{mode.subtitle}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    {specificModes.length > 3 && (
                      <button
                        onClick={() => setShowMoreRules(!showMoreRules)}
                        className="flex items-center gap-1 text-[10px] text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer mt-1 px-3"
                      >
                        {showMoreRules ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                        {showMoreRules ? "Show less" : `${specificModes.length - 3} more`}
                      </button>
                    )}
                  </div>
                )}

                {/* Divider */}
                {!isGenerating && (
                  <div className="border-t border-border-subtle" />
                )}

                {/* Prompt input — always visible */}
                {!isGenerating && (
                  <div>
                    <div className="relative">
                      <textarea
                        ref={textareaRef}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Describe a specific change..."
                        rows={2}
                        disabled={isGenerating}
                        className="w-full resize-none rounded-[var(--radius-md)] border border-border-default bg-bg-input pl-3 pr-10 py-2.5 text-xs leading-relaxed text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-border-accent disabled:opacity-50"
                      />
                      <button
                        onClick={handleEdit}
                        disabled={isGenerating || !prompt.trim()}
                        className="absolute right-2 bottom-2 size-6 rounded-[var(--radius-sm)] bg-accent flex items-center justify-center transition-all hover:bg-accent-hover disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <Send size={11} className="text-accent-foreground" />
                      </button>
                    </div>
                    <p className="text-[10px] text-text-tertiary mt-1.5 px-0.5">
                      Press Enter to send, or click a button above
                    </p>
                  </div>
                )}

                {/* API key (collapsed) */}
                {!isGenerating && !apiKey && (
                  <details className="group">
                    <summary className="text-[10px] text-text-tertiary hover:text-text-secondary cursor-pointer list-none flex items-center gap-1">
                      <ChevronDown size={10} className="group-open:rotate-180 transition-transform" />
                      Add API key (optional)
                    </summary>
                    <input
                      type="password"
                      placeholder="sk-or-..."
                      className="mt-2 w-full bg-bg-input border border-border-default rounded-[var(--radius-sm)] px-2.5 py-1.5 text-xs text-text-primary outline-none placeholder:text-text-tertiary focus:border-border-accent"
                      onChange={(e) => {
                        const val = e.target.value;
                        setApiKey(val);
                        localStorage.setItem(LS_API_KEY, val);
                      }}
                    />
                  </details>
                )}
                {!isGenerating && apiKey && (
                  <button
                    onClick={() => { setApiKey(""); localStorage.removeItem(LS_API_KEY); }}
                    className="text-[10px] text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"
                  >
                    Remove API key
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </EditContext.Provider>
  );
}
