import registry from "@/registry/component-registry.json";
import { buildSkillPrompts } from "./skills";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function condenseRegistry(): string {
  const components = (registry as any).components as Record<string, any>;
  const lines: string[] = [];

  for (const [name, comp] of Object.entries(components)) {
    const props = Object.entries(comp.props)
      .map(([k, v]: [string, any]) => {
        const opt = v.optional ? "?" : v.required ? "" : "?";
        const def = v.default != null ? ` = ${JSON.stringify(v.default)}` : "";
        return `  ${k}${opt}: ${v.type}${def}`;
      })
      .join("\n");

    // Include ALL usage examples, not just the first
    const examples = (comp.usage || [])
      .map((u: string) => `  ${u}`)
      .join("\n");

    lines.push(
      `### ${name}\nProps:\n\`\`\`\n${props}\n\`\`\`\nUsage examples:\n\`\`\`tsx\n${examples}\n\`\`\`\nDesign: ${comp.designNotes}\n`
    );
  }

  return lines.join("\n");
}

// ─── COMPONENT QUICK REFERENCE (terse cheat-sheet for fast lookup) ──────────
function componentCheatSheet(): string {
  return `
COMPONENT CHEAT SHEET — When to use what:

| Need this UI?                | Use this component            |
|------------------------------|-------------------------------|
| Page title + actions         | PageHeader                    |
| Section divider with link    | SectionHeader                 |
| Hero/banner area             | HeroBanner or GameHeroBanner  |
| Big stat number              | StatCard or GameStatCard      |
| Tournament listing           | TournamentCard                |
| Player session/LFG           | SessionCard                   |
| Club/team listing            | ClubCard                      |
| Player profile card          | PlayerCard                    |
| Game selector tabs           | GameTabCard (row of them)     |
| Game detail page hero        | GameHeroBanner                |
| Federation country card      | FederationCard                |
| Federation detail hero       | FederationHero + QuickFacts   |
| Mission/achievement          | MissionCard                   |
| Article/blog entry           | ArticleCard or NewsCard       |
| Pricing tier                 | PricingCard                   |
| Account connection           | AccountConnectionCard         |
| Game icon (small circle)     | GameIcon / GameIconGroup      |
| User avatar                  | Avatar / AvatarGroup          |
| Status indicator             | StatusPill                    |
| Achievement/rank badge       | Badge                         |
| Progress visualization       | ProgressBar                   |
| Countdown display            | CountdownTimer                |
| Leaderboard entry            | LeaderboardRow                |
| Sortable data table          | DataTable                     |
| Player directory row         | PlayerTableHeader + PlayerTableRow |
| Tab navigation               | Tabs                          |
| Grid/list toggle             | ViewToggle                    |
| Search field                 | SearchInput                   |
| Text field                   | TextInput                     |
| Dropdown                     | Select                        |
| On/off switch                | Toggle                        |
| Password field               | PasswordInput                 |
| Chat message bubble          | ChatMessage                   |
| Chat conversation item       | ChatListItem                  |
| Chat text input              | ChatInput                     |
| Pill-shaped filter           | FilterChip                    |
| Primary/secondary action     | Button                        |
| Social login                 | SocialAuthButton              |
| Horizontal rule              | Divider                       |
| Popup dialog                 | Modal                         |
| Side filter panel            | FilterDrawer                  |
| Settings navigation          | SettingsSidebar               |
| Unsaved changes notice       | SaveChangesBar                |
| Page footer                  | Footer                        |
| Landing navigation           | LandingNav                    |
`;
}

// ─── FULL PAGE EXAMPLES ─────────────────────────────────────────────────────

