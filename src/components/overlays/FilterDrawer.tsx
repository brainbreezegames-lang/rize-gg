"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { Button } from "@/components/buttons";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  onApply?: () => void;
  onReset?: () => void;
  className?: string;
}

export function FilterDrawer({
  open,
  onClose,
  title = "Filters",
  children,
  onApply,
  onReset,
  className,
}: FilterDrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "relative w-full max-w-sm bg-bg-elevated border-l border-border-default",
          "flex flex-col h-full",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-default">
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-[var(--radius-sm)] text-text-tertiary hover:text-text-primary hover:bg-bg-surface-hover transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>

        {/* Footer */}
        <div className="flex items-center gap-2 px-6 py-4 border-t border-border-default">
          {onReset && (
            <Button variant="ghost" className="flex-1" onClick={onReset}>
              Reset
            </Button>
          )}
          {onApply && (
            <Button className="flex-1" onClick={onApply}>
              Apply filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
