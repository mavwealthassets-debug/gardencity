import type { LoanInfo, PaymentInstallment, PaymentTransaction, PaymentStatus } from "@/types";
import { plots, HERO_PLOT_NOS } from "./seed";

const TODAY = new Date("2026-08-10");

function addMonths(date: string, months: number): string {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

function buildScheduleForPlot(plotId: string, buyerId: string, finalPrice: number, paidAmount: number, bookingDate: string): PaymentInstallment[] {
  const n = 4;
  const base = Math.floor(finalPrice / n / 1000) * 1000;
  const amounts = [base, base, base, finalPrice - base * 3];
  let remainingPaid = paidAmount;
  const labels = ["Booking Amount", "1st Installment", "2nd Installment", "Final Payment"];

  return amounts.map((amount, i) => {
    const dueDate = addMonths(bookingDate, i * 3);
    let status: PaymentStatus;
    let paid: number;
    let paidOn: string | undefined;

    if (remainingPaid >= amount) {
      status = "Paid";
      paid = amount;
      remainingPaid -= amount;
      paidOn = addMonths(dueDate, 0);
    } else if (remainingPaid > 0) {
      status = "Partially Paid";
      paid = remainingPaid;
      remainingPaid = 0;
    } else {
      paid = 0;
      status = new Date(dueDate) < TODAY ? "Overdue" : "Upcoming";
    }

    return {
      id: `pi-${plotId}-${i}`,
      buyerId,
      plotId,
      installmentLabel: labels[i],
      installmentNo: i + 1,
      totalInstallments: n,
      dueDate,
      amount,
      paidAmount: paid,
      status,
      paidOn,
    } satisfies PaymentInstallment;
  });
}

const generatedSchedules = plots
  .filter((p) => (p.status === "sold" || p.status === "booked") && p.plotNo !== HERO_PLOT_NOS.rahul)
  .flatMap((p) => buildScheduleForPlot(p.plotNo, p.buyerId!, p.finalPrice, p.paidAmount ?? 0, p.bookingDate ?? "2025-06-01"));

const rahulSchedule: PaymentInstallment[] = [
  { id: "pi-rahul-1", buyerId: "buyer-rahul", plotId: "GCN-047", installmentLabel: "Booking Amount", installmentNo: 1, totalInstallments: 5, dueDate: "2025-01-14", amount: 350000, paidAmount: 350000, status: "Paid", paidOn: "2025-01-14" },
  { id: "pi-rahul-2", buyerId: "buyer-rahul", plotId: "GCN-047", installmentLabel: "1st Installment", installmentNo: 2, totalInstallments: 5, dueDate: "2025-03-01", amount: 1650000, paidAmount: 1650000, status: "Paid", paidOn: "2025-02-26" },
  { id: "pi-rahul-3", buyerId: "buyer-rahul", plotId: "GCN-047", installmentLabel: "2nd Installment", installmentNo: 3, totalInstallments: 5, dueDate: "2025-06-15", amount: 1500000, paidAmount: 1500000, status: "Paid", paidOn: "2025-06-10" },
  { id: "pi-rahul-4", buyerId: "buyer-rahul", plotId: "GCN-047", installmentLabel: "3rd Installment", installmentNo: 4, totalInstallments: 5, dueDate: "2026-09-15", amount: 500000, paidAmount: 0, status: "Upcoming" },
  { id: "pi-rahul-5", buyerId: "buyer-rahul", plotId: "GCN-047", installmentLabel: "Final Payment", installmentNo: 5, totalInstallments: 5, dueDate: "2026-11-15", amount: 350000, paidAmount: 0, status: "Upcoming" },
];

export const paymentInstallments: PaymentInstallment[] = [...rahulSchedule, ...generatedSchedules];

export const paymentTransactions: PaymentTransaction[] = paymentInstallments
  .filter((i) => i.status === "Paid" || i.status === "Partially Paid")
  .map((i, idx) => ({
    id: `txn-${i.id}`,
    buyerId: i.buyerId,
    plotId: i.plotId,
    date: i.paidOn ?? i.dueDate,
    amount: i.paidAmount,
    mode: (["UPI", "Bank Transfer", "Cheque", "Card"] as const)[idx % 4],
    status: "Success",
    referenceNo: `UPI${(i.paidOn ?? i.dueDate).replace(/-/g, "")}${String(1000 + idx)}`,
    receiptAvailable: true,
  }));

export const loans: LoanInfo[] = [
  {
    buyerId: "buyer-rohit",
    bankName: "HDFC Bank",
    accountHolder: "Rohit Sharma",
    loanAmount: 2800000,
    disbursedAmount: 2520000,
    accountNumberMasked: "5010 **** **** 1234",
    ifsc: "HDFC0005010",
    loanAccountNo: "LN50102345678",
  },
  {
    buyerId: "buyer-vikram",
    bankName: "ICICI Bank",
    accountHolder: "Vikram Desai",
    loanAmount: 4000000,
    disbursedAmount: 4000000,
    accountNumberMasked: "0221 **** **** 9087",
    ifsc: "ICIC0000221",
    loanAccountNo: "LN22198765432",
  },
];

export function getInstallmentsForBuyer(buyerId: string) {
  return paymentInstallments.filter((i) => i.buyerId === buyerId).sort((a, b) => a.installmentNo - b.installmentNo);
}
export function getTransactionsForBuyer(buyerId: string) {
  return paymentTransactions
    .filter((t) => t.buyerId === buyerId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
