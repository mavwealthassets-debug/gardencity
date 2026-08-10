import { useMemo } from "react";
import { Users, TrendingUp, Wallet, ReceiptText, Home, Gift, FileSpreadsheet, FileText, Eye } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { MetricCard } from "@/components/common/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { DonutChart } from "@/components/charts/DonutChart";
import { BarComparisonChart } from "@/components/charts/BarComparisonChart";
import { useAppData } from "@/app/store";
import { useToast } from "@/app/toast";
import { gardenCityProject } from "@/data/project";
import { buildMonthlySeries } from "@/features/dashboard/dashboard-utils";

const REPORTS = [
  { key: "sales", title: "Sales Report", desc: "Detailed sales and collection performance report.", icon: TrendingUp },
  { key: "buyer", title: "Buyer Report", desc: "Comprehensive buyer information and history.", icon: Users },
  { key: "finance", title: "Finance Report", desc: "Collections, outstanding and transaction summary.", icon: Wallet },
  { key: "plots", title: "Plot Status Report", desc: "Sold, available and booked plots summary.", icon: Home },
  { key: "referral", title: "Referral Report", desc: "Referral source performance and earnings.", icon: Gift },
  { key: "support", title: "Support Report", desc: "Support tickets and resolution analytics.", icon: ReceiptText },
];

