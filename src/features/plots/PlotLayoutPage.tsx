import { useMemo, useState } from "react";
import { Download, Expand, Minus, Plus, RotateCcw, Tag, CalendarCheck, CheckCircle2, Lock, SlidersHorizontal, MapPinned, X } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { MetricCard } from "@/components/common/MetricCard";
import { Select } from "@/components/common/Field";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { cn } from "@/lib/utils";
import { useAppData } from "@/app/store";
import { useToast } from "@/app/toast";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { Plot, PlotStatus } from "@/types";
import { PlotDetailDrawer } from "./PlotDetailDrawer";
import { PlotDetailPanel } from "./PlotDetailPanel";

const STATUS_CELL: Record<PlotStatus, string> = {
  available: "bg-status-available-bg border-status-available/50 text-status-available hover:bg-status-available/20",
  booked: "bg-status-booked-bg border-status-booked/50 text-status-booked hover:bg-status-booked/20",
  sold: "bg-status-sold-bg border-status-sold/50 text-status-sold hover:bg-status-sold/20",
  reserved: "bg-status-reserved-bg border-status-reserved/50 text-status-reserved hover:bg-status-reserved/20",
};

const LEGEND: { status: PlotStatus; label: string }[] = [
  { status: "available", label: "Available" },
  { status: "booked", label: "Booked" },
  { status: "sold", label: "Sold" },
  { status: "reserved", label: "Reserved / Blocked" },
];

