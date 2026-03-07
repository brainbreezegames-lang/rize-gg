"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";
import { useEditContext } from "@/lib/edit-context";
import {
  IconHome,
  IconMessages,
  IconFederation,
  IconLFG,
  IconTournaments,
  IconScrims,
  IconTeamFinder,
  IconClubs,
  IconPlayers,
  IconLeaderboard,
  IconMissions,
  IconReferrals,
  IconDiscord,
  IconSettings,
  IconHelp,
  IconPlus,
  IconMore,
  LogoMark,
  LogoText,
} from "./SidebarIcons";

interface NavItem {
  icon: ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  textColor?: string;
  action?: ReactNode;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

interface SidebarProps {
  collapsed?: boolean;
  sections?: NavSection[];
  userAvatar?: string;
  userName?: string;
  userEmail?: string;
  activeItem?: string;
  className?: string;
}

const defaultSections: NavSection[] = [
  {
    title: "Navigate",
    items: [
      { icon: <IconHome />, label: "Home" },
      { icon: <IconMessages />, label: "Messages" },
      { icon: <IconFederation />, label: "Federations" },
    ],
  },
  {
    title: "Competitive",
    items: [
      { icon: <IconLFG />, label: "Rize LFG" },
      { icon: <IconTournaments />, label: "Tournaments" },
      { icon: <IconScrims />, label: "Scrims" },
    ],
  },
  {
    title: "Social",
    items: [
      { icon: <IconTeamFinder />, label: "Team Finder" },
      { icon: <IconClubs />, label: "Clubs" },
    ],
  },
];

function SidebarLink({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  const editCtx = useEditContext();

  const handleClick = (e: React.MouseEvent) => {
    if (editCtx?.onNavigate) {
      e.preventDefault();
      editCtx.onNavigate(item.label);
    }
  };

  return (
    <a
      href={item.href || "#"}
      onClick={handleClick}
      className={cn(
        "flex items-center justify-between px-4 py-1.5 w-[240px] cursor-pointer transition-colors border-l-2",
        item.active
          ? "text-text-accent bg-accent-subtle border-l-border-accent"
          : "border-l-transparent hover:bg-bg-surface-hover"
      )}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "shrink-0 size-[18px] flex items-center justify-center",
            item.textColor || (item.active ? "text-text-accent" : "text-text-secondary")
          )}
        >
          {item.icon}
        </span>
        {!collapsed && (
          <span
            className={cn(
              "text-sm leading-5 whitespace-nowrap",
              item.textColor || (item.active ? "text-text-accent" : "text-text-secondary")
            )}
          >
            {item.label}
          </span>
        )}
      </div>
      {!collapsed && item.action && (
        <span className="text-text-secondary hover:text-text-primary transition-colors">
          {item.action}
        </span>
      )}
    </a>
  );
}

export function Sidebar({
  collapsed = false,
  sections = defaultSections,
  userAvatar,
  userName = "demo",
  userEmail = "demo@rize.gg",
  activeItem,
  className,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col h-full min-h-screen border-r border-border-default pt-5 justify-between bg-bg-secondary",
        collapsed ? "w-[60px]" : "w-[240px]",
        className
      )}
    >
      {/* Top: Logo + Nav */}
      <div className="flex flex-col gap-6">
        {/* Logo */}
        <div className="flex items-center px-4">
          <div className="flex items-center">
            <LogoMark className="w-[22px] h-[32px] text-text-accent" />
            {!collapsed && (
              <LogoText className="ml-1.5 h-[13px] w-auto text-text-accent" />
            )}
          </div>
        </div>

        {/* Nav sections */}
        <nav className="flex flex-col gap-4">
          {sections.map((section, i) => (
            <div key={i} className="flex flex-col gap-1">
              {section.title && !collapsed && (
                <div className="px-4 py-1 text-text-tertiary text-xs leading-normal">
                  {section.title}
                </div>
              )}
              <div className="flex flex-col">
                {section.items.map((item, j) => (
                  <SidebarLink
                    key={j}
                    item={{
                      ...item,
                      active: activeItem ? item.label === activeItem : item.active,
                    }}
                    collapsed={collapsed}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom: Discord + Settings + Help + Profile */}
      <div className="flex flex-col">
        <div className="flex flex-col">
          {/* Report a problem */}
          <SidebarLink
            item={{ icon: <IconHelp />, label: "Report a problem", textColor: "text-red-500" }}
            collapsed={collapsed}
          />

          {/* Discord link */}
          <div className="flex items-center px-4 py-1.5 w-[240px] cursor-pointer">
            <div className="flex items-center gap-2.5">
              <span className="shrink-0 size-[18px] flex items-center justify-center text-[#5865F2]">
                <IconDiscord />
              </span>
              {!collapsed && (
                <span className="text-sm leading-5 text-[#5865F2] whitespace-nowrap">
                  Join our Discord
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile */}
        {!collapsed && (
          <div className="flex items-center justify-between px-4 pt-3 pb-5 mt-1 border-t border-border-default">
            <div className="flex items-center gap-2">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt=""
                  className="size-8 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="size-8 rounded-full bg-bg-surface shrink-0" />
              )}
              <div className="flex flex-col w-[120px]">
                <span className="text-sm font-medium text-white leading-[18px] truncate">
                  {userName}
                </span>
                <span className="text-xs text-text-secondary leading-4 truncate">
                  {userEmail}
                </span>
              </div>
            </div>
            <button className="text-text-secondary hover:text-text-primary cursor-pointer transition-colors">
              <IconMore />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
