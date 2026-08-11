import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Drawer } from "@/components/common/Drawer";
import { Button } from "@/components/common/Button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ProgressBar } from "@/components/common/ProgressBar";
import { useAppData } from "@/app/store";
import { getMilestonesForBuyer, loans } from "@/data";
import { formatDate, formatINR } from "@/lib/format";
import type { Buyer } from "@/types";

export function BuyerQuickView({ buyer, open, onClose }: { buyer: Buyer | null; open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { plots, installments, documents } = useAppData();
  const details = useMemo(() => {
    if (!buyer) return null;
    const plot = plots.find((item) => item.plotNo === buyer.plotId || item.id === buyer.plotId);
    const schedule = installments.filter((item) => item.buyerId === buyer.id);
    const collected = schedule.reduce((sum, item) => sum + item.paidAmount, 0);
    const nextPayment = schedule.filter((item) => item.status === "Upcoming" || item.status === "Overdue" || item.status === "Partially Paid").sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
    const milestones = getMilestonesForBuyer(buyer.id);
    const completed = milestones.filter((item) => item.status === "Completed").length;
    return { plot, schedule, collected, nextPayment, milestones, completed, loan: loans.find((item) => item.buyerId === buyer.id), documents: documents.filter((item) => item.buyerId === buyer.id) };
  }, [buyer, plots, installments, documents]);

  if (!buyer || !details) return null;
  const outstanding = Math.max(0, (details.plot?.finalPrice ?? details.schedule.reduce((sum, item) => sum + item.amount, 0)) - details.collected);
  return (
    <Drawer open={open} onClose={onClose} title={buyer.name} subtitle={`${buyer.plotId ?? "No plot assigned"} · Buyer since ${formatDate(buyer.buyerSince)}`} width="sm" footer={<Button className="w-full" onClick={() => { onClose(); navigate(`/admin/buyers/${buyer.id}`); }}>View Full Profile</Button>}>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <Summary label="Booking Value" value={details.plot ? formatINR(details.plot.finalPrice) : "—"} />
          <Summary label="Collected" value={formatINR(details.collected)} />
          <Summary label="Outstanding" value={formatINR(outstanding)} />
          <Summary label="Next Payment" value={details.nextPayment ? formatINR(details.nextPayment.amount - details.nextPayment.paidAmount) : "—"} note={details.nextPayment ? formatDate(details.nextPayment.dueDate) : undefined} />
        </div>
        <div className="rounded-xl border border-border p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">Current status</p>
          <div className="space-y-3 text-sm">
            <StatusRow label="KYC" value={buyer.kycStatus} tone={buyer.kycStatus === "Verified" ? "green" : buyer.kycStatus === "Rejected" ? "red" : "orange"} />
            <StatusRow label="Loan" value={details.loan ? "In Progress" : "—"} tone={details.loan ? "blue" : "gray"} />
            <StatusRow label="Registration" value={buyer.registrationStatus} tone={buyer.registrationStatus === "Completed" ? "green" : "orange"} />
            <StatusRow label="Documents" value={String(details.documents.length)} tone="gray" />
          </div>
        </div>
        {!!details.milestones.length && <div className="rounded-xl border border-border p-4"><div className="mb-3 flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Registration progress</p><span className="text-xs font-semibold text-brand-700">{details.completed}/{details.milestones.length}</span></div><ProgressBar percent={(details.completed / details.milestones.length) * 100} /><div className="mt-4 space-y-2">{details.milestones.map((item) => <div key={item.id} title={item.description} className="flex items-center justify-between gap-3 text-xs"><span className="truncate text-neutral-700">{item.step}</span><StatusBadge dot={false} tone={item.status === "Completed" ? "green" : item.status === "In Progress" ? "orange" : "gray"}>{item.status}</StatusBadge></div>)}</div></div>}
      </div>
    </Drawer>
  );
}

function Summary({ label, value, note }: { label: string; value: string; note?: string }) { return <div className="rounded-xl bg-surface-subtle p-3"><p className="text-xs text-neutral-500">{label}</p><p className="mt-1 truncate text-sm font-bold text-neutral-900">{value}</p>{note && <p className="mt-1 text-[11px] text-neutral-400">Due {note}</p>}</div>; }
function StatusRow({ label, value, tone }: { label: string; value: string; tone: "green" | "orange" | "red" | "blue" | "gray" }) { return <div className="flex items-center justify-between gap-3"><span className="text-neutral-500">{label}</span><StatusBadge dot={false} tone={tone}>{value}</StatusBadge></div>; }