export default function PlotLayoutPage() {
  const { plots } = useAppData();
  const { toast } = useToast();
  const [sizeFilter, setSizeFilter] = useState("all");
  const [facingFilter, setFacingFilter] = useState("all");
  const [cornerFilter, setCornerFilter] = useState("all");
  const [parkFilter, setParkFilter] = useState("all");
  const [blockFilter, setBlockFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [zoom, setZoom] = useState(1);
  const [activePlot, setActivePlot] = useState<Plot | null>(null);
  const [showMasterPlan, setShowMasterPlan] = useState(false);
  const [masterPlanZoom, setMasterPlanZoom] = useState(1);
  const [showFilteredResults, setShowFilteredResults] = useState(false);
  const isDesktopPanel = useMediaQuery("(min-width: 1280px)");

  const stats = useMemo(() => ({
    available: plots.filter((p) => p.status === "available").length,
    booked: plots.filter((p) => p.status === "booked").length,
    sold: plots.filter((p) => p.status === "sold").length,
    reserved: plots.filter((p) => p.status === "reserved").length,
  }), [plots]);
  const blocks = useMemo(() => Array.from(new Set(plots.map((p) => p.block))).sort(), [plots]);
  const categories = useMemo(() => Array.from(new Set(plots.map((p) => p.category))), [plots]);
  const filtered = useMemo(() => plots.filter((p) => {
    if (sizeFilter !== "all" && p.category !== sizeFilter) return false;
    if (facingFilter !== "all" && p.facing !== facingFilter) return false;
    if (cornerFilter !== "all" && String(p.isCorner) !== cornerFilter) return false;
    if (parkFilter !== "all" && String(p.isParkFacing) !== parkFilter) return false;
    if (blockFilter !== "all" && p.block !== blockFilter) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    return true;
  }), [plots, sizeFilter, facingFilter, cornerFilter, parkFilter, blockFilter, statusFilter]);
  const filteredIds = useMemo(() => new Set(filtered.map((p) => p.id)), [filtered]);

  function resetFilters() {
    setSizeFilter("all"); setFacingFilter("all"); setCornerFilter("all");
    setParkFilter("all"); setBlockFilter("all"); setStatusFilter("all");
  }

  async function downloadLayout() {
    try {
      const response = await fetch("/garden-city-master-plan.png");
      if (!response.ok) throw new Error("Unable to load layout");
      const url = URL.createObjectURL(await response.blob());
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `garden-city-layout-${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast({ variant: "success", title: "Layout downloaded", description: "The Garden City master plan has been saved to your device." });
    } catch {
      toast({ variant: "error", title: "Download failed", description: "The layout could not be downloaded. Please try again." });
    }
  }

  return (
    <div className="flex flex-col gap-5 pb-10">
      <PageHeader title="Plot Layout" description="Interactive master plan of Garden City Naugaon township." />
      <div className="flex flex-col gap-5 px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricCard label="Available" value={String(stats.available)} icon={Tag} iconTone="green" progressPercent={(stats.available / plots.length) * 100} onClick={() => setStatusFilter("available")} className={statusFilter === "available" ? "ring-2 ring-status-available" : undefined} />
          <MetricCard label="Booked" value={String(stats.booked)} icon={CalendarCheck} iconTone="orange" progressPercent={(stats.booked / plots.length) * 100} onClick={() => setStatusFilter("booked")} className={statusFilter === "booked" ? "ring-2 ring-status-booked" : undefined} />
          <MetricCard label="Sold" value={String(stats.sold)} icon={CheckCircle2} iconTone="red" progressPercent={(stats.sold / plots.length) * 100} onClick={() => setStatusFilter("sold")} className={statusFilter === "sold" ? "ring-2 ring-status-sold" : undefined} />
          <MetricCard label="Reserved / Blocked" value={String(stats.reserved)} icon={Lock} iconTone="gray" progressPercent={(stats.reserved / plots.length) * 100} onClick={() => setStatusFilter("reserved")} className={statusFilter === "reserved" ? "ring-2 ring-status-reserved" : undefined} />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-border bg-surface p-3">
          <Select value={sizeFilter} onChange={(e) => setSizeFilter(e.target.value)} className="w-auto min-w-[9rem]" aria-label="Size category"><option value="all">All Sizes</option>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</Select>
          <Select value={facingFilter} onChange={(e) => setFacingFilter(e.target.value)} className="w-auto min-w-[8rem]" aria-label="Facing"><option value="all">All Facing</option>{["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"].map((f) => <option key={f} value={f}>{f}</option>)}</Select>
          <Select value={cornerFilter} onChange={(e) => setCornerFilter(e.target.value)} className="w-auto min-w-[8rem]" aria-label="Corner plot"><option value="all">Corner: All</option><option value="true">Corner Only</option><option value="false">Non-Corner</option></Select>
          <Select value={parkFilter} onChange={(e) => setParkFilter(e.target.value)} className="w-auto min-w-[8rem]" aria-label="Park facing"><option value="all">Park Facing: All</option><option value="true">Park Facing Only</option><option value="false">Not Park Facing</option></Select>
          <Select value={blockFilter} onChange={(e) => setBlockFilter(e.target.value)} className="w-auto min-w-[7rem]" aria-label="Block"><option value="all">All Blocks</option>{blocks.map((b) => <option key={b} value={b}>Block {b}</option>)}</Select>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-auto min-w-[7rem]" aria-label="Status"><option value="all">All Status</option><option value="available">Available</option><option value="booked">Booked</option><option value="sold">Sold</option><option value="reserved">Reserved</option></Select>
          <Button variant="ghost" onClick={resetFilters}><RotateCcw size={15} /> Reset</Button>
          <Button variant="secondary" className="ml-auto" onClick={() => setShowFilteredResults(true)}><SlidersHorizontal size={15} /> {filtered.length} Filtered</Button>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
          <div className="relative rounded-xl border border-border bg-surface p-4">
            <div className="absolute left-4 top-4 z-10 flex flex-col gap-1.5">
              <button type="button" onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))} aria-label="Zoom in" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-strong bg-surface text-neutral-600 shadow-card hover:bg-surface-muted"><Plus size={16} /></button>
              <button type="button" onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))} aria-label="Zoom out" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-strong bg-surface text-neutral-600 shadow-card hover:bg-surface-muted"><Minus size={16} /></button>
              <button type="button" onClick={() => setZoom(1)} aria-label="Reset zoom" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-strong bg-surface text-neutral-600 shadow-card hover:bg-surface-muted"><RotateCcw size={14} /></button>
            </div>
            <button
              type="button"
              onClick={() => { setMasterPlanZoom(1); setShowMasterPlan(true); }}
              className="absolute right-4 top-4 z-10 w-40 overflow-hidden rounded-xl border border-border-strong bg-white p-1.5 text-left shadow-popover transition-transform hover:scale-[1.02] sm:w-52"
              aria-label="Open actual Garden City master plan"
            >
              <span className="mb-1 flex items-center justify-between px-1 text-[10px] font-semibold text-neutral-700">
                Actual Master Plan <Expand size={12} className="text-brand-700" />
              </span>
              <img src="/garden-city-master-plan.png" alt="Garden City Naugaon actual master plan preview" className="h-24 w-full rounded-lg bg-surface-subtle object-contain sm:h-28" />
            </button>
            <div className="overflow-auto rounded-lg bg-surface-subtle py-4">
              <div className="origin-top-left px-16 transition-transform" style={{ transform: `scale(${zoom})` }}>
                <div className="flex min-w-max flex-col gap-8">
                  {blocks.map((block) => (
                    <div key={block}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">Block {block}</p>
                      <div className="grid grid-cols-10 gap-1.5">
                        {plots.filter((p) => p.block === block).map((p) => (
                          <button key={p.id} type="button" onClick={() => setActivePlot(p)} title={`Plot ${p.plotNo} — ${p.status}`} className={cn("flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-md border text-[10px] font-semibold transition-transform hover:z-10 hover:scale-110", STATUS_CELL[p.status], !filteredIds.has(p.id) && "invisible pointer-events-none", activePlot?.id === p.id && "ring-2 ring-brand-600 ring-offset-1")}>{p.plotNo.replace("GCN-", "")}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <ul className="flex flex-wrap gap-4">{LEGEND.map((l) => <li key={l.status} className="flex items-center gap-1.5 text-xs text-neutral-600"><span className={cn("h-2.5 w-2.5 rounded-full border", STATUS_CELL[l.status])} />{l.label}</li>)}</ul>
              <Button variant="secondary" size="sm" onClick={downloadLayout}><Download size={14} /> Download Layout</Button>
            </div>
          </div>

          <div className="hidden xl:block">
            <div className="sticky top-4 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-xl border border-border bg-surface shadow-card">
              {activePlot ? <PlotDetailPanel plot={activePlot} onClose={() => setActivePlot(null)} /> : <div className="flex flex-col items-center justify-center gap-2 p-10 text-center"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-muted text-neutral-400"><MapPinned size={20} /></span><p className="text-sm font-medium text-neutral-600">Select a plot</p><p className="text-xs text-neutral-400">Click any plot on the master plan to view details and take action.</p></div>}
            </div>
          </div>
        </div>
      </div>
      {!isDesktopPanel && <PlotDetailDrawer plot={activePlot} onClose={() => setActivePlot(null)} />}
      <Modal
        open={showFilteredResults}
        onClose={() => setShowFilteredResults(false)}
        title={`${filtered.length} Filtered Plots`}
        description="Plots matching the currently selected layout filters."
        footer={<Button variant="secondary" onClick={() => setShowFilteredResults(false)}>Close</Button>}
      >
        <div className="max-h-[55vh] overflow-y-auto rounded-xl border border-border">
          {filtered.length ? filtered.map((plot) => (
            <button
              key={plot.id}
              type="button"
              onClick={() => { setActivePlot(plot); setShowFilteredResults(false); }}
              className="grid w-full grid-cols-[1fr_.8fr_.8fr_1fr] items-center gap-3 border-b border-border px-3 py-2.5 text-left text-sm last:border-b-0 hover:bg-surface-muted"
            >
              <span className="font-semibold text-neutral-900">{plot.plotNo}</span>
              <span>Block {plot.block}</span>
              <span>{plot.areaSqYd} sq yd</span>
              <span className={cn("w-fit rounded-full border px-2 py-0.5 text-xs font-medium", STATUS_CELL[plot.status])}>{plot.status[0].toUpperCase() + plot.status.slice(1)}</span>
            </button>
          )) : <p className="p-8 text-center text-sm text-neutral-500">No plots match the selected filters.</p>}
        </div>
      </Modal>
      {showMasterPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/75 p-4" role="dialog" aria-modal="true" aria-label="Garden City actual master plan">
          <button type="button" onClick={() => setShowMasterPlan(false)} className="absolute inset-0" aria-label="Close master plan" />
          <div className="relative z-10 flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white p-3 shadow-popover">
            <div className="mb-2 flex items-center justify-between gap-3 px-1">
              <div><h2 className="text-base font-semibold text-neutral-900">Garden City Actual Master Plan</h2><p className="text-xs text-neutral-500">Reference layout showing roads, parks, plots, and common areas.</p></div>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => setMasterPlanZoom((z) => Math.max(1, z - 0.25))} aria-label="Zoom out master plan" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-neutral-600 hover:bg-surface-muted"><Minus size={16} /></button>
                <button type="button" onClick={() => setMasterPlanZoom(1)} className="h-9 min-w-14 rounded-lg border border-border bg-white px-2 text-xs font-semibold text-neutral-600 hover:bg-surface-muted" aria-label="Reset master plan zoom">{Math.round(masterPlanZoom * 100)}%</button>
                <button type="button" onClick={() => setMasterPlanZoom((z) => Math.min(2.5, z + 0.25))} aria-label="Zoom in master plan" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-neutral-600 hover:bg-surface-muted"><Plus size={16} /></button>
                <button type="button" onClick={() => setShowMasterPlan(false)} aria-label="Close" className="ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-neutral-600 hover:bg-border"><X size={18} /></button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-auto rounded-xl bg-surface-subtle">
              <img
                src="/garden-city-master-plan.png"
                alt="Detailed Garden City Naugaon master plan"
                className="mx-auto block h-auto max-w-none object-contain transition-[width] duration-150"
                style={{ width: `${masterPlanZoom * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
