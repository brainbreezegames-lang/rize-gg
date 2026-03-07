"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { TopBar } from "@/components/navigation/TopBar";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { SearchInput } from "@/components/forms/SearchInput";
import { X, RefreshCw, History, Plus, SlidersHorizontal, Shield, MoreHorizontal, ChevronRight, Users, Clock, Check, Filter } from "lucide-react";

const GROUPS = [
  {
    id: "1",
    name: "raed night",
    owner: "lord007tn",
    ownerAvatar: "https://lh3.googleusercontent.com/a/ACg8ocK5EX5irZBct3OpQQO_5wNfH8z79S46f8zzKIBsQhf0arnloNc8=s96-c",
    game: "Apex Legends",
    gameImage: "https://static-cdn.jtvnw.net/ttv-boxart/Apex%20Legends-285x380.jpg",
    slotsUsed: 4,
    slotsTotal: 3,
    slotText: "-1 Slot available",
    timeAgo: "20 days ago",
    skillRequirement: "Silver I",
    description: "Looking for chill Apex players to squad up with. No toxicity, just good vibes and clean gameplay.",
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
    ownerAvatar: "https://lh3.googleusercontent.com/a/ACg8ocIDHpN23i-I4B7mHMoS0wj_PJ2Eg4Gk-6GS9HsK=s96-c",
    game: "Valorant",
    gameImage: "https://static-cdn.jtvnw.net/ttv-boxart/VALORANT-285x380.jpg",
    slotsUsed: 2,
    slotsTotal: 5,
    slotText: "3 Slots available",
    timeAgo: "22 days ago",
    skillRequirement: "Radiant",
    description: "High-rank Valorant sessions late night EU. Must be Radiant+ and have a working mic.",
    members: [
      { username: "sirius", avatar: "https://lh3.googleusercontent.com/a/ACg8ocIDHpN23i-I4B7mHMoS0wj_PJ2Eg4Gk-6GS9HsK=s96-c", isOwner: true },
      { username: "murexhyena", avatar: "https://lh3.googleusercontent.com/a/ACg8ocKY14j2kNBcnQ4cFTIrNUl_v-8B2rbxjr8dOGziUMwwxa_CLD8=s96-c", isOwner: false },
    ],
  },
  {
    id: "3",
    name: "profitable tooth Squad",
    owner: "paul_silva",
    ownerAvatar: null,
    game: "Honor of Kings",
    gameImage: "https://static-cdn.jtvnw.net/ttv-boxart/Honor%20of%20Kings-285x380.jpg",
    slotsUsed: 1,
    slotsTotal: 5,
    slotText: "4 Slots available",
    timeAgo: "23 days ago",
    skillRequirement: "Bronze III",
    description: "Casual Honor of Kings group. All skill levels welcome — we just love the game.",
    members: [
      { username: "paul_silva", avatar: null, isOwner: true },
    ],
  },
  {
    id: "4",
    name: "upright pasta Squad",
    owner: "omarkhalil",
    ownerAvatar: null,
    game: "Fortnite",
    gameImage: "https://static-cdn.jtvnw.net/ttv-boxart/Fortnite-285x380.jpg",
    slotsUsed: 1,
    slotsTotal: 4,
    slotText: "3 Slots available",
    timeAgo: "1 month ago",
    skillRequirement: "Any",
    description: "Fortnite squad looking for active players. Any skill level, just be active and communicative.",
    members: [
      { username: "omarkhalil", avatar: null, isOwner: true },
    ],
  },
  {
    id: "5",
    name: "Roob Inc Gaming",
    owner: "amjad_khalil",
    ownerAvatar: null,
    game: "Lost Ark",
    gameImage: "https://static-cdn.jtvnw.net/ttv-boxart/Lost%20Ark-285x380.jpg",
    slotsUsed: 2,
    slotsTotal: 5,
    slotText: "3 Slots available",
    timeAgo: "1 month ago",
    skillRequirement: "Any",
    description: "Lost Ark end-game content group. We run raids and dungeons daily.",
    members: [
      { username: "amjad_khalil", avatar: null, isOwner: true },
    ],
  },
  {
    id: "6",
    name: "protocol copy",
    owner: "paul_silva",
    ownerAvatar: null,
    game: "Fortnite",
    gameImage: "https://static-cdn.jtvnw.net/ttv-boxart/Fortnite-285x380.jpg",
    slotsUsed: 1,
    slotsTotal: 3,
    slotText: "2 Slots available",
    timeAgo: "1 month ago",
    skillRequirement: "Any",
    description: "Chill Fortnite duo/trio. No pressure, just having fun.",
    members: [
      { username: "paul_silva", avatar: null, isOwner: true },
    ],
  },
];

