"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { TopBar } from "@/components/navigation/TopBar";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { Toggle } from "@/components/forms/Toggle";
import { Trophy, MapPin, Users, SlidersHorizontal, Plus, ArrowLeft, Calendar, Shield, Globe, Check, X } from "lucide-react";

const TOURNAMENTS = [
  {
    id: "1",
    name: "TEST",
    slug: "test-tournament",
    status: "PUBLISHED",
    isLive: true,
    game: "Mobile Legends: Bang Bang",
    gameImage: "https://static-cdn.jtvnw.net/ttv-boxart/Mobile%20Legends%3A%20Bang%20Bang-285x380.jpg",
    country: "World Wide",
    maxTeams: 4,
    currentTeams: 4,
    rank: "Challenger III",
    prizeAmount: 100,
    prizeType: "FIXED",
    organizer: { username: "paradox", avatar: "https://lh3.googleusercontent.com/a/ACg8ocL16Yj6Zy=s96-c" },
    description: "TEST tournament for all MLBB players worldwide. Compete against the best and prove your skills.",
    registrationOpen: false,
    startDate: "March 15, 2025",
    format: "Single Elimination",
    rules: ["5v5 format", "Best of 3 until finals", "Best of 5 for grand finals", "No substitutions after registration"],
  },
  {
    id: "2",
    name: "TI البطولة الرمضانية Ramadan Tournament",
    slug: "ti-ramadan-tournament",
    status: "PUBLISHED",
    isLive: false,
    game: "Mobile Legends: Bang Bang",
    gameImage: "https://static-cdn.jtvnw.net/ttv-boxart/Mobile%20Legends%3A%20Bang%20Bang-285x380.jpg",
    country: "Saudi Arabia",
    maxTeams: 8,
    currentTeams: 0,
    rank: "Mythic",
    prizeAmount: 1000,
    prizeType: "FIXED",
    organizer: { username: "t4", avatar: null },
    description: "Team impact Ramadan tournament\nPrize pool 20,000 diamonds for the winning team",
    registrationOpen: false,
    startDate: "April 1, 2025",
    format: "Double Elimination",
    rules: ["Mythic rank required", "Saudi Arabia players only", "5v5 format", "Prize: 20,000 diamonds"],
  },
];

const GAME_FILTERS = ["All games", "Mobile Legends: Bang Bang", "Clash Royale"];

type Tournament = typeof TOURNAMENTS[0];

