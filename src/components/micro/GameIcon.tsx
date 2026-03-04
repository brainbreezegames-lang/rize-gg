import { cn } from "@/lib/utils";

interface GameIconProps {
  src?: string;
  alt?: string;
  bgColor?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "size-6",
  md: "size-8",
  lg: "size-10",
};

const imgSizeMap = {
  sm: "size-[18px]",
  md: "size-[22px]",
  lg: "size-[28px]",
};

export function GameIcon({
  src,
  alt = "",
  bgColor = "bg-bg-surface",
  size = "md",
  className,
}: GameIconProps) {
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center shrink-0 overflow-hidden",
        sizeMap[size],
        bgColor,
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className={cn("object-cover", imgSizeMap[size])}
        />
      ) : (
        <div className={cn("rounded-full bg-bg-surface-hover", imgSizeMap[size])} />
      )}
    </div>
  );
}

interface GameIconGroupProps {
  games: { src?: string; alt?: string; bgColor?: string }[];
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function GameIconGroup({
  games,
  max = 5,
  size = "sm",
  className,
}: GameIconGroupProps) {
  const visible = games.slice(0, max);
  const overflow = games.length - max;

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {visible.map((game, i) => (
        <GameIcon key={i} {...game} size={size} />
      ))}
      {overflow > 0 && (
        <span className="text-xs text-text-accent font-normal ml-1">
          +{overflow}
        </span>
      )}
    </div>
  );
}
