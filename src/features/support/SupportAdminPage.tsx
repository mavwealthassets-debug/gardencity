import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquareText, Clock, CheckCircle2, AlertTriangle, Timer, Download, Plus, Send } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { MetricCard } from "@/components/common/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Tabs } from "@/components/common/Tabs";
import { SearchInput } from "@/components/common/SearchInput";
import { Select, Textarea } from "@/components/common/Field";
import { Button } from "@/components/common/Button";
import { TableContainer, Table, THead, TBody, TR, TH, TD } from "@/components/common/Table";
import { StatusBadge, ticketStatusTone, priorityTone } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Drawer } from "@/components/common/Drawer";
import { DonutChart } from "@/components/charts/DonutChart";
import { BarComparisonChart } from "@/components/charts/BarComparisonChart";
import { useAppData } from "@/app/store";
import { useToast } from "@/app/toast";
import { formatDateTime } from "@/lib/format";
import { getBuyerById } from "@/data/buyers";
import { salesExecutives } from "@/data/users";
import type { SupportTicket } from "@/types";
import { Pagination } from "@/components/common/Pagination";

const PAGE_SIZE = 8;

const STATUS_TABS = [
  { value: "all", label: "All Tickets" },
  { value: "Open", label: "Open" },
  { value: "In Progress", label: "In Progress" },
  { value: "Resolved", label: "Resolved" },
  { value: "On Hold", label: "On Hold" },
  { value: "Closed", label: "Closed" },
];

