"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import { liveScope } from "@/lib/generate/scope";
import { MEDIA_LIBRARY } from "@/lib/media-library";
import { useGenerate } from "./_components/useGenerate";
import type { Violation } from "@/lib/generate/validate";
import {
  Sparkles, Code2, Eye, Send, Loader2, Copy, Check, Download,
  XCircle, AlertTriangle, CheckCircle2, Gamepad2, Trophy, Users,
  Star, Globe, Shield, Crown, Swords, Target, Monitor,
  LayoutGrid, MousePointer, Heart, Layers, ChevronDown, ChevronUp,
  ImageIcon, X, RefreshCw, ArrowRight, Smartphone, Maximize2, Minimize2,
  Wand2, DownloadCloud, ArrowRightLeft,
} from "lucide-react";
import { DESIGN_SKILLS } from "@/lib/generate/skills";
import {
  Button, SocialAuthButton, FilterChip,
  TopBar, Breadcrumbs, LandingNav, Tabs, ViewToggle,
  SessionCard, TournamentCard, ClubCard, MissionCard, FederationCard,
  PlayerCard, StatCard, ArticleCard, GameTabCard, GameCard,
  GameStatCard, PricingCard, NewsCard, AccountConnectionCard,
  TextInput, SearchInput, Select, Toggle, PasswordInput, ChatInput,
  StatusPill, Badge, ProgressBar, CountdownTimer, LeaderboardRow,
  PlayerTableRow, PlayerTableHeader,
  ChatMessage, ChatListItem,
  PageHeader, SectionHeader, HeroBanner, SettingsSidebar,
  GameHeroBanner, FederationHero, QuickFacts, Footer,
  Modal, FilterDrawer, SaveChangesBar,
  Avatar, AvatarGroup, Divider, GameIcon, GameIconGroup,
} from "@/components";

// ─── Categories ──────────────────────────────────────────────────────
const CATEGORIES = [
  { key: "buttons", label: "Buttons" },
  { key: "navigation", label: "Navigation" },
  { key: "cards", label: "Cards" },
  { key: "forms", label: "Forms" },
  { key: "data", label: "Data Display" },
  { key: "chat", label: "Chat" },
  { key: "layout", label: "Layout" },
  { key: "overlays", label: "Overlays" },
  { key: "micro", label: "Micro" },
];

// ─── Helpers ─────────────────────────────────────────────────────────
const ITER_KEY = "rize-iterations";
interface SavedIteration { id: string; prompt: string; code: string; timestamp: number; }
function persistIteration(iter: SavedIteration) {
  try {
    const all: SavedIteration[] = JSON.parse(localStorage.getItem(ITER_KEY) || "[]");
    all.unshift(iter);
    localStorage.setItem(ITER_KEY, JSON.stringify(all.slice(0, 50)));
  } catch {}
}

const PLACEHOLDER = `function GeneratedPage() {
  return (
    <div className="flex items-center justify-center h-[600px] bg-bg-primary">
      <div className="text-center flex flex-col gap-4">
        <div className="text-4xl">🎮</div>
        <h2 className="text-xl font-semibold text-text-primary">Rize.gg AI Generator</h2>
        <p className="text-text-secondary text-sm max-w-md">Describe a page and watch it come to life.</p>
      </div>
    </div>
  );
}`;

type PreviewViewport = "desktop" | "mobile";

const PREVIEW_CONFIG: Record<PreviewViewport, { label: string; width: number; height: number }> = {
  desktop: { label: "Desktop", width: 1440, height: 1024 },
  mobile: { label: "Mobile", width: 393, height: 852 },
};

function ViolationBadge({ violations }: { violations: Violation[] }) {
  const errors = violations.filter((v) => v.type === "error").length;
  const warnings = violations.filter((v) => v.type === "warning").length;
  if (!violations.length) return <span className="flex items-center gap-1 text-xs text-green-400"><CheckCircle2 size={12} /> Clean</span>;
  return (
    <span className="flex items-center gap-2 text-xs">
      {errors > 0 && <span className="flex items-center gap-1 text-red-400"><XCircle size={12} /> {errors}</span>}
      {warnings > 0 && <span className="flex items-center gap-1 text-yellow-400"><AlertTriangle size={12} /> {warnings}</span>}
    </span>
  );
}

function PreviewStage({
  viewport,
  expanded,
  children,
}: {
  viewport: PreviewViewport;
  expanded: boolean;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const config = PREVIEW_CONFIG[viewport];

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const updateSize = () => {
      setContainerSize({
        width: node.clientWidth,
        height: node.clientHeight,
      });
    };

    updateSize();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }

    const observer = new ResizeObserver(updateSize);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const framePadding = expanded ? 12 : 24;
  const availableWidth = Math.max(containerSize.width - framePadding * 2, 1);
  const availableHeight = Math.max(containerSize.height - framePadding * 2, 1);
  const scale =
    containerSize.width > 0 && containerSize.height > 0
      ? Math.min(availableWidth / config.width, availableHeight / config.height, 1)
      : 1;

  return (
    <div
      ref={containerRef}
      className="preview-canvas relative flex-1 overflow-auto bg-[radial-gradient(circle_at_top,_rgba(153,249,234,0.08),_transparent_36%),linear-gradient(180deg,_rgba(18,20,21,0.94),_rgba(11,18,17,1))]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(153,249,234,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(153,249,234,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="relative flex min-h-full items-start justify-center p-6">
        <div
          style={{
            width: `${config.width * scale}px`,
            height: `${config.height * scale}px`,
          }}
        >
          <div
            className={`preview-stage ${viewport === "mobile" ? "preview-stage--mobile" : ""} origin-top-left overflow-hidden rounded-[20px] border border-border-default bg-bg-primary shadow-[0_24px_80px_rgba(0,0,0,0.45)]`}
            style={{
              width: `${config.width}px`,
              height: `${config.height}px`,
              transform: `scale(${scale})`,
              ["--preview-width" as string]: `${config.width}px`,
              ["--preview-height" as string]: `${config.height}px`,
            }}
          >
            {children}
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-4 right-4 rounded-full border border-border-default bg-bg-secondary/90 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-text-tertiary backdrop-blur">
        {config.label} • {config.width}x{config.height}
      </div>
    </div>
  );
}

function ViolationList({ violations }: { violations: Violation[] }) {
  if (!violations.length) return null;
  return (
    <div className="border-t border-border-default p-3 max-h-40 overflow-y-auto">
      {violations.map((v, i) => (
        <div key={i} className={`text-xs flex items-start gap-2 mb-1 ${v.type === "error" ? "text-red-400" : "text-yellow-400"}`}>
          {v.type === "error" ? <XCircle size={12} className="mt-0.5 shrink-0" /> : <AlertTriangle size={12} className="mt-0.5 shrink-0" />}
          <div><span className="font-medium">{v.rule}:</span> {v.message}{v.suggestion && <span className="text-text-secondary block">→ {v.suggestion}</span>}</div>
        </div>
      ))}
    </div>
  );
}

function Label({ name, path }: { name: string; path: string }) {
  return (
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border-subtle">
      <span className="text-sm font-medium text-text-primary">{name}</span>
      <code className="text-[10px] text-text-tertiary bg-bg-surface px-1.5 py-0.5 rounded">{path}</code>
    </div>
  );
}

// ─── Visual Sections ─────────────────────────────────────────────────

function ButtonsSection() {
  return (
    <section id="buttons" className="scroll-mt-20 flex flex-col gap-6">
      <div><h2 className="text-lg font-semibold text-text-primary">Buttons</h2><p className="text-xs text-text-secondary mt-1">6 variants, 4 sizes, loading states. Import from @/components/buttons</p></div>

      <Label name="Button" path="@/components/buttons/Button" />
      <div className="flex flex-wrap items-center gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="discord">Discord</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large CTA</Button>
        <Button size="icon"><Star size={16} /></Button>
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button leftIcon={<Trophy size={14} />}>With Left Icon</Button>
        <Button rightIcon={<Swords size={14} />}>With Right Icon</Button>
      </div>

      <Divider />
      <Label name="SocialAuthButton" path="@/components/buttons/SocialAuthButton" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg">
        <SocialAuthButton icon={<Globe size={18} />} provider="Google" />
        <SocialAuthButton icon={<Monitor size={18} />} provider="Twitch" />
        <SocialAuthButton icon={<Gamepad2 size={18} />} provider="Steam" />
      </div>

      <Divider />
      <Label name="FilterChip" path="@/components/buttons/FilterChip" />
      <div className="flex flex-wrap gap-2">
        <FilterChip active icon={<Gamepad2 size={14} />}>Valorant</FilterChip>
        <FilterChip icon={<Gamepad2 size={14} />}>CS2</FilterChip>
        <FilterChip>League of Legends</FilterChip>
        <FilterChip icon={<Swords size={14} />}>Fortnite</FilterChip>
      </div>
    </section>
  );
}

function NavigationSection() {
  const [tab, setTab] = useState("about");
  const [view, setView] = useState<"table" | "grid">("table");
  return (
    <section id="navigation" className="scroll-mt-20 flex flex-col gap-6">
      <div><h2 className="text-lg font-semibold text-text-primary">Navigation</h2><p className="text-xs text-text-secondary mt-1">TopBar, Breadcrumbs, LandingNav, Tabs, ViewToggle. Import from @/components/navigation</p></div>

      <Label name="TopBar + Breadcrumbs" path="@/components/navigation/TopBar" />
      <div className="border border-border-default rounded-[var(--radius-md)] overflow-hidden">
        <TopBar breadcrumb={<Breadcrumbs items={[{ label: "Rize.gg", href: "#" }, { label: "Tournaments", href: "#" }, { label: "Valorant Champions Tour" }]} />} />
      </div>

      <Label name="LandingNav" path="@/components/navigation/LandingNav" />
      <div className="border border-border-default rounded-[var(--radius-md)] overflow-hidden">
        <LandingNav />
      </div>

      <Label name="Tabs" path="@/components/navigation/Tabs" />
      <div className="max-w-md">
        <Tabs tabs={[{ label: "About", value: "about" }, { label: "Articles", value: "articles" }, { label: "Members", value: "members" }]} activeTab={tab} onTabChange={setTab} />
      </div>

      <Label name="ViewToggle" path="@/components/navigation/ViewToggle" />
      <ViewToggle activeView={view} onViewChange={setView} />
    </section>
  );
}

