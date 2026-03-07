"use client";

import { Sidebar } from "@/components/navigation/Sidebar";
import { TopBar } from "@/components/navigation/TopBar";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { HeroBanner } from "@/components/layout/HeroBanner";
import { StatCard } from "@/components/cards/StatCard";
import { Gamepad2, Users, MoreVertical, ChevronRight, Clock, Shield, MessageSquare, Crown } from "lucide-react";

const ACTIVE_GROUPS = [
  {
    id: "1",
    name: "raed night",
    owner: "lord007tn",
    game: "Apex Legends",
    gameImage: "https://static-cdn.jtvnw.net/ttv-boxart/Apex%20Legends-285x380.jpg",
    slotsUsed: 4,
    slotsTotal: 3,
    slotText: "-1 Slot available",
    timeAgo: "20 days ago",
    skillRequirement: "Silver I",
    note: undefined,
    requiresRequest: false,
    members: [
      { username: "lord007tn", avatar: "https://lh3.googleusercontent.com/a/ACg8ocK5EX5irZBct3OpQQO_5wNfH8z79S46f8zzKIBsQhf0arnloNc8=s96-c", isOwner: true },
      { username: "azizbecha", avatar: "https://lh3.googleusercontent.com/a/ACg8ocL_GUJfwCYMwPgywoGxf8FnGR1oq_IoJk_IVn-L7dPaWiR-Gzsx=s96-c", isOwner: false },
      { username: "hglyblzs", avatar: null, isOwner: false },
      { username: "choxel", avatar: "https://lh3.googleusercontent.com/a/ACg8ocKCrsXsBt0lHA6pIedv1Mjp_4vxAEGs_bGqXmE0nVjhxZDB1Z8=s96-c", isOwner: false },
    ],
  },
  {
    id: "2",
    name: "Late night valo",
    owner: "sirius",
    game: "Valorant",
    gameImage: "https://static-cdn.jtvnw.net/ttv-boxart/VALORANT-285x380.jpg",
    slotsUsed: 2,
    slotsTotal: 5,
    slotText: "3 Slots available",
    timeAgo: "22 days ago",
    skillRequirement: "Radiant",
    note: "Long note is being tested. Long note is bein...",
    requiresRequest: false,
    members: [
      { username: "sirius", avatar: "https://lh3.googleusercontent.com/a/ACg8ocIDHpN23i-I4B7mHMoS0wj_PJ2Eg4Gk-6GS9HsK=s96-c", isOwner: true },
      { username: "murexhyena", avatar: "https://lh3.googleusercontent.com/a/ACg8ocKY14j2kNBcnQ4cFTIrNUl_v-8B2rbxjr8dOGziUMwwxa_CLD8=s96-c", isOwner: false },
    ],
  },
  {
    id: "3",
    name: "profitable tooth Squad",
    owner: "paul_silva",
    game: "Honor of Kings",
    gameImage: "https://static-cdn.jtvnw.net/ttv-boxart/Honor%20of%20Kings-285x380.jpg",
    slotsUsed: 1,
    slotsTotal: 5,
    slotText: "4 Slots available",
    timeAgo: "23 days ago",
    skillRequirement: "Bronze III",
    note: undefined,
    requiresRequest: true,
    members: [
      { username: "paul_silva", avatar: null, isOwner: true },
    ],
  },
];

type Group = typeof ACTIVE_GROUPS[0];

function MemberAvatar({ member }: { member: Group["members"][0] }) {
  return (
    <div className="relative shrink-0">
      <div className="size-12 rounded-full overflow-hidden border-2 border-bg-primary">
        {member.avatar ? (
          <img src={member.avatar} alt={member.username} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-bg-surface flex items-center justify-center">
            <span className="text-sm font-bold text-text-accent uppercase">{member.username[0]}</span>
          </div>
        )}
      </div>
      {member.isOwner && (
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2">
          <Crown size={12} className="text-yellow-400 fill-yellow-400" />
        </div>
      )}
    </div>
  );
}

