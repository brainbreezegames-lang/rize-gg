import { cn } from "@/lib/utils";
import { MessageSquare, Bell, Sun, Sparkles } from "lucide-react";
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
        "flex items-center justify-between h-14 px-6 border-b border-border-default bg-bg-primary",
        className
      )}
    >
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        {breadcrumb}
      </div>
      <div className="flex items-center gap-1">
        {actions ?? (
          <>
            <a
              href="/generate"
              className="flex items-center gap-1.5 px-3 py-1.5 mr-1 rounded-[var(--radius-sm)] text-xs font-medium text-accent-foreground bg-accent hover:bg-accent-hover transition-colors"
            >
              <Sparkles size={14} />
              AI Generator
            </a>
            <TopBarIconButton icon={<MessageSquare size={18} />} />
            <TopBarIconButton icon={<Bell size={18} />} badge={3} />
            <TopBarIconButton icon={<Sun size={18} />} />
          </>
        )}
      </div>
    </header>
  );
}

function TopBarIconButton({
  icon,
  badge,
  onClick,
}: {
  icon: ReactNode;
  badge?: number;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative size-10 flex items-center justify-center rounded-[var(--radius-sm)] text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover transition-colors cursor-pointer"
    >
      {icon}
      {badge !== undefined && badge > 0 && (
        <span className="absolute top-1.5 right-1.5 size-4 flex items-center justify-center bg-status-error text-white text-[10px] font-medium rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}
