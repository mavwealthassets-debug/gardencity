import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid3x3,
  Tag,
  CalendarCheck,
  CheckCircle2,
  IndianRupee,
  Wallet,
  ReceiptText,
  Users,
  FileWarning,
  Signature,
  ShieldCheck,
  ClipboardList,
  Bell,
  CalendarDays,
  CalendarClock,
  MessageCircle,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { MetricCard } from "@/components/common/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { DonutChart, DonutLegend } from "@/components/charts/DonutChart";
import { BarComparisonChart } from "@/components/charts/BarComparisonChart";
import { EmptyState } from "@/components/common/EmptyState";
import { useAppData } from "@/app/store";
import { formatINRCompact, formatRelativeTime } from "@/lib/format";
import { gardenCityProject } from "@/data/project";
import { buildMonthlySeries, buildRecentActivity, daysUntil } from "./dashboard-utils";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { plots, buyers, documents, tickets, installments, transactions } = useAppData();

  const stats = useMemo(() => {
    const available = plots.filter((p) => p.status === "available").length;
    const booked = plots.filter((p) => p.status === "booked").length;
    const sold = plots.filter((p) => p.status === "sold").length;
    const soldOrBooked = plots.filter((p) => p.status === "sold" || p.status === "booked");
    const totalSalesValue = soldOrBooked.reduce((s, p) => s + p.finalPrice, 0);
    const amountCollected = soldOrBooked.reduce((s, p) => s + (p.paidAmount ?? 0), 0);
    const outstanding = totalSalesValue - amountCollected;
    const activeBuyers = buyers.filter((b) => b.status === "Active").length;
    return { available, booked, sold, totalSalesValue, amountCollected, outstanding, activeBuyers };
  }, [plots, buyers]);

  const monthly = useMemo(() => buildMonthlySeries(installments, transactions), [installments, transactions]);
  const activity = useMemo(() => buildRecentActivity(plots, transactions, documents, tickets), [plots, transactions, documents, tickets]);

  const pendingDocsByCategory = useMemo(() => {
    const pending = documents.filter((d) => d.status === "Pending" || d.status === "Resubmission Required");
    const byCat = (cat: string) => pending.filter((d) => d.category === cat).length;
    return [
      { label: "KYC Documents", count: byCat("KYC"), icon: ShieldCheck },
      { label: "Financial Documents", count: byCat("Financial"), icon: ReceiptText },
      { label: "Property Documents", count: byCat("Property"), icon: FileWarning },
      { label: "Legal Documents", count: byCat("Legal"), icon: Signature },
    ];
  }, [documents]);

  const paymentBuckets = useMemo(() => {
    const overdue = installments.filter((i) => i.status === "Overdue");
    const dueSoon = installments.filter((i) => i.status === "Upcoming" && daysUntil(i.dueDate) >= 0 && daysUntil(i.dueDate) <= 7);
    const dueLater = installments.filter((i) => i.status === "Upcoming" && daysUntil(i.dueDate) > 7 && daysUntil(i.dueDate) <= 30);
    const sum = (arr: typeof overdue) => arr.reduce((s, i) => s + (i.amount - i.paidAmount), 0);
    return [
      { label: "Overdue (>0 days)", count: overdue.length, amount: sum(overdue), tone: "text-status-sold" },
      { label: "Due in 7 days", count: dueSoon.length, amount: sum(dueSoon), tone: "text-status-booked" },
      { label: "Due in 8-30 days", count: dueLater.length, amount: sum(dueLater), tone: "text-status-info" },
    ];
  }, [installments]);

  const donutData = [
    { label: "Sold", value: stats.sold, color: "#ef4444" },
    { label: "Available", value: stats.available, color: "#3b82f6" },
    { label: "Booked", value: stats.booked, color: "#f59e0b" },
  ];

  const salesSpark = monthly.map((m) => m.salesCr);
  const collectionsSpark = monthly.map((m) => m.collectionsCr);
  const outstandingSpark = monthly.map((m) => Math.max(0, m.salesCr - m.collectionsCr));

  return (
    <div className="flex flex-col pb-4">
      <div className="flex flex-col gap-4 px-4 pt-2 sm:px-6">
        <div className="flex h-9 shrink-0 items-center justify-end">
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-neutral-700 shadow-card"
          >
            <CalendarDays size={14} className="text-neutral-500" />
            Mar 1 – Aug 31, 2026
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
          <MetricCard label="Total Plots" value={String(plots.length)} icon={Grid3x3} iconTone="green" progressPercent={100} onClick={() => navigate("/admin/plot-inventory")} />
          <MetricCard label="Available" value={String(stats.available)} icon={Tag} iconTone="blue" progressPercent={(stats.available / plots.length) * 100} onClick={() => navigate("/admin/plot-inventory?status=available")} />
          <MetricCard label="Booked" value={String(stats.booked)} icon={CalendarCheck} iconTone="orange" progressPercent={(stats.booked / plots.length) * 100} onClick={() => navigate("/admin/plot-inventory?status=booked")} />
          <MetricCard label="Sold" value={String(stats.sold)} icon={CheckCircle2} iconTone="green" progressPercent={(stats.sold / plots.length) * 100} onClick={() => navigate("/admin/plot-inventory?status=sold")} />
          <MetricCard label="Total Sales Value" value={formatINRCompact(stats.totalSalesValue)} icon={IndianRupee} iconTone="purple" sublabel="All time" sparkline={salesSpark} sparklineTone="purple" onClick={() => navigate("/admin/finance")} />
          <MetricCard label="Amount Collected" value={formatINRCompact(stats.amountCollected)} icon={Wallet} iconTone="teal" sublabel={`${((stats.amountCollected / stats.totalSalesValue) * 100).toFixed(1)}% of sales value`} sparkline={collectionsSpark} sparklineTone="green" onClick={() => navigate("/admin/finance")} />
          <MetricCard label="Outstanding" value={formatINRCompact(stats.outstanding)} icon={ReceiptText} iconTone="red" sublabel={`${((stats.outstanding / stats.totalSalesValue) * 100).toFixed(1)}% of sales value`} sparkline={outstandingSpark} sparklineTone="red" onClick={() => navigate("/admin/finance")} />
          <MetricCard label="Active Buyers" value={String(stats.activeBuyers)} icon={Users} iconTone="blue" sublabel="Engaged buyers" sparkline={collectionsSpark.map((v) => v + 1)} sparklineTone="blue" onClick={() => navigate("/admin/buyers?status=Active")} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.85fr_1.3fr_1fr]">
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle>Plot Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3 sm:flex-row">
              <DonutChart data={donutData} centerValue={String(plots.length)} centerLabel="Total Plots" size={140} />
              <DonutLegend data={donutData} />
            </CardContent>
          </Card>

          <Card className="min-w-0">
            <CardHeader>
              <CardTitle>Monthly Sales & Collections (₹ Cr)</CardTitle>
            </CardHeader>
            <CardContent>
              <BarComparisonChart
                data={monthly}
                xKey="month"
                series={[
                  { key: "salesCr", label: "Sales Value", color: "#087a2a" },
                  { key: "collectionsCr", label: "Collections", color: "#8bcd9d" },
                ]}
                height={160}
                valueFormatter={(v) => `${v}Cr`}
              />
            </CardContent>
          </Card>

          <Card className="min-w-0">
            <CardHeader>
              <CardTitle>Plot Size Distribution (by Plot Count)</CardTitle>
            </CardHeader>
            <CardContent>
              <BarComparisonChart
                data={gardenCityProject.plotCategories.map((c) => ({ size: c.label, plots: c.count }))}
                xKey="size"
                series={[{ key: "plots", label: "Plot Count", color: "#4fac6c" }]}
                height={160}
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 xl:h-[264px] xl:grid-cols-[1.25fr_1.2fr_0.85fr_1.05fr_1fr]">
          <Card className="min-w-0 lg:col-span-3 xl:col-span-1 xl:h-full xl:overflow-hidden">
            <CardHeader className="p-3">
              <CardTitle>Recent Activities</CardTitle>
              <Button variant="link" size="sm" onClick={() => navigate("/admin/relationships")}>View All</Button>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              {activity.length === 0 ? (
                <EmptyState title="No recent activity" className="py-6" />
              ) : (
                <ul className="flex max-h-[205px] flex-col gap-2.5 overflow-y-auto pr-1">
                  {activity.map((a) => (
                    <li key={a.id} className="flex gap-2">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-status-available-bg text-status-available">
                        <CheckCircle2 size={14} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-medium leading-snug text-neutral-800">{a.title}</p>
                        <p className="text-[11px] leading-snug text-neutral-500">
                          {a.meta} · {formatRelativeTime(a.date)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="min-w-0 lg:col-span-3 xl:col-span-1 xl:h-full xl:overflow-hidden">
            <CardHeader className="p-3">
              <CardTitle className="text-[13px] leading-tight">Buyers / Relationships</CardTitle>
              <Button variant="link" size="sm" onClick={() => navigate("/admin/buyers")}>View All</Button>
            </CardHeader>
            <CardContent className="grid h-[202px] min-h-0 grid-cols-2 grid-rows-2 gap-2 p-3 pt-0">
              <SummaryTile icon={Users} label="Total Buyers" value={buyers.length} tone="blue" />
              <SummaryTile icon={Users} label="Active Buyers" value={buyers.filter((b) => b.status === "Active").length} tone="green" />
              <SummaryTile icon={CheckCircle2} label="Converted" value={stats.sold} tone="teal" />
              <SummaryTile icon={ClipboardList} label="Warm Leads" value={buyers.filter((b) => b.status === "Lead").length} tone="orange" />
            </CardContent>
          </Card>

          <Card className="min-w-0 lg:col-span-2 xl:col-span-1 xl:h-full xl:overflow-hidden">
            <CardHeader className="p-3">
              <CardTitle>Pending Documents</CardTitle>
              <Button variant="link" size="sm" onClick={() => navigate("/admin/documents")}>View All</Button>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <ul className="flex flex-col gap-2.5">
                {pendingDocsByCategory.map((d) => (
                  <li key={d.label} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-status-booked-bg text-status-booked">
                      <d.icon size={15} />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-neutral-700">{d.label}</span>
                    <span className="text-sm font-semibold text-neutral-900">{d.count}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="min-w-0 lg:col-span-2 xl:col-span-1 xl:h-full xl:overflow-hidden">
            <CardHeader className="p-2.5">
              <CardTitle className="text-[13px] leading-tight">Pending Payments</CardTitle>
              <Button variant="link" size="sm" onClick={() => navigate("/admin/finance")}>View All</Button>
            </CardHeader>
            <CardContent className="p-2.5 pt-0">
              <ul className="flex flex-col gap-1.5">
                {paymentBuckets.map((b) => (
                  <li key={b.label} className="flex items-center justify-between gap-2 py-0.5">
                    <span className="whitespace-nowrap text-xs leading-snug text-neutral-700">{b.label}</span>
                    <span className="text-right">
                      <span className={`block text-xs font-semibold ${b.tone}`}>{formatINRCompact(b.amount)}</span>
                      <span className="block text-xs text-neutral-400">{b.count} payments</span>
                    </span>
                  </li>
                ))}
                <li className="flex items-center justify-between gap-2 border-t border-border pt-2">
                  <span className="whitespace-nowrap text-xs font-medium text-neutral-700">Total Outstanding</span>
                  <span className="text-xs font-bold text-status-sold">{formatINRCompact(stats.outstanding)}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="min-w-0 lg:col-span-2 xl:col-span-1 xl:h-full xl:overflow-hidden">
            <CardHeader className="p-3">
              <CardTitle>Communication Reminders</CardTitle>
              <Button variant="link" size="sm" onClick={() => navigate("/admin/support")}>View All</Button>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <ul className="flex flex-col gap-2.5">
                <ReminderRow icon={Bell} label="Follow-ups" value={buyers.filter((b) => b.nextFollowUp).length} tone="orange" />
                <ReminderRow icon={CalendarClock} label="Payment Reminders" value={installments.filter((i) => i.status === "Upcoming").length} tone="blue" />
                <ReminderRow icon={MessageCircle} label="Document Reminders" value={documents.filter((d) => d.status === "Pending").length} tone="purple" />
                <ReminderRow icon={MapPin} label="Site Visits Scheduled" value={2} tone="green" />
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SummaryTile({ icon: Icon, label, value, tone }: { icon: typeof Users; label: string; value: number; tone: "blue" | "green" | "teal" | "orange" }) {
  const toneMap = {
    blue: "bg-status-info-bg text-status-info",
    green: "bg-status-available-bg text-status-available",
    teal: "bg-status-teal-bg text-status-teal",
    orange: "bg-status-booked-bg text-status-booked",
  };
  return (
    <div className="rounded-lg border border-border p-2">
      <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${toneMap[tone]}`}>
        <Icon size={14} />
      </span>
      <p className="mt-1 text-base font-bold text-neutral-900">{value}</p>
      <p className="text-xs text-neutral-500">{label}</p>
    </div>
  );
}

function ReminderRow({ icon: Icon, label, value, tone }: { icon: typeof Bell; label: string; value: number; tone: "blue" | "green" | "orange" | "purple" }) {
  const toneMap = {
    blue: "bg-status-info-bg text-status-info",
    green: "bg-status-available-bg text-status-available",
    orange: "bg-status-booked-bg text-status-booked",
    purple: "bg-status-purple-bg text-status-purple",
  };
  return (
    <li className="flex items-center gap-2">
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${toneMap[tone]}`}>
        <Icon size={14} />
      </span>
      <span className="flex-1 text-xs leading-snug text-neutral-700">{label}</span>
      <span className="text-xs font-semibold text-neutral-900">{value}</span>
    </li>
  );
}
