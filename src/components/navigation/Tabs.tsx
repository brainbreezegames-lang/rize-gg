import { cn } from "@/lib/utils";

interface Tab {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange?: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div className={cn("flex items-end w-full", className)}>
      {tabs.map((tab) => {
        const isActive = tab.value === activeTab;
        return (
          <button
            key={tab.value}
            onClick={() => onTabChange?.(tab.value)}
            className={cn(
              "flex-1 flex items-center justify-center px-2 py-2.5 text-lg font-semibold transition-colors cursor-pointer",
              isActive
                ? "border-b-[3px] border-accent text-text-primary bg-gradient-to-b from-transparent via-transparent to-accent-subtle"
                : "border-b border-border-default text-text-secondary hover:text-text-primary"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
