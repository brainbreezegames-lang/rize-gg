import { MEDIA_LIBRARY } from "@/lib/media-library";
import { cn, setImageFallback } from "@/lib/utils";
import { type ReactNode } from "react";

interface FederationHeroProps {
  backgroundImage?: string;
  federationName: string;
  tagline?: string;
  actions?: ReactNode;
  className?: string;
}

export function FederationHero({
  backgroundImage,
  federationName,
  tagline,
  actions,
  className,
}: FederationHeroProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden min-h-[320px] flex flex-col items-center justify-center text-center px-6",
        className
      )}
    >
      {/* Background */}
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          onError={(event) => setImageFallback(event, MEDIA_LIBRARY.fallback.federation)}
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/60 to-bg-primary" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-text-primary tracking-tight">
          {federationName}
        </h1>
        {tagline && (
          <p className="text-base text-text-secondary max-w-md">
            {tagline}
          </p>
        )}
        {actions && (
          <div className="flex items-center gap-3 mt-2">{actions}</div>
        )}
      </div>
    </div>
  );
}

interface QuickFactsProps {
  facts: { label: string; value: string | number }[];
  contactInfo?: { label: string; value: string }[];
  className?: string;
}

export function QuickFacts({ facts, contactInfo, className }: QuickFactsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-5 rounded-[var(--radius-md)] bg-bg-card border border-border-default",
        className
      )}
    >
      <h3 className="text-base font-semibold text-text-primary">
        Quick facts
      </h3>
      <div className="flex flex-col gap-3">
        {facts.map((fact, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">{fact.label}</span>
            <span className="text-sm font-medium text-text-primary">
              {fact.value}
            </span>
          </div>
        ))}
      </div>
      {contactInfo && contactInfo.length > 0 && (
        <>
          <div className="w-full h-px bg-border-subtle" />
          <h4 className="text-sm font-semibold text-text-primary">
            Contact Information
          </h4>
          <div className="flex flex-col gap-2">
            {contactInfo.map((info, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-xs text-text-tertiary">{info.label}</span>
                <span className="text-sm text-text-accent break-all">
                  {info.value}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
