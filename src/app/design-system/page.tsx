"use client";

import { useState } from "react";
import {
  Button,
  SocialAuthButton,
  FilterChip,
  Breadcrumbs,
  TopBar,
  LandingNav,
  SessionCard,
  TournamentCard,
  ClubCard,
  MissionCard,
  FederationCard,
  PlayerCard,
  StatCard,
  ArticleCard,
  GameTabCard,
  TextInput,
  SearchInput,
  Select,
  Toggle,
  PasswordInput,
  ChatInput,
  StatusPill,
  Badge,
  ProgressBar,
  CountdownTimer,
  LeaderboardRow,
  ChatMessage,
  ChatListItem,
  PageHeader,
  SectionHeader,
  HeroBanner,
  SettingsSidebar,
  Modal,
  FilterDrawer,
  Avatar,
  AvatarGroup,
  Divider,
} from "@/components";
import { Gamepad2, Trophy, Users, Star } from "lucide-react";

export default function ShowcasePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toggleOn, setToggleOn] = useState(true);
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-bg-primary">
      <LandingNav />

      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-16">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-accent">Rize.gg Design System</h1>
          <p className="text-text-secondary">
            30+ components · 8 categories · Dark gaming aesthetic
          </p>
        </div>

        {/* BUTTONS */}
        <section className="flex flex-col gap-6">
          <SectionHeader title="Buttons" />
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="discord">Discord</Button>
            <Button size="icon"><Star size={16} /></Button>
            <Button loading>Loading</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large CTA</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg">
            <SocialAuthButton icon={<span>G</span>} provider="Google" />
            <SocialAuthButton icon={<span>T</span>} provider="Twitch" />
            <SocialAuthButton icon={<span>S</span>} provider="Steam" />
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterChip active icon={<Gamepad2 size={14} />}>Valorant</FilterChip>
            <FilterChip icon={<Gamepad2 size={14} />}>CS2</FilterChip>
            <FilterChip>League of Legends</FilterChip>
          </div>
        </section>

        <Divider />

        {/* NAVIGATION */}
        <section className="flex flex-col gap-6">
          <SectionHeader title="Navigation" />
          <TopBar
            breadcrumb={
              <Breadcrumbs
                items={[
                  { label: "Rize.gg", href: "#" },
                  { label: "Tournaments", href: "#" },
                  { label: "Valorant Champions Tour" },
                ]}
              />
            }
          />
        </section>

        <Divider />

        {/* FORMS */}
        <section className="flex flex-col gap-6">
          <SectionHeader title="Forms" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <TextInput label="Username" placeholder="Enter username" />
            <TextInput label="Email" placeholder="you@example.com" error="Invalid email" />
            <SearchInput
              placeholder="Search players..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
            />
            <Select
              label="Region"
              placeholder="Select region"
              options={[
                { value: "eu", label: "Europe" },
                { value: "na", label: "North America" },
                { value: "asia", label: "Asia" },
              ]}
            />
            <PasswordInput label="Password" placeholder="Enter password" />
            <div className="flex flex-col gap-3">
              <Toggle checked={toggleOn} onChange={setToggleOn} label="Notifications" />
              <Toggle label="Dark Mode (off)" />
            </div>
          </div>
          <ChatInput onAttach={() => {}} onEmoji={() => {}} onSticker={() => {}} className="max-w-2xl" />
        </section>

        <Divider />

        {/* CARDS */}
        <section className="flex flex-col gap-6">
          <SectionHeader title="Cards" onAction={() => {}} />
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
            <ClubCard name="Shadow Core" status="Recruiting" owner="MohTarek" timezone="UTC/GMT +2" memberCount={2} memberMax={10} />
            <MissionCard
              icon={<Trophy size={24} className="text-rank-gold" />}
              title="Win 10 Matches"
              description="Win matches in any competitive mode"
              rank="Gold"
              progress={7}
              maxProgress={10}
              badgeRanks={[
                { label: "Bronze", active: true },
                { label: "Gold", active: true },
                { label: "Diamond", active: false },
              ]}
            />
          </div>
          <TournamentCard
            heroImage="/placeholders/hero-valorant.svg"
            prize="$30,000"
            status="Registration open"
            location="Saudi Arabia"
            capacity="08/10"
            rankRequirement="Gold +"
            title="Valorant Champions TOUR"
            description="Get ready for the ultimate showdown in the Valorant Arena!"
            countdown={{ days: "01", hours: "18", minutes: "03" }}
            organizerAvatar="/placeholders/avatar-1.svg"
            organizerName="Fatima Saeed"
            className="max-w-sm"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <FederationCard flagEmoji="🇸🇦" country="Saudi Arabia" memberCount={1250} />
            <FederationCard flagEmoji="🇦🇪" country="UAE" memberCount={890} />
            <FederationCard flagEmoji="🇪🇬" country="Egypt" memberCount={2100} />
            <FederationCard flagEmoji="🇯🇴" country="Jordan" memberCount={450} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <PlayerCard name="TenZ" country="Canada" rating={5.6} totalRatings={82} />
            <StatCard title="Active Players" value="12,450" subtitle="Online" icon={<Users size={16} />} />
            <StatCard title="Tournaments" value="89" subtitle="live" icon={<Trophy size={16} />} />
            <ArticleCard image="/placeholders/game-valorant.svg" badge="Fresh Article" title="VCT 2025 Preview" description="Everything you need to know about the upcoming VCT season." date="Mar 4, 2025" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <GameTabCard gameName="Valorant" currentRank="Gold 3" active />
            <GameTabCard gameName="CS2" currentRank="Faceit 8" />
            <GameTabCard gameName="League of Legends" currentRank="Platinum 2" />
          </div>
        </section>

        <Divider />

        {/* DATA DISPLAY */}
        <section className="flex flex-col gap-6">
          <SectionHeader title="Data Display" />
          <div className="flex flex-wrap gap-2">
            <StatusPill variant="registration_open" />
            <StatusPill variant="live" />
            <StatusPill variant="finished" />
            <StatusPill variant="playing" />
            <StatusPill variant="idle" />
            <StatusPill variant="recruiting" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="accent" label="Gold" />
            <Badge variant="gold" label="1st Place" />
            <Badge variant="silver" label="2nd Place" />
            <Badge variant="bronze" label="3rd Place" />
            <Badge variant="diamond" label="Diamond" />
          </div>
          <ProgressBar value={65} max={100} label="Gold" showCount className="max-w-sm" />
          <CountdownTimer days="01" hours="18" minutes="03" className="max-w-sm" />
          <div className="flex flex-col gap-1 max-w-2xl">
            <LeaderboardRow rank={1} name="FlashBang" country="Saudi Arabia" rankTier="Diamond" score={212} maxScore={250} />
            <LeaderboardRow rank={2} name="Aspas" country="Brazil" rankTier="Platinum" score={198} maxScore={250} />
            <LeaderboardRow rank={3} name="Demon1" country="Sweden" rankTier="Diamond" score={185} maxScore={250} />
            <LeaderboardRow rank={4} name="yay" country="USA" rankTier="Gold" score={170} maxScore={250} />
          </div>
        </section>

        <Divider />

        {/* CHAT */}
        <section className="flex flex-col gap-6">
          <SectionHeader title="Chat" />
          <div className="max-w-2xl border border-border-default rounded-[var(--radius-md)] overflow-hidden">
            <ChatMessage username="TenZ" roleBadge="Leader" timestamp="2:30 PM" message="Hey team, let's run some scrims tonight. Who's in?" />
            <ChatMessage username="Aspas" timestamp="2:32 PM" message="I'm down! What time?" replyTo={{ username: "TenZ", text: "Hey team, let's run some scrims tonight" }} />
          </div>
          <div className="flex flex-col gap-1 max-w-xs">
            <ChatListItem name="Shadow Core" status="5 online" unreadCount={3} active />
            <ChatListItem name="Valorant Squad" status="In Game" />
            <ChatListItem name="TenZ" status="Online" />
          </div>
        </section>

        <Divider />

        {/* LAYOUT */}
        <section className="flex flex-col gap-6">
          <SectionHeader title="Layout" />
          <PageHeader title="Tournaments" subtitle="Find and join competitive tournaments" actions={<Button>Create Tournament</Button>} />
          <HeroBanner
            userName="Mehdyy98"
            tagline="Rift's calling.. Claim your victory."
            ctaLabel="Find your team"
          />
        </section>

        <Divider />

        {/* MICRO */}
        <section className="flex flex-col gap-6">
          <SectionHeader title="Micro Components" />
          <div className="flex items-center gap-4">
            <Avatar size="xs" />
            <Avatar size="sm" />
            <Avatar size="md" online />
            <Avatar size="lg" online={false} />
            <Avatar size="xl" />
          </div>
          <AvatarGroup avatars={[{}, {}, {}, {}, {}, {}]} max={4} />
        </section>

        <Divider />

        {/* OVERLAYS */}
        <section className="flex flex-col gap-6">
          <SectionHeader title="Overlays" />
          <div className="flex gap-3">
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
            <Button variant="outline" onClick={() => setDrawerOpen(true)}>Open Filter Drawer</Button>
          </div>
        </section>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Tournament" footer={<><Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button><Button>Create</Button></>}>
          <div className="flex flex-col gap-4">
            <TextInput label="Tournament Name" placeholder="Enter name" />
            <Select label="Game" options={[{ value: "val", label: "Valorant" }, { value: "cs2", label: "CS2" }]} />
          </div>
        </Modal>

        <FilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onApply={() => setDrawerOpen(false)} onReset={() => {}}>
          <div className="flex flex-col gap-4">
            <Select label="Game" options={[{ value: "all", label: "All Games" }, { value: "val", label: "Valorant" }]} />
            <Toggle checked={toggleOn} onChange={setToggleOn} label="Show full only" />
          </div>
        </FilterDrawer>

        {/* SETTINGS SIDEBAR */}
        <section className="flex flex-col gap-6">
          <SectionHeader title="Settings Sidebar" />
          <SettingsSidebar sections={[
            { title: "User Settings", items: [{ label: "My Account", active: true }, { label: "Profile" }, { label: "Privacy & Safety" }] },
            { title: "Platform Settings", items: [{ label: "Notifications" }, { label: "Appearance" }, { label: "Language" }] },
          ]} />
        </section>

        <div className="py-12 text-center text-text-tertiary text-sm">
          Rize.gg Design System · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
