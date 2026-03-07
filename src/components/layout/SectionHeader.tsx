"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  action?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function SectionHeader({
  title,
  action,
  actionLabel = "Browse all",
  onAction,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      {action ??
        (onAction && (
          <button
            onClick={onAction}
            className="text-sm text-text-accent hover:underline cursor-pointer"
          >
            {actionLabel}
          </button>
        ))}
    </div>
  );
}
