import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "green" | "orange" | "red" | "gray" | "blue" | "purple" | "teal" | "neutral";

const TONE_CLASSES: Record<BadgeTone, string> = {
  green: "bg-status-available-bg text-status-available",
  orange: "bg-status-booked-bg text-status-booked",
  red: "bg-status-sold-bg text-status-sold",
  gray: "bg-status-reserved-bg text-status-reserved",
  blue: "bg-status-info-bg text-status-info",
  purple: "bg-status-purple-bg text-status-purple",
  teal: "bg-status-teal-bg text-status-teal",
  neutral: "bg-surface-muted text-neutral-600",
};

interface StatusBadgeProps {
  tone: BadgeTone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}

export function StatusBadge({ tone, children, dot = true, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        TONE_CLASSES[tone],
        className
      )}
    >
      {dot && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  );
}

const PLOT_STATUS_TONE: Record<string, BadgeTone> = {
  available: "green",
  booked: "orange",
  sold: "red",
  reserved: "gray",
};
export function plotStatusTone(status: string): BadgeTone {
  return PLOT_STATUS_TONE[status] ?? "neutral";
}

const DOC_STATUS_TONE: Record<string, BadgeTone> = {
  Verified: "green",
  Pending: "orange",
  Rejected: "red",
  "Resubmission Required": "purple",
};
export function docStatusTone(status: string): BadgeTone {
  return DOC_STATUS_TONE[status] ?? "neutral";
}

const PAYMENT_STATUS_TONE: Record<string, BadgeTone> = {
  Paid: "green",
  Pending: "orange",
  Overdue: "red",
  Failed: "red",
  "Partially Paid": "orange",
  Upcoming: "blue",
};
export function paymentStatusTone(status: string): BadgeTone {
  return PAYMENT_STATUS_TONE[status] ?? "neutral";
}

const TICKET_STATUS_TONE: Record<string, BadgeTone> = {
  Open: "blue",
  "In Progress": "orange",
  Resolved: "green",
  "On Hold": "gray",
  Closed: "neutral",
};
export function ticketStatusTone(status: string): BadgeTone {
  return TICKET_STATUS_TONE[status] ?? "neutral";
}

const PRIORITY_TONE: Record<string, BadgeTone> = {
  Low: "gray",
  Medium: "orange",
  High: "red",
};
export function priorityTone(priority: string): BadgeTone {
  return PRIORITY_TONE[priority] ?? "neutral";
}
