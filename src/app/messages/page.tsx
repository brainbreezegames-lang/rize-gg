"use client";

import { useState } from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { TopBar } from "@/components/navigation/TopBar";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { MessageSquarePlus, Users, LayoutGrid, Search, Users2 } from "lucide-react";

type FriendTab = "Online" | "All" | "Pending" | "Favorites";

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<FriendTab>("All");
  const [search, setSearch] = useState("");

  const tabs: { label: FriendTab; count: number }[] = [
    { label: "Online", count: 0 },
    { label: "All", count: 0 },
    { label: "Pending", count: 0 },
    { label: "Favorites", count: 0 },
  ];

  return (
    <div className="flex h-screen bg-bg-primary">
      <Sidebar activeItem="Messages" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumb={<Breadcrumbs items={[{ label: "Messages" }]} />} />
        <div className="flex-1 flex overflow-hidden">

          {/* Left panel */}
          <div className="w-[280px] shrink-0 border-r border-border-default flex flex-col bg-bg-secondary">
            {/* Start a conversation */}
            <div className="p-3 border-b border-border-default">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] border border-border-default text-text-secondary text-sm hover:bg-bg-surface-hover hover:text-text-primary transition-colors cursor-pointer">
                <MessageSquarePlus size={16} />
                <span>Start a conversation</span>
              </button>
            </div>

            {/* Nav items */}
            <div className="flex flex-col py-1">
              <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary transition-colors cursor-pointer text-left">
                <Users size={16} className="shrink-0" />
                <span>Friends</span>
              </button>
              <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary transition-colors cursor-pointer text-left">
                <LayoutGrid size={16} className="shrink-0" />
                <span>Teams</span>
              </button>
            </div>

            <div className="border-t border-border-default" />

            {/* Direct Messages */}
            <div className="px-4 py-3">
              <span className="text-xs text-text-tertiary font-medium">Direct Messages</span>
            </div>

            {/* Empty DM state */}
            <div className="flex-1 flex flex-col items-center justify-center gap-2 px-4 pb-8">
              <div className="size-12 rounded-full bg-bg-surface flex items-center justify-center">
                <MessageSquarePlus size={22} className="text-text-tertiary" />
              </div>
              <p className="text-sm font-medium text-text-primary">No chats yet</p>
              <p className="text-xs text-text-secondary text-center">Start a new conversation</p>
            </div>

            {/* Online count */}
            <div className="border-t border-border-default px-4 py-3">
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <Users size={13} className="shrink-0" />
                <span>Online (0)</span>
              </div>
            </div>
          </div>

          {/* Right panel — Friends management */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tab bar */}
            <div className="flex items-center gap-1 px-5 border-b border-border-default h-14 shrink-0">
              <span className="text-sm font-semibold text-text-primary mr-3">Friends</span>
              {tabs.map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(tab.label)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] text-sm transition-colors cursor-pointer ${
                    activeTab === tab.label
                      ? "bg-bg-surface text-text-primary"
                      : "text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary"
                  }`}
                >
                  {tab.label === "Online" && <span className="size-1.5 rounded-full bg-green-400 shrink-0" />}
                  <span>{tab.label} ({tab.count})</span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="px-5 py-4 border-b border-border-default">
              <div className="flex items-center gap-2 bg-bg-input border border-border-default rounded-[var(--radius-md)] px-3 py-2 focus-within:border-border-accent transition-colors">
                <Search size={14} className="text-text-tertiary shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for a friend..."
                  className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary"
                />
              </div>
            </div>

            {/* Empty state */}
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <Users2 size={48} className="text-text-tertiary" strokeWidth={1.5} />
              <p className="text-base text-text-secondary">No friends found</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