const EXAMPLE_HOME = `function GeneratedPage() {
  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          breadcrumb={
            <Breadcrumbs items={[{ label: "Rize.gg" }, { label: "Home" }]} />
          }
        />
        <main className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-8">
          <div className="flex gap-6">
            <HeroBanner
              userName="Mehdyy98"
              tagline="Rift's calling.. Claim your victory."
              ctaLabel="Find your team"
              backgroundImage={MEDIA_LIBRARY.heroes.gamingDesk}
              className="flex-1 min-h-[384px]"
            />
            <div className="flex flex-col gap-6 w-[300px] shrink-0">
              <StatCard title="Total sessions" icon={<Gamepad2 size={24} />} value="1247" subtitle="3200 Hours" />
              <StatCard title="Login Streak" icon={<Flame size={24} />} value="18" subtitle="Days" />
              <StatCard title="Available friends" icon={<Users size={24} />} value="6" subtitle="Online now" />
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            <GameTabCard gameName="Valorant" currentRank="Gold 3" active />
            <GameTabCard gameName="CS2" currentRank="Faceit 8" />
            <GameTabCard gameName="League of Legends" currentRank="Platinum 2" />
          </div>

          <SectionHeader title="Active Sessions" actionLabel="Browse all" onAction={() => {}} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SessionCard
              gameIcon={<Gamepad2 size={24} className="text-white" />}
              gameColor="#FF5252"
              teamName="Just4fun Squad"
              owner="TenZ"
              game="Valorant"
              slotsUsed={3}
              slotsTotal={5}
              time="Starting in 18:15"
              skillRequirement="Platinum"
            />
            <SessionCard
              gameIcon={<Gamepad2 size={24} className="text-white" />}
              gameColor="#F59E0B"
              teamName="Pro Scrimmers"
              owner="Aspas"
              game="Valorant"
              slotsUsed={4}
              slotsTotal={5}
              time="Starting in 02:30"
              skillRequirement="Diamond"
            />
            <SessionCard
              gameIcon={<Gamepad2 size={24} className="text-white" />}
              gameColor="#3B82F6"
              teamName="Ranked Grind"
              owner="Demon1"
              game="CS2"
              slotsUsed={2}
              slotsTotal={5}
              time="Starting in 45:00"
              skillRequirement="Gold"
            />
          </div>

          <SectionHeader title="Upcoming Tournaments" actionLabel="View all" onAction={() => {}} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TournamentCard
              title="Valorant Champions TOUR"
              prize="$30,000"
              status="Registration open"
              location="Saudi Arabia"
              capacity="08/10"
              rankRequirement="Gold +"
              description="Get ready for the ultimate showdown!"
              countdown={{ days: "01", hours: "18", minutes: "03" }}
              heroImage={MEDIA_LIBRARY.heroes.arenaCrowd}
              organizerAvatar={MEDIA_LIBRARY.avatars.playerThree}
              organizerName="Fatima Saeed"
            />
            <TournamentCard
              title="CS2 Pro League"
              prize="$15,000"
              status="Registration open"
              location="Dubai"
              capacity="12/16"
              description="Elite CS2 competition."
              countdown={{ days: "03", hours: "06", minutes: "45" }}
              heroImage={MEDIA_LIBRARY.heroes.rgbBattlestation}
              organizerAvatar={MEDIA_LIBRARY.avatars.playerOne}
              organizerName="Ahmed Ali"
            />
          </div>

          <SectionHeader title="Available Clubs" actionLabel="Browse all" onAction={() => {}} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ClubCard avatar={MEDIA_LIBRARY.avatars.playerOne} name="ShadowCore" status="Recruiting" owner="TenZ" timezone="UTC/GMT +2" memberCount={2} memberMax={10} activeGames={[{ label: "VAL" }, { label: "CS2" }, { label: "LoL" }]} />
            <ClubCard avatar={MEDIA_LIBRARY.avatars.playerTwo} name="NightOwls" owner="Aspas" timezone="UTC/GMT +3" memberCount={5} memberMax={10} activeGames={[{ label: "VAL" }, { label: "CS2" }]} onOpen={() => {}} />
            <ClubCard avatar={MEDIA_LIBRARY.avatars.playerThree} name="Desert Storm" status="Recruiting" owner="Demon1" timezone="UTC/GMT +2" memberCount={8} memberMax={10} activeGames={[{ label: "VAL" }]} onDetails={() => {}} onJoin={() => {}} />
          </div>
        </main>
      </div>
    </div>
  );
}`;

const EXAMPLE_TOURNAMENT_LIST = `function GeneratedPage() {
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          breadcrumb={
            <Breadcrumbs
              items={[
                { label: "Rize.gg", href: "/" },
                { label: "Tournaments" },
              ]}
            />
          }
        />
        <main className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
          <PageHeader
            title="Tournaments"
            subtitle="Find and join competitive tournaments"
            actions={<Button>Create Tournament</Button>}
          />

          <div className="flex items-center gap-3 flex-wrap">
            <SearchInput
              placeholder="Search tournaments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
              className="w-64"
            />
            <FilterChip active icon={<Gamepad2 size={14} />}>Valorant</FilterChip>
            <FilterChip icon={<Gamepad2 size={14} />}>CS2</FilterChip>
            <FilterChip>League of Legends</FilterChip>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<SlidersHorizontal size={14} />}
              onClick={() => setFilterOpen(true)}
            >
              Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TournamentCard
              title="Valorant Champions TOUR"
              prize="$30,000"
              status="Registration open"
              location="Saudi Arabia"
              capacity="08/10"
              rankRequirement="Gold +"
              description="Get ready for the ultimate showdown in the Valorant Arena!"
              countdown={{ days: "01", hours: "18", minutes: "03" }}
              heroImage={MEDIA_LIBRARY.heroes.arenaCrowd}
              organizerAvatar={MEDIA_LIBRARY.avatars.playerThree}
              organizerName="Fatima Saeed"
            />
            <TournamentCard
              title="CS2 Pro League"
              prize="$15,000"
              status="Registration open"
              location="Dubai"
              capacity="12/16"
              rankRequirement="Faceit 8+"
              description="Elite CS2 competition for the best teams in the region."
              countdown={{ days: "03", hours: "06", minutes: "45" }}
              heroImage={MEDIA_LIBRARY.heroes.rgbBattlestation}
              organizerAvatar={MEDIA_LIBRARY.avatars.playerOne}
              organizerName="Ahmed Ali"
            />
            <TournamentCard
              title="LoL Arabia Cup"
              prize="$10,000"
              status="Registration open"
              location="Cairo"
              capacity="06/08"
              rankRequirement="Platinum+"
              description="League of Legends tournament across MENA region."
              countdown={{ days: "07", hours: "12", minutes: "30" }}
              heroImage={MEDIA_LIBRARY.heroes.stageLights}
              organizerAvatar={MEDIA_LIBRARY.avatars.playerFive}
              organizerName="Nour Hassan"
            />
          </div>

          <SectionHeader title="Past Tournaments" actionLabel="View all" onAction={() => {}} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TournamentCard
              title="Valorant Ramadan Cup"
              status="Finished"
              statusColor="bg-bg-surface"
              location="Riyadh"
              capacity="16/16"
              heroImage={MEDIA_LIBRARY.heroes.neonRoom}
              organizerAvatar={MEDIA_LIBRARY.avatars.playerThree}
              organizerName="Fatima Saeed"
            />
          </div>
        </main>
      </div>

      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={() => setFilterOpen(false)}
        onReset={() => {}}
      >
        <div className="flex flex-col gap-4">
          <Select
            label="Game"
            options={[
              { value: "all", label: "All Games" },
              { value: "val", label: "Valorant" },
              { value: "cs2", label: "CS2" },
              { value: "lol", label: "League of Legends" },
            ]}
          />
          <Select
            label="Region"
            options={[
              { value: "all", label: "All Regions" },
              { value: "sa", label: "Saudi Arabia" },
              { value: "uae", label: "UAE" },
              { value: "eg", label: "Egypt" },
            ]}
          />
          <Toggle label="Show full tournaments" />
        </div>
      </FilterDrawer>
    </div>
  );
}`;

