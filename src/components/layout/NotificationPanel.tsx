import { useState } from "react";
import { Bell, Calendar, CheckCheck, FileText, Headset, type LucideIcon, MessageSquare, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "@/components/common/Dropdown";
import { EmptyState } from "@/components/common/EmptyState";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { NotificationItem } from "@/types";

const CATEGORY_ICON: Record<string, LucideIcon> = {
  Payment: Wallet,
  Document: FileText,
  Project: MessageSquare,
  Registration: FileText,
  Support: Headset,
  Meeting: Calendar,
  General: Bell,
};

interface NotificationPanelProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export function NotificationPanel({ notifications, onMarkRead, onMarkAllRead }: NotificationPanelProps) {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const navigate = useNavigate();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const visibleNotifications = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <Dropdown
      align="right"
      className="w-[360px] p-0"
      trigger={({ onClick }) => (
        <button
          type="button"
          onClick={onClick}
          aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-surface-muted hover:text-neutral-800"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-status-sold px-1 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <p className="text-sm font-semibold text-neutral-900">Notifications</p>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAllRead();
            }}
            className="flex items-center gap-1 text-xs font-medium text-brand-700 hover:underline"
          >
            <CheckCheck size={13} /> Mark all as read
          </button>
        )}
      </div>
      <div className="flex gap-1 border-b border-border px-4 py-2">
        {(["all", "unread"] as const).map((value) => (
          <button key={value} type="button" onClick={(event) => { event.stopPropagation(); setFilter(value); }} className={cn("rounded-md px-2.5 py-1 text-xs font-medium capitalize", filter === value ? "bg-brand-50 text-brand-700" : "text-neutral-500 hover:bg-surface-muted")}>
            {value}{value === "unread" ? ` (${unreadCount})` : ""}
          </button>
        ))}
      </div>
      <div className="max-h-[380px] overflow-y-auto">
        {visibleNotifications.length === 0 ? (
          <EmptyState title={filter === "unread" ? "No unread notifications" : "No notifications"} description="You're all caught up." className="py-8" />
        ) : (
          visibleNotifications.slice(0, 8).map((n) => {
            const Icon = CATEGORY_ICON[n.category] ?? Bell;
            const content = (
              <div className={cn("flex gap-3 px-4 py-3 hover:bg-surface-subtle", !n.read && "bg-brand-50/50")}>
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-muted text-neutral-500">
                  <Icon size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-neutral-900">{n.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500">{n.body}</p>
                  <p className="mt-1 text-[11px] text-neutral-400">{formatRelativeTime(n.date)}</p>
                </div>
                {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-600" aria-label="Unread" />}
              </div>
            );
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => { onMarkRead(n.id); if (n.link) navigate(n.link); }}
                className="block w-full border-b border-border text-left last:border-0"
              >
                {content}
              </button>
            );
          })
        )}
      </div>
    </Dropdown>
  );
}
