"use client";

import { Sidebar } from "@/components/navigation";
import { TopBar } from "@/components/navigation";
import { Breadcrumbs } from "@/components/navigation";
import { PageHeader, SectionHeader } from "@/components/layout";
import { Avatar, AvatarGroup } from "@/components/micro";
import { StatusPill, Badge, ProgressBar } from "@/components/data";
import { Button } from "@/components/buttons";
import { ChatMessage } from "@/components/chat";
import { ChatInput } from "@/components/forms";
import { SessionCard } from "@/components/cards";
import { Divider } from "@/components/micro";
import { Gamepad2, Users, Calendar, MessageSquare } from "lucide-react";

/**
 * @template ClubDetailPage
 * @description Full page layout for viewing a club's detail.
 * Compose: Sidebar + TopBar + Club header + members + chat + events
 */
export default function ClubDetailPage() {
  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          breadcrumb={
            <Breadcrumbs
              items={[
                { label: "Rize.gg", href: "/" },
                { label: "Clubs", href: "/clubs" },
                { label: "Shadow Core" },
              ]}
            />
          }
        />
        <main className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
          {/* Club header */}
          <div className="flex items-center gap-4">
            <Avatar size="xl" />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-text-primary">Shadow Core</h1>
                <StatusPill variant="recruiting" />
              </div>
              <p className="text-sm text-text-secondary">
                Competitive gaming club · Founded by MohTarek
              </p>
              <div className="flex items-center gap-4 text-xs text-text-tertiary mt-1">
                <span className="flex items-center gap-1"><Users size={12} /> 24 members</span>
                <span className="flex items-center gap-1"><Calendar size={12} /> Created Jan 2025</span>
                <span>UTC+3</span>
              </div>
            </div>
            <div className="ml-auto flex gap-2">
              <Button variant="outline">Share</Button>
              <Button>Join Club</Button>
            </div>
          </div>

          <Divider />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Chat */}
              <SectionHeader title="Club Chat" />
              <div className="border border-border-default rounded-[var(--radius-md)] flex flex-col">
                <div className="flex flex-col max-h-80 overflow-y-auto">
                  <ChatMessage
                    username="MohTarek"
                    roleBadge="Leader"
                    timestamp="2:30 PM"
                    message="Hey team, scrims tonight at 9 PM. Make sure everyone's warmed up."
                  />
                  <ChatMessage
                    username="Player2"
                    timestamp="2:35 PM"
                    message="I'll be there! Which map?"
                  />
                  <ChatMessage
                    username="Player3"
                    timestamp="2:38 PM"
                    message="Let's do Haven and Ascent."
                    replyTo={{ username: "Player2", text: "Which map?" }}
                  />
                </div>
                <div className="p-3 border-t border-border-default">
                  <ChatInput onAttach={() => {}} onEmoji={() => {}} />
                </div>
              </div>

              {/* Events */}
              <SectionHeader title="Upcoming Events" onAction={() => {}} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SessionCard
                  gameIcon={<Gamepad2 size={20} className="text-red-500" />}
                  teamName="Scrim Practice"
                  owner="MohTarek"
                  game="Valorant"
                  slotsUsed={4}
                  slotsTotal={5}
                  time="Tonight 9:00 PM"
                  skillRequirement="Gold+"
                />
                <SessionCard
                  gameIcon={<Gamepad2 size={20} className="text-red-500" />}
                  teamName="Ranked Grind"
                  owner="Player2"
                  game="Valorant"
                  slotsUsed={2}
                  slotsTotal={5}
                  time="Tomorrow 7:00 PM"
                />
              </div>
            </div>

            {/* Right sidebar */}
            <div className="flex flex-col gap-6">
              <SectionHeader title="Members" />
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 p-2 rounded-[var(--radius-sm)]">
                  <Avatar size="sm" online />
                  <div className="flex flex-col">
                    <span className="text-sm text-text-primary font-medium">MohTarek</span>
                    <span className="text-xs text-text-accent">Leader</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-[var(--radius-sm)]">
                  <Avatar size="sm" online />
                  <div className="flex flex-col">
                    <span className="text-sm text-text-primary">Player2</span>
                    <span className="text-xs text-text-secondary">Member</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-[var(--radius-sm)]">
                  <Avatar size="sm" online={false} />
                  <div className="flex flex-col">
                    <span className="text-sm text-text-primary">Player3</span>
                    <span className="text-xs text-text-secondary">Member</span>
                  </div>
                </div>
              </div>

              <Divider />

              <SectionHeader title="Club Stats" />
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Win Rate</span>
                  <span className="text-text-primary">68%</span>
                </div>
                <ProgressBar value={68} />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Active Games</span>
                  <span className="text-text-primary">Valorant, CS2</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="accent" label="Valorant" />
                  <Badge label="CS2" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
