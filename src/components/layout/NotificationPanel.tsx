import { Bell, Calendar, CheckCheck, FileText, Headset, type LucideIcon, MessageSquare, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
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
  const unreadCount = notifications.filter((n) => !n.read).length;

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
      <div className="max-h-[380px] overflow-y-auto">
        {notifications.length === 0 ? (
          <EmptyState title="No notifications" description="You're all caught up." className="py-8" />
        ) : (
          notifications.slice(0, 8).map((n) => {
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
                onClick={() => onMarkRead(n.id)}
                className="block w-full border-b border-border text-left last:border-0"
              >
                {n.link ? <Link to={n.link}>{content}</Link> : content}
              </button>
            );
          })
        )}
      </div>
    </Dropdown>
  );
}
