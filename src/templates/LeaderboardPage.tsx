"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation";
import { TopBar } from "@/components/navigation";
import { Breadcrumbs } from "@/components/navigation";
import { PageHeader } from "@/components/layout";
import { LeaderboardRow } from "@/components/data";
import { SearchInput } from "@/components/forms";
import { FilterChip } from "@/components/buttons";
import { GameTabCard } from "@/components/cards";
import { Gamepad2 } from "lucide-react";

/**
 * @template LeaderboardPage
 * @description Full page layout for viewing the global leaderboard.
 * Compose: Sidebar + TopBar + PageHeader + GameTabCards + LeaderboardRows
 */
export default function LeaderboardPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          breadcrumb={
            <Breadcrumbs
              items={[
                { label: "Rize.gg", href: "/" },
                { label: "Leaderboard" },
              ]}
            />
          }
        />
        <main className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
          <PageHeader title="Leaderboard" subtitle="Top players across all games" />

          {/* Game tabs */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            <GameTabCard gameName="All Games" active />
            <GameTabCard gameName="Valorant" currentRank="Gold 3" />
            <GameTabCard gameName="CS2" currentRank="Faceit 8" />
            <GameTabCard gameName="League of Legends" currentRank="Platinum 2" />
          </div>

          <SearchInput
            placeholder="Search players..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            className="max-w-sm"
          />

          {/* Leaderboard */}
          <div className="flex flex-col gap-1">
            <LeaderboardRow rank={1} name="FlashBang" country="Saudi Arabia" rankTier="Diamond" score={212} maxScore={250} />
            <LeaderboardRow rank={2} name="Aspas" country="Brazil" rankTier="Platinum" score={198} maxScore={250} />
            <LeaderboardRow rank={3} name="Demon1" country="Sweden" rankTier="Diamond" score={185} maxScore={250} />
            <LeaderboardRow rank={4} name="yay" country="USA" rankTier="Gold" score={170} maxScore={250} />
            <LeaderboardRow rank={5} name="Derke" country="Finland" rankTier="Gold" score={160} maxScore={250} />
            <LeaderboardRow rank={6} name="Chronicle" country="Russia" rankTier="Silver" score={145} maxScore={250} />
            <LeaderboardRow rank={7} name="cNed" country="Turkey" rankTier="Gold" score={138} maxScore={250} />
            <LeaderboardRow rank={8} name="Jinggg" country="Singapore" rankTier="Silver" score={125} maxScore={250} />
          </div>
        </main>
      </div>
    </div>
  );
}