function CardsSection() {
  return (
    <section id="cards" className="scroll-mt-20 flex flex-col gap-6">
      <div><h2 className="text-lg font-semibold text-text-primary">Cards</h2><p className="text-xs text-text-secondary mt-1">14 card components. Import from @/components/cards</p></div>

      <Label name="SessionCard" path="@/components/cards/SessionCard" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SessionCard gameIcon={<Gamepad2 size={24} className="text-white" />} gameColor="#FF5252" teamName="Just4fun Squad" owner="TenZ" game="Valorant" slotsUsed={3} slotsTotal={5} time="Starting in 18:15" skillRequirement="Platinum" />
        <SessionCard gameIcon={<Shield size={24} className="text-white" />} gameColor="#F59E0B" teamName="GG Squad" owner="Aspas" game="CS2" slotsUsed={4} slotsTotal={5} time="Starting in 02:30" skillRequirement="Diamond" />
      </div>

      <Divider />
      <Label name="TournamentCard" path="@/components/cards/TournamentCard" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TournamentCard heroImage="/placeholders/hero-valorant.svg" prize="$30,000" status="Registration open" location="Saudi Arabia" capacity="08/10" rankRequirement="Gold +" gameIcon="/placeholders/game-icon-val.svg" title="Valorant Champions TOUR" description="Get ready for the ultimate showdown!" countdown={{ days: "01", hours: "18", minutes: "03" }} organizerAvatar="/placeholders/avatar-1.svg" organizerName="Fatima Saeed" />
        <TournamentCard heroImage="/placeholders/game-cs2.svg" prize="$10,000" status="Registration open" location="Online" capacity="32/64" gameIcon="/placeholders/game-icon-cs2.svg" title="CS2 Major Qualifier" description="Qualify for the next CS2 Major." countdown={{ days: "03", hours: "06", minutes: "45" }} organizerAvatar="/placeholders/avatar-2.svg" organizerName="Coach Eduardo" />
      </div>

      <Divider />
      <Label name="ClubCard" path="@/components/cards/ClubCard" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ClubCard avatar="/placeholders/avatar-1.svg" name="Shadow Core" status="Recruiting" owner="MohTarek" timezone="UTC/GMT +2" memberCount={2} memberMax={10} />
        <ClubCard avatar="/placeholders/avatar-2.svg" name="Pixel Warriors" status="Recruiting" owner="Aspas" timezone="UTC-5" memberCount={8} memberMax={10} />
      </div>

      <Divider />
      <Label name="MissionCard" path="@/components/cards/MissionCard" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MissionCard icon={<Trophy size={24} className="text-rank-gold" />} title="Win 10 Matches" description="Win matches in any competitive mode" rank="Gold" progress={7} maxProgress={10} badgeRanks={[{ label: "Bronze", active: true }, { label: "Gold", active: true }, { label: "Diamond", active: false }]} />
        <MissionCard icon={<Target size={24} className="text-text-accent" />} title="Play 50 Sessions" description="Join and complete 50 gaming sessions" rank="Diamond" progress={42} maxProgress={50} status="in_progress" badgeRanks={[{ label: "Bronze", active: true }, { label: "Gold", active: true }, { label: "Diamond", active: true }]} />
      </div>

      <Divider />
      <Label name="FederationCard" path="@/components/cards/FederationCard" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <FederationCard flagEmoji="🇸🇦" country="Saudi Arabia" memberCount={1250} />
        <FederationCard flagEmoji="🇦🇪" country="UAE" memberCount={890} />
        <FederationCard flagEmoji="🇪🇬" country="Egypt" memberCount={2100} />
        <FederationCard flagEmoji="🇯🇴" country="Jordan" memberCount={450} />
      </div>

      <Divider />
      <Label name="PlayerCard" path="@/components/cards/PlayerCard" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <PlayerCard avatar="/placeholders/avatar-1.svg" name="TenZ" country="Canada" countryFlag="🇨🇦" rating={5.6} totalRatings={82} games={[{ bgColor: "bg-status-error" }, { bgColor: "bg-bg-surface" }]} />
        <PlayerCard avatar="/placeholders/avatar-2.svg" name="Aspas" country="Brazil" countryFlag="🇧🇷" rating={4.8} totalRatings={64} games={[{ bgColor: "bg-status-error" }]} />
      </div>

      <Divider />
      <Label name="StatCard" path="@/components/cards/StatCard" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Active Players" value="12,450" icon={<Users size={16} />} />
        <StatCard title="Tournaments" value="89" subtitle="live" icon={<Trophy size={16} />} />
        <StatCard title="Total Sessions" value="3,280" icon={<Gamepad2 size={16} />} />
        <StatCard title="Clubs" value="156" icon={<Crown size={16} />} />
      </div>

      <Divider />
      <Label name="ArticleCard" path="@/components/cards/ArticleCard" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ArticleCard image="/placeholders/game-valorant.svg" badge="Fresh Article" title="VCT 2025 Preview" description="Everything about the upcoming VCT season." date="Mar 4, 2025" />
        <ArticleCard image="/placeholders/game-cs2.svg" badge="Esports" title="CS2 Major Copenhagen" description="The biggest CS2 tournament kicks off next week." date="Feb 28, 2025" />
        <ArticleCard badge="Guide" title="Beginner's Guide to Scrims" description="How to find the perfect team for practice." date="Feb 20, 2025" />
      </div>

      <Divider />
      <Label name="GameTabCard" path="@/components/cards/GameTabCard" />
      <div className="flex gap-3 overflow-x-auto pb-2">
        <GameTabCard icon={<Gamepad2 size={16} />} gameName="Valorant" currentRank="Gold 3" active />
        <GameTabCard icon={<Shield size={16} />} gameName="CS2" currentRank="Faceit 8" />
        <GameTabCard icon={<Crown size={16} />} gameName="League of Legends" currentRank="Platinum 2" />
      </div>

      <Divider />
      <Label name="GameCard" path="@/components/cards/GameCard" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <GameCard image="/placeholders/game-valorant.svg" name="Valorant" activeSessions={54} />
        <GameCard image="/placeholders/game-cs2.svg" name="Counter-Strike 2" activeSessions={38} />
        <GameCard image="/placeholders/game-lol.svg" name="League of Legends" activeSessions={27} />
      </div>

      <Divider />
      <Label name="GameStatCard" path="@/components/cards/GameStatCard" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GameStatCard title="Active Sessions" icon={<Gamepad2 size={16} />} value={54} ctaLabel="Browse sessions" variant="accent" />
        <GameStatCard title="Groups" icon={<Users size={16} />} value={87} subtitle="24 Joined" />
        <GameStatCard title="Tournaments" icon={<Trophy size={16} />} value={12} subtitle="3 Active" ctaLabel="View all" />
      </div>

      <Divider />
      <Label name="PricingCard" path="@/components/cards/PricingCard" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <PricingCard title="Basic" price="$11.90" features={["Access to tournaments", "Community chat", "Basic matchmaking", "Player profile"]} />
        <PricingCard title="Premium" price="$19.90" features={["All basic features", "Priority matchmaking", "Custom badges", "Advanced analytics", "Priority support"]} highlighted backgroundImage="/placeholders/hero-gaming.svg" />
      </div>

      <Divider />
      <Label name="NewsCard" path="@/components/cards/NewsCard" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NewsCard avatar="/placeholders/avatar-1.svg" authorName="Coach Eduardo" label="Announcement" title="New Regulation Update" body="The federation has updated the competitive ruleset for Season 3. All teams must review the new guidelines." date="2 days ago" image="/placeholders/article-1.svg" />
        <NewsCard avatar="/placeholders/avatar-2.svg" authorName="Admin Team" label="News" title="Server Maintenance Complete" body="All servers are back online with improved matchmaking speed and reduced latency." date="5 hours ago" />
      </div>

      <Divider />
      <Label name="AccountConnectionCard" path="@/components/cards/AccountConnectionCard" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <AccountConnectionCard icon={<Gamepad2 size={20} />} platform="Steam" connected username="player_tenz" />
        <AccountConnectionCard icon={<Monitor size={20} />} platform="Discord" description="Link your Discord for voice chat" />
      </div>
    </section>
  );
}

