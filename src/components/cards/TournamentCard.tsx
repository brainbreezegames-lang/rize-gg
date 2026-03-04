import { cn } from "@/lib/utils";
import { MapPin, Users, ChevronDown } from "lucide-react";
import { type ReactNode } from "react";

interface TournamentCardProps {
  heroImage?: string;
  prize?: string;
  prizeIcon?: ReactNode;
  status?: string;
  statusColor?: string;
  location?: string;
  capacity?: string;
  rankRequirement?: string;
  gameIcon?: string;
  gameIconNode?: ReactNode;
  title: string;
  description?: string;
  countdown?: { days: string; hours: string; minutes: string };
  organizerAvatar?: string;
  organizerName?: string;
  className?: string;
}

export function TournamentCard({
  heroImage,
  prize,
  prizeIcon,
  status,
  statusColor = "bg-status-success",
  location,
  capacity,
  rankRequirement,
  gameIcon,
  gameIconNode,
  title,
  description,
  countdown,
  organizerAvatar,
  organizerName,
  className,
}: TournamentCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-[var(--radius-md)] bg-bg-card overflow-hidden cursor-pointer hover:brightness-105 transition-all w-[372px]",
        className
      )}
    >
      {/* Hero area - 166px */}
      <div className="relative h-[166px] p-4 rounded-t-[var(--radius-md)] overflow-hidden">
        {heroImage && (
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="relative flex items-start justify-between">
          {/* Prize badge */}
          {prize && (
            <div className="flex items-center gap-2 h-12 px-4 py-2 rounded-[var(--radius-md)] bg-status-warning backdrop-blur-[5px]">
              {prizeIcon && <div className="size-6">{prizeIcon}</div>}
              <div className="flex flex-col text-accent-foreground leading-none pb-0.5">
                <span className="text-xs leading-normal">Main prize</span>
                <span className="text-base font-medium leading-6">{prize}</span>
              </div>
            </div>
          )}
          {/* Status pill */}
          {status && (
            <span
              className={cn(
                "flex items-center justify-center px-2 py-0.5 rounded-[88px] text-xs text-white leading-normal",
                statusColor
              )}
            >
              {status}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col p-4">
        <div className="flex flex-col gap-4">
          {/* Meta row */}
          <div className="flex items-center gap-3 h-4 text-xs text-white leading-normal">
            {location && (
              <span className="flex items-center gap-1">
                <MapPin size={16} />
                {location}
              </span>
            )}
            {location && capacity && (
              <span className="w-0 h-0 border-l border-border-default rotate-90 self-center" />
            )}
            {capacity && (
              <span className="flex items-center gap-1">
                <Users size={16} />
                {capacity}
              </span>
            )}
            {capacity && rankRequirement && (
              <span className="w-0 h-0 border-l border-border-default rotate-90 self-center" />
            )}
            {rankRequirement && (
              <span className="flex items-center gap-1">
                <ChevronDown size={16} />
                {rankRequirement}
              </span>
            )}
          </div>

          {/* About section */}
          <div className="flex gap-3 items-start">
            {(gameIcon || gameIconNode) && (
              <div className="size-14 rounded-[var(--radius-md)] overflow-hidden shrink-0">
                {gameIconNode || (
                  <img src={gameIcon} alt="" className="size-full object-cover" />
                )}
              </div>
            )}
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <span className="text-lg font-semibold text-white leading-7">
                {title}
              </span>
              {description && (
                <p className="text-xs text-text-secondary leading-normal line-clamp-2">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Divider before countdown */}
          {countdown && <div className="h-px bg-border-default" />}

          {/* Countdown */}
          {countdown && (
            <div className="flex gap-2 px-4">
              {(["days", "hours", "minutes"] as const).map((unit) => (
                <div
                  key={unit}
                  className="flex-1 flex items-center justify-center gap-1 pt-3 pb-2 px-6 rounded-[var(--radius-md)] bg-accent-subtle border border-accent-subtle backdrop-blur-[5px]"
                >
                  <span className="text-xl font-semibold text-white leading-[25px]">
                    {countdown[unit]}
                  </span>
                  <span className="text-sm text-white leading-5 capitalize">
                    {unit}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Divider before organizer */}
          {organizerName && <div className="h-px bg-border-default" />}

          {/* Organizer footer */}
          {organizerName && (
            <div className="flex items-center gap-1">
              {organizerAvatar ? (
                <img
                  src={organizerAvatar}
                  alt=""
                  className="size-8 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="size-8 rounded-full bg-bg-surface shrink-0" />
              )}
              <div className="flex flex-col leading-none">
                <span className="text-sm text-white leading-6">Organizer</span>
                <span className="text-xs text-text-secondary leading-normal">
                  {organizerName}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
