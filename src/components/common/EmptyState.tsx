import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 px-6 py-12 text-center", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-neutral-400">
        {icon ?? <Inbox size={22} aria-hidden="true" />}
      </div>
      <div>
        <p className="text-sm font-semibold text-neutral-800">{title}</p>
        {description && <p className="mt-1 max-w-sm text-sm text-neutral-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
