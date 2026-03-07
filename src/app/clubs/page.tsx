"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { TopBar } from "@/components/navigation/TopBar";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { ClubCard } from "@/components/cards/ClubCard";
import { SearchInput } from "@/components/forms/SearchInput";
import { Toggle } from "@/components/forms/Toggle";
import { Button } from "@/components/buttons/Button";
import { FilterChip } from "@/components/buttons/FilterChip";
import { SlidersHorizontal, Plus, Gamepad2, Swords, Shield, Zap, Target, Flame, Star, Globe2, Trophy, ArrowLeft, Users, Globe, Clock } from "lucide-react";

const CLUBS_DATA = [
  {
    id: "1",
    name: "Nova Esports",
    countryFlag: "https://flagcdn.com/w40/us.png",
    countryName: "United States",
    status: "Recruiting",
    owner: "NovaCaptain",
    timezone: "UTC/GMT +2",
    memberCount: 7,
    memberMax: 20,
    description: "Nova Esports is a professional multi-game esports organization based in the US. We compete at the highest level across CS2, Valorant, and League of Legends.",
    founded: "2022",
    activeGames: [
      { icon: <Swords size={16} className="text-text-accent" />, label: "CS2" },
      { icon: <Shield size={16} className="text-text-accent" />, label: "Val" },
      { icon: <Zap size={16} className="text-text-accent" />, label: "LoL" },
    ],
    recentActivity: ["Won regional CS2 qualifier", "Signed 2 new players", "Ranked #4 in NA Valorant"],
  },
  {
    id: "2",
    name: "Phantom Squad",
    countryFlag: "https://flagcdn.com/w40/de.png",
    countryName: "Germany",
    status: "Recruiting",
    owner: "PhantomX",
    timezone: "UTC/GMT +1",
    memberCount: 3,
    memberMax: 10,
    description: "German tactical FPS squad focused on Valorant and Rainbow Six Siege. We play daily and compete monthly.",
    founded: "2023",
    activeGames: [
      { icon: <Target size={16} className="text-text-accent" />, label: "Val" },
      { icon: <Flame size={16} className="text-text-accent" />, label: "R6" },
    ],
    recentActivity: ["Placed top 8 in EU Valorant Cup", "Recruiting a duelist main"],
  },
  {
    id: "3",
    name: "Iron Forge",
    countryFlag: "https://flagcdn.com/w40/gb.png",
    countryName: "United Kingdom",
    status: "Full",
    owner: "ForgeLeader",
    timezone: "UTC/GMT +0",
    memberCount: 10,
    memberMax: 10,
    description: "UK-based Apex Legends and PUBG clan. We run weekly scrims and monthly internal tournaments.",
    founded: "2021",
    activeGames: [
      { icon: <Gamepad2 size={16} className="text-text-accent" />, label: "Apex" },
      { icon: <Trophy size={16} className="text-text-accent" />, label: "PUBG" },
      { icon: <Star size={16} className="text-text-accent" />, label: "OW2" },
    ],
    recentActivity: ["Full roster — not accepting new members", "Won PUBG community tournament"],
  },
  {
    id: "4",
    name: "Stellar Rising",
    countryFlag: "https://flagcdn.com/w40/fr.png",
    countryName: "France",
    status: "Recruiting",
    owner: "StellarAce",
    timezone: "UTC/GMT +2",
    memberCount: 5,
    memberMax: 15,
    description: "French multi-game club active in CS2 and Dota 2. Looking for dedicated players to grow together.",
    founded: "2022",
    activeGames: [
      { icon: <Swords size={16} className="text-text-accent" />, label: "CS2" },
      { icon: <Globe2 size={16} className="text-text-accent" />, label: "Dota" },
    ],
    recentActivity: ["Placed 2nd in French CS2 league", "Recruiting support players"],
  },
  {
    id: "5",
    name: "Vortex Gaming",
    countryFlag: "https://flagcdn.com/w40/br.png",
    countryName: "Brazil",
    status: "Recruiting",
    owner: "VortexPrime",
    timezone: "UTC/GMT -3",
    memberCount: 8,
    memberMax: 25,
    description: "Largest Brazilian multi-game gaming community. Active in Valorant, LoL, and TFT with regular events.",
    founded: "2020",
    activeGames: [
      { icon: <Target size={16} className="text-text-accent" />, label: "Val" },
      { icon: <Zap size={16} className="text-text-accent" />, label: "LoL" },
      { icon: <Flame size={16} className="text-text-accent" />, label: "TFT" },
    ],
    recentActivity: ["Hosted 200-player Valorant tournament", "Partnered with BR esports org"],
  },
  {
    id: "6",
    name: "Eclipse Clan",
    countryFlag: "https://flagcdn.com/w40/kr.png",
    countryName: "South Korea",
    status: "Full",
    owner: "EclipseKR",
    timezone: "UTC/GMT +9",
    memberCount: 20,
    memberMax: 20,
    description: "Elite Korean LoL and Dota 2 clan. All members are Diamond+ with multiple tournament wins.",
    founded: "2019",
    activeGames: [
      { icon: <Zap size={16} className="text-text-accent" />, label: "LoL" },
      { icon: <Globe2 size={16} className="text-text-accent" />, label: "Dota" },
    ],
    recentActivity: ["5 members promoted to Master this season", "Roster is full"],
  },
  {
    id: "7",
    name: "Arctic Wolves",
    countryFlag: "https://flagcdn.com/w40/se.png",
    countryName: "Sweden",
    status: "Recruiting",
    owner: "ArcticAlpha",
    timezone: "UTC/GMT +1",
    memberCount: 4,
    memberMax: 12,
    description: "Scandinavian CS2 and R6 Siege team. Focus on structured gameplay and continuous improvement.",
    founded: "2023",
    activeGames: [
      { icon: <Swords size={16} className="text-text-accent" />, label: "CS2" },
      { icon: <Shield size={16} className="text-text-accent" />, label: "R6" },
    ],
    recentActivity: ["Looking for IGL for CS2 roster", "Started weekly R6 review sessions"],
  },
  {
    id: "8",
    name: "Cyber Titans",
    countryFlag: "https://flagcdn.com/w40/jp.png",
    countryName: "Japan",
    status: "Recruiting",
    owner: "TitanJP",
    timezone: "UTC/GMT +9",
    memberCount: 6,
    memberMax: 18,
    description: "Japanese gaming collective active in Apex, Valorant, and Overwatch 2. Welcoming all skill levels.",
    founded: "2022",
    activeGames: [
      { icon: <Gamepad2 size={16} className="text-text-accent" />, label: "Apex" },
      { icon: <Target size={16} className="text-text-accent" />, label: "Val" },
      { icon: <Star size={16} className="text-text-accent" />, label: "OW2" },
    ],
    recentActivity: ["Joined APAC Overwatch 2 league", "Recruiting Apex Predator players"],
  },
  {
    id: "9",
    name: "Shadow Protocol",
    countryFlag: "https://flagcdn.com/w40/ca.png",
    countryName: "Canada",
    status: "Recruiting",
    owner: "ShadowCA",
    timezone: "UTC/GMT -5",
    memberCount: 9,
    memberMax: 20,
    description: "Canadian PUBG and Apex squad with a competitive mindset. Daily sessions and ranked pushes.",
    founded: "2021",
    activeGames: [
      { icon: <Trophy size={16} className="text-text-accent" />, label: "PUBG" },
      { icon: <Flame size={16} className="text-text-accent" />, label: "Apex" },
    ],
    recentActivity: ["Top 3 in PUBG NA community cup", "Looking for Apex Legends coaches"],
  },
];

