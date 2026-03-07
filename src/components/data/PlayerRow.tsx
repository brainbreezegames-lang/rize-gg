import { MEDIA_LIBRARY } from "@/lib/media-library";
import { cn, isEmojiFlag, setImageFallback } from "@/lib/utils";
import { Star, UserPlus, MessageSquare, MoreVertical } from "lucide-react";
import { type ReactNode } from "react";

interface PlayerRowProps {
  avatar?: string;
  name: string;
  sessionsCount?: number;
  groupsCount?: number;
  mutualCount?: number;
  games?: { icon?: ReactNode; bgColor?: string }[];
  overflowCount?: number;
  countryFlag?: string;
  country?: string;
  rating?: number;
  onAddFriend?: () => void;
  onMessage?: () => void;
  onMore?: () => void;
  className?: string;
}

export function PlayerRow({
  avatar,
  name,
  sessionsCount,
  groupsCount,
  mutualCount,
  games = [],
  overflowCount,
  countryFlag,
  country,
  rating,
  onAddFriend,
  onMessage,
  onMore,
  className,
}: PlayerRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-1 py-2 hover:bg-bg-surface-hover transition-colors",
        className
      )}
    >
      {/* Avatar + Name */}
      <div className="flex items-center gap-3 w-[159px]">
        {avatar ? (
          <img
            src={avatar}
            alt=""
            className="size-8 rounded-full object-cover shrink-0"
            onError={(event) => setImageFallback(event, MEDIA_LIBRARY.fallback.avatar)}
          />
        ) : (
          <div className="size-8 rounded-full bg-bg-surface shrink-0" />
        )}
        <span className="text-xl font-normal text-white leading-7 truncate">
          {name}
        </span>
      </div>

      {/* Sessions */}
      {sessionsCount !== undefined && (
        <span className="text-base text-white leading-6 w-[30px]">
          {sessionsCount}
        </span>
      )}

      {/* Groups / Mutual */}
      {groupsCount !== undefined && (
        <span className="text-base text-white leading-6 w-[79px]">
          {groupsCount}{" "}
          {mutualCount !== undefined && (
            <span className="text-xs text-text-secondary">
              / {mutualCount} mutual
            </span>
          )}
        </span>
      )}

      {/* Game icons */}
      {games.length > 0 && (
        <div className="flex items-center gap-1 w-[118px]">
          <div className="flex items-center gap-0.5">
            {games.map((game, i) => (
              <div
                key={i}
                className={cn(
                  "size-8 rounded-full flex items-center justify-center overflow-hidden shrink-0",
                  game.bgColor || "bg-bg-surface"
                )}
              >
                {game.icon}
              </div>
            ))}
          </div>
          {overflowCount !== undefined && overflowCount > 0 && (
            <span className="text-xs text-text-accent leading-normal">
              +{overflowCount}
            </span>
          )}
        </div>
      )}

      {/* Country */}
      {country && (
        <div className="flex items-center gap-1.5 w-[129px]">
          {countryFlag && (
            isEmojiFlag(countryFlag) ? (
              <span className="text-2xl leading-none">{countryFlag}</span>
            ) : (
              <img
                src={countryFlag}
                alt=""
                className="size-8 rounded-full object-cover shrink-0"
              />
            )
          )}
          <span className="text-base text-white leading-6">{country}</span>
        </div>
      )}

      {/* Rating */}
      {rating !== undefined && (
        <div className="flex items-center gap-1 w-10">
          <Star size={16} className="text-[#FDDF49] fill-[#FDDF49]" />
          <span className="text-sm font-medium text-[#FDDF49] leading-6">
            {rating}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 w-[72px]">
        <button
          onClick={onAddFriend}
          className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <UserPlus size={16} />
        </button>
        <button
          onClick={onMessage}
          className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <MessageSquare size={16} />
        </button>
        <button
          onClick={onMore}
          className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );
}
