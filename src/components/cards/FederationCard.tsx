import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

interface FederationCardProps {
  flag?: string;
  flagEmoji?: string;
  country: string;
  memberCount: number | string;
  badge?: string;
  onClick?: () => void;
  className?: string;
}

export function FederationCard({
  flag,
  flagEmoji,
  country,
  memberCount,
  badge,
  onClick,
  className,
}: FederationCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-[10px] w-[276px] h-[72px] rounded-[var(--radius-md)] bg-bg-card border border-border-default",
        "hover:border-border-accent/30 hover:bg-bg-surface-hover transition-colors cursor-pointer",
        className
      )}
    >
      {/* Flag */}
      <div className="size-[52px] rounded-[var(--radius-sm)] overflow-hidden bg-bg-surface shrink-0 flex items-center justify-center">
        {flag ? (
          <img src={flag} alt={country} className="size-full object-cover" />
        ) : flagEmoji ? (
          <span className="text-2xl">{flagEmoji}</span>
        ) : (
          <div className="size-full bg-bg-surface" />
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <span className="text-base font-semibold text-text-primary leading-7 truncate">
          {country}
        </span>
        <div className="flex items-center gap-1">
          <Users size={16} className="text-text-secondary shrink-0" />
          <span className="text-sm text-text-secondary">
            {typeof memberCount === "number"
              ? memberCount.toLocaleString()
              : memberCount}
          </span>
        </div>
      </div>

      {/* Optional badge */}
      {badge && (
        <span className="text-xs text-accent-foreground bg-accent px-2 py-0.5 rounded-full font-medium ml-auto shrink-0">
          {badge}
        </span>
      )}
    </div>
  );
}