const FILTER_OPTIONS = ["All Games", "CS2", "Valorant", "League of Legends", "Apex Legends", "Dota 2"];

type Club = typeof CLUBS_DATA[0];

function ClubDetailView({ club, onBack, onJoin }: { club: Club; onBack: () => void; onJoin: () => void }) {
  const [joined, setJoined] = useState(false);
  const spotsLeft = club.memberMax - club.memberCount;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <TopBar breadcrumb={
        <Breadcrumbs items={[
          { label: "Clubs", href: "#" },
          { label: club.name },
        ]} />
      } />
      <main className="flex-1 overflow-y-auto">
        {/* Hero */}
        <div className="relative w-full h-[180px] bg-bg-card border-b border-border-default overflow-hidden flex items-center justify-center">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: "linear-gradient(135deg, rgba(153,249,234,0.3) 0%, rgba(0,0,0,0) 100%)",
            }}
          />
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="size-16 rounded-[var(--radius-lg)] bg-bg-surface border border-border-default flex items-center justify-center">
              <span className="text-2xl font-bold text-text-accent">{club.name[0]}</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-xl font-bold text-text-primary">{club.name}</h1>
                <img src={club.countryFlag} alt={club.countryName} className="h-4 rounded-sm" />
              </div>
              <p className="text-sm text-text-secondary mt-0.5">By {club.owner}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 flex gap-6">
          {/* Main */}
          <div className="flex-1 flex flex-col gap-5">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer w-fit"
            >
              <ArrowLeft size={14} /> Back to Clubs
            </button>

            {/* About */}
            <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-5">
              <h2 className="text-sm font-semibold text-text-primary mb-2">About</h2>
              <p className="text-sm text-text-secondary leading-relaxed">{club.description}</p>
            </div>

            {/* Active games */}
            <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-5">
              <h2 className="text-sm font-semibold text-text-primary mb-4">Active Games</h2>
              <div className="flex flex-wrap gap-2">
                {club.activeGames.map((g, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] bg-accent-subtle border border-border-accent/20">
                    {g.icon}
                    <span className="text-xs text-text-accent font-medium">{g.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-5">
              <h2 className="text-sm font-semibold text-text-primary mb-3">Recent Activity</h2>
              <div className="flex flex-col gap-2.5">
                {club.recentActivity.map((a, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                    <div className="size-1.5 rounded-full bg-border-accent mt-2 shrink-0" />
                    {a}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-[240px] shrink-0 flex flex-col gap-4">
            <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-5">
              <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-4">Club Info</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-text-secondary"><Users size={14} /> Members</div>
                  <span className="text-sm font-semibold text-text-primary">{club.memberCount}/{club.memberMax}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-text-secondary"><Globe size={14} /> Timezone</div>
                  <span className="text-sm font-semibold text-text-primary">{club.timezone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-text-secondary"><Clock size={14} /> Founded</div>
                  <span className="text-sm font-semibold text-text-primary">{club.founded}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">Status</div>
                  <span className={`text-sm font-semibold ${club.status === "Full" ? "text-status-error" : "text-status-success"}`}>
                    {club.status}
                  </span>
                </div>
              </div>
            </div>

            {club.status !== "Full" ? (
              <button
                onClick={() => setJoined(!joined)}
                className={`w-full py-2.5 rounded-[var(--radius-md)] text-sm font-semibold transition-colors cursor-pointer ${
                  joined
                    ? "border border-border-default text-text-secondary bg-transparent hover:bg-bg-surface"
                    : "bg-accent text-accent-foreground hover:bg-accent-hover"
                }`}
              >
                {joined ? "Leave Club" : "Join Club"}
              </button>
            ) : (
              <button disabled className="w-full py-2.5 rounded-[var(--radius-md)] border border-border-default text-sm text-text-tertiary cursor-not-allowed">
                Club is Full
              </button>
            )}

            {spotsLeft > 0 && club.status !== "Full" && !joined && (
              <p className="text-xs text-text-tertiary text-center -mt-2">{spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} remaining</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ClubsPage() {
  const [search, setSearch] = useState("");
  const [showMyClubs, setShowMyClubs] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All Games");
  const [selected, setSelected] = useState<Club | null>(null);

  const filteredClubs = CLUBS_DATA.filter((club) => {
    const matchesSearch =
      search.trim() === "" ||
      club.name.toLowerCase().includes(search.toLowerCase()) ||
      club.activeGames.some((g) => g.label?.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar activeItem="Clubs" />
      <div className="flex-1 flex flex-col overflow-hidden">
        {selected ? (
          <ClubDetailView club={selected} onBack={() => setSelected(null)} onJoin={() => {}} />
        ) : (
          <>
            <TopBar
              breadcrumb={
                <Breadcrumbs
                  items={[
                    { label: "Rize.gg", href: "/" },
                    { label: "Clubs" },
                  ]}
                />
              }
            />
            <main className="flex-1 overflow-y-auto px-6 py-8">
              {/* Page Header */}
              <div className="flex flex-col gap-4 mb-6">
                {/* Title row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-text-primary">Clubs</h1>
                    <Toggle
                      checked={showMyClubs}
                      onChange={setShowMyClubs}
                      label="Show my clubs"
                    />
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    leftIcon={<Plus size={16} />}
                  >
                    Create Club
                  </Button>
                </div>

                {/* Search + Filters row */}
                <div className="flex items-center gap-3">
                  <SearchInput
                    className="w-80"
                    placeholder="Search by game or club name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onClear={() => setSearch("")}
                  />
                  <div className="flex items-center gap-2 flex-1 overflow-x-auto">
                    {FILTER_OPTIONS.map((filter) => (
                      <FilterChip
                        key={filter}
                        active={activeFilter === filter}
                        onClick={() => setActiveFilter(filter)}
                      >
                        {filter}
                      </FilterChip>
                    ))}
                  </div>
                  <Button
                    variant="secondary"
                    size="md"
                    leftIcon={<SlidersHorizontal size={16} />}
                  >
                    Filters
                  </Button>
                </div>
              </div>

              {/* Clubs Grid */}
              {filteredClubs.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {filteredClubs.map((club) => (
                    <ClubCard
                      key={club.id}
                      name={club.name}
                      countryFlag={club.countryFlag}
                      status={club.status}
                      owner={club.owner}
                      timezone={club.timezone}
                      memberCount={club.memberCount}
                      memberMax={club.memberMax}
                      activeGames={club.activeGames}
                      onDetails={() => setSelected(club)}
                      onJoin={() => setSelected(club)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                  <span className="text-text-secondary text-base">No clubs found matching your search.</span>
                  <Button variant="outline" size="md" onClick={() => setSearch("")}>
                    Clear search
                  </Button>
                </div>
              )}
            </main>
          </>
        )}
      </div>
    </div>
  );
}
