import { cn } from "@/lib/utils";

type StatusVariant =
  | "registration_open"
  | "live"
  | "finished"
  | "playing"
  | "idle"
  | "recruiting"
  | "online"
  | "offline";

interface StatusPillProps {
  variant: StatusVariant;
  label?: string;
  className?: string;
}

const variantConfig: Record<StatusVariant, { bg: string; text: string; defaultLabel: string }> = {
  registration_open: { bg: "bg-status-success", text: "text-white", defaultLabel: "Registration open" },
  live: { bg: "bg-status-error", text: "text-white", defaultLabel: "Live" },
  finished: { bg: "bg-bg-surface", text: "text-text-secondary", defaultLabel: "Finished" },
  playing: { bg: "bg-status-success", text: "text-white", defaultLabel: "Playing" },
  idle: { bg: "bg-status-warning", text: "text-bg-primary", defaultLabel: "Idle" },
  recruiting: { bg: "bg-status-success", text: "text-white", defaultLabel: "Recruiting" },
  online: { bg: "bg-status-online", text: "text-white", defaultLabel: "Online" },
  offline: { bg: "bg-status-offline", text: "text-white", defaultLabel: "Offline" },
};

export function StatusPill({ variant, label, className }: StatusPillProps) {
  const config = variantConfig[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-normal",
        config.bg,
        config.text,
        className
      )}
    >
      {label || config.defaultLabel}
    </span>
  );
}