function TournamentDetailView({ tournament, onBack }: { tournament: Tournament; onBack: () => void }) {
  const [registered, setRegistered] = useState(false);
  const spotsLeft = tournament.maxTeams - tournament.currentTeams;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <TopBar breadcrumb={
        <Breadcrumbs items={[
          { label: "Tournaments", href: "#" },
          { label: tournament.name },
        ]} />
      } />
      <main className="flex-1 overflow-y-auto">
        {/* Hero banner */}
        <div className="relative w-full h-[220px] bg-bg-card overflow-hidden">
          <img src={tournament.gameImage} alt={tournament.game} className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end px-8 pb-6">
            <div className="flex items-center gap-3 mb-2">
              {tournament.isLive && (
                <span className="px-2.5 py-1 rounded-[var(--radius-sm)] bg-status-error text-white text-xs font-semibold">Live</span>
              )}
              {!tournament.registrationOpen && !tournament.isLive && (
                <span className="px-2.5 py-1 rounded-[var(--radius-sm)] bg-bg-elevated/90 border border-border-default text-text-secondary text-xs font-medium">Registration Closed</span>
              )}
              <span className="px-2.5 py-1 rounded-[var(--radius-sm)] bg-bg-elevated/90 text-text-secondary text-xs font-medium">{tournament.game}</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary">{tournament.name}</h1>
          </div>
        </div>

        <div className="px-8 py-6 flex gap-6">
          {/* Main content */}
          <div className="flex-1 flex flex-col gap-5">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer w-fit"
            >
              <ArrowLeft size={14} /> Back to Tournaments
            </button>

            {/* About */}
            <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-5">
              <h2 className="text-sm font-semibold text-text-primary mb-3">About</h2>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{tournament.description}</p>
            </div>

            {/* Rules */}
            <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-5">
              <h2 className="text-sm font-semibold text-text-primary mb-3">Rules</h2>
              <div className="flex flex-col gap-2">
                {tournament.rules.map((rule, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-text-secondary">
                    <div className="size-5 rounded-full bg-accent-subtle border border-border-accent/20 flex items-center justify-center shrink-0">
                      <Check size={11} className="text-text-accent" />
                    </div>
                    {rule}
                  </div>
                ))}
              </div>
            </div>

            {/* Teams */}
            <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-text-primary">Registered Teams</h2>
                <span className="text-xs text-text-tertiary">{tournament.currentTeams}/{tournament.maxTeams}</span>
              </div>
              {tournament.currentTeams > 0 ? (
                <div className="flex flex-col gap-2">
                  {Array.from({ length: tournament.currentTeams }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-border-subtle last:border-0">
                      <div className="size-8 rounded-[var(--radius-sm)] bg-bg-surface border border-border-default flex items-center justify-center">
                        <span className="text-xs font-bold text-text-accent">T{i + 1}</span>
                      </div>
                      <span className="text-sm text-text-primary">Team {i + 1}</span>
                      <span className="ml-auto text-xs text-text-tertiary">Registered</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-tertiary text-center py-4">No teams registered yet. Be the first!</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-[260px] shrink-0 flex flex-col gap-4">
            {/* Stats */}
            <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-5">
              <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-4">Tournament Info</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-text-secondary"><Trophy size={14} className="text-yellow-400" /> Prize</div>
                  <span className="text-sm font-semibold text-text-primary">${tournament.prizeAmount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-text-secondary"><Users size={14} /> Teams</div>
                  <span className="text-sm font-semibold text-text-primary">{tournament.currentTeams}/{tournament.maxTeams}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-text-secondary"><MapPin size={14} /> Location</div>
                  <span className="text-sm font-semibold text-text-primary">{tournament.country}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-text-secondary"><Shield size={14} /> Rank</div>
                  <span className="text-sm font-semibold text-text-primary">{tournament.rank}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-text-secondary"><Calendar size={14} /> Starts</div>
                  <span className="text-sm font-semibold text-text-primary">{tournament.startDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-text-secondary"><Globe size={14} /> Format</div>
                  <span className="text-sm font-semibold text-text-primary text-right text-xs">{tournament.format}</span>
                </div>
              </div>
            </div>

            {/* Organizer */}
            <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-5">
              <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">Organizer</h3>
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-full bg-bg-surface border border-border-default overflow-hidden">
                  {tournament.organizer.avatar ? (
                    <img src={tournament.organizer.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-accent/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-text-accent uppercase">{tournament.organizer.username[0]}</span>
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-text-primary">{tournament.organizer.username}</span>
              </div>
            </div>

            {/* CTA */}
            {tournament.registrationOpen ? (
              <button
                onClick={() => setRegistered(!registered)}
                className={`w-full py-3 rounded-[var(--radius-md)] text-sm font-semibold transition-colors cursor-pointer ${
                  registered
                    ? "border border-border-default text-text-secondary bg-transparent hover:bg-bg-surface"
                    : "bg-accent text-accent-foreground hover:bg-accent-hover"
                }`}
              >
                {registered ? "Cancel Registration" : "Register Team"}
              </button>
            ) : (
              <button disabled className="w-full py-3 rounded-[var(--radius-md)] border border-border-default text-sm text-text-tertiary cursor-not-allowed">
                {tournament.isLive ? "Tournament in Progress" : "Registration Closed"}
              </button>
            )}

            {spotsLeft > 0 && tournament.registrationOpen && (
              <p className="text-xs text-text-tertiary text-center -mt-2">
                {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} remaining
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function TournamentsPage() {
  const [showMyTournaments, setShowMyTournaments] = useState(false);
  const [activeGame, setActiveGame] = useState("All games");
  const [selected, setSelected] = useState<Tournament | null>(null);

  const filtered = TOURNAMENTS.filter((t) => {
    if (activeGame !== "All games" && t.game !== activeGame) return false;
    return true;
  });

  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar activeItem="Tournaments" />
      <div className="flex-1 flex flex-col overflow-hidden">
        {selected ? (
          <TournamentDetailView tournament={selected} onBack={() => setSelected(null)} />
        ) : (
          <>
            <TopBar breadcrumb={<Breadcrumbs items={[{ label: "Tournaments" }]} />} />
            <main className="flex-1 overflow-y-auto px-6 py-8">
              {/* Header row */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-text-primary">Tournaments</h1>
                <div className="flex items-center gap-3">
                  <Toggle checked={showMyTournaments} onChange={setShowMyTournaments} label="Show my tournaments" />
                  <button className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] border border-border-default bg-bg-surface text-sm text-text-secondary hover:bg-bg-surface-hover transition-colors cursor-pointer">
                    <SlidersHorizontal size={16} /> Advanced filter
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent-hover transition-colors cursor-pointer">
                    <Plus size={16} /> Create new tournament
                  </button>
                </div>
              </div>

              {/* Game filter chips */}
              <div className="flex items-center gap-2 mb-6">
                {GAME_FILTERS.map((g) => (
                  <button
                    key={g}
                    onClick={() => setActiveGame(g)}
                    className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium border transition-colors cursor-pointer ${
                      activeGame === g
                        ? "bg-accent-muted border-border-accent text-text-accent"
                        : "bg-bg-surface border-border-default text-text-secondary hover:bg-bg-surface-hover"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              {/* Tournament cards grid */}
              {filtered.length > 0 ? (
                <div className="grid grid-cols-2 gap-5">
                  {filtered.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelected(t)}
                      className="bg-bg-card border border-border-default rounded-[var(--radius-xl)] overflow-hidden hover:border-border-accent/30 transition-colors cursor-pointer"
                    >
                      {/* Hero image */}
                      <div className="relative h-[180px] bg-bg-surface">
                        <img src={t.gameImage} alt={t.game} className="w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 to-transparent" />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-sm)] bg-bg-elevated/90 text-xs font-medium text-text-primary">
                            <Trophy size={12} className="text-yellow-400" />
                            Main Prize ${t.prizeAmount}
                          </div>
                        </div>
                        {t.isLive && (
                          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-[var(--radius-sm)] bg-status-error text-white text-xs font-semibold">
                            Live
                          </div>
                        )}
                        {!t.registrationOpen && !t.isLive && (
                          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-[var(--radius-sm)] bg-bg-elevated/90 border border-border-default text-text-secondary text-xs font-medium">
                            Registration Closed
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <div className="flex items-center gap-4 text-xs text-text-secondary mb-3">
                          <span className="flex items-center gap-1"><MapPin size={12} /> {t.country}</span>
                          <span className="flex items-center gap-1"><Users size={12} /> {t.currentTeams}/{t.maxTeams}</span>
                          <span>{t.rank}</span>
                        </div>

                        <div className="flex items-start gap-3">
                          {/* Organizer avatar */}
                          <div className="size-12 rounded-[var(--radius-md)] bg-bg-surface border border-border-default overflow-hidden shrink-0">
                            {t.organizer.avatar ? (
                              <img src={t.organizer.avatar} alt={t.organizer.username} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-sm font-bold text-text-accent uppercase">{t.organizer.username[0]}</span>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base font-semibold text-text-primary truncate">{t.name}</h3>
                            <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">{t.description}</p>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-border-subtle flex items-center gap-2 text-xs text-text-secondary">
                          <div className="size-5 rounded-full bg-bg-surface overflow-hidden">
                            {t.organizer.avatar ? (
                              <img src={t.organizer.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-accent/20 flex items-center justify-center">
                                <span className="text-[8px] text-text-accent uppercase">{t.organizer.username[0]}</span>
                              </div>
                            )}
                          </div>
                          <span className="text-text-tertiary">Owner</span>
                          <span className="text-text-primary font-medium">{t.organizer.username}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                  <Trophy size={40} className="text-text-tertiary" />
                  <p className="text-text-secondary">No tournaments found.</p>
                </div>
              )}
            </main>
          </>
        )}
      </div>
    </div>
  );
}
