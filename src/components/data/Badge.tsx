import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

type BadgeVariant = "default" | "accent" | "gold" | "silver" | "bronze" | "diamond";

interface BadgeProps {
  variant?: BadgeVariant;
  icon?: ReactNode;
  label?: string;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "border-border-default text-text-secondary",
  accent: "border-accent text-accent bg-accent-subtle",
  gold: "border-rank-gold text-rank-gold bg-rank-gold/10",
  silver: "border-rank-silver text-rank-silver bg-rank-silver/10",
  bronze: "border-rank-bronze text-rank-bronze bg-rank-bronze/10",
  diamond: "border-rank-diamond text-rank-diamond bg-rank-diamond/10",
};

export function Badge({ variant = "default", icon, label, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {icon}
      {label}
    </span>
  );
}
