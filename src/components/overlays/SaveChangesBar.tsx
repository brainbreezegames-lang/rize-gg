import { cn } from "@/lib/utils";
import { Button } from "@/components/buttons";

interface SaveChangesBarProps {
  visible?: boolean;
  onSave?: () => void;
  onDiscard?: () => void;
  saving?: boolean;
  className?: string;
}

export function SaveChangesBar({
  visible = true,
  onSave,
  onDiscard,
  saving = false,
  className,
}: SaveChangesBarProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "flex items-center justify-between px-6 py-3",
        "bg-bg-elevated border-t border-border-default",
        "shadow-[0_-4px_16px_rgba(0,0,0,0.3)]",
        "animate-in slide-in-from-bottom duration-200",
        className
      )}
    >
      <span className="text-sm text-text-secondary">
        You have unsaved changes
      </span>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onDiscard}>
          Reset changes
        </Button>
        <Button size="sm" onClick={onSave} loading={saving}>
          Save changes
        </Button>
      </div>
    </div>
  );
}
