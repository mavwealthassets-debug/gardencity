import { useMemo, useState } from "react";
import { ArrowDown, ArrowLeft, Bookmark, CheckCircle2, Copy, Filter, Save } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { Card, CardContent } from "@/components/common/Card";
import { SearchInput } from "@/components/common/SearchInput";
import { Select } from "@/components/common/Field";
import { Table, TableContainer, TBody, TD, TH, THead, TR } from "@/components/common/Table";
import { useAppData } from "@/app/store";
import { useToast } from "@/app/toast";
import { loans } from "@/data/payments";
import { getBuyerById } from "@/data/buyers";
import { formatDate, formatINR, formatINRCompact } from "@/lib/format";
import { ExportMenu } from "@/components/common/ExportMenu";
import { downloadBlob, downloadTextPdf } from "@/lib/download";
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/common/Dropdown";

type DetailRow = { id: string; customer: string; reference: string; date: string; base: number; adjustment: number; final: number; status: string };

const METRICS = {
  "total-sales": { title: "Total Sales Value", trend: 12.6, description: "Total contracted value of all sold and booked plots.", formula: "Eligible plot value − approved discounts", dateField: "Booking date", included: "Sold and booked plots", excluded: "Available and reserved plots", lastStatus: "Sold / Booked" },
  collected: { title: "Amount Collected", trend: 15.7, description: "All successful payments received against sold and booked plots.", formula: "Successful receipts − reversals", dateField: "Payment date", included: "Successful and partially paid records", excluded: "Failed and pending transactions", lastStatus: "Paid / Partially Paid" },
  outstanding: { title: "Outstanding", trend: 9.2, description: "Contracted sales value that remains unpaid.", formula: "Total sales value − amount collected", dateField: "Booking date", included: "Sold and booked plots with balance", excluded: "Fully paid plots", lastStatus: "Balance greater than zero" },
  overdue: { title: "Overdue Payments", trend: 6.3, description: "Unpaid installment balances whose due date has passed.", formula: "Installment amount − paid amount", dateField: "Due date", included: "Overdue installments", excluded: "Upcoming and paid installments", lastStatus: "Overdue" },
  loans: { title: "Loan Cases", trend: 3, description: "Buyer cases with an active home-loan record.", formula: "Count of active loan accounts", dateField: "Buyer since", included: "Active loan accounts", excluded: "Self-funded purchases", lastStatus: "Loan active" },
  registrations: { title: "Registrations Pending", trend: 3, description: "Buyers whose property registration is not yet complete.", formula: "Active buyers − completed registrations", dateField: "Buyer since", included: "Pending and in-progress registrations", excluded: "Completed registrations", lastStatus: "Pending / In Progress" },
} as const;

