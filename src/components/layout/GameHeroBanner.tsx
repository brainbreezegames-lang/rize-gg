import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface GameHeroBannerProps {
  backgroundImage?: string;
  gameLogo?: ReactNode;
  gameName: string;
  badges?: ReactNode[];
  className?: string;
}

export function GameHeroBanner({
  backgroundImage,
  gameLogo,
  gameName,
  badges,
  className,
}: GameHeroBannerProps) {
  return (
    <div
      className={cn(
        "relative rounded-[var(--radius-md)] overflow-hidden h-[240px] flex items-center justify-center",
        className
      )}
    >
      {/* Background image */}
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(137deg, rgb(18, 20, 21) 9%, rgba(18, 20, 21, 0.4) 92%)",
        }}
      />

      {/* Badges top-right */}
      {badges && badges.length > 0 && (
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          {badges}
        </div>
      )}

      {/* Game logo + name centered */}
      <div className="relative z-10 flex items-center gap-3">
        {gameLogo && <div className="shrink-0">{gameLogo}</div>}
        <span className="text-5xl font-bold text-text-primary tracking-tight">
          {gameName}
        </span>
      </div>
    </div>
  );
}
