"use client";

import { Sidebar } from "@/components/navigation";
import { TopBar } from "@/components/navigation";
import { Breadcrumbs } from "@/components/navigation";
import { SectionHeader, HeroBanner } from "@/components/layout";
import { TournamentCard, SessionCard, StatCard, ArticleCard } from "@/components/cards";
import { GameTabCard } from "@/components/cards";
import { Gamepad2, Users, Trophy, Swords } from "lucide-react";

/**
 * @template HomePage
 * @description Main dashboard/home page after login.
 * Compose: Sidebar + TopBar + HeroBanner + Game tabs + Stat cards + Session/Tournament cards + Articles
 */
export default function HomePage() {
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
          <HeroBanner
            title="Find Your Team. Compete. Rise."
            subtitle="Join thousands of players competing in tournaments, scrims, and ranked sessions across MENA."
            ctaLabel="Find your team"
            className="bg-gradient-to-br from-bg-secondary to-bg-primary"
          />

          {/* Game tabs */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            <GameTabCard gameName="Valorant" currentRank="Gold 3" active />
            <GameTabCard gameName="CS2" currentRank="Faceit 8" />
            <GameTabCard gameName="League of Legends" currentRank="Platinum 2" />
            <GameTabCard gameName="Rocket League" />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Active Players" value="12,450" icon={<Users size={16} />} />
            <StatCard title="Live Tournaments" value="89" icon={<Trophy size={16} />} />
            <StatCard title="Open Sessions" value="234" icon={<Swords size={16} />} />
            <StatCard title="Active Clubs" value="156" icon={<Users size={16} />} />
          </div>

          {/* Active sessions */}
          <SectionHeader title="Active Sessions" actionLabel="Browse all" onAction={() => {}} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SessionCard
              gameIcon={<Gamepad2 size={20} className="text-red-500" />}
              teamName="Just4fun"
              owner="TenZ"
              game="Valorant"
              slotsUsed={3}
              slotsTotal={5}
              availability="Evening"
              time="7:00 PM"
              skillRequirement="Gold+"
            />
            <SessionCard
              gameIcon={<Gamepad2 size={20} className="text-yellow-500" />}
              teamName="Rush B"
              owner="s1mple"
              game="CS2"
              slotsUsed={4}
              slotsTotal={5}
              availability="Now"
              skillRequirement="Faceit 7+"
            />
            <SessionCard
              gameIcon={<Gamepad2 size={20} className="text-blue-500" />}
              teamName="Rift Warriors"
              owner="Faker"
              game="LoL"
              slotsUsed={2}
              slotsTotal={5}
              availability="Tonight"
              time="10:00 PM"
              skillRequirement="Platinum+"
            />
          </div>

          {/* Upcoming tournaments */}
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
              organizerName="Ahmed Ali"
            />
          </div>

          {/* Articles */}
          <SectionHeader title="Latest Articles" actionLabel="Read more" onAction={() => {}} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ArticleCard
              badge="Fresh Article"
              title="VCT 2025 Season Preview"
              description="Everything you need to know about the upcoming Valorant Champions Tour."
              date="Mar 4, 2025"
            />
            <ArticleCard
              title="Top 10 CS2 Strategies"
              description="Master these strategies to climb the ranks."
              date="Mar 2, 2025"
            />
            <ArticleCard
              title="Rize.gg Patch Notes v2.0"
              description="New features, improvements, and bug fixes."
              date="Mar 1, 2025"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
