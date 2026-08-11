import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IndianRupee, Wallet, ReceiptText, AlarmClockOff, Download, Plus, Undo2, Building2, Users, Send } from "lucide-react";
import { MetricCard } from "@/components/common/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Tabs } from "@/components/common/Tabs";
import { SearchInput } from "@/components/common/SearchInput";
import { Button } from "@/components/common/Button";
import { TableContainer, Table, THead, TBody, TR, TH, TD } from "@/components/common/Table";
import { StatusBadge, paymentStatusTone } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { Modal } from "@/components/common/Modal";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Select, Input } from "@/components/common/Field";
import { TrendAreaChart } from "@/components/charts/TrendAreaChart";
import { BarComparisonChart } from "@/components/charts/BarComparisonChart";
import { useAppData } from "@/app/store";
import { useToast } from "@/app/toast";
import { formatDate, formatINR, formatINRCompact } from "@/lib/format";
import { cn } from "@/lib/utils";
import { getBuyerById } from "@/data/buyers";
import { buildMonthlySeries } from "@/features/dashboard/dashboard-utils";
import type { PaymentInstallment, PaymentTransaction } from "@/types";

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "Upcoming", label: "Upcoming" },
  { value: "Overdue", label: "Overdue" },
  { value: "Partially Paid", label: "Partially Paid" },
  { value: "Paid", label: "Paid" },
];
const PAGE_SIZE = 5;

