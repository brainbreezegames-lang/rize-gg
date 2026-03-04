import { cn } from "@/lib/utils";
import { Button } from "@/components/buttons";
import { Users, Clock, Shield } from "lucide-react";
import { type ReactNode } from "react";

interface SessionCardProps {
  gameIcon?: ReactNode;
  teamName: string;
  owner: string;
  game: string;
  slotsUsed: number;
  slotsTotal: number;
  availability?: string;
  time?: string;
  skillRequirement?: string;
  onDetails?: () => void;
  onJoin?: () => void;
  className?: string;
}

export function SessionCard({
  gameIcon,
  teamName,
  owner,
  game,
  slotsUsed,
  slotsTotal,
  availability,
  time,
  skillRequirement,
  onDetails,
  onJoin,
  className,
}: SessionCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-4 rounded-[var(--radius-md)] bg-bg-card border border-border-default hover:border-border-accent/30 transition-colors",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        {gameIcon && (
          <div className="size-10 rounded-[var(--radius-md)] bg-bg-surface flex items-center justify-center shrink-0">
            {gameIcon}
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-text-primary truncate">
            {teamName}
          </span>
          <span className="text-xs text-text-secondary">
            {owner} · {game}
          </span>
        </div>
      </div>

      {/* Info row */}
      <div className="flex items-center gap-4 text-xs text-text-secondary">
        <span className="flex items-center gap-1">
          <Users size={14} />
          {slotsUsed}/{slotsTotal}
        </span>
        {availability && (
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {availability}
          </span>
        )}
        {time && <span>{time}</span>}
      </div>

      {/* Skill */}
      {skillRequirement && (
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <Shield size={14} />
          <span>{skillRequirement}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={onDetails}>
          Session details
        </Button>
        <Button size="sm" className="flex-1" onClick={onJoin}>
          Join
        </Button>
      </div>
    </div>
  );
}
