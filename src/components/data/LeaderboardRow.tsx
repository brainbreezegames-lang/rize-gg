import { cn } from "@/lib/utils";
import { Trophy, MoreVertical } from "lucide-react";
import { type ReactNode } from "react";

interface LeaderboardRowProps {
  rank: number;
  avatar?: string;
  name: string;
  countryFlag?: string;
  country?: string;
  rankTier?: string;
  score?: number;
  maxScore?: number;
  actions?: ReactNode;
  onMore?: () => void;
  className?: string;
}

function getRankColor(rank: number): string {
  switch (rank) {
    case 1:
      return "#C88A04"; // gold/yellow-600
    case 2:
      return "#94A3B8"; // silver/slate-400
    case 3:
      return "#CD7F32"; // bronze
    default:
      return "";
  }
}

function getRankGradient(rank: number): string {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-[rgba(244,204,45,0)] via-[rgba(244,204,45,0.2)] via-[20%] to-[rgba(244,204,45,0)] to-[90%]";
    case 2:
      return "bg-gradient-to-r from-[rgba(148,163,184,0)] via-[rgba(148,163,184,0.15)] via-[20%] to-[rgba(148,163,184,0)] to-[90%]";
    case 3:
      return "bg-gradient-to-r from-[rgba(205,127,50,0)] via-[rgba(205,127,50,0.15)] via-[20%] to-[rgba(205,127,50,0)] to-[90%]";
    default:
      return "";
  }
}

export function LeaderboardRow({
  rank,
  avatar,
  name,
  countryFlag,
  country,
  rankTier,
  score,
  maxScore,
  actions,
  onMore,
  className,
}: LeaderboardRowProps) {
  const rankColor = getRankColor(rank);
  const isTopThree = rank <= 3;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-5 px-4 py-2",
        isTopThree ? getRankGradient(rank) : "hover:bg-bg-surface-hover",
        "transition-colors",
        className
      )}
    >
      {/* Left section: Rank + Player info */}
      <div className="flex items-center gap-[42px]">
        {/* Rank */}
        <div className="flex items-center gap-1 w-[30px]">
          {isTopThree ? (
            <>
              <Trophy
                size={14}
                style={{ color: rankColor }}
                className="fill-current"
              />
              <span
                className="text-base leading-6"
                style={{ color: rankColor }}
              >
                {rank}
              </span>
            </>
          ) : (
            <span className="text-base text-text-secondary leading-6">
              {rank}
            </span>
          )}
        </div>

        {/* Player */}
        <div className="flex items-center gap-3">
          {avatar ? (
            <img
              src={avatar}
              alt=""
              className="size-8 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="size-8 rounded-full bg-bg-surface shrink-0" />
          )}
          <span className="text-xl font-normal text-white leading-7 w-[97px] truncate">
            {name}
          </span>
        </div>
      </div>

      {/* Right section: Country + Rank + Score */}
      <div className="flex items-center gap-5 flex-1">
        {/* Country */}
        {country && (
          <div className="flex items-center gap-1.5 w-[169px]">
            {countryFlag && (
              <img
                src={countryFlag}
                alt=""
                className="size-8 rounded-full object-cover shrink-0"
              />
            )}
            <span className="text-base text-white leading-6">{country}</span>
          </div>
        )}

        {/* Rank tier */}
        {rankTier && (
          <span className="text-base text-white leading-6 w-[87px]">
            {rankTier}
          </span>
        )}

        {/* Score */}
        {score !== undefined && (
          <span className="text-base text-white leading-6 w-[86px]">
            {score}
            {maxScore !== undefined && (
              <span className="text-xs text-text-secondary">/{maxScore}</span>
            )}
          </span>
        )}
      </div>

      {/* Actions */}
      {actions || (
        <button
          onClick={onMore}
          className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        >
          <MoreVertical size={16} />
        </button>
      )}
    </div>
  );
}
