import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm text-text-secondary"
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            "flex items-center gap-2 h-10 px-3 rounded-[var(--radius-md)]",
            "bg-bg-input border transition-colors",
            error
              ? "border-destructive"
              : "border-border-default focus-within:border-accent",
            className
          )}
        >
          {leftIcon && (
            <span className="text-text-tertiary shrink-0">{leftIcon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className="flex-1 bg-transparent text-text-primary text-sm placeholder:text-text-tertiary outline-none min-w-0"
            {...props}
          />
          {rightIcon && (
            <span className="text-text-tertiary shrink-0">{rightIcon}</span>
          )}
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        {hint && !error && (
          <p className="text-xs text-text-tertiary">{hint}</p>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
export { TextInput };
