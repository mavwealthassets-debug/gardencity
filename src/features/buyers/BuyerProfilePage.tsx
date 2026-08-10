import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Mail, Phone, MapPin, ChevronLeft, Pencil, FileText, Wallet, MessageSquare,
  Headset, Gift, LayoutGrid, CalendarCheck2, IndianRupee, Send, Bell,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Avatar } from "@/components/common/Avatar";
import { Tabs } from "@/components/common/Tabs";
import { StatusBadge, docStatusTone, paymentStatusTone, ticketStatusTone } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { ActivityTimeline } from "@/components/common/ActivityTimeline";
import { Dropdown, DropdownItem } from "@/components/common/Dropdown";
import { useAppData } from "@/app/store";
import { useToast } from "@/app/toast";
import { formatDate, formatDateTime, formatINR } from "@/lib/format";
import { relationshipManagers } from "@/data/users";
import { getInstallmentsForBuyer, getTransactionsForBuyer, loans } from "@/data/payments";
import { getDocumentsForBuyer } from "@/data/documents";
import { getCommunicationsForBuyer } from "@/data/communications";
import { getTicketsForBuyer } from "@/data/tickets";
import { getReferralsForBuyer } from "@/data/referrals";

const TABS = [
  { value: "overview", label: "Overview", icon: <LayoutGrid size={14} /> },
  { value: "documents", label: "Documents", icon: <FileText size={14} /> },
  { value: "payments", label: "Finance", icon: <Wallet size={14} /> },
  { value: "communication", label: "Communication", icon: <MessageSquare size={14} /> },
  { value: "support", label: "Support", icon: <Headset size={14} /> },
  { value: "referrals", label: "Referrals", icon: <Gift size={14} /> },
];

