"use client";

import { cn } from "@/lib/utils";
import {
  Home,
  Gamepad2,
  Users,
  Swords,
  Trophy,
  Calendar,
  Globe,
  Shield,
  BarChart3,
  Medal,
  Settings,
  HelpCircle,
  Plus,
  MoreVertical,
} from "lucide-react";
import { useState, type ReactNode } from "react";

interface NavItem {
  icon: ReactNode;
  label: string;
  href?: string;
  badge?: string | number;
  action?: ReactNode;
  active?: boolean;
  textColor?: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  logo?: ReactNode;
  sections?: NavSection[];
  userAvatar?: string;
  userName?: string;
  userEmail?: string;
  className?: string;
}

const defaultSections: NavSection[] = [
  {
    items: [
      { icon: <Home size={20} />, label: "Home", href: "/" },
      { icon: <Gamepad2 size={20} />, label: "Games" },
      {
        icon: <Users size={20} />,
        label: "Team finder",
        action: <Plus size={20} />,
      },
    ],
  },
  {
    title: "Competitive",
    items: [
      { icon: <Swords size={20} />, label: "Rize LFG" },
      { icon: <Swords size={20} />, label: "Scrims" },
      { icon: <Trophy size={20} />, label: "Tournaments" },
      { icon: <Calendar size={20} />, label: "Calendar" },
    ],
  },
  {
    title: "Social",
    items: [
      { icon: <Globe size={20} />, label: "Federations" },
      { icon: <Shield size={20} />, label: "Clubs" },
      { icon: <Users size={20} />, label: "Players" },
      { icon: <BarChart3 size={20} />, label: "Leaderboard" },
      { icon: <Medal size={20} />, label: "Missions & Progress" },
    ],
  },
];

function SidebarNavItem({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  return (
    <a
      href={item.href || "#"}
      className={cn(
        "flex items-center justify-between px-5 py-2.5 w-[240px] cursor-pointer transition-colors group",
        item.active
          ? "text-accent bg-accent-subtle"
          : "hover:bg-bg-surface-hover"
      )}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "shrink-0",
            item.textColor || (item.active ? "text-accent" : "text-text-secondary")
          )}
        >
          {item.icon}
        </span>
        {!collapsed && (
          <span
            className={cn(
              "text-base leading-6",
              item.textColor || "text-text-secondary"
            )}
          >
            {item.label}
          </span>
        )}
      </div>
      {!collapsed && item.action && (
        <span className="text-text-secondary hover:text-text-primary transition-opacity">
          {item.action}
        </span>
      )}
      {!collapsed && item.badge && (
        <span className="bg-accent text-accent-foreground text-xs px-1.5 py-0.5 rounded-full font-medium">
          {item.badge}
        </span>
      )}
    </a>
  );
}

export function Sidebar({
  collapsed: controlledCollapsed,
  onToggle,
  sections = defaultSections,
  userAvatar,
  userName = "MohTarek",
  userEmail = "Trk20@gmail.com",
  className,
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = controlledCollapsed ?? internalCollapsed;

  return (
    <aside
      className={cn(
        "flex flex-col h-full border-r border-border-default bg-bg-primary pt-6 justify-between",
        collapsed ? "w-[60px]" : "w-[240px]",
        className
      )}
    >
      {/* Top: Logo + Nav */}
      <div className="flex flex-col gap-10">
        {/* Logo */}
        <div className="flex items-center px-5">
          <span className="text-accent font-bold text-xl tracking-tight">
            {collapsed ? "R" : "rize.gg"}
          </span>
        </div>

        {/* Nav sections */}
        <nav className="flex flex-col gap-6">
          {sections.map((section, i) => (
            <div key={i} className="flex flex-col gap-2">
              {section.title && !collapsed && (
                <div className="px-5 text-text-secondary text-sm leading-normal">
                  {section.title}
                </div>
              )}
              <div className="flex flex-col">
                {section.items.map((item, j) => (
                  <SidebarNavItem
                    key={j}
                    item={item}
                    collapsed={collapsed}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom: Discord + Settings + Help + Profile */}
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col">
          {/* Discord link */}
          <SidebarNavItem
            item={{
              icon: <DiscordIcon />,
              label: "Join us on Discord",
              textColor: "text-discord",
            }}
            collapsed={collapsed}
          />
          <SidebarNavItem
            item={{ icon: <Settings size={20} />, label: "Settings" }}
            collapsed={collapsed}
          />
          <SidebarNavItem
            item={{ icon: <HelpCircle size={20} />, label: "Get help" }}
            collapsed={collapsed}
          />
        </div>

        {/* Profile */}
        {!collapsed && (
          <div className="flex items-center justify-between px-5 pt-2 pb-7">
            <div className="flex items-center gap-1.5">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt=""
                  className="size-9 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="size-9 rounded-full bg-bg-surface shrink-0" />
              )}
              <div className="flex flex-col gap-0.5 w-[115px]">
                <span className="text-base text-white leading-4 truncate">
                  {userName}
                </span>
                <span className="text-sm text-text-secondary leading-[18px] truncate">
                  {userEmail}
                </span>
              </div>
            </div>
            <button className="text-text-secondary hover:text-text-primary cursor-pointer transition-colors">
              <MoreVertical size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

function DiscordIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-discord"
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}
