import { useMemo, useState } from "react";
import { ArrowLeft, CalendarClock, Download, Phone, Plus, Search, Send } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppData } from "@/app/store";
import { useToast } from "@/app/toast";
import { Button } from "@/components/common/Button";
import { Card, CardContent } from "@/components/common/Card";
import { SearchInput } from "@/components/common/SearchInput";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Modal } from "@/components/common/Modal";
import { Table, TableContainer, TBody, TD, TH, THead, TR } from "@/components/common/Table";
import { communications } from "@/data/communications";
import { referrals } from "@/data/referrals";
import { tickets } from "@/data/tickets";
import { formatDate, formatDateTime } from "@/lib/format";

type DetailRow = { id: string; name: string; reference: string; detail: string; owner: string; date: string; status: string };

const METRICS = {
  active: { title: "Active Relationships", value: "186", trend: "12.5%", description: "Buyers with an active plot relationship and assigned relationship manager." },
  "follow-ups": { title: "Follow-ups Due", value: "34", trend: "18.2%", description: "Upcoming buyer follow-ups that need attention from the relationship team." },
  updates: { title: "Updates Sent", value: "128", trend: "22.4%", description: "Project, payment, registration and engagement updates sent to buyers." },
  meetings: { title: "Meetings Scheduled", value: "27", trend: "8.3%", description: "Buyer meetings, site visits and relationship reviews scheduled by the team." },
  referrals: { title: "Referral Requests", value: "19", trend: "5.6%", description: "Referral leads submitted by existing Garden City buyers." },
  "support-calls": { title: "Support Calls", value: "41", trend: "11.7%", description: "Buyer calls and support conversations handled by the service team." },
} as const;

