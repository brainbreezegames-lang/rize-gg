"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { TopBar } from "@/components/navigation/TopBar";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { SearchInput } from "@/components/forms/SearchInput";
import { Users, ChevronLeft, ChevronRight, ArrowLeft, Globe, Trophy, Shield } from "lucide-react";

const FEDERATIONS = [
  { id: "1", name: "Jordan Esports Federation", countryCode: "jo", country: "Jordan", members: 1, games: ["MLBB", "Valorant"], description: "The leading esports federation representing Jordan in international gaming competitions. Dedicated to growing the esports ecosystem and nurturing local talent.", founded: "2021", tournaments: 3 },
  { id: "2", name: "France Esports Federation", countryCode: "fr", country: "France", members: 1, games: ["CS2", "League of Legends", "Valorant"], description: "France's premier esports organization connecting players, teams, and tournaments across the country.", founded: "2019", tournaments: 12 },
  { id: "3", name: "Iraq Esports Federation", countryCode: "iq", country: "Iraq", members: 1, games: ["MLBB", "Fortnite"], description: "Growing Iraq's competitive gaming scene and representing the country in international esports events.", founded: "2022", tournaments: 2 },
  { id: "4", name: "Brazil Esports Federation", countryCode: "br", country: "Brazil", members: 1, games: ["CS2", "Valorant", "League of Legends"], description: "One of South America's most active esports federations, driving competitive gaming culture in Brazil.", founded: "2018", tournaments: 24 },
  { id: "5", name: "Lebanon Esports Federation", countryCode: "lb", country: "Lebanon", members: 1, games: ["Apex Legends", "MLBB"], description: "Representing Lebanon in the global esports arena with passion and dedication.", founded: "2020", tournaments: 5 },
  { id: "6", name: "Tunisia Gaming League", countryCode: "tn", country: "Tunisia", members: 1, games: ["Valorant", "CS2", "Apex Legends"], description: "Tunisia's leading gaming federation promoting esports development and competitive excellence.", founded: "2019", tournaments: 8 },
  { id: "7", name: "Saudi Arabia Esports Federation", countryCode: "sa", country: "Saudi Arabia", members: 1, games: ["MLBB", "Valorant", "Fortnite"], description: "The premier esports organization for Saudi Arabia, fostering competitive gaming excellence and talent development.", founded: "2017", tournaments: 31 },
  { id: "8", name: "Egypt Gaming Federation", countryCode: "eg", country: "Egypt", members: 1, games: ["CS2", "MLBB", "Valorant"], description: "The official gaming federation representing Egypt in international esports competitions.", founded: "2020", tournaments: 7 },
];

const COUNTRY_OPTIONS = [
  { value: "all", label: "Select your country" },
  { value: "jo", label: "Jordan" },
  { value: "fr", label: "France" },
  { value: "iq", label: "Iraq" },
  { value: "br", label: "Brazil" },
  { value: "lb", label: "Lebanon" },
  { value: "tn", label: "Tunisia" },
  { value: "sa", label: "Saudi Arabia" },
  { value: "eg", label: "Egypt" },
];

type Fed = (typeof FEDERATIONS)[0];

