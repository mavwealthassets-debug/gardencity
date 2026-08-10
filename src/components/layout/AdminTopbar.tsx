import { useState } from "react";
import { Menu, Search, CalendarDays } from "lucide-react";
import { ProjectSelector } from "./ProjectSelector";
import { NotificationPanel } from "./NotificationPanel";
import { UserMenu } from "./UserMenu";
import { GlobalSearch } from "./GlobalSearch";
import { useAppData } from "@/app/store";
import { useSession } from "@/app/session";
import { useLocation } from "react-router-dom";

export function AdminTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logout } = useSession();
  const { pathname } = useLocation();
  const financePage = pathname === "/admin/finance";
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppData();

  if (!user) return null;
  const userNotifications = notifications
    .filter((n) => n.userId === user.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center gap-4 border-b border-border bg-surface px-4 sm:px-6">
      <button type="button" onClick={onMenuClick} aria-label="Open navigation menu" className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-surface-muted lg:hidden">
        <Menu size={20} />
      </button>
      <div className="hidden min-w-0 lg:block">
        <p className="truncate text-lg font-bold text-neutral-900">{financePage ? "Finance" : "Welcome back, Admin! 👋"}</p>
        <p className="truncate text-xs text-neutral-500">{financePage ? "Manage collections, payments, loans and financial records for plot sales." : "Here's what's happening with Garden City Naugaon today."}</p>
      </div>
      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <ProjectSelector />
        <button type="button" onClick={() => setSearchOpen(true)} aria-label="Global search" className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-surface-muted hover:text-neutral-800"><Search size={18} /></button>
        <NotificationPanel notifications={userNotifications} onMarkRead={markNotificationRead} onMarkAllRead={() => markAllNotificationsRead(user.id)} />
        <button type="button" aria-label="Calendar" className="hidden h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-surface-muted hover:text-neutral-800 sm:flex"><CalendarDays size={18} /></button>
        <span className="mx-1 hidden h-6 w-px bg-border sm:block" />
        <UserMenu user={user} onLogout={logout} settingsPath="/admin/settings" />
      </div>
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
