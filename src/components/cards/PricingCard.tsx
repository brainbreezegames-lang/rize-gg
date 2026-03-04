import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Button } from "@/components/buttons";
import { type ReactNode } from "react";

interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  features: string[];
  ctaLabel?: string;
  onCta?: () => void;
  highlighted?: boolean;
  badge?: ReactNode;
  backgroundImage?: string;
  className?: string;
}

export function PricingCard({
  title,
  price,
  period = "/month",
  features,
  ctaLabel = "Subscribe",
  onCta,
  highlighted = false,
  badge,
  backgroundImage,
  className,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-[var(--radius-lg)] overflow-hidden",
        highlighted
          ? "border border-accent"
          : "border border-border-default",
        className
      )}
    >
      {/* Background image */}
      {backgroundImage && (
        <div className="relative h-[120px] overflow-hidden">
          <img
            src={backgroundImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-card" />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col gap-4 p-5 bg-bg-card">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-text-secondary">
            {title}
          </span>
          {badge}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-text-primary">{price}</span>
          <span className="text-sm text-text-tertiary">{period}</span>
        </div>

        {/* Features */}
        <ul className="flex flex-col gap-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2">
              <Check
                size={16}
                className="text-text-accent shrink-0 mt-0.5"
              />
              <span className="text-sm text-text-secondary">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Button onClick={onCta} className="w-full">
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}
