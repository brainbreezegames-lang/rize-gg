import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface SettingsSection {
  title: string;
  items: { label: string; href?: string; active?: boolean }[];
}

interface SettingsSidebarProps {
  sections?: SettingsSection[];
  searchPlaceholder?: string;
  className?: string;
}

const defaultSections: SettingsSection[] = [
  {
    title: "USER SETTINGS",
    items: [
      { label: "My Account", active: true },
      { label: "Profile" },
      { label: "Connected accounts" },
      { label: "Connected games" },
      { label: "Social access" },
    ],
  },
  {
    title: "PLATFORM SETTINGS",
    items: [
      { label: "Notifications" },
      { label: "Language" },
    ],
  },
];

export function SettingsSidebar({
  sections = defaultSections,
  searchPlaceholder = "Search",
  className,
}: SettingsSidebarProps) {
  return (
    <nav
      className={cn(
        "flex flex-col gap-6 w-[210px] shrink-0 border-r border-border-default pt-[68px] h-full",
        className
      )}
    >
      {/* Search input */}
      <div className="flex items-center gap-[7px] px-3 h-10 w-[192px] border border-[#343D3C] rounded-[var(--radius-md)]">
        <Search size={16} className="text-text-secondary shrink-0" />
        <span className="text-sm text-text-secondary leading-5 truncate">
          {searchPlaceholder}
        </span>
      </div>

      {/* Sections */}
      {sections.map((section, i) => (
        <div key={i} className="flex flex-col gap-3.5">
          <span className="text-sm text-[#323A3E] leading-6 pl-3.5">
            {section.title}
          </span>
          <div className="flex flex-col">
            {section.items.map((item, j) => (
              <a
                key={j}
                href={item.href || "#"}
                className={cn(
                  "px-3.5 py-2.5 text-base leading-6 transition-colors cursor-pointer",
                  item.active
                    ? "text-text-accent bg-gradient-to-r from-[rgba(194,253,233,0)] via-[rgba(194,253,233,0.1)] via-[20%] to-[rgba(194,253,233,0)] to-[90%]"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
