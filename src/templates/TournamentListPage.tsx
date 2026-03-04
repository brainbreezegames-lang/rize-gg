"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation";
import { TopBar } from "@/components/navigation";
import { Breadcrumbs } from "@/components/navigation";
import { PageHeader, SectionHeader } from "@/components/layout";
import { TournamentCard } from "@/components/cards";
import { SearchInput } from "@/components/forms";
import { Select } from "@/components/forms";
import { FilterChip } from "@/components/buttons";
import { Button } from "@/components/buttons";
import { FilterDrawer } from "@/components/overlays";
import { Toggle } from "@/components/forms";
import { Gamepad2, SlidersHorizontal } from "lucide-react";

/**
 * @template TournamentListPage
 * @description Full page layout for browsing tournaments.
 * Compose: Sidebar + TopBar + PageHeader + FilterChips + TournamentCard grid + FilterDrawer
 */
export default function TournamentListPage() {
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

          {/* Filters row */}
          <div className="flex items-center gap-3 flex-wrap">
            <SearchInput
              placeholder="Search tournaments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch("")}
              className="w-64"
            />
            <FilterChip active icon={<Gamepad2 size={14} />}>
              Valorant
            </FilterChip>
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

          {/* Tournament grid */}
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
          <Select
            label="Status"
            options={[
              { value: "all", label: "All" },
              { value: "open", label: "Registration Open" },
              { value: "live", label: "Live" },
              { value: "finished", label: "Finished" },
            ]}
          />
          <Toggle label="Show full tournaments" />
        </div>
      </FilterDrawer>
    </div>
  );
}
