import { MEDIA_LIBRARY } from "@/lib/media-library";
import { cn, setImageFallback } from "@/lib/utils";

interface NewsCardProps {
  avatar?: string;
  authorName: string;
  label?: string;
  title: string;
  body: string;
  date?: string;
  image?: string;
  onReadMore?: () => void;
  className?: string;
}

export function NewsCard({
  avatar,
  authorName,
  label,
  title,
  body,
  date,
  image,
  onReadMore,
  className,
}: NewsCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-4 rounded-[var(--radius-md)] bg-bg-card border border-border-default",
        "hover:border-border-accent/30 transition-colors",
        className
      )}
    >
      {/* Author header */}
      <div className="flex items-center gap-2">
        {avatar ? (
          <img
            src={avatar}
            alt=""
            className="size-8 rounded-full object-cover shrink-0"
            onError={(event) => setImageFallback(event, MEDIA_LIBRARY.fallback.avatar)}
          />
        ) : (
          <div className="size-8 rounded-full bg-bg-surface shrink-0" />
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-text-primary">
            {authorName}
          </span>
          {label && (
            <span className="text-xs text-text-tertiary">{label}</span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-text-primary line-clamp-2">
        {title}
      </h3>

      {/* Body */}
      <p className="text-sm text-text-secondary line-clamp-3">{body}</p>

      {/* Image */}
      {image && (
        <div className="rounded-[var(--radius-sm)] overflow-hidden">
          <img
            src={image}
            alt=""
            className="w-full h-40 object-cover"
            onError={(event) => setImageFallback(event, MEDIA_LIBRARY.fallback.article)}
          />
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        {date && (
          <span className="text-xs text-text-tertiary">{date}</span>
        )}
        {onReadMore && (
          <button
            onClick={onReadMore}
            className="text-sm text-text-accent hover:underline cursor-pointer"
          >
            Read more
          </button>
        )}
      </div>
    </div>
  );
}
