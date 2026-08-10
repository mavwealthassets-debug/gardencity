import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Wallet, FileText, Headset, Calendar, MessageSquare, Cake } from "lucide-react";
import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { RmContactBand } from "@/components/layout/RmContactBand";
import { useCurrentBuyer } from "./useCurrentBuyer";
import { useAppData } from "@/app/store";
import { formatDateTime } from "@/lib/format";
import type { LucideIcon } from "lucide-react";

const CATEGORY_ICON: Record<string, LucideIcon> = { Payment: Wallet, Document: FileText, Project: MessageSquare, Registration: FileText, Support: Headset, Meeting: Calendar, General: Cake };

export default function NotificationsPage() {
  const { buyer } = useCurrentBuyer();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppData();
  const navigate = useNavigate();

  const myNotifications = useMemo(
    () => notifications.filter((n) => n.userId === buyer.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [notifications, buyer.id]
  );
  const unread = myNotifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-700"><Bell size={20} /></span>
          <div>
            <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">Notifications</h1>
            <p className="mt-1 text-sm text-neutral-500">Stay updated with important alerts and updates.</p>
          </div>
        </div>
        {unread > 0 && (
          <Button variant="secondary" onClick={() => markAllNotificationsRead(buyer.id)}><CheckCheck size={15} /> Mark all as read</Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {myNotifications.length === 0 ? (
            <EmptyState title="No notifications" description="You're all caught up." className="py-10" />
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {myNotifications.map((n) => {
                const Icon = CATEGORY_ICON[n.category] ?? Bell;
                return (
                  <li key={n.id} className={n.read ? "" : "bg-brand-50/40"}>
                    <button
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.link) navigate(n.link);
                      }}
                      className="flex w-full items-start gap-3 p-4 text-left hover:bg-surface-subtle"
                    >
                      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-muted text-neutral-500"><Icon size={16} /></span>
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                          {n.title}
                          {!n.read && <span className="h-2 w-2 rounded-full bg-brand-600" aria-label="Unread" />}
                        </p>
                        <p className="mt-0.5 text-sm text-neutral-500">{n.body}</p>
                        <p className="mt-1 text-xs text-neutral-400">{formatDateTime(n.date)}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <RmContactBand rmId={buyer.assignedRmId} />
    </div>
  );
}
