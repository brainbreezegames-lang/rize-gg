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
  Sparkles, Send, X, RotateCcw, Loader2, ChevronDown,
  Wand2, LayoutGrid, Layers, Eye, AlignLeft,
  Zap, MessageSquare, ArrowLeft,
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
type PanelView = "home" | "studio" | "edit";

const LS_OVERRIDE = (key: PageKey) => `rize-edit-${key}`;
const LS_MODEL = "rize-edit-model";
const LS_API_KEY = "rize-api-key";

// Icon map for studio modes
const STUDIO_ICONS: Record<string, React.ReactNode> = {
  Wand2:      <Wand2 size={14} />,
  LayoutGrid: <LayoutGrid size={14} />,
  Layers:     <Layers size={14} />,
  Sparkles:   <Sparkles size={14} />,
  Eye:        <Eye size={14} />,
  AlignLeft:  <AlignLeft size={14} />,
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

// ─── Streaming helper ─────────────────────────────────────────────────────────

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
  const [panelView, setPanelView] = useState<PanelView>("home");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingCode, setStreamingCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [activeStudioMode, setActiveStudioMode] = useState<StudioMode | null>(null);

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

  // ─── Apply result (shared by both edit and studio) ──────────────────────────

  const applyResult = useCallback((accumulated: string) => {
    const clean = normalizeCode(stripFences(accumulated));
    if (clean.length > 50) {
      setOverrides((prev) => ({ ...prev, [activePage]: clean }));
      saveOverride(activePage, clean);
    } else {
      throw new Error("Generated output was too short — try again.");
    }
  }, [activePage]);

  // ─── Regular edit ───────────────────────────────────────────────────────────

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

      const accumulated = await consumeStream(res, setStreamingCode);
      applyResult(accumulated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
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
    setPanelView("home");

    try {
      const res = await fetch("/api/studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentCode,
          pageName: pageConfig.label,
          mode,
          model,
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
      setError(err instanceof Error ? err.message : "Studio improvement failed");
    } finally {
      setIsGenerating(false);
      setStreamingCode("");
      setActiveStudioMode(null);
    }
  }, [isGenerating, currentCode, pageConfig.label, model, apiKey, applyResult]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEdit();
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

  // ─── Status text ────────────────────────────────────────────────────────────

  const studioModeLabel = activeStudioMode
    ? STUDIO_MODES.find((m) => m.key === activeStudioMode)?.label
    : null;

  const statusText = isGenerating
    ? activeStudioMode
      ? streamingCode.length > 800
        ? `Applying ${studioModeLabel} improvements...`
        : streamingCode.length > 300
          ? `Redesigning with ${studioModeLabel}...`
          : `Auditing page for ${studioModeLabel}...`
      : streamingCode.length > 800
        ? "Finalizing the edit..."
        : streamingCode.length > 300
          ? "Applying changes..."
          : "Analyzing your request..."
    : error
      ? error
      : activeOverride
        ? "Page improved. Run again or prompt to keep iterating."
        : "Choose an improvement or describe a custom edit.";

  // ─── Render ─────────────────────────────────────────────────────────────────

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
              onClick={() => { setChatOpen(true); setPanelView("home"); }}
              className="fixed bottom-6 right-6 z-50 size-14 rounded-full bg-accent flex items-center justify-center shadow-[0_8px_32px_rgba(153,249,234,0.3)] hover:bg-accent-hover transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Sparkles size={20} className="text-accent-foreground" />
            </button>
          )}

          {/* ─── Panel ─────────────────────────────────────────────────────── */}
          {chatOpen && (
            <div className="fixed bottom-6 right-6 z-50 w-[400px] rounded-[var(--radius-xl)] border border-border-default bg-bg-elevated shadow-[0_24px_64px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden max-h-[calc(100vh-48px)]">

              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border-default shrink-0">
                <div className="flex items-center gap-2">
                  {panelView !== "home" && (
                    <button
                      onClick={() => setPanelView("home")}
                      className="text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer mr-1"
                    >
                      <ArrowLeft size={14} />
                    </button>
                  )}
                  <div className="size-6 rounded-[var(--radius-sm)] bg-accent/15 flex items-center justify-center">
                    <Sparkles size={12} className="text-text-accent" />
                  </div>
                  <span className="text-xs font-semibold text-text-primary">
                    {panelView === "studio" ? "Studio" : panelView === "edit" ? "Edit" : "Studio"} — {pageConfig.label}
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

              {/* ─── HOME view: two big buttons ────────────────────────────── */}
              {panelView === "home" && !isGenerating && (
                <div className="p-4 flex flex-col gap-3">
                  {/* Status */}
                  <p className={`text-xs leading-relaxed ${error ? "text-red-400" : "text-text-secondary"}`}>
                    {statusText}
                  </p>

                  {/* Big Studio button — one click improve */}
                  <button
                    onClick={() => handleStudioImprove("full")}
                    disabled={isGenerating}
                    className="group w-full flex items-center gap-3 p-4 rounded-[var(--radius-lg)] bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 hover:border-accent/40 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <div className="size-10 rounded-[var(--radius-md)] bg-accent/15 flex items-center justify-center shrink-0 group-hover:bg-accent/25 transition-colors">
                      <Wand2 size={18} className="text-text-accent" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-text-primary">Improve This Page</p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        One-click design audit — fixes layout, hierarchy, polish, and more
                      </p>
                    </div>
                    <Zap size={14} className="text-text-accent ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  {/* Specific improvements */}
                  <button
                    onClick={() => setPanelView("studio")}
                    className="group w-full flex items-center gap-3 p-3 rounded-[var(--radius-lg)] bg-bg-surface/60 border border-border-subtle hover:border-border-default transition-all cursor-pointer"
                  >
                    <div className="size-8 rounded-[var(--radius-md)] bg-bg-surface flex items-center justify-center shrink-0">
                      <Layers size={14} className="text-text-secondary" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-text-primary">Pick Specific Improvement</p>
                      <p className="text-[11px] text-text-tertiary mt-0.5">Layout, hierarchy, polish, accessibility, or content</p>
                    </div>
                  </button>

                  {/* Custom edit */}
                  <button
                    onClick={() => { setPanelView("edit"); setTimeout(() => textareaRef.current?.focus(), 50); }}
                    className="group w-full flex items-center gap-3 p-3 rounded-[var(--radius-lg)] bg-bg-surface/60 border border-border-subtle hover:border-border-default transition-all cursor-pointer"
                  >
                    <div className="size-8 rounded-[var(--radius-md)] bg-bg-surface flex items-center justify-center shrink-0">
                      <MessageSquare size={14} className="text-text-secondary" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-text-primary">Custom Edit</p>
                      <p className="text-[11px] text-text-tertiary mt-0.5">Describe exactly what you want to change</p>
                    </div>
                  </button>

                  {/* API key */}
                  {!apiKey && (
                    <div className="pt-2 border-t border-border-subtle">
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
                  {apiKey && (
                    <button
                      onClick={() => { setApiKey(""); localStorage.removeItem(LS_API_KEY); }}
                      className="text-[10px] text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer self-start"
                    >
                      Clear API key
                    </button>
                  )}
                </div>
              )}

              {/* ─── HOME view while generating (status only) ──────────────── */}
              {panelView === "home" && isGenerating && (
                <div className="p-4 flex flex-col items-center gap-3 py-8">
                  <Loader2 size={24} className="text-text-accent animate-spin" />
                  <p className="text-xs text-text-secondary text-center">{statusText}</p>
                </div>
              )}

              {/* ─── STUDIO view: specific improvements ────────────────────── */}
              {panelView === "studio" && (
                <div className="p-3 flex flex-col gap-1.5 overflow-y-auto">
                  <p className="text-[11px] text-text-tertiary px-1 pb-1">
                    Pick a focus area — the AI will audit and fix issues automatically:
                  </p>
                  {STUDIO_MODES.map((mode) => (
                    <button
                      key={mode.key}
                      onClick={() => handleStudioImprove(mode.key)}
                      disabled={isGenerating}
                      className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] hover:bg-bg-surface-hover transition-all cursor-pointer disabled:opacity-50 text-left"
                    >
                      <div className="size-7 rounded-[var(--radius-sm)] bg-bg-surface flex items-center justify-center shrink-0 group-hover:bg-accent/10 transition-colors">
                        <span className="text-text-secondary group-hover:text-text-accent transition-colors">
                          {STUDIO_ICONS[mode.icon]}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-text-primary">{mode.label}</p>
                        <p className="text-[11px] text-text-tertiary mt-0.5 leading-snug">{mode.description}</p>
                      </div>
                    </button>
                  ))}

                  {/* Studio + custom prompt combo */}
                  <div className="mt-2 pt-2 border-t border-border-subtle">
                    <p className="text-[11px] text-text-tertiary px-1 mb-2">
                      Or combine an improvement with a specific request:
                    </p>
                    <textarea
                      ref={textareaRef}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={`e.g. "Focus on the hero section" or "Make the cards more compact"`}
                      rows={2}
                      disabled={isGenerating}
                      className="w-full resize-none rounded-[var(--radius-md)] border border-border-default bg-bg-input px-3 py-2 text-xs leading-relaxed text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-border-accent disabled:opacity-50"
                    />
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {STUDIO_MODES.slice(0, 3).map((mode) => (
                        <button
                          key={mode.key}
                          onClick={() => {
                            handleStudioImprove(mode.key, prompt.trim() || undefined);
                            setPrompt("");
                          }}
                          disabled={isGenerating || !prompt.trim()}
                          className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-[var(--radius-sm)] border border-border-default text-text-secondary hover:text-text-accent hover:border-accent/30 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          {STUDIO_ICONS[mode.icon]}
                          {mode.label.split(" ").slice(0, 2).join(" ")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── EDIT view: custom prompt ──────────────────────────────── */}
              {panelView === "edit" && (
                <div className="flex flex-col">
                  {/* Status */}
                  <div className="px-4 py-3 border-b border-border-subtle bg-bg-surface/40">
                    <p className={`text-xs leading-relaxed ${error ? "text-red-400" : "text-text-secondary"}`}>
                      {statusText}
                    </p>
                  </div>

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

                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={handleEdit}
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
          )}
        </div>
      </div>
    </EditContext.Provider>
  );
}
