import { cn } from "@/lib/utils";
import { Button } from "@/components/buttons";
import { type ReactNode } from "react";

interface HeroBannerProps {
  backgroundImage?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onCta?: () => void;
  overlay?: boolean;
  children?: ReactNode;
  className?: string;
}

export function HeroBanner({
  backgroundImage,
  title,
  subtitle,
  ctaLabel,
  onCta,
  overlay = true,
  children,
  className,
}: HeroBannerProps) {
  return (
    <div
      className={cn(
        "relative rounded-[var(--radius-lg)] overflow-hidden min-h-[240px] flex items-end",
        className
      )}
    >
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-bg-primary/40 to-transparent" />
      )}
      <div className="relative z-10 flex flex-col gap-3 p-6 w-full">
        <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
        {subtitle && (
          <p className="text-sm text-text-secondary max-w-md">{subtitle}</p>
        )}
        {ctaLabel && (
          <div>
            <Button onClick={onCta}>{ctaLabel}</Button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