function FormsSection() {
  const [search, setSearch] = useState("");
  const [toggleOn, setToggleOn] = useState(true);
  return (
    <section id="forms" className="scroll-mt-20 flex flex-col gap-6">
      <div><h2 className="text-lg font-semibold text-text-primary">Forms</h2><p className="text-xs text-text-secondary mt-1">TextInput, SearchInput, Select, Toggle, PasswordInput, ChatInput. Import from @/components/forms</p></div>

      <Label name="TextInput" path="@/components/forms/TextInput" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <TextInput label="Username" placeholder="Enter username" />
        <TextInput label="Email" placeholder="you@example.com" error="Invalid email address" />
        <TextInput label="With hint" placeholder="Display name" hint="Visible to other players" />
        <TextInput label="With icon" placeholder="Search..." leftIcon={<Star size={14} />} />
      </div>

      <Divider />
      <Label name="SearchInput" path="@/components/forms/SearchInput" />
      <div className="max-w-md"><SearchInput placeholder="Search players..." value={search} onChange={(e) => setSearch(e.target.value)} onClear={() => setSearch("")} /></div>

      <Divider />
      <Label name="Select" path="@/components/forms/Select" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <Select label="Region" placeholder="Select region" options={[{ value: "eu", label: "Europe" }, { value: "na", label: "North America" }, { value: "asia", label: "Asia" }]} />
        <Select label="Game" options={[{ value: "val", label: "Valorant" }, { value: "cs2", label: "CS2" }]} error="Please select a game" />
      </div>

      <Divider />
      <Label name="PasswordInput" path="@/components/forms/PasswordInput" />
      <div className="max-w-sm"><PasswordInput label="Password" placeholder="Enter password" /></div>

      <Divider />
      <Label name="Toggle" path="@/components/forms/Toggle" />
      <div className="flex flex-col gap-3 max-w-sm">
        <Toggle checked={toggleOn} onChange={setToggleOn} label="Notifications" />
        <Toggle label="Dark Mode (off)" />
        <Toggle checked disabled label="Disabled (on)" />
      </div>

      <Divider />
      <Label name="ChatInput" path="@/components/forms/ChatInput" />
      <div className="max-w-2xl"><ChatInput onAttach={() => {}} onEmoji={() => {}} onSticker={() => {}} /></div>
    </section>
  );
}

function DataSection() {
  return (
    <section id="data" className="scroll-mt-20 flex flex-col gap-6">
      <div><h2 className="text-lg font-semibold text-text-primary">Data Display</h2><p className="text-xs text-text-secondary mt-1">StatusPill, Badge, ProgressBar, CountdownTimer, LeaderboardRow, PlayerTable. Import from @/components/data</p></div>

      <Label name="StatusPill" path="@/components/data/StatusPill" />
      <div className="flex flex-wrap gap-2">
        <StatusPill variant="registration_open" />
        <StatusPill variant="live" />
        <StatusPill variant="finished" />
        <StatusPill variant="playing" />
        <StatusPill variant="idle" />
        <StatusPill variant="recruiting" />
        <StatusPill variant="online" />
        <StatusPill variant="offline" />
      </div>

      <Divider />
      <Label name="Badge" path="@/components/data/Badge" />
      <div className="flex flex-wrap gap-2">
        <Badge variant="default" label="Default" />
        <Badge variant="accent" label="Accent" />
        <Badge variant="gold" label="1st Place" />
        <Badge variant="silver" label="2nd Place" />
        <Badge variant="bronze" label="3rd Place" />
        <Badge variant="diamond" label="Diamond" />
      </div>

      <Divider />
      <Label name="ProgressBar" path="@/components/data/ProgressBar" />
      <div className="flex flex-col gap-4 max-w-md">
        <ProgressBar value={65} max={100} label="Gold" showCount />
        <ProgressBar value={30} max={100} />
        <ProgressBar value={95} max={100} label="Complete" showCount size="md" />
      </div>

      <Divider />
      <Label name="CountdownTimer" path="@/components/data/CountdownTimer" />
      <div className="max-w-sm"><CountdownTimer days="01" hours="18" minutes="03" /></div>

      <Divider />
      <Label name="LeaderboardRow" path="@/components/data/LeaderboardRow" />
      <div className="flex flex-col gap-1 max-w-2xl">
        <LeaderboardRow rank={1} avatar="/placeholders/avatar-1.svg" name="FlashBang" country="Saudi Arabia" rankTier="Diamond" score={212} maxScore={250} />
        <LeaderboardRow rank={2} avatar="/placeholders/avatar-2.svg" name="Aspas" country="Brazil" rankTier="Platinum" score={198} maxScore={250} />
        <LeaderboardRow rank={3} avatar="/placeholders/avatar-3.svg" name="Demon1" country="Sweden" rankTier="Diamond" score={185} maxScore={250} />
        <LeaderboardRow rank={4} name="yay" country="USA" rankTier="Gold" score={170} maxScore={250} />
      </div>

      <Divider />
      <Label name="PlayerTableRow + Header" path="@/components/data/PlayerTableRow" />
      <div className="max-w-4xl border border-border-default rounded-[var(--radius-md)] overflow-hidden">
        <PlayerTableHeader />
        <PlayerTableRow avatar="/placeholders/avatar-1.svg" name="TenZ" sessions={234} groups={21} mutualGroups={3} games={[{ src: "/placeholders/game-icon-val.svg", bgColor: "bg-[#FF4655]" }, { src: "/placeholders/game-icon-cs2.svg", bgColor: "bg-[#DE9B35]" }]} countryFlag="🇨🇦" country="Canada" rating={5.6} />
        <PlayerTableRow avatar="/placeholders/avatar-2.svg" name="Aspas" sessions={189} groups={15} mutualGroups={2} games={[{ src: "/placeholders/game-icon-val.svg", bgColor: "bg-[#FF4655]" }]} countryFlag="🇧🇷" country="Brazil" rating={4.8} />
      </div>
    </section>
  );
}

function ChatSection() {
  return (
    <section id="chat" className="scroll-mt-20 flex flex-col gap-6">
      <div><h2 className="text-lg font-semibold text-text-primary">Chat</h2><p className="text-xs text-text-secondary mt-1">ChatMessage, ChatListItem. Import from @/components/chat</p></div>

      <Label name="ChatMessage" path="@/components/chat/ChatMessage" />
      <div className="max-w-2xl border border-border-default rounded-[var(--radius-md)] overflow-hidden">
        <ChatMessage avatar="/placeholders/avatar-1.svg" username="TenZ" roleBadge="Leader" timestamp="2:30 PM" message="Hey team, let's run some scrims tonight. Who's in?" />
        <ChatMessage avatar="/placeholders/avatar-2.svg" username="Aspas" timestamp="2:32 PM" message="I'm down! What time?" replyTo={{ username: "TenZ", text: "Hey team, let's run some scrims tonight" }} />
        <ChatMessage avatar="/placeholders/avatar-3.svg" username="Demon1" timestamp="2:35 PM" message="Count me in. Let's go 8 PM server time." />
      </div>

      <Divider />
      <Label name="ChatListItem" path="@/components/chat/ChatListItem" />
      <div className="flex flex-col gap-1 max-w-xs">
        <ChatListItem avatar="/placeholders/avatar-1.svg" name="Shadow Core" status="5 online" unreadCount={3} active />
        <ChatListItem avatar="/placeholders/avatar-2.svg" name="Valorant Squad" status="In Game" memberCount={5} />
        <ChatListItem name="TenZ" status="Online" />
      </div>
    </section>
  );
}

