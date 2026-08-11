import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Info, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AreaSparkline } from "@/components/charts/AreaSparkline";

interface MetricCardProps {
  label: string;
  value: string;
  icon?: LucideIcon;
  iconTone?: "green" | "blue" | "orange" | "red" | "purple" | "teal" | "gray";
  sublabel?: ReactNode;
  trend?: { value: number; label?: string };
  sparkline?: number[];
  sparklineTone?: "green" | "blue" | "orange" | "red" | "purple";
  progressPercent?: number;
  onClick?: () => void;
  info?: string;
  className?: string;
}

const ICON_TONE: Record<NonNullable<MetricCardProps["iconTone"]>, string> = {
  green: "bg-status-available-bg text-status-available",
  blue: "bg-status-info-bg text-status-info",
  orange: "bg-status-booked-bg text-status-booked",
  red: "bg-status-sold-bg text-status-sold",
  purple: "bg-status-purple-bg text-status-purple",
  teal: "bg-status-teal-bg text-status-teal",
  gray: "bg-status-reserved-bg text-status-reserved",
};

export function MetricCard({
  label,
  value,
  icon: Icon,
  iconTone = "green",
  sublabel,
  trend,
  sparkline,
  sparklineTone = "green",
  progressPercent,
  onClick,
  info,
  className,
}: MetricCardProps) {
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      onClick={onClick}
      type={onClick ? "button" : undefined}
      className={cn(
        "flex w-full flex-col gap-1 rounded-xl border border-border bg-surface p-2.5 text-left shadow-card transition-shadow",
        onClick && "cursor-pointer hover:shadow-popover focus-visible:outline-brand-500",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        {Icon && (
          <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-lg", ICON_TONE[iconTone])}>
            <Icon size={14} aria-hidden="true" />
          </span>
        )}
        <span className="min-w-0 text-xs leading-tight text-neutral-500">{label}</span>
        {info && (
          <span title={info} aria-label={`${label}: ${info}`} className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:bg-surface-muted hover:text-neutral-700" onClick={(event) => event.stopPropagation()}>
            <Info size={12} aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="min-w-0">
        <span className="block truncate text-xl font-bold leading-none tracking-tight whitespace-nowrap text-neutral-900">{value}</span>
      </div>
      {sublabel && <p className="min-w-0 truncate text-[11px] leading-tight text-neutral-500">{sublabel}</p>}
      {sparkline && sparkline.length > 1 && (
        <div className="h-5 w-full">
          <AreaSparkline data={sparkline} tone={sparklineTone} />
        </div>
      )}
      {trend && (
        <p className={cn("flex items-center gap-1 text-xs font-medium", trend.value >= 0 ? "text-status-available" : "text-status-sold")}>
          {trend.value >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {Math.abs(trend.value)}% {trend.label ?? "vs last month"}
        </p>
      )}
      {typeof progressPercent === "number" && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full rounded-full bg-brand-600"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
      )}
    </Wrapper>
  );
}
