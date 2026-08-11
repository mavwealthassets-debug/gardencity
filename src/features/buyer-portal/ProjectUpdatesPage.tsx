import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/common/Card";
import { Tabs } from "@/components/common/Tabs";
import { Modal } from "@/components/common/Modal";
import { StatusBadge } from "@/components/common/StatusBadge";
import { RmContactBand } from "@/components/layout/RmContactBand";
import { useCurrentBuyer } from "./useCurrentBuyer";
import { formatDate } from "@/lib/format";
import { projectUpdates } from "@/data/updates";
import type { ProjectUpdate } from "@/types";

const TABS = [
  { value: "all", label: "All Updates" },
  { value: "Construction", label: "Construction" },
  { value: "Infrastructure", label: "Infrastructure" },
  { value: "Amenities", label: "Amenities" },
  { value: "Events", label: "Events" },
];

const CATEGORY_TONE: Record<string, "green" | "blue" | "purple" | "orange"> = {
  Construction: "orange",
  Infrastructure: "blue",
  Amenities: "green",
  Events: "purple",
};

export default function ProjectUpdatesPage() {
  const { buyer } = useCurrentBuyer();
  const [tab, setTab] = useState("all");
  const [active, setActive] = useState<ProjectUpdate | null>(null);

  const filtered = useMemo(() => projectUpdates.filter((u) => tab === "all" || u.category === tab), [tab]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-neutral-900 sm:text-2xl">Project Updates</h1>
        <p className="mt-1 text-sm text-neutral-500">Stay up to date with construction progress and township news.</p>
      </div>

      <Tabs tabs={TABS} value={tab} onChange={setTab} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((u) => (
          <Card key={u.id} role="button" tabIndex={0} aria-label={`View update: ${u.title}`} className="cursor-pointer overflow-hidden transition hover:-translate-y-0.5 hover:shadow-popover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" onClick={() => setActive(u)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setActive(u); } }}>
            <img src={u.images[0]} alt={u.title} className="h-40 w-full object-cover" />
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <StatusBadge tone={CATEGORY_TONE[u.category]} dot={false}>{u.category}</StatusBadge>
                <span className="text-xs text-neutral-400">{formatDate(u.date)}</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-neutral-900">{u.title}</p>
              <p className="mt-1 line-clamp-2 text-xs text-neutral-500">{u.description}</p>
              <p className="mt-3 text-xs font-semibold text-primary">View details</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <RmContactBand rmId={buyer.assignedRmId} />

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.title ?? ""} size="lg">
        {active && (
          <div className="flex flex-col gap-4">
            <img src={active.images[0]} alt={active.title} className="max-h-80 w-full rounded-lg object-cover" />
            <div className="flex items-center gap-2">
              <StatusBadge tone={CATEGORY_TONE[active.category]} dot={false}>{active.category}</StatusBadge>
              <span className="text-xs text-neutral-400">{formatDate(active.date)}</span>
            </div>
            <p className="text-sm text-neutral-600">{active.description}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
