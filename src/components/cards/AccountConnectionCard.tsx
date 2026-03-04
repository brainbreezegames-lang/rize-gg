import { cn } from "@/lib/utils";
import { Check, Link2, ExternalLink } from "lucide-react";
import { type ReactNode } from "react";

interface AccountConnectionCardProps {
  icon?: ReactNode;
  platform: string;
  description?: string;
  connected?: boolean;
  username?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  className?: string;
}

export function AccountConnectionCard({
  icon,
  platform,
  description,
  connected = false,
  username,
  onConnect,
  onDisconnect,
  className,
}: AccountConnectionCardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 rounded-[var(--radius-md)] bg-bg-card border",
        connected ? "border-accent/30" : "border-border-default",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex items-center justify-center size-10 rounded-[var(--radius-sm)] bg-bg-surface shrink-0">
            {icon}
          </div>
        )}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary">
              {platform}
            </span>
            {connected && (
              <span className="inline-flex items-center gap-1 text-xs text-text-accent">
                <Check size={12} />
                Connected
              </span>
            )}
          </div>
          {connected && username ? (
            <span className="text-xs text-text-secondary">{username}</span>
          ) : (
            description && (
              <span className="text-xs text-text-tertiary">{description}</span>
            )
          )}
        </div>
      </div>

      {connected ? (
        <button
          onClick={onDisconnect}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium text-destructive-foreground bg-destructive hover:brightness-110 transition-colors cursor-pointer"
        >
          Disconnect
        </button>
      ) : (
        <button
          onClick={onConnect}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium text-text-primary border border-border-default hover:bg-bg-surface-hover transition-colors cursor-pointer"
        >
          <Link2 size={12} />
          Connect
          <ExternalLink size={12} />
        </button>
      )}
    </div>
  );
}
