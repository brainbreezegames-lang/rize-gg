import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface StatCardProps {
  title: string;
  icon?: ReactNode;
  value: string | number;
  unit?: string;
  cta?: ReactNode;
  className?: string;
}

export function StatCard({
  title,
  icon,
  value,
  unit,
  cta,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-4 rounded-[var(--radius-md)] bg-bg-card border border-border-default",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary">{title}</span>
        {icon && <span className="text-text-tertiary">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-semibold text-text-primary">
          {value}
        </span>
        {unit && (
          <span className="text-sm text-text-secondary">{unit}</span>
        )}
      </div>
      {cta}
    </div>
  );
}
