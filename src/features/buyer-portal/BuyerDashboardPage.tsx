import { useNavigate } from "react-router-dom";
import { Download, Phone, Headset, Gift } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DevelopmentProgress } from "@/components/common/DevelopmentProgress";
import { QuickActionCard } from "@/components/common/QuickActionCard";
import { PaymentGauge } from "@/components/charts/PaymentGauge";
import { RmContactBand } from "@/components/layout/RmContactBand";
import { useCurrentBuyer } from "./useCurrentBuyer";
import { useAppData } from "@/app/store";
import { useToast } from "@/app/toast";
import { formatDate, formatINR } from "@/lib/format";
import { projectUpdates } from "@/data/updates";
import { gardenCityProject } from "@/data/project";
import { downloadTextPdf } from "@/lib/download";

const DEVELOPMENT_PROGRESS = [
  { label: "Roads", percent: 85 },
  { label: "Street Lights", percent: 70 },
  { label: "Landscaping", percent: 60 },
  { label: "Water Infra", percent: 75 },
  { label: "Sewerage", percent: 65 },
  { label: "Clubhouse", percent: 40 },
];

export default function BuyerDashboardPage() {
  const { buyer, plot } = useCurrentBuyer();
  const { installments } = useAppData();
  const { toast } = useToast();
  const navigate = useNavigate();

  const schedule = installments.filter((i) => i.buyerId === buyer.id).sort((a, b) => a.installmentNo - b.installmentNo);
  const nextInstallment = schedule.find((i) => i.status === "Upcoming" || i.status === "Overdue" || i.status === "Partially Paid");
  const paidPercent = plot.finalPrice > 0 ? ((plot.paidAmount ?? 0) / plot.finalPrice) * 100 : 0;

  return (
    <div className="flex flex-col gap-5">
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr]">
          <div className="p-4 sm:p-6">
            <p className="text-sm text-neutral-500">Welcome back,</p>
            <h1 className="mt-1 text-2xl font-bold text-neutral-900">{buyer.name} 👋</h1>
            <p className="mt-3 max-w-sm text-sm text-neutral-500">Thank you for being a valued part of Garden City Naugaon.</p>
          </div>
          <img src={gardenCityProject.heroImage} alt="Garden City Naugaon entrance" className="h-40 w-full object-cover lg:h-full" />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="flex min-h-[330px] flex-col">
          <CardHeader className="pb-3"><CardTitle>My Property</CardTitle></CardHeader>
          <CardContent className="flex flex-1 flex-col gap-2">
            <span className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-lg font-bold text-neutral-900">Plot {plot.plotNo}</span>
              <StatusBadge tone="green" dot={false}>{plot.status[0].toUpperCase() + plot.status.slice(1)}</StatusBadge>
            </span>
            <dl className="grid grid-cols-2 gap-y-1.5 text-sm">
              <Row label="Plot Size" value={`${plot.areaSqYd} sq yd`} />
              <Row label="Facing" value={plot.facing} />
              <Row label="Road Width" value={`${plot.roadWidthFt} ft`} />
              <Row label="Block" value={plot.block} />
            </dl>
            <Button variant="secondary" size="sm" className="mt-auto w-fit" onClick={() => navigate("/buyer/my-plot")}>View Plot Details</Button>
          </CardContent>
        </Card>

        <Card className="flex min-h-[330px] flex-col">
          <CardHeader className="pb-0"><CardTitle>Payment Summary</CardTitle></CardHeader>
          <CardContent className="flex flex-1 flex-col items-center pt-1">
            <div className="flex min-h-[126px] w-full items-center justify-center">
              <PaymentGauge percent={paidPercent} size={144} />
            </div>
            <div className="w-full text-sm sm:px-1">
              <Row label="Total Price" value={formatINR(plot.finalPrice)} />
              <Row label="Paid Amount" value={formatINR(plot.paidAmount ?? 0)} valueClassName="text-status-available" />
              <Row label="Balance" value={formatINR(plot.balanceAmount ?? 0)} valueClassName="text-status-sold" />
            </div>
            <Button variant="secondary" size="sm" className="mt-auto self-center" onClick={() => navigate("/buyer/payments")}>View Payment Schedule</Button>
          </CardContent>
        </Card>

        <Card className="flex min-h-[330px] flex-col">
          <CardHeader className="pb-3"><CardTitle>Next Installment</CardTitle></CardHeader>
          <CardContent className="flex flex-1 flex-col gap-3">
            {nextInstallment ? (
              <>
                <p className="text-2xl font-bold text-neutral-900">{formatINR(nextInstallment.amount - nextInstallment.paidAmount)}</p>
                <Row label="Due Date" value={formatDate(nextInstallment.dueDate)} />
                <Row label="Installment No." value={`${nextInstallment.installmentNo} of ${nextInstallment.totalInstallments}`} />
                <span className="flex items-center justify-between text-sm"><span className="text-neutral-500">Status</span><StatusBadge tone={nextInstallment.status === "Overdue" ? "red" : "orange"} dot={false}>{nextInstallment.status}</StatusBadge></span>
                <Button className="mt-auto w-full" onClick={() => navigate("/buyer/payments")}>Pay Now</Button>
              </>
            ) : (
              <p className="text-sm text-neutral-500">All installments are fully paid. Thank you!</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Development Progress</CardTitle>
          <Button variant="link" size="sm" onClick={() => navigate("/buyer/updates")}>View Full Progress</Button>
        </CardHeader>
        <CardContent>
          <DevelopmentProgress items={DEVELOPMENT_PROGRESS} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Latest Updates</CardTitle>
            <Button variant="link" size="sm" onClick={() => navigate("/buyer/updates")}>View All</Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {projectUpdates.slice(0, 3).map((u) => (
              <button key={u.id} onClick={() => navigate("/buyer/updates")} className="flex items-center gap-3 rounded-lg p-1.5 text-left hover:bg-surface-subtle">
                <img src={u.images[0]} alt="" className="h-12 w-16 shrink-0 rounded-md object-cover" />
                <span className="min-w-0">
                  <span className="block text-xs text-neutral-400">{formatDate(u.date)}</span>
                  <span className="block truncate text-sm font-medium text-neutral-800">{u.title}</span>
                </span>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <QuickActionCard icon={Download} label="Download Receipt" onClick={() => { const paid = schedule.filter((item) => item.status === "Paid").at(-1); downloadTextPdf(`payment-receipt-${plot.plotNo}.pdf`, "Garden City Payment Receipt", [`Buyer: ${buyer.name}`, `Plot: ${plot.plotNo}`, `Installment: ${paid?.installmentLabel ?? "Latest payment"}`, `Amount: ${formatINR(paid?.paidAmount ?? plot.paidAmount ?? 0)}`, `Status: Paid`]); toast({ variant: "success", title: "Receipt downloaded", description: "Latest payment receipt saved as PDF." }); }} />
            <QuickActionCard icon={Phone} label="Contact RM" onClick={() => { window.location.href = "tel:+919876543210"; }} />
            <QuickActionCard icon={Headset} label="Raise Support" onClick={() => navigate("/buyer/support")} />
            <QuickActionCard icon={Gift} label="Refer a Friend" onClick={() => navigate("/buyer/referrals")} />
          </CardContent>
        </Card>
      </div>

      <RmContactBand rmId={buyer.assignedRmId} />
    </div>
  );
}

function Row({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div className="col-span-2 flex items-center justify-between border-b border-border/60 py-1.5 last:border-0">
      <span className="text-neutral-500">{label}</span>
      <span className={`font-medium text-neutral-800 ${valueClassName ?? ""}`}>{value}</span>
    </div>
  );
}
