"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { TopBar } from "@/components/navigation/TopBar";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { SearchInput } from "@/components/forms/SearchInput";
import { Select } from "@/components/forms/Select";
import { ViewToggle } from "@/components/navigation/ViewToggle";
import { Avatar } from "@/components/micro/Avatar";
import { PlayerCard } from "@/components/cards/PlayerCard";
import { ChevronDown, ChevronUp, ArrowLeft, MessageSquare, UserPlus, Trophy, Users, Gamepad2, Globe, Star } from "lucide-react";

type SortDir = "asc" | "desc" | null;

interface Player {
  id: number;
  name: string;
  sessions: number;
  groups: number;
  mutualGroups: number;
  games: { bgColor: string; name?: string }[];
  countryFlag: string;
  country: string;
  rating: number;
  bio?: string;
  rank?: string;
}

const PLAYERS: Player[] = [
  { id: 1, name: "demo", sessions: 0, groups: 0, mutualGroups: 0, games: [], countryFlag: "🇺🇸", country: "United States", rating: 0, bio: "Just here to play and have fun.", rank: "Unranked" },
  { id: 2, name: "nadia_db", sessions: 0, groups: 0, mutualGroups: 0, games: [{ bgColor: "bg-status-warning", name: "MLBB" }], countryFlag: "🇹🇳", country: "Tunisia", rating: 0, bio: "MLBB player from Tunisia. Ranked Mythic.", rank: "Mythic" },
  { id: 3, name: "diljeet", sessions: 0, groups: 0, mutualGroups: 0, games: [{ bgColor: "bg-status-error", name: "Valorant" }], countryFlag: "🇮🇳", country: "India", rating: 0, bio: "Valorant main. Diamond 2. Looking for ranked team.", rank: "Diamond II" },
  { id: 4, name: "sirius", sessions: 0, groups: 1, mutualGroups: 0, games: [{ bgColor: "bg-accent", name: "Valorant" }], countryFlag: "🇸🇦", country: "Saudi Arabia", rating: 0, bio: "Radiant Valorant player. IGL for my team. EU/MENA servers.", rank: "Radiant" },
  { id: 5, name: "paradox", sessions: 0, groups: 1, mutualGroups: 0, games: [{ bgColor: "bg-status-success", name: "MLBB" }], countryFlag: "🇪🇬", country: "Egypt", rating: 0, bio: "Competitive MLBB player. Tournament organizer on Rize.gg.", rank: "Mythic" },
  { id: 6, name: "savano", sessions: 0, groups: 1, mutualGroups: 0, games: [{ bgColor: "bg-status-error", name: "Apex Legends" }], countryFlag: "🇧🇷", country: "Brazil", rating: 0, bio: "Apex Predator. BR servers mainly.", rank: "Predator" },
  { id: 7, name: "jas4u", sessions: 0, groups: 0, mutualGroups: 0, games: [{ bgColor: "bg-status-warning", name: "MLBB" }], countryFlag: "🇵🇭", country: "Philippines", rating: 0, bio: "MLBB player from the Philippines. Mythic Honor.", rank: "Mythic" },
  { id: 8, name: "texchmexch", sessions: 0, groups: 0, mutualGroups: 0, games: [{ bgColor: "bg-accent", name: "CS2" }], countryFlag: "🇬🇧", country: "United Kingdom", rating: 0, bio: "CS2 player. Faceit Level 8.", rank: "Faceit 8" },
  { id: 9, name: "moyoussef", sessions: 0, groups: 0, mutualGroups: 0, games: [{ bgColor: "bg-status-success", name: "Valorant" }], countryFlag: "🇱🇧", country: "Lebanon", rating: 0, bio: "Valorant player from Lebanon. Platinum rank currently.", rank: "Platinum I" },
  { id: 10, name: "leesick", sessions: 0, groups: 0, mutualGroups: 0, games: [{ bgColor: "bg-status-error", name: "Valorant" }], countryFlag: "🇹🇳", country: "Tunisia", rating: 0, bio: "Just grinding ranked.", rank: "Gold III" },
  { id: 11, name: "verox", sessions: 0, groups: 0, mutualGroups: 0, games: [{ bgColor: "bg-accent", name: "CS2" }], countryFlag: "🇹🇳", country: "Tunisia", rating: 0, bio: "CS2 semi-pro. Looking for team scrims.", rank: "Faceit 10" },
  { id: 12, name: "paradoxsss", sessions: 0, groups: 0, mutualGroups: 0, games: [{ bgColor: "bg-status-warning", name: "MLBB" }], countryFlag: "🇪🇬", country: "Egypt", rating: 0, bio: "MLBB grinder. Ranked sessions daily.", rank: "Legend" },
  { id: 13, name: "taras", sessions: 0, groups: 0, mutualGroups: 0, games: [{ bgColor: "bg-status-success", name: "Dota 2" }], countryFlag: "🇨🇦", country: "Canada", rating: 0, bio: "Dota 2 player. 5k MMR. Looking for party.", rank: "5000 MMR" },
  { id: 14, name: "iqube", sessions: 0, groups: 0, mutualGroups: 0, games: [{ bgColor: "bg-status-error", name: "CS2" }], countryFlag: "🇸🇰", country: "Slovakia", rating: 0, bio: "CS2 main. Faceit Level 7.", rank: "Faceit 7" },
  { id: 15, name: "winter1", sessions: 0, groups: 0, mutualGroups: 0, games: [{ bgColor: "bg-accent", name: "Fortnite" }], countryFlag: "🇸🇦", country: "Saudi Arabia", rating: 0, bio: "Fortnite Champion League player.", rank: "Champion" },
  { id: 16, name: "lord007tn", sessions: 0, groups: 2, mutualGroups: 0, games: [{ bgColor: "bg-status-warning", name: "Apex Legends" }], countryFlag: "🇹🇳", country: "Tunisia", rating: 0, bio: "Apex Predator player from Tunisia. LFG for EU ranked.", rank: "Predator" },
  { id: 17, name: "murexhyena", sessions: 0, groups: 1, mutualGroups: 0, games: [{ bgColor: "bg-status-error", name: "Valorant" }], countryFlag: "🇱🇧", country: "Lebanon", rating: 0, bio: "Valorant Diamond player. IGL. MENA servers.", rank: "Diamond I" },
  { id: 18, name: "azizbecha", sessions: 0, groups: 1, mutualGroups: 0, games: [{ bgColor: "bg-accent", name: "Apex Legends" }], countryFlag: "🇹🇳", country: "Tunisia", rating: 0, bio: "Apex Legends player. Grinding ranked every season.", rank: "Diamond" },
  { id: 19, name: "choxel", sessions: 0, groups: 1, mutualGroups: 0, games: [{ bgColor: "bg-status-success", name: "Valorant" }], countryFlag: "🇫🇷", country: "France", rating: 0, bio: "French Valorant player. Ascendant. LFG for 5 stack.", rank: "Ascendant II" },
  { id: 20, name: "hglyblzs", sessions: 0, groups: 0, mutualGroups: 0, games: [{ bgColor: "bg-status-warning", name: "Fortnite" }], countryFlag: "🇭🇺", country: "Hungary", rating: 0, bio: "Fortnite player from Hungary.", rank: "Contender" },
];

