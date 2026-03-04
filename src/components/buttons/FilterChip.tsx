import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

interface FilterChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: ReactNode;
}

export function FilterChip({
  active = false,
  icon,
  children,
  className,
  ...props
}: FilterChipProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 px-4 h-9 rounded-full text-sm font-normal",
        "border transition-all cursor-pointer whitespace-nowrap",
        active
          ? "bg-accent-muted border-accent text-accent"
          : "bg-transparent border-border-default text-text-secondary hover:text-text-primary hover:border-text-secondary",
        className
      )}
      {...props}
    >
      {icon && <span className="size-4 flex items-center justify-center">{icon}</span>}
      {children}
      {active && (
        <svg className="size-3.5" viewBox="0 0 14 14" fill="none">
          <path
            d="M11.667 3.5L5.25 9.917 2.333 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