export default function RelationshipMetricDetailPage() {
  const { metric = "active" } = useParams();
  const navigate = useNavigate();
  const { buyers } = useAppData();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [selectedRow, setSelectedRow] = useState<DetailRow | null>(null);
  const key = metric in METRICS ? metric as keyof typeof METRICS : "active";
  const config = METRICS[key];

  const rows = useMemo<DetailRow[]>(() => {
    if (key === "active") return buyers.filter((buyer) => buyer.plotId).map((buyer) => ({ id: buyer.id, name: buyer.name, reference: buyer.plotId ?? "—", detail: buyer.phone, owner: buyer.nextFollowUp?.assignedTo ?? "Relationship Team", date: buyer.buyerSince, status: buyer.status }));
    if (key === "follow-ups") return buyers.filter((buyer) => buyer.nextFollowUp).map((buyer) => ({ id: buyer.id, name: buyer.name, reference: buyer.plotId ?? "—", detail: buyer.nextFollowUp?.note ?? "Buyer follow-up", owner: buyer.nextFollowUp?.assignedTo ?? "Relationship Team", date: buyer.nextFollowUp?.date ?? buyer.buyerSince, status: "Due" }));
    if (key === "referrals") return referrals.map((referral) => ({ id: referral.id, name: referral.referredName, reference: referral.plotId ?? "Lead", detail: referral.referredEmail, owner: buyers.find((buyer) => buyer.id === referral.referrerBuyerId)?.name ?? "Buyer", date: referral.referredOn, status: referral.status }));
    if (key === "support-calls") {
      const calls = communications.filter((item) => item.channel === "Call").map((item) => ({ id: item.id, name: buyers.find((buyer) => buyer.id === item.buyerId)?.name ?? "Buyer", reference: "Call", detail: item.subject, owner: item.from, date: item.date, status: item.status }));
      const support = tickets.slice(0, 8).map((ticket) => ({ id: ticket.id, name: buyers.find((buyer) => buyer.id === ticket.buyerId)?.name ?? "Buyer", reference: ticket.plotId ?? "—", detail: ticket.subject, owner: ticket.assignedTo, date: ticket.createdOn, status: ticket.status }));
      return [...calls, ...support];
    }
    const channel = key === "meetings" ? "Meeting" : null;
    return communications.filter((item) => channel ? item.channel === channel : !["Call", "Meeting"].includes(item.channel)).map((item) => ({ id: item.id, name: buyers.find((buyer) => buyer.id === item.buyerId)?.name ?? "Buyer", reference: item.channel, detail: item.subject, owner: item.from, date: item.date, status: item.status }));
  }, [buyers, key]);

  const filteredRows = rows.filter((row) => `${row.name} ${row.reference} ${row.detail} ${row.owner} ${row.status}`.toLowerCase().includes(query.toLowerCase()));
  const openCount = rows.filter((row) => ["Open", "Due", "In Progress", "Interested", "Eligible"].includes(row.status)).length;

  function runPrimaryAction() {
    const actions = { active: "Relationship added", "follow-ups": "Follow-up scheduled", updates: "Update composer opened", meetings: "Meeting scheduled", referrals: "Referral request created", "support-calls": "Support call logged" } as const;
    toast({ variant: "success", title: actions[key], description: `${config.title} has been updated.` });
  }

  return <div className="px-4 pb-8 pt-6 sm:px-6">
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5">
    <button type="button" onClick={() => navigate("/admin/relationships")} className="flex w-fit items-center gap-2 text-xs font-medium leading-5 text-neutral-500 hover:text-brand-700"><ArrowLeft size={14} /> Relationships / {config.title}</button>
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">{config.title}</p><div className="mt-1.5 flex flex-wrap items-end gap-x-3 gap-y-1"><h1 className="text-3xl font-bold leading-none">{config.value}</h1><span className="text-xs font-semibold leading-5 text-brand-700">+{config.trend} vs last month</span></div><p className="mt-3 max-w-2xl text-sm leading-5 text-neutral-500">{config.description}</p></div><Button className="shrink-0" onClick={runPrimaryAction}><Plus size={15} /> {key === "updates" ? "Send Update" : key === "support-calls" ? "Log Call" : key === "meetings" ? "Schedule Meeting" : "Add Record"}</Button></div>

    <div className="grid gap-3 sm:grid-cols-3"><SummaryCard label="Available dummy records" value={String(rows.length)} icon={Search} /><SummaryCard label="Needs attention" value={String(openCount)} icon={CalendarClock} /><SummaryCard label="Completed / closed" value={String(Math.max(0, rows.length - openCount))} icon={key === "support-calls" ? Phone : Send} /></div>

    <Card className="overflow-hidden"><CardContent className="p-5 sm:p-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><SearchInput value={query} onChange={setQuery} placeholder={`Search ${config.title.toLowerCase()}...`} containerClassName="w-full sm:max-w-[400px]" /><Button className="shrink-0" variant="secondary" onClick={() => toast({ variant: "success", title: "Export started", description: `${config.title} records are being prepared.` })}><Download size={14} /> Export</Button></div>
      <TableContainer className="mt-5 shadow-none [&_th]:h-12 [&_th]:px-5 [&_td]:px-5 [&_td]:py-4"><Table><THead><TR><TH className="w-[16%]">Name</TH><TH className="w-[12%]">Reference</TH><TH className="w-[22%]">Details</TH><TH className="w-[17%]">Owner</TH><TH className="w-[14%]">Date</TH><TH className="w-[11%]">Status</TH><TH className="w-[8%] text-right">Action</TH></TR></THead><TBody>{filteredRows.map((row) => <TR key={row.id}><TD className="font-medium">{row.name}</TD><TD className="whitespace-nowrap">{row.reference}</TD><TD><p className="max-w-sm truncate">{row.detail}</p></TD><TD>{row.owner}</TD><TD className="whitespace-nowrap">{row.date.includes("T") ? formatDateTime(row.date) : formatDate(row.date)}</TD><TD><StatusBadge tone={["Resolved", "Closed", "Converted", "Active"].includes(row.status) ? "green" : ["Open", "Due"].includes(row.status) ? "red" : "blue"} dot={false}>{row.status}</StatusBadge></TD><TD className="text-right"><Button variant="link" size="sm" onClick={() => setSelectedRow(row)}>View</Button></TD></TR>)}</TBody></Table></TableContainer>
      {filteredRows.length === 0 && <div className="py-12 text-center text-sm text-neutral-500">No records match your search.</div>}
    </CardContent></Card>
    </div>
    <Modal open={!!selectedRow} onClose={() => setSelectedRow(null)} title={selectedRow?.name ?? "Record details"} description={selectedRow ? `${config.title} · ${selectedRow.reference}` : undefined} footer={<Button onClick={() => setSelectedRow(null)}>Close</Button>}>
      {selectedRow && <div className="overflow-hidden rounded-xl border border-border">
        {[["Reference", selectedRow.reference], ["Details", selectedRow.detail], ["Owner", selectedRow.owner], ["Date", selectedRow.date.includes("T") ? formatDateTime(selectedRow.date) : formatDate(selectedRow.date)], ["Status", selectedRow.status]].map(([label, value]) => <div key={label} className="grid grid-cols-[120px_1fr] gap-4 border-b border-border px-4 py-3 text-sm last:border-b-0"><span className="text-neutral-500">{label}</span><span className="font-medium text-neutral-900">{value}</span></div>)}
      </div>}
    </Modal>
  </div>;
}

function SummaryCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Search }) {
  return <Card className="min-h-[88px]"><CardContent className="flex h-full items-center gap-4 px-5 py-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700"><Icon size={20} /></span><div className="min-w-0"><p className="truncate text-sm leading-5 text-neutral-500">{label}</p><p className="mt-0.5 text-2xl font-bold leading-6">{value}</p></div></CardContent></Card>;
}
