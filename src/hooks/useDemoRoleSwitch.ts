import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/app/session";
import { useToast } from "@/app/toast";

/** Powers the demo-only Admin/Buyer portal switch control rendered in each sidebar footer. */
export function useDemoRoleSwitch() {
  const { user, login } = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!user) return null;
  const otherRole = user.role === "admin" ? "buyer" : "admin";
  const label = otherRole === "admin" ? "Admin CRM" : "Buyer Portal";

  function switchRole() {
    // Flush the session update synchronously so route guards see the new
    // role before we navigate — otherwise the layout guard for the target
    // route can fire on stale session state and bounce back to /login.
    flushSync(() => {
      login(otherRole);
    });
    navigate(otherRole === "admin" ? "/admin/dashboard" : "/buyer/dashboard");
    toast({ variant: "info", title: `Switched to ${label}`, description: "This is a demo-only shortcut between the two applications." });
  }

  return { label, switchRole };
}
