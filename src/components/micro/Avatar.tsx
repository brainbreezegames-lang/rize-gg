import { cn } from "@/lib/utils";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  online?: boolean;
  className?: string;
}

const sizeMap: Record<AvatarSize, string> = {
  xs: "size-6",
  sm: "size-8",
  md: "size-10",
  lg: "size-[58px]",
  xl: "size-20",
  "2xl": "size-[120px]",
};

const indicatorSizeMap: Record<AvatarSize, string> = {
  xs: "size-1.5 border",
  sm: "size-2 border",
  md: "size-2.5 border-2",
  lg: "size-3 border-2",
  xl: "size-3.5 border-2",
  "2xl": "size-4 border-2",
};

export function Avatar({
  src,
  alt = "",
  size = "md",
  online,
  className,
}: AvatarProps) {
  return (
    <div className={cn("relative shrink-0", sizeMap[size], className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-bg-surface flex items-center justify-center text-text-tertiary">
          <svg viewBox="0 0 24 24" className="w-1/2 h-1/2" fill="currentColor">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>
      )}
      {online !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-bg-primary",
            indicatorSizeMap[size],
            online ? "bg-status-online" : "bg-status-offline"
          )}
        />
      )}
    </div>
  );
}

interface AvatarGroupProps {
  avatars: { src?: string; alt?: string }[];
  max?: number;
  size?: AvatarSize;
  className?: string;
}

export function AvatarGroup({
  avatars,
  max = 4,
  size = "sm",
  className,
}: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - max;

  return (
    <div className={cn("flex items-center -space-x-2", className)}>
      {visible.map((a, i) => (
        <Avatar
          key={i}
          src={a.src}
          alt={a.alt}
          size={size}
          className="ring-2 ring-bg-primary"
        />
      ))}
      {overflow > 0 && (
        <div
          className={cn(
            "rounded-full bg-bg-surface ring-2 ring-bg-primary flex items-center justify-center text-xs text-text-secondary font-medium",
            sizeMap[size]
          )}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