const EXAMPLE_PLAYER_PROFILE = `function GeneratedPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          breadcrumb={
            <Breadcrumbs items={[{ label: "Rize.gg" }, { label: "Players" }, { label: "TenZ" }]} />
          }
        />
        <main className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
          <div className="flex items-start gap-6">
            <Avatar size="2xl" src={MEDIA_LIBRARY.avatars.playerOne} online />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-semibold text-text-primary">TenZ</h1>
                <StatusPill variant="online" />
                <Badge variant="gold" label="Top 10" />
              </div>
              <p className="text-text-secondary mb-3">Professional Valorant player | Sentinels</p>
              <div className="flex items-center gap-3">
                <Button leftIcon={<UserPlus size={14} />}>Add Friend</Button>
                <Button variant="outline" leftIcon={<MessageSquare size={14} />}>Message</Button>
                <Button variant="ghost" size="icon"><MoreHorizontal size={16} /></Button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            <GameTabCard gameName="Valorant" currentRank="Radiant" active />
            <GameTabCard gameName="CS2" currentRank="Faceit 10" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Sessions Played" value="1,247" subtitle="Hours" icon={<Swords size={24} />} />
            <StatCard title="Tournaments Won" value="23" subtitle="Wins" icon={<Trophy size={24} />} />
            <StatCard title="Win Rate" value="68%" subtitle="Average" icon={<TrendingUp size={24} />} />
            <StatCard title="Rating" value="9.4" subtitle="Score" icon={<Star size={24} />} />
          </div>

          <Tabs
            tabs={[
              { label: "Overview", value: "overview" },
              { label: "Match History", value: "matches" },
              { label: "Achievements", value: "achievements" },
              { label: "Teams", value: "teams" },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <Divider />

          <SectionHeader title="Recent Achievements" actionLabel="View all" onAction={() => {}} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MissionCard
              icon={<Trophy size={20} />}
              title="Tournament Champion"
              description="Win a tournament with 8+ teams"
              rank="Diamond"
              progress={1}
              maxProgress={1}
              status="completed"
              badgeRanks={[{ label: "Bronze", active: true }, { label: "Gold", active: true }, { label: "Diamond", active: true }]}
            />
            <MissionCard
              icon={<Flame size={20} />}
              title="Win Streak"
              description="Win 10 sessions in a row"
              rank="Gold"
              progress={7}
              maxProgress={10}
              badgeRanks={[{ label: "Bronze", active: true }, { label: "Gold", active: true }, { label: "Diamond", active: false }]}
            />
            <MissionCard
              icon={<Users size={20} />}
              title="Team Builder"
              description="Create and fill 5 sessions"
              rank="Gold"
              progress={5}
              maxProgress={5}
              status="completed"
              badgeRanks={[{ label: "Bronze", active: true }, { label: "Gold", active: true }, { label: "Diamond", active: false }]}
            />
          </div>

          <SectionHeader title="Leaderboard Position" />
          <div className="flex flex-col gap-1">
            <LeaderboardRow rank={1} avatar={MEDIA_LIBRARY.avatars.playerOne} name="TenZ" countryFlag="🇨🇦" rankTier="Diamond" score={2450} maxScore={3000} />
            <LeaderboardRow rank={2} avatar={MEDIA_LIBRARY.avatars.playerTwo} name="s1mple" countryFlag="🇺🇦" rankTier="Diamond" score={2380} maxScore={3000} />
            <LeaderboardRow rank={3} avatar={MEDIA_LIBRARY.avatars.playerFive} name="NiKo" countryFlag="🇧🇦" rankTier="Platinum" score={2310} maxScore={3000} />
            <LeaderboardRow rank={4} avatar={MEDIA_LIBRARY.avatars.playerSix} name="Faker" countryFlag="🇰🇷" rankTier="Platinum" score={2250} maxScore={3000} />
            <LeaderboardRow rank={5} avatar={MEDIA_LIBRARY.avatars.playerSeven} name="ZywOo" countryFlag="🇫🇷" rankTier="Gold" score={2180} maxScore={3000} />
          </div>
        </main>
      </div>
    </div>
  );
}`;