function FederationDetail({ fed, onBack }: { fed: Fed; onBack: () => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <TopBar breadcrumb={
        <Breadcrumbs items={[
          { label: "Federations", href: "#" },
          { label: fed.name },
        ]} />
      } />
      <main className="flex-1 overflow-y-auto">
        {/* Hero */}
        <div className="relative w-full h-[200px] bg-bg-card border-b border-border-default overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: `url(https://flagcdn.com/w640/${fed.countryCode}.png)`, backgroundSize: "cover", backgroundPosition: "center" }}
          />
          <div className="relative z-10 flex flex-col items-center gap-3">
            <img src={`https://flagcdn.com/w160/${fed.countryCode}.png`} alt={fed.country} className="h-16 rounded-[var(--radius-md)] shadow-lg" />
            <h1 className="text-2xl font-bold text-text-primary">{fed.name}</h1>
            <p className="text-sm text-text-secondary">{fed.country}</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 flex gap-6">
          <div className="flex-1">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors cursor-pointer mb-6"
            >
              <ArrowLeft size={14} /> Back to Federations
            </button>

            <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-5 mb-4">
              <h2 className="text-sm font-semibold text-text-primary mb-2">About</h2>
              <p className="text-sm text-text-secondary leading-relaxed">{fed.description}</p>
            </div>

            <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-5">
              <h2 className="text-sm font-semibold text-text-primary mb-4">Active Games</h2>
              <div className="flex flex-wrap gap-2">
                {fed.games.map((g) => (
                  <span key={g} className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-accent-subtle border border-border-accent/20 text-xs text-text-accent font-medium">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="w-[240px] shrink-0 flex flex-col gap-4">
            <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-5">
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">Stats</h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-text-secondary"><Users size={14} /> Members</div>
                  <span className="text-sm font-semibold text-text-primary">{fed.members}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-text-secondary"><Trophy size={14} /> Tournaments</div>
                  <span className="text-sm font-semibold text-text-primary">{fed.tournaments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-text-secondary"><Globe size={14} /> Country</div>
                  <span className="text-sm font-semibold text-text-primary">{fed.country}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-text-secondary"><Shield size={14} /> Founded</div>
                  <span className="text-sm font-semibold text-text-primary">{fed.founded}</span>
                </div>
              </div>
            </div>
            <button className="w-full py-2.5 rounded-[var(--radius-md)] bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent-hover transition-colors cursor-pointer">
              Join Federation
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function FederationsPage() {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [selected, setSelected] = useState<Fed | null>(null);

  const filtered = FEDERATIONS.filter((f) => {
    const matchesSearch = search.trim() === "" || f.name.toLowerCase().includes(search.toLowerCase());
    const matchesCountry = country === "all" || f.countryCode === country;
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar activeItem="Federations" />
      <div className="flex-1 flex flex-col overflow-hidden">
        {selected ? (
          <FederationDetail fed={selected} onBack={() => setSelected(null)} />
        ) : (
          <>
            <TopBar breadcrumb={<Breadcrumbs items={[{ label: "Federations" }]} />} />
            <main className="flex-1 overflow-y-auto">
              {/* Hero banner */}
              <div className="relative w-full min-h-[220px] bg-bg-card border-b border-border-default overflow-hidden flex flex-col items-center justify-center px-6 py-12">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: "url(https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/1280px-World_map_-_low_resolution.svg.png)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "sepia(1) hue-rotate(300deg)",
                  }}
                />
                <div className="relative z-10 text-center">
                  <h1 className="text-3xl font-bold text-text-primary mb-3">
                    {FEDERATIONS.length} Federations, One community
                  </h1>
                  <p className="text-text-secondary text-sm max-w-2xl">
                    Uniting gamers worldwide under one network, building connections and shaping the future of E-sports together.
                  </p>
                </div>
              </div>

              <div className="px-6 py-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-semibold text-text-primary">Federations</h2>
                  <div className="flex items-center gap-3">
                    <SearchInput
                      placeholder="Search federations..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onClear={() => setSearch("")}
                      className="w-72"
                    />
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="h-10 px-3 rounded-[var(--radius-md)] border border-border-default bg-bg-input text-sm text-text-primary outline-none focus:border-border-accent cursor-pointer"
                    >
                      {COUNTRY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {filtered.map((fed) => (
                    <button
                      key={fed.id}
                      onClick={() => setSelected(fed)}
                      className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-4 flex items-center gap-3 hover:border-border-accent/50 hover:bg-bg-surface transition-colors cursor-pointer text-left"
                    >
                      <img
                        src={`https://flagcdn.com/w80/${fed.countryCode}.png`}
                        alt={fed.name}
                        className="w-12 h-9 object-cover rounded-[var(--radius-sm)] shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">{fed.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Users size={12} className="text-text-tertiary" />
                          <span className="text-xs text-text-tertiary">{fed.members} member{fed.members !== 1 ? "s" : ""}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border-subtle">
                  <span className="text-sm text-text-secondary">Showing 1–{filtered.length} of {filtered.length}</span>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-text-secondary border border-border-default rounded-[var(--radius-sm)] hover:bg-bg-surface transition-colors cursor-pointer disabled:opacity-40" disabled>
                      <ChevronLeft size={14} /> Previous
                    </button>
                    <span className="w-8 h-8 flex items-center justify-center text-sm font-medium text-text-accent bg-accent-subtle border border-border-accent/30 rounded-[var(--radius-sm)]">1</span>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-text-secondary border border-border-default rounded-[var(--radius-sm)] hover:bg-bg-surface transition-colors cursor-pointer disabled:opacity-40" disabled>
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </>
        )}
      </div>
    </div>
  );
}
