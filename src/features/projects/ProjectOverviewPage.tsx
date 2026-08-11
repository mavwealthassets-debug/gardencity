import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Grid3x3, Landmark, Layers, MapPin, ShieldCheck, Sparkles, Tag, CalendarCheck, CheckCircle2, IndianRupee, Wallet, ChevronRight, ReceiptText, CalendarDays, DoorOpen, Route, TentTree, Lightbulb, Blocks, House, Cable, Trees, TreePine, Train, Store, Hospital } from "lucide-react";
import { MetricCard } from "@/components/common/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { DonutChart, DonutLegend } from "@/components/charts/DonutChart";
import { gardenCityProject } from "@/data/project";
import { useAppData } from "@/app/store";
import { formatDate, formatINRCompact } from "@/lib/format";

const AMENITY_ICONS = [DoorOpen, Route, TentTree, Lightbulb, Blocks, ShieldCheck, House, Cable, Trees, TreePine];
const LOCATION_ICONS = [Train, Store, Building2, Route, Hospital];

export default function ProjectOverviewPage() {
  const navigate = useNavigate();
  const { plots } = useAppData();
  const project = gardenCityProject;

  const stats = useMemo(() => {
    const available = plots.filter((p) => p.status === "available").length;
    const booked = plots.filter((p) => p.status === "booked").length;
    const sold = plots.filter((p) => p.status === "sold").length;
    const soldOrBooked = plots.filter((p) => p.status === "sold" || p.status === "booked");
    const totalSalesValue = soldOrBooked.reduce((s, p) => s + p.finalPrice, 0);
    const amountCollected = soldOrBooked.reduce((s, p) => s + (p.paidAmount ?? 0), 0);
    const outstanding = totalSalesValue - amountCollected;
    return { available, booked, sold, totalSalesValue, amountCollected, outstanding };
  }, [plots]);

  const donutData = [
    { label: "Sold", value: stats.sold, color: "#ef4444" },
    { label: "Available", value: stats.available, color: "#3b82f6" },
    { label: "Booked", value: stats.booked, color: "#f59e0b" },
  ];

  return (
    <div className="flex flex-col pb-3">
      <div className="flex flex-col gap-3 px-4 pt-2 sm:px-6">
        <div className="flex h-10 items-center justify-between gap-3">
          <p className="text-base font-semibold text-neutral-900"><span className="text-brand-700">Projects</span> <span className="px-1 text-brand-700">/</span> Township Overview</p>
          <button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-neutral-700 shadow-card">
            <CalendarDays size={14} className="text-neutral-500" /> Mar 1 – Aug 31, 2026
          </button>
        </div>

        <div className="relative h-[198px] overflow-hidden rounded-xl border border-border">
          <img src={project.heroImage} alt={`${project.name} entrance`} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent" />
          <div className="absolute inset-y-0 left-0 flex w-[48%] flex-col justify-center p-5 text-neutral-900">
            <h1 className="font-serif text-3xl leading-none">{project.name}</h1>
            <p className="mt-2 text-sm font-semibold text-brand-700">{project.tagline}</p>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-neutral-600">{project.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <HeroChip icon={Layers} label="Township Size" value={`${project.townshipSizeAcres} Acres`} />
              <HeroChip icon={Grid3x3} label="Total Plots" value={`${project.totalPlots} Plots`} />
              <HeroChip icon={Sparkles} label="Amenities" value={`${project.amenities.length}+`} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-7 lg:[&>*]:h-[104px]">
          <MetricCard className="h-24" label="Total Plots" value={String(plots.length)} icon={Grid3x3} iconTone="green" sublabel="100% of total" progressPercent={100} onClick={() => navigate("/admin/plot-inventory")} />
          <MetricCard className="h-24" label="Available" value={String(stats.available)} icon={Tag} iconTone="blue" sublabel={`${((stats.available / plots.length) * 100).toFixed(2)}% of total`} progressPercent={(stats.available / plots.length) * 100} onClick={() => navigate("/admin/plot-inventory?status=available")} />
          <MetricCard className="h-24" label="Booked" value={String(stats.booked)} icon={CalendarCheck} iconTone="orange" sublabel={`${((stats.booked / plots.length) * 100).toFixed(2)}% of total`} progressPercent={(stats.booked / plots.length) * 100} onClick={() => navigate("/admin/plot-inventory?status=booked")} />
          <MetricCard className="h-24" label="Sold" value={String(stats.sold)} icon={CheckCircle2} iconTone="green" sublabel={`${((stats.sold / plots.length) * 100).toFixed(2)}% of total`} progressPercent={(stats.sold / plots.length) * 100} onClick={() => navigate("/admin/plot-inventory?status=sold")} />
          <MetricCard className="h-24" label="Total Sales Value" value={formatINRCompact(stats.totalSalesValue)} icon={IndianRupee} iconTone="purple" sublabel="All time" onClick={() => navigate("/admin/finance")} />
          <MetricCard className="h-24" label="Amount Collected" value={formatINRCompact(stats.amountCollected)} icon={Wallet} iconTone="teal" sublabel={`${((stats.amountCollected / stats.totalSalesValue) * 100).toFixed(2)}% of sales value`} onClick={() => navigate("/admin/finance")} />
          <MetricCard className="h-24" label="Outstanding" value={formatINRCompact(stats.outstanding)} icon={ReceiptText} iconTone="red" sublabel={`${((stats.outstanding / stats.totalSalesValue) * 100).toFixed(2)}% of sales value`} onClick={() => navigate("/admin/finance")} />
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:h-[228px] xl:grid-cols-[1.08fr_1.08fr_0.92fr_0.92fr]">
          <Card className="relative flex flex-col xl:h-full xl:overflow-hidden">
            <CardHeader className="p-2.5">
              <CardTitle className="text-[13px]">Amenities & Features</CardTitle>
              <button type="button" className="text-[11px] font-semibold text-brand-700">View All</button>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col px-2.5 pb-2.5 pt-0">
              <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[10.5px] font-medium leading-none text-neutral-700">
                {project.amenities.map((a, index) => {
                  const Icon = AMENITY_ICONS[index] ?? Sparkles;
                  return (
                    <li key={a} className="flex min-w-0 items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-700"><Icon size={11} /></span>
                      <span className="whitespace-nowrap">{a === "Temple & Meditation Zone" ? "Temple & Meditation" : a}</span>
                    </li>
                  );
                })}
              </ul>
              <p className="absolute inset-x-2.5 bottom-2.5 flex h-7 items-center gap-2 rounded-lg bg-brand-50 px-2.5 text-[11px] font-semibold text-brand-700"><Sparkles size={13} /> 20+ Premium Amenities</p>
            </CardContent>
          </Card>

          <Card className="relative flex flex-col xl:h-full xl:overflow-hidden">
            <CardHeader className="p-2.5">
              <CardTitle className="text-[13px]">Location Advantages</CardTitle>
              <button type="button" className="text-[11px] font-semibold text-brand-700">View All</button>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col px-2.5 pb-2.5 pt-0">
              <ul className="flex flex-col gap-1.5 text-[10.5px] font-medium leading-none text-neutral-700">
                {project.locationAdvantages.map((a, index) => {
                  const Icon = LOCATION_ICONS[index] ?? MapPin;
                  return (
                    <li key={a} className="flex items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-700"><Icon size={11} /></span>
                      <span className="whitespace-nowrap">{a}</span>
                    </li>
                  );
                })}
              </ul>
              <p className="absolute inset-x-2.5 bottom-2.5 flex h-7 items-center gap-2 rounded-lg bg-brand-50 px-2.5 text-[11px] font-semibold text-brand-700"><MapPin size={13} /> Prime Location Benefits</p>
            </CardContent>
          </Card>

          <Card className="relative flex flex-col xl:h-full xl:overflow-hidden">
            <CardHeader className="p-3"><CardTitle>Plot Categories</CardTitle></CardHeader>
            <CardContent className="flex flex-1 flex-col p-3 pt-0">
              <ul className="flex flex-col gap-2.5">
                {project.plotCategories.map((c) => (
                  <li key={c.label} className="flex items-center justify-between gap-2">
                    <span className="text-sm text-neutral-600">{c.label}</span>
                    <span className="rounded-full bg-status-available-bg px-2 py-0.5 text-xs font-semibold text-status-available">
                      {c.count} ({c.percent.toFixed(2)}%)
                    </span>
                  </li>
                ))}
              </ul>
              <p className="absolute inset-x-3 bottom-3 flex items-center gap-1 rounded-lg bg-brand-50 px-2 py-1 text-[11px] font-medium text-brand-700">{project.plotCategories.length} Plot Size Categories <ChevronRight size={12} /></p>
            </CardContent>
          </Card>

          <Card className="relative flex flex-col xl:h-full xl:overflow-hidden">
            <CardHeader className="p-3"><CardTitle>Sales Progress</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-center gap-3 p-3 pt-0">
              <DonutChart data={donutData} size={105} />
              <DonutLegend data={donutData} />
            </CardContent>
            <p className="absolute inset-x-3 bottom-3 rounded-lg bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-brand-700">Overall Progress: {((stats.sold / plots.length) * 100).toFixed(2)}% Sold</p>
          </Card>
        </div>

        <Card className="h-[124px] overflow-hidden">
          <CardHeader className="p-3"><CardTitle>Project Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 p-3 pt-0 sm:grid-cols-3 lg:grid-cols-6">
            <ProjectDetail icon={Layers} label="Township Size" value={`${project.townshipSizeAcres} Acres`} />
            <ProjectDetail icon={Grid3x3} label="Total Plots" value={`${project.totalPlots} Plots`} />
            <ProjectDetail icon={ShieldCheck} label="Legal Status" value={project.legalStatus} sub={`RERA No. ${project.reraNumber}`} />
            <ProjectDetail icon={Building2} label="Launch Date" value={formatDate(project.launchDate)} />
            <ProjectDetail icon={Landmark} label="Sales Manager" value={project.salesManager.name} sub={project.salesManager.phone} />
            <ProjectDetail icon={Sparkles} label="Development Phase" value={project.developmentPhase} badge={project.developmentStatus} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function HeroChip({ icon: Icon, label, value }: { icon: typeof Layers; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-white/85 px-2.5 py-1.5 shadow-card backdrop-blur-sm">
      <Icon size={16} />
      <div className="leading-tight">
        <p className="text-[10px] text-neutral-500">{label}</p>
        <p className="text-xs font-semibold text-neutral-900">{value}</p>
      </div>
    </div>
  );
}

function ProjectDetail({ icon: Icon, label, value, sub, badge }: { icon: typeof Layers; label: string; value: string; sub?: string; badge?: string }) {
  return (
    <div className="flex min-w-0 items-start gap-2">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700"><Icon size={14} /></span>
      <div className="min-w-0 leading-tight">
        <p className="text-[10px] text-neutral-400">{label}</p>
        <p className="text-xs font-semibold leading-tight text-neutral-800">{value}</p>
        {sub && <p className="truncate text-[10px] text-neutral-500">{sub}</p>}
        {badge && <span className="mt-0.5 inline-block rounded-full bg-status-booked-bg px-1.5 py-0.5 text-[9px] font-medium text-status-booked">{badge}</span>}
      </div>
    </div>
  );
}