export default function BuyerProfilePage() {
  const { buyerId } = useParams<{ buyerId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { buyers, plots } = useAppData();
  const [tab, setTab] = useState("overview");

  const buyer = buyers.find((b) => b.id === buyerId);
  const plot = plots.find((p) => p.plotNo === buyer?.plotId);
  const rm = relationshipManagers.find((r) => r.id === buyer?.assignedRmId);

  const installments = useMemo(() => (buyer ? getInstallmentsForBuyer(buyer.id) : []), [buyer]);
  const transactions = useMemo(() => (buyer ? getTransactionsForBuyer(buyer.id) : []), [buyer]);
  const documents = useMemo(() => (buyer ? getDocumentsForBuyer(buyer.id) : []), [buyer]);
  const communications = useMemo(() => (buyer ? getCommunicationsForBuyer(buyer.id) : []), [buyer]);
  const tickets = useMemo(() => (buyer ? getTicketsForBuyer(buyer.id) : []), [buyer]);
  const referrals = useMemo(() => (buyer ? getReferralsForBuyer(buyer.id) : []), [buyer]);
  const loan = loans.find((l) => l.buyerId === buyer?.id);

  if (!buyer) {
    return (
      <div className="p-6">
        <EmptyState title="Buyer not found" description="This buyer record doesn't exist or was removed." action={<Button onClick={() => navigate("/admin/buyers")}>Back to Buyers</Button>} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-4 py-3 sm:px-6">
      <div className="flex items-end justify-between gap-4">
        <div><h1 className="text-lg font-bold text-neutral-900">Buyer Profile</h1><p className="mt-1 text-xs text-neutral-500"><button type="button" onClick={() => navigate("/admin/buyers")} className="hover:text-brand-700">Buyers</button><span className="mx-2">›</span>{buyer.name}</p></div>
        <div className="flex gap-2"><Button variant="secondary" size="sm" onClick={() => navigate("/admin/buyers")}><ChevronLeft size={14} /> Back to Buyers</Button><Dropdown trigger={({ onClick }) => <Button size="sm" onClick={onClick}>Actions</Button>}><DropdownItem onClick={() => toast({ variant: "success", title: "Note added" })}><Pencil size={14} /> Edit Buyer</DropdownItem><DropdownItem onClick={() => toast({ variant: "info", title: "Reminder scheduled" })}><Bell size={14} /> Set Reminder</DropdownItem><DropdownItem onClick={() => toast({ variant: "success", title: "Update sent" })}><Send size={14} /> Send Update</DropdownItem></Dropdown></div>
      </div>

      <div className="flex flex-col gap-3">
        <Card>
          <CardContent className="grid min-h-[126px] items-center gap-5 px-5 py-4" style={{ gridTemplateColumns: "minmax(300px,1.05fr) minmax(360px,1.2fr) minmax(240px,.8fr)" }}>
            <div className="flex items-center gap-4">
              <Avatar name={buyer.name} size="lg" />
              <div>
                <span className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-neutral-900">{buyer.name}</h2>
                  <StatusBadge tone={buyer.status === "Active" ? "green" : buyer.status === "Lead" ? "orange" : "gray"}>{buyer.status}</StatusBadge>
                </span>
                <div className="mt-2 flex flex-col gap-1 text-sm text-neutral-600">
                  <span className="flex items-center gap-1.5"><Phone size={13} /> {buyer.phone}</span>
                  <span className="flex items-center gap-1.5"><Mail size={13} /> {buyer.email}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={13} /> {buyer.city}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 items-center gap-x-10 gap-y-5 text-sm">
              <div><p className="text-xs text-neutral-400">Purpose</p><p className="font-medium text-neutral-800">{buyer.purpose}</p></div>
              <div><p className="text-xs text-neutral-400">Source</p><p className="font-medium text-neutral-800">{buyer.source}</p></div>
              <div><p className="text-xs text-neutral-400">Buyer Since</p><p className="font-medium text-neutral-800">{formatDate(buyer.buyerSince)}</p></div>
              <div>
                <p className="text-xs text-neutral-400">Assigned RM</p>
                <p className="font-medium text-neutral-800">{rm?.name ?? "Unassigned"}</p>
              </div>
              <div className="hidden"><p className="text-xs text-neutral-400">KYC Status</p><StatusBadge tone={buyer.kycStatus === "Verified" ? "green" : "orange"} dot={false}>{buyer.kycStatus}</StatusBadge></div>
              <div className="hidden"><p className="text-xs text-neutral-400">Registration</p><p className="font-medium text-neutral-800">{buyer.registrationStatus}</p></div>
            </div>

            <div className="flex min-h-[96px] flex-col justify-center rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-900">
              <p className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-brand-700">
                Internal Note <Pencil size={12} />
              </p>
              <p className="mt-1.5 italic">"{buyer.notes}"</p>
            </div>
          </CardContent>
        </Card>

          {plot && (
            <Card>
            <CardContent className="flex h-[106px] items-center gap-4 p-3">
              <img src="/sales-office-hero.png" alt="Garden City Naugaon" className="h-20 w-48 shrink-0 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="text-xs text-brand-700">Linked Property · Garden City Naugaon</p>
                <p className="text-base font-bold text-neutral-900">Plot {plot.plotNo}</p>
                <p className="text-xs text-neutral-500">{plot.areaSqYd} sq yd · {plot.facing} Facing · Block {plot.block}</p>
              </div>
              <div className="grid min-w-[560px] grid-cols-4 gap-x-6 gap-y-1 text-sm">
                <div><p className="text-xs text-neutral-400">Booking Date</p><p className="font-medium text-neutral-800">{plot.bookingDate ? formatDate(plot.bookingDate) : "—"}</p></div>
                <div><p className="text-xs text-neutral-400">Purchase Price</p><p className="font-medium text-neutral-800">{formatINR(plot.finalPrice)}</p></div>
                <div><p className="text-xs text-neutral-400">Amount Paid</p><p className="font-medium text-status-available">{formatINR(plot.paidAmount ?? 0)}</p></div>
                <div><p className="text-xs text-neutral-400">Balance Due</p><p className="font-medium text-status-sold">{formatINR(plot.balanceAmount ?? 0)}</p></div>
              </div>
            </CardContent>
            </Card>
          )}

        <Tabs tabs={TABS} value={tab} onChange={setTab} />

        {tab === "overview" && (
          <div className="grid gap-3" style={{ gridTemplateColumns: "minmax(0,2.1fr) minmax(280px,.9fr)" }}>
            <Card>
              <CardHeader><CardTitle>Journey Timeline</CardTitle></CardHeader>
              <CardContent>
                <JourneyTimeline buyer={buyer} communications={communications} transactions={transactions} />
              </CardContent>
            </Card>
            <div className="flex flex-col gap-3">
              <Card>
                <CardHeader><CardTitle>Referrals</CardTitle></CardHeader>
                <CardContent>
                  {referrals.length === 0 ? (
                    <EmptyState title="No referrals yet" className="py-6" />
                  ) : (
                    <ul className="flex flex-col gap-3">
                      {referrals.slice(0, 2).map((r) => (
                        <li key={r.id} className="rounded-lg border border-border p-3">
                          <p className="flex items-center justify-between text-sm font-semibold text-neutral-800">
                            {r.referredName}
                            <StatusBadge tone={r.status === "Converted" ? "green" : "blue"} dot={false}>{r.status}</StatusBadge>
                          </p>
                          <p className="text-xs text-neutral-400">Referred on {formatDate(r.referredOn)}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Next Follow-up</CardTitle></CardHeader>
                <CardContent>
                  {buyer.nextFollowUp ? (
                    <div className="rounded-lg bg-status-booked-bg p-3">
                      <p className="flex items-center gap-1.5 text-sm font-semibold text-status-booked"><Bell size={14} /> {buyer.nextFollowUp.note}</p>
                      <p className="mt-2 flex items-center justify-between text-xs text-neutral-500">
                        <span>Follow-up Date: {formatDate(buyer.nextFollowUp.date)}</span>
                        <span>Assigned To: {buyer.nextFollowUp.assignedTo}</span>
                      </p>
                      <Button className="mt-3 w-full" size="sm" onClick={() => toast({ variant: "success", title: "Follow-up marked as completed" })}>
                        Mark as Completed
                      </Button>
                    </div>
                  ) : (
                    <EmptyState title="No follow-up scheduled" className="py-6" />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {tab === "payments" && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle>Payment Schedule</CardTitle></CardHeader>
              <CardContent>
                {installments.length === 0 ? <EmptyState title="No payment schedule" className="py-8" /> : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px] text-sm">
                      <thead className="text-left text-xs uppercase text-neutral-400"><tr><th className="py-2">Installment</th><th>Due Date</th><th className="text-right">Amount</th><th className="text-right">Paid</th><th>Status</th></tr></thead>
                      <tbody className="divide-y divide-border">
                        {installments.map((i) => (
                          <tr key={i.id}>
                            <td className="whitespace-nowrap py-2.5 font-medium text-neutral-800">{i.installmentLabel}</td>
                            <td className="whitespace-nowrap">{formatDate(i.dueDate)}</td>
                            <td className="whitespace-nowrap text-right">{formatINR(i.amount)}</td>
                            <td className="whitespace-nowrap text-right">{formatINR(i.paidAmount)}</td>
                            <td><StatusBadge tone={paymentStatusTone(i.status)} dot={false}>{i.status}</StatusBadge></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
            <div className="flex flex-col gap-4">
              {loan && (
                <Card>
                  <CardHeader><CardTitle>Loan Information</CardTitle></CardHeader>
                  <CardContent className="flex flex-col gap-2 text-sm">
                    <Row label="Bank" value={loan.bankName} />
                    <Row label="Loan Amount" value={formatINR(loan.loanAmount)} />
                    <Row label="Disbursed" value={formatINR(loan.disbursedAmount)} />
                    <Row label="Account No." value={loan.accountNumberMasked} />
                    <Row label="IFSC" value={loan.ifsc} />
                  </CardContent>
                </Card>
              )}
              <Card>
                <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
                <CardContent>
                  {transactions.length === 0 ? <EmptyState title="No transactions" className="py-6" /> : (
                    <ul className="flex flex-col gap-3">
                      {transactions.slice(0, 5).map((t) => (
                        <li key={t.id} className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-neutral-600"><IndianRupee size={13} className="text-status-available" /> {formatDate(t.date)} · {t.mode}</span>
                          <span className="font-semibold text-neutral-900">{formatINR(t.amount)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {tab === "documents" && (
          <Card>
            <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
            <CardContent>
              {documents.length === 0 ? <EmptyState title="No documents uploaded" className="py-8" /> : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-sm">
                    <thead className="text-left text-xs uppercase text-neutral-400"><tr><th className="py-2">Document</th><th>Category</th><th>Uploaded</th><th>Status</th></tr></thead>
                    <tbody className="divide-y divide-border">
                      {documents.map((d) => (
                        <tr key={d.id}>
                          <td className="py-2.5 font-medium text-neutral-800">{d.name}</td>
                          <td>{d.category}</td>
                          <td>{formatDate(d.uploadDate)}</td>
                          <td><StatusBadge tone={docStatusTone(d.status)} dot={false}>{d.status}</StatusBadge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {tab === "communication" && (
          <Card>
            <CardHeader><CardTitle>Communication Timeline</CardTitle></CardHeader>
            <CardContent>
              {communications.length === 0 ? <EmptyState title="No communication logged" className="py-8" /> : (
                <ul className="flex flex-col gap-4">
                  {communications.map((c) => (
                    <li key={c.id} className="flex gap-3">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-status-info-bg text-status-info"><MessageSquare size={14} /></span>
                      <div className="min-w-0 flex-1">
                        <p className="flex flex-wrap items-center justify-between gap-2 text-sm font-medium text-neutral-800">
                          {c.subject}
                          {c.internal && <span className="rounded bg-status-purple-bg px-1.5 py-0.5 text-[10px] font-semibold text-status-purple">Internal</span>}
                        </p>
                        <p className="text-xs text-neutral-500">{c.body}</p>
                        <p className="mt-1 text-xs text-neutral-400">{c.channel} · {c.from} · {formatDateTime(c.date)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}

        {tab === "support" && (
          <Card>
            <CardHeader><CardTitle>Support Tickets</CardTitle></CardHeader>
            <CardContent>
              {tickets.length === 0 ? <EmptyState title="No support tickets" className="py-8" /> : (
                <ul className="flex flex-col gap-3">
                  {tickets.map((t) => (
                    <li key={t.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div>
                        <p className="text-sm font-semibold text-neutral-800">{t.subject}</p>
                        <p className="text-xs text-neutral-400">{t.id} · {formatDate(t.createdOn)}</p>
                      </div>
                      <StatusBadge tone={ticketStatusTone(t.status)} dot={false}>{t.status}</StatusBadge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )}

        {tab === "referrals" && (
          <Card>
            <CardHeader><CardTitle>Referrals</CardTitle></CardHeader>
            <CardContent>
              {referrals.length === 0 ? <EmptyState title="No referrals made" className="py-8" /> : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-sm">
                    <thead className="text-left text-xs uppercase text-neutral-400"><tr><th className="py-2">Referred</th><th>Status</th><th className="text-right">Reward</th><th className="text-right">Date</th></tr></thead>
                    <tbody className="divide-y divide-border">
                      {referrals.map((r) => (
                        <tr key={r.id}>
                          <td className="whitespace-nowrap py-2.5 font-medium text-neutral-800">{r.referredName}</td>
                          <td><StatusBadge tone={r.status === "Converted" ? "green" : "blue"} dot={false}>{r.status}</StatusBadge></td>
                          <td className="whitespace-nowrap text-right">{formatINR(r.rewardAmount)}</td>
                          <td className="whitespace-nowrap text-right">{formatDate(r.referredOn)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-neutral-500">{label}</span>
      <span className="font-medium text-neutral-800">{value}</span>
    </div>
  );
}

function JourneyTimeline({
  buyer,
  communications,
  transactions,
}: {
  buyer: { name: string };
  communications: ReturnType<typeof getCommunicationsForBuyer>;
  transactions: ReturnType<typeof getTransactionsForBuyer>;
}) {
  const events = useMemo(() => {
    const commEvents = communications.map((c) => ({ id: c.id, date: c.date, title: c.subject, description: c.body, icon: MessageSquare }));
    const payEvents = transactions.map((t) => ({ id: t.id, date: t.date, title: "Payment Received", description: `${t.mode} · Reference ${t.referenceNo}`, icon: IndianRupee }));
    return [...commEvents, ...payEvents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);
  }, [communications, transactions]);

  if (events.length === 0) return <EmptyState title={`No journey events for ${buyer.name} yet`} icon={<CalendarCheck2 size={22} />} className="py-8" />;

  return <ActivityTimeline events={events} />;
}
