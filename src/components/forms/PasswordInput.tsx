"use client";

import { cn } from "@/lib/utils";
import { Eye, EyeOff, Lock } from "lucide-react";
import { forwardRef, useState, type InputHTMLAttributes } from "react";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const inputId = id || "password";

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm text-text-secondary">
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
          <Lock size={16} className="text-text-tertiary shrink-0" />
          <input
            ref={ref}
            id={inputId}
            type={visible ? "text" : "password"}
            className="flex-1 bg-transparent text-text-primary text-sm placeholder:text-text-tertiary outline-none min-w-0"
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
export { PasswordInput };
