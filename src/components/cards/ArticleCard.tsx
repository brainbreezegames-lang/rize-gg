import { cn } from "@/lib/utils";

interface ArticleCardProps {
  image?: string;
  badge?: string;
  title: string;
  description?: string;
  date?: string;
  className?: string;
}

export function ArticleCard({
  image,
  badge,
  title,
  description,
  date,
  className,
}: ArticleCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-[var(--radius-md)] bg-bg-card overflow-hidden cursor-pointer hover:brightness-105 transition-all",
        className
      )}
    >
      {image && (
        <div className="relative h-40">
          <img src={image} alt="" className="w-full h-full object-cover" />
          {badge && (
            <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs font-medium">
              {badge}
            </span>
          )}
        </div>
      )}
      <div className="flex flex-col gap-2 p-4">
        <h3 className="text-base font-semibold text-text-primary line-clamp-2">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-text-secondary line-clamp-2">
            {description}
          </p>
        )}
        {date && <span className="text-xs text-text-tertiary">{date}</span>}
      </div>
    </div>
  );
}