type Group = typeof GROUPS[0];

const SKILL_LEVELS = ["Any", "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Radiant"];
const GAMES = ["All Games", "Apex Legends", "Valorant", "Honor of Kings", "Fortnite", "Lost Ark"];
const SLOT_OPTIONS = ["Any", "1 slot", "2 slots", "3+ slots"];

function MemberAvatar({ member }: { member: Group["members"][0] }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative">
        <div className="size-10 rounded-full bg-bg-surface border border-border-default overflow-hidden">
          {member.avatar ? (
            <img src={member.avatar} alt={member.username} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-accent/20 flex items-center justify-center">
              <span className="text-sm font-bold text-text-accent uppercase">{member.username[0]}</span>
            </div>
          )}
        </div>
        {member.isOwner && (
          <div className="absolute -top-1 -right-1 size-4 rounded-full bg-status-warning border border-bg-card flex items-center justify-center">
            <svg width="7" height="7" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
        )}
      </div>
      <span className="text-[10px] text-text-secondary truncate max-w-[56px] text-center">{member.username}</span>
    </div>
  );
}

function GroupDetailModal({ group, onClose, onJoin }: { group: Group; onClose: () => void; onJoin: () => void }) {
  const slotsLeft = group.slotsTotal - group.slotsUsed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-[520px] bg-bg-elevated border border-border-default rounded-[var(--radius-xl)] overflow-hidden shadow-2xl mx-4">
        {/* Game banner */}
        <div className="relative h-[140px]">
          <img src={group.gameImage} alt={group.game} className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-elevated to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 size-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors cursor-pointer">
            <X size={16} />
          </button>
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <img src={group.gameImage} alt="" className="size-8 rounded-[var(--radius-sm)] object-cover" />
            <span className="text-xs text-text-secondary">{group.game}</span>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* Name + owner */}
          <div>
            <h2 className="text-lg font-bold text-text-primary mb-1">{group.name}</h2>
            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
              <span>By</span>
              <span className="text-text-accent font-medium">{group.owner}</span>
              <span className="text-border-default mx-1">|</span>
              <Clock size={11} />
              <span>{group.timeAgo}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-text-secondary leading-relaxed">{group.description}</p>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-bg-card border border-border-default rounded-[var(--radius-md)] p-3 flex flex-col gap-1">
              <span className="text-xs text-text-tertiary">Members</span>
              <span className="text-base font-bold text-text-primary">{group.slotsUsed}/{group.slotsTotal}</span>
            </div>
            <div className="bg-bg-card border border-border-default rounded-[var(--radius-md)] p-3 flex flex-col gap-1">
              <span className="text-xs text-text-tertiary">Open Slots</span>
              <span className={`text-base font-bold ${slotsLeft > 0 ? "text-status-success" : "text-status-error"}`}>
                {slotsLeft > 0 ? slotsLeft : "Full"}
              </span>
            </div>
            <div className="bg-bg-card border border-border-default rounded-[var(--radius-md)] p-3 flex flex-col gap-1">
              <span className="text-xs text-text-tertiary">Skill Req.</span>
              <span className="text-base font-bold text-text-primary">{group.skillRequirement}</span>
            </div>
          </div>

          {/* Members */}
          <div>
            <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">Members</h3>
            <div className="flex flex-wrap gap-4">
              {group.members.map((m, i) => (
                <MemberAvatar key={i} member={m} />
              ))}
              {/* Empty slots */}
              {Array.from({ length: Math.max(0, slotsLeft) }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className="size-10 rounded-full border-2 border-dashed border-border-default flex items-center justify-center">
                    <Plus size={14} className="text-text-tertiary" />
                  </div>
                  <span className="text-[10px] text-text-tertiary">Empty</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-[var(--radius-md)] border border-border-default text-sm text-text-secondary hover:bg-bg-surface transition-colors cursor-pointer">
              Close
            </button>
            <button
              onClick={onJoin}
              disabled={slotsLeft <= 0}
              className="flex-1 py-2.5 rounded-[var(--radius-md)] bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent-hover transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {slotsLeft <= 0 ? "Group Full" : "Join Group"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function JoinModal({ group, onClose }: { group: Group; onClose: () => void }) {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-[420px] bg-bg-elevated border border-border-default rounded-[var(--radius-xl)] overflow-hidden shadow-2xl mx-4">
        <button onClick={onClose} className="absolute top-3 right-3 size-8 rounded-full bg-bg-surface flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
          <X size={16} />
        </button>

        {!submitted ? (
          <div className="p-6 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <img src={group.gameImage} alt="" className="size-12 rounded-[var(--radius-md)] object-cover" />
              <div>
                <h2 className="text-base font-bold text-text-primary">Join {group.name}</h2>
                <p className="text-xs text-text-secondary">{group.game} · By {group.owner}</p>
              </div>
            </div>

            <div className="bg-bg-card border border-border-default rounded-[var(--radius-md)] p-3 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-text-secondary">
                <Shield size={14} />
                <span>Skill requirement</span>
              </div>
              <span className="font-medium text-text-primary">{group.skillRequirement}</span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-primary">Message to owner <span className="text-text-tertiary font-normal">(optional)</span></label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Introduce yourself or explain why you want to join..."
                rows={3}
                className="bg-bg-input border border-border-default rounded-[var(--radius-md)] px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-border-accent resize-none transition-colors"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-[var(--radius-md)] border border-border-default text-sm text-text-secondary hover:bg-bg-surface transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-[var(--radius-md)] bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent-hover transition-colors cursor-pointer">
                Send Request
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center gap-4 text-center">
            <div className="size-16 rounded-full bg-status-success/20 border border-status-success/30 flex items-center justify-center">
              <Check size={28} className="text-status-success" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary mb-1">Request Sent!</h2>
              <p className="text-sm text-text-secondary">Your join request has been sent to <span className="text-text-accent">{group.owner}</span>. You'll be notified once they respond.</p>
            </div>
            <button onClick={onClose} className="px-6 py-2.5 rounded-[var(--radius-md)] bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent-hover transition-colors cursor-pointer">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FiltersPanel({ onClose, onApply }: { onClose: () => void; onApply: (filters: { game: string; skill: string; slots: string }) => void }) {
  const [game, setGame] = useState("All Games");
  const [skill, setSkill] = useState("Any");
  const [slots, setSlots] = useState("Any");

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-[320px] h-full bg-bg-elevated border-l border-border-default flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-default">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-text-accent" />
            <h2 className="text-base font-semibold text-text-primary">Filters</h2>
          </div>
          <button onClick={onClose} className="size-8 flex items-center justify-center rounded-[var(--radius-sm)] text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {/* Filter options */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-6">
          {/* Game */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Game</label>
            <div className="flex flex-col gap-1.5">
              {GAMES.map((g) => (
                <button
                  key={g}
                  onClick={() => setGame(g)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-md)] text-sm transition-colors cursor-pointer border ${
                    game === g
                      ? "border-border-accent bg-accent-subtle text-text-accent"
                      : "border-border-default text-text-secondary hover:bg-bg-surface"
                  }`}
                >
                  {g}
                  {game === g && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>

          {/* Skill level */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Skill Level</label>
            <div className="flex flex-wrap gap-2">
              {SKILL_LEVELS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSkill(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                    skill === s
                      ? "border-border-accent bg-accent-subtle text-text-accent"
                      : "border-border-default text-text-secondary hover:bg-bg-surface"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Slots */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Available Slots</label>
            <div className="flex flex-col gap-1.5">
              {SLOT_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSlots(s)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-md)] text-sm transition-colors cursor-pointer border ${
                    slots === s
                      ? "border-border-accent bg-accent-subtle text-text-accent"
                      : "border-border-default text-text-secondary hover:bg-bg-surface"
                  }`}
                >
                  {s}
                  {slots === s && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 border-t border-border-default flex gap-3">
          <button
            onClick={() => { setGame("All Games"); setSkill("Any"); setSlots("Any"); }}
            className="flex-1 py-2.5 rounded-[var(--radius-md)] border border-border-default text-sm text-text-secondary hover:bg-bg-surface transition-colors cursor-pointer"
          >
            Clear All
          </button>
          <button
            onClick={() => { onApply({ game, skill, slots }); onClose(); }}
            className="flex-1 py-2.5 rounded-[var(--radius-md)] bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent-hover transition-colors cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

function GroupCard({ group, onDetails, onJoin }: { group: Group; onDetails: () => void; onJoin: () => void }) {
  return (
    <div className="bg-bg-card border border-border-default rounded-[var(--radius-lg)] overflow-hidden hover:border-border-accent/30 transition-colors flex flex-col">
      {/* Game header row */}
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
        <button className="text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer shrink-0">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 px-4 pb-3 text-xs text-text-secondary">
        <div className="flex items-center gap-1">
          <Users size={12} />
          <span>{group.slotsUsed}/{group.slotsTotal}</span>
        </div>
        <span>|</span>
        <span className={group.slotText.startsWith("-") ? "text-status-error" : "text-text-secondary"}>
          {group.slotText}
        </span>
        <span>|</span>
        <div className="flex items-center gap-1">
          <Clock size={12} />
          <span>{group.timeAgo}</span>
        </div>
      </div>

      {/* Member avatars */}
      <div className="flex items-center gap-1.5 px-4 pb-3">
        {group.members.slice(0, 4).map((m, i) => (
          <div key={i} className="relative shrink-0">
            <div className="size-8 rounded-full bg-bg-surface border border-border-default overflow-hidden">
              {m.avatar ? (
                <img src={m.avatar} alt={m.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-accent/20 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-text-accent uppercase">{m.username[0]}</span>
                </div>
              )}
            </div>
            {m.isOwner && (
              <div className="absolute -top-1 -right-1 size-3.5 rounded-full bg-status-warning border border-bg-card flex items-center justify-center">
                <svg width="6" height="6" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>
            )}
          </div>
        ))}
        {group.members.length > 4 && (
          <div className="size-8 rounded-full bg-bg-surface border border-border-default flex items-center justify-center">
            <span className="text-[10px] text-text-secondary">+{group.members.length - 4}</span>
          </div>
        )}
      </div>

      {/* Skill requirement */}
      <div className="flex items-center gap-1.5 px-4 pb-3 text-xs text-text-secondary">
        <Shield size={12} className="shrink-0" />
        <span>Skill requirement: {group.skillRequirement}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 px-4 pb-4 mt-auto">
        <button
          onClick={onDetails}
          className="flex-1 py-2 rounded-[var(--radius-md)] border border-border-default bg-transparent text-sm text-text-primary hover:bg-bg-surface transition-colors cursor-pointer"
        >
          Group details
        </button>
        <button
          onClick={onJoin}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[var(--radius-md)] border border-border-accent bg-accent-subtle text-sm text-text-accent hover:bg-accent-muted transition-colors cursor-pointer"
        >
          Join <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default function RizeLFGPage() {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [detailGroup, setDetailGroup] = useState<Group | null>(null);
  const [joinGroup, setJoinGroup] = useState<Group | null>(null);
  const [activeFilters, setActiveFilters] = useState<{ game: string; skill: string; slots: string }>({ game: "All Games", skill: "Any", slots: "Any" });

  const hasActiveFilters = activeFilters.game !== "All Games" || activeFilters.skill !== "Any" || activeFilters.slots !== "Any";

  const filtered = GROUPS.filter((g) => {
    const matchesSearch = search.trim() === "" || g.name.toLowerCase().includes(search.toLowerCase()) || g.game.toLowerCase().includes(search.toLowerCase()) || g.owner.toLowerCase().includes(search.toLowerCase());
    const matchesGame = activeFilters.game === "All Games" || g.game === activeFilters.game;
    const matchesSkill = activeFilters.skill === "Any" || g.skillRequirement.toLowerCase().startsWith(activeFilters.skill.toLowerCase()) || g.skillRequirement === "Any";
    return matchesSearch && matchesGame && matchesSkill;
  });

  const openJoin = (group: Group) => {
    setDetailGroup(null);
    setJoinGroup(group);
  };

  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar activeItem="Rize LFG" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumb={<Breadcrumbs items={[{ label: "Groups" }]} />} />
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <h1 className="text-2xl font-bold text-text-primary mb-6">Group finder</h1>

          {/* Controls row */}
          <div className="flex items-center gap-3 mb-6">
            <button className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] border border-border-default bg-bg-card text-sm text-text-secondary hover:bg-bg-surface transition-colors cursor-pointer">
              <RefreshCw size={14} /> Refresh
            </button>
            <div className="flex-1 max-w-md">
              <SearchInput
                placeholder="Search for a game or group ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch("")}
                className="w-full"
              />
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] border text-sm transition-colors cursor-pointer ${
                hasActiveFilters
                  ? "border-border-accent bg-accent-subtle text-text-accent"
                  : "border-border-default bg-bg-card text-text-secondary hover:bg-bg-surface"
              }`}
            >
              <SlidersHorizontal size={14} /> Filters
              {hasActiveFilters && (
                <span className="size-4 rounded-full bg-accent text-accent-foreground text-[9px] font-bold flex items-center justify-center">
                  {[activeFilters.game !== "All Games", activeFilters.skill !== "Any", activeFilters.slots !== "Any"].filter(Boolean).length}
                </span>
              )}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] border border-border-default bg-bg-card text-sm text-text-secondary hover:bg-bg-surface transition-colors cursor-pointer">
              <History size={14} /> History
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent-hover transition-colors cursor-pointer">
              <Plus size={14} /> New group
            </button>
          </div>

          {/* Active filter badges */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-text-tertiary">Active filters:</span>
              {activeFilters.game !== "All Games" && (
                <button onClick={() => setActiveFilters(f => ({ ...f, game: "All Games" }))} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent-subtle border border-border-accent/30 text-xs text-text-accent cursor-pointer hover:bg-accent-muted transition-colors">
                  {activeFilters.game} <X size={10} />
                </button>
              )}
              {activeFilters.skill !== "Any" && (
                <button onClick={() => setActiveFilters(f => ({ ...f, skill: "Any" }))} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent-subtle border border-border-accent/30 text-xs text-text-accent cursor-pointer hover:bg-accent-muted transition-colors">
                  {activeFilters.skill} <X size={10} />
                </button>
              )}
              {activeFilters.slots !== "Any" && (
                <button onClick={() => setActiveFilters(f => ({ ...f, slots: "Any" }))} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent-subtle border border-border-accent/30 text-xs text-text-accent cursor-pointer hover:bg-accent-muted transition-colors">
                  {activeFilters.slots} <X size={10} />
                </button>
              )}
              <button onClick={() => setActiveFilters({ game: "All Games", skill: "Any", slots: "Any" })} className="text-xs text-text-tertiary hover:text-text-secondary cursor-pointer ml-1">
                Clear all
              </button>
            </div>
          )}

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {filtered.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onDetails={() => setDetailGroup(group)}
                  onJoin={() => setJoinGroup(group)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Users size={40} className="text-text-tertiary" />
              <p className="text-text-secondary">No groups found.</p>
              {hasActiveFilters && (
                <button onClick={() => setActiveFilters({ game: "All Games", skill: "Any", slots: "Any" })} className="text-sm text-text-accent hover:underline cursor-pointer">
                  Clear filters
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {detailGroup && (
        <GroupDetailModal group={detailGroup} onClose={() => setDetailGroup(null)} onJoin={() => openJoin(detailGroup)} />
      )}
      {joinGroup && (
        <JoinModal group={joinGroup} onClose={() => setJoinGroup(null)} />
      )}
      {showFilters && (
        <FiltersPanel onClose={() => setShowFilters(false)} onApply={setActiveFilters} />
      )}
    </div>
  );
}
