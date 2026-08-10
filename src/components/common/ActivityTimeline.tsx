import type { LucideIcon } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { StatusBadge, type BadgeTone } from "./StatusBadge";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  icon?: LucideIcon;
  badge?: { label: string; tone: BadgeTone };
  tone?: "default" | "active" | "muted";
}

interface ActivityTimelineProps {
  events: TimelineEvent[];
  emptyLabel?: string;
}

export function ActivityTimeline({ events, emptyLabel = "No activity yet" }: ActivityTimelineProps) {
  if (events.length === 0) {
    return <EmptyState title={emptyLabel} className="py-8" />;
  }

  return (
    <ol className="relative flex flex-col gap-5 border-l border-border pl-5">
      {events.map((e) => (
        <li key={e.id} className="relative">
          <span
            className={cn(
              "absolute -left-[27px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-surface",
              e.tone === "active" ? "border-status-booked" : e.tone === "muted" ? "border-border-strong" : "border-brand-600"
            )}
          />
          <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-neutral-800">
            {e.icon && <e.icon size={13} className="text-brand-600" />}
            {e.title}
            {e.badge && (
              <StatusBadge tone={e.badge.tone} dot={false}>
                {e.badge.label}
              </StatusBadge>
            )}
          </p>
          {e.description && <p className="mt-0.5 text-xs text-neutral-500">{e.description}</p>}
          <p className="mt-0.5 text-xs text-neutral-400">{formatDateTime(e.date)}</p>
        </li>
      ))}
    </ol>
  );
}
