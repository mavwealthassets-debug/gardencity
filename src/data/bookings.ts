import type { Booking } from "@/types";
import { plots } from "./seed";

export const bookings: Booking[] = plots
  .filter((p) => p.status === "sold" || p.status === "booked")
  .map((p) => ({
    id: `bk-${p.plotNo}`,
    plotId: p.plotNo,
    buyerId: p.buyerId!,
    bookingDate: p.bookingDate ?? "2025-06-01",
    bookingAmount: Math.round((p.finalPrice * 0.1) / 1000) * 1000,
    status: p.status === "sold" ? "Confirmed" : "Booked",
  }));
