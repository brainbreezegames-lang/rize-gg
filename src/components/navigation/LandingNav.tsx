import { cn } from "@/lib/utils";
import { Button } from "@/components/buttons";
import { type ReactNode } from "react";

interface NavLink {
  label: string;
  href: string;
}

interface LandingNavProps {
  logo?: ReactNode;
  links?: NavLink[];
  className?: string;
}

const defaultLinks: NavLink[] = [
  { label: "Find a Team", href: "#" },
  { label: "Tournaments", href: "#" },
  { label: "Rize LFG", href: "#" },
  { label: "Scrims", href: "#" },
  { label: "Explore Games", href: "#" },
  { label: "Top Players", href: "#" },
];

export function LandingNav({
  logo,
  links = defaultLinks,
  className,
}: LandingNavProps) {
  return (
    <nav
      className={cn(
        "flex items-center justify-between h-16 px-6 bg-bg-primary/80 backdrop-blur-md border-b border-border-subtle",
        className
      )}
    >
      <div className="flex items-center">
        {logo ?? (
          <span className="text-accent font-bold text-xl">rize.gg</span>
        )}
      </div>
      <div className="hidden md:flex items-center gap-6">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm">
          Log in
        </Button>
        <Button size="sm">Sign Up</Button>
      </div>
    </nav>
  );
}
