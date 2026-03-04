import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface GameStatCardProps {
  title: string;
  icon?: ReactNode;
  value: string | number;
  subtitle?: string;
  ctaLabel?: string;
  onCta?: () => void;
  variant?: "accent" | "default";
  className?: string;
}

export function GameStatCard({
  title,
  icon,
  value,
  subtitle,
  ctaLabel,
  onCta,
  variant = "default",
  className,
}: GameStatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-5 rounded-[var(--radius-md)]",
        variant === "accent"
          ? "bg-gradient-to-b from-accent-subtle to-accent-muted border border-accent"
          : "bg-bg-card border border-border-default",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "text-base font-medium",
            variant === "accent" ? "text-text-accent" : "text-text-secondary"
          )}
        >
          {title}
        </span>
        {icon && (
          <span
            className={cn(
              variant === "accent" ? "text-text-accent" : "text-text-tertiary"
            )}
          >
            {icon}
          </span>
        )}
      </div>

      {/* Value */}
      <div className="flex items-end gap-1.5">
        <span
          className={cn(
            "text-[32px] font-semibold leading-9 tracking-tight",
            variant === "accent" ? "text-text-primary" : "text-text-primary"
          )}
        >
          {value}
        </span>
        {subtitle && (
          <span className="text-sm font-light text-text-secondary pb-1">
            {subtitle}
          </span>
        )}
      </div>

      {/* CTA */}
      {ctaLabel && (
        <button
          onClick={onCta}
          className={cn(
            "flex items-center justify-center px-4 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors cursor-pointer w-full",
            variant === "accent"
              ? "bg-accent text-accent-foreground hover:bg-accent-hover"
              : "border border-border-default text-text-primary hover:bg-bg-surface-hover"
          )}
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
