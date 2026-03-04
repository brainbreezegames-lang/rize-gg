import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface MissionCardProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  rank?: string;
  progress?: number;
  maxProgress?: number;
  badgeRanks?: { label: string; active: boolean }[];
  status?: "locked" | "in_progress" | "completed";
  className?: string;
}

export function MissionCard({
  icon,
  title,
  description,
  rank,
  progress = 0,
  maxProgress = 100,
  badgeRanks,
  status = "in_progress",
  className,
}: MissionCardProps) {
  const pct = Math.min(100, (progress / maxProgress) * 100);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-4 rounded-[var(--radius-md)] bg-bg-card border border-border-default",
        status === "locked" && "opacity-50",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        {icon && (
          <div className="size-12 rounded-full bg-bg-surface flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
        <div className="flex flex-col gap-0.5 min-w-0">
          <h4 className="text-sm font-semibold text-text-primary">{title}</h4>
          {description && (
            <p className="text-xs text-text-secondary">{description}</p>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          {rank && <span className="text-text-accent">{rank}</span>}
          <span className="text-text-secondary">
            {progress}/{maxProgress}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-bg-surface overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Badge ranks */}
      {badgeRanks && (
        <div className="flex items-center gap-2">
          {badgeRanks.map((badge, i) => (
            <span
              key={i}
              className={cn(
                "text-xs px-2 py-0.5 rounded-full border",
                badge.active
                  ? "border-accent text-accent bg-accent-subtle"
                  : "border-border-default text-text-tertiary"
              )}
            >
              {badge.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
