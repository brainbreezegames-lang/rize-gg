import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showCount?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showCount = false,
  size = "sm",
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, (value / max) * 100);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {(label || showCount) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="text-text-accent">{label}</span>}
          {showCount && (
            <span className="text-text-secondary">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          "rounded-full bg-bg-surface overflow-hidden",
          size === "sm" ? "h-1.5" : "h-2.5"
        )}
      >
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
