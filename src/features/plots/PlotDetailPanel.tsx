import { useState } from "react";
import { Share2, X } from "lucide-react";
import { Button } from "@/components/common/Button";
import { StatusBadge, plotStatusTone } from "@/components/common/StatusBadge";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useAppData } from "@/app/store";
import { useToast } from "@/app/toast";
import { formatINR } from "@/lib/format";
import { getBuyerById } from "@/data/buyers";
import type { Plot } from "@/types";

interface PlotDetailPanelProps {
  plot: Plot;
  onClose?: () => void;
}

export function PlotDetailPanel({ plot, onClose }: PlotDetailPanelProps) {
  const { holdPlot, bookPlot } = useAppData();
  const { toast } = useToast();
  const [confirmAction, setConfirmAction] = useState<"book" | "hold" | null>(null);

  const buyer = plot.buyerId ? getBuyerById(plot.buyerId) : undefined;
  const isSold = plot.status === "sold";

  function runAction() {
    if (!confirmAction) return;
    if (confirmAction === "book") {
      bookPlot(plot.id);
      toast({ variant: "success", title: `Plot ${plot.plotNo} booked`, description: "The plot status has been updated to Booked." });
    } else {
      holdPlot(plot.id);
      toast({ variant: "info", title: `Plot ${plot.plotNo} held`, description: "The plot has been reserved for 48 hours." });
    }
    setConfirmAction(null);
    onClose?.();
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
        <div>
          <p className="text-xs text-neutral-400">Plot</p>
          <p className="text-base font-bold text-neutral-900">{plot.plotNo}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge tone={plotStatusTone(plot.status)}>{plot.status[0].toUpperCase() + plot.status.slice(1)}</StatusBadge>
          {onClose && (
            <button type="button" onClick={onClose} aria-label="Close plot details" className="rounded-lg p-1 text-neutral-400 hover:bg-surface-muted hover:text-neutral-700">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-center rounded-xl border border-dashed border-border-strong bg-surface-subtle p-6 text-center">
          <div>
            <p className="text-xs text-neutral-400">{plot.widthFt} ft x {plot.depthFt} ft</p>
            <p className="mt-1 text-xl font-bold text-neutral-800">{plot.areaSqYd} sq yd</p>
            <p className="mt-1 text-xs text-neutral-400">Block {plot.block}</p>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
          <Detail label="Block" value={plot.block} />
          <Detail label="Plot No." value={plot.plotNo.replace("GCN-", "")} />
          <Detail label="Size" value={`${plot.areaSqYd} sq yd`} />
          <Detail label="Facing" value={plot.facing} />
          <Detail label="Road Width" value={`${plot.roadWidthFt} ft`} />
          <Detail label="Corner Plot" value={plot.isCorner ? "Yes" : "No"} />
          <Detail label="Park Facing" value={plot.isParkFacing ? "Yes" : "No"} />
          <Detail label="Status" value={plot.status[0].toUpperCase() + plot.status.slice(1)} />
        </dl>

        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between"><dt className="text-neutral-500">Base Price (sq ft)</dt><dd className="font-medium text-neutral-800">{formatINR(Math.round(plot.basePricePerSqYd / 9))}</dd></div>
          <div className="flex justify-between"><dt className="text-neutral-500">Base Price</dt><dd className="font-medium text-neutral-800">{formatINR(plot.basePrice)}</dd></div>
          <div className="flex justify-between"><dt className="text-neutral-500">Discount</dt><dd className="font-medium text-neutral-800">{formatINR(plot.discount)}</dd></div>
          <div className="flex justify-between border-t border-border pt-2"><dt className="font-semibold text-neutral-700">Final Price</dt><dd className="font-bold text-brand-600">{formatINR(plot.finalPrice)}</dd></div>
        </dl>

        {buyer && (
          <div className="rounded-xl border border-border p-3.5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">Buyer</p>
            <p className="text-sm font-semibold text-neutral-900">{buyer.name}</p>
            <p className="text-xs text-neutral-500">{buyer.phone} · {buyer.email}</p>
            {plot.paidAmount !== undefined && (
              <dl className="mt-3 flex justify-between text-sm">
                <div><dt className="text-neutral-500">Paid</dt><dd className="font-medium text-status-available">{formatINR(plot.paidAmount)}</dd></div>
                <div className="text-right"><dt className="text-neutral-500">Balance</dt><dd className="font-medium text-status-sold">{formatINR(plot.balanceAmount ?? 0)}</dd></div>
              </dl>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 pt-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Quick Actions</p>
          <Button className="w-full" disabled={isSold || plot.status === "booked"} onClick={() => setConfirmAction("book")}>
            Book Plot
          </Button>
          <Button variant="secondary" className="w-full" disabled={isSold} onClick={() => setConfirmAction("hold")}>
            Hold Plot
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => toast({ variant: "success", title: "Share link copied", description: `A shareable link for ${plot.plotNo} has been copied to your clipboard.` })}
          >
            <Share2 size={15} /> Share Plot
          </Button>
          {isSold && <p className="text-center text-xs text-neutral-400">This plot is sold — no further actions are available.</p>}
        </div>
      </div>

      <ConfirmDialog
        open={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        onConfirm={runAction}
        title={confirmAction === "book" ? `Book Plot ${plot.plotNo}?` : `Hold Plot ${plot.plotNo}?`}
        description={
          confirmAction === "book"
            ? "This will mark the plot as Booked and notify the sales team to prepare the agreement."
            : "This will reserve the plot for 48 hours, preventing other executives from booking it."
        }
        confirmLabel={confirmAction === "book" ? "Confirm Booking" : "Confirm Hold"}
      />
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-neutral-400">{label}</dt>
      <dd className="font-medium text-neutral-800">{value}</dd>
    </div>
  );
}