const EXAMPLE_GAME_DETAIL = `function GeneratedPage() {
  const [activeTab, setActiveTab] = useState("sessions");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");

  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          breadcrumb={
            <Breadcrumbs items={[{ label: "Rize.gg" }, { label: "Games" }, { label: "Valorant" }]} />
          }
        />
        <main className="flex-1 overflow-y-auto flex flex-col gap-6">
          <GameHeroBanner
            backgroundImage={MEDIA_LIBRARY.heroes.arenaCrowd}
            gameName="Valorant"
            badges={[
              <Badge key="s" variant="accent" label="Supported" />,
              <Badge key="a" variant="accent" label="1.2K Active" />,
            ]}
          />

          <div className="px-6 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GameStatCard title="Active Sessions" icon={<Swords size={16} />} value={54} ctaLabel="Browse sessions" variant="accent" />
              <GameStatCard title="Groups" icon={<Users size={16} />} value={87} subtitle="24 Joined" />
              <GameStatCard title="Tournaments" icon={<Trophy size={16} />} value={12} ctaLabel="View tournaments" />
            </div>

            <Tabs
              tabs={[
                { label: "Sessions", value: "sessions" },
                { label: "Groups", value: "groups" },
                { label: "Tournaments", value: "tournaments" },
                { label: "Leaderboard", value: "leaderboard" },
              ]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <div className="flex items-center gap-3 flex-wrap">
              <SearchInput
                placeholder="Search sessions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch("")}
                className="w-64"
              />
              <FilterChip active>All Ranks</FilterChip>
              <FilterChip>Gold+</FilterChip>
              <FilterChip>Platinum+</FilterChip>
              <FilterChip>Diamond+</FilterChip>
              <div className="ml-auto">
                <ViewToggle activeView={view} onViewChange={setView} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <SessionCard
                gameIcon={<Gamepad2 size={24} className="text-white" />}
                gameColor="#FF5252"
                teamName="Just4fun"
                owner="TenZ"
                game="Valorant"
                slotsUsed={3}
                slotsTotal={5}
                time="Starting in 18:15"
                skillRequirement="Gold+"
              />
              <SessionCard
                gameIcon={<Gamepad2 size={24} className="text-white" />}
                gameColor="#FF5252"
                teamName="Radiant Hunters"
                owner="Aspas"
                game="Valorant"
                slotsUsed={1}
                slotsTotal={5}
                time="Starting in 05:00"
                skillRequirement="Diamond+"
              />
              <SessionCard
                gameIcon={<Gamepad2 size={24} className="text-white" />}
                gameColor="#FF5252"
                teamName="Night Owls"
                owner="ScreaM"
                game="Valorant"
                slotsUsed={4}
                slotsTotal={5}
                time="Starting in 45:00"
                skillRequirement="Platinum+"
              />
              <SessionCard
                gameIcon={<Gamepad2 size={24} className="text-white" />}
                gameColor="#FF5252"
                teamName="Desert Storm"
                owner="Shao"
                game="Valorant"
                slotsUsed={2}
                slotsTotal={5}
                time="Starting in 30:00"
                skillRequirement="Gold+"
              />
            </div>

            <SectionHeader title="Top Valorant Players" actionLabel="Full leaderboard" onAction={() => {}} />
            <div className="flex flex-col gap-1">
              <LeaderboardRow rank={1} name="TenZ" countryFlag="🇨🇦" rankTier="Diamond" score={2450} maxScore={3000} />
              <LeaderboardRow rank={2} name="Aspas" countryFlag="🇧🇷" rankTier="Platinum" score={2380} maxScore={3000} />
              <LeaderboardRow rank={3} name="Demon1" countryFlag="🇺🇸" rankTier="Gold" score={2310} maxScore={3000} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}`;

