"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { TopBar } from "@/components/navigation/TopBar";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Trophy, Target, Shield, Star, Users } from "lucide-react";

const MISSIONS = [
  {
    id: "1",
    title: "Badge Hunter",
    description: "Collect badges by completing challenges and missions on Rize.gg",
    icon: "shield",
    progress: 0,
    total: 100,
    status: "IN_PROGRESS",
    xp: 500,
  },
  {
    id: "2",
    title: "Committed Player",
    description: "Log in and play sessions consistently to show your dedication",
    icon: "target",
    progress: 1,
    total: 100,
    status: "IN_PROGRESS",
    xp: 300,
  },
  {
    id: "3",
    title: "Mission Master",
    description: "Complete a set number of missions to prove your mastery",
    icon: "trophy",
    progress: 0,
    total: 100,
    status: "LOCKED",
    xp: 1000,
  },
  {
    id: "4",
    title: "Badge Collector",
    description: "Collect a wide variety of badges from different activities",
    icon: "star",
    progress: 0,
    total: 100,
    status: "LOCKED",
    xp: 750,
  },
  {
    id: "5",
    title: "Social Starter",
    description: "Connect with other players, join groups, and build your network",
    icon: "users",
    progress: 0,
    total: 100,
    status: "LOCKED",
    xp: 200,
  },
];

const GAME_TABS = [
  { label: "Rize.gg", progress: 1 },
  { label: "Overwatch 2", progress: 0 },
];

function MissionIcon({ icon, locked }: { icon: string; locked: boolean }) {
  const cls = `${locked ? "text-text-tertiary" : "text-text-accent"}`;
  if (icon === "shield") return <Shield size={20} className={cls} />;
  if (icon === "target") return <Target size={20} className={cls} />;
  if (icon === "trophy") return <Trophy size={20} className={cls} />;
  if (icon === "star") return <Star size={20} className={cls} />;
  if (icon === "users") return <Users size={20} className={cls} />;
  return <Target size={20} className={cls} />;
}

export default function MissionsAndRewardsPage() {
  const [activeTab, setActiveTab] = useState(0);

  const totalProgress = MISSIONS.reduce((a, m) => a + m.progress, 0);
  const totalGoal = MISSIONS.reduce((a, m) => a + m.total, 0);
  const overallPct = Math.round((totalProgress / totalGoal) * 100);

  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar activeItem="Missions & Rewards" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumb={<Breadcrumbs items={[{ label: "Missions & Rewards" }]} />} />
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 19h20L12 2z" fill="currentColor" opacity="0.6" /></svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold">{tab.label}</p>
                  <p className="text-xs opacity-60">{tab.progress}% Progress</p>
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-6">
            {/* Missions list */}
            <div className="flex-1 flex flex-col gap-3">
              {MISSIONS.map((mission) => {
                const locked = mission.status === "LOCKED";
                const pct = Math.round((mission.progress / mission.total) * 100);
                return (
                  <div
                    key={mission.id}
                    className={`bg-bg-card border rounded-[var(--radius-lg)] p-5 flex items-start gap-4 transition-colors ${
                      locked ? "border-border-subtle opacity-60" : "border-border-default hover:border-border-accent/30"
                    }`}
                  >
                    {/* Icon */}
                    <div className={`size-10 rounded-[var(--radius-md)] flex items-center justify-center shrink-0 ${locked ? "bg-bg-surface" : "bg-accent-muted"}`}>
                      <MissionIcon icon={mission.icon} locked={locked} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-semibold text-text-primary">{mission.title}</h3>
                        <span className="text-xs text-text-secondary">{mission.progress}/{mission.total}</span>
                      </div>
                      <p className="text-xs text-text-secondary mb-3">{mission.description}</p>
                      {/* Progress bar */}
                      <div className="h-1.5 w-full rounded-full bg-bg-surface overflow-hidden">
                        <div
                          className="h-full rounded-full bg-accent transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* XP badge */}
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${locked ? "bg-bg-surface text-text-tertiary" : "bg-accent-muted text-text-accent"}`}>
                        +{mission.xp} XP
                      </span>
                      {locked && (
                        <span className="text-[10px] text-text-tertiary">Locked</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Overall progress sidebar */}
            <div className="w-[260px] shrink-0 flex flex-col gap-4">
              <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-4">Overall Progress</h3>

                {/* Circle progress */}
                <div className="flex flex-col items-center gap-3 mb-5">
                  <div className="relative size-24">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-bg-surface)" strokeWidth="10" />
                      <circle
                        cx="50" cy="50" r="40" fill="none"
                        stroke="#99F9EA" strokeWidth="10"
                        strokeDasharray={`${2 * Math.PI * 40 * overallPct / 100} ${2 * Math.PI * 40}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-text-primary">{overallPct}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary text-center">
                    {totalProgress} / {totalGoal} total progress
                  </p>
                </div>

                {/* Mission breakdown */}
                <div className="flex flex-col gap-2">
                  {MISSIONS.map((m) => (
                    <div key={m.id} className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary truncate flex-1 mr-2">{m.title}</span>
                      <span className={`text-xs font-medium ${m.status === "IN_PROGRESS" ? "text-text-accent" : "text-text-tertiary"}`}>
                        {m.progress}/{m.total}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badges earned */}
              <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Badges Earned</h3>
                <div className="flex flex-col items-center gap-2 py-4">
                  <Trophy size={28} className="text-text-tertiary" />
                  <p className="text-xs text-text-secondary">No badges yet</p>
                  <p className="text-[10px] text-text-tertiary text-center">Complete missions to earn your first badge</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
