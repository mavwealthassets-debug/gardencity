import { Download, TreePine, CornerDownRight, Waves, Wind, Building2, GraduationCap, ShoppingCart, HeartPulse } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { RmContactBand } from "@/components/layout/RmContactBand";
import { useCurrentBuyer } from "./useCurrentBuyer";
import { useAppData } from "@/app/store";
import { useToast } from "@/app/toast";
import { formatDate, formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

const LOCATION_ADVANTAGES = [
  { icon: TreePine, title: "Near Park", desc: "Located close to landscaped parks and green spaces." },
  { icon: CornerDownRight, title: "Corner Plot", desc: "Enjoy extra space and better access from two roads." },
  { icon: Wind, title: "Wide Road", desc: "30 ft wide road ensures smooth connectivity." },
  { icon: Waves, title: "Good Ventilation", desc: "Open surroundings ensure fresh air and natural light." },
];

const AMENITIES_NEARBY = [
  { icon: TreePine, title: "Park", desc: "Beautiful parks for walking, jogging and relaxation." },
  { icon: Building2, title: "Clubhouse", desc: "Premium clubhouse with modern facilities nearby." },
  { icon: GraduationCap, title: "School", desc: "Reputed schools are located within a short distance." },
  { icon: ShoppingCart, title: "Market", desc: "Daily needs and shopping options are easily accessible." },
  { icon: HeartPulse, title: "Hospital", desc: "Quality healthcare facilities available nearby." },
];

export default function MyPlotPage() {
  const { buyer, plot } = useCurrentBuyer();
  const { plots } = useAppData();
  const { toast } = useToast();

  const blockPlots = plots.filter((p) => p.block === plot.block).slice(0, 21);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">My Plot Details</h1>
        <p className="mt-1 text-sm text-neutral-500">All information about your plot in Garden City Naugaon.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader><CardTitle>Plot Layout Map</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-xl bg-surface-subtle p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">Block {plot.block}</p>
              <div className="grid grid-cols-7 gap-2">
                {blockPlots.map((p) => (
                  <div
                    key={p.id}
                    className={cn(
                      "flex h-12 items-center justify-center rounded-md border text-xs font-semibold",
                      p.id === plot.id
                        ? "border-brand-600 bg-brand-600 text-white ring-2 ring-brand-300 ring-offset-1"
                        : "border-border-strong bg-surface text-neutral-500"
                    )}
                  >
                    {p.plotNo.replace("GCN-", "")}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-neutral-400">Your plot <span className="font-semibold text-brand-700">{plot.plotNo}</span> is highlighted above.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plot Information</CardTitle>
            <StatusBadge tone="red">{plot.status[0].toUpperCase() + plot.status.slice(1)}</StatusBadge>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-xl font-bold text-brand-700">Plot {plot.plotNo}</p>
            <dl className="flex flex-col divide-y divide-border text-sm">
              <DetailRow label="Plot Size" value={`${plot.areaSqYd} sq yd`} />
              <DetailRow label="Facing" value={plot.facing} />
              <DetailRow label="Road Width" value={`${plot.roadWidthFt} ft`} />
              <DetailRow label="Plot Category" value={plot.category} />
              <DetailRow label="Plot Type" value="Residential" />
              <DetailRow label="Location" value={`Block ${plot.block}`} />
              <DetailRow label="Purchase Date" value={plot.bookingDate ? formatDate(plot.bookingDate) : "—"} />
              <DetailRow label="Purchase Price" value={formatINR(plot.finalPrice)} />
            </dl>
            <Button className="w-full" onClick={() => toast({ variant: "success", title: "Plot details downloaded", description: `${plot.plotNo}-details.pdf` })}>
              <Download size={15} /> Download Plot Details
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Location Advantages</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {LOCATION_ADVANTAGES.map((a) => (
              <div key={a.title} className="flex gap-3 rounded-lg border border-border p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700"><a.icon size={16} /></span>
                <div><p className="text-sm font-medium text-neutral-800">{a.title}</p><p className="text-xs text-neutral-500">{a.desc}</p></div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Amenities Nearby</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {AMENITIES_NEARBY.map((a) => (
              <div key={a.title} className="flex gap-3 rounded-lg border border-border p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-status-teal-bg text-status-teal"><a.icon size={16} /></span>
                <div><p className="text-sm font-medium text-neutral-800">{a.title}</p><p className="text-xs text-neutral-500">{a.desc}</p></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <RmContactBand rmId={buyer.assignedRmId} />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-neutral-500">{label}</span>
      <span className="font-medium text-neutral-800">{value}</span>
    </div>
  );
}
