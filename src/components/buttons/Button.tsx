import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "destructive" | "ghost" | "discord";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-foreground hover:bg-accent-hover active:brightness-90",
  secondary:
    "bg-bg-surface text-text-primary border border-border-default hover:bg-bg-surface-hover",
  outline:
    "bg-transparent text-text-primary border border-border-default hover:bg-bg-surface-hover",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive-hover",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover",
  discord:
    "bg-discord text-white hover:brightness-110",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm gap-1.5 rounded-[var(--radius-sm)]",
  md: "h-10 px-4 text-sm gap-2 rounded-[var(--radius-sm)]",
  lg: "h-12 px-6 text-base gap-2.5 rounded-[var(--radius-md)]",
  icon: "size-10 rounded-[var(--radius-sm)] justify-center",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      leftIcon,
      rightIcon,
      loading,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium whitespace-nowrap transition-all duration-150 cursor-pointer select-none",
          "disabled:opacity-50 disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin size-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        {size !== "icon" && children}
        {rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize };
