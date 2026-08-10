import { cn } from "@/lib/utils";

interface ProgressBarProps {
  percent: number;
  tone?: "green" | "blue" | "orange" | "red";
  className?: string;
  trackClassName?: string;
}

const TONE_CLASSES: Record<NonNullable<ProgressBarProps["tone"]>, string> = {
  green: "bg-brand-600",
  blue: "bg-status-info",
  orange: "bg-status-booked",
  red: "bg-status-sold",
};

export function ProgressBar({ percent, tone = "green", className, trackClassName }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-muted", trackClassName)}
    >
      <div className={cn("h-full rounded-full transition-all", TONE_CLASSES[tone], className)} style={{ width: `${clamped}%` }} />
    </div>
  );
}
