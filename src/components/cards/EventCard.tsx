import { cn } from "@/lib/utils";
import { Share2, Edit, List, CalendarDays, Clock, Link2 } from "lucide-react";
import { StatusPill } from "@/components/data/StatusPill";
import { type ReactNode } from "react";

type EventStatus = "live" | "registration_open" | "finished" | "playing" | "idle";

interface EventCardProps {
  title: string;
  description?: string;
  status?: EventStatus;
  statusLabel?: string;
  date?: string;
  time?: string;
  link?: string;
  attendeeCount?: number;
  onShare?: () => void;
  onEdit?: () => void;
  onViewAttendees?: () => void;
  showActions?: boolean;
  children?: ReactNode;
  className?: string;
}

export function EventCard({
  title,
  description,
  status,
  statusLabel,
  date,
  time,
  link,
  onShare,
  onEdit,
  onViewAttendees,
  showActions = true,
  children,
  className,
}: EventCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-4 rounded-[var(--radius-md)] bg-bg-card border border-border-default w-full",
        className
      )}
    >
      {/* Header: Title + Actions */}
      <div className="flex items-center gap-2 w-full">
        <h3 className="flex-1 text-lg font-semibold text-white leading-7 min-w-0 truncate">
          {title}
        </h3>
        {showActions && (
          <div className="flex items-center gap-1 shrink-0">
            {onShare && (
              <button
                onClick={onShare}
                className="flex items-center justify-center p-2 rounded-[var(--radius-sm)] bg-bg-elevated/70 border border-border-default text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <Share2 size={12} />
              </button>
            )}
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex items-center justify-center p-2 rounded-[var(--radius-sm)] bg-bg-elevated/70 border border-border-default text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <Edit size={12} />
              </button>
            )}
            {onViewAttendees && (
              <button
                onClick={onViewAttendees}
                className="flex items-center gap-2 p-2 rounded-[var(--radius-sm)] bg-bg-elevated/70 border border-border-default text-white text-xs cursor-pointer hover:bg-bg-surface-hover transition-colors"
              >
                <List size={12} />
                <span>View attendees</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-text-secondary leading-[14px]">
          {description}
        </p>
      )}

      {/* Meta row: Status | Date | Time | Link */}
      <div className="flex items-center gap-2">
        {status && (
          <StatusPill variant={status} label={statusLabel} />
        )}

        {date && (
          <>
            <Divider />
            <div className="flex items-center gap-1">
              <CalendarDays size={16} className="text-white" />
              <span className="text-sm text-white leading-[14px]">{date}</span>
            </div>
          </>
        )}

        {time && (
          <>
            <Divider />
            <div className="flex items-center gap-1">
              <Clock size={16} className="text-white" />
              <span className="text-sm text-white leading-[14px]">{time}</span>
            </div>
          </>
        )}

        {link && (
          <>
            <Divider />
            <div className="flex items-center gap-1">
              <Link2 size={16} className="text-white" />
              <span className="text-sm text-white leading-[14px]">{link}</span>
            </div>
          </>
        )}
      </div>

      {children}
    </div>
  );
}

function Divider() {
  return (
    <span className="w-px h-2 bg-border-default" />
  );
}
