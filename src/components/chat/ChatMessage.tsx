import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface ChatMessageProps {
  avatar?: string;
  username: string;
  roleBadge?: string;
  timestamp?: string;
  message: string;
  replyTo?: { username: string; text: string };
  reactions?: ReactNode;
  className?: string;
}

export function ChatMessage({
  avatar,
  username,
  roleBadge,
  timestamp,
  message,
  replyTo,
  reactions,
  className,
}: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex gap-4 p-1.5 rounded-[var(--radius-sm)] group hover:bg-bg-surface-hover/50 transition-colors",
        className
      )}
    >
      {avatar ? (
        <img
          src={avatar}
          alt=""
          className="size-[58px] rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="size-[58px] rounded-full bg-bg-surface shrink-0" />
      )}
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-lg font-semibold text-white leading-7 whitespace-nowrap">
              {username}
            </span>
            {roleBadge && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-accent-muted text-accent">
                {roleBadge}
              </span>
            )}
          </div>
          {timestamp && (
            <span className="text-xs text-text-secondary leading-normal">
              {timestamp}
            </span>
          )}
        </div>
        {replyTo && (
          <div className="flex items-center gap-1.5 text-xs text-text-tertiary border-l-2 border-border-default pl-2 mb-0.5">
            <span className="font-medium">{replyTo.username}</span>
            <span className="truncate">{replyTo.text}</span>
          </div>
        )}
        <div className="flex items-center gap-1 w-full">
          <p className="text-base text-white leading-7 break-words flex-1">
            {message}
          </p>
        </div>
        {reactions}
      </div>
    </div>
  );
}
