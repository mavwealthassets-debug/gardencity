import { Menu } from "lucide-react";
import { NotificationPanel } from "./NotificationPanel";
import { UserMenu } from "./UserMenu";
import { useAppData } from "@/app/store";
import { useSession } from "@/app/session";

export function BuyerTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useSession();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppData();

  if (!user) return null;
  const userNotifications = notifications
    .filter((n) => n.userId === user.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-surface px-3 min-[380px]:px-4 sm:h-[72px] sm:gap-3 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-surface-muted lg:hidden"
      >
        <Menu size={20} />
      </button>

      <div className="ml-auto flex items-center gap-2">
        <NotificationPanel
          notifications={userNotifications}
          onMarkRead={markNotificationRead}
          onMarkAllRead={() => markAllNotificationsRead(user.id)}
        />
        <span className="mx-1 hidden h-6 w-px bg-border sm:block" />
        <UserMenu user={user} onLogout={logout} profilePath="/buyer/profile" settingsPath="/buyer/settings" />
      </div>
    </header>
  );
}
