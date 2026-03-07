"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { TopBar } from "@/components/navigation/TopBar";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Calendar, Clock, ChevronDown, History } from "lucide-react";

const SCRIMS_BY_DATE = [
  {
    date: "Friday, 20 Feb",
    scrims: [
      {
        id: "1",
        time: "4:09 PM",
        teamName: "RL Squad",
        teamAvatar: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=100&q=80",
        skillRequirement: "Champion III",
        gameCount: 1,
        format: "5-Stack",
      },
    ],
  },
  {
    date: "Saturday, 28 Feb",
    scrims: [
      {
        id: "2",
        time: "5:55 PM",
        teamName: "lord007tn",
        teamAvatar: "https://lh3.googleusercontent.com/a/ACg8ocK5EX5irZBct3OpQQO_5wNfH8z79S46f8zzKIBsQhf0arnloNc8=s96-c",
        skillRequirement: "Diamond I",
        gameCount: 1,
        format: "1v1",
      },
    ],
  },
];

export default function ScrimsPage() {
  const [selectedGame, setSelectedGame] = useState("All games");
  const [sortOrder, setSortOrder] = useState("Oldest");
  const [type, setType] = useState("All types");

  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar activeItem="Scrims" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumb={<Breadcrumbs items={[{ label: "Scrims" }]} />} />
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <h1 className="text-2xl font-bold text-text-primary mb-6">LFS - Scrim Finder</h1>

          {/* Top filter panel */}
          <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-4 flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-[var(--radius-sm)] bg-accent/20 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 19h20L12 2z" fill="#99F9EA"/></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">All games</p>
                <p className="text-xs text-text-secondary">Current teams: {SCRIMS_BY_DATE.reduce((a, d) => a + d.scrims.length, 0)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">Game</span>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] bg-bg-surface border border-border-default text-sm text-text-primary hover:bg-bg-surface-hover transition-colors cursor-pointer">
                  {selectedGame} <ChevronDown size={14} />
                </button>
              </div>
              <button className="px-4 py-2 rounded-[var(--radius-md)] bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent-hover transition-colors cursor-pointer">
                Start your scrim now
              </button>
            </div>
          </div>

          {/* Filters row */}
          <div className="flex items-center gap-3 mb-4">
            <button className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] border border-border-default bg-bg-input text-sm text-text-tertiary hover:bg-bg-surface transition-colors cursor-pointer flex-1 max-w-[200px]">
              <Calendar size={14} /> Choose date
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] border border-border-default bg-bg-input text-sm text-text-tertiary hover:bg-bg-surface transition-colors cursor-pointer flex-1 max-w-[200px]">
              <Clock size={14} /> Choose a start time
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] border border-border-default bg-bg-input text-sm text-text-primary hover:bg-bg-surface transition-colors cursor-pointer">
              {sortOrder} <ChevronDown size={14} />
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] border border-border-default bg-bg-input text-sm text-text-primary hover:bg-bg-surface transition-colors cursor-pointer">
              {type} <ChevronDown size={14} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] border border-border-default bg-bg-surface text-sm text-text-secondary hover:bg-bg-surface-hover transition-colors cursor-pointer ml-auto">
              <History size={14} /> History
            </button>
          </div>

          {/* Scrim list grouped by date */}
          <div className="flex flex-col gap-1">
            {SCRIMS_BY_DATE.map((group) => (
              <div key={group.date}>
                {/* Date separator */}
                <div className="flex items-center gap-4 my-4">
                  <div className="flex-1 h-px bg-border-default" />
                  <span className="text-xs text-text-tertiary shrink-0">{group.date}</span>
                  <div className="flex-1 h-px bg-border-default" />
                </div>

                {/* Scrim rows */}
                {group.scrims.map((scrim) => (
                  <div
                    key={scrim.id}
                    className="flex items-center gap-4 px-4 py-3 bg-bg-card border border-border-default rounded-[var(--radius-lg)] hover:border-border-accent/30 transition-colors"
                  >
                    {/* Time */}
                    <span className="text-sm text-text-secondary shrink-0 w-16">{scrim.time}</span>

                    {/* Team avatar */}
                    <div className="size-10 rounded-full overflow-hidden bg-bg-surface shrink-0">
                      <img src={scrim.teamAvatar} alt={scrim.teamName} className="w-full h-full object-cover" />
                    </div>

                    {/* Team info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary">{scrim.teamName}</p>
                      <p className="text-xs text-text-secondary">Skill requirement: {scrim.skillRequirement}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-text-secondary shrink-0">
                      <span>{scrim.gameCount} game</span>
                      <span>{scrim.format}</span>
                    </div>

                    {/* CTA */}
                    <button className="px-4 py-1.5 rounded-[var(--radius-md)] border border-border-default bg-bg-surface text-sm text-text-primary hover:bg-bg-surface-hover hover:border-border-accent/30 transition-colors cursor-pointer shrink-0">
                      View opponent
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
