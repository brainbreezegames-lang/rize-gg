import { cn } from "@/lib/utils";
import { MessageSquare, Bell, Globe, ChevronDown } from "lucide-react";
import { type ReactNode } from "react";

interface TopBarProps {
  breadcrumb?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function TopBar({ breadcrumb, actions, className }: TopBarProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between px-6 h-14 border-b border-border-default shrink-0",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {breadcrumb}
      </div>
      <div className="flex items-center gap-1">
        {actions ?? (
          <>
            <button className="relative flex items-center justify-center size-9 rounded-[var(--radius-sm)] text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover transition-colors cursor-pointer">
              <Bell size={18} />
            </button>
            <button className="relative flex items-center justify-center size-9 rounded-[var(--radius-sm)] text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover transition-colors cursor-pointer">
              <MessageSquare size={18} />
            </button>
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-sm)] text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover transition-colors cursor-pointer ml-1">
              <Globe size={16} />
              <span className="text-sm">English</span>
              <ChevronDown size={14} />
            </button>
          </>
        )}
      </div>
    </header>
  );
}
