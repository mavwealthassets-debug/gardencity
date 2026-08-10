import { Suspense, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { AdminFooter } from "./AdminFooter";
import { PageLoader } from "./PageLoader";
import { ScrollToTopOnNavigate } from "./ScrollToTopOnNavigate";
import { useSession } from "@/app/session";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const MAIN_ID = "admin-main-scroll";

export function AdminLayout() {
  const { user } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 768px)");

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  const collapsed = isTablet && !isDesktop;

  return (
    <div className="h-dvh overflow-hidden bg-surface-subtle">
      <div className="flex h-full min-w-0">
        <aside className={collapsed ? "hidden w-[76px] shrink-0 border-r border-border md:block" : "hidden w-64 shrink-0 border-r border-border lg:block"}>
          <AdminSidebar collapsed={collapsed} />
        </aside>

        {mobileOpen &&
          createPortal(
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div className="absolute inset-0 bg-neutral-900/50 animate-fade-in" onClick={() => setMobileOpen(false)} aria-hidden="true" />
              <div className="relative z-10 h-full w-72 animate-slide-in-left bg-surface shadow-drawer">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-surface-muted"
                >
                  <X size={18} />
                </button>
                <AdminSidebar onNavigate={() => setMobileOpen(false)} />
              </div>
            </div>,
            document.body
          )}

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar onMenuClick={() => setMobileOpen(true)} />
          <main id={MAIN_ID} className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
            <ScrollToTopOnNavigate containerId={MAIN_ID} />
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
            <AdminFooter />
          </main>
        </div>
      </div>
    </div>
  );
}
