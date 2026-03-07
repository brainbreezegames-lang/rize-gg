import { MEDIA_LIBRARY } from "@/lib/media-library";
import { cn, setImageFallback } from "@/lib/utils";

interface ChatListItemProps {
  avatar?: string;
  name: string;
  status?: string;
  unreadCount?: number;
  memberCount?: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ChatListItem({
  avatar,
  name,
  status,
  unreadCount,
  memberCount,
  active = false,
  onClick,
  className,
}: ChatListItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2.5 rounded-[var(--radius-md)] transition-colors text-left cursor-pointer",
        active ? "bg-bg-surface" : "hover:bg-bg-surface-hover",
        className
      )}
    >
      <div className="relative shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt=""
            className="size-10 rounded-full object-cover"
            onError={(event) => setImageFallback(event, MEDIA_LIBRARY.fallback.avatar)}
          />
        ) : (
          <div className="size-10 rounded-full bg-bg-surface" />
        )}
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-sm font-medium text-text-primary truncate">
          {name}
        </span>
        {status && (
          <span className="text-xs text-text-tertiary truncate">{status}</span>
        )}
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        {unreadCount !== undefined && unreadCount > 0 && (
          <span className="size-5 flex items-center justify-center rounded-full bg-accent text-accent-foreground text-[10px] font-bold">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
        {memberCount !== undefined && (
          <span className="text-[10px] text-text-tertiary">
            {memberCount} members
          </span>
        )}
      </div>
    </button>
  );
}
