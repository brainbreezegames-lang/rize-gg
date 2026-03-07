"use client";

/**
 * Team Finder Page — Figma node 2917:19661
 * Layout: Sidebar (240px) + 2-column session card grid + right detail panel
 * Shows group/session cards with team details, tags, member list, skill requirement
 */

import { useState } from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { TopBar } from "@/components/navigation/TopBar";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { SessionCard } from "@/components/cards/SessionCard";
import { SearchInput } from "@/components/forms/SearchInput";
import { Toggle } from "@/components/forms/Toggle";
import { Button } from "@/components/buttons/Button";
import { Avatar } from "@/components/micro/Avatar";
import {
  Gamepad2,
  Shield,
  Users,
  Clock,
  ChevronRight,
  X,
  Calendar,
  Tag,
  Star,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Member {
  id: string;
  name: string;
  rank: string;
  avatar?: string;
  online?: boolean;
}

interface Session {
  id: string;
  teamName: string;
  owner: string;
  game: string;
  gameColor: string;
  slotsUsed: number;
  slotsTotal: number;
  availability: string;
  time: string;
  skillRequirement: string;
  tags: string[];
  description: string;
  members: Member[];
  upcomingSession?: string;
}

// ─── Demo data ─────────────────────────────────────────────────────────────────

const SESSIONS: Session[] = [
  {
    id: "1",
    teamName: "Efootball Match",
    owner: "savano",
    game: "eFootball",
    gameColor: "#16A249",
    slotsUsed: 1,
    slotsTotal: 1,
    availability: "Anytime",
    time: "Open",
    skillRequirement: "Any",
    tags: ["Casual", "Football"],
    description: "Looking for opponents for eFootball matches. All skill levels welcome.",
    members: [
      { id: "m1", name: "savano", rank: "Member", online: true },
    ],
    upcomingSession: undefined,
  },
  {
    id: "2",
    teamName: "JP Kairos #antiayam",
    owner: "txwamisu",
    game: "Mobile Legends: Bang Bang",
    gameColor: "#FF5252",
    slotsUsed: 6,
    slotsTotal: 5,
    availability: "Evenings",
    time: "Evening",
    skillRequirement: "Any",
    tags: ["MLBB", "Competitive"],
    description: "JP Kairos team looking for strong MLBB players to join our roster.",
    members: [
      { id: "m2", name: "txwamisu", rank: "Owner", online: true },
    ],
    upcomingSession: undefined,
  },
  {
    id: "3",
    teamName: "TI",
    owner: "t4",
    game: "Mobile Legends: Bang Bang",
    gameColor: "#FF5252",
    slotsUsed: 2,
    slotsTotal: 5,
    availability: "Weekends",
    time: "Flexible",
    skillRequirement: "Mythic",
    tags: ["MLBB", "Ranked"],
    description: "Team Impact — competitive MLBB team. Ramadan tournament squad.",
    members: [
      { id: "m3", name: "t4", rank: "Owner", online: false },
    ],
    upcomingSession: undefined,
  },
  {
    id: "4",
    teamName: "MONITOR reboot",
    owner: "fatimabouazizi",
    game: "Apex Legends",
    gameColor: "#F5A623",
    slotsUsed: 2,
    slotsTotal: 5,
    availability: "Daily",
    time: "Daily",
    skillRequirement: "Any",
    tags: ["Apex", "Chill"],
    description: "MONITOR reboot Apex squad. Looking for consistent players to squad up daily.",
    members: [
      { id: "m4", name: "fatimabouazizi", rank: "Owner", online: true },
    ],
    upcomingSession: undefined,
  },
  {
    id: "5",
    teamName: "unibody animated Squad",
    owner: "mohammedalrashid",
    game: "Diablo IV",
    gameColor: "#8B5CF6",
    slotsUsed: 5,
    slotsTotal: 5,
    availability: "Weekends",
    time: "Flexible",
    skillRequirement: "Any",
    tags: ["Diablo", "Full Squad"],
    description: "Full squad for Diablo IV. Group is at capacity — check back later for openings.",
    members: [
      { id: "m5", name: "mohammedalrashid", rank: "Owner", online: false },
    ],
    upcomingSession: undefined,
  },
];

// ─── Detail Panel ──────────────────────────────────────────────────────────────

function DetailPanel({
  session,
  onClose,
}: {
  session: Session;
  onClose: () => void;
}) {
  const emptySlots = session.slotsTotal - session.slotsUsed;

  return (
    <div className="w-[340px] shrink-0 flex flex-col h-full border-l border-border-default bg-bg-card overflow-y-auto">
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-default">
        <h3 className="text-base font-semibold text-text-primary">
          Team Details
        </h3>
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-5 p-5">
        {/* Team header */}
        <div className="flex gap-3 items-start">
          <div
            className="size-14 rounded-[var(--radius-sm)] shrink-0 flex items-center justify-center"
            style={{ backgroundColor: session.gameColor }}
          >
            <Gamepad2 size={28} className="text-white" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h2 className="text-lg font-semibold text-text-primary leading-7">
              {session.teamName}
            </h2>
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-text-secondary">By</span>
              <span className="text-text-accent font-medium">
                {session.owner}
              </span>
              <span className="text-border-default">|</span>
              <span className="text-text-primary">{session.game}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary leading-6">
          {session.description}
        </p>

        {/* Tags */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-text-secondary uppercase tracking-wide">
            <Tag size={12} />
            <span>Tags</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {session.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-bg-surface border border-border-default text-xs text-text-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border-default" />

        {/* Session info */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Clock size={15} className="text-text-secondary shrink-0" />
            <span className="text-text-secondary">Time:</span>
            <span className="text-text-primary">{session.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={15} className="text-text-secondary shrink-0" />
            <span className="text-text-secondary">Availability:</span>
            <span className="text-text-primary">{session.availability}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Shield size={15} className="text-text-secondary shrink-0" />
            <span className="text-text-secondary">Skill:</span>
            <span className="text-text-accent font-medium">
              {session.skillRequirement}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border-default" />

        {/* Group members */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-medium text-text-secondary uppercase tracking-wide">
              <Users size={12} />
              <span>
                Members ({session.slotsUsed}/{session.slotsTotal})
              </span>
            </div>
          </div>

          {/* Member list */}
          <div className="flex flex-col gap-2">
            {session.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] bg-bg-surface"
              >
                <Avatar size="sm" online={member.online} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {member.name}
                  </p>
                  <p className="text-xs text-text-secondary">{member.rank}</p>
                </div>
                {member.id === session.members[0]?.id && (
                  <span className="text-[10px] font-medium text-text-accent bg-accent-muted px-2 py-0.5 rounded-full shrink-0">
                    Owner
                  </span>
                )}
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: emptySlots }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] border border-dashed border-border-default"
              >
                <div className="size-8 rounded-full bg-bg-surface flex items-center justify-center">
                  <Users size={14} className="text-text-tertiary" />
                </div>
                <p className="text-sm text-text-tertiary">Open slot</p>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border-default" />

        {/* Upcoming session */}
        {session.upcomingSession && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-text-secondary uppercase tracking-wide">
              <Star size={12} />
              <span>Upcoming Session</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-[var(--radius-md)] bg-accent-subtle border border-border-accent/20">
              <Calendar size={15} className="text-text-accent shrink-0" />
              <span className="text-sm text-text-accent font-medium">
                {session.upcomingSession}
              </span>
            </div>
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex flex-col gap-2 pt-1">
          <Button size="md" className="w-full" rightIcon={<ChevronRight size={16} />}>
            Join now
          </Button>
          <Button variant="outline" size="md" className="w-full">
            View full details
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function TeamFinderPage() {
  const [search, setSearch] = useState("");
  const [showMyTeams, setShowMyTeams] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const filtered = SESSIONS.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch =
      s.teamName.toLowerCase().includes(q) ||
      s.owner.toLowerCase().includes(q) ||
      s.game.toLowerCase().includes(q) ||
      s.tags.some((t) => t.toLowerCase().includes(q));
    // showMyTeams filter would normally check user ownership — demo uses first two cards
    const matchesMyTeams = showMyTeams
      ? ["1", "3"].includes(s.id)
      : true;
    return matchesSearch && matchesMyTeams;
  });

  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar activeItem="Team finder" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          breadcrumb={
            <Breadcrumbs
              items={[
                { label: "Rize.gg", href: "/" },
                { label: "Group finder" },
              ]}
            />
          }
        />

        {/* Page body — cards + optional detail panel side by side */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main content area */}
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="flex flex-col gap-6 max-w-6xl">
              {/* Page title + controls */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                    Team Finder
                  </h1>

                  {/* Controls: toggle + search */}
                  <div className="flex items-center gap-4">
                    <Toggle
                      checked={showMyTeams}
                      onChange={setShowMyTeams}
                      label="Show my teams"
                    />
                    <div className="w-64">
                      <SearchInput
                        placeholder="Search teams, games, tags..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onClear={() => setSearch("")}
                      />
                    </div>
                  </div>
                </div>

                {/* Filter chips row */}
                <div className="flex items-center gap-2">
                  {["All games", "Mobile Legends: Bang Bang", "Apex Legends", "eFootball", "Diablo IV"].map(
                    (chip, i) => (
                      <button
                        key={chip}
                        className={[
                          "px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer border",
                          i === 0
                            ? "bg-accent-muted border-border-accent text-text-accent"
                            : "bg-bg-surface border-border-default text-text-secondary hover:border-border-accent/40 hover:text-text-primary",
                        ].join(" ")}
                      >
                        {chip}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Results count */}
              <p className="text-sm text-text-secondary -mt-2">
                Showing{" "}
                <span className="text-text-primary font-medium">
                  {filtered.length}
                </span>{" "}
                groups
              </p>

              {/* 2-column grid of SessionCards */}
              {filtered.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {filtered.map((session) => (
                    <div
                      key={session.id}
                      className="cursor-pointer"
                      onClick={() =>
                        setSelectedSession(
                          selectedSession?.id === session.id ? null : session
                        )
                      }
                    >
                      <SessionCard
                        gameIcon={<Gamepad2 size={28} className="text-white" />}
                        gameColor={session.gameColor}
                        teamName={session.teamName}
                        owner={session.owner}
                        game={session.game}
                        slotsUsed={session.slotsUsed}
                        slotsTotal={session.slotsTotal}
                        availability={session.availability}
                        time={session.time}
                        skillRequirement={session.skillRequirement}
                        onDetails={() =>
                          setSelectedSession(
                            selectedSession?.id === session.id ? null : session
                          )
                        }
                        onJoin={() => {}}
                        className={
                          selectedSession?.id === session.id
                            ? "ring-1 ring-border-accent"
                            : ""
                        }
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Users size={40} className="text-text-tertiary" />
                  <p className="text-text-secondary text-sm">
                    No groups found matching your search.
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearch("");
                      setShowMyTeams(false);
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right detail panel — slides in when a card is selected */}
          {selectedSession && (
            <DetailPanel
              session={selectedSession}
              onClose={() => setSelectedSession(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
