import { Drawer } from "@/components/common/Drawer";
import type { Plot } from "@/types";
import { PlotDetailPanel } from "./PlotDetailPanel";

export function PlotDetailDrawer({ plot, onClose }: { plot: Plot | null; onClose: () => void }) {
  if (!plot) return null;

  return (
    <Drawer open={!!plot} onClose={onClose} title="" >
      <div className="-m-5">
        <PlotDetailPanel plot={plot} onClose={onClose} />
      </div>
    </Drawer>
  );
}
