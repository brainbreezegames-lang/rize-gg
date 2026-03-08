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
  Wand2, LayoutGrid, Layers, Eye, AlignLeft, Brain, PenLine,
  Zap, Check,
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

const STUDIO_ICONS: Record<string, React.ReactNode> = {
  Wand2:      <Wand2 size={14} />,
  LayoutGrid: <LayoutGrid size={14} />,
  Layers:     <Layers size={14} />,
  Sparkles:   <Sparkles size={14} />,
  Eye:        <Eye size={14} />,
  AlignLeft:  <AlignLeft size={14} />,
  Brain:      <Brain size={14} />,
  PenLine:    <PenLine size={14} />,
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
  const [model, setModel] = useState<Model>("gemini-3.1-pro");
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
  const modelPickerRef = useRef<HTMLDivElement>(null);
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

  // Close model picker on outside click or Escape
  useEffect(() => {
    if (!showModelPicker) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModelPicker(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [showModelPicker]);

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
      throw new Error("The output was too short. Try again or use a different model.");
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
      setChatOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
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
      setChatOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
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

  // ─── Progress text ────────────────────────────────────────────────────────

  const studioModeLabel = activeStudioMode
    ? STUDIO_MODES.find((m) => m.key === activeStudioMode)?.label
    : null;

  const progressLen = streamingCode.length;
  const progressText = isGenerating
    ? activeStudioMode
      ? progressLen > 1200
        ? "Finishing up — almost there..."
        : progressLen > 600
          ? `Refining ${pageConfig.label}...`
          : progressLen > 200
            ? `Applying ${studioModeLabel} rules...`
            : `Analyzing ${pageConfig.label}...`
      : progressLen > 800
        ? "Finishing up — almost there..."
        : progressLen > 300
          ? "Applying your changes..."
          : "Reading the page..."
    : null;

  // Specific modes (exclude "full" — that's the hero button)
  const specificModes = STUDIO_MODES.filter((m) => m.key !== "full");
  const visibleModes = showMoreRules ? specificModes : specificModes.slice(0, 3);
  const hiddenCount = specificModes.length - 3;

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
            <div
              className="absolute inset-0 bg-bg-primary/60 backdrop-blur-sm flex items-center justify-center pointer-events-none z-40"
              role="status"
              aria-live="polite"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="size-12 rounded-full border-2 border-accent/20 flex items-center justify-center">
                  <Loader2 size={24} className="text-text-accent animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-text-primary">{progressText}</p>
                  <p className="text-xs text-text-tertiary mt-1">This usually takes 15–20 seconds</p>
                </div>
              </div>
            </div>
          )}

          {/* Backdrop for model picker */}
          {showModelPicker && (
            <div className="fixed inset-0 z-40" onClick={() => setShowModelPicker(false)} />
          )}

          {/* ─── Floating trigger ──────────────────────────────────────────── */}
          {!chatOpen && (
            <button
              onClick={() => setChatOpen(true)}
              aria-label="Open design studio"
              className="fixed bottom-6 right-6 z-50 size-14 rounded-full bg-accent flex items-center justify-center shadow-[0_8px_32px_rgba(153,249,234,0.3)] hover:bg-accent-hover transition-all cursor-pointer hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-bg-primary"
            >
              <Wand2 size={20} className="text-accent-foreground" />
            </button>
          )}

          {/* ─── Panel ──────────────────────────────────────────────────────── */}
          {chatOpen && (
            <div
              role="dialog"
              aria-label={`Design studio — ${pageConfig.label}`}
              className="fixed bottom-6 right-6 z-50 w-[380px] rounded-[var(--radius-xl)] border border-border-default bg-bg-elevated shadow-[0_24px_64px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden max-h-[calc(100vh-48px)]"
            >

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
                    <span className="inline-flex items-center gap-1 text-[11px] text-text-accent font-medium">
                      <Check size={10} />
                      edited
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {activeOverride && (
                    <button
                      onClick={handleReset}
                      aria-label={`Reset ${pageConfig.label} to original`}
                      className="flex items-center gap-1 text-[11px] text-text-tertiary hover:text-status-error transition-colors cursor-pointer px-1.5 py-1 rounded-[var(--radius-sm)] hover:bg-bg-surface-hover focus:outline-none focus:ring-2 focus:ring-accent/50"
                    >
                      <RotateCcw size={10} />
                      Reset
                    </button>
                  )}
                  <div className="relative" ref={modelPickerRef}>
                    <button
                      onClick={() => setShowModelPicker(!showModelPicker)}
                      aria-label="Choose AI model"
                      aria-expanded={showModelPicker}
                      aria-haspopup="listbox"
                      className="text-[11px] font-medium text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer border border-border-subtle rounded-[var(--radius-sm)] px-1.5 py-1 focus:outline-none focus:ring-2 focus:ring-accent/50"
                    >
                      {model === "claude-opus-4.6" ? "Claude" : model === "gemini-3.1-pro" ? "Gemini" : "GPT"}
                    </button>
                    {showModelPicker && (
                      <div
                        role="listbox"
                        aria-label="AI model"
                        className="absolute right-0 top-full mt-1 z-50 w-44 rounded-[var(--radius-md)] border border-border-default bg-bg-elevated shadow-xl overflow-hidden"
                      >
                        {(["gemini-3.1-pro", "claude-opus-4.6", "chatgpt-5.4"] as Model[]).map((m) => (
                          <button
                            key={m}
                            role="option"
                            aria-selected={model === m}
                            onClick={() => handleModelChange(m)}
                            className={`w-full text-left px-3 py-2.5 text-xs transition-colors cursor-pointer flex items-center justify-between ${
                              model === m ? "text-text-accent bg-accent-subtle" : "text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary"
                            }`}
                          >
                            <span>{m === "claude-opus-4.6" ? "Claude Opus 4.6" : m === "gemini-3.1-pro" ? "Gemini 3.1 Pro" : "ChatGPT 5.4"}</span>
                            {model === m && <Check size={12} className="text-text-accent" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setChatOpen(false)}
                    aria-label="Close design studio"
                    className="text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer p-1 rounded-[var(--radius-sm)] focus:outline-none focus:ring-2 focus:ring-accent/50"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-3 flex flex-col gap-3 overflow-y-auto">

                {/* Error */}
                {error && (
                  <div role="alert" className="px-3 py-2.5 rounded-[var(--radius-md)] bg-red-950/30 border border-red-900/30">
                    <p className="text-xs text-red-400 leading-relaxed">{error}</p>
                    <button
                      onClick={() => setError(null)}
                      className="text-[11px] text-red-400/70 hover:text-red-300 mt-1.5 transition-colors cursor-pointer focus:outline-none focus:underline"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Hero CTA — Improve This Page */}
                {!isGenerating && (
                  <button
                    onClick={() => handleStudioImprove("full", prompt.trim() || undefined)}
                    disabled={isGenerating}
                    className="group w-full flex items-center gap-3 p-3.5 rounded-[var(--radius-lg)] bg-gradient-to-r from-accent/12 to-accent/4 border border-accent/20 hover:border-accent/40 hover:from-accent/18 hover:to-accent/8 transition-all cursor-pointer active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-accent/50"
                  >
                    <div className="size-9 rounded-[var(--radius-md)] bg-accent/20 flex items-center justify-center shrink-0 group-hover:bg-accent/30 transition-colors">
                      <Wand2 size={16} className="text-text-accent" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-[13px] font-semibold text-text-primary">Improve this page</p>
                      <p className="text-[11px] text-text-secondary mt-0.5">
                        Better spacing, hierarchy, hover states, and polish
                      </p>
                    </div>
                    <Zap size={14} className="text-accent/40 group-hover:text-text-accent transition-colors shrink-0" />
                  </button>
                )}

                {/* Loading state (replaces hero CTA) */}
                {isGenerating && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="flex items-center gap-3 p-3.5 rounded-[var(--radius-lg)] bg-accent-subtle border border-accent/10"
                  >
                    <Loader2 size={16} className="text-text-accent animate-spin shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-text-primary">{progressText}</p>
                      <p className="text-[11px] text-text-tertiary mt-0.5">Usually 15–20 seconds</p>
                    </div>
                  </div>
                )}

                {/* Specific rules */}
                {!isGenerating && (
                  <div>
                    <p className="text-[11px] font-medium text-text-tertiary mb-2 px-0.5">
                      Pick a specific rule
                    </p>
                    <div className="flex flex-col gap-0.5" role="list">
                      {visibleModes.map((mode) => (
                        <button
                          key={mode.key}
                          role="listitem"
                          onClick={() => handleStudioImprove(mode.key, prompt.trim() || undefined)}
                          disabled={isGenerating}
                          className="group w-full flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-md)] hover:bg-bg-surface-hover transition-all cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-inset"
                        >
                          <span className="text-text-tertiary group-hover:text-text-accent transition-colors shrink-0">
                            {STUDIO_ICONS[mode.icon]}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-text-primary">{mode.label}</p>
                            <p className="text-[11px] text-text-tertiary leading-snug truncate">{mode.subtitle}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    {hiddenCount > 0 && (
                      <button
                        onClick={() => setShowMoreRules(!showMoreRules)}
                        aria-expanded={showMoreRules}
                        className="flex items-center gap-1 text-[11px] text-text-tertiary hover:text-text-accent transition-colors cursor-pointer mt-1.5 px-3 focus:outline-none focus:underline"
                      >
                        {showMoreRules ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                        {showMoreRules ? "Show fewer rules" : `${hiddenCount} more rules`}
                      </button>
                    )}
                  </div>
                )}

                {/* Divider */}
                {!isGenerating && (
                  <div className="border-t border-border-subtle" role="separator" />
                )}

                {/* Prompt input */}
                {!isGenerating && (
                  <div>
                    <label htmlFor="studio-prompt" className="sr-only">
                      Describe what to change
                    </label>
                    <div className="relative">
                      <textarea
                        id="studio-prompt"
                        ref={textareaRef}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`e.g. "Make the cards bigger" or "Add more spacing"`}
                        rows={2}
                        disabled={isGenerating}
                        className="w-full resize-none rounded-[var(--radius-md)] border border-border-default bg-bg-input pl-3 pr-10 py-2.5 text-xs leading-relaxed text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
                      />
                      <button
                        onClick={handleEdit}
                        disabled={isGenerating || !prompt.trim()}
                        aria-label="Send custom edit"
                        className="absolute right-2 bottom-2 size-7 rounded-[var(--radius-sm)] bg-accent flex items-center justify-center transition-all hover:bg-accent-hover disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/50"
                      >
                        <Send size={12} className="text-accent-foreground" />
                      </button>
                    </div>
                  </div>
                )}

                {/* API key */}
                {!isGenerating && !apiKey && (
                  <details className="group">
                    <summary className="text-[11px] text-text-tertiary hover:text-text-secondary cursor-pointer list-none flex items-center gap-1 focus:outline-none focus:underline">
                      <ChevronDown size={11} className="group-open:rotate-180 transition-transform" />
                      Use your own API key
                    </summary>
                    <p className="text-[11px] text-text-tertiary mt-1.5 mb-1.5 leading-relaxed">
                      Connect an OpenRouter key to use Claude or GPT directly.
                    </p>
                    <input
                      type="password"
                      placeholder="sk-or-..."
                      aria-label="OpenRouter API key"
                      className="w-full bg-bg-input border border-border-default rounded-[var(--radius-sm)] px-2.5 py-2 text-xs text-text-primary outline-none placeholder:text-text-tertiary focus:border-border-accent focus:ring-2 focus:ring-accent/20"
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
                    className="text-[11px] text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer focus:outline-none focus:underline"
                  >
                    Disconnect API key
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
