import type { Plot, DocumentItem, PaymentInstallment, PaymentTransaction, SupportTicket } from "@/types";

export interface ActivityLogEntry {
  id: string;
  kind: "sale" | "booking" | "payment" | "document" | "ticket";
  title: string;
  meta: string;
  date: string;
}

export function buildRecentActivity(
  plots: Plot[],
  transactions: PaymentTransaction[],
  documents: DocumentItem[],
  tickets: SupportTicket[]
): ActivityLogEntry[] {
  const entries: ActivityLogEntry[] = [];

  plots
    .filter((p) => p.status === "sold" || p.status === "booked")
    .forEach((p) => {
      entries.push({
        id: `act-plot-${p.id}`,
        kind: p.status === "sold" ? "sale" : "booking",
        title: p.status === "sold" ? `Plot ${p.plotNo} sold` : `Booking created for Plot ${p.plotNo}`,
        meta: `${p.areaSqYd} sq yd · Block ${p.block}`,
        date: p.bookingDate ?? "2025-06-01",
      });
    });

  transactions.slice(0, 12).forEach((t) => {
    entries.push({
      id: `act-txn-${t.id}`,
      kind: "payment",
      title: `Payment received (${t.mode})`,
      meta: `Plot ${t.plotId}`,
      date: t.date,
    });
  });

  documents.slice(0, 10).forEach((d) => {
    entries.push({
      id: `act-doc-${d.id}`,
      kind: "document",
      title: `${d.name} ${d.status === "Verified" ? "verified" : "uploaded"}`,
      meta: `Plot ${d.plotId ?? "—"}`,
      date: d.uploadDate,
    });
  });

  tickets.slice(0, 6).forEach((t) => {
    entries.push({ id: `act-tkt-${t.id}`, kind: "ticket", title: `Ticket ${t.id} — ${t.subject}`, meta: t.status, date: t.createdOn });
  });

  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);
}

export interface MonthPoint {
  month: string;
  salesCr: number;
  collectionsCr: number;
  [key: string]: string | number;
}

export function buildMonthlySeries(installments: PaymentInstallment[], transactions: PaymentTransaction[]): MonthPoint[] {
  const months = ["2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08"];
  return months.map((m) => {
    const label = new Date(`${m}-01`).toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
    const salesCr = installments.filter((i) => i.dueDate.startsWith(m)).reduce((s, i) => s + i.amount, 0) / 1_00_00_000;
    const collectionsCr = transactions.filter((t) => t.date.startsWith(m)).reduce((s, t) => s + t.amount, 0) / 1_00_00_000;
    return { month: label, salesCr: Number(salesCr.toFixed(2)), collectionsCr: Number(collectionsCr.toFixed(2)) };
  });
}

export function daysUntil(dateStr: string, today = new Date("2026-08-10")): number {
  return Math.round((new Date(dateStr).getTime() - today.getTime()) / 86_400_000);
}