function LayoutSection() {
  return (
    <section id="layout" className="scroll-mt-20 flex flex-col gap-6">
      <div><h2 className="text-lg font-semibold text-text-primary">Layout</h2><p className="text-xs text-text-secondary mt-1">PageHeader, SectionHeader, HeroBanner, GameHeroBanner, FederationHero, QuickFacts, SettingsSidebar, Footer. Import from @/components/layout</p></div>

      <Label name="PageHeader" path="@/components/layout/PageHeader" />
      <PageHeader title="Tournaments" subtitle="Find and join competitive tournaments" actions={<Button>Create Tournament</Button>} />

      <Divider />
      <Label name="SectionHeader" path="@/components/layout/SectionHeader" />
      <SectionHeader title="Upcoming Tournaments" onAction={() => {}} />

      <Divider />
      <Label name="HeroBanner" path="@/components/layout/HeroBanner" />
      <HeroBanner userName="Mehdyy98" tagline="Rift's calling.. Claim your victory." ctaLabel="Find your team" backgroundImage="/placeholders/hero-gaming.svg" />

      <Divider />
      <Label name="GameHeroBanner" path="@/components/layout/GameHeroBanner" />
      <GameHeroBanner backgroundImage="/placeholders/hero-valorant.svg" gameName="Valorant" badges={[<Badge key="1" variant="accent" label="Supported" />, <Badge key="2" variant="accent" label="Active" />]} />

      <Divider />
      <Label name="FederationHero" path="@/components/layout/FederationHero" />
      <FederationHero backgroundImage="/placeholders/federation-hero.svg" federationName="São Paulo Federation" tagline="One Nation, One Game, One Victory." actions={<><Button>Become a member</Button><Button variant="outline">Set Up</Button></>} />

      <Divider />
      <Label name="QuickFacts" path="@/components/layout/FederationHero" />
      <div className="max-w-sm">
        <QuickFacts facts={[{ label: "Members", value: "1,250" }, { label: "Founded", value: "2023" }, { label: "Region", value: "South America" }]} contactInfo={[{ label: "Email", value: "info@spfed.gg" }]} />
      </div>

      <Divider />
      <Label name="SettingsSidebar" path="@/components/layout/SettingsSidebar" />
      <div className="max-w-xs">
        <SettingsSidebar sections={[{ title: "User Settings", items: [{ label: "My Account", active: true }, { label: "Profile" }, { label: "Privacy & Safety" }] }, { title: "Platform Settings", items: [{ label: "Notifications" }, { label: "Appearance" }] }]} />
      </div>

      <Divider />
      <Label name="Footer" path="@/components/layout/Footer" />
      <div className="border border-border-default rounded-[var(--radius-md)] overflow-hidden"><Footer /></div>
    </section>
  );
}

function OverlaysSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toggleOn, setToggleOn] = useState(true);
  return (
    <section id="overlays" className="scroll-mt-20 flex flex-col gap-6">
      <div><h2 className="text-lg font-semibold text-text-primary">Overlays</h2><p className="text-xs text-text-secondary mt-1">Modal, FilterDrawer, SaveChangesBar. Import from @/components/overlays</p></div>

      <Label name="Modal" path="@/components/overlays/Modal" />
      <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Tournament" footer={<><Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={() => setModalOpen(false)}>Create</Button></>}>
        <div className="flex flex-col gap-4">
          <TextInput label="Tournament Name" placeholder="Enter name" />
          <Select label="Game" options={[{ value: "val", label: "Valorant" }, { value: "cs2", label: "CS2" }]} />
        </div>
      </Modal>

      <Divider />
      <Label name="FilterDrawer" path="@/components/overlays/FilterDrawer" />
      <Button variant="outline" onClick={() => setDrawerOpen(true)}>Open Filter Drawer</Button>
      <FilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onApply={() => setDrawerOpen(false)} onReset={() => {}}>
        <div className="flex flex-col gap-4">
          <Select label="Game" options={[{ value: "all", label: "All Games" }, { value: "val", label: "Valorant" }]} />
          <Toggle checked={toggleOn} onChange={setToggleOn} label="Show full only" />
        </div>
      </FilterDrawer>

      <Divider />
      <Label name="SaveChangesBar" path="@/components/overlays/SaveChangesBar" />
      <p className="text-[10px] text-text-tertiary">SaveChangesBar is fixed to viewport bottom. Click below to preview:</p>
      <SaveChangesBar visible onSave={() => {}} onDiscard={() => {}} />
    </section>
  );
}

function MicroSection() {
  return (
    <section id="micro" className="scroll-mt-20 flex flex-col gap-6">
      <div><h2 className="text-lg font-semibold text-text-primary">Micro Components</h2><p className="text-xs text-text-secondary mt-1">Avatar, AvatarGroup, Divider, GameIcon, GameIconGroup. Import from @/components/micro</p></div>

      <Label name="Avatar" path="@/components/micro/Avatar" />
      <div className="flex items-end gap-4">
        {(["xs", "sm", "md", "lg", "xl", "2xl"] as const).map((size) => (
          <div key={size} className="flex flex-col items-center gap-1">
            <Avatar size={size} src={size !== "xs" && size !== "2xl" ? "/placeholders/avatar-1.svg" : undefined} online={size === "md" || size === "xl"} />
            <span className="text-[10px] text-text-tertiary">{size}</span>
          </div>
        ))}
      </div>

      <Divider />
      <Label name="AvatarGroup" path="@/components/micro/Avatar" />
      <AvatarGroup avatars={[{ src: "/placeholders/avatar-1.svg" }, { src: "/placeholders/avatar-2.svg" }, { src: "/placeholders/avatar-3.svg" }, {}, {}, {}]} max={4} />

      <Divider />
      <Label name="Divider" path="@/components/micro/Divider" />
      <div className="flex flex-col gap-4 max-w-md">
        <Divider />
        <Divider label="or" />
        <Divider label="continue with" />
      </div>

      <Divider />
      <Label name="GameIcon + GameIconGroup" path="@/components/micro/GameIcon" />
      <div className="flex items-center gap-4">
        <GameIcon src="/placeholders/game-icon-val.svg" bgColor="bg-[#FF4655]" size="sm" />
        <GameIcon src="/placeholders/game-icon-cs2.svg" bgColor="bg-[#DE9B35]" size="md" />
        <GameIcon src="/placeholders/game-icon-lol.svg" bgColor="bg-[#C8AA6E]" size="lg" />
      </div>
      <GameIconGroup games={[{ src: "/placeholders/game-icon-val.svg", bgColor: "bg-[#FF4655]" }, { src: "/placeholders/game-icon-cs2.svg", bgColor: "bg-[#DE9B35]" }, { src: "/placeholders/game-icon-lol.svg", bgColor: "bg-[#C8AA6E]" }, { bgColor: "bg-purple-600" }, { bgColor: "bg-blue-600" }]} max={3} />
    </section>
  );
}

