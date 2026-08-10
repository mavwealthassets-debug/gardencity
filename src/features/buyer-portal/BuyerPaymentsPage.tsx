import { useMemo, useState } from "react";
import { CreditCard, Download, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { StatusBadge, paymentStatusTone } from "@/components/common/StatusBadge";
import { Modal } from "@/components/common/Modal";
import { Select } from "@/components/common/Field";
import { RmContactBand } from "@/components/layout/RmContactBand";
import { useCurrentBuyer } from "./useCurrentBuyer";
import { useAppData } from "@/app/store";
import { useToast } from "@/app/toast";
import { formatDate, formatINR } from "@/lib/format";
import type { PaymentInstallment, PaymentTransaction } from "@/types";

type SimResult = "success" | "pending" | "failed" | null;

export default function BuyerPaymentsPage() {
  const { buyer, plot } = useCurrentBuyer();
  const { installments, transactions, recordPayment } = useAppData();
  const { toast } = useToast();

  const [payTarget, setPayTarget] = useState<PaymentInstallment | null>(null);
  const [mode, setMode] = useState<PaymentTransaction["mode"]>("UPI");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<SimResult>(null);

  const schedule = useMemo(
    () => installments.filter((i) => i.buyerId === buyer.id).sort((a, b) => a.installmentNo - b.installmentNo),
    [installments, buyer.id]
  );
  const history = useMemo(
    () => transactions.filter((t) => t.buyerId === buyer.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [transactions, buyer.id]
  );
  const nextInstallment = schedule.find((i) => i.status !== "Paid");

  function simulatePayment() {
    if (!payTarget) return;
    setProcessing(true);
    setResult(null);
    window.setTimeout(() => {
      const outcome: SimResult = Math.random() < 0.85 ? "success" : Math.random() < 0.6 ? "pending" : "failed";
      setProcessing(false);
      setResult(outcome);
      if (outcome === "success") {
        recordPayment(payTarget.id, payTarget.amount - payTarget.paidAmount, mode);
      }
    }, 1400);
  }

  function closePayModal() {
    if (result === "success") {
      toast({ variant: "success", title: "Payment successful (simulated)", description: `${formatINR(payTarget!.amount - payTarget!.paidAmount)} recorded for ${payTarget!.installmentLabel}.` });
    }
    setPayTarget(null);
    setResult(null);
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">Payments</h1>
        <p className="mt-1 text-sm text-neutral-500">Track your payment schedule and download receipts.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="min-h-[88px]"><CardContent className="flex h-full flex-col justify-center p-5"><p className="text-xs leading-4 text-neutral-500">Total Price</p><p className="mt-1 text-xl font-bold leading-7 text-neutral-900">{formatINR(plot.finalPrice)}</p></CardContent></Card>
        <Card className="min-h-[88px]"><CardContent className="flex h-full flex-col justify-center p-5"><p className="text-xs leading-4 text-neutral-500">Paid Amount</p><p className="mt-1 text-xl font-bold leading-7 text-status-available">{formatINR(plot.paidAmount ?? 0)}</p></CardContent></Card>
        <Card className="min-h-[88px]"><CardContent className="flex h-full flex-col justify-center p-5"><p className="text-xs leading-4 text-neutral-500">Balance Amount</p><p className="mt-1 text-xl font-bold leading-7 text-status-sold">{formatINR(plot.balanceAmount ?? 0)}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Payment Schedule</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] table-fixed text-sm">
              <colgroup>
                <col className="w-[30%]" />
                <col className="w-[16%]" />
                <col className="w-[16%]" />
                <col className="w-[16%]" />
                <col className="w-[13%]" />
                <col className="w-[9%]" />
              </colgroup>
              <thead className="text-left text-xs uppercase text-neutral-400">
                <tr>
                  <th className="py-2 pr-3">Milestone</th>
                  <th className="px-3 py-2">Due Date</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Paid On</th>
                  <th className="pl-3 py-2">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {schedule.map((i) => (
                  <tr key={i.id}>
                    <td className="truncate py-2.5 pr-3 font-medium text-neutral-800">{i.installmentLabel}</td>
                    <td className="whitespace-nowrap px-3 py-2.5">{formatDate(i.dueDate)}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right">{formatINR(i.amount)}</td>
                    <td className="px-3 py-2.5"><StatusBadge tone={paymentStatusTone(i.status)} dot={false}>{i.status}</StatusBadge></td>
                    <td className="whitespace-nowrap px-3 py-2.5">{i.paidOn ? formatDate(i.paidOn) : "—"}</td>
                    <td className="pl-3 py-2.5">
                      {i.status === "Paid" ? (
                        <button onClick={() => toast({ variant: "success", title: "Receipt downloaded" })} className="text-brand-700 hover:underline"><Download size={14} /></button>
                      ) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-neutral-900">Online Payment</p>
            <p className="text-sm text-neutral-500">You can pay your installment securely online.</p>
          </div>
          <Button disabled={!nextInstallment} onClick={() => nextInstallment && setPayTarget(nextInstallment)}>
            <CreditCard size={15} /> Pay Now
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Payment History</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] table-fixed text-sm">
              <colgroup>
                <col className="w-[18%]" />
                <col className="w-[18%]" />
                <col className="w-[14%]" />
                <col className="w-[16%]" />
                <col className="w-[24%]" />
                <col className="w-[10%]" />
              </colgroup>
              <thead className="text-left text-xs uppercase text-neutral-400">
                <tr>
                  <th className="py-2 pr-3">Date</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                  <th className="px-3 py-2">Mode</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Reference No.</th>
                  <th className="pl-3 py-2">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {history.map((t) => (
                  <tr key={t.id}>
                    <td className="whitespace-nowrap py-2.5 pr-3">{formatDate(t.date)}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right">{formatINR(t.amount)}</td>
                    <td className="whitespace-nowrap px-3 py-2.5">{t.mode}</td>
                    <td className="px-3 py-2.5"><StatusBadge tone="green" dot={false}>{t.status}</StatusBadge></td>
                    <td className="truncate px-3 py-2.5 font-mono text-xs">{t.referenceNo}</td>
                    <td className="pl-3 py-2.5"><button onClick={() => toast({ variant: "success", title: "Receipt downloaded" })} className="text-brand-700 hover:underline"><Download size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <RmContactBand rmId={buyer.assignedRmId} />

      <Modal open={!!payTarget} onClose={closePayModal} title="Pay Now" description="This is a simulated payment for prototype purposes only — no real transaction occurs.">
        {payTarget && (
          <div className="flex flex-col gap-4">
            {!processing && result === null && (
              <>
                <div className="rounded-lg bg-surface-subtle p-4 text-sm">
                  <div className="flex justify-between"><span className="text-neutral-500">Installment</span><span className="font-medium text-neutral-800">{payTarget.installmentLabel}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Amount Due</span><span className="font-semibold text-neutral-900">{formatINR(payTarget.amount - payTarget.paidAmount)}</span></div>
                </div>
                <Select label="Payment Mode" value={mode} onChange={(e) => setMode(e.target.value as PaymentTransaction["mode"])}>
                  {(["UPI", "Card", "Bank Transfer"] as PaymentTransaction["mode"][]).map((m) => <option key={m} value={m}>{m}</option>)}
                </Select>
                <Button onClick={simulatePayment}>Pay {formatINR(payTarget.amount - payTarget.paidAmount)}</Button>
              </>
            )}
            {processing && (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <Clock className="animate-spin text-brand-600" size={28} />
                <p className="text-sm text-neutral-600">Processing your payment simulation…</p>
              </div>
            )}
            {result === "success" && (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <CheckCircle2 className="text-status-available" size={40} />
                <p className="text-base font-semibold text-neutral-900">Payment Successful (Simulated)</p>
                <p className="text-sm text-neutral-500">This is a frontend simulation — no real payment was processed.</p>
                <Button className="mt-2" onClick={closePayModal}>Done</Button>
              </div>
            )}
            {result === "pending" && (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <Clock className="text-status-booked" size={40} />
                <p className="text-base font-semibold text-neutral-900">Payment Pending (Simulated)</p>
                <p className="text-sm text-neutral-500">Your bank is confirming this transaction. This is a simulated state.</p>
                <Button variant="secondary" className="mt-2" onClick={closePayModal}>Close</Button>
              </div>
            )}
            {result === "failed" && (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <XCircle className="text-status-sold" size={40} />
                <p className="text-base font-semibold text-neutral-900">Payment Failed (Simulated)</p>
                <p className="text-sm text-neutral-500">This is a simulated failure state for demo purposes.</p>
                <Button variant="secondary" className="mt-2" onClick={() => setResult(null)}>Try Again</Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
