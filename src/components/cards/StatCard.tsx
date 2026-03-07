/**
 * StatCard — pixel-perfect from Figma node 4509:269900
 * 300x112, gradient bg + border, p-5, gap-3, rounded-[8px]
 */

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface StatCardProps {
  title: string;
  icon?: ReactNode;
  value: string | number;
  subtitle?: string;
  color?: "teal" | "purple";
  className?: string;
}

export function StatCard({
  title,
  icon,
  value,
  subtitle,
  color = "teal",
  className,
}: StatCardProps) {
  const isPurple = color === "purple";
  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-5 rounded-[var(--radius-md)]",
        isPurple
          ? "bg-gradient-to-b from-[rgba(139,127,212,0.06)] to-[rgba(139,127,212,0.12)] border border-[rgba(139,127,212,0.25)]"
          : "bg-gradient-to-b from-[rgba(215,254,237,0.02)] to-[rgba(215,254,237,0.08)] border border-[#d7feed]/20",
        className
      )}
    >
      <div className="flex items-center justify-between w-full">
        <span className={cn("text-base font-medium", isPurple ? "text-[#b0a4e8]" : "text-[#d7feed]")}>{title}</span>
        {icon && (
          <span className={cn("size-6 flex items-center justify-center", isPurple ? "text-[#b0a4e8]" : "text-[#d7feed]")}>
            {icon}
          </span>
        )}
      </div>
      <div className="flex items-end gap-1.5">
        <span className="text-[32px] font-semibold leading-9 tracking-[-0.24px] text-[#e1e7ef]">
          {value}
        </span>
        {subtitle && (
          <span className="text-sm font-light leading-5 text-text-secondary pb-0.5">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
