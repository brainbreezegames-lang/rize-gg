import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex items-center gap-1.5 text-sm", className)}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={14} className="text-text-tertiary" />}
          {item.href && i < items.length - 1 ? (
            <a
              href={item.href}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <span
              className={cn(
                i === items.length - 1
                  ? "text-text-primary"
                  : "text-text-secondary"
              )}
            >
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