const GAME_OPTIONS = [
  { value: "all", label: "All Games" },
  { value: "mlbb", label: "Mobile Legends: Bang Bang" },
  { value: "apex", label: "Apex Legends" },
  { value: "valorant", label: "Valorant" },
  { value: "overwatch", label: "Overwatch 2" },
];

const COUNTRY_OPTIONS = [
  { value: "all", label: "All countries" },
  { value: "tn", label: "Tunisia" },
  { value: "sa", label: "Saudi Arabia" },
  { value: "eg", label: "Egypt" },
  { value: "lb", label: "Lebanon" },
  { value: "br", label: "Brazil" },
  { value: "in", label: "India" },
  { value: "ph", label: "Philippines" },
  { value: "gb", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "fr", label: "France" },
  { value: "us", label: "United States" },
  { value: "hu", label: "Hungary" },
];

function PlayerProfileView({ player, onBack }: { player: Player; onBack: () => void }) {
  const [friendAdded, setFriendAdded] = useState(false);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <TopBar breadcrumb={
        <Breadcrumbs items={[
          { label: "Players", href: "#" },
          { label: player.name },
        ]} />
      } />
      <main className="flex-1 overflow-y-auto">
        {/* Profile banner */}
        <div className="relative w-full h-[180px] bg-bg-card border-b border-border-default overflow-hidden">
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(153,249,234,0.05) 0%, rgba(0,0,0,0) 100%)" }} />
          <div className="absolute inset-0 flex items-end px-8 pb-0">
            <div className="flex items-end gap-5 mb-0 translate-y-8">
              <div className="size-20 rounded-full bg-bg-surface border-4 border-bg-primary overflow-hidden shrink-0">
                <div className="w-full h-full bg-accent/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-text-accent uppercase">{player.name[0]}</span>
                </div>
              </div>
              <div className="pb-3">
                <h1 className="text-xl font-bold text-text-primary">{player.name}</h1>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <span>{player.countryFlag}</span>
                  <span>{player.country}</span>
                  {player.rank && (
                    <>
                      <span className="text-border-default">·</span>
                      <span className="text-text-accent font-medium">{player.rank}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 pt-14 pb-6 flex gap-6">
          {/* Main column */}
          <div className="flex-1 flex flex-col gap-5">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer w-fit"
            >
              <ArrowLeft size={14} /> Back to Players
            </button>

            {/* Bio */}
            <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-5">
              <h2 className="text-sm font-semibold text-text-primary mb-2">About</h2>
              <p className="text-sm text-text-secondary leading-relaxed">{player.bio || "No bio yet."}</p>
            </div>

            {/* Main games */}
            {player.games.length > 0 && (
              <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-5">
                <h2 className="text-sm font-semibold text-text-primary mb-4">Main Games</h2>
                <div className="flex flex-wrap gap-3">
                  {player.games.map((g, i) => (
                    <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-md)] bg-accent-subtle border border-border-accent/20">
                      <div className={`size-5 rounded-full ${g.bgColor}`} />
                      {g.name && <span className="text-xs text-text-accent font-medium">{g.name}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-5">
              <h2 className="text-sm font-semibold text-text-primary mb-4">Stats</h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-bg-surface rounded-[var(--radius-md)] p-4 flex flex-col items-center gap-1">
                  <Gamepad2 size={18} className="text-text-accent mb-1" />
                  <span className="text-xl font-bold text-text-primary">{player.sessions}</span>
                  <span className="text-xs text-text-tertiary">Sessions</span>
                </div>
                <div className="bg-bg-surface rounded-[var(--radius-md)] p-4 flex flex-col items-center gap-1">
                  <Users size={18} className="text-text-accent mb-1" />
                  <span className="text-xl font-bold text-text-primary">{player.groups}</span>
                  <span className="text-xs text-text-tertiary">Groups</span>
                </div>
                <div className="bg-bg-surface rounded-[var(--radius-md)] p-4 flex flex-col items-center gap-1">
                  <Star size={18} className="text-yellow-400 mb-1" />
                  <span className="text-xl font-bold text-text-primary">{player.rating}</span>
                  <span className="text-xs text-text-tertiary">Rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="w-[220px] shrink-0 flex flex-col gap-4">
            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setFriendAdded(!friendAdded)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-[var(--radius-md)] text-sm font-semibold transition-colors cursor-pointer ${
                  friendAdded
                    ? "border border-border-default text-text-secondary hover:bg-bg-surface"
                    : "bg-accent text-accent-foreground hover:bg-accent-hover"
                }`}
              >
                <UserPlus size={15} />
                {friendAdded ? "Friend Added" : "Add Friend"}
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[var(--radius-md)] border border-border-default text-sm text-text-secondary hover:bg-bg-surface transition-colors cursor-pointer">
                <MessageSquare size={15} />
                Send Message
              </button>
            </div>

            {/* Profile info */}
            <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-4">
              <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">Info</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-text-tertiary" />
                  <span className="text-sm text-text-secondary">{player.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy size={14} className="text-text-tertiary" />
                  <span className="text-sm text-text-secondary">{player.rank || "Unranked"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-text-tertiary" />
                  <span className="text-sm text-text-secondary">{player.mutualGroups} mutual groups</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PlayersPage() {
  const [search, setSearch] = useState("");
  const [game, setGame] = useState("all");
  const [country, setCountry] = useState("all");
  const [view, setView] = useState<"table" | "grid">("table");
  const [sessionsSortDir, setSessionsSortDir] = useState<SortDir>(null);
  const [groupsSortDir, setGroupsSortDir] = useState<SortDir>(null);
  const [selected, setSelected] = useState<Player | null>(null);

  const handleSortSessions = () => {
    setGroupsSortDir(null);
    setSessionsSortDir((prev) =>
      prev === null ? "desc" : prev === "desc" ? "asc" : null
    );
  };

  const handleSortGroups = () => {
    setSessionsSortDir(null);
    setGroupsSortDir((prev) =>
      prev === null ? "desc" : prev === "desc" ? "asc" : null
    );
  };

  const filteredPlayers = PLAYERS.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCountry =
      country === "all" ||
      p.country.toLowerCase().startsWith(
        COUNTRY_OPTIONS.find((o) => o.value === country)?.label.toLowerCase() ?? ""
      );
    return matchesSearch && matchesCountry;
  }).sort((a, b) => {
    if (sessionsSortDir === "asc") return a.sessions - b.sessions;
    if (sessionsSortDir === "desc") return b.sessions - a.sessions;
    if (groupsSortDir === "asc") return a.groups - b.groups;
    if (groupsSortDir === "desc") return b.groups - a.groups;
    return 0;
  });

  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar activeItem="Players" />
      <div className="flex-1 flex flex-col overflow-hidden">
        {selected ? (
          <PlayerProfileView player={selected} onBack={() => setSelected(null)} />
        ) : (
          <>
            <TopBar
              breadcrumb={
                <Breadcrumbs
                  items={[
                    { label: "Rize.gg", href: "/" },
                    { label: "Players" },
                  ]}
                />
              }
            />
            <main className="flex-1 overflow-y-auto px-6 py-8">
              <div className="max-w-6xl mx-auto flex flex-col gap-6">
                {/* Hero Banner */}
                <div className="w-full bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-8 flex items-center gap-6">
                  <div className="shrink-0 size-16 rounded-[var(--radius-md)] bg-accent flex items-center justify-center">
                    <span className="text-accent-foreground text-2xl font-bold tracking-tight">R</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-text-primary">Explore Skilled Players</h1>
                    <p className="text-sm text-text-secondary">
                      Search players, check their vibes, and squad up with those who play like you.
                    </p>
                  </div>
                </div>

                {/* Filter / Controls Row */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <SearchInput
                      placeholder="Search for a player.."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onClear={() => setSearch("")}
                      className="w-full"
                    />
                  </div>
                  <div className="w-44">
                    <Select
                      options={GAME_OPTIONS}
                      value={game}
                      onChange={(e) => setGame(e.target.value)}
                      placeholder="All Games"
                    />
                  </div>
                  <div className="w-44">
                    <Select
                      options={COUNTRY_OPTIONS}
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="All countries"
                    />
                  </div>
                  <ViewToggle activeView={view} onViewChange={setView} />
                </div>

                {/* Table / Grid */}
                {view === "table" ? (
                  <div className="bg-bg-card border border-border-default rounded-[var(--radius-md)] overflow-hidden">
                    {/* Table Header */}
                    <div className="px-4 py-3 border-b border-border-default">
                      <div className="flex items-center justify-between px-1 text-sm text-text-secondary font-normal">
                        <span className="w-[200px]">Player</span>
                        <button
                          onClick={handleSortSessions}
                          className="w-[80px] flex items-center gap-1 cursor-pointer hover:text-text-primary transition-colors"
                        >
                          Sessions
                          {sessionsSortDir === "asc" ? <ChevronUp size={14} /> : sessionsSortDir === "desc" ? <ChevronDown size={14} /> : <ChevronDown size={14} className="opacity-40" />}
                        </button>
                        <button
                          onClick={handleSortGroups}
                          className="w-[100px] flex items-center gap-1 cursor-pointer hover:text-text-primary transition-colors"
                        >
                          Groups
                          {groupsSortDir === "asc" ? <ChevronUp size={14} /> : groupsSortDir === "desc" ? <ChevronDown size={14} /> : <ChevronDown size={14} className="opacity-40" />}
                        </button>
                        <span className="w-[120px]">Main games</span>
                        <span className="w-[140px]">Country</span>
                        <span className="w-[70px]">Rating</span>
                        <span className="w-[80px]">Actions</span>
                      </div>
                    </div>

                    {/* Table Rows */}
                    <div className="divide-y divide-border-subtle">
                      {filteredPlayers.map((player) => (
                        <div key={player.id} className="px-4 py-1">
                          <div className="flex items-center justify-between px-1 py-2 hover:bg-bg-surface-hover/50 transition-colors group rounded-[var(--radius-sm)]">
                            {/* Player */}
                            <div className="flex items-center gap-3 w-[200px]">
                              <Avatar size="sm" />
                              <button
                                onClick={() => setSelected(player)}
                                className="text-sm font-medium text-text-accent hover:underline cursor-pointer truncate text-left"
                              >
                                {player.name}
                              </button>
                            </div>

                            {/* Sessions */}
                            <span className="text-sm text-text-primary w-[80px]">{player.sessions}</span>

                            {/* Groups */}
                            <span className="text-sm text-text-primary w-[100px]">
                              {player.groups}{" "}
                              <span className="text-xs text-text-secondary">/ {player.mutualGroups} mutual</span>
                            </span>

                            {/* Main Games */}
                            <div className="flex items-center gap-1 w-[120px]">
                              {player.games.map((g, i) => (
                                <div key={i} className={`size-7 rounded-full flex items-center justify-center shrink-0 ${g.bgColor}`} />
                              ))}
                            </div>

                            {/* Country */}
                            <div className="flex items-center gap-2 w-[140px]">
                              <span className="text-base leading-none">{player.countryFlag}</span>
                              <span className="text-sm text-text-primary">{player.country}</span>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-1 w-[70px]">
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="#FDDF49" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 1L8.854 5.146L13.5 5.854L10.25 9.021L11.09 13.646L7 11.25L2.91 13.646L3.75 9.021L0.5 5.854L5.146 5.146L7 1Z" />
                              </svg>
                              <span className="text-sm font-medium text-[#FDDF49]">{player.rating}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 w-[80px]">
                              <button
                                onClick={() => setSelected(player)}
                                className="text-text-secondary hover:text-text-accent transition-colors cursor-pointer"
                                aria-label="View profile"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                  <circle cx="12" cy="7" r="4" />
                                </svg>
                              </button>
                              <button
                                className="text-text-secondary hover:text-text-accent transition-colors cursor-pointer"
                                aria-label="Add friend"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                  <circle cx="9" cy="7" r="4" />
                                  <line x1="19" y1="8" x2="19" y2="14" />
                                  <line x1="22" y1="11" x2="16" y2="11" />
                                </svg>
                              </button>
                              <button
                                className="text-text-secondary hover:text-text-accent transition-colors cursor-pointer"
                                aria-label="Message"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {filteredPlayers.length === 0 && (
                      <div className="py-16 flex flex-col items-center gap-2">
                        <span className="text-text-secondary text-sm">No players match your search.</span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Grid View */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredPlayers.map((player) => (
                      <div key={player.id} onClick={() => setSelected(player)} className="cursor-pointer">
                        <PlayerCard
                          name={player.name}
                          country={player.country}
                          games={player.games}
                          rating={player.rating}
                          totalRatings={Math.floor(player.sessions / 5)}
                        />
                      </div>
                    ))}
                    {filteredPlayers.length === 0 && (
                      <div className="col-span-full py-16 flex flex-col items-center gap-2">
                        <span className="text-text-secondary text-sm">No players match your search.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </main>
          </>
        )}
      </div>
    </div>
  );
}
