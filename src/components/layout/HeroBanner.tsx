/**
 * HeroBanner — pixel-perfect from Figma node 4509:269775
 * 824x384, rounded-[8px], relative overflow-hidden
 * Left side: welcome text + headline with accent "Squad up" + game tagline + CTA
 * Right side: character art with glow effect
 * Bottom: carousel dots
 */

import { MEDIA_LIBRARY } from "@/lib/media-library";
import { cn, setImageFallback } from "@/lib/utils";
import { Button } from "@/components/buttons";
import { type ReactNode } from "react";

interface HeroBannerProps {
  userName?: string;
  headline?: ReactNode;
  tagline?: string;
  taglineIcon?: ReactNode;
  ctaLabel?: string;
  onCta?: () => void;
  backgroundImage?: string;
  characterImage?: string;
  activeDot?: number;
  totalDots?: number;
  className?: string;
  children?: ReactNode;
}

export function HeroBanner({
  userName,
  headline,
  tagline,
  taglineIcon,
  ctaLabel = "Find your team",
  onCta,
  backgroundImage,
  characterImage,
  activeDot = 0,
  totalDots = 4,
  className,
  children,
}: HeroBannerProps) {
  return (
    <div
      className={cn(
        "relative rounded-[var(--radius-md)] overflow-hidden bg-bg-card border border-border-default",
        "min-h-[384px]",
        className
      )}
    >
      {/* Background image with gradient overlay */}
      {backgroundImage && (
        <div className="absolute right-0 top-0 h-full w-[74%] rounded-tr-[7px] rounded-br-[7px]">
          <img
            src={backgroundImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            onError={(event) => setImageFallback(event, MEDIA_LIBRARY.fallback.hero)}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(-62deg, rgb(18, 20, 21) 59%, rgba(18, 20, 21, 0.7) 4%, rgb(18, 20, 21) 80%)",
            }}
          />
        </div>
      )}

      {/* Character art */}
      {characterImage && (
        <>
          <div className="absolute left-[61%] top-[19%] size-[228px] rounded-full bg-accent/10 blur-3xl" />
          <img
            src={characterImage}
            alt=""
            className="absolute right-0 top-[-42px] h-[425px] w-auto object-contain pointer-events-none"
            onError={(event) => setImageFallback(event, MEDIA_LIBRARY.fallback.hero)}
          />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-6 p-10 h-full justify-between">
        <div className="flex flex-col gap-1">
          {userName && (
            <p className="text-base font-medium text-text-secondary">
              Welcome Back, {userName}
            </p>
          )}
          {headline || (
            <h1 className="text-5xl font-bold text-white tracking-[-0.58px] max-w-[347px]">
              Up to <span className="text-accent">Squad up</span> Today ?
            </h1>
          )}
        </div>

        <div className="flex flex-col gap-[42px]">
          <div className="flex flex-col gap-[18px]">
            {tagline && (
              <div className="flex items-center gap-2">
                {taglineIcon && (
                  <span className="size-5 shrink-0">{taglineIcon}</span>
                )}
                <span className="text-base font-medium text-[#e1e7ef]">
                  {tagline}
                </span>
              </div>
            )}
            {ctaLabel && (
              <Button onClick={onCta} className="w-fit">
                {ctaLabel}
              </Button>
            )}
          </div>

          {/* Carousel dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalDots }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-full transition-all",
                  i === activeDot
                    ? "w-[38px] h-2 bg-[#c2fde9]"
                    : "size-2 bg-[#323a3e]"
                )}
              />
            ))}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
