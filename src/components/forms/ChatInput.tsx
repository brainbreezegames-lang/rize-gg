import { cn } from "@/lib/utils";
import { Plus, Smile, Sticker } from "lucide-react";
import { forwardRef, type InputHTMLAttributes } from "react";

interface ChatInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onAttach?: () => void;
  onEmoji?: () => void;
  onSticker?: () => void;
}

const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  ({ onAttach, onEmoji, onSticker, className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex items-center gap-2 h-12 px-3 rounded-[var(--radius-md)]",
          "bg-bg-input border border-border-default",
          className
        )}
      >
        {onAttach && (
          <button
            type="button"
            onClick={onAttach}
            className="size-8 flex items-center justify-center rounded-full bg-bg-surface text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
          >
            <Plus size={16} />
          </button>
        )}
        <input
          ref={ref}
          className="flex-1 bg-transparent text-text-primary text-sm placeholder:text-text-tertiary outline-none min-w-0"
          placeholder="Type a message..."
          {...props}
        />
        <div className="flex items-center gap-1">
          {onEmoji && (
            <button
              type="button"
              onClick={onEmoji}
              className="text-text-tertiary hover:text-text-primary transition-colors cursor-pointer p-1"
            >
              <Smile size={18} />
            </button>
          )}
          {onSticker && (
            <button
              type="button"
              onClick={onSticker}
              className="text-text-tertiary hover:text-text-primary transition-colors cursor-pointer p-1"
            >
              <Sticker size={18} />
            </button>
          )}
        </div>
      </div>
    );
  }
);

ChatInput.displayName = "ChatInput";
export { ChatInput };
