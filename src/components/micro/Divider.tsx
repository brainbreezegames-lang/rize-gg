import { cn } from "@/lib/utils";

interface DividerProps {
  label?: string;
  className?: string;
}

export function Divider({ label, className }: DividerProps) {
  if (label) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className="flex-1 h-px bg-border-default" />
        <span className="text-xs text-text-tertiary">{label}</span>
        <div className="flex-1 h-px bg-border-default" />
      </div>
    );
  }
  return <div className={cn("h-px bg-border-default", className)} />;
}
