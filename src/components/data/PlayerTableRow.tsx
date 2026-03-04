import { cn } from "@/lib/utils";
import { Star, UserPlus, MessageSquare, MoreVertical } from "lucide-react";
import { type ReactNode } from "react";

interface PlayerTableRowProps {
  avatar?: string;
  name: string;
  sessions?: number;
  groups?: number;
  mutualGroups?: number;
  games?: { src?: string; bgColor?: string }[];
  maxGames?: number;
  countryFlag?: string;
  country?: string;
  rating?: number;
  onAddFriend?: () => void;
  onMessage?: () => void;
  onMore?: () => void;
  className?: string;
}

export function PlayerTableRow({
  avatar,
  name,
  sessions,
  groups,
  mutualGroups,
  games = [],
  maxGames = 3,
  countryFlag,
  country,
  rating,
  onAddFriend,
  onMessage,
  onMore,
  className,
}: PlayerTableRowProps) {
  const visibleGames = games.slice(0, maxGames);
  const overflow = games.length - maxGames;

  return (
    <div
      className={cn(
        "flex items-center justify-between px-1 py-2 hover:bg-bg-surface-hover/50 transition-colors group",
        className
      )}
    >
      {/* Player */}
      <div className="flex items-center gap-3 w-[160px]">
        {avatar ? (
          <img
            src={avatar}
            alt=""
            className="size-8 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="size-8 rounded-full bg-bg-surface shrink-0" />
        )}
        <span className="text-xl font-normal text-text-primary truncate">
          {name}
        </span>
      </div>

      {/* Sessions */}
      {sessions !== undefined && (
        <span className="text-base font-normal text-text-primary w-[50px]">
          {sessions}
        </span>
      )}

      {/* Groups */}
      {groups !== undefined && (
        <span className="text-base font-normal text-text-primary w-[80px]">
          {groups}{" "}
          {mutualGroups !== undefined && (
            <span className="text-xs text-text-secondary">
              / {mutualGroups} mutual
            </span>
          )}
        </span>
      )}

      {/* Main Games */}
      <div className="flex items-center gap-1 w-[120px]">
        {visibleGames.map((game, i) => (
          <div
            key={i}
            className={cn(
              "size-8 rounded-full flex items-center justify-center overflow-hidden shrink-0",
              game.bgColor || "bg-bg-surface"
            )}
          >
            {game.src && (
              <img src={game.src} alt="" className="size-6 object-cover" />
            )}
          </div>
        ))}
        {overflow > 0 && (
          <span className="text-xs text-text-accent ml-1">+{overflow}</span>
        )}
      </div>

      {/* Country */}
      <div className="flex items-center gap-1.5 w-[130px]">
        {countryFlag && (
          <img
            src={countryFlag}
            alt=""
            className="size-8 rounded-full object-cover shrink-0"
          />
        )}
        <span className="text-base font-normal text-text-primary">
          {country}
        </span>
      </div>

      {/* Rating */}
      {rating !== undefined && (
        <div className="flex items-center gap-1 w-[50px]">
          <Star size={16} className="text-[#FDDF49] fill-[#FDDF49]" />
          <span className="text-sm font-medium text-[#FDDF49]">{rating}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 w-[72px]">
        <button
          onClick={onAddFriend}
          className="text-text-secondary hover:text-text-accent transition-colors cursor-pointer"
        >
          <UserPlus size={16} />
        </button>
        <button
          onClick={onMessage}
          className="text-text-secondary hover:text-text-accent transition-colors cursor-pointer"
        >
          <MessageSquare size={16} />
        </button>
        <button
          onClick={onMore}
          className="text-text-secondary hover:text-text-accent transition-colors cursor-pointer"
        >
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );
}

interface PlayerTableHeaderProps {
  className?: string;
  onSortSessions?: () => void;
  onSortGroups?: () => void;
}

export function PlayerTableHeader({
  className,
  onSortSessions,
  onSortGroups,
}: PlayerTableHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-1 text-sm text-text-secondary font-normal",
        className
      )}
    >
      <span className="w-[160px]">Player</span>
      <button
        onClick={onSortSessions}
        className="w-[50px] flex items-center gap-1 cursor-pointer hover:text-text-primary transition-colors"
      >
        Sessions
      </button>
      <button
        onClick={onSortGroups}
        className="w-[80px] flex items-center gap-1 cursor-pointer hover:text-text-primary transition-colors"
      >
        Groups
      </button>
      <span className="w-[120px]">Main games</span>
      <span className="w-[130px]">Country</span>
      <span className="w-[50px]">Rating</span>
      <span className="w-[72px]">Actions</span>
    </div>
  );
}