export default function SupportAdminPage() {
  const navigate = useNavigate();
  const { tickets, updateTicket, addTicketActivity } = useAppData();
  const { toast } = useToast();
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [active, setActive] = useState<SupportTicket | null>(null);
  const [note, setNote] = useState("");
  const [page, setPage] = useState(1);

  const counts = useMemo(
    () => ({
      all: tickets.length,
      Open: tickets.filter((t) => t.status === "Open").length,
      "In Progress": tickets.filter((t) => t.status === "In Progress").length,
      Resolved: tickets.filter((t) => t.status === "Resolved").length,
      "On Hold": tickets.filter((t) => t.status === "On Hold").length,
      Closed: tickets.filter((t) => t.status === "Closed").length,
    }),
    [tickets]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets
      .filter((t) => tab === "all" || t.status === tab)
      .filter((t) => priorityFilter === "all" || t.priority === priorityFilter)
      .filter((t) => {
        if (!q) return true;
        const buyer = getBuyerById(t.buyerId)?.name.toLowerCase() ?? "";
        return t.subject.toLowerCase().includes(q) || buyer.includes(q) || t.id.toLowerCase().includes(q);
      })
      .sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime());
  }, [tickets, tab, priorityFilter, query]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedTickets = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const slaData = useMemo(() => {
    const within = tickets.filter((t) => t.slaState === "Within SLA").length;
    const risk = tickets.filter((t) => t.slaState === "At Risk").length;
    const breached = tickets.filter((t) => t.slaState === "Breached").length;
    const none = tickets.filter((t) => t.slaState === "No SLA").length;
    return [
      { label: "Within SLA", value: within, color: "#16a34a" },
      { label: "At Risk", value: risk, color: "#f59e0b" },
      { label: "Breached", value: breached, color: "#ef4444" },
      { label: "No SLA", value: none, color: "#8a93a3" },
    ];
  }, [tickets]);

  const categoryData = useMemo(() => {
    const cats: SupportTicket["category"][] = ["Payments", "Registration", "Documentation", "Infrastructure", "Site Visit", "General Query"];
    return cats.map((c) => ({ category: c, tickets: tickets.filter((t) => t.category === c).length }));
  }, [tickets]);
  const detailTicket = active ?? pagedTickets[0];

  function addNote() {
    if (!active || !note.trim()) return;
    addTicketActivity(active.id, { id: `${active.id}-${Date.now()}`, type: "note", text: note, by: "Admin User", date: new Date().toISOString() });
    toast({ variant: "success", title: "Note added to ticket" });
    setNote("");
  }

  function setStatus(status: SupportTicket["status"]) {
    if (!active) return;
    updateTicket(active.id, { status });
    addTicketActivity(active.id, { id: `${active.id}-${Date.now()}`, type: "status", text: `Status changed to ${status}`, by: "Admin User", date: new Date().toISOString() });
    toast({ variant: "success", title: `Ticket marked as ${status}` });
    setActive((prev) => (prev ? { ...prev, status } : prev));
  }

  function reassign(agent: string) {
    if (!active) return;
    updateTicket(active.id, { assignedTo: agent });
    addTicketActivity(active.id, { id: `${active.id}-${Date.now()}`, type: "assigned", text: `Reassigned to ${agent}`, by: "Admin User", date: new Date().toISOString() });
    toast({ variant: "info", title: `Ticket reassigned to ${agent}` });
    setActive((prev) => (prev ? { ...prev, assignedTo: agent } : prev));
  }

  return (
    <div className="flex flex-col gap-5 pb-10">
      <PageHeader
        title="Support"
        description="Manage and resolve post-sale support tickets from buyers."
        actions={<>
          <Button variant="secondary" onClick={() => toast({ variant: "success", title: "Tickets exported" })}><Download size={15} /> Export</Button>
          <Button variant="secondary">Filters</Button>
          <Button onClick={() => toast({ variant: "success", title: "New ticket created" })}><Plus size={15} /> New Ticket</Button>
        </>}
      />

      <div className="relative flex flex-col gap-3 px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:mr-[332px] xl:grid-cols-5">
          <MetricCard label="Open Tickets" value="58" icon={MessageSquareText} iconTone="green" sublabel="↗ 8 vs last 7 days" sparkline={[2,3,2,4,3,6,4,8]} onClick={() => navigate("/admin/support/open")} />
          <MetricCard label="In Progress" value="27" icon={Clock} iconTone="blue" sublabel="↗ 5 vs last 7 days" sparkline={[4,3,5,4,6,5,4,3]} sparklineTone="blue" onClick={() => navigate("/admin/support/in-progress")} />
          <MetricCard label="Resolved" value="142" icon={CheckCircle2} iconTone="green" sublabel="↗ 18 vs last 7 days" sparkline={[2,2,3,4,3,5,4,8]} onClick={() => navigate("/admin/support/resolved")} />
          <MetricCard label="High Priority" value="12" icon={AlertTriangle} iconTone="red" sublabel="↗ 3 vs last 7 days" sparkline={[4,2,3,2,5,4,3,7]} sparklineTone="red" onClick={() => navigate("/admin/support/high-priority")} />
          <MetricCard label="Avg. Response Time" value="3h 45m" icon={Timer} iconTone="purple" sublabel="↘ 18m vs last 7 days" sparkline={[2,3,3,4,5,4,6,7]} sparklineTone="purple" onClick={() => navigate("/admin/support/response-time")} />
        </div>

        <Card className="xl:mr-[332px]">
          <CardContent className="flex flex-col gap-3 p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Tabs tabs={STATUS_TABS.map((t) => ({ ...t, count: counts[t.value as keyof typeof counts] }))} value={tab} onChange={(value) => { setTab(value); setPage(1); }} className="border-b-0" />
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1.5fr_1fr_1fr_1fr]">
              <SearchInput value={query} onChange={(value) => { setQuery(value); setPage(1); }} placeholder="Search tickets by ID, buyer, subject..." />
              <Select defaultValue="all" aria-label="Filter by category"><option value="all">All Categories</option><option>Infrastructure</option><option>Payments</option><option>Registration</option><option>Documentation</option><option>Site Visit</option></Select>
              <Select value={priorityFilter} onChange={(e) => { setPriorityFilter(e.target.value); setPage(1); }} aria-label="Filter by priority">
                <option value="all">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Select>
              <Select defaultValue="all" aria-label="Filter by status"><option value="all">All Statuses</option><option>Open</option><option>In Progress</option><option>Resolved</option><option>Closed</option></Select>
            </div>

            <TableContainer className="shadow-none text-xs [&_th]:py-2 [&_td]:py-2">
              <Table className="min-w-0 table-fixed text-[10px] [&_th]:px-1.5 [&_td]:px-1.5">
                <THead>
                  <TR>
                    <TH className="w-[13%]">Ticket ID</TH><TH className="w-[12%]">Buyer</TH><TH className="w-[8%]">Plot</TH><TH className="w-[12%]">Category</TH><TH className="w-[21%]">Subject</TH><TH className="w-[9%]">Priority</TH><TH className="w-[11%]">Assigned</TH><TH className="w-[9%]">Created</TH><TH className="w-[9%]">Status</TH>
                  </TR>
                </THead>
                <TBody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={9}><EmptyState title="No tickets match this filter" /></td></tr>
                  ) : (
                    pagedTickets.map((t) => (
                      <TR key={t.id} className="cursor-pointer" onClick={() => setActive(t)}>
                        <TD className="font-mono text-xs font-semibold text-neutral-900">{t.id}</TD>
                        <TD>{getBuyerById(t.buyerId)?.name ?? "—"}</TD>
                        <TD>{t.plotId ?? "—"}</TD>
                        <TD className="truncate">{t.category}</TD>
                        <TD className="max-w-[220px] truncate">{t.subject}</TD>
                        <TD><StatusBadge tone={priorityTone(t.priority)} dot={false}>{t.priority}</StatusBadge></TD>
                        <TD>{t.assignedTo}</TD>
                        <TD className="truncate">{formatDateTime(t.createdOn)}</TD>
                        <TD><StatusBadge tone={ticketStatusTone(t.status)} dot={false}>{t.status}</StatusBadge></TD>
                      </TR>
                    ))
                  )}
                </TBody>
              </Table>
              {filtered.length > 0 && (
                <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />
              )}
            </TableContainer>
          </CardContent>
        </Card>

        {detailTicket && (
          <Card className="xl:absolute xl:right-6 xl:top-0 xl:h-auto xl:w-[308px] xl:overflow-hidden">
            <CardHeader className="border-b border-border py-3"><CardTitle>Ticket Details</CardTitle><StatusBadge tone={priorityTone(detailTicket.priority)}>{detailTicket.priority}</StatusBadge></CardHeader>
            <CardContent className="flex flex-col gap-3 p-4 text-xs">
              <div className="flex items-center justify-between"><span className="rounded bg-emerald-50 px-2 py-1 font-mono text-[10px] font-semibold text-emerald-700">{detailTicket.id}</span><StatusBadge tone={ticketStatusTone(detailTicket.status)}>{detailTicket.status}</StatusBadge></div>
              <div className="grid grid-cols-2 gap-3 border-b border-border pb-3"><div><p className="font-semibold">{getBuyerById(detailTicket.buyerId)?.name}</p><p className="text-neutral-500">{getBuyerById(detailTicket.buyerId)?.phone}</p></div><div><p className="text-neutral-500">Plot</p><p className="font-semibold">{detailTicket.plotId ?? "—"}</p></div></div>
              <div><p className="mb-1 font-semibold">Subject</p><p className="text-neutral-600">{detailTicket.subject}</p></div>
              <div><p className="mb-1 font-semibold">Description</p><p className="leading-relaxed text-neutral-600">{detailTicket.description}</p></div>
              <div><p className="mb-2 font-semibold">Activity Timeline</p><ol className="space-y-3 border-l border-border pl-3">{detailTicket.activity.slice(0,4).map((a)=><li key={a.id} className="relative"><span className="absolute -left-[17px] top-1 h-2 w-2 rounded-full bg-brand-600"/><p className="font-medium">{a.text}</p><p className="text-[10px] text-neutral-400">{a.by} · {formatDateTime(a.date)}</p></li>)}</ol></div>
              <div className="space-y-2 border-t border-border pt-3"><Select defaultValue={detailTicket.status} aria-label="Update status"><option>Open</option><option>In Progress</option><option>Resolved</option></Select><Select defaultValue={detailTicket.assignedTo} aria-label="Assign to">{salesExecutives.map((s)=><option key={s}>{s}</option>)}</Select><Button className="w-full" size="sm">Update Ticket</Button><Button variant="dangerOutline" className="w-full" size="sm">Close Ticket</Button></div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-3 xl:mr-[332px] xl:grid-cols-3">
          <Card className="h-[190px] overflow-hidden">
            <CardHeader className="py-3"><CardTitle>SLA Status Overview</CardTitle></CardHeader>
            <CardContent className="flex items-center gap-3 pb-3">
              <DonutChart data={slaData} centerValue="227" centerLabel="Total Tickets" size={105} />
              <ul className="flex flex-col gap-2 text-sm">
                {slaData.map((s) => (
                  <li key={s.label} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />{s.label} <span className="font-semibold">{s.value}</span></li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="h-[190px] overflow-hidden">
            <CardHeader className="py-3"><CardTitle>Tickets by Category</CardTitle></CardHeader>
            <CardContent>
              <BarComparisonChart height={120} data={categoryData} xKey="category" series={[{ key: "tickets", label: "Tickets", color: "#3b82f6" }]} />
            </CardContent>
          </Card>
          <Card className="h-[190px] overflow-hidden">
            <CardHeader className="py-3"><CardTitle>Top 5 High Priority Tickets</CardTitle></CardHeader>
            <CardContent className="space-y-2 pb-3">{tickets.filter((t)=>t.priority === "High").slice(0,5).map((t)=><div key={t.id} className="flex items-center justify-between gap-2 text-[11px]"><span className="truncate font-mono">{t.id}</span><span className="truncate text-neutral-500">{t.subject}</span><StatusBadge tone="red">High</StatusBadge></div>)}</CardContent>
          </Card>
        </div>
      </div>

      <Drawer
        open={false}
        onClose={() => setActive(null)}
        title={active?.subject ?? ""}
        subtitle={active && <span className="flex items-center gap-2"><span className="font-mono text-xs">{active.id}</span><StatusBadge tone={priorityTone(active.priority)} dot={false}>{active.priority}</StatusBadge></span>}
        footer={
          active && (
            <div className="flex w-full flex-wrap gap-2">
              <Select value={active.assignedTo} onChange={(e) => reassign(e.target.value)} className="flex-1" aria-label="Reassign ticket">
                {salesExecutives.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
              <Button variant="secondary" onClick={() => setStatus("In Progress")}>Escalate</Button>
              <Button onClick={() => setStatus("Resolved")}>Resolve</Button>
            </div>
          )
        }
      >
        {active && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-neutral-400">Buyer</p><p className="font-medium text-neutral-800">{getBuyerById(active.buyerId)?.name}</p></div>
              <div><p className="text-xs text-neutral-400">Plot</p><p className="font-medium text-neutral-800">{active.plotId ?? "—"}</p></div>
              <div><p className="text-xs text-neutral-400">Category</p><p className="font-medium text-neutral-800">{active.category}</p></div>
              <div><p className="text-xs text-neutral-400">SLA State</p><StatusBadge tone={active.slaState === "Within SLA" ? "green" : active.slaState === "At Risk" ? "orange" : active.slaState === "Breached" ? "red" : "gray"} dot={false}>{active.slaState}</StatusBadge></div>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">Description</p>
              <p className="text-sm text-neutral-600">{active.description}</p>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">Activity Timeline</p>
              <ol className="flex flex-col gap-3 border-l border-border pl-4">
                {active.activity.map((a) => (
                  <li key={a.id} className="relative text-sm">
                    <span className="absolute -left-[19px] top-1 h-2.5 w-2.5 rounded-full bg-brand-600" />
                    <p className="text-neutral-700">{a.text}</p>
                    <p className="text-xs text-neutral-400">{a.by} · {formatDateTime(a.date)}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <Textarea label="Add response / internal note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Type an update for the buyer or an internal note..." rows={3} />
              <Button size="sm" className="mt-2" onClick={addNote}><Send size={13} /> Add Note</Button>
            </div>
            <Button variant="dangerOutline" size="sm" onClick={() => setStatus("Closed")}><Timer size={13} /> Close Ticket</Button>
          </div>
        )}
      </Drawer>
    </div>
  );
}
