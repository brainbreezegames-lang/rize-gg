import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

interface SocialAuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  provider: string;
}

export function SocialAuthButton({
  icon,
  provider,
  className,
  ...props
}: SocialAuthButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-3 w-full h-12 px-4",
        "bg-bg-surface border border-border-default rounded-[var(--radius-md)]",
        "text-text-primary text-sm font-medium",
        "hover:bg-bg-surface-hover transition-colors cursor-pointer",
        className
      )}
      {...props}
    >
      <span className="size-5 flex items-center justify-center">{icon}</span>
      <span>Continue with {provider}</span>
    </button>
  );
}
