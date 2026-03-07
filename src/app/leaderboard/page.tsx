"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { TopBar } from "@/components/navigation/TopBar";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { ChevronDown } from "lucide-react";

const LEADERBOARD = [
  {
    rank: 1,
    username: "murexhyena",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocKY14j2kNBcnQ4cFTIrNUl_v-8B2rbxjr8dOGziUMwwxa_CLD8=s96-c",
    country: "Lebanon",
    countryCode: "lb",
    missions: 3,
    badges: ["Join The Squad", "Committed Player", "Social Starter"],
  },
  {
    rank: 2,
    username: "hglyblzs",
    avatar: null,
    country: "Hungary",
    countryCode: "hu",
    missions: 2,
    badges: ["Join The Squad", "Committed Player"],
  },
];

const GAME_TABS = [
  { label: "Rize.gg", progress: 0 },
  { label: "Overwatch 2", progress: 0 },
];

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState(0);

  const top1 = LEADERBOARD[0];
  const top2 = LEADERBOARD[1];

  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar activeItem="Leaderboard" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumb={<Breadcrumbs items={[{ label: "Leaderboard" }]} />} />
        <main className="flex-1 overflow-y-auto px-6 py-8">

          {/* Game tabs */}
          <div className="flex items-center gap-3 mb-6">
            {GAME_TABS.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-3 px-5 py-3 rounded-[var(--radius-lg)] border text-sm font-medium transition-colors cursor-pointer min-w-[200px] ${
                  activeTab === i
                    ? "bg-accent-subtle border-border-accent text-text-accent"
                    : "bg-bg-card border-border-default text-text-secondary hover:bg-bg-surface"
                }`}
              >
                <div className="size-8 rounded-full bg-bg-surface flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 19h20L12 2z" fill="currentColor" opacity="0.6"/></svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold">{tab.label}</p>
                  <p className="text-xs opacity-60">{tab.progress}% Progress</p>
                </div>
              </button>
            ))}
          </div>

          {/* Leaderboard header card */}
          <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] px-5 py-4 flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">{GAME_TABS[activeTab].label} Leaderboard</h2>
              <p className="text-sm text-text-secondary">Current rank: 3</p>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-md)] border border-border-default bg-bg-surface text-sm text-text-primary hover:bg-bg-surface-hover transition-colors cursor-pointer">
              All badges <ChevronDown size={14} />
            </button>
          </div>

          {/* Podium */}
          <div className="flex items-end justify-center gap-4 mb-8 min-h-[280px]">
            {/* #2 */}
            {top2 && (
              <div className="flex flex-col items-center gap-3 pb-4">
                <div className="size-16 rounded-full overflow-hidden bg-bg-surface border-2 border-border-default">
                  {top2.avatar ? (
                    <img src={top2.avatar} alt={top2.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-bg-surface-hover flex items-center justify-center">
                      <span className="text-xl font-bold text-text-tertiary uppercase">{top2.username[0]}</span>
                    </div>
                  )}
                </div>
                <p className="text-sm font-semibold text-text-primary">{top2.username}</p>
                <div className="flex gap-1">
                  {top2.badges.slice(0, 2).map((b, i) => (
                    <div key={i} className="size-6 rounded-full bg-accent/20 border border-border-accent/30 flex items-center justify-center">
                      <span className="text-[8px] text-text-accent">B</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-text-secondary">{top2.missions} missions | <img src={`https://flagcdn.com/w20/${top2.countryCode}.png`} alt={top2.country} className="inline h-3 ml-1" /></p>
                <div className="w-24 h-16 bg-bg-surface border border-border-default rounded-t-[var(--radius-md)] flex items-center justify-center">
                  <span className="text-2xl font-bold text-text-secondary">2</span>
                </div>
              </div>
            )}

            {/* #1 */}
            {top1 && (
              <div className="flex flex-col items-center gap-3 pb-0">
                <div className="size-20 rounded-full overflow-hidden bg-bg-surface border-2 border-text-accent">
                  {top1.avatar ? (
                    <img src={top1.avatar} alt={top1.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-bg-surface-hover flex items-center justify-center">
                      <span className="text-2xl font-bold text-text-accent uppercase">{top1.username[0]}</span>
                    </div>
                  )}
                </div>
                <p className="text-sm font-semibold text-text-primary">{top1.username}</p>
                <div className="flex gap-1">
                  {top1.badges.slice(0, 3).map((b, i) => (
                    <div key={i} className="size-6 rounded-full bg-accent/20 border border-border-accent/30 flex items-center justify-center">
                      <span className="text-[8px] text-text-accent">B</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-text-secondary">{top1.missions} missions | <img src={`https://flagcdn.com/w20/${top1.countryCode}.png`} alt={top1.country} className="inline h-3 ml-1" /></p>
                <div className="w-24 h-24 bg-accent/10 border border-border-accent/30 rounded-t-[var(--radius-md)] flex items-center justify-center">
                  <span className="text-3xl font-bold text-text-accent">1</span>
                </div>
              </div>
            )}

            {/* #3 placeholder */}
            <div className="flex flex-col items-center gap-3 pb-4 opacity-40">
              <div className="size-16 rounded-full bg-bg-surface border-2 border-border-default flex items-center justify-center">
                <span className="text-text-tertiary text-xl font-bold">?</span>
              </div>
              <p className="text-sm text-text-tertiary">—</p>
              <div className="w-24 h-10 bg-bg-surface border border-border-default rounded-t-[var(--radius-md)] flex items-center justify-center">
                <span className="text-xl font-bold text-text-tertiary">3</span>
              </div>
            </div>
          </div>

          {/* Ranked list */}
          <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[40px_1fr_120px_120px] gap-4 px-5 py-3 border-b border-border-subtle text-xs text-text-secondary">
              <span>#</span>
              <span>Player</span>
              <span>Missions</span>
              <span>Country</span>
            </div>
            {LEADERBOARD.map((player) => (
              <div key={player.username} className="grid grid-cols-[40px_1fr_120px_120px] gap-4 px-5 py-3 border-b border-border-subtle last:border-0 hover:bg-bg-surface-hover/30 transition-colors">
                <span className={`text-sm font-semibold ${player.rank === 1 ? "text-text-accent" : "text-text-secondary"}`}>
                  {player.rank}
                </span>
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full overflow-hidden bg-bg-surface">
                    {player.avatar ? (
                      <img src={player.avatar} alt={player.username} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-bg-surface-hover flex items-center justify-center">
                        <span className="text-xs text-text-tertiary uppercase">{player.username[0]}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-text-primary">{player.username}</span>
                </div>
                <span className="text-sm text-text-secondary">{player.missions}</span>
                <div className="flex items-center gap-1.5">
                  <img src={`https://flagcdn.com/w20/${player.countryCode}.png`} alt={player.country} className="h-3.5" />
                  <span className="text-sm text-text-secondary">{player.country}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
