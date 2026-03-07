import { MEDIA_LIBRARY } from "@/lib/media-library";
import { cn, isEmojiFlag, setImageFallback } from "@/lib/utils";
import { Users, Globe, ChevronRight } from "lucide-react";
import { type ReactNode } from "react";

interface ClubCardProps {
  avatar?: string;
  name: string;
  countryFlag?: string;
  status?: string;
  statusIcon?: ReactNode;
  owner?: string;
  timezone?: string;
  memberCount?: number;
  memberMax?: number;
  activeGames?: { icon?: ReactNode; label?: string }[];
  onOpen?: () => void;
  onJoin?: () => void;
  onDetails?: () => void;
  joined?: boolean;
  className?: string;
}

export function ClubCard({
  avatar,
  name,
  countryFlag,
  status,
  statusIcon,
  owner,
  timezone,
  memberCount,
  memberMax,
  activeGames,
  onOpen,
  onJoin,
  onDetails,
  joined,
  className,
}: ClubCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-[10px] p-[18px] rounded-[8px] border border-accent",
        "bg-gradient-to-b from-[rgba(153,249,234,0.02)] to-[rgba(153,249,234,0.08)]",
        className
      )}
    >
      {/* Header: Avatar + Info */}
      <div className="flex gap-2 items-start w-full">
        {/* Avatar */}
        {avatar ? (
          <img
            src={avatar}
            alt=""
            className="size-[52px] rounded-[4px] object-cover shrink-0"
            onError={(event) => setImageFallback(event, MEDIA_LIBRARY.fallback.avatar)}
          />
        ) : (
          <div className="size-[52px] rounded-[4px] bg-bg-surface shrink-0" />
        )}

        <div className="flex flex-col flex-1 min-w-0">
          {/* Name + Flag + Status */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-white leading-7 whitespace-nowrap">
                {name}
              </span>
              {countryFlag && (
                isEmojiFlag(countryFlag) ? (
                  <span className="text-sm leading-none">{countryFlag}</span>
                ) : (
                  <img
                    src={countryFlag}
                    alt=""
                    className="w-5 h-3.5 object-cover shrink-0"
                  />
                )
              )}
            </div>
            {status && (
              <div className="flex items-center gap-1.5 bg-[#161D22] rounded-[25px] px-2 py-[3px]">
                {statusIcon || <Users size={16} className="text-white" />}
                <span className="text-xs text-white leading-normal">
                  {status}
                </span>
              </div>
            )}
          </div>

          {/* Owner + Timezone + Members */}
          <div className="flex items-center gap-2 w-full">
            {owner && (
              <div className="flex items-center gap-1 text-sm leading-6 whitespace-nowrap">
                <span className="text-[#CBD5E1]">By</span>
                <span className="text-accent font-medium">{owner}</span>
              </div>
            )}

            {owner && timezone && (
              <div className="flex h-2 items-center justify-center w-0">
                <div className="w-2 h-px bg-border-default rotate-90" />
              </div>
            )}

            {timezone && (
              <div className="flex items-center gap-1 shrink-0">
                <Globe size={16} className="text-white" />
                <span className="text-sm text-white leading-6 whitespace-nowrap">
                  {timezone}
                </span>
              </div>
            )}

            {timezone && memberCount !== undefined && (
              <div className="flex h-2 items-center justify-center w-0">
                <div className="w-2 h-px bg-border-default rotate-90" />
              </div>
            )}

            {memberCount !== undefined && (
              <div className="flex items-center gap-1 shrink-0">
                <Users size={16} className="text-white" />
                <span className="text-sm text-white leading-6 whitespace-nowrap">
                  {memberCount}{memberMax !== undefined && `/${memberMax}`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-border-default" />

      {/* Active Games */}
      <div className="flex flex-col gap-[10px] w-full">
        <span className="text-sm font-medium text-white leading-6">
          Active Games
        </span>

        <div className="flex items-center gap-2 w-full">
          <div className="flex items-center gap-1 flex-1 overflow-hidden">
            {activeGames?.map((game, i) => (
              <div
                key={i}
                className="flex items-center justify-center w-[60px] h-8 rounded-full bg-[#161D22] shrink-0"
              >
                {game.icon || (
                  <span className="text-xs text-white">{game.label}</span>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center size-[18px] rounded-full bg-white/10 shrink-0">
            <ChevronRight size={10} className="text-white" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-border-default" />

      {/* Action buttons */}
      <div className="flex items-center gap-[18px] w-full">
        {onOpen && !onDetails && !onJoin && (
          <button
            onClick={onOpen}
            className="flex items-center justify-center gap-1 w-full px-4 py-2 rounded-[var(--radius-sm)] border border-accent text-accent text-sm font-medium leading-6 cursor-pointer hover:bg-accent-muted transition-colors"
          >
            Open Club
          </button>
        )}
        {onDetails && (
          <button
            onClick={onDetails}
            className="flex-1 flex items-center justify-center px-4 py-2 rounded-[var(--radius-sm)] border border-border-default text-white text-sm font-medium leading-6 cursor-pointer hover:bg-bg-surface-hover transition-colors"
          >
            Club details
          </button>
        )}
        {onJoin && !joined && (
          <button
            onClick={onJoin}
            className="flex-1 flex items-center justify-center gap-1 px-4 py-2 rounded-[var(--radius-sm)] bg-accent text-accent-foreground text-sm font-medium leading-6 cursor-pointer hover:bg-accent-hover transition-colors"
          >
            Join Club <span aria-hidden>→</span>
          </button>
        )}
        {joined && (
          <button
            className="flex-1 flex items-center justify-center px-4 py-2 rounded-[var(--radius-sm)] border border-border-default text-text-secondary text-sm font-medium leading-6 cursor-default"
          >
            Joined
          </button>
        )}
        {!onOpen && !onDetails && !onJoin && !joined && (
          <button
            className="flex items-center justify-center gap-1 w-full px-4 py-2 rounded-[var(--radius-sm)] border border-border-default text-white text-sm font-medium leading-6 cursor-pointer hover:bg-bg-surface-hover transition-colors"
          >
            Club details
          </button>
        )}
      </div>
    </div>
  );
}
