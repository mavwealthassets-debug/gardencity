import { useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Building2, Loader2, ShieldCheck, User } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/common/Button";
import { useSession } from "@/app/session";
import type { Role } from "@/types";

export function LoginPage() {
  const { login } = useSession();
  const navigate = useNavigate();
  const [pending, setPending] = useState<Role | null>(null);

  function handleDemoLogin(role: Role) {
    setPending(role);
    window.setTimeout(() => {
      // Commit the session update before navigating so the destination
      // layout's role guard sees the new session on its very first render.
      flushSync(() => {
        login(role);
      });
      navigate(role === "admin" ? "/admin/dashboard" : "/buyer/dashboard");
    }, 450);
  }

  return (
    <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-brand-900 lg:block">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop"
          alt=""
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-900/50 to-brand-900/20" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-white">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-200">Premium Residential Township</p>
          <h1 className="mt-3 max-w-md text-4xl font-bold leading-tight">Garden City Naugaon CRM & Buyer Portal</h1>
          <p className="mt-4 max-w-md text-brand-100">
            A unified platform for the sales team and buyers to manage plots, payments, documents and relationships — end to end.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          <Logo size="lg" />
          <h2 className="mt-8 text-2xl font-bold text-neutral-900">Welcome back</h2>
          <p className="mt-1 text-sm text-neutral-500">This is a frontend prototype. Choose a demo workspace to explore — no real credentials required.</p>

          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => handleDemoLogin("admin")}
              disabled={pending !== null}
              className="group flex items-center gap-4 rounded-xl border border-border-strong bg-surface p-4 text-left shadow-card transition-shadow hover:shadow-popover disabled:opacity-60"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <Building2 size={20} />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-neutral-900">Continue as Admin / Employee</span>
                <span className="block text-xs text-neutral-500">CRM dashboard, plots, buyers, finance & reports</span>
              </span>
              {pending === "admin" ? <Loader2 size={18} className="animate-spin text-brand-700" /> : <ShieldCheck size={18} className="text-neutral-300 group-hover:text-brand-600" />}
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin("buyer")}
              disabled={pending !== null}
              className="group flex items-center gap-4 rounded-xl border border-border-strong bg-surface p-4 text-left shadow-card transition-shadow hover:shadow-popover disabled:opacity-60"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-status-info-bg text-status-info">
                <User size={20} />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-neutral-900">Continue as Buyer</span>
                <span className="block text-xs text-neutral-500">Demo buyer: Rahul Kumar — Plot GCN-047</span>
              </span>
              {pending === "buyer" ? <Loader2 size={18} className="animate-spin text-status-info" /> : <ShieldCheck size={18} className="text-neutral-300 group-hover:text-status-info" />}
            </button>
          </div>

          <div className="mt-8 rounded-lg border border-border bg-surface-subtle p-3.5 text-xs text-neutral-500">
            <p className="font-semibold text-neutral-700">Prototype note</p>
            <p className="mt-1">
              All data shown is simulated. Once inside, use the floating "Switch" button anytime to jump between the Admin CRM and Buyer Portal demos.
            </p>
          </div>

          <Button variant="link" className="mt-6 text-xs" onClick={() => navigate("/")}>
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
}
