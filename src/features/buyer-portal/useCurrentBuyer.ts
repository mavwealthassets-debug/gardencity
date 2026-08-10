import { useAppData } from "@/app/store";

export const CURRENT_BUYER_ID = "buyer-rahul";

export function useCurrentBuyer() {
  const { buyers, plots } = useAppData();
  const buyer = buyers.find((b) => b.id === CURRENT_BUYER_ID)!;
  const plot = plots.find((p) => p.plotNo === buyer.plotId)!;
  return { buyer, plot };
}