export default function FinanceMetricDetailPage() {
  const { metric = "total-sales" } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { plots, buyers, installments, transactions } = useAppData();
  const key = metric in METRICS ? metric as keyof typeof METRICS : "total-sales";
  const config = METRICS[key];
  const [query, setQuery] = useState("");
  const [recordView, setRecordView] = useState("included");
  const [ageing, setAgeing] = useState("all");
  const [savedViews, setSavedViews] = useState<Array<{ name: string; query: string; ageing: string }>>([]);

  const rows = useMemo<DetailRow[]>(() => {
    if (key === "overdue") return installments.filter((i) => i.status === "Overdue").map((i) => ({ id: i.id, customer: getBuyerById(i.buyerId)?.name ?? "—", reference: i.plotId, date: i.dueDate, base: i.amount, adjustment: -i.paidAmount, final: i.amount - i.paidAmount, status: i.status }));
    if (key === "collected") return transactions.filter((t) => t.status === "Success").map((t) => ({ id: t.id, customer: getBuyerById(t.buyerId)?.name ?? "—", reference: t.plotId, date: t.date, base: t.amount, adjustment: 0, final: t.amount, status: t.status }));
    if (key === "loans") return loans.map((loan) => { const buyer = buyers.find((b) => b.id === loan.buyerId); return { id: loan.loanAccountNo, customer: buyer?.name ?? loan.accountHolder, reference: loan.bankName, date: buyer?.buyerSince ?? "2025-01-01", base: loan.loanAmount, adjustment: loan.disbursedAmount - loan.loanAmount, final: loan.disbursedAmount, status: "Active" }; });
    if (key === "registrations") return buyers.filter((b) => b.registrationStatus !== "Completed").map((b) => ({ id: b.id, customer: b.name, reference: b.plotId ?? "—", date: b.buyerSince, base: 0, adjustment: 0, final: 0, status: b.registrationStatus }));
    const eligible = plots.filter((p) => p.status === "sold" || p.status === "booked");
    return eligible.filter((p) => key !== "outstanding" || p.finalPrice > (p.paidAmount ?? 0)).map((p) => ({ id: p.id, customer: p.buyerId ? getBuyerById(p.buyerId)?.name ?? "—" : "—", reference: p.plotNo, date: p.bookingDate ?? "2025-01-01", base: key === "outstanding" ? p.finalPrice : p.basePrice, adjustment: key === "outstanding" ? -(p.paidAmount ?? 0) : -p.discount, final: key === "outstanding" ? p.finalPrice - (p.paidAmount ?? 0) : p.finalPrice, status: p.status === "sold" ? "Sold" : "Booked" }));
  }, [key, plots, buyers, installments, transactions]);

  const filteredRows = rows.filter((row) => {
    if (!`${row.customer} ${row.reference} ${row.status}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (key !== "overdue" || ageing === "all") return true;
    const days = Math.max(0, Math.floor((Date.now() - new Date(row.date).getTime()) / 86400000));
    return ageing === "0-30" ? days <= 30 : ageing === "31-60" ? days <= 60 && days >= 31 : ageing === "61-90" ? days <= 90 && days >= 61 : days > 90;
  });
  const total = key === "loans" || key === "registrations" ? rows.length : rows.reduce((sum, row) => sum + row.final, 0);
  const calculation = useMemo(() => {
    const base = rows.reduce((sum, row) => sum + row.base, 0);
    const adjustment = rows.reduce((sum, row) => sum + row.adjustment, 0);

    if (key === "loans") {
      return {
        formula: `${buyers.length} total buyers - ${buyers.length - rows.length} self-funded buyers = ${rows.length} loan cases`,
        baseLabel: "Total buyers",
        baseValue: String(buyers.length),
        adjustmentLabel: "Self-funded buyers",
        adjustmentValue: `-${buyers.length - rows.length}`,
        finalValue: String(rows.length),
      };
    }

    if (key === "registrations") {
      const completed = buyers.filter((buyer) => buyer.registrationStatus === "Completed").length;
      return {
        formula: `${buyers.length} active buyers - ${completed} completed registrations = ${rows.length} pending`,
        baseLabel: "Active buyers",
        baseValue: String(buyers.length),
        adjustmentLabel: "Completed registrations",
        adjustmentValue: `-${completed}`,
        finalValue: String(rows.length),
      };
    }

    return {
      formula: `${formatINRCompact(base)} ${adjustment < 0 ? "-" : "+"} ${formatINRCompact(Math.abs(adjustment))} = ${formatINRCompact(total)}`,
      baseLabel: key === "collected" ? "Successful receipts" : key === "overdue" ? "Installment value" : key === "outstanding" ? "Contracted value" : "Eligible plot value",
      baseValue: formatINR(base),
      adjustmentLabel: key === "collected" ? "Reversals" : key === "overdue" ? "Amount paid" : key === "outstanding" ? "Amount collected" : "Approved discounts",
      adjustmentValue: formatINR(adjustment),
      finalValue: formatINR(total),
    };
  }, [buyers, key, rows, total]);
  const moneyFlow = useMemo(() => {
    const eligiblePlots = plots.filter((plot) => plot.status === "sold" || plot.status === "booked");
    const sales = eligiblePlots.reduce((sum, plot) => sum + plot.finalPrice, 0);
    const collected = eligiblePlots.reduce((sum, plot) => sum + (plot.paidAmount ?? 0), 0);
    const outstanding = sales - collected;
    const overdue = installments.filter((item) => item.status === "Overdue").reduce((sum, item) => sum + item.amount - item.paidAmount, 0);
    return { sales, collected, outstanding, overdue, notYetDue: Math.max(0, outstanding - overdue) };
  }, [installments, plots]);

  const excludedCount = key === "loans" || key === "registrations" ? Math.max(0, buyers.length - rows.length) : Math.max(0, plots.length - rows.length);
  const adjustedCount = rows.filter((row) => row.adjustment !== 0).length;
  const displayedValue = key === "loans" || key === "registrations" ? String(total) : formatINRCompact(total);
  const exportRows = () => [["Ref ID", "Customer", "Reference", "Date", "Value", "Adjustment", "Counted", "Status"], ...filteredRows.map((row) => [row.id, row.customer, row.reference, row.date, row.base, row.adjustment, row.final, row.status])];
  const exportDelimited = (delimiter: string, extension: string, mime: string) => {
    const content = exportRows().map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(delimiter)).join("\n");
    downloadBlob(new Blob([content], { type: mime }), `${key}-records.${extension}`);
  };
  const exportPdf = (detailed: boolean) => downloadTextPdf(`${key}-${detailed ? "detailed" : "summary"}.pdf`, `${config.title} ${detailed ? "Detailed Report" : "Summary"}`, [
    `Value: ${displayedValue}`, `Records: ${rows.length}`, `Included: ${rows.length}`, `Excluded: ${excludedCount}`, `Adjustments: ${adjustedCount}`,
    ...(detailed ? filteredRows.slice(0, 12).map((row) => `${row.reference}: ${row.customer} · ${formatINR(row.final)}`) : []),
  ]);
  const saveCurrentView = () => {
    const next = [...savedViews, { name: query || (ageing === "all" ? `All ${config.title}` : `${ageing} days`), query, ageing }].slice(-5);
    setSavedViews(next);
    toast({ variant: "success", title: "View saved", description: "This filter view is available for the current session." });
  };

  return (
    <div className="px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <button type="button" onClick={() => navigate("/admin/finance")} className="flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-brand-700"><ArrowLeft size={14} /> Finance / {config.title}</button>
        <Card className="overflow-hidden"><CardContent className="p-0">
          <header className="flex flex-col justify-between gap-4 border-b border-border px-5 py-5 sm:flex-row sm:items-center">
            <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">{config.title}</p><div className="mt-1 flex items-end gap-3"><h1 className="text-3xl font-bold">{displayedValue}</h1><span className="mb-1 text-xs font-semibold text-status-available">+{config.trend}%</span></div></div>
            <div className="flex items-center gap-2"><Select defaultValue="apr-aug" className="w-44" aria-label="Date range"><option value="apr-aug">Apr-Aug 2026</option><option value="month">This month</option><option value="year">This year</option><option value="all">All time</option></Select><Button variant="secondary" size="sm" aria-label="Copy summary" onClick={() => toast({ variant: "success", title: "Summary copied", description: `${config.title}: ${displayedValue}` })}><Copy size={15} /></Button></div>
          </header>

          <section className="border-b border-border bg-surface-subtle/40 px-5 py-7">
            <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">Money Flow</p>
            <div className="mx-auto mt-5 max-w-3xl">
              <div className="mx-auto flex min-h-24 min-w-40 flex-col items-center justify-center gap-2 rounded-xl border border-brand-200 bg-white px-6 py-4 text-center shadow-sm"><strong className="whitespace-nowrap text-xl leading-none">{formatINRCompact(moneyFlow.sales)}</strong><span className="text-[11px] font-semibold uppercase leading-none text-neutral-500">Sales</span></div>
              <div className="mx-auto h-6 w-px bg-brand-300" /><div className="mx-auto h-px w-1/2 bg-brand-300" />
              <div className="grid grid-cols-2 gap-6"><FlowNode value={moneyFlow.collected} label="Collected" tone="green" /><FlowNode value={moneyFlow.outstanding} label="Outstanding" tone="orange" /></div>
              <div className="ml-auto mr-[25%] h-6 w-px bg-status-booked/50" />
              <div className="ml-auto grid w-1/2 grid-cols-2 gap-4"><FlowNode value={moneyFlow.overdue} label="Overdue" tone="red" compact /><FlowNode value={moneyFlow.notYetDue} label="Not Yet Due" tone="gray" compact /></div>
            </div>
          </section>

          <section className="px-5 pb-7 pt-10">
            <div className="text-center"><p className="text-sm text-neutral-600">{config.description}</p></div>
            <div className="mx-auto mt-5 flex max-w-4xl flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
              <ValueStep label={calculation.baseLabel} value={calculation.baseValue} />
              <ValueStep label={calculation.adjustmentLabel} value={calculation.adjustmentValue} tone="red" />
              <ValueStep label="Final" value={calculation.finalValue} tone="green" />
            </div>
            <div className="mx-auto mt-5 max-w-4xl rounded-xl border border-border p-4"><div className="flex h-32 items-end gap-3">{[
              { label: "Gross", value: calculation.baseValue, height: 100, color: "#60a5fa" },
              { label: "Adjustment", value: calculation.adjustmentValue, height: 54, color: "#f87171" },
              { label: "Net change", value: calculation.adjustmentValue, height: 38, color: "#f59e0b" },
              { label: "Final", value: calculation.finalValue, height: 84, color: "#07852f" },
            ].map((bar) => <div key={bar.label} className="flex h-full flex-1 flex-col justify-end"><div className="flex min-h-10 items-start justify-center rounded-t-md px-1 pt-2 text-center text-[10px] font-bold text-white sm:text-xs" style={{ height: `${bar.height}%`, backgroundColor: bar.color }}>{bar.value}</div></div>)}</div><div className="mt-2 grid grid-cols-4 text-center text-[10px] font-semibold uppercase text-neutral-500"><span>Gross</span><span>Adjustment</span><span>Net change</span><span>Final</span></div></div>
            <div className="-mx-5 -mb-7 mt-7 flex flex-wrap items-center justify-center gap-3 border-y border-border py-4">{[["Included", rows.length], ["Excluded", excludedCount], ["Adjustments", adjustedCount]].map(([label, value]) => <button key={label} type="button" onClick={() => setRecordView(String(label).toLowerCase())} className="min-w-32 rounded-full border border-border bg-white px-5 py-2.5 text-center text-xs font-semibold text-neutral-600 transition hover:border-brand-300 hover:text-brand-700">{label} <span className="ml-1.5 text-neutral-950">{value}</span></button>)}</div>
          </section>

          <section className="px-5 py-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="text-sm font-bold uppercase tracking-[0.12em]">Transactions contributing to this value</h2><p className="mt-1 text-xs text-neutral-500">{rows.length} records reconciled from the current dataset</p></div><ExportMenu onExcel={() => exportDelimited("\t", "xls", "application/vnd.ms-excel")} onCsv={() => exportDelimited(",", "csv", "text/csv;charset=utf-8")} onPdfSummary={() => exportPdf(false)} onDetailedPdf={() => exportPdf(true)} /></div>
            <div className="mt-4 flex flex-wrap items-center gap-2"><SearchInput value={query} onChange={setQuery} placeholder="Search reference or customer..." containerClassName="mr-auto w-full sm:w-72" />{key === "overdue" && <Select value={ageing} onChange={(event) => setAgeing(event.target.value)} className="w-36" aria-label="Ageing bucket"><option value="all">All ageing</option><option value="0-30">0–30 days</option><option value="31-60">31–60 days</option><option value="61-90">61–90 days</option><option value="90+">90+ days</option></Select>}<Button variant="secondary" size="sm" title="Uses the status shown in each record"><Filter size={14} /> Status</Button><Dropdown trigger={({ onClick }) => <Button variant="secondary" size="sm" onClick={onClick}><Bookmark size={14} /> Views</Button>}><DropdownItem onClick={saveCurrentView}><Save size={14} /> Save current view</DropdownItem>{savedViews.length > 0 && <DropdownSeparator />}{savedViews.map((view, index) => <DropdownItem key={`${view.name}-${index}`} onClick={() => { setQuery(view.query); setAgeing(view.ageing); }}>{view.name}</DropdownItem>)}</Dropdown><Select defaultValue="newest" className="w-36" aria-label="Sort records"><option value="newest">Newest first</option><option value="oldest">Oldest first</option></Select></div>
            {recordView === "included" ? <TableContainer className="mt-4 shadow-none"><Table><THead><TR><TH>Ref ID</TH><TH>Customer</TH><TH>Plot / Reference</TH><TH>Date</TH><TH className="text-right">Value</TH><TH className="text-right">Adjustment</TH><TH className="text-right">Counted</TH><TH>Status</TH></TR></THead><TBody>{filteredRows.map((row) => <TR key={row.id}><TD className="font-medium">{row.id}</TD><TD>{row.customer}</TD><TD>{row.reference}</TD><TD>{formatDate(row.date)}</TD><TD className="text-right">{row.base ? formatINR(row.base) : "-"}</TD><TD className="text-right">{row.adjustment ? formatINR(row.adjustment) : "-"}</TD><TD className="text-right font-semibold">{row.final ? formatINR(row.final) : "-"}</TD><TD>{row.status}</TD></TR>)}</TBody></Table></TableContainer> : <div className="mt-4 rounded-xl bg-surface-subtle py-10 text-center text-sm text-neutral-500">No {recordView} records in the current dummy dataset.</div>}
            <div className="mt-5 flex items-center justify-center gap-2 border-t border-border pt-4 text-xs font-semibold text-brand-700"><CheckCircle2 size={16} /> Dashboard total reconciled · {displayedValue}</div>
            <button type="button" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })} className="mx-auto mt-4 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-neutral-600 shadow-sm" aria-label="Scroll down"><ArrowDown size={16} /></button>
          </section>
        </CardContent></Card>
      </div>
    </div>
  );
}

function FlowNode({ value, label, tone, compact = false }: { value: number; label: string; tone: "green" | "orange" | "red" | "gray"; compact?: boolean }) {
  const styles = { green: "border-status-available/30 text-status-available", orange: "border-status-booked/30 text-status-booked", red: "border-status-sold/30 text-status-sold", gray: "border-border text-neutral-500" };
  return <div className="flex flex-col items-center">{!compact && <div className="h-5 w-px bg-brand-300" />}<div className={`w-full rounded-xl border bg-white p-3 text-center ${styles[tone]}`}><strong className="text-neutral-950">{formatINRCompact(value)}</strong><span className="mt-1 block text-[11px] font-semibold uppercase">{label}</span></div></div>;
}

function ValueStep({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "red" | "green" }) {
  const styles = tone === "green" ? "bg-brand-50 text-brand-800" : tone === "red" ? "bg-status-sold/5 text-status-sold" : "bg-neutral-50 text-neutral-950";
  return <div className={`flex min-h-16 items-center justify-between gap-6 px-5 py-3.5 sm:px-6 ${styles}`}><strong className="whitespace-nowrap text-base sm:text-lg">{value}</strong><span className="text-right text-xs font-medium opacity-70 sm:text-sm">{label}</span></div>;
}