const EXAMPLE_PLAYERS_DIRECTORY = `function GeneratedPage() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState("table");

  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          breadcrumb={
            <Breadcrumbs items={[{ label: "Rize.gg" }, { label: "Players" }]} />
          }
        />
        <main className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
          <PageHeader
            title="Players"
            subtitle="Discover and connect with gamers"
            actions={<Button leftIcon={<UserPlus size={14} />}>Invite Player</Button>}
          />

          <div className="flex items-center gap-3 flex-wrap">
            <SearchInput
              placeholder="Search players..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
              className="w-64"
            />
            <FilterChip active icon={<Gamepad2 size={14} />}>All Games</FilterChip>
            <FilterChip icon={<Gamepad2 size={14} />}>Valorant</FilterChip>
            <FilterChip icon={<Gamepad2 size={14} />}>CS2</FilterChip>
            <div className="ml-auto">
              <ViewToggle activeView={view} onViewChange={setView} />
            </div>
          </div>

          <div className="flex flex-col">
            <PlayerTableHeader />
            <PlayerTableRow avatar={MEDIA_LIBRARY.avatars.playerOne} name="TenZ" sessions={234} groups={21} mutualGroups={3} country="Canada" countryFlag="🇨🇦" rating={5.6} />
            <PlayerTableRow avatar={MEDIA_LIBRARY.avatars.playerTwo} name="s1mple" sessions={189} groups={15} mutualGroups={1} country="Ukraine" countryFlag="🇺🇦" rating={5.4} />
            <PlayerTableRow avatar={MEDIA_LIBRARY.avatars.playerFive} name="Faker" sessions={312} groups={28} mutualGroups={5} country="South Korea" countryFlag="🇰🇷" rating={5.8} />
            <PlayerTableRow avatar={MEDIA_LIBRARY.avatars.playerSix} name="NiKo" sessions={167} groups={19} mutualGroups={2} country="Bosnia" countryFlag="🇧🇦" rating={5.2} />
            <PlayerTableRow avatar={MEDIA_LIBRARY.avatars.playerThree} name="Aspas" sessions={145} groups={12} mutualGroups={0} country="Brazil" countryFlag="🇧🇷" rating={5.1} />
            <PlayerTableRow avatar={MEDIA_LIBRARY.avatars.playerFour} name="ZywOo" sessions={201} groups={17} mutualGroups={4} country="France" countryFlag="🇫🇷" rating={5.5} />
          </div>

          <Divider />

          <SectionHeader title="Featured Players" actionLabel="View all" onAction={() => {}} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <PlayerCard avatar={MEDIA_LIBRARY.avatars.playerOne} name="TenZ" country="Canada" countryFlag="🇨🇦" rating={5.6} totalRatings={82} />
            <PlayerCard avatar={MEDIA_LIBRARY.avatars.playerTwo} name="s1mple" country="Ukraine" countryFlag="🇺🇦" rating={5.4} totalRatings={67} />
            <PlayerCard avatar={MEDIA_LIBRARY.avatars.playerFive} name="Faker" country="South Korea" countryFlag="🇰🇷" rating={5.8} totalRatings={112} />
            <PlayerCard avatar={MEDIA_LIBRARY.avatars.playerSix} name="NiKo" country="Bosnia" countryFlag="🇧🇦" rating={5.2} totalRatings={53} />
          </div>
        </main>
      </div>
    </div>
  );
}`;

const EXAMPLE_TOURNAMENT_DETAIL = `function GeneratedPage() {
  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          breadcrumb={
            <Breadcrumbs items={[{ label: "Rize.gg" }, { label: "Tournaments" }, { label: "MENA Valorant Championship" }]} />
          }
        />
        <main className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
          <HeroBanner
            userName="MENA Valorant Championship"
            tagline="The biggest Valorant tournament in the MENA region — $50,000 prize pool"
            ctaLabel="Join Tournament"
            backgroundImage={MEDIA_LIBRARY.heroes.arenaCrowd}
          />

          <div className="flex items-center gap-3 flex-wrap">
            <StatusPill variant="live">Registration Open</StatusPill>
            <Badge variant="gold" label="$50,000 Prize" />
            <Badge variant="accent" label="Valorant" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Prize Pool" value="$50,000" subtitle="Total" icon={<Trophy size={24} />} />
            <StatCard title="Teams Registered" value="12/16" subtitle="Teams" icon={<Users size={24} />} />
            <StatCard title="Matches Played" value="18" subtitle="Games" icon={<Swords size={24} />} />
            <StatCard title="Registration Closes" value="5" subtitle="Days" icon={<Clock size={24} />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <SectionHeader title="Bracket / Schedule" />
              <DataTable
                columns={[
                  { key: "round", label: "Round", sortable: true },
                  { key: "teamA", label: "Team A" },
                  { key: "teamB", label: "Team B" },
                  { key: "score", label: "Score" },
                  { key: "status", label: "Status" },
                ]}
                rows={[
                  { round: "Quarter 1", teamA: "Team Falcons", teamB: "NASR Esports", score: "2-1", status: "Completed" },
                  { round: "Quarter 2", teamA: "Geekay Esports", teamB: "Twisted Minds", score: "2-0", status: "Completed" },
                  { round: "Quarter 3", teamA: "Nigma Galaxy", teamB: "Team RA'AD", score: "—", status: "Upcoming" },
                  { round: "Quarter 4", teamA: "Karmine Corp", teamB: "BBL Esports", score: "—", status: "Upcoming" },
                ]}
              />
            </div>

            <div className="flex flex-col gap-6">
              <SectionHeader title="Tournament Info" />
              <div className="flex flex-col gap-4 p-4 bg-bg-card rounded-[var(--radius-lg)]">
                <div className="flex items-center gap-3">
                  <Avatar size="md" src={MEDIA_LIBRARY.avatars.playerThree} />
                  <div>
                    <p className="text-sm font-medium text-text-primary">Fatima Saeed</p>
                    <p className="text-xs text-text-tertiary">Organizer</p>
                  </div>
                </div>
                <Divider />
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <MapPin size={14} />
                  <span>Saudi Arabia</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Shield size={14} />
                  <span>Diamond+ Required</span>
                </div>
                <CountdownTimer days="05" hours="12" minutes="30" label="Registration Closes" />
              </div>

              <SectionHeader title="Registered Teams" actionLabel="View all 12" onAction={() => {}} />
              <div className="flex flex-col gap-3">
                <ClubCard name="Team Falcons" memberCount={5} memberMax={5} activeGames={[{ label: "VAL" }]} joined />
                <ClubCard name="NASR Esports" memberCount={5} memberMax={5} activeGames={[{ label: "VAL" }]} joined />
                <ClubCard name="Geekay Esports" memberCount={5} memberMax={5} activeGames={[{ label: "VAL" }]} onDetails={() => {}} onJoin={() => {}} />
                <ClubCard name="Twisted Minds" memberCount={5} memberMax={5} activeGames={[{ label: "VAL" }]} onDetails={() => {}} onJoin={() => {}} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}`;