export default function FinancePage() {
  const navigate = useNavigate();
  const { plots, installments, transactions, recordPayment } = useAppData();
  const { toast } = useToast();
  const [statusTab, setStatusTab] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [payTarget, setPayTarget] = useState<PaymentInstallment | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payMode, setPayMode] = useState<PaymentTransaction["mode"]>("UPI");
  const [reversalTarget, setReversalTarget] = useState<PaymentInstallment | null>(null);

  const stats = useMemo(() => {
    const soldOrBooked = plots.filter((p) => p.status === "sold" || p.status === "booked");
    const totalSales = soldOrBooked.reduce((s, p) => s + p.finalPrice, 0);
    const collected = soldOrBooked.reduce((s, p) => s + (p.paidAmount ?? 0), 0);
    const outstanding = totalSales - collected;
    const overdue = installments.filter((i) => i.status === "Overdue").reduce((s, i) => s + (i.amount - i.paidAmount), 0);
    const collectionRate = totalSales > 0 ? (collected / totalSales) * 100 : 0;
    return { totalSales, collected, outstanding, overdue, collectionRate };
  }, [plots, installments]);

  const monthly = useMemo(() => buildMonthlySeries(installments, transactions), [installments, transactions]);
  const outstandingTrend = useMemo(
    () =>
      monthly.reduce<{ month: string; outstandingCr: number }[]>((acc, m, i) => {
        const prevOutstanding = i === 0 ? stats.outstanding / 1_00_00_000 - monthly.slice(i).reduce((s, x) => s + x.salesCr - x.collectionsCr, 0) : acc[i - 1].outstandingCr;
        const value = Math.max(0, prevOutstanding + (m.salesCr - m.collectionsCr));
        acc.push({ month: m.month, outstandingCr: Number(value.toFixed(2)) });
        return acc;
      }, []),
    [monthly, stats.outstanding]
  );

  const filteredInstallments = useMemo(() => {
    const q = query.trim().toLowerCase();
    return installments
      .filter((i) => statusTab === "all" || i.status === statusTab)
      .filter((i) => {
        if (!q) return true;
        const buyer = getBuyerById(i.buyerId)?.name.toLowerCase() ?? "";
        return buyer.includes(q) || i.plotId.toLowerCase().includes(q);
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [installments, statusTab, query]);
  const totalPages = Math.max(1, Math.ceil(filteredInstallments.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedInstallments = filteredInstallments.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function openRecordPayment(installment: PaymentInstallment) {
    setPayTarget(installment);
    setPayAmount(String(installment.amount - installment.paidAmount));
  }

  function submitPayment() {
    if (!payTarget) return;
    const amount = Number(payAmount);
    if (!amount || amount <= 0) {
      toast({ variant: "error", title: "Enter a valid amount" });
      return;
    }
    recordPayment(payTarget.id, amount, payMode);
    toast({ variant: "success", title: "Payment recorded", description: `${formatINR(amount)} recorded via ${payMode}.` });
    setPayTarget(null);
  }

  return (
    <div className="flex flex-col gap-3 pb-8">
      <div className="flex justify-end gap-2 px-4 pt-3 sm:px-6">
        <Button variant="secondary" onClick={() => toast({ variant: "success", title: "Report exported" })}><Download size={15} /> Export Report</Button>
        <Button onClick={() => filteredInstallments[0] && openRecordPayment(filteredInstallments[0])}><Plus size={15} /> Record Payment</Button>
      </div>

      <div className="flex flex-col gap-3 px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          <MetricCard label="Total Sales Value" value={formatINRCompact(stats.totalSales)} icon={IndianRupee} iconTone="green" trend={{value:12.6,label:"vs Apr ’25"}} sparkline={[3,4,3,5,4,7,6,9]} onClick={() => navigate("/admin/finance/total-sales")} />
          <MetricCard label="Amount Collected" value={formatINRCompact(stats.collected)} icon={Wallet} iconTone="teal" trend={{value:15.7,label:"vs Apr ’25"}} sparkline={[2,3,2,4,3,7,6,9]} onClick={() => navigate("/admin/finance/collected")} />
          <MetricCard label="Outstanding" value={formatINRCompact(stats.outstanding)} icon={ReceiptText} iconTone="orange" trend={{value:9.2,label:"vs Apr ’25"}} sparkline={[4,3,5,4,7,6,9,8]} onClick={() => navigate("/admin/finance/outstanding")} />
          <MetricCard label="Overdue Payments" value={formatINRCompact(stats.overdue)} icon={AlarmClockOff} iconTone="red" trend={{value:6.3,label:"vs Apr ’25"}} sparkline={[2,3,4,3,6,5,8,7]} sparklineTone="red" onClick={() => navigate("/admin/finance/overdue")} />
          <MetricCard label="Loan Cases" value="63" icon={Building2} iconTone="purple" trend={{value:3,label:"vs Apr ’25"}} sparkline={[2,2,3,4,4,5,6,8]} sparklineTone="purple" onClick={() => navigate("/admin/finance/loans")} />
          <MetricCard label="Registrations Pending" value="24" icon={Users} iconTone="blue" trend={{value:3,label:"vs Apr ’25"}} sparkline={[4,3,4,5,4,6,5,8]} sparklineTone="blue" onClick={() => navigate("/admin/finance/registrations")} />
        </div>

        <div className="relative grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,.95fr)] xl:pr-[272px]">
          <Card>
            <CardHeader className="py-3"><CardTitle>Monthly Collections (₹ Cr)</CardTitle></CardHeader>
            <CardContent>
              <BarComparisonChart height={165} data={monthly} xKey="month" series={[{ key: "collectionsCr", label: "Collected Amount", color: "#087a2a" }, { key: "salesCr", label: "Target", color: "#b7e2c2" }]} valueFormatter={(v) => `${v}Cr`} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-3"><CardTitle>Outstanding Trend</CardTitle></CardHeader>
            <CardContent>
              <TrendAreaChart height={165} data={outstandingTrend} xKey="month" yKey="outstandingCr" color="#ef4444" valueFormatter={(v) => `${v}Cr`} />
            </CardContent>
          </Card>
          <Card className="xl:absolute xl:right-0 xl:top-0 xl:h-[500px] xl:w-[260px]">
            <CardContent className="flex h-full flex-col gap-3 p-4">
              <div className="flex items-center gap-2 border-b border-border pb-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 font-semibold text-emerald-700">RS</span><div><p className="font-semibold">Rohit Sharma</p><p className="text-xs text-neutral-500">GCN-045</p></div><StatusBadge tone="green" className="ml-auto">Active</StatusBadge></div>
              <p className="text-xs font-semibold uppercase text-neutral-600">Financial Summary</p>
              {[["Property Value","₹ 45,00,000"],["Booking Amount","₹ 5,00,000"],["Loan Amount","₹ 28,00,000"],["Disbursed Amount","₹ 25,20,000"],["Paid to Date","₹ 16,80,000"]].map(([k,v]) => <div key={k} className="flex justify-between text-xs"><span className="text-neutral-500">{k}</span><span className="font-medium">{v}</span></div>)}
              <div className="flex justify-between border-t border-border pt-3 text-xs"><span className="font-medium">Outstanding Balance</span><span className="font-bold text-red-500">₹ 7,70,000</span></div>
              <p className="text-xs font-semibold uppercase text-neutral-600">Bank Details</p>
              {[["Bank Name","HDFC Bank"],["Account Holder","Rohit Sharma"],["Account Number","5010 •••• 1234"],["IFSC Code","HDFC0005010"]].map(([k,v]) => <div key={k} className="flex justify-between text-[11px]"><span className="text-neutral-500">{k}</span><span>{v}</span></div>)}
              <div className="mt-auto grid grid-cols-2 gap-2"><Button variant="secondary" className="px-2 text-xs"><Send size={13}/> Remind</Button><Button className="px-2 text-xs" onClick={() => filteredInstallments[0] && openRecordPayment(filteredInstallments[0])}>Record</Button></div>
            </CardContent>
          </Card>
        </div>

        <Card className="xl:mr-[272px]">
          <CardHeader>
            <CardTitle>Payment Schedule</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pb-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Tabs tabs={STATUS_TABS} value={statusTab} onChange={(value) => { setStatusTab(value); setPage(1); }} className="border-b-0" />
              <SearchInput value={query} onChange={(value) => { setQuery(value); setPage(1); }} placeholder="Search by buyer or plot..." containerClassName="sm:w-64" />
            </div>

            <TableContainer className="shadow-none [&_th]:py-2 [&_td]:py-2">
              <Table>
                <THead>
                  <TR>
                    <TH>Buyer</TH>
                    <TH>Plot</TH>
                    <TH>Installment</TH>
                    <TH>Due Date</TH>
                    <TH className="text-right">Amount</TH>
                    <TH className="text-right">Paid</TH>
                    <TH className="text-right">Balance</TH>
                    <TH>Status</TH>
                    <TH className="w-32">Actions</TH>
                  </TR>
                </THead>
                <TBody>
                  {filteredInstallments.length === 0 ? (
                    <tr><td colSpan={9}><EmptyState title="No payments match this filter" /></td></tr>
                  ) : (
                    pagedInstallments.map((i) => {
                      const buyer = getBuyerById(i.buyerId);
                      const balance = i.amount - i.paidAmount;
                      return (
                        <TR key={i.id}>
                          <TD className="font-medium text-neutral-900">{buyer?.name ?? "—"}</TD>
                          <TD>{i.plotId}</TD>
                          <TD>{i.installmentLabel} ({i.installmentNo} of {i.totalInstallments})</TD>
                          <TD>{formatDate(i.dueDate)}</TD>
                          <TD className="text-right">{formatINR(i.amount)}</TD>
                          <TD className="text-right">{formatINR(i.paidAmount)}</TD>
                          <TD className={cn("text-right", balance > 0 ? "font-medium text-status-sold" : "text-neutral-400")}>{formatINR(balance)}</TD>
                          <TD><StatusBadge tone={paymentStatusTone(i.status)} dot={false}>{i.status}</StatusBadge></TD>
                          <TD>
                            {i.status === "Paid" ? (
                              <button onClick={() => setReversalTarget(i)} className="text-xs font-medium text-status-sold hover:underline">
                                <Undo2 size={12} className="mr-1 inline" /> Reverse
                              </button>
                            ) : (
                              <button onClick={() => openRecordPayment(i)} className="text-xs font-medium text-brand-700 hover:underline">
                                Record Payment
                              </button>
                            )}
                          </TD>
                        </TR>
                      );
                    })
                  )}
                </TBody>
              </Table>
              {filteredInstallments.length > 0 && (
                <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} totalItems={filteredInstallments.length} pageSize={PAGE_SIZE} />
              )}
            </TableContainer>
          </CardContent>
        </Card>
      </div>

      <Modal
        open={!!payTarget}
        onClose={() => setPayTarget(null)}
        title="Record Payment"
        description={payTarget ? `${payTarget.installmentLabel} — Plot ${payTarget.plotId}` : undefined}
        footer={<>
          <Button variant="secondary" onClick={() => setPayTarget(null)}>Cancel</Button>
          <Button onClick={submitPayment}>Confirm Payment</Button>
        </>}
      >
        <div className="flex flex-col gap-4">
          <Input label="Amount (₹)" type="number" min={1} value={payAmount} onChange={(e) => setPayAmount(e.target.value)} required />
          <Select label="Payment Mode" value={payMode} onChange={(e) => setPayMode(e.target.value as PaymentTransaction["mode"])}>
            {(["UPI", "Bank Transfer", "Cheque", "Card", "Cash"] as PaymentTransaction["mode"][]).map((m) => <option key={m} value={m}>{m}</option>)}
          </Select>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!reversalTarget}
        onClose={() => setReversalTarget(null)}
        onConfirm={() => {
          toast({ variant: "warning", title: "Reversal request submitted", description: "A finance manager approval is required before this confirmed payment can be reversed." });
          setReversalTarget(null);
        }}
        tone="danger"
        title="Request payment reversal?"
        description="Confirmed payments cannot be edited directly. This will raise a controlled reversal request for finance manager approval."
        confirmLabel="Submit Reversal Request"
      />
    </div>
  );
}
