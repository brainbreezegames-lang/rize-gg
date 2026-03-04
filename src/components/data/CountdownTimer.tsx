import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  days: string | number;
  hours: string | number;
  minutes: string | number;
  className?: string;
}

function TimerSegment({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex-1 flex items-center justify-center gap-1 py-2 px-4 rounded-[var(--radius-md)] bg-accent-subtle border border-accent-subtle">
      <span className="text-xl font-semibold text-text-primary">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-sm text-text-primary">{label}</span>
    </div>
  );
}

export function CountdownTimer({
  days,
  hours,
  minutes,
  className,
}: CountdownTimerProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      <TimerSegment value={days} label="Days" />
      <TimerSegment value={hours} label="Hours" />
      <TimerSegment value={minutes} label="Minutes" />
    </div>
  );
}