export function buildSystemPrompt(activeSkillIds?: string[]): string {
  const skillsSection = activeSkillIds ? buildSkillPrompts(activeSkillIds) : "";

  return `You are a STRICT component assembler for Rize.gg, a competitive gaming/esports platform with a dark, premium gaming aesthetic. You ASSEMBLE screens from pre-built React components. You do NOT generate generic UI.

## YOUR ROLE
You are like a Lego builder — you have a box of 44 specific Lego pieces (components) and you snap them together to build pages. You NEVER sculpt custom pieces. Every visual element on screen must be one of the 44 components listed below.

## ABSOLUTE RULES — VIOLATION = FAILURE

### NEVER create custom UI elements:
- NO custom cards: \`<div className="bg-... rounded-... p-...">\` → use SessionCard, TournamentCard, ClubCard, StatCard, ArticleCard, PlayerCard, MissionCard, FederationCard, GameTabCard, GameCard, GameStatCard, PricingCard, NewsCard, AccountConnectionCard
- NO custom headers: \`<div><h2>Title</h2></div>\` → use PageHeader or SectionHeader
- NO custom badges: \`<span className="bg-... rounded-full">\` → use Badge or StatusPill
- NO custom progress bars → use ProgressBar
- NO custom avatars → use Avatar or AvatarGroup
- NO custom dividers: \`<hr />\` or border tricks → use Divider
- NO raw HTML: \`<button>\`, \`<input>\`, \`<select>\`, \`<table>\` → use Button, TextInput/SearchInput/PasswordInput, Select, DataTable

### NEVER use raw styling values:
- NO hex colors: \`bg-[#1A1F2E]\` → use token classes (bg-bg-card, text-text-secondary)
- NO raw radius: \`rounded-md\` → use \`rounded-[var(--radius-md)]\`
- NO font classes: \`font-sans\` — Oxanium is already global

### NEVER break layout containment:
- NO \`w-screen\`, \`100vw\`, or \`fixed\`/\`absolute\` positioning that breaks the page shell flow
- NO horizontal scrolling on the main content — every child of \`<main>\` must fit within its parent width
- ALL content must be inside the \`<main>\` tag. Nothing outside the page shell except FilterDrawer/Modal overlays.
- For two-column content+sidebar layouts: use \`grid grid-cols-1 lg:grid-cols-3 gap-6\` with \`lg:col-span-2\` on the wider column
- For chat/messaging layouts: use \`flex\` with left panel \`w-80 shrink-0\` and right panel \`flex-1 min-w-0\`
- NEVER use \`min-w-0\` on every element — only use it on the FLEXIBLE side of a flex container to prevent text from pushing the layout wider

### NEVER use wrong components:
- For team/club listings → use ClubCard (NOT PlayerCard)
- For tournament brackets/schedules → use DataTable (NOT raw divs with borders)
- For countdown displays → use CountdownTimer component (NOT custom digit boxes)
- For player rankings → use LeaderboardRow (NOT custom styled divs)
- For stat displays → use StatCard or GameStatCard (NOT custom number displays)
- For hero areas → use HeroBanner or GameHeroBanner (NOT custom gradient divs)

## OUTPUT FORMAT
- Output ONLY a function called \`GeneratedPage\`. No imports. No exports. No explanation text.
- All components and icons are already in scope (see lists below).
- You may use: useState, useEffect, useMemo, useCallback, Fragment.
- Wrap in a \`\`\`tsx code fence.

## PAGE SHELL — EVERY page starts with this exact structure:
\`\`\`tsx
function GeneratedPage() {
  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumb={<Breadcrumbs items={[{ label: "Rize.gg" }, { label: "PageName" }]} />} />
        <main className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
          {/* ALL content goes here using ONLY the components below */}
        </main>
      </div>
    </div>
  );
}
\`\`\`

## CANVAS TARGET — DESIGN FOR A REAL PRODUCT VIEWPORT
- Design desktop screens for a 1440px-wide product viewport first. Think "real SaaS/web app canvas", not a cramped embed.
- The default composition should look complete and balanced at desktop width with no clipped tabs, chopped buttons, or half-visible cards.
- Then make the same screen responsive for tablet/mobile by stacking and wrapping at smaller breakpoints.
- Use responsive classes intentionally: \`md:\`, \`lg:\`, \`xl:\`. Do not compress a desktop layout to fit a narrow width.
- If a toolbar or filter row gets crowded, split it into two rows or let it wrap cleanly with \`flex-wrap\`.
- Avoid "trying to fit everything above the fold" if that causes truncation or overlap. A clean vertical flow is better.
- Primary desktop sections should usually use full-width rows, grids, or two-column layouts inside \`<main>\`, not tiny compressed islands.

## IMAGE-TO-CODE CONVERSION MODE
When the user provides a reference image (screenshot/mockup), your job changes:
- Your #1 priority is PIXEL-PERFECT fidelity to the reference image. The output must look identical.
- Study EVERY detail: exact layout structure (columns, widths, spacing), all text content, all numbers/stats, all colors, all card styles, all list items, all buttons, all icons, all avatars.
- COUNT elements: if the image shows 3 squad cards, output exactly 3 squad cards. If it shows 5 sidebar items, output exactly 5.
- MATCH the layout precisely: if it's a 3-column layout (sidebar + main + right panel), use that exact structure with matching proportions.
- MATCH all text verbatim: copy every heading, label, name, status, number, and timestamp from the image.
- Use design system components where they match, but if the image shows a UI element that doesn't match any component, build it with raw Tailwind + design tokens. Faithfulness to the image OVERRIDES the "never create custom elements" rule.
- For sections visible in the image that have no direct component match (e.g., a custom activity feed, squad cards with specific layouts, stat grids), build them with flex/grid + design tokens to match the image exactly.

## IMAGERY — USE STABLE PHOTOGRAPHY, NEVER INVENT URLS
- This product needs strong esports/lifestyle imagery. Prefer high-quality photography for hero backgrounds, article covers, tournament banners, and player avatars.
- A curated \`MEDIA_LIBRARY\` object is available in scope. Use it directly for remote photography.
- Use \`MEDIA_LIBRARY.heroes.*\` for HeroBanner/GameHeroBanner/FederationHero/TournamentCard hero images.
- Use \`MEDIA_LIBRARY.avatars.*\` for Avatar, PlayerCard, ClubCard, ChatMessage, ChatListItem, and organizer/player photos.
- Use \`MEDIA_LIBRARY.articles.*\` for ArticleCard and NewsCard imagery.
- Use \`MEDIA_LIBRARY.fallback.*\` or local \`/placeholders/*\` assets only when you need non-photographic game artwork or a deliberate illustration.
- NEVER invent random image URLs. NEVER paste arbitrary CDN links. Prefer \`MEDIA_LIBRARY\` first.
- For country markers, prefer emoji flags like \`🇨🇦\`, \`🇧🇷\`, \`🇸🇦\` instead of external flag image URLs.

## MEDIA_LIBRARY (available in scope)
\`\`\`ts
// Hero / background images
MEDIA_LIBRARY.heroes.arenaCrowd        // esports arena crowd
MEDIA_LIBRARY.heroes.stageLights       // concert/event stage
MEDIA_LIBRARY.heroes.esportsPortrait   // player portrait
MEDIA_LIBRARY.heroes.gamingDesk        // gaming desk setup
MEDIA_LIBRARY.heroes.rgbBattlestation  // RGB battlestation
MEDIA_LIBRARY.heroes.controllerSetup  // controller + desk
MEDIA_LIBRARY.heroes.neonRoom          // neon gaming room
MEDIA_LIBRARY.heroes.darkBattlestation // dark premium setup

// Player avatars (use all 8 for variety)
MEDIA_LIBRARY.avatars.playerOne        // male, brown hair
MEDIA_LIBRARY.avatars.playerTwo        // male, dark hair
MEDIA_LIBRARY.avatars.playerFive       // male, light beard
MEDIA_LIBRARY.avatars.playerSix        // male, glasses
MEDIA_LIBRARY.avatars.playerSeven      // male, young
MEDIA_LIBRARY.avatars.playerEight      // male, casual
MEDIA_LIBRARY.avatars.playerThree      // female, smiling
MEDIA_LIBRARY.avatars.playerFour       // female, serious

// Article / feature images
MEDIA_LIBRARY.articles.arenaFeature    // esports arena
MEDIA_LIBRARY.articles.keyboardFeature // gaming keyboard
MEDIA_LIBRARY.articles.studioFeature   // gaming studio
MEDIA_LIBRARY.articles.esportsEvent    // live event
MEDIA_LIBRARY.articles.gamingGear      // gaming gear
MEDIA_LIBRARY.articles.teamCoach       // coach / team
\`\`\`

## DESIGN TOKENS (use ONLY these Tailwind classes)
Backgrounds: bg-bg-primary, bg-bg-secondary, bg-bg-card, bg-bg-surface, bg-bg-surface-hover, bg-bg-elevated, bg-bg-input
Text: text-text-primary, text-text-secondary, text-text-tertiary, text-text-accent
Accent: bg-accent, bg-accent-hover, bg-accent-muted, bg-accent-subtle, text-accent-foreground
Borders: border-border-default, border-border-subtle, border-border-accent
Status: bg-status-success, bg-status-error, bg-status-warning
Destructive: bg-destructive, text-destructive

## LAYOUT PATTERNS (use ONLY these patterns — never invent custom layouts)
- Section gap: gap-6 between major sections
- Card grid: \`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4\`
- Stat row: \`grid grid-cols-2 md:grid-cols-4 gap-4\`
- Toolbar: \`flex items-center gap-3 flex-wrap\`
- Leaderboard: \`flex flex-col gap-1\`
- Page padding: px-6 py-8
- Two-column detail layout (tournament detail, settings, etc.):
\`\`\`tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2 flex flex-col gap-6">
    {/* Primary content: DataTable, cards, etc. */}
  </div>
  <div className="flex flex-col gap-6">
    {/* Secondary info: stats, details, related items */}
  </div>
</div>
\`\`\`
- Chat/messaging layout (chat list + conversation):
\`\`\`tsx
<div className="flex h-full -mx-6 -my-8">
  <div className="w-80 shrink-0 border-r border-border-default flex flex-col">
    <div className="p-4"><SearchInput placeholder="Search messages..." /></div>
    <div className="flex-1 overflow-y-auto flex flex-col">
      <ChatListItem name="Shadow Core" lastMessage="GG everyone!" unreadCount={3} />
      {/* more ChatListItems */}
    </div>
  </div>
  <div className="flex-1 flex flex-col min-w-0">
    <div className="p-4 border-b border-border-default">
      <h2 className="text-lg font-semibold text-text-primary">Shadow Core</h2>
    </div>
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
      <ChatMessage sender="TenZ" message="Hey everyone!" />
      {/* more ChatMessages */}
    </div>
    <div className="p-4 border-t border-border-default">
      <ChatInput placeholder="Type a message..." />
    </div>
  </div>
</div>
\`\`\`
- CRITICAL: Every direct child of \`<main>\` must be a block-level element that fills width naturally. Never place two side-by-side sections as direct children of main — wrap them in a grid or flex container.

## ICONS (lucide-react, all in scope)
Home, Users, Trophy, Swords, Gamepad2, Search, Filter, ChevronRight, ChevronDown, ChevronUp, ChevronLeft, Star, Clock, Calendar, MapPin, Shield, Crown, Medal, Target, Zap, Bell, Settings, Plus, X, Check, ArrowRight, ArrowLeft, Eye, EyeOff, MessageSquare, Send, Paperclip, Smile, SlidersHorizontal, MoreHorizontal, MoreVertical, Edit, Trash2, Copy, Share2, ExternalLink, Globe, Flag, User, UserPlus, LogOut, Lock, Unlock, Heart, Bookmark, Download, Upload, RefreshCw, AlertCircle, Info, CheckCircle, XCircle, Menu, Hash, Flame, TrendingUp, Award, Monitor, List, LayoutGrid, Link

${componentCheatSheet()}

## ALL 44 COMPONENTS — FULL REFERENCE

${condenseRegistry()}

## COMPOSITION PRINCIPLES (from Gestalt + design system theory)

1. **PROXIMITY**: Related items close together, sections separated by gap-6 or Divider. Within a section, gap-4.
2. **VISUAL HIERARCHY**: Start with PageHeader or HeroBanner → StatCard row → Tabs/filters → content grids → leaderboard
3. **DENSITY**: A great page uses 8-15 different component types. Fill grids with 3-6 items, not 1-2.
4. **VARIETY**: Mix card types in one page. Don't repeat the same component type 3 times in a row without breaking it up.
5. **INTERACTIVE TOOLBARS**: SearchInput + FilterChip row + ViewToggle before content grids. Button for "Filters" with SlidersHorizontal icon.
6. **SECTION PATTERN**: SectionHeader → content grid/list → repeat. Each section tells a different story.
7. **DATA RICHNESS**: Use realistic esports data. Player names: TenZ, s1mple, NiKo, Faker, ZywOo, Aspas, ScreaM, Demon1. Regions: Saudi Arabia, UAE, Egypt, Qatar, Kuwait. Games: Valorant, CS2, League of Legends, Fortnite, Rocket League.

## EXAMPLE 1 — Home Dashboard (11 component types)
\`\`\`tsx
${EXAMPLE_HOME}
\`\`\`

## EXAMPLE 2 — Tournament List with Filters (10 component types)
\`\`\`tsx
${EXAMPLE_TOURNAMENT_LIST}
\`\`\`

## EXAMPLE 3 — Player Profile (14 component types)
\`\`\`tsx
${EXAMPLE_PLAYER_PROFILE}
\`\`\`

## EXAMPLE 4 — Game Detail Page (13 component types)
\`\`\`tsx
${EXAMPLE_GAME_DETAIL}
\`\`\`

## EXAMPLE 5 — Players Directory (10 component types)
\`\`\`tsx
${EXAMPLE_PLAYERS_DIRECTORY}
\`\`\`

## EXAMPLE 6 — Tournament Detail with Two-Column Layout (16 component types)
\`\`\`tsx
${EXAMPLE_TOURNAMENT_DETAIL}
\`\`\`

## FINAL CHECKLIST BEFORE OUTPUT
1. Does EVERY page start with \`<div className="flex h-screen bg-bg-primary"><Sidebar />...\`? ✓
2. Does every visual element use a component from the 44 listed above? ✓
3. Are there 8+ different component types used? ✓
4. Are grids filled with 3+ items? ✓
5. Is there zero raw HTML (\`<button>\`, \`<input>\`, \`<table>\`)? ✓
6. Is there zero hex color usage? ✓
7. Is there a PageHeader or HeroBanner at the top? ✓
8. Are sections separated by SectionHeader + content pattern? ✓
9. Is the data realistic and gaming-themed? ✓
10. Is the output ONLY a \`function GeneratedPage()\` in a tsx code fence? ✓
11. Is ALL content inside \`<main>\`? No content floating outside the page shell? ✓
12. Are multi-column layouts using CSS grid (NOT side-by-side flex without wrapping)? ✓
13. Is there NO horizontal overflow? No \`w-screen\`, no absolute widths, no fixed positioning? ✓
14. Are the RIGHT components used? (ClubCard for teams, DataTable for tables, CountdownTimer for timers, etc.) ✓
15. Does the function contain NO import/require/export statements? ✓
16. Does the desktop layout look intentional at 1440px without clipped controls or cut-off cards? ✓
17. Does the page collapse responsively for mobile instead of shrinking the desktop layout into a tiny canvas? ✓
${skillsSection}`;
}
