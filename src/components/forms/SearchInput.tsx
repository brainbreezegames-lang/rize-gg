import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { forwardRef, type InputHTMLAttributes } from "react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, value, className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex items-center gap-2 h-10 px-3 rounded-[var(--radius-md)]",
          "bg-bg-input border border-border-default focus-within:border-accent transition-colors",
          className
        )}
      >
        <Search size={16} className="text-text-tertiary shrink-0" />
        <input
          ref={ref}
          type="search"
          value={value}
          className="flex-1 bg-transparent text-text-primary text-sm placeholder:text-text-tertiary outline-none min-w-0 [&::-webkit-search-cancel-button]:hidden"
          {...props}
        />
        {value && onClear && (
          <button
            onClick={onClear}
            className="text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
export { SearchInput };