function GroupCard({ group }: { group: Group }) {
  const openSlots = Math.max(0, group.slotsTotal - group.slotsUsed);

  return (
    <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] p-4 flex flex-col gap-3 hover:border-border-accent/30 transition-colors cursor-pointer h-full">
      {/* Header: game icon + name + menu */}
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-full overflow-hidden shrink-0 border border-border-default">
          <img src={group.gameImage} alt={group.game} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-text-primary leading-tight">{group.name}</h3>
          <div className="flex items-center gap-1 text-xs text-text-secondary mt-0.5 flex-wrap">
            <span>By</span>
            <span className="text-text-accent font-medium">{group.owner}</span>
            <span className="text-border-default mx-0.5">|</span>
            <Gamepad2 size={11} className="text-text-tertiary" />
            <span className="truncate">{group.game}</span>
          </div>
        </div>
        <button className="text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer shrink-0 mt-0.5">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-2 text-xs text-text-secondary">
        <Users size={12} className="shrink-0" />
        <span className="font-medium text-text-primary">{group.slotsUsed}/{group.slotsTotal}</span>
        <span className="text-border-default">|</span>
        <span>{group.slotText}</span>
        <span className="text-border-default">|</span>
        <Clock size={12} className="shrink-0" />
        <span>{group.timeAgo}</span>
      </div>

      {/* Member avatars row */}
      <div className="flex items-center gap-1.5">
        {group.members.map((m, i) => (
          <MemberAvatar key={i} member={m} />
        ))}
        {openSlots > 0 && (
          <div className="size-12 rounded-full border-2 border-dashed border-border-default flex items-center justify-center shrink-0">
            <span className="text-xs text-text-tertiary font-medium">+{openSlots}</span>
          </div>
        )}
      </div>

      {/* Optional note */}
      {group.note && (
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <MessageSquare size={12} className="shrink-0 text-text-tertiary" />
          <span className="truncate">{group.note}</span>
        </div>
      )}

      {/* Bottom pinned section */}
      <div className="flex flex-col gap-3 mt-auto">
        <div className="border-t border-border-default" />
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <Shield size={12} className="shrink-0 text-text-tertiary" />
          <span>Skill requirement: <span className="text-text-primary">{group.skillRequirement}</span></span>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 py-2 rounded-[var(--radius-md)] border border-border-default text-text-primary text-xs font-medium hover:bg-bg-surface-hover transition-colors cursor-pointer">
            Group details
          </button>
          <button className="flex-1 py-2 rounded-[var(--radius-md)] border border-border-accent text-text-accent text-xs font-medium hover:bg-accent-subtle transition-colors cursor-pointer">
            {group.requiresRequest ? "Request to join →" : "Join →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar activeItem="Home" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumb={<Breadcrumbs items={[{ label: "Dashboard" }]} />} />
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-6">

            {/* Row 1: Hero Banner + Stat Cards */}
            <div className="flex gap-5 items-stretch">
              <div className="flex-1">
                <HeroBanner
                  userName="demo"
                  tagline="Lock in, aim true... Dominate the round."
                  taglineIcon={<Gamepad2 size={16} className="text-text-accent" />}
                  characterImage="https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/fullportrait.png"
                  ctaLabel="Find your team"
                  activeDot={1}
                  totalDots={3}
                  className="h-full"
                />
              </div>
              <div className="flex flex-col gap-3 w-[280px] shrink-0">
                <StatCard
                  title="Total sessions"
                  icon={<Gamepad2 size={20} />}
                  value="0"
                  subtitle="Hours"
                  className="flex-1"
                />
                <StatCard
                  title="Login Streak"
                  icon={<Users size={20} />}
                  value="1"
                  subtitle="Day"
                  color="purple"
                  className="flex-1"
                />
                <StatCard
                  title="Available friends"
                  icon={<Users size={20} />}
                  value="0"
                  subtitle="Online"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Active Groups */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-text-primary">Active groups</h2>
                <button className="flex items-center gap-1 text-sm text-text-accent hover:underline cursor-pointer">
                  Browse All <ChevronRight size={14} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 items-stretch">
                {ACTIVE_GROUPS.map((group) => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
