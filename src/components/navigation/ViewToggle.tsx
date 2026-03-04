import { cn } from "@/lib/utils";
import { List, LayoutGrid } from "lucide-react";

type ViewMode = "table" | "grid";

interface ViewToggleProps {
  activeView: ViewMode;
  onViewChange?: (view: ViewMode) => void;
  className?: string;
}

export function ViewToggle({
  activeView,
  onViewChange,
  className,
}: ViewToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-[var(--radius-sm)] overflow-hidden",
        className
      )}
    >
      <button
        onClick={() => onViewChange?.("table")}
        className={cn(
          "flex items-center justify-center size-10 transition-colors cursor-pointer",
          activeView === "table"
            ? "bg-bg-surface text-text-primary border border-border-default"
            : "bg-bg-input text-text-tertiary border border-border-subtle hover:text-text-secondary"
        )}
      >
        <List size={20} />
      </button>
      <button
        onClick={() => onViewChange?.("grid")}
        className={cn(
          "flex items-center justify-center size-10 transition-colors cursor-pointer",
          activeView === "grid"
            ? "bg-bg-surface text-text-primary border border-border-default"
            : "bg-bg-input text-text-tertiary border border-border-subtle hover:text-text-secondary"
        )}
      >
        <LayoutGrid size={20} />
      </button>
    </div>
  );
}
