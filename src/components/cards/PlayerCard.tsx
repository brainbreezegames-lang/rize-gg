import { cn } from "@/lib/utils";
import { Star, UserPlus, MessageSquare, MoreVertical } from "lucide-react";
import { type ReactNode } from "react";

interface PlayerCardProps {
  avatar?: string;
  name: string;
  countryFlag?: string;
  country?: string;
  games?: { icon?: ReactNode; bgColor?: string }[];
  badges?: ReactNode[];
  rating?: number;
  totalRatings?: number;
  isFriend?: boolean;
  onAddFriend?: () => void;
  onMessage?: () => void;
  onMore?: () => void;
  className?: string;
}

export function PlayerCard({
  avatar,
  name,
  countryFlag,
  country,
  games = [],
  badges = [],
  rating,
  totalRatings,
  isFriend = false,
  onAddFriend,
  onMessage,
  onMore,
  className,
}: PlayerCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-5 rounded-[var(--radius-md)] bg-bg-card border border-border-default w-[324px]",
        "hover:border-border-accent/30 transition-colors",
        className
      )}
    >
      {/* Header: Avatar + Name + Country */}
      <div className="flex gap-3 items-start">
        <div className="shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt=""
              className="size-14 rounded-full object-cover ring-1 ring-border-default"
            />
          ) : (
            <div className="size-14 rounded-full bg-bg-surface ring-1 ring-border-default" />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-2xl font-semibold text-text-card-foreground leading-8 tracking-[-0.14px]">
            {name}
          </span>
          {country && (
            <div className="flex items-center gap-0.5">
              {countryFlag && (
                <img src={countryFlag} alt="" className="w-5 h-3.5 object-cover rounded-sm" />
              )}
              <span className="text-sm font-light text-text-secondary leading-5">
                {country}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-border-default" />

      {/* Main Games */}
      {games.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-text-card-foreground leading-6">
            Main Games
          </span>
          <div className="flex items-center gap-0.5">
            {games.map((game, i) => (
              <div
                key={i}
                className={cn(
                  "size-6 rounded-full flex items-center justify-center overflow-hidden shrink-0",
                  game.bgColor || "bg-bg-surface"
                )}
              >
                {game.icon}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="w-full h-px bg-border-default" />

      {/* Badges row */}
      {badges.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-2">
            {badges.map((badge, i) => (
              <div key={i} className="shrink-0 size-9">
                {badge}
              </div>
            ))}
          </div>
          <span className="text-sm font-light text-text-accent leading-5 cursor-pointer hover:underline">
            See all
          </span>
        </div>
      )}

      {/* Rating row */}
      {rating !== undefined && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={20} className="text-[#FDDF49] fill-[#FDDF49]" />
            <span className="text-sm font-medium text-[#FDDF49] leading-6">
              Rating : {rating}
            </span>
          </div>
          {totalRatings !== undefined && (
            <span className="text-sm font-light text-text-secondary leading-5">
              {totalRatings} Rating
            </span>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onAddFriend}
          className={cn(
            "flex-1 flex items-center justify-center gap-1 px-4 py-2 rounded-[var(--radius-sm)] text-sm font-medium leading-6 transition-colors cursor-pointer",
            isFriend
              ? "bg-bg-surface text-text-primary border border-border-default hover:bg-bg-surface-hover"
              : "bg-accent text-accent-foreground hover:bg-accent-hover"
          )}
        >
          {isFriend ? "Friends" : "Add friend"}
          <UserPlus size={16} />
        </button>
        <button
          onClick={onMessage}
          className="flex items-center justify-center size-10 rounded-[var(--radius-sm)] border border-[#343D3C] text-text-secondary hover:bg-bg-surface-hover transition-colors cursor-pointer"
        >
          <MessageSquare size={16} />
        </button>
        <button
          onClick={onMore}
          className="flex items-center justify-center size-10 rounded-[var(--radius-sm)] border border-[#343D3C] text-text-secondary hover:bg-bg-surface-hover transition-colors cursor-pointer"
        >
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );
}
