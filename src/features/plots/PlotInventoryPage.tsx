import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Download, Grid3x3, Layers, Plus, SlidersHorizontal, Tag, CalendarCheck, CheckCircle2 } from "lucide-react";
import { MetricCard } from "@/components/common/MetricCard";
import { Card } from "@/components/common/Card";
import { SearchInput } from "@/components/common/SearchInput";
import { Select } from "@/components/common/Field";
import { Button } from "@/components/common/Button";
import { TableContainer, Table, THead, TBody, TR, TH, TD } from "@/components/common/Table";
import { StatusBadge, plotStatusTone } from "@/components/common/StatusBadge";
import { Pagination } from "@/components/common/Pagination";
import { DonutChart, DonutLegend } from "@/components/charts/DonutChart";
import { useAppData } from "@/app/store";
import { useToast } from "@/app/toast";
import { formatINR, formatDate } from "@/lib/format";
import { getBuyerById } from "@/data/buyers";
import { gardenCityProject } from "@/data/project";
import type { Plot } from "@/types";
import { PlotDetailDrawer } from "./PlotDetailDrawer";

const PAGE_SIZE = 10;

export default function PlotInventoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { plots } = useAppData();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const requestedStatus = searchParams.get("status");
  const statusFilter = ["available", "booked", "sold", "reserved"].includes(requestedStatus ?? "") ? requestedStatus! : "all";
  const [typeFilter, setTypeFilter] = useState("all");
  const [facingFilter, setFacingFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activePlot, setActivePlot] = useState<Plot | null>(null);

  const stats = useMemo(() => ({
    total: plots.length,
    available: plots.filter((p) => p.status === "available").length,
    booked: plots.filter((p) => p.status === "booked").length,
    sold: plots.filter((p) => p.status === "sold").length,
    reserved: plots.filter((p) => p.status === "reserved").length,
  }), [plots]);
  const donutData = useMemo(() => {
    const colors = ["#16a34a", "#3b82f6", "#f59e0b"];
    return gardenCityProject.plotCategories.map((c, i) => ({ label: c.label, value: c.count, color: colors[i] }));
  }, []);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return plots.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (facingFilter !== "all" && p.facing !== facingFilter) return false;
      if (typeFilter !== "all" && (typeFilter === "corner") !== p.isCorner) return false;
      if (sizeFilter !== "all" && p.category !== sizeFilter) return false;
      const buyer = p.buyerId ? getBuyerById(p.buyerId)?.name.toLowerCase() : "";
      return !q || p.plotNo.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || buyer?.includes(q);
    });
  }, [plots, query, statusFilter, typeFilter, facingFilter, sizeFilter]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const applyStatusFilter = (status: string) => {
    setPage(1);
    setSearchParams(status === "all" ? {} : { status });
  };
  const reset = () => { setQuery(""); applyStatusFilter("all"); setTypeFilter("all"); setFacingFilter("all"); setSizeFilter("all"); setPage(1); };
  const toggle = (id: string) => setSelected((old) => { const next = new Set(old); if (next.has(id)) next.delete(id); else next.add(id); return next; });

  return (
    <div className="flex flex-col gap-3 px-4 py-3 sm:px-6">
      <div className="flex items-end justify-between gap-4">
        <div><h1 className="text-lg font-bold text-neutral-900">Plot Inventory</h1><p className="text-xs text-neutral-500">Manage and track all plots in your project</p></div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => toast({ variant: "success", title: "Add Plot", description: "Plot creation form would open here." })}><Plus size={14} /> Add Plot</Button>
          <Button variant="secondary" size="sm" onClick={() => toast({ variant: "info", title: `Bulk update on ${selected.size} plots`, description: "Bulk actions are simulated." })}><Layers size={14} /> Bulk Update</Button>
          <Button variant="secondary" size="sm" onClick={() => toast({ variant: "success", title: "Export started", description: `Preparing CSV for ${filtered.length} plots.` })}><Download size={14} /> Export</Button>
        </div>
      </div>

      <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr)) minmax(300px, 1.7fr)" }}>
        <MetricCard className="h-[112px]" label="Total Plots" value={String(stats.total)} icon={Grid3x3} sublabel="100% of total" progressPercent={100} onClick={() => applyStatusFilter("all")} />
        <MetricCard className="h-[112px]" label="Available" value={String(stats.available)} icon={Tag} iconTone="blue" sublabel={`${((stats.available / stats.total) * 100).toFixed(2)}% of total`} progressPercent={(stats.available / stats.total) * 100} onClick={() => applyStatusFilter("available")} />
        <MetricCard className="h-[112px]" label="Booked" value={String(stats.booked)} icon={CalendarCheck} iconTone="orange" sublabel={`${((stats.booked / stats.total) * 100).toFixed(2)}% of total`} progressPercent={(stats.booked / stats.total) * 100} onClick={() => applyStatusFilter("booked")} />
        <MetricCard className="h-[112px]" label="Sold" value={String(stats.sold)} icon={CheckCircle2} sublabel={`${((stats.sold / stats.total) * 100).toFixed(2)}% of total`} progressPercent={(stats.sold / stats.total) * 100} onClick={() => applyStatusFilter("sold")} />
        <MetricCard className="h-[112px]" label="Reserved" value={String(stats.reserved)} icon={Layers} iconTone="purple" sublabel={`${((stats.reserved / stats.total) * 100).toFixed(2)}% of total`} progressPercent={(stats.reserved / stats.total) * 100} onClick={() => applyStatusFilter("reserved")} />
        <Card className="flex h-[112px] min-w-0 flex-col p-3"><p className="text-xs font-semibold text-neutral-800">Plot Size Distribution (by Plot Count)</p><div className="flex min-h-0 flex-1 items-center gap-3"><DonutChart data={donutData} size={82} /><DonutLegend data={donutData} /></div></Card>
      </div>

      <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(4, minmax(120px, 1fr)) minmax(280px, 2fr) auto auto" }}>
        <Select value={statusFilter} onChange={(e) => applyStatusFilter(e.target.value)} className="h-9 text-xs"><option value="all">All Status</option><option value="available">Available</option><option value="booked">Booked</option><option value="sold">Sold</option><option value="reserved">Reserved</option></Select>
        <Select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }} className="h-9 text-xs"><option value="all">All Types</option><option value="residential">Residential</option><option value="corner">Corner</option></Select>
        <Select value={facingFilter} onChange={(e) => { setFacingFilter(e.target.value); setPage(1); }} className="h-9 text-xs"><option value="all">All Facing</option>{["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"].map((f) => <option key={f}>{f}</option>)}</Select>
        <Select value={sizeFilter} onChange={(e) => { setSizeFilter(e.target.value); setPage(1); }} className="h-9 text-xs"><option value="all">All Sizes</option>{gardenCityProject.plotCategories.map((c) => <option key={c.label}>{c.label}</option>)}</Select>
        <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search by Plot No., Buyer or Type..." className="h-9 text-xs" />
        <Button variant="secondary" size="sm"><SlidersHorizontal size={14} /> Filters</Button>
        <Button variant="ghost" size="sm" onClick={reset}>Reset</Button>
      </div>

      <TableContainer>
        <Table className="min-w-[1120px] text-xs">
          <THead><TR><TH className="w-9 px-3 py-2"><input type="checkbox" aria-label="Select all rows" checked={selected.size === pageItems.length && pageItems.length > 0} onChange={() => setSelected(selected.size === pageItems.length ? new Set() : new Set(pageItems.map((p) => p.id)))} /></TH><TH className="px-3 py-2">Plot No.</TH><TH className="px-3 py-2">Size (sq yd)</TH><TH className="px-3 py-2">Facing</TH><TH className="px-3 py-2">Type</TH><TH className="px-3 py-2">Status</TH><TH className="px-3 py-2">Buyer</TH><TH className="px-3 py-2 text-right">Base Price</TH><TH className="px-3 py-2 text-right">Final Price</TH><TH className="px-3 py-2">Payment Status</TH><TH className="px-3 py-2">Last Updated</TH><TH className="w-8 px-2 py-2" /></TR></THead>
          <TBody>{pageItems.map((p, index) => { const buyer = p.buyerId ? getBuyerById(p.buyerId) : undefined; const paid = p.paidAmount ?? 0; const payment = paid >= p.finalPrice ? "Fully Paid" : paid > 0 ? (p.status === "booked" ? "Booking Paid" : "Partially Paid") : "—"; return <TR key={p.id} className="h-[38px] cursor-pointer" onClick={() => setActivePlot(p)}><TD className="px-3 py-1.5" onClick={(e) => e.stopPropagation()}><input type="checkbox" aria-label={`Select ${p.plotNo}`} checked={selected.has(p.id)} onChange={() => toggle(p.id)} /></TD><TD className="px-3 py-1.5 font-semibold text-neutral-900">{p.plotNo}</TD><TD className="px-3 py-1.5">{p.areaSqYd}</TD><TD className="px-3 py-1.5">{p.facing}</TD><TD className="px-3 py-1.5">{p.isCorner ? "Corner" : "Residential"}</TD><TD className="px-3 py-1.5"><StatusBadge tone={plotStatusTone(p.status)} dot={false}>{p.status[0].toUpperCase() + p.status.slice(1)}</StatusBadge></TD><TD className="px-3 py-1.5">{buyer?.name ?? "—"}</TD><TD className="px-3 py-1.5 text-right">{formatINR(p.basePrice)}</TD><TD className="px-3 py-1.5 text-right">{formatINR(p.finalPrice)}</TD><TD className="px-3 py-1.5"><span className={payment === "Fully Paid" ? "rounded bg-green-50 px-2 py-1 text-green-700" : payment === "—" ? "text-neutral-400" : "rounded bg-amber-50 px-2 py-1 text-amber-700"}>{payment}</span></TD><TD className="px-3 py-1.5">{p.bookingDate ? formatDate(p.bookingDate) : `May ${29 - index}, 2025`}</TD><TD className="px-2 py-1.5 text-center">⋮</TD></TR>; })}</TBody>
        </Table>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />
      </TableContainer>
      <PlotDetailDrawer plot={activePlot} onClose={() => setActivePlot(null)} />
    </div>
  );
}
