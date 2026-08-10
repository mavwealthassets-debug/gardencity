import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { buyerNavItems } from "@/routes/nav-config";
import { cn } from "@/lib/utils";

export function BuyerSidebar({ onNavigate, onLogout }: { onNavigate?: () => void; onLogout: () => void }) {
  return (
    <div className="flex h-full flex-col bg-surface">
      <div className="flex h-[72px] shrink-0 items-center border-b border-border px-4">
        <Logo size="sm" />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Buyer navigation">
        <ul className="flex flex-col gap-1">
          {buyerNavItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-surface-muted hover:text-neutral-900",
                    isActive && "bg-brand-600 text-white hover:bg-brand-600 hover:text-white"
                  )
                }
              >
                <item.icon size={18} className="shrink-0" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-border p-3">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium text-neutral-600 hover:bg-surface-muted hover:text-status-sold"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}
