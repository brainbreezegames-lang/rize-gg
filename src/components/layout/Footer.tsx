import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface FooterProps {
  logo?: ReactNode;
  tagline?: string;
  ctaLabel?: string;
  onCta?: () => void;
  socialLinks?: ReactNode;
  className?: string;
}

export function Footer({
  logo,
  tagline = "Stay Connected. Keep Climbing.",
  ctaLabel = "Join Us",
  onCta,
  socialLinks,
  className,
}: FooterProps) {
  return (
    <footer
      className={cn(
        "flex flex-col items-center gap-8 py-10 px-6",
        "border-t border-border-default",
        className
      )}
    >
      {/* CTA section */}
      <div className="flex flex-col items-center gap-4 text-center max-w-md">
        {tagline && (
          <p className="text-lg font-semibold text-text-primary">{tagline}</p>
        )}
        {ctaLabel && (
          <button
            onClick={onCta}
            className="px-6 py-2.5 rounded-[var(--radius-sm)] bg-accent text-accent-foreground text-sm font-medium hover:bg-accent-hover transition-colors cursor-pointer"
          >
            {ctaLabel}
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-border-subtle" />

      {/* Bottom bar */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {logo}
          <span className="text-sm text-text-secondary">
            &copy; {new Date().getFullYear()} All rights reserved
          </span>
        </div>
        {socialLinks && (
          <div className="flex items-center gap-2">{socialLinks}</div>
        )}
      </div>
    </footer>
  );
}
