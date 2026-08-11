import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, TrendingUp, Wallet, ReceiptText, Home, Gift, FileSpreadsheet, FileText, Eye } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { MetricCard } from "@/components/common/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { DonutChart } from "@/components/charts/DonutChart";
import { BarComparisonChart } from "@/components/charts/BarComparisonChart";
import { useAppData } from "@/app/store";
import { useToast } from "@/app/toast";
import { gardenCityProject } from "@/data/project";
import { referrals } from "@/data/referrals";
import { tickets } from "@/data/tickets";
import { buildMonthlySeries } from "@/features/dashboard/dashboard-utils";
import { formatDate, formatINR } from "@/lib/format";

type ReportRow = Record<string, string | number>;

const REPORTS = [
  { key: "sales", title: "Sales Report", desc: "Detailed sales and collection performance report.", icon: TrendingUp },
  { key: "buyer", title: "Buyer Report", desc: "Comprehensive buyer information and history.", icon: Users },
  { key: "finance", title: "Finance Report", desc: "Collections, outstanding and transaction summary.", icon: Wallet },
  { key: "plots", title: "Plot Status Report", desc: "Sold, available and booked plots summary.", icon: Home },
  { key: "referral", title: "Referral Report", desc: "Referral source performance and earnings.", icon: Gift },
  { key: "support", title: "Support Report", desc: "Support tickets and resolution analytics.", icon: ReceiptText },
] as const;

type ReportKey = typeof REPORTS[number]["key"];

