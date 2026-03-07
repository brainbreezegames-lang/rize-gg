import { MEDIA_LIBRARY } from "@/lib/media-library";
import { cn, setImageFallback } from "@/lib/utils";
import { type ReactNode } from "react";

interface GameCardProps {
  image?: string;
  logo?: ReactNode;
  name: string;
  activeSessions?: number;
  status?: "supported" | "coming_soon";
  onClick?: () => void;
  className?: string;
}

export function GameCard({
  image,
  logo,
  name,
  activeSessions,
  status = "supported",
  onClick,
  className,
}: GameCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-[var(--radius-lg)] overflow-hidden cursor-pointer group",
        "border border-border-default hover:border-border-accent/30 transition-all",
        "aspect-[16/10]",
        className
      )}
    >
      {/* Background image */}
      {image && (
        <img
          src={image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(event) => setImageFallback(event, MEDIA_LIBRARY.fallback.game)}
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-bg-primary/30 to-transparent" />

      {/* Status badge */}
      {status === "coming_soon" && (
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2 py-0.5 rounded-full bg-bg-surface/80 text-text-secondary text-xs border border-border-default">
            Coming Soon
          </span>
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <div className="flex items-center gap-2">
          {logo && <div className="shrink-0">{logo}</div>}
          <div className="flex flex-col">
            <span className="text-base font-semibold text-text-primary">
              {name}
            </span>
            {activeSessions !== undefined && (
              <span className="text-xs text-text-secondary">
                {activeSessions} active sessions
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
