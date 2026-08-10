import { useState, type FormEvent } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Building2, Loader2, LockKeyhole, Mail, ShieldCheck, User } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Field";
import { useSession } from "@/app/session";
import type { Role } from "@/types";

const DEMO_EMAIL: Record<Role, string> = {
  admin: "admin@gardencity.com",
  buyer: "rahul.kumar@email.com",
};

export function LoginPage() {
  const { login } = useSession();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("admin");
  const [email, setEmail] = useState(DEMO_EMAIL.admin);
  const [password, setPassword] = useState("demo1234");
  const [pending, setPending] = useState(false);

  function selectRole(nextRole: Role) {
    setRole(nextRole);
    setEmail(DEMO_EMAIL[nextRole]);
  }

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    window.setTimeout(() => {
      flushSync(() => login(role));
      navigate(role === "admin" ? "/admin/dashboard" : "/buyer/dashboard");
    }, 450);
  }

  return (
    <div className="relative grid min-h-dvh grid-cols-1 bg-surface lg:grid-cols-[1.05fr_0.95fr]">
      <div className="absolute right-4 top-4 z-20 rounded-xl border border-border bg-white p-1 shadow-card sm:right-7 sm:top-6">
        <div className="flex" role="tablist" aria-label="Choose portal">
          <RoleButton active={role === "admin"} icon={Building2} label="Admin" onClick={() => selectRole("admin")} />
          <RoleButton active={role === "buyer"} icon={User} label="Buyer" onClick={() => selectRole("buyer")} />
        </div>
      </div>

      <section className="relative hidden min-h-dvh overflow-hidden bg-brand-950 lg:block">
        <img
          src="/login-township-hero.jpg"
          alt="Garden City Naugaon landscaped township"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/45 to-brand-900/20" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-white xl:p-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">Premium Residential Township</p>
          <h1 className="mt-4 max-w-lg text-4xl font-bold leading-tight xl:text-5xl">Welcome to Garden City Naugaon</h1>
          <p className="mt-5 max-w-lg text-sm leading-6 text-brand-100">Manage plots, payments, documents and customer relationships through one secure, unified platform.</p>
          <div className="mt-8 flex items-center gap-2 text-sm text-brand-100"><ShieldCheck size={18} /> Secure access for buyers and employees</div>
        </div>
      </section>

      <main className="flex min-h-dvh items-center justify-center px-5 pb-10 pt-24 sm:px-8 lg:pt-10">
        <div className="w-full max-w-[440px]">
          <Logo size="lg" className="max-w-full" />
          <div className="mt-9">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">{role === "admin" ? "Admin CRM" : "Buyer Portal"}</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900">Welcome back</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">Sign in to continue to your {role === "admin" ? "administration workspace" : "buyer account"}.</p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleLogin}>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-[38px] z-10 text-neutral-400" size={17} />
              <Input label="Email address" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-11 pl-10" required />
            </div>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-[38px] z-10 text-neutral-400" size={17} />
              <Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-11 pl-10" required />
            </div>

            <div className="flex items-center justify-between gap-4 text-xs">
              <label className="flex cursor-pointer items-center gap-2 text-neutral-600"><input type="checkbox" defaultChecked className="h-4 w-4 accent-brand-700" /> Remember me</label>
              <button type="button" className="font-medium text-brand-700 hover:underline">Forgot password?</button>
            </div>

            <Button type="submit" className="h-11 w-full" disabled={pending}>
              {pending ? <><Loader2 size={17} className="animate-spin" /> Signing in...</> : <>Sign in to {role === "admin" ? "Admin CRM" : "Buyer Portal"}</>}
            </Button>
          </form>

          <div className="mt-6 rounded-xl border border-border bg-surface-subtle p-4 text-xs leading-5 text-neutral-500">
            <p className="font-semibold text-neutral-700">Demo access</p>
            <p>No real credentials are required. Select Admin or Buyer from the switch at the top-right, then sign in using the prefilled details.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

function RoleButton({ active, icon: Icon, label, onClick }: { active: boolean; icon: typeof User; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`flex min-w-[92px] items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${active ? "bg-brand-700 text-white shadow-sm" : "text-neutral-500 hover:bg-surface-muted hover:text-neutral-800"}`}
    >
      <Icon size={16} /> {label}
    </button>
  );
}