export default function ReportsPage() {
  const { plots, documents, installments, transactions } = useAppData();
  const { toast } = useToast();

  const monthly = useMemo(() => buildMonthlySeries(installments, transactions), [installments, transactions]);

  const plotDonut = [
    { label: "Sold", value: plots.filter((p) => p.status === "sold").length, color: "#ef4444" },
    { label: "Available", value: plots.filter((p) => p.status === "available").length, color: "#16a34a" },
    { label: "Booked", value: plots.filter((p) => p.status === "booked").length, color: "#f59e0b" },
  ];

  const docDonut = [
    { label: "Verified", value: documents.filter((d) => d.status === "Verified").length, color: "#16a34a" },
    { label: "Pending", value: documents.filter((d) => d.status === "Pending").length, color: "#f59e0b" },
    { label: "Rejected", value: documents.filter((d) => d.status === "Rejected").length, color: "#ef4444" },
  ];

  const categoryCollections = gardenCityProject.plotCategories.map((c) => ({
    category: c.label,
    collectionsCr: Number(((c.count * 1900000 * 0.6) / 1_00_00_000).toFixed(2)),
  }));

  const collectionEfficiency = monthly.map((m, i) => ({ ...m, outstandingCr: [2.15, 2.35, 2.75, 2.9, 2.6, 5.43][i] ?? 0 }));
  const relationshipEngagement = monthly.map((m, i) => ({ month: m.month, engaged: [56, 72, 81, 86, 79, 94][i] ?? 0, leads: [38, 62, 48, 55, 50, 63][i] ?? 0, followups: [72, 78, 67, 69, 90, 91][i] ?? 0 }));

  function exportReport(title: string, format: string) {
    toast({ variant: "success", title: `${title} exported`, description: `Generating ${format} — this is a simulated export in the prototype.` });
  }

  return (
    <div className="flex flex-col gap-3 pb-8">
      <PageHeader title="Reports" description="Analyze performance, track trends and make data-driven decisions." />

      <div className="flex flex-col gap-3 px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <MetricCard label="Total Buyers" value="94" icon={Users} iconTone="green" sublabel="↑ 12.0% vs Apr ’25" sparkline={[2,3,2,4,3,5,4,6]} />
          <MetricCard label="Conversion Rate" value="18.6%" icon={TrendingUp} iconTone="blue" sublabel="↑ 2.4% vs Apr ’25" sparkline={[2,2,3,4,3,7,5,4]} sparklineTone="blue" />
          <MetricCard label="Collections This Month" value="₹ 7.42 Cr" icon={Wallet} iconTone="teal" sublabel="↑ 57.7% vs Apr ’25" sparkline={[3,4,3,5,4,7,4,3]} />
          <MetricCard label="Outstanding" value="₹ 5.43 Cr" icon={ReceiptText} iconTone="red" sublabel="↓ 3.2% vs Apr ’25" sparkline={[4,3,4,3,5,4,3,2]} sparklineTone="red" />
          <MetricCard label="Sold Plots" value="48" icon={Home} iconTone="purple" sublabel="↑ 47.5% vs Apr ’25" sparkline={[2,3,2,3,4,3,5,5]} sparklineTone="purple" />
          <MetricCard label="Referral Sales" value="₹ 1.26 Cr" icon={Gift} iconTone="orange" sublabel="↑ 32.0% vs Apr ’25" sparkline={[2,4,3,4,3,5,4,4]} />
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <Card className="h-[205px] overflow-hidden">
            <CardHeader className="py-3"><CardTitle>Sales by Month (Collections)</CardTitle></CardHeader>
            <CardContent><BarComparisonChart height={130} data={monthly} xKey="month" series={[{ key: "collectionsCr", label: "Collections (₹ Cr)", color: "#087a2a" }]} /></CardContent>
          </Card>
          <Card className="h-[190px] overflow-hidden">
            <CardHeader className="py-3"><CardTitle>Sold vs Available Plots</CardTitle></CardHeader>
            <CardContent className="flex justify-center"><DonutChart data={plotDonut} centerValue={String(plots.length)} centerLabel="Plots" size={125} /></CardContent>
          </Card>
          <Card className="h-[190px] overflow-hidden">
            <CardHeader className="py-3"><CardTitle>Plot Size Category Performance</CardTitle></CardHeader>
            <CardContent><BarComparisonChart height={130} data={categoryCollections} xKey="category" series={[{ key: "collectionsCr", label: "Collections", color: "#4fac6c" }]} /></CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <Card className="h-[220px] overflow-hidden">
            <CardHeader className="py-3"><CardTitle>Collection Efficiency</CardTitle></CardHeader>
            <CardContent className="px-4 pb-4"><BarComparisonChart height={158} data={collectionEfficiency} xKey="month" series={[{ key: "collectionsCr", label: "Collected", color: "#16a34a" }, { key: "outstandingCr", label: "Outstanding", color: "#f59e0b" }]} /></CardContent>
          </Card>
          <Card className="h-[220px] overflow-hidden">
            <CardHeader className="py-3"><CardTitle>Relationship Engagement</CardTitle></CardHeader>
            <CardContent className="px-4 pb-4"><BarComparisonChart height={158} data={relationshipEngagement} xKey="month" series={[{ key: "engaged", label: "Engaged Buyers", color: "#16a34a" }, { key: "leads", label: "New Leads", color: "#3b82f6" }, { key: "followups", label: "Follow-ups", color: "#f59e0b" }]} /></CardContent>
          </Card>
          <Card className="h-[220px] overflow-hidden">
            <CardHeader className="py-3"><CardTitle>Document Verification Status</CardTitle></CardHeader>
            <CardContent className="flex h-[165px] items-center justify-center pb-4"><DonutChart data={docDonut} centerValue={String(documents.length)} centerLabel="Documents" size={125} /></CardContent>
          </Card>
        </div>

        <div>
          <div className="mb-2"><h3 className="text-sm font-semibold">Export Reports</h3><p className="text-xs text-neutral-500">Download detailed reports for sharing and offline analysis.</p></div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-6">
              {REPORTS.map((r) => (
                <div key={r.key} className="flex min-h-[122px] flex-col rounded-xl border border-border bg-white p-3">
                  <div className="flex items-start gap-2.5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700"><r.icon size={16} /></span><div className="min-w-0"><p className="text-xs font-semibold leading-tight text-neutral-800">{r.title}</p><p className="mt-1 text-[10px] leading-snug text-neutral-500">{r.desc}</p></div></div>
                  <div className="mt-auto grid grid-cols-3 gap-1.5 pt-2">
                    <Button className="h-7 px-1 text-[10px]" variant="secondary" onClick={() => exportReport(r.title, "preview")}><Eye size={11} /> View</Button>
                    <Button className="h-7 px-1 text-[10px]" variant="secondary" onClick={() => exportReport(r.title, "PDF")}><FileText size={11} /> PDF</Button>
                    <Button className="h-7 px-1 text-[10px]" variant="secondary" onClick={() => exportReport(r.title, "Excel")}><FileSpreadsheet size={11} /> Excel</Button>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
}
