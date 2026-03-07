/**
 * Stripped source of each editable page — no import statements.
 * All components are available in liveScope at runtime.
 * Used as context when the AI edits an existing page.
 */

export const PAGE_SOURCES: Record<string, string> = {
  home: `
const ACTIVE_GROUPS = [
  { id: "1", name: "raed night", owner: "lord007tn", game: "Apex Legends", gameImage: "https://static-cdn.jtvnw.net/ttv-boxart/Apex%20Legends-285x380.jpg", slotsUsed: 4, slotsTotal: 3, slotText: "-1 Slot available", timeAgo: "20 days ago", skillRequirement: "Silver I", note: undefined, requiresRequest: false, members: [{ username: "lord007tn", avatar: "https://lh3.googleusercontent.com/a/ACg8ocK5EX5irZBct3OpQQO_5wNfH8z79S46f8zzKIBsQhf0arnloNc8=s96-c", isOwner: true }, { username: "azizbecha", avatar: "https://lh3.googleusercontent.com/a/ACg8ocL_GUJfwCYMwPgywoGxf8FnGR1oq_IoJk_IVn-L7dPaWiR-Gzsx=s96-c", isOwner: false }, { username: "hglyblzs", avatar: null, isOwner: false }, { username: "choxel", avatar: "https://lh3.googleusercontent.com/a/ACg8ocKCrsXsBt0lHA6pIedv1Mjp_4vxAEGs_bGqXmE0nVjhxZDB1Z8=s96-c", isOwner: false }] },
  { id: "2", name: "Late night valo", owner: "sirius", game: "Valorant", gameImage: "https://static-cdn.jtvnw.net/ttv-boxart/VALORANT-285x380.jpg", slotsUsed: 2, slotsTotal: 5, slotText: "3 Slots available", timeAgo: "22 days ago", skillRequirement: "Radiant", note: "Long note is being tested. Long note is bein...", requiresRequest: false, members: [{ username: "sirius", avatar: "https://lh3.googleusercontent.com/a/ACg8ocIDHpN23i-I4B7mHMoS0wj_PJ2Eg4Gk-6GS9HsK=s96-c", isOwner: true }, { username: "murexhyena", avatar: "https://lh3.googleusercontent.com/a/ACg8ocKY14j2kNBcnQ4cFTIrNUl_v-8B2rbxjr8dOGziUMwwxa_CLD8=s96-c", isOwner: false }] },
  { id: "3", name: "profitable tooth Squad", owner: "paul_silva", game: "Honor of Kings", gameImage: "https://static-cdn.jtvnw.net/ttv-boxart/Honor%20of%20Kings-285x380.jpg", slotsUsed: 1, slotsTotal: 5, slotText: "4 Slots available", timeAgo: "23 days ago", skillRequirement: "Bronze III", note: undefined, requiresRequest: true, members: [{ username: "paul_silva", avatar: null, isOwner: true }] },
];

function MemberAvatar({ member }) {
  return (
    <div className="relative shrink-0">
      <div className="size-12 rounded-full overflow-hidden border-2 border-bg-primary">
        {member.avatar ? <img src={member.avatar} alt={member.username} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-bg-surface flex items-center justify-center"><span className="text-sm font-bold text-text-accent uppercase">{member.username[0]}</span></div>}
      </div>
      {member.isOwner && <div className="absolute -top-1.5 left-1/2 -translate-x-1/2"><Crown size={12} className="text-yellow-400 fill-yellow-400" /></div>}
    </div>
  );
}

function GroupCard({ group }) {
  const openSlots = Math.max(0, group.slotsTotal - group.slotsUsed);
  return (
    <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-4 flex flex-col gap-3 hover:border-border-accent/30 transition-colors cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-full overflow-hidden shrink-0 border border-border-default"><img src={group.gameImage} alt={group.game} className="w-full h-full object-cover" /></div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-text-primary leading-tight">{group.name}</h3>
          <div className="flex items-center gap-1 text-xs text-text-secondary mt-0.5 flex-wrap">
            <span>By</span><span className="text-text-accent font-medium">{group.owner}</span>
            <span className="text-border-default mx-0.5">|</span>
            <Gamepad2 size={11} className="text-text-tertiary" /><span className="truncate">{group.game}</span>
          </div>
        </div>
        <button className="text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer shrink-0 mt-0.5"><MoreVertical size={16} /></button>
      </div>
      <div className="flex items-center gap-2 text-xs text-text-secondary">
        <Users size={12} className="shrink-0" /><span className="font-medium text-text-primary">{group.slotsUsed}/{group.slotsTotal}</span>
        <span className="text-border-default">|</span><span>{group.slotText}</span>
        <span className="text-border-default">|</span><Clock size={12} className="shrink-0" /><span>{group.timeAgo}</span>
      </div>
      <div className="flex items-center gap-1.5">
        {group.members.map((m, i) => <MemberAvatar key={i} member={m} />)}
        {openSlots > 0 && <div className="size-12 rounded-full border-2 border-dashed border-border-default flex items-center justify-center shrink-0"><span className="text-xs text-text-tertiary font-medium">+{openSlots}</span></div>}
      </div>
      {group.note && <div className="flex items-center gap-1.5 text-xs text-text-secondary"><MessageSquare size={12} className="shrink-0 text-text-tertiary" /><span className="truncate">{group.note}</span></div>}
      <div className="border-t border-border-default" />
      <div className="flex items-center gap-1.5 text-xs text-text-secondary"><Shield size={12} className="shrink-0 text-text-tertiary" /><span>Skill requirement: <span className="text-text-primary">{group.skillRequirement}</span></span></div>
      <div className="flex gap-2">
        <button className="flex-1 py-2 rounded-[var(--radius-md)] border border-border-default text-text-primary text-xs font-medium hover:bg-bg-surface-hover transition-colors cursor-pointer">Group details</button>
        <button className="flex-1 py-2 rounded-[var(--radius-md)] border border-border-accent text-text-accent text-xs font-medium hover:bg-accent-subtle transition-colors cursor-pointer">{group.requiresRequest ? "Request to join →" : "Join →"}</button>
      </div>
    </div>
  );
}

function GeneratedPage() {
  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar activeItem="Home" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumb={<Breadcrumbs items={[{ label: "Dashboard" }]} />} />
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-6">
            <div className="flex gap-5">
              <div className="flex-1 rounded-[var(--radius-xl)] overflow-hidden relative bg-bg-card" style={{ minHeight: "360px" }}>
                <img src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg" alt="Hero" className="absolute inset-0 w-full h-full object-cover object-right" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B1211] via-[#0B1211]/80 to-transparent" />
                <div className="relative z-10 flex flex-col justify-end h-full p-8 pb-7 gap-3">
                  <p className="text-xs text-text-secondary">Welcome Back, <span className="text-text-primary font-medium">demo</span></p>
                  <h1 className="text-[38px] font-bold text-white leading-[1.15]">Up to <span className="text-text-accent">Squad up</span><br />Today ?</h1>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <img src="https://static-cdn.jtvnw.net/ttv-boxart/League%20of%20Legends-285x380.jpg" alt="LoL" className="size-4 rounded-sm object-cover" />
                    <span>Rift's calling.. Claim your victory.</span>
                  </div>
                  <button className="w-fit mt-1 px-5 py-2 rounded-[var(--radius-md)] border border-border-accent text-text-accent text-sm font-medium hover:bg-accent-subtle transition-colors cursor-pointer">Find your team</button>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="h-1.5 w-5 rounded-full bg-accent" />
                    <div className="size-1.5 rounded-full bg-border-default" />
                    <div className="size-1.5 rounded-full bg-border-default" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-[280px] shrink-0">
                <div className="flex-1 bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between"><span className="text-sm text-text-secondary">Total sessions</span><Gamepad2 size={18} className="text-text-tertiary" /></div>
                  <div><p className="text-5xl font-bold text-text-primary leading-none">0</p><p className="text-xs text-text-secondary mt-2">0 Hours</p></div>
                </div>
                <div className="flex-1 rounded-[var(--radius-lg)] p-5 flex flex-col justify-between relative overflow-hidden border border-border-default" style={{ background: "linear-gradient(135deg, #1A1430 0%, #121415 100%)" }}>
                  <div className="flex items-center justify-between"><span className="text-sm text-text-secondary">Login Streak</span><Users size={18} className="text-[#8B7FD4]" /></div>
                  <div><p className="text-5xl font-bold text-text-primary leading-none">1</p><p className="text-xs text-text-secondary mt-2">Day</p></div>
                </div>
                <div className="flex-1 rounded-[var(--radius-lg)] p-5 flex flex-col justify-between relative overflow-hidden border border-border-default" style={{ background: "linear-gradient(135deg, #1A1430 0%, #121415 100%)" }}>
                  <div className="flex items-center justify-between"><span className="text-sm text-text-secondary">Available friends</span><Users size={18} className="text-[#8B7FD4]" /></div>
                  <div><p className="text-5xl font-bold text-text-primary leading-none">0</p><p className="text-xs text-text-secondary mt-2">Online</p></div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-text-primary">Active groups</h2>
                <button className="flex items-center gap-1 text-sm text-text-accent hover:underline cursor-pointer">Browse All <ChevronRight size={14} /></button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {ACTIVE_GROUPS.map((group) => <GroupCard key={group.id} group={group} />)}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}`,

  clubs: `
const CLUBS_DATA = [
  { name: "Nova Esports", countryFlag: "https://flagcdn.com/w40/us.png", status: "Recruiting", owner: "NovaCaptain", timezone: "UTC/GMT +2", memberCount: 7, memberMax: 20, activeGames: [{ icon: <Swords size={16} className="text-text-accent" />, label: "CS2" }, { icon: <Shield size={16} className="text-text-accent" />, label: "Val" }, { icon: <Zap size={16} className="text-text-accent" />, label: "LoL" }] },
  { name: "Phantom Squad", countryFlag: "https://flagcdn.com/w40/de.png", status: "Recruiting", owner: "PhantomX", timezone: "UTC/GMT +1", memberCount: 3, memberMax: 10, activeGames: [{ icon: <Target size={16} className="text-text-accent" />, label: "Val" }, { icon: <Flame size={16} className="text-text-accent" />, label: "R6" }] },
  { name: "Iron Forge", countryFlag: "https://flagcdn.com/w40/gb.png", status: "Full", owner: "ForgeLeader", timezone: "UTC/GMT +0", memberCount: 10, memberMax: 10, activeGames: [{ icon: <Gamepad2 size={16} className="text-text-accent" />, label: "Apex" }, { icon: <Trophy size={16} className="text-text-accent" />, label: "PUBG" }, { icon: <Star size={16} className="text-text-accent" />, label: "OW2" }] },
  { name: "Stellar Rising", countryFlag: "https://flagcdn.com/w40/fr.png", status: "Recruiting", owner: "StellarAce", timezone: "UTC/GMT +2", memberCount: 5, memberMax: 15, activeGames: [{ icon: <Swords size={16} className="text-text-accent" />, label: "CS2" }, { icon: <Globe2 size={16} className="text-text-accent" />, label: "Dota" }] },
  { name: "Vortex Gaming", countryFlag: "https://flagcdn.com/w40/br.png", status: "Recruiting", owner: "VortexPrime", timezone: "UTC/GMT -3", memberCount: 8, memberMax: 25, activeGames: [{ icon: <Target size={16} className="text-text-accent" />, label: "Val" }, { icon: <Zap size={16} className="text-text-accent" />, label: "LoL" }] },
  { name: "Eclipse Clan", countryFlag: "https://flagcdn.com/w40/kr.png", status: "Full", owner: "EclipseKR", timezone: "UTC/GMT +9", memberCount: 20, memberMax: 20, activeGames: [{ icon: <Zap size={16} className="text-text-accent" />, label: "LoL" }, { icon: <Globe2 size={16} className="text-text-accent" />, label: "Dota" }] },
  { name: "Arctic Wolves", countryFlag: "https://flagcdn.com/w40/se.png", status: "Recruiting", owner: "ArcticAlpha", timezone: "UTC/GMT +1", memberCount: 4, memberMax: 12, activeGames: [{ icon: <Swords size={16} className="text-text-accent" />, label: "CS2" }, { icon: <Shield size={16} className="text-text-accent" />, label: "R6" }] },
  { name: "Cyber Titans", countryFlag: "https://flagcdn.com/w40/jp.png", status: "Recruiting", owner: "TitanJP", timezone: "UTC/GMT +9", memberCount: 6, memberMax: 18, activeGames: [{ icon: <Gamepad2 size={16} className="text-text-accent" />, label: "Apex" }, { icon: <Target size={16} className="text-text-accent" />, label: "Val" }] },
  { name: "Shadow Protocol", countryFlag: "https://flagcdn.com/w40/ca.png", status: "Recruiting", owner: "ShadowCA", timezone: "UTC/GMT -5", memberCount: 9, memberMax: 20, activeGames: [{ icon: <Trophy size={16} className="text-text-accent" />, label: "PUBG" }, { icon: <Flame size={16} className="text-text-accent" />, label: "Apex" }] },
];
const FILTER_OPTIONS = ["All Games", "CS2", "Valorant", "League of Legends", "Apex Legends", "Dota 2"];

function GeneratedPage() {
  const [search, setSearch] = useState("");
  const [showMyClubs, setShowMyClubs] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All Games");
  const filteredClubs = CLUBS_DATA.filter((club) => {
    const matchesSearch = search.trim() === "" || club.name.toLowerCase().includes(search.toLowerCase()) || club.activeGames.some((g) => g.label?.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });
  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumb={<Breadcrumbs items={[{ label: "Rize.gg", href: "/" }, { label: "Clubs" }]} />} />
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-text-primary">Clubs</h1>
                <Toggle checked={showMyClubs} onChange={setShowMyClubs} label="Show my clubs" />
              </div>
              <Button variant="primary" size="md" leftIcon={<Plus size={16} />}>Create Club</Button>
            </div>
            <div className="flex items-center gap-3">
              <SearchInput className="w-80" placeholder="Search by game or club name..." value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch("")} />
              <div className="flex items-center gap-2 flex-1 overflow-x-auto">
                {FILTER_OPTIONS.map((filter) => (<FilterChip key={filter} active={activeFilter === filter} onClick={() => setActiveFilter(filter)}>{filter}</FilterChip>))}
              </div>
              <Button variant="secondary" size="md" leftIcon={<SlidersHorizontal size={16} />}>Filters</Button>
            </div>
          </div>
          {filteredClubs.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {filteredClubs.map((club, i) => (<ClubCard key={i} name={club.name} countryFlag={club.countryFlag} status={club.status} owner={club.owner} timezone={club.timezone} memberCount={club.memberCount} memberMax={club.memberMax} activeGames={club.activeGames} onOpen={() => {}} />))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <span className="text-text-secondary text-base">No clubs found matching your search.</span>
              <Button variant="outline" size="md" onClick={() => setSearch("")}>Clear search</Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}`,

  players: `
const PLAYERS = [
  { id: 1, name: "demo", sessions: 0, groups: 0, mutualGroups: 0, games: [], countryFlag: "🇺🇸", country: "United States", rating: 0 },
  { id: 2, name: "nadia_db", sessions: 0, groups: 0, mutualGroups: 0, games: [{ bgColor: "bg-status-warning" }], countryFlag: "🇹🇳", country: "Tunisia", rating: 0 },
  { id: 3, name: "diljeet", sessions: 0, groups: 0, mutualGroups: 0, games: [{ bgColor: "bg-status-error" }], countryFlag: "🇮🇳", country: "India", rating: 0 },
  { id: 4, name: "sirius", sessions: 0, groups: 1, mutualGroups: 0, games: [{ bgColor: "bg-accent" }], countryFlag: "🇸🇦", country: "Saudi Arabia", rating: 0 },
  { id: 5, name: "paradox", sessions: 0, groups: 1, mutualGroups: 0, games: [{ bgColor: "bg-status-success" }], countryFlag: "🇪🇬", country: "Egypt", rating: 0 },
  { id: 6, name: "savano", sessions: 0, groups: 1, mutualGroups: 0, games: [{ bgColor: "bg-status-error" }], countryFlag: "🇧🇷", country: "Brazil", rating: 0 },
  { id: 7, name: "jas4u", sessions: 0, groups: 0, mutualGroups: 0, games: [{ bgColor: "bg-status-warning" }], countryFlag: "🇵🇭", country: "Philippines", rating: 0 },
  { id: 8, name: "texchmexch", sessions: 0, groups: 0, mutualGroups: 0, games: [{ bgColor: "bg-accent" }], countryFlag: "🇬🇧", country: "United Kingdom", rating: 0 },
  { id: 9, name: "moyoussef", sessions: 0, groups: 0, mutualGroups: 0, games: [{ bgColor: "bg-status-success" }], countryFlag: "🇱🇧", country: "Lebanon", rating: 0 },
  { id: 10, name: "leesick", sessions: 0, groups: 0, mutualGroups: 0, games: [{ bgColor: "bg-status-error" }], countryFlag: "🇹🇳", country: "Tunisia", rating: 0 },
  { id: 11, name: "lord007tn", sessions: 0, groups: 2, mutualGroups: 0, games: [{ bgColor: "bg-status-warning" }], countryFlag: "🇹🇳", country: "Tunisia", rating: 0 },
  { id: 12, name: "murexhyena", sessions: 0, groups: 1, mutualGroups: 0, games: [{ bgColor: "bg-status-error" }], countryFlag: "🇱🇧", country: "Lebanon", rating: 0 },
  { id: 13, name: "hglyblzs", sessions: 0, groups: 0, mutualGroups: 0, games: [{ bgColor: "bg-accent" }], countryFlag: "🇭🇺", country: "Hungary", rating: 0 },
];
const GAME_OPTIONS = [{ value: "all", label: "All Games" }, { value: "mlbb", label: "Mobile Legends: Bang Bang" }, { value: "apex", label: "Apex Legends" }, { value: "valorant", label: "Valorant" }, { value: "overwatch", label: "Overwatch 2" }];
const COUNTRY_OPTIONS = [{ value: "all", label: "All countries" }, { value: "tn", label: "Tunisia" }, { value: "sa", label: "Saudi Arabia" }, { value: "eg", label: "Egypt" }, { value: "lb", label: "Lebanon" }, { value: "br", label: "Brazil" }];

function GeneratedPage() {
  const [search, setSearch] = useState("");
  const [game, setGame] = useState("all");
  const [country, setCountry] = useState("all");
  const [view, setView] = useState("table");
  const filteredPlayers = PLAYERS.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumb={<Breadcrumbs items={[{ label: "Rize.gg", href: "/" }, { label: "Players" }]} />} />
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
            <div className="w-full bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-8 flex items-center gap-6">
              <div className="shrink-0 size-16 rounded-[var(--radius-md)] bg-accent flex items-center justify-center">
                <span className="text-accent-foreground text-2xl font-bold tracking-tight">R</span>
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-text-primary">Explore Skilled Players</h1>
                <p className="text-sm text-text-secondary">Search players, check their vibes, and squad up with those who play like you.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1"><SearchInput placeholder="Search for a player.." value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch("")} className="w-full" /></div>
              <div className="w-44"><Select options={GAME_OPTIONS} value={game} onChange={(e) => setGame(e.target.value)} placeholder="All Games" /></div>
              <div className="w-44"><Select options={COUNTRY_OPTIONS} value={country} onChange={(e) => setCountry(e.target.value)} placeholder="All countries" /></div>
              <ViewToggle activeView={view} onViewChange={setView} />
            </div>
            {view === "table" ? (
              <div className="bg-bg-card border border-border-default rounded-[var(--radius-md)] overflow-hidden">
                <div className="divide-y divide-border-subtle">
                  {filteredPlayers.map((player) => (
                    <div key={player.id} className="px-4 py-3 flex items-center justify-between hover:bg-bg-surface-hover/50 transition-colors">
                      <div className="flex items-center gap-3 w-[200px]"><Avatar size="sm" /><span className="text-sm font-medium text-text-accent hover:underline cursor-pointer truncate">{player.name}</span></div>
                      <span className="text-sm text-text-primary w-[80px]">{player.sessions}</span>
                      <span className="text-sm text-text-primary w-[100px]">{player.groups} <span className="text-xs text-text-secondary">/ {player.mutualGroups} mutual</span></span>
                      <div className="flex items-center gap-1 w-[120px]">{player.games.map((g, i) => (<div key={i} className={\`size-7 rounded-full \${g.bgColor}\`} />))}</div>
                      <div className="flex items-center gap-2 w-[140px]"><span className="text-base">{player.countryFlag}</span><span className="text-sm text-text-primary">{player.country}</span></div>
                      <div className="flex items-center gap-1 w-[70px]"><Star size={14} className="text-yellow-400" /><span className="text-sm font-medium text-yellow-400">{player.rating}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredPlayers.map((player) => (<PlayerCard key={player.id} name={player.name} country={player.country} games={player.games} rating={player.rating} totalRatings={Math.floor(player.sessions / 5)} />))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}`,

  "team-finder": `
const SESSIONS = [
  { id: "1", teamName: "Efootball Match", owner: "savano", game: "eFootball", gameColor: "#16A249", slotsUsed: 1, slotsTotal: 1, availability: "Anytime", time: "Open", skillRequirement: "Any", tags: ["Casual", "Football"], description: "Looking for opponents for eFootball matches. All skill levels welcome.", members: [{ id: "m1", name: "savano", rank: "Member", online: true }] },
  { id: "2", teamName: "JP Kairos #antiayam", owner: "txwamisu", game: "Mobile Legends: Bang Bang", gameColor: "#FF5252", slotsUsed: 6, slotsTotal: 5, availability: "Evenings", time: "Evening", skillRequirement: "Any", tags: ["MLBB", "Competitive"], description: "JP Kairos team looking for strong MLBB players to join our roster.", members: [{ id: "m2", name: "txwamisu", rank: "Owner", online: true }] },
  { id: "3", teamName: "TI", owner: "t4", game: "Mobile Legends: Bang Bang", gameColor: "#FF5252", slotsUsed: 2, slotsTotal: 5, availability: "Weekends", time: "Flexible", skillRequirement: "Mythic", tags: ["MLBB", "Ranked"], description: "Team Impact — competitive MLBB team. Ramadan tournament squad.", members: [{ id: "m3", name: "t4", rank: "Owner", online: false }] },
  { id: "4", teamName: "MONITOR reboot", owner: "fatimabouazizi", game: "Apex Legends", gameColor: "#F5A623", slotsUsed: 2, slotsTotal: 5, availability: "Daily", time: "Daily", skillRequirement: "Any", tags: ["Apex", "Chill"], description: "MONITOR reboot Apex squad. Looking for consistent players to squad up daily.", members: [{ id: "m4", name: "fatimabouazizi", rank: "Owner", online: true }] },
  { id: "5", teamName: "unibody animated Squad", owner: "mohammedalrashid", game: "Diablo IV", gameColor: "#8B5CF6", slotsUsed: 5, slotsTotal: 5, availability: "Weekends", time: "Flexible", skillRequirement: "Any", tags: ["Diablo", "Full Squad"], description: "Full squad for Diablo IV. Group is at capacity.", members: [{ id: "m5", name: "mohammedalrashid", rank: "Owner", online: false }] },
];

function GeneratedPage() {
  const [search, setSearch] = useState("");
  const [showMyTeams, setShowMyTeams] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const filtered = SESSIONS.filter((s) => {
    const q = search.toLowerCase();
    return s.teamName.toLowerCase().includes(q) || s.owner.toLowerCase().includes(q) || s.game.toLowerCase().includes(q);
  });
  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar activeItem="Team Finder" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumb={<Breadcrumbs items={[{ label: "Group finder" }]} />} />
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="flex flex-col gap-6 max-w-6xl">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-text-primary tracking-tight">Team Finder</h1>
                  <div className="flex items-center gap-4">
                    <Toggle checked={showMyTeams} onChange={setShowMyTeams} label="Show my teams" />
                    <div className="w-64"><SearchInput placeholder="Search teams, games, tags..." value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch("")} /></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {["All games", "Mobile Legends: Bang Bang", "Apex Legends", "eFootball", "Diablo IV"].map((chip, i) => (
                    <button key={chip} className={\`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer border \${i === 0 ? "bg-accent-muted border-border-accent text-text-accent" : "bg-bg-surface border-border-default text-text-secondary hover:border-border-accent/40 hover:text-text-primary"}\`}>{chip}</button>
                  ))}
                </div>
              </div>
              <p className="text-sm text-text-secondary -mt-2">Showing <span className="text-text-primary font-medium">{filtered.length}</span> groups</p>
              <div className="grid grid-cols-2 gap-4">
                {filtered.map((session) => (
                  <div key={session.id} className="cursor-pointer" onClick={() => setSelectedSession(selectedSession?.id === session.id ? null : session)}>
                    <SessionCard gameIcon={<Gamepad2 size={28} className="text-white" />} gameColor={session.gameColor} teamName={session.teamName} owner={session.owner} game={session.game} slotsUsed={session.slotsUsed} slotsTotal={session.slotsTotal} availability={session.availability} time={session.time} skillRequirement={session.skillRequirement} onDetails={() => setSelectedSession(session)} onJoin={() => {}} className={selectedSession?.id === session.id ? "ring-1 ring-border-accent" : ""} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {selectedSession && (
            <div className="w-[340px] shrink-0 flex flex-col h-full border-l border-border-default bg-bg-card overflow-y-auto">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border-default">
                <h3 className="text-base font-semibold text-text-primary">Team Details</h3>
                <button onClick={() => setSelectedSession(null)} className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"><X size={18} /></button>
              </div>
              <div className="flex flex-col gap-5 p-5">
                <div className="flex gap-3 items-start">
                  <div className="size-14 rounded-[var(--radius-sm)] shrink-0 flex items-center justify-center" style={{ backgroundColor: selectedSession.gameColor }}><Gamepad2 size={28} className="text-white" /></div>
                  <div><h2 className="text-lg font-semibold text-text-primary">{selectedSession.teamName}</h2><div className="flex items-center gap-1.5 text-sm"><span className="text-text-secondary">By</span><span className="text-text-accent font-medium">{selectedSession.owner}</span></div></div>
                </div>
                <p className="text-sm text-text-secondary">{selectedSession.description}</p>
                <div className="flex flex-col gap-2"><Button size="md" className="w-full">Join now</Button><Button variant="outline" size="md" className="w-full">View full details</Button></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}`,

  federations: `
const FEDERATIONS = [
  { id: "1", name: "Jordan Esports Federation", countryCode: "jo", members: 1 },
  { id: "2", name: "France Esports Federation", countryCode: "fr", members: 1 },
  { id: "3", name: "Iraq Esports Federation", countryCode: "iq", members: 1 },
  { id: "4", name: "Brazil Esports Federation", countryCode: "br", members: 1 },
  { id: "5", name: "Lebanon Esports Federation", countryCode: "lb", members: 1 },
  { id: "6", name: "Tunisia Gaming League", countryCode: "tn", members: 1 },
  { id: "7", name: "Saudi Arabia Esports Federation", countryCode: "sa", members: 1 },
  { id: "8", name: "Egypt Gaming Federation", countryCode: "eg", members: 1 },
];

function GeneratedPage() {
  const [search, setSearch] = useState("");
  const filtered = FEDERATIONS.filter((f) => search.trim() === "" || f.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar activeItem="Federations" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumb={<Breadcrumbs items={[{ label: "Federations" }]} />} />
        <main className="flex-1 overflow-y-auto">
          <div className="relative w-full min-h-[220px] bg-bg-card border-b border-border-default overflow-hidden flex flex-col items-center justify-center px-6 py-12">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/1280px-World_map_-_low_resolution.svg.png)", backgroundSize: "cover", backgroundPosition: "center", filter: "sepia(1) hue-rotate(300deg)" }} />
            <div className="relative z-10 text-center">
              <h1 className="text-3xl font-bold text-text-primary mb-3">{FEDERATIONS.length} Federations, One community</h1>
              <p className="text-text-secondary text-sm max-w-2xl">Uniting gamers worldwide under one network, building connections and shaping the future of E-sports together.</p>
            </div>
          </div>
          <div className="px-6 py-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-text-primary">Federations</h2>
              <SearchInput placeholder="Search federations..." value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch("")} className="w-72" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {filtered.map((fed) => (
                <div key={fed.id} className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-4 flex items-center gap-3 hover:border-border-accent/30 transition-colors cursor-pointer">
                  <img src={\`https://flagcdn.com/w80/\${fed.countryCode}.png\`} alt={fed.name} className="w-12 h-9 object-cover rounded-[var(--radius-sm)] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{fed.name}</p>
                    <p className="text-xs text-text-tertiary mt-0.5">{fed.members} member</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}`,

  tournaments: `
const TOURNAMENTS = [
  { id: "1", name: "TEST", game: "Mobile Legends: Bang Bang", gameImage: "https://static-cdn.jtvnw.net/ttv-boxart/Fortnite-285x380.jpg", country: "World Wide", maxTeams: 4, currentTeams: 4, rank: "Challenger III", prizeAmount: 100, isLive: true, registrationOpen: false, organizer: { username: "paradox", avatar: "https://lh3.googleusercontent.com/a/ACg8ocL16Yj6Zy=s96-c" }, description: "TEST" },
  { id: "2", name: "TI البطولة الرمضانية Ramadan Tournament", game: "Mobile Legends: Bang Bang", gameImage: "https://static-cdn.jtvnw.net/ttv-boxart/Fortnite-285x380.jpg", country: "Saudi Arabia", maxTeams: 8, currentTeams: 0, rank: "Mythic", prizeAmount: 1000, isLive: false, registrationOpen: false, organizer: { username: "t4", avatar: null }, description: "Team impact Ramadan tournament\\nPrize pool 20,000 diamonds for the winning team" },
];

function GeneratedPage() {
  const [activeGame, setActiveGame] = useState("All games");
  const filtered = TOURNAMENTS.filter((t) => activeGame === "All games" || t.game === activeGame);
  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar activeItem="Tournaments" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumb={<Breadcrumbs items={[{ label: "Tournaments" }]} />} />
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-text-primary">Tournaments</h1>
            <button className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent-hover transition-colors cursor-pointer">+ Create new tournament</button>
          </div>
          <div className="flex items-center gap-2 mb-6">
            {["All games", "Mobile Legends: Bang Bang", "Clash Royale"].map((g) => (
              <button key={g} onClick={() => setActiveGame(g)} className={\`px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium border transition-colors cursor-pointer \${activeGame === g ? "bg-accent-muted border-border-accent text-text-accent" : "bg-bg-surface border-border-default text-text-secondary hover:bg-bg-surface-hover"}\`}>{g}</button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-5">
            {filtered.map((t) => (
              <div key={t.id} className="bg-bg-card border border-border-default rounded-[var(--radius-xl)] overflow-hidden hover:border-border-accent/30 transition-colors cursor-pointer">
                <div className="relative h-[180px] bg-bg-surface">
                  <img src={t.gameImage} alt={t.game} className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-sm)] bg-bg-elevated/90 text-xs font-medium text-text-primary">Main Prize \${t.prizeAmount}</div>
                  {t.isLive && <div className="absolute top-3 right-3 px-2.5 py-1 rounded-[var(--radius-sm)] bg-status-error text-white text-xs font-semibold">Live</div>}
                  {!t.registrationOpen && !t.isLive && <div className="absolute top-3 right-3 px-2.5 py-1 rounded-[var(--radius-sm)] bg-bg-elevated/90 border border-border-default text-text-secondary text-xs font-medium">Registration Closed</div>}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-4 text-xs text-text-secondary mb-3"><span>{t.country}</span><span>{t.currentTeams}/{t.maxTeams}</span><span>{t.rank}</span></div>
                  <div className="flex items-start gap-3">
                    <div className="size-12 rounded-[var(--radius-md)] bg-bg-surface border border-border-default overflow-hidden shrink-0">
                      {t.organizer.avatar ? <img src={t.organizer.avatar} alt={t.organizer.username} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><span className="text-sm font-bold text-text-accent uppercase">{t.organizer.username[0]}</span></div>}
                    </div>
                    <div><h3 className="text-base font-semibold text-text-primary truncate">{t.name}</h3><p className="text-xs text-text-secondary mt-0.5 line-clamp-2">{t.description}</p></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}`,

  scrims: `
const SCRIMS_BY_DATE = [
  { date: "Friday, 20 Feb", scrims: [{ id: "1", time: "4:09 PM", teamName: "RL Squad", teamAvatar: "https://static-cdn.jtvnw.net/ttv-boxart/Apex%20Legends-285x380.jpg", skillRequirement: "Champion III", gameCount: 1, format: "5-Stack" }] },
  { date: "Saturday, 28 Feb", scrims: [{ id: "2", time: "5:55 PM", teamName: "lord007tn", teamAvatar: "https://lh3.googleusercontent.com/a/ACg8ocK5EX5irZBct3OpQQO_5wNfH8z79S46f8zzKIBsQhf0arnloNc8=s96-c", skillRequirement: "Diamond I", gameCount: 1, format: "1v1" }] },
];

function GeneratedPage() {
  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar activeItem="Scrims" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumb={<Breadcrumbs items={[{ label: "Scrims" }]} />} />
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <h1 className="text-2xl font-bold text-text-primary mb-6">LFS - Scrim Finder</h1>
          <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-4 flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-[var(--radius-sm)] bg-accent/20 flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 19h20L12 2z" fill="#99F9EA"/></svg></div>
              <div><p className="text-sm font-medium text-text-primary">All games</p><p className="text-xs text-text-secondary">Current teams: {SCRIMS_BY_DATE.reduce((a, d) => a + d.scrims.length, 0)}</p></div>
            </div>
            <button className="px-4 py-2 rounded-[var(--radius-md)] bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent-hover transition-colors cursor-pointer">Start your scrim now</button>
          </div>
          <div className="flex flex-col gap-1">
            {SCRIMS_BY_DATE.map((group) => (
              <div key={group.date}>
                <div className="flex items-center gap-4 my-4"><div className="flex-1 h-px bg-border-default" /><span className="text-xs text-text-tertiary shrink-0">{group.date}</span><div className="flex-1 h-px bg-border-default" /></div>
                {group.scrims.map((scrim) => (
                  <div key={scrim.id} className="flex items-center gap-4 px-4 py-3 bg-bg-card border border-border-default rounded-[var(--radius-lg)] hover:border-border-accent/30 transition-colors">
                    <span className="text-sm text-text-secondary shrink-0 w-16">{scrim.time}</span>
                    <div className="size-10 rounded-full overflow-hidden bg-bg-surface shrink-0"><img src={scrim.teamAvatar} alt={scrim.teamName} className="w-full h-full object-cover" /></div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium text-text-primary">{scrim.teamName}</p><p className="text-xs text-text-secondary">Skill requirement: {scrim.skillRequirement}</p></div>
                    <div className="flex items-center gap-4 text-xs text-text-secondary shrink-0"><span>{scrim.gameCount} game</span><span>{scrim.format}</span></div>
                    <button className="px-4 py-1.5 rounded-[var(--radius-md)] border border-border-default bg-bg-surface text-sm text-text-primary hover:bg-bg-surface-hover transition-colors cursor-pointer shrink-0">View opponent</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}`,

  leaderboard: `
const LEADERBOARD = [
  { rank: 1, username: "murexhyena", avatar: "https://lh3.googleusercontent.com/a/ACg8ocKY14j2kNBcnQ4cFTIrNUl_v-8B2rbxjr8dOGziUMwwxa_CLD8=s96-c", country: "Lebanon", countryCode: "lb", missions: 3, badges: ["Join The Squad", "Committed Player", "Social Starter"] },
  { rank: 2, username: "hglyblzs", avatar: null, country: "Hungary", countryCode: "hu", missions: 2, badges: ["Join The Squad", "Committed Player"] },
];
const GAME_TABS = [{ label: "Rize.gg", progress: 0 }, { label: "Overwatch 2", progress: 0 }];

function GeneratedPage() {
  const [activeTab, setActiveTab] = useState(0);
  const top1 = LEADERBOARD[0];
  const top2 = LEADERBOARD[1];
  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar activeItem="Leaderboard" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumb={<Breadcrumbs items={[{ label: "Leaderboard" }]} />} />
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            {GAME_TABS.map((tab, i) => (
              <button key={tab.label} onClick={() => setActiveTab(i)} className={\`flex items-center gap-3 px-5 py-3 rounded-[var(--radius-lg)] border text-sm font-medium transition-colors cursor-pointer min-w-[200px] \${activeTab === i ? "bg-accent-subtle border-border-accent text-text-accent" : "bg-bg-card border-border-default text-text-secondary hover:bg-bg-surface"}\`}>
                <div className="size-8 rounded-full bg-bg-surface flex items-center justify-center shrink-0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 19h20L12 2z" fill="currentColor" opacity="0.6"/></svg></div>
                <div className="text-left"><p className="font-semibold">{tab.label}</p><p className="text-xs opacity-60">{tab.progress}% Progress</p></div>
              </button>
            ))}
          </div>
          <div className="flex items-end justify-center gap-4 mb-8 min-h-[280px]">
            {top2 && (
              <div className="flex flex-col items-center gap-3 pb-4">
                <div className="size-16 rounded-full overflow-hidden bg-bg-surface border-2 border-border-default">{top2.avatar ? <img src={top2.avatar} alt={top2.username} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-bg-surface-hover flex items-center justify-center"><span className="text-xl font-bold text-text-tertiary uppercase">{top2.username[0]}</span></div>}</div>
                <p className="text-sm font-semibold text-text-primary">{top2.username}</p>
                <p className="text-xs text-text-secondary">{top2.missions} missions | <img src={\`https://flagcdn.com/w20/\${top2.countryCode}.png\`} alt={top2.country} className="inline h-3 ml-1" /></p>
                <div className="w-24 h-16 bg-bg-surface border border-border-default rounded-t-[var(--radius-md)] flex items-center justify-center"><span className="text-2xl font-bold text-text-secondary">2</span></div>
              </div>
            )}
            {top1 && (
              <div className="flex flex-col items-center gap-3 pb-0">
                <div className="size-20 rounded-full overflow-hidden bg-bg-surface border-2 border-text-accent">{top1.avatar ? <img src={top1.avatar} alt={top1.username} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-bg-surface-hover flex items-center justify-center"><span className="text-2xl font-bold text-text-accent uppercase">{top1.username[0]}</span></div>}</div>
                <p className="text-sm font-semibold text-text-primary">{top1.username}</p>
                <p className="text-xs text-text-secondary">{top1.missions} missions | <img src={\`https://flagcdn.com/w20/\${top1.countryCode}.png\`} alt={top1.country} className="inline h-3 ml-1" /></p>
                <div className="w-24 h-24 bg-accent/10 border border-border-accent/30 rounded-t-[var(--radius-md)] flex items-center justify-center"><span className="text-3xl font-bold text-text-accent">1</span></div>
              </div>
            )}
            <div className="flex flex-col items-center gap-3 pb-4 opacity-40">
              <div className="size-16 rounded-full bg-bg-surface border-2 border-border-default flex items-center justify-center"><span className="text-text-tertiary text-xl font-bold">?</span></div>
              <p className="text-sm text-text-tertiary">—</p>
              <div className="w-24 h-10 bg-bg-surface border border-border-default rounded-t-[var(--radius-md)] flex items-center justify-center"><span className="text-xl font-bold text-text-tertiary">3</span></div>
            </div>
          </div>
          <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] overflow-hidden">
            <div className="grid grid-cols-[40px_1fr_120px_120px] gap-4 px-5 py-3 border-b border-border-subtle text-xs text-text-secondary"><span>#</span><span>Player</span><span>Missions</span><span>Country</span></div>
            {LEADERBOARD.map((player) => (
              <div key={player.username} className="grid grid-cols-[40px_1fr_120px_120px] gap-4 px-5 py-3 border-b border-border-subtle last:border-0 hover:bg-bg-surface-hover/30 transition-colors">
                <span className={\`text-sm font-semibold \${player.rank === 1 ? "text-text-accent" : "text-text-secondary"}\`}>{player.rank}</span>
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full overflow-hidden bg-bg-surface">{player.avatar ? <img src={player.avatar} alt={player.username} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-bg-surface-hover flex items-center justify-center"><span className="text-xs text-text-tertiary uppercase">{player.username[0]}</span></div>}</div>
                  <span className="text-sm font-medium text-text-primary">{player.username}</span>
                </div>
                <span className="text-sm text-text-secondary">{player.missions}</span>
                <div className="flex items-center gap-1.5"><img src={\`https://flagcdn.com/w20/\${player.countryCode}.png\`} alt={player.country} className="h-3.5" /><span className="text-sm text-text-secondary">{player.country}</span></div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}`,

  referrals: `
const REFERRAL_LINK = "www.rize.gg/register?code=demo";

function GeneratedPage() {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar activeItem="Referrals" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumb={<Breadcrumbs items={[{ label: "Referrals" }]} />} />
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <h1 className="text-2xl font-bold text-text-primary mb-6">Referrals</h1>
          <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-6 mb-6">
            <h2 className="text-base font-semibold text-text-primary mb-1">Your referral link</h2>
            <p className="text-sm text-text-secondary mb-4">Share your link and earn stars when friends join Rize.gg</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-10 px-3 flex items-center rounded-[var(--radius-md)] border border-border-default bg-bg-input text-sm text-text-secondary">{REFERRAL_LINK}</div>
              <button onClick={handleCopy} className="flex items-center gap-2 h-10 px-4 rounded-[var(--radius-md)] bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent-hover transition-colors cursor-pointer shrink-0">{copied ? "Copied!" : "Copy link"}</button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[{ label: "Total referrals", value: "0", sub: "Friends joined" }, { label: "Stars earned", value: "0", sub: "From referrals" }, { label: "Rewards unlocked", value: "0", sub: "Total rewards" }].map((s) => (
              <div key={s.label} className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-5">
                <p className="text-sm text-text-secondary mb-3">{s.label}</p>
                <p className="text-3xl font-bold text-text-primary">{s.value}</p>
                <p className="text-xs text-text-secondary mt-1">{s.sub}</p>
              </div>
            ))}
          </div>
          <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] overflow-hidden">
            <div className="px-5 py-4 border-b border-border-subtle"><h2 className="text-base font-semibold text-text-primary">Referral history</h2></div>
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <p className="text-sm text-text-secondary">No referrals yet.</p>
              <p className="text-xs text-text-tertiary">Share your link to start earning stars!</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}`,

  "missions-and-rewards": `
const MISSIONS = [
  { id: "1", title: "Badge Hunter", description: "Collect badges by completing challenges and missions on Rize.gg", progress: 0, total: 100, status: "IN_PROGRESS", xp: 500 },
  { id: "2", title: "Committed Player", description: "Log in and play sessions consistently to show your dedication", progress: 1, total: 100, status: "IN_PROGRESS", xp: 300 },
  { id: "3", title: "Mission Master", description: "Complete a set number of missions to prove your mastery", progress: 0, total: 100, status: "LOCKED", xp: 1000 },
  { id: "4", title: "Badge Collector", description: "Collect a wide variety of badges from different activities", progress: 0, total: 100, status: "LOCKED", xp: 750 },
  { id: "5", title: "Social Starter", description: "Connect with other players, join groups, and build your network", progress: 0, total: 100, status: "LOCKED", xp: 200 },
];
const GAME_TABS = [{ label: "Rize.gg", progress: 1 }, { label: "Overwatch 2", progress: 0 }];

function GeneratedPage() {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar activeItem="Missions & Rewards" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumb={<Breadcrumbs items={[{ label: "Missions & Rewards" }]} />} />
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            {GAME_TABS.map((tab, i) => (
              <button key={tab.label} onClick={() => setActiveTab(i)} className={\`flex items-center gap-3 px-5 py-3 rounded-[var(--radius-lg)] border text-sm font-medium transition-colors cursor-pointer min-w-[200px] \${activeTab === i ? "bg-accent-subtle border-border-accent text-text-accent" : "bg-bg-card border-border-default text-text-secondary hover:bg-bg-surface"}\`}>
                <div className="size-8 rounded-full bg-bg-surface flex items-center justify-center shrink-0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 19h20L12 2z" fill="currentColor" opacity="0.6" /></svg></div>
                <div className="text-left"><p className="font-semibold">{tab.label}</p><p className="text-xs opacity-60">{tab.progress}% Progress</p></div>
              </button>
            ))}
          </div>
          <div className="flex gap-6">
            <div className="flex-1 flex flex-col gap-3">
              {MISSIONS.map((mission) => {
                const locked = mission.status === "LOCKED";
                const pct = Math.round((mission.progress / mission.total) * 100);
                return (
                  <div key={mission.id} className={\`bg-bg-card border rounded-[var(--radius-lg)] p-5 flex items-start gap-4 \${locked ? "border-border-subtle opacity-60" : "border-border-default"}\`}>
                    <div className={\`size-10 rounded-[var(--radius-md)] flex items-center justify-center shrink-0 \${locked ? "bg-bg-surface" : "bg-accent-muted"}\`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={locked ? "text-text-tertiary" : "text-text-accent"}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1"><h3 className="text-sm font-semibold text-text-primary">{mission.title}</h3><span className="text-xs text-text-secondary">{mission.progress}/{mission.total}</span></div>
                      <p className="text-xs text-text-secondary mb-3">{mission.description}</p>
                      <div className="h-1.5 w-full rounded-full bg-bg-surface overflow-hidden"><div className="h-full rounded-full bg-accent" style={{ width: \`\${pct}%\` }} /></div>
                    </div>
                    <span className={\`text-xs font-medium px-2 py-0.5 rounded-full \${locked ? "bg-bg-surface text-text-tertiary" : "bg-accent-muted text-text-accent"}\`}>+{mission.xp} XP</span>
                  </div>
                );
              })}
            </div>
            <div className="w-[260px] shrink-0">
              <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-5">
                <h3 className="text-sm font-semibold text-text-primary mb-4">Overall Progress</h3>
                <div className="flex flex-col items-center gap-3 mb-5">
                  <div className="relative size-24">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90"><circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-bg-surface)" strokeWidth="10" /><circle cx="50" cy="50" r="40" fill="none" stroke="#99F9EA" strokeWidth="10" strokeDasharray="0 251.2" strokeLinecap="round" /></svg>
                    <div className="absolute inset-0 flex items-center justify-center"><span className="text-xl font-bold text-text-primary">0%</span></div>
                  </div>
                  <p className="text-xs text-text-secondary">1 / 500 total progress</p>
                </div>
                <div className="flex flex-col gap-2">
                  {MISSIONS.map((m) => (
                    <div key={m.id} className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary truncate flex-1 mr-2">{m.title}</span>
                      <span className={\`text-xs font-medium \${m.status === "IN_PROGRESS" ? "text-text-accent" : "text-text-tertiary"}\`}>{m.progress}/{m.total}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}`,

  "rize-lfg": `
const GROUPS = [
  { id: "1", name: "raed night", owner: "lord007tn", ownerAvatar: "https://lh3.googleusercontent.com/a/ACg8ocK5EX5irZBct3OpQQO_5wNfH8z79S46f8zzKIBsQhf0arnloNc8=s96-c", game: "Apex Legends", gameImage: "https://static-cdn.jtvnw.net/ttv-boxart/Apex%20Legends-285x380.jpg", slotsUsed: 4, slotsTotal: 3, slotText: "-1 Slot available", timeAgo: "20 days ago", skillRequirement: "Silver I", members: [{ username: "lord007tn", avatar: "https://lh3.googleusercontent.com/a/ACg8ocK5EX5irZBct3OpQQO_5wNfH8z79S46f8zzKIBsQhf0arnloNc8=s96-c", isOwner: true }, { username: "azizbecha", avatar: "https://lh3.googleusercontent.com/a/ACg8ocL_GUJfwCYMwPgywoGxf8FnGR1oq_IoJk_IVn-L7dPaWiR-Gzsx=s96-c", isOwner: false }, { username: "hglyblzs", avatar: null, isOwner: false }, { username: "choxel", avatar: "https://lh3.googleusercontent.com/a/ACg8ocKCrsXsBt0lHA6pIedv1Mjp_4vxAEGs_bGqXmE0nVjhxZDB1Z8=s96-c", isOwner: false }] },
  { id: "2", name: "Late night valo", owner: "sirius", ownerAvatar: "https://lh3.googleusercontent.com/a/ACg8ocIDHpN23i-I4B7mHMoS0wj_PJ2Eg4Gk-6GS9HsK=s96-c", game: "Valorant", gameImage: "https://static-cdn.jtvnw.net/ttv-boxart/VALORANT-285x380.jpg", slotsUsed: 2, slotsTotal: 5, slotText: "3 Slots available", timeAgo: "22 days ago", skillRequirement: "Radiant", members: [{ username: "sirius", avatar: "https://lh3.googleusercontent.com/a/ACg8ocIDHpN23i-I4B7mHMoS0wj_PJ2Eg4Gk-6GS9HsK=s96-c", isOwner: true }, { username: "murexhyena", avatar: "https://lh3.googleusercontent.com/a/ACg8ocKY14j2kNBcnQ4cFTIrNUl_v-8B2rbxjr8dOGziUMwwxa_CLD8=s96-c", isOwner: false }] },
  { id: "3", name: "profitable tooth Squad", owner: "paul_silva", ownerAvatar: null, game: "Honor of Kings", gameImage: "https://static-cdn.jtvnw.net/ttv-boxart/Honor%20of%20Kings-285x380.jpg", slotsUsed: 1, slotsTotal: 5, slotText: "4 Slots available", timeAgo: "23 days ago", skillRequirement: "Bronze III", members: [{ username: "paul_silva", avatar: null, isOwner: true }] },
  { id: "4", name: "upright pasta Squad", owner: "omarkhalil", ownerAvatar: null, game: "Fortnite", gameImage: "https://static-cdn.jtvnw.net/ttv-boxart/Fortnite-285x380.jpg", slotsUsed: 1, slotsTotal: 4, slotText: "3 Slots available", timeAgo: "1 month ago", skillRequirement: "Any", members: [{ username: "omarkhalil", avatar: null, isOwner: true }] },
  { id: "5", name: "Roob Inc Gaming", owner: "amjad_khalil", ownerAvatar: null, game: "Lost Ark", gameImage: "https://static-cdn.jtvnw.net/ttv-boxart/Apex%20Legends-285x380.jpg", slotsUsed: 2, slotsTotal: 5, slotText: "3 Slots available", timeAgo: "1 month ago", skillRequirement: "Any", members: [{ username: "amjad_khalil", avatar: null, isOwner: true }] },
  { id: "6", name: "protocol copy", owner: "paul_silva", ownerAvatar: null, game: "Fortnite", gameImage: "https://static-cdn.jtvnw.net/ttv-boxart/Fortnite-285x380.jpg", slotsUsed: 1, slotsTotal: 3, slotText: "2 Slots available", timeAgo: "1 month ago", skillRequirement: "Any", members: [{ username: "paul_silva", avatar: null, isOwner: true }] },
];

function GroupCard({ group }) {
  return (
    <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] overflow-hidden hover:border-border-accent/30 transition-colors flex flex-col">
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <img src={group.gameImage} alt={group.game} className="size-10 rounded-[var(--radius-sm)] object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary truncate">{group.name}</p>
          <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-0.5">
            <span>By</span>
            <span className="text-text-accent">{group.owner}</span>
            <span className="text-border-default">|</span>
            <img src={group.gameImage} alt="" className="size-3.5 rounded-sm object-cover" />
            <span className="truncate">{group.game}</span>
          </div>
        </div>
        <button className="text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer shrink-0"><MoreHorizontal size={16} /></button>
      </div>
      <div className="flex items-center gap-3 px-4 pb-3 text-xs text-text-secondary">
        <div className="flex items-center gap-1"><Users size={12} /><span>{group.slotsUsed}/{group.slotsTotal}</span></div>
        <span>|</span>
        <span className={group.slotText.startsWith("-") ? "text-status-error" : "text-text-secondary"}>{group.slotText}</span>
        <span>|</span>
        <div className="flex items-center gap-1"><Clock size={12} /><span>{group.timeAgo}</span></div>
      </div>
      <div className="flex items-center gap-1.5 px-4 pb-3">
        {group.members.slice(0, 4).map((m, i) => (
          <div key={i} className="relative shrink-0">
            <div className="size-8 rounded-full bg-bg-surface border border-border-default overflow-hidden">
              {m.avatar ? <img src={m.avatar} alt={m.username} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-accent/20 flex items-center justify-center"><span className="text-[10px] font-bold text-text-accent uppercase">{m.username[0]}</span></div>}
            </div>
            {m.isOwner && <div className="absolute -top-1 -right-1 size-3.5 rounded-full bg-status-warning border border-bg-card flex items-center justify-center"><svg width="6" height="6" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div>}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 px-4 pb-3 text-xs text-text-secondary"><Shield size={12} className="shrink-0" /><span>Skill requirement: {group.skillRequirement}</span></div>
      <div className="flex items-center gap-2 px-4 pb-4 mt-auto">
        <button className="flex-1 py-2 rounded-[var(--radius-md)] border border-border-default bg-transparent text-sm text-text-primary hover:bg-bg-surface transition-colors cursor-pointer">Group details</button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[var(--radius-md)] border border-border-accent bg-accent-subtle text-sm text-text-accent hover:bg-accent-muted transition-colors cursor-pointer">Join <ChevronRight size={14} /></button>
      </div>
    </div>
  );
}

function GeneratedPage() {
  const [search, setSearch] = useState("");
  const filtered = GROUPS.filter((g) => search.trim() === "" || g.name.toLowerCase().includes(search.toLowerCase()) || g.game.toLowerCase().includes(search.toLowerCase()) || g.owner.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar activeItem="Rize LFG" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumb={<Breadcrumbs items={[{ label: "Groups" }]} />} />
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <h1 className="text-2xl font-bold text-text-primary mb-6">Group finder</h1>
          <div className="flex items-center gap-3 mb-6">
            <button className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] border border-border-default bg-bg-card text-sm text-text-secondary hover:bg-bg-surface transition-colors cursor-pointer"><RefreshCw size={14} /> Refresh</button>
            <div className="flex-1 max-w-md"><SearchInput placeholder="Search for a game or group ..." value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch("")} className="w-full" /></div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] border border-border-default bg-bg-card text-sm text-text-secondary hover:bg-bg-surface transition-colors cursor-pointer"><SlidersHorizontal size={14} /> Filters</button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] border border-border-default bg-bg-card text-sm text-text-secondary hover:bg-bg-surface transition-colors cursor-pointer"><History size={14} /> History</button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent-hover transition-colors cursor-pointer"><Plus size={14} /> New group</button>
          </div>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">{filtered.map((group) => <GroupCard key={group.id} group={group} />)}</div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 gap-3"><Users size={40} className="text-text-tertiary" /><p className="text-text-secondary">No groups found.</p></div>
          )}
        </main>
      </div>
    </div>
  );
}`,

  messages: `
const CONVERSATIONS = [
  { id: "1", username: "lord007tn", avatar: "https://lh3.googleusercontent.com/a/ACg8ocK5EX5irZBct3OpQQO_5wNfH8z79S46f8zzKIBsQhf0arnloNc8=s96-c", lastMessage: "gg wp bro, good games", time: "2h", unread: 0, online: true },
  { id: "2", username: "sirius", avatar: "https://lh3.googleusercontent.com/a/ACg8ocIDHpN23i-I4B7mHMoS0wj_PJ2Eg4Gk-6GS9HsK=s96-c", lastMessage: "wanna play valo tonight?", time: "1d", unread: 2, online: true },
  { id: "3", username: "azizbecha", avatar: "https://lh3.googleusercontent.com/a/ACg8ocL_GUJfwCYMwPgywoGxf8FnGR1oq_IoJk_IVn-L7dPaWiR-Gzsx=s96-c", lastMessage: "check this clip bro", time: "3d", unread: 0, online: false },
];
const MESSAGES = {
  "1": [{ id: "1", text: "yo bro up for some apex?", time: "14:20", isMine: false }, { id: "2", text: "sure lets go, what server?", time: "14:21", isMine: true }, { id: "3", text: "EU west, adding you now", time: "14:21", isMine: false }, { id: "4", text: "gg wp bro, good games", time: "15:30", isMine: false }],
  "2": [{ id: "1", text: "bro your valorant rank?", time: "yesterday", isMine: false }, { id: "2", text: "diamond 2, you?", time: "yesterday", isMine: true }, { id: "3", text: "wanna play valo tonight?", time: "2h ago", isMine: false }],
  "3": [{ id: "1", text: "check this clip bro", time: "3d ago", isMine: false }],
};

function GeneratedPage() {
  const [activeId, setActiveId] = useState("1");
  const [message, setMessage] = useState("");
  const conv = CONVERSATIONS.find((c) => c.id === activeId);
  const msgs = MESSAGES[activeId] || [];
  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar activeItem="Messages" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumb={<Breadcrumbs items={[{ label: "Messages" }]} />} />
        <div className="flex-1 flex overflow-hidden">
          <div className="w-[280px] shrink-0 border-r border-border-default flex flex-col bg-bg-secondary">
            <div className="flex-1 overflow-y-auto">
              {CONVERSATIONS.map((c) => (
                <button key={c.id} onClick={() => setActiveId(c.id)} className={\`w-full flex items-center gap-3 px-4 py-3 cursor-pointer text-left border-b border-border-subtle \${activeId === c.id ? "bg-accent-subtle border-l-2 border-l-border-accent" : "hover:bg-bg-surface-hover"}\`}>
                  <div className="relative shrink-0">
                    <div className="size-10 rounded-full bg-bg-surface overflow-hidden border border-border-default"><img src={c.avatar} alt={c.username} className="w-full h-full object-cover" /></div>
                    {c.online && <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-status-online border-2 border-bg-secondary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5"><span className="text-sm font-semibold text-text-primary">{c.username}</span><span className="text-[10px] text-text-tertiary">{c.time}</span></div>
                    <p className="text-xs text-text-secondary truncate">{c.lastMessage}</p>
                  </div>
                  {c.unread > 0 && <span className="size-5 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-accent-foreground shrink-0">{c.unread}</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex items-center px-5 py-3 border-b border-border-default bg-bg-secondary gap-3">
              <div className="size-9 rounded-full bg-bg-surface overflow-hidden border border-border-default"><img src={conv?.avatar} alt="" className="w-full h-full object-cover" /></div>
              <div><p className="text-sm font-semibold text-text-primary">{conv?.username}</p><p className="text-xs text-text-tertiary">{conv?.online ? "Online" : "Offline"}</p></div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
              {msgs.map((msg) => (
                <div key={msg.id} className={\`flex items-end gap-2 \${msg.isMine ? "flex-row-reverse" : ""}\`}>
                  {!msg.isMine && <div className="size-7 rounded-full bg-bg-surface overflow-hidden shrink-0 border border-border-default"><img src={conv?.avatar} alt="" className="w-full h-full object-cover" /></div>}
                  <div className={\`max-w-[60%] px-4 py-2.5 rounded-[var(--radius-lg)] text-sm \${msg.isMine ? "bg-accent text-accent-foreground rounded-br-sm" : "bg-bg-card border border-border-default text-text-primary rounded-bl-sm"}\`}>{msg.text}</div>
                  <span className="text-[10px] text-text-tertiary shrink-0">{msg.time}</span>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-border-default bg-bg-secondary">
              <div className="flex items-center gap-2 bg-bg-input border border-border-default rounded-[var(--radius-lg)] px-3 py-2.5 focus-within:border-border-accent">
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && message.trim()) setMessage(""); }} placeholder={\`Message \${conv?.username}...\`} className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary" />
                <button onClick={() => setMessage("")} disabled={!message.trim()} className="text-text-accent cursor-pointer disabled:opacity-30"><Send size={16} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`,
};
