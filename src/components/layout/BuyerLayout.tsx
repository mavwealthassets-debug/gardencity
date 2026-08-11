import { Suspense, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { BuyerSidebar } from "./BuyerSidebar";
import { BuyerTopbar } from "./BuyerTopbar";
import { BuyerFooter } from "./BuyerFooter";
import { PageLoader } from "./PageLoader";
import { ScrollToTopOnNavigate } from "./ScrollToTopOnNavigate";
import { useSession } from "@/app/session";

const MAIN_ID = "buyer-main-scroll";

export function BuyerLayout() {
  const { user, logout } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user || user.role !== "buyer") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-dvh overflow-hidden bg-surface-subtle">
      <div className="flex h-full min-w-0">
        <aside className="hidden w-64 shrink-0 border-r border-border lg:block">
          <BuyerSidebar onLogout={logout} />
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
                <BuyerSidebar onNavigate={() => setMobileOpen(false)} onLogout={logout} />
              </div>
            </div>,
            document.body
          )}

        <div className="flex min-w-0 flex-1 flex-col">
          <BuyerTopbar onMenuClick={() => setMobileOpen(true)} />
          <main id={MAIN_ID} className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
            <ScrollToTopOnNavigate containerId={MAIN_ID} />
            <Suspense fallback={<PageLoader />}>
              <div className="mx-auto w-full max-w-[1440px] px-3 pt-4 pb-8 min-[380px]:px-4 sm:px-5 sm:pt-6 sm:pb-10 lg:px-7 lg:pb-12 xl:px-8">
                <Outlet />
              </div>
            </Suspense>
            <BuyerFooter />
          </main>
        </div>
      </div>
    </div>
  );
}