export default function ReportsPage() {
  const navigate = useNavigate();
  const { plots, buyers, documents, installments, transactions } = useAppData();
  const { toast } = useToast();
  const [previewKey, setPreviewKey] = useState<ReportKey | null>(null);

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

  function getReportRows(key: ReportKey): ReportRow[] {
    if (key === "sales") return plots.filter((plot) => plot.status === "sold" || plot.status === "booked").map((plot) => ({ Plot: plot.plotNo, Status: plot.status, "Sale Value": formatINR(plot.finalPrice), Collected: formatINR(plot.paidAmount ?? 0), Outstanding: formatINR(plot.finalPrice - (plot.paidAmount ?? 0)) }));
    if (key === "buyer") return buyers.map((buyer) => ({ Buyer: buyer.name, Phone: buyer.phone, Email: buyer.email, Plot: buyer.plotId ?? "—", Status: buyer.status, "Buyer Since": formatDate(buyer.buyerSince) }));
    if (key === "finance") return transactions.map((transaction) => ({ Transaction: transaction.id, Plot: transaction.plotId, Date: formatDate(transaction.date), Amount: formatINR(transaction.amount), Mode: transaction.mode, Status: transaction.status }));
    if (key === "plots") return plots.map((plot) => ({ Plot: plot.plotNo, Block: plot.block, "Size (sq yd)": plot.areaSqYd, Facing: plot.facing, Status: plot.status, Value: formatINR(plot.finalPrice) }));
    if (key === "referral") return referrals.map((referral) => ({ Referral: referral.referredName, Email: referral.referredEmail, Plot: referral.plotId ?? "—", Status: referral.status, Reward: formatINR(referral.rewardAmount), "Referred On": formatDate(referral.referredOn) }));
    return tickets.map((ticket) => ({ Ticket: ticket.id, Subject: ticket.subject, Category: ticket.category, Priority: ticket.priority, Status: ticket.status, SLA: ticket.slaState, "Assigned To": ticket.assignedTo }));
  }

  function downloadExcel(key: ReportKey, title: string) {
    const rows = getReportRows(key);
    const headers = Object.keys(rows[0] ?? { Report: title });
    const escape = (value: string | number) => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const table = `<table><thead><tr>${headers.map((header) => `<th>${escape(header)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${headers.map((header) => `<td>${escape(row[header] ?? "")}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    downloadBlob(new Blob([`<html><head><meta charset="UTF-8"></head><body><h2>${escape(title)}</h2>${table}</body></html>`], { type: "application/vnd.ms-excel" }), `${slug(title)}.xls`);
    toast({ variant: "success", title: `${title} downloaded`, description: "Excel report generated successfully." });
  }

  function downloadPdf(key: ReportKey, title: string) {
    const rows = getReportRows(key);
    const headers = Object.keys(rows[0] ?? { Report: title });
    const lines = [title, `Generated: ${new Date().toLocaleDateString("en-IN")}`, "", headers.join(" | "), ...rows.slice(0, 35).map((row) => headers.map((header) => row[header] ?? "").join(" | "))];
    downloadBlob(createTextPdf(lines), `${slug(title)}.pdf`);
    toast({ variant: "success", title: `${title} downloaded`, description: "PDF report generated successfully." });
  }

  const previewReport = REPORTS.find((report) => report.key === previewKey);
  const previewRows = previewKey ? getReportRows(previewKey) : [];

  return (
    <div className="flex flex-col gap-3 pb-8">
      <PageHeader title="Reports" description="Analyze performance, track trends and make data-driven decisions." />

      <div className="flex flex-col gap-3 px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <MetricCard label="Total Buyers" value="94" icon={Users} iconTone="green" sublabel="↑ 12.0% vs Apr ’25" sparkline={[2,3,2,4,3,5,4,6]} onClick={() => navigate("/admin/buyers")} />
          <MetricCard label="Conversion Rate" value="18.6%" icon={TrendingUp} iconTone="blue" sublabel="↑ 2.4% vs Apr ’25" sparkline={[2,2,3,4,3,7,5,4]} sparklineTone="blue" onClick={() => navigate("/admin/reports/conversion")} />
          <MetricCard label="Collections This Month" value="₹ 7.42 Cr" icon={Wallet} iconTone="teal" sublabel="↑ 57.7% vs Apr ’25" sparkline={[3,4,3,5,4,7,4,3]} onClick={() => navigate("/admin/finance/collected")} />
          <MetricCard label="Outstanding" value="₹ 5.43 Cr" icon={ReceiptText} iconTone="red" sublabel="↓ 3.2% vs Apr ’25" sparkline={[4,3,4,3,5,4,3,2]} sparklineTone="red" onClick={() => navigate("/admin/finance/outstanding")} />
          <MetricCard label="Sold Plots" value="48" icon={Home} iconTone="purple" sublabel="↑ 47.5% vs Apr ’25" sparkline={[2,3,2,3,4,3,5,5]} sparklineTone="purple" onClick={() => navigate("/admin/plot-inventory")} />
          <MetricCard label="Referral Sales" value="₹ 1.26 Cr" icon={Gift} iconTone="orange" sublabel="↑ 32.0% vs Apr ’25" sparkline={[2,4,3,4,3,5,4,4]} onClick={() => navigate("/admin/relationships/referrals")} />
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
                    <Button className="h-7 px-1 text-[10px]" variant="secondary" onClick={() => setPreviewKey(r.key)}><Eye size={11} /> View</Button>
                    <Button className="h-7 px-1 text-[10px]" variant="secondary" onClick={() => downloadPdf(r.key, r.title)}><FileText size={11} /> PDF</Button>
                    <Button className="h-7 px-1 text-[10px]" variant="secondary" onClick={() => downloadExcel(r.key, r.title)}><FileSpreadsheet size={11} /> Excel</Button>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
      <Modal open={!!previewKey} onClose={() => setPreviewKey(null)} title={previewReport?.title ?? "Report Preview"} description={previewReport ? `${previewRows.length} records from the available dummy data.` : undefined} footer={<><Button variant="secondary" onClick={() => previewReport && downloadPdf(previewReport.key, previewReport.title)}><FileText size={14} /> PDF</Button><Button variant="secondary" onClick={() => previewReport && downloadExcel(previewReport.key, previewReport.title)}><FileSpreadsheet size={14} /> Excel</Button><Button onClick={() => setPreviewKey(null)}>Close</Button></>}>
        {previewRows.length > 0 ? <div className="max-h-[460px] overflow-auto rounded-xl border border-border"><table className="w-full min-w-[720px] text-left text-xs"><thead className="sticky top-0 bg-neutral-50 text-neutral-500"><tr>{Object.keys(previewRows[0]).map((header) => <th key={header} className="whitespace-nowrap px-4 py-3 font-semibold uppercase">{header}</th>)}</tr></thead><tbody className="divide-y divide-border">{previewRows.map((row, index) => <tr key={index}>{Object.keys(previewRows[0]).map((header) => <td key={header} className="whitespace-nowrap px-4 py-3">{row[header]}</td>)}</tr>)}</tbody></table></div> : <div className="py-12 text-center text-sm text-neutral-500">No report records are available.</div>}
      </Modal>
    </div>
  );
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function createTextPdf(sourceLines: string[]) {
  const clean = (value: string) => value.normalize("NFKD").replace(/[^\x20-\x7E]/g, " ").replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)").slice(0, 92);
  const commands = ["BT", "/F1 9 Tf", "38 810 Td", ...sourceLines.slice(0, 48).flatMap((line, index) => index === 0 ? [`(${clean(line)}) Tj`, "0 -18 Td"] : [`(${clean(line)}) Tj`, "0 -14 Td"]), "ET"].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${commands.length} >>\nstream\n${commands}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n `).join("\n")}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}
