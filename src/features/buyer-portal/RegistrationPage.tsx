import { Check, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { RmContactBand } from "@/components/layout/RmContactBand";
import { useCurrentBuyer } from "./useCurrentBuyer";
import { formatDate } from "@/lib/format";
import { rahulMilestones } from "@/data/registration";
import { cn } from "@/lib/utils";

export default function RegistrationPage() {
  const { buyer } = useCurrentBuyer();
  const milestones = rahulMilestones;
  const activeIndex = milestones.findIndex((m) => m.status === "In Progress");

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">Registration / Legal Process</h1>
        <p className="mt-1 text-sm text-neutral-500">Track your legal documentation and registration process for your plot.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="relative grid grid-cols-5">
            <span className="absolute left-[10%] right-[10%] top-[18px] h-0.5 bg-border-strong" aria-hidden="true" />
            <span
              className="absolute left-[10%] top-[18px] h-0.5 bg-brand-600"
              style={{ width: `${Math.max(0, activeIndex) * 20}%` }}
              aria-hidden="true"
            />
            {milestones.map((m, i) => (
              <div key={m.id} className="relative z-10 flex min-w-0 flex-col items-center px-1 text-center">
                <div className="flex items-center justify-center">
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold",
                      m.status === "Completed" && "border-brand-600 bg-brand-600 text-white",
                      m.status === "In Progress" && "border-status-booked bg-status-booked-bg text-status-booked",
                      m.status === "Upcoming" && "border-border-strong bg-surface text-neutral-400"
                    )}
                  >
                    {m.status === "Completed" ? <Check size={16} /> : i + 1}
                  </span>
                </div>
                <p className="mt-2 text-xs font-semibold text-neutral-800 sm:text-sm">{m.step}</p>
                <p className={cn("text-xs", m.status === "Completed" ? "text-status-available" : m.status === "In Progress" ? "text-status-booked" : "text-neutral-400")}>{m.status}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Registration Timeline</CardTitle></CardHeader>
        <CardContent>
          <ol className="flex flex-col gap-5 border-l border-border pl-5">
            {milestones.map((m, i) => (
              <li key={m.id} className="relative">
                <span
                  className={cn(
                    "absolute -left-[27px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-surface",
                    m.status === "Completed" ? "border-brand-600" : m.status === "In Progress" ? "border-status-booked" : "border-border-strong"
                  )}
                />
                <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-neutral-800">
                  {i + 1}. {m.step}
                  <StatusBadge tone={m.status === "Completed" ? "green" : m.status === "In Progress" ? "orange" : "gray"} dot={false}>{m.status}</StatusBadge>
                </p>
                <p className="mt-0.5 text-xs text-neutral-500">{m.description}</p>
                <p className="mt-0.5 text-xs text-neutral-400">{m.date ? formatDate(m.date) : "Pending"}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card className="border-brand-200 bg-brand-50/60">
        <CardContent className="flex min-h-[86px] items-center gap-4 p-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700"><Clock size={22} /></span>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-5 text-neutral-900">We're Here to Support You</p>
            <p className="text-sm leading-5 text-neutral-600">Our legal team is processing your documents. We will notify you once the registration is completed.</p>
          </div>
        </CardContent>
      </Card>

      <RmContactBand rmId={buyer.assignedRmId} />
    </div>
  );
}
