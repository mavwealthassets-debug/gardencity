import { useEffect, useState } from "react";
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
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const { user, logout } = useSession();
  const { pathname } = useLocation();
  const financePage = pathname === "/admin/finance";
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAppData();

  useEffect(() => {
    const openSearch = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", openSearch);
    return () => window.removeEventListener("keydown", openSearch);
  }, []);

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
        <button type="button" onClick={() => setSearchOpen(true)} title="Global search (Ctrl/Cmd + K)" aria-label="Global search" className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-surface-muted hover:text-neutral-800"><Search size={18} /></button>
        <NotificationPanel notifications={userNotifications} onMarkRead={markNotificationRead} onMarkAllRead={() => markAllNotificationsRead(user.id)} />
        <div className="relative hidden sm:block">
          <button type="button" onClick={() => setCalendarOpen((value) => !value)} aria-label="Calendar" aria-expanded={calendarOpen} className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-surface-muted hover:text-neutral-800"><CalendarDays size={18} /></button>
          {calendarOpen && (
            <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-72 rounded-xl border border-border bg-white p-4 shadow-popover">
              <p className="text-sm font-semibold text-neutral-900">Calendar</p>
              <p className="mt-1 text-xs text-neutral-500">Choose a date to view.</p>
              <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="mt-3 h-10 w-full rounded-lg border border-border px-3 text-sm text-neutral-800" />
              <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-center text-sm font-medium text-primary">{new Date(`${selectedDate}T00:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setSelectedDate(new Date().toISOString().slice(0, 10))} className="h-9 rounded-lg border border-border text-xs font-semibold text-neutral-700 hover:bg-surface-muted">Today</button>
                <button type="button" onClick={() => setCalendarOpen(false)} className="h-9 rounded-lg bg-primary text-xs font-semibold text-white">Done</button>
              </div>
            </div>
          )}
        </div>
        <span className="mx-1 hidden h-6 w-px bg-border sm:block" />
        <UserMenu user={user} onLogout={logout} settingsPath="/admin/settings" />
      </div>
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