// ─── Main ────────────────────────────────────────────────────────────
export default function GeneratePage() {
  const [activeTab, setActiveTab] = useState<"reference" | "generator">("generator");
  const [activeCategory, setActiveCategory] = useState("buttons");

  // Generator state
  const [selectedModel, setSelectedModel] = useState<"claude-opus-4.6" | "gemini-3.1-pro" | "chatgpt-5.4">("claude-opus-4.6");
  const [previewViewport, setPreviewViewport] = useState<PreviewViewport>("desktop");
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("rize-api-key") || "";
    return "";
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showViolations, setShowViolations] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [activeSkills, setActiveSkills] = useState<string[]>(() =>
    DESIGN_SKILLS.filter((s) => s.defaultOn).map((s) => s.id)
  );
  const [referenceImage, setReferenceImage] = useState<{ base64: string; mimeType: string; preview: string } | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const { code, streamingCode, isGenerating, error, violations, generate, setCode } = useGenerate();
  const previewScope = useMemo(() => ({ ...liveScope, MEDIA_LIBRARY }), []);
  const liveProviderKey = `${previewViewport}-${isPreviewExpanded ? "expanded" : "docked"}-${code.length}`;

  const toggleSkill = (id: string) => {
    setActiveSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleImageAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const MAX = 768;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        const scale = MAX / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
      const base64 = dataUrl.split(",")[1];
      setReferenceImage({ base64, mimeType: "image/jpeg", preview: dataUrl });
    };
    img.src = URL.createObjectURL(file);
    e.target.value = "";
  };

  useEffect(() => {
    if (code && lastPrompt && !isGenerating) {
      persistIteration({ id: Date.now().toString(), prompt: lastPrompt, code, timestamp: Date.now() });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, isGenerating]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setLastPrompt(prompt.trim());
    setPrompt("");
    const img = referenceImage ? { base64: referenceImage.base64, mimeType: referenceImage.mimeType } : null;
    setReferenceImage(null);
    await generate(prompt.trim(), selectedModel, activeSkills, img, apiKey || undefined);
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim() || isGenerating || isGeneratingImage) return;
    setLastPrompt(prompt.trim());
    const currentPrompt = prompt.trim();
    setPrompt("");
    setIsGeneratingImage(true);
    setImageError(null);
    setGeneratedImage(null);
    setCode("");

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: currentPrompt, apiKey: apiKey || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      if (data.imageDataUri) {
        setGeneratedImage(data.imageDataUri);
      } else {
        throw new Error("No image returned");
      }
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Image generation failed");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleDownloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.download = `rize-design-${Date.now()}.png`;
    link.href = generatedImage;
    link.click();
  };

  const handleConvertToCode = async () => {
    if (!generatedImage) return;
    setGeneratedImage(null);
    const img = { base64: generatedImage.split(",")[1], mimeType: "image/png" };
    const convertPrompt = lastPrompt
      ? `Recreate this UI design exactly as shown in the reference image. The design shows: ${lastPrompt}. Match the layout, colors, typography, and spacing precisely.`
      : "Recreate this UI design exactly as shown in the reference image. Match the layout, colors, typography, and spacing precisely.";
    await generate(convertPrompt, selectedModel, activeSkills, img, apiKey || undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleGenerate(); }
  };

  const togglePreviewExpanded = () => {
    setIsPreviewExpanded((prev) => !prev);
  };

  const liveCode = code ? `${code}\nrender(<GeneratedPage />);` : `${PLACEHOLDER}\nrender(<GeneratedPage />);`;

  const sections: Record<string, React.ReactNode> = {
    buttons: <ButtonsSection />,
    navigation: <NavigationSection />,
    cards: <CardsSection />,
    forms: <FormsSection />,
    data: <DataSection />,
    chat: <ChatSection />,
    layout: <LayoutSection />,
    overlays: <OverlaysSection />,
    micro: <MicroSection />,
  };

  const promptSuggestions = [
    { icon: <Users size={14} />, label: "Player profile with stats and achievements" },
    { icon: <Trophy size={14} />, label: "Tournament bracket with live scores" },
    { icon: <Gamepad2 size={14} />, label: "Team finder with filters and search" },
    { icon: <Star size={14} />, label: "Missions & rewards dashboard" },
    { icon: <Globe size={14} />, label: "Federation overview with leaderboard" },
    { icon: <Crown size={14} />, label: "Club management page" },
  ];

  const generationSteps = [
    { label: "Analyzing prompt", done: !!streamingCode },
    { label: "Assembling components", done: (streamingCode?.length || 0) > 200 },
    { label: "Applying design tokens", done: (streamingCode?.length || 0) > 500 },
    { label: "Validating output", done: !!code && !isGenerating },
  ];

  const activeRules = DESIGN_SKILLS.filter((skill) => activeSkills.includes(skill.id));
  const generationActiveStep = generationSteps.findIndex((step) => !step.done);
  const generationNarrative = isGenerating
    ? (streamingCode?.length || 0) > 900
      ? "Polishing responsive behavior and final details."
      : (streamingCode?.length || 0) > 350
        ? "Aligning the layout to your design system and spacing rhythm."
        : (streamingCode?.length || 0) > 80
          ? "Shaping the main composition and component hierarchy."
          : "Reading the brief and locking onto the right visual direction."
    : code
      ? "Preview updated. Refine the brief or switch models to compare directions."
      : "Describe the screen you want, and the preview will grow from the brief.";
  const promptGuidance = !prompt.trim()
    ? "Lead with the screen type, then add mood, hierarchy, and any must-keep constraints."
    : prompt.trim().length < 90
      ? "Good start. Add the key hero moment, content density, and what should feel premium."
      : referenceImage
        ? "Strong brief. Your reference image is attached and will guide the art direction."
        : "Strong brief. Add a reference image only if you want tighter visual matching.";
  const friendlyError = error
    ? /429|quota|billing/i.test(error)
      ? "That model is unavailable right now. Switch models or try again in a moment."
      : "Generation paused before the preview finished. Try again or tighten the brief."
    : null;

  return (
    <div className="flex h-screen bg-bg-primary text-text-primary">
      {/* Sidebar */}
      <div className={`${activeTab === "generator" && isPreviewExpanded ? "hidden" : "flex"} w-[420px] flex-col border-r border-border-default bg-bg-secondary shrink-0 transition-all duration-300`}>
        <div className="h-14 border-b border-border-default flex items-center px-4 gap-2">
          <div className="size-7 rounded-[var(--radius-sm)] bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
            <Sparkles size={14} className="text-text-accent" />
          </div>
          <span className="font-semibold text-sm">Design System</span>
        </div>

        <div className="flex border-b border-border-default">
          <button onClick={() => setActiveTab("reference")} className={`flex-1 text-xs font-medium py-2.5 transition-colors cursor-pointer ${activeTab === "reference" ? "text-text-accent border-b-2 border-accent" : "text-text-tertiary hover:text-text-secondary"}`}>Components</button>
          <button onClick={() => setActiveTab("generator")} className={`flex-1 text-xs font-medium py-2.5 transition-colors cursor-pointer ${activeTab === "generator" ? "text-text-accent border-b-2 border-accent" : "text-text-tertiary hover:text-text-secondary"}`}>AI Generate</button>
        </div>

        {activeTab === "reference" ? (
          <nav className="flex-1 overflow-y-auto py-2">
            {CATEGORIES.map((cat) => (
              <a key={cat.key} href={`#${cat.key}`} onClick={(e) => { e.preventDefault(); setActiveCategory(cat.key); document.getElementById(cat.key)?.scrollIntoView({ behavior: "smooth" }); }}
                className={`block px-4 py-2 text-xs transition-colors cursor-pointer ${activeCategory === cat.key ? "text-text-accent bg-accent-subtle border-r-2 border-accent" : "text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover"}`}
              >{cat.label}</a>
            ))}
          </nav>
        ) : (
          <div className="flex-1 flex min-h-0 flex-col overflow-hidden">
            <div className="flex-1" />

            <div className="border-t border-border-default px-5 py-4">
              <p className="text-xs text-text-secondary">
                {friendlyError || generationNarrative}
              </p>

              <div className="mt-4 flex items-center gap-3">
                <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-text-tertiary">Model</span>
                <div className="flex items-center gap-1 rounded-[var(--radius-sm)] bg-bg-input p-0.5 flex-1">
                  <button onClick={() => setSelectedModel("claude-opus-4.6")} className={`flex-1 rounded-sm py-1.5 text-[11px] font-medium transition-colors cursor-pointer ${selectedModel === "claude-opus-4.6" ? "bg-bg-surface text-text-primary" : "text-text-tertiary hover:text-text-secondary"}`}>Claude Opus 4.6</button>
                  <button onClick={() => setSelectedModel("gemini-3.1-pro")} className={`flex-1 rounded-sm py-1.5 text-[11px] font-medium transition-colors cursor-pointer ${selectedModel === "gemini-3.1-pro" ? "bg-bg-surface text-text-primary" : "text-text-tertiary hover:text-text-secondary"}`}>Gemini 3.1 Pro</button>
                  <button onClick={() => setSelectedModel("chatgpt-5.4")} className={`flex-1 rounded-sm py-1.5 text-[11px] font-medium transition-colors cursor-pointer ${selectedModel === "chatgpt-5.4" ? "bg-bg-surface text-text-primary" : "text-text-tertiary hover:text-text-secondary"}`}>ChatGPT 5.4</button>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-text-tertiary">API Key</span>
                <div className="flex items-center gap-1 flex-1 rounded-[var(--radius-sm)] border border-border-default bg-bg-input px-2.5 py-1.5">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value);
                      localStorage.setItem("rize-api-key", e.target.value);
                    }}
                    placeholder="sk-or-... (OpenRouter)"
                    className="flex-1 bg-transparent text-[11px] text-text-primary outline-none placeholder:text-text-tertiary"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"
                  >
                    <Eye size={12} />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe the page you want to generate..."
                  rows={7}
                  className="w-full resize-none rounded-[var(--radius-md)] border border-border-default bg-bg-input px-4 py-4 text-sm leading-relaxed text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-accent"
                />
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-[11px] text-text-secondary">
                  <label className="cursor-pointer hover:text-text-primary transition-colors">
                    Reference image
                    <input type="file" accept="image/*" onChange={handleImageAttach} className="hidden" />
                  </label>
                  <span className={prompt.length > 500 ? "text-status-warning" : "text-text-tertiary"}>
                    {prompt.length > 0 ? `${prompt.length} chars` : "Start typing"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGenerateImage}
                    disabled={isGenerating || isGeneratingImage || !prompt.trim()}
                    className="flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-border-default bg-bg-surface px-3 py-2 text-xs font-medium text-text-primary transition-colors hover:bg-bg-surface-hover disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                    title="Generate as image using AI"
                  >
                    <ImageIcon size={12} />
                    {isGeneratingImage ? "Generating..." : "Image"}
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || isGeneratingImage || !prompt.trim()}
                    className="rounded-[var(--radius-sm)] bg-accent px-4 py-2 text-xs font-medium text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                  >
                    {isGenerating ? "Generating..." : "Generate"}
                  </button>
                </div>
              </div>

              {referenceImage && (
                <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-text-secondary">
                  <span>Reference attached</span>
                  <button onClick={() => setReferenceImage(null)} className="text-text-tertiary hover:text-text-primary transition-colors">
                    Remove
                  </button>
                </div>
              )}

              <div className="mt-4 border-t border-border-default pt-4">
                <button
                  onClick={() => setSkillsOpen(!skillsOpen)}
                  className="flex w-full items-center justify-between text-xs text-text-secondary transition-colors hover:text-text-primary cursor-pointer"
                >
                  <span>Design rules</span>
                  <span className="flex items-center gap-2">
                    <span className="text-[10px] text-text-tertiary">{activeRules.length}/{DESIGN_SKILLS.length}</span>
                    {skillsOpen ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                  </span>
                </button>
                <div className="mt-2 text-[11px] text-text-tertiary">
                  {activeRules.map((rule) => rule.name).join(", ")}
                </div>
                {skillsOpen && (
                  <div className="mt-3 flex max-h-40 flex-col gap-1.5 overflow-y-auto pr-1">
                    {DESIGN_SKILLS.map((skill) => {
                      const isActive = activeSkills.includes(skill.id);
                      return (
                        <button
                          key={skill.id}
                          onClick={() => toggleSkill(skill.id)}
                          className={`flex items-center justify-between rounded-[var(--radius-sm)] px-2 py-2 text-left text-[11px] transition-colors cursor-pointer ${
                            isActive
                              ? "bg-bg-surface text-text-primary"
                              : "text-text-secondary hover:bg-bg-input hover:text-text-primary"
                          }`}
                        >
                          <span className="truncate">{skill.name}</span>
                          <span className="ml-3 shrink-0 text-[10px] text-text-tertiary">
                            {isActive ? "On" : "Off"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-14 border-b border-border-default flex items-center px-6 gap-3 shrink-0">
          {activeTab === "reference" ? (
            <>
              <h1 className="text-sm font-semibold">Visual Component Reference</h1>
              <div className="flex-1" />
              <Link href="/" className="text-xs text-text-tertiary hover:text-text-secondary transition-colors">← Back to app</Link>
            </>
          ) : (
            <>
              <div className="flex items-center gap-0.5 bg-bg-input rounded-[var(--radius-sm)] p-0.5">
                <button onClick={() => setShowCode(false)} className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${!showCode ? "bg-bg-surface text-text-primary" : "text-text-tertiary hover:text-text-secondary"}`}><Eye size={11} /> Preview</button>
                <button onClick={() => setShowCode(true)} className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${showCode ? "bg-bg-surface text-text-primary" : "text-text-tertiary hover:text-text-secondary"}`}><Code2 size={11} /> Code</button>
              </div>
              {!showCode && (
                <div className="flex items-center gap-0.5 bg-bg-input rounded-[var(--radius-sm)] p-0.5">
                  <button
                    onClick={() => setPreviewViewport("desktop")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${previewViewport === "desktop" ? "bg-bg-surface text-text-primary" : "text-text-tertiary hover:text-text-secondary"}`}
                  >
                    <Monitor size={11} />
                    Desktop
                  </button>
                  <button
                    onClick={() => setPreviewViewport("mobile")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${previewViewport === "mobile" ? "bg-bg-surface text-text-primary" : "text-text-tertiary hover:text-text-secondary"}`}
                  >
                    <Smartphone size={11} />
                    Mobile
                  </button>
                </div>
              )}
              <div className="flex-1" />
              {!showCode && (
                <button
                  onClick={togglePreviewExpanded}
                  className="text-xs px-2 py-1 rounded transition-colors cursor-pointer text-text-tertiary hover:text-text-secondary"
                  title={isPreviewExpanded ? "Collapse preview" : "Expand preview"}
                >
                  {isPreviewExpanded ? <Minimize2 size={11} /> : <Maximize2 size={11} />}
                </button>
              )}
              {code && <button onClick={async () => { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer">{copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}</button>}
              {code && <button onClick={async () => { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer"><Download size={11} /></button>}
            </>
          )}
        </div>

        {activeTab === "reference" ? (
          <main className="flex-1 overflow-y-auto px-8 py-8">
            <div className="max-w-5xl mx-auto flex flex-col gap-16">
              {sections[activeCategory]}
            </div>
          </main>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {generatedImage || isGeneratingImage ? (
              <div className="flex-1 flex flex-col items-center justify-center overflow-auto bg-[#060909] p-6">
                {isGeneratingImage ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 size={32} className="animate-spin text-accent" />
                    <p className="text-sm text-text-secondary">Generating image...</p>
                    <p className="text-xs text-text-tertiary">This may take 10-30 seconds</p>
                  </div>
                ) : imageError ? (
                  <div className="flex flex-col items-center gap-3">
                    <XCircle size={32} className="text-status-error" />
                    <p className="text-sm text-status-error">{imageError}</p>
                  </div>
                ) : generatedImage ? (
                  <div className="flex flex-col items-center gap-4 w-full max-w-4xl">
                    <div className="relative w-full rounded-[var(--radius-lg)] overflow-hidden border border-border-default">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={generatedImage}
                        alt="Generated UI design"
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleDownloadImage}
                        className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-border-default bg-bg-surface px-4 py-2 text-xs font-medium text-text-primary transition-colors hover:bg-bg-surface-hover cursor-pointer"
                      >
                        <DownloadCloud size={14} />
                        Download Image
                      </button>
                      <button
                        onClick={handleConvertToCode}
                        disabled={isGenerating}
                        className="flex items-center gap-2 rounded-[var(--radius-sm)] bg-accent px-4 py-2 text-xs font-medium text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowRightLeft size={14} />
                        {isGenerating ? "Converting..." : "Convert to Code"}
                      </button>
                      <button
                        onClick={() => setGeneratedImage(null)}
                        className="flex items-center gap-1 rounded-[var(--radius-sm)] px-3 py-2 text-xs text-text-tertiary transition-colors hover:text-text-secondary cursor-pointer"
                      >
                        <X size={12} />
                        Dismiss
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : showCode ? (
              <div className="flex-1 overflow-auto">
                <pre className="p-4 text-xs text-text-secondary font-mono leading-relaxed whitespace-pre-wrap">{isGenerating ? streamingCode : code || "// No code generated yet"}</pre>
              </div>
            ) : (
              <LiveProvider key={liveProviderKey} code={liveCode} scope={previewScope} noInline>
                <div className="flex-1 overflow-hidden bg-[#060909]">
                  <PreviewStage viewport={previewViewport} expanded={isPreviewExpanded}>
                    <LivePreview />
                  </PreviewStage>
                </div>
                {process.env.NODE_ENV === "development" && (
                  <LiveError className="border-t border-border-default bg-bg-surface p-4 font-mono text-xs whitespace-pre-wrap text-red-400" />
                )}
              </LiveProvider>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
