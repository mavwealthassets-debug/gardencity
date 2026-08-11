import { useMemo, useState } from "react";
import { ArrowLeft, Clock3, Download, Plus, Search, ShieldAlert } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppData } from "@/app/store";
import { useToast } from "@/app/toast";
import { Button } from "@/components/common/Button";
import { Card, CardContent } from "@/components/common/Card";
import { Modal } from "@/components/common/Modal";
import { SearchInput } from "@/components/common/SearchInput";
import { StatusBadge, priorityTone, ticketStatusTone } from "@/components/common/StatusBadge";
import { Table, TableContainer, TBody, TD, TH, THead, TR } from "@/components/common/Table";
import { getBuyerById } from "@/data/buyers";
import { formatDateTime } from "@/lib/format";
import type { SupportTicket } from "@/types";

const METRICS = {
  open: { title: "Open Tickets", value: "58", trend: "+8 vs last 7 days", description: "New and open buyer requests awaiting action." },
  "in-progress": { title: "In Progress", value: "27", trend: "+5 vs last 7 days", description: "Support requests currently being handled by the service team." },
  resolved: { title: "Resolved Tickets", value: "142", trend: "+18 vs last 7 days", description: "Buyer issues resolved successfully by the support team." },
  "high-priority": { title: "High Priority", value: "12", trend: "+3 vs last 7 days", description: "Urgent support requests requiring immediate attention." },
  "response-time": { title: "Average Response Time", value: "3h 45m", trend: "18m faster vs last 7 days", description: "Response-time and SLA performance across buyer support tickets." },
} as const;

export default function SupportMetricDetailPage() {
  const { metric = "open" } = useParams();
  const navigate = useNavigate();
  const { tickets } = useAppData();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const key = metric in METRICS ? metric as keyof typeof METRICS : "open";
  const config = METRICS[key];

  const records = useMemo(() => tickets.filter((ticket) => {
    if (key === "open") return ticket.status === "Open";
    if (key === "in-progress") return ticket.status === "In Progress";
    if (key === "resolved") return ticket.status === "Resolved" || ticket.status === "Closed";
    if (key === "high-priority") return ticket.priority === "High";
    return true;
  }), [key, tickets]);

  const filtered = records.filter((ticket) => {
    const buyer = getBuyerById(ticket.buyerId)?.name ?? "";
    return `${ticket.id} ${buyer} ${ticket.subject} ${ticket.category} ${ticket.assignedTo}`.toLowerCase().includes(query.toLowerCase());
  });
  const atRisk = records.filter((ticket) => ticket.slaState === "At Risk" || ticket.slaState === "Breached").length;
  const withinSla = records.filter((ticket) => ticket.slaState === "Within SLA").length;

  return <div className="px-4 pb-8 pt-6 sm:px-6"><div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5">
    <button type="button" onClick={() => navigate("/admin/support")} className="flex w-fit items-center gap-2 text-xs font-medium text-neutral-500 hover:text-brand-700"><ArrowLeft size={14} /> Support / {config.title}</button>
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">{config.title}</p><div className="mt-1.5 flex flex-wrap items-end gap-3"><h1 className="text-3xl font-bold leading-none">{config.value}</h1><span className="text-xs font-semibold text-brand-700">{config.trend}</span></div><p className="mt-3 max-w-2xl text-sm text-neutral-500">{config.description}</p></div><Button className="shrink-0" onClick={() => toast({ variant: "success", title: "New support ticket created" })}><Plus size={15} /> New Ticket</Button></div>
    <div className="grid gap-3 sm:grid-cols-3"><Summary label="Available records" value={String(records.length)} icon={Search} /><Summary label="Within SLA" value={String(withinSla)} icon={Clock3} /><Summary label="At risk / breached" value={String(atRisk)} icon={ShieldAlert} /></div>
    <Card className="overflow-hidden"><CardContent className="p-5 sm:p-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><SearchInput value={query} onChange={setQuery} placeholder={`Search ${config.title.toLowerCase()}...`} containerClassName="w-full sm:max-w-[400px]" /><Button variant="secondary" onClick={() => toast({ variant: "success", title: "Export started", description: `${config.title} records are being prepared.` })}><Download size={14} /> Export</Button></div>
      <TableContainer className="mt-5 shadow-none [&_th]:h-12 [&_th]:px-5 [&_td]:px-5 [&_td]:py-4"><Table><THead><TR><TH>Ticket</TH><TH>Buyer</TH><TH>Subject</TH><TH>Category</TH><TH>Priority</TH><TH>Status</TH><TH>SLA</TH><TH>Assigned To</TH><TH className="text-right">Action</TH></TR></THead><TBody>{filtered.map((ticket) => <TR key={ticket.id}><TD className="whitespace-nowrap font-medium">{ticket.id}</TD><TD>{getBuyerById(ticket.buyerId)?.name ?? "Buyer"}</TD><TD><p className="max-w-xs truncate">{ticket.subject}</p></TD><TD>{ticket.category}</TD><TD><StatusBadge tone={priorityTone(ticket.priority)} dot={false}>{ticket.priority}</StatusBadge></TD><TD><StatusBadge tone={ticketStatusTone(ticket.status)} dot={false}>{ticket.status}</StatusBadge></TD><TD>{ticket.slaState}</TD><TD>{ticket.assignedTo}</TD><TD className="text-right"><Button variant="link" size="sm" onClick={() => setSelected(ticket)}>View</Button></TD></TR>)}</TBody></Table></TableContainer>
      {filtered.length === 0 && <div className="py-12 text-center text-sm text-neutral-500">No tickets match your search.</div>}
    </CardContent></Card>
  </div>
  <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.subject ?? "Ticket details"} description={selected ? `${selected.id} · ${getBuyerById(selected.buyerId)?.name ?? "Buyer"}` : undefined} footer={<Button onClick={() => setSelected(null)}>Close</Button>}>
    {selected && <div className="space-y-4"><p className="rounded-xl bg-surface-subtle p-4 text-sm leading-6 text-neutral-700">{selected.description}</p><div className="overflow-hidden rounded-xl border border-border">{[["Plot", selected.plotId ?? "—"], ["Category", selected.category], ["Priority", selected.priority], ["Status", selected.status], ["SLA", selected.slaState], ["Assigned To", selected.assignedTo], ["Created", formatDateTime(selected.createdOn)]].map(([label, value]) => <div key={label} className="grid grid-cols-[110px_1fr] gap-4 border-b border-border px-4 py-3 text-sm last:border-b-0"><span className="text-neutral-500">{label}</span><span className="font-medium">{value}</span></div>)}</div></div>}
  </Modal>
  </div>;
}

function Summary({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Search }) {
  return <Card className="min-h-[88px]"><CardContent className="flex h-full items-center gap-4 px-5 py-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700"><Icon size={20} /></span><div><p className="text-sm text-neutral-500">{label}</p><p className="mt-0.5 text-2xl font-bold leading-6">{value}</p></div></CardContent></Card>;
}
