import { NavLink } from "react-router-dom";
import { Home, PlusCircle, TreePine } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { adminNavItems } from "@/routes/nav-config";
import { useToast } from "@/app/toast";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function AdminSidebar({ collapsed = false, onNavigate }: AdminSidebarProps) {
  const { toast } = useToast();

  return (
    <div className="flex h-full flex-col bg-surface">
      <div className={cn("flex h-20 shrink-0 items-center border-b border-border px-4", collapsed && "justify-center px-2")}>
        {collapsed ? (
          <Logo size="sm" withTagline={false} />
        ) : (
          <Logo size="md" eyebrow withTagline />
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin navigation">
        <ul className="flex flex-col gap-0.5">
          {adminNavItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13.5px] font-medium text-neutral-600 transition-colors hover:bg-surface-muted hover:text-neutral-900",
                    collapsed && "justify-center px-2",
                    isActive && "bg-brand-50 text-brand-700 hover:bg-brand-50 hover:text-brand-700"
                  )
                }
              >
                <item.icon size={17} strokeWidth={2} className="shrink-0" aria-hidden="true" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {!collapsed && (
        <div className="m-3 rounded-xl border border-brand-100 bg-brand-50 p-4 text-center">
          <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-600 shadow-card">
            <Home size={16} />
            <TreePine size={12} className="-ml-1" />
          </span>
          <p className="mt-2 text-sm font-semibold text-neutral-800">Grow your township</p>
          <p className="mt-1 text-xs text-neutral-500">Add new projects, manage plots and relationships effortlessly.</p>
          <button
            type="button"
            onClick={() => toast({ variant: "info", title: "Add New Project", description: "This would open the new-project setup wizard." })}
            className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-[10px] bg-brand-600 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-700"
          >
            <PlusCircle size={14} /> Add New Project
          </button>
        </div>
      )}

    </div>
  );
}
