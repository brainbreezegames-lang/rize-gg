import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  timestamp?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  timestamp,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-text-primary tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-text-secondary">{subtitle}</p>
        )}
        {timestamp && (
          <p className="text-xs text-text-tertiary">{timestamp}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
