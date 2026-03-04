import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface GameTabCardProps {
  icon?: ReactNode;
  gameName: string;
  description?: string;
  currentRank?: string;
  backgroundImage?: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function GameTabCard({
  icon,
  gameName,
  description,
  currentRank,
  backgroundImage,
  active = false,
  onClick,
  className,
}: GameTabCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-4 pl-7 pr-[26px] py-3 rounded-[var(--radius-md)] overflow-hidden whitespace-nowrap transition-all cursor-pointer",
        active
          ? "border border-accent bg-accent-muted"
          : "border border-border-default",
        className
      )}
    >
      {/* Background layers (gradient + optional image) */}
      {!active && (
        <div className="absolute inset-0 pointer-events-none rounded-[var(--radius-md)]">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(153,249,234,0.02)] to-[rgba(153,249,234,0.08)] rounded-[var(--radius-md)]" />
          {backgroundImage && (
            <div className="absolute inset-0 overflow-hidden rounded-[var(--radius-md)]">
              <img
                src={backgroundImage}
                alt=""
                className="absolute h-[591%] left-0 top-[-66%] w-[71%] max-w-none"
              />
            </div>
          )}
          <div
            className="absolute inset-0 rounded-[var(--radius-md)]"
            style={{
              backgroundImage:
                "linear-gradient(166deg, rgba(18,20,21,0.7) 0%, rgb(18,20,21) 52.6%)",
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative flex items-center gap-4">
        {icon && (
          <span className="h-12 shrink-0 flex items-center justify-center">
            {icon}
          </span>
        )}
        <div className="flex flex-col gap-1.5 items-start justify-center text-white">
          <span className="text-xl font-semibold leading-7 tracking-[-0.1px]">
            {gameName}
          </span>
          {description && (
            <span className="text-sm font-normal leading-[14px] text-white">
              {description}
            </span>
          )}
          {currentRank && !description && (
            <span className="text-xs text-text-secondary">
              Current rank: {currentRank}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
