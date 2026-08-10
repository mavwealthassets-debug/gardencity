import type { DocumentItem } from "@/types";
import { plots, HERO_PLOT_NOS } from "./seed";

let seq = 1;
function doc(partial: Omit<DocumentItem, "id" | "history" | "version"> & { version?: number }): DocumentItem {
  const id = `doc-${seq++}`;
  return {
    id,
    version: partial.version ?? 1,
    history: [{ version: partial.version ?? 1, date: partial.uploadDate, action: "Uploaded", by: partial.uploadedBy }],
    ...partial,
  };
}

const rahulDocs: DocumentItem[] = [
  doc({ buyerId: "buyer-rahul", plotId: "GCN-047", name: "Aadhaar Card", category: "KYC", status: "Verified", uploadedBy: "Neha Sharma", uploadedByRole: "Sales Executive", uploadDate: "2025-01-15", fileSizeKb: 1200, fileType: "PDF", verifiedBy: "Ankit Verma" }),
  doc({ buyerId: "buyer-rahul", plotId: "GCN-047", name: "PAN Card", category: "KYC", status: "Verified", uploadedBy: "Neha Sharma", uploadedByRole: "Sales Executive", uploadDate: "2025-01-15", fileSizeKb: 642, fileType: "PDF", verifiedBy: "Ankit Verma" }),
  doc({ buyerId: "buyer-rahul", plotId: "GCN-047", name: "Bank Statement (Apr-May)", category: "Financial", status: "Verified", uploadedBy: "Neha Sharma", uploadedByRole: "Sales Executive", uploadDate: "2025-01-18", fileSizeKb: 2400, fileType: "PDF", verifiedBy: "Ankit Verma" }),
  doc({ buyerId: "buyer-rahul", plotId: "GCN-047", name: "Booking Form", category: "Property", status: "Verified", uploadedBy: "Sandeep Singh", uploadedByRole: "Relationship Manager", uploadDate: "2025-01-14", fileSizeKb: 1400, fileType: "PDF", verifiedBy: "Pooja Mehta" }),
  doc({ buyerId: "buyer-rahul", plotId: "GCN-047", name: "Agreement", category: "Legal", status: "Verified", uploadedBy: "Sandeep Singh", uploadedByRole: "Relationship Manager", uploadDate: "2025-01-18", fileSizeKb: 2700, fileType: "PDF", verifiedBy: "Pooja Mehta" }),
  doc({ buyerId: "buyer-rahul", plotId: "GCN-047", name: "Sale Deed", category: "Legal", status: "Verified", uploadedBy: "Sandeep Singh", uploadedByRole: "Relationship Manager", uploadDate: "2026-08-01", fileSizeKb: 3100, fileType: "PDF", verifiedBy: "Pooja Mehta" }),
  doc({ buyerId: "buyer-rahul", plotId: "GCN-047", name: "Registration Docs", category: "Legal", status: "Pending", uploadedBy: "Sandeep Singh", uploadedByRole: "Relationship Manager", uploadDate: "2026-08-08", fileSizeKb: 1100, fileType: "PDF" }),
  doc({ buyerId: "buyer-rahul", plotId: "GCN-047", name: "Payment Receipts", category: "Financial", status: "Pending", uploadedBy: "System", uploadedByRole: "System", uploadDate: "2026-08-05", fileSizeKb: 900, fileType: "PDF" }),
];

const otherHeroDocs: DocumentItem[] = [
  doc({ buyerId: "buyer-rohit", plotId: "GCN-045", name: "Aadhaar Card", category: "KYC", status: "Verified", uploadedBy: "Priya Singh", uploadedByRole: "Relationship Manager", uploadDate: "2024-11-05", fileSizeKb: 1100, fileType: "PDF", verifiedBy: "Ankit Verma" }),
  doc({ buyerId: "buyer-rohit", plotId: "GCN-045", name: "Sale Deed", category: "Legal", status: "Verified", uploadedBy: "Priya Singh", uploadedByRole: "Relationship Manager", uploadDate: "2025-03-01", fileSizeKb: 2900, fileType: "PDF", verifiedBy: "Pooja Mehta" }),
  doc({ buyerId: "buyer-rohit", plotId: "GCN-045", name: "Registration Receipt", category: "Legal", status: "Verified", uploadedBy: "Priya Singh", uploadedByRole: "Relationship Manager", uploadDate: "2025-03-20", fileSizeKb: 800, fileType: "PDF", verifiedBy: "Pooja Mehta" }),
  doc({ buyerId: "buyer-priya", plotId: "GCN-078", name: "Aadhaar Card", category: "KYC", status: "Verified", uploadedBy: "Sandeep Singh", uploadedByRole: "Relationship Manager", uploadDate: "2025-05-30", fileSizeKb: 1300, fileType: "PDF", verifiedBy: "Ankit Verma" }),
  doc({ buyerId: "buyer-priya", plotId: "GCN-078", name: "PAN Card", category: "KYC", status: "Rejected", uploadedBy: "Sandeep Singh", uploadedByRole: "Relationship Manager", uploadDate: "2025-05-30", fileSizeKb: 500, fileType: "JPG", rejectionReason: "Image is blurred — PAN number not legible. Please re-upload a clear scan." }),
  doc({ buyerId: "buyer-priya", plotId: "GCN-078", name: "Bank Statement (Apr-May)", category: "Financial", status: "Pending", uploadedBy: "Sandeep Singh", uploadedByRole: "Relationship Manager", uploadDate: "2025-05-29", fileSizeKb: 2100, fileType: "PDF" }),
  doc({ buyerId: "buyer-priya", plotId: "GCN-078", name: "Booking Form", category: "Property", status: "Pending", uploadedBy: "Sandeep Singh", uploadedByRole: "Relationship Manager", uploadDate: "2025-05-30", fileSizeKb: 1400, fileType: "PDF" }),
  doc({ buyerId: "buyer-priya", plotId: "GCN-078", name: "Agreement", category: "Legal", status: "Pending", uploadedBy: "Sandeep Singh", uploadedByRole: "Relationship Manager", uploadDate: "2025-05-30", fileSizeKb: 2600, fileType: "PDF" }),
  doc({ buyerId: "buyer-priya", plotId: "GCN-078", name: "Registration Receipt", category: "Legal", status: "Rejected", uploadedBy: "Sandeep Singh", uploadedByRole: "Relationship Manager", uploadDate: "2025-05-30", fileSizeKb: 700, fileType: "PDF", rejectionReason: "Registration number does not match the sale deed. Awaiting corrected copy." }),
  doc({ buyerId: "buyer-amit", plotId: "GCN-012", name: "Aadhaar Card", category: "KYC", status: "Verified", uploadedBy: "Neha Sharma", uploadedByRole: "Sales Executive", uploadDate: "2025-02-21", fileSizeKb: 1000, fileType: "PDF", verifiedBy: "Ankit Verma" }),
  doc({ buyerId: "buyer-amit", plotId: "GCN-012", name: "Agreement", category: "Legal", status: "Verified", uploadedBy: "Neha Sharma", uploadedByRole: "Sales Executive", uploadDate: "2025-02-25", fileSizeKb: 2500, fileType: "PDF", verifiedBy: "Pooja Mehta" }),
  doc({ buyerId: "buyer-neha", plotId: "GCN-073", name: "Booking Form", category: "Property", status: "Pending", uploadedBy: "Neha Sharma", uploadedByRole: "Sales Executive", uploadDate: "2026-05-30", fileSizeKb: 1300, fileType: "PDF" }),
  doc({ buyerId: "buyer-vikram", plotId: "GCN-021", name: "Sale Deed", category: "Legal", status: "Verified", uploadedBy: "Priya Singh", uploadedByRole: "Relationship Manager", uploadDate: "2025-04-01", fileSizeKb: 3000, fileType: "PDF", verifiedBy: "Pooja Mehta" }),
];

const generatedDocs: DocumentItem[] = plots
  .filter((p) => (p.status === "sold" || p.status === "booked") && !Object.values(HERO_PLOT_NOS).includes(p.plotNo as (typeof HERO_PLOT_NOS)[keyof typeof HERO_PLOT_NOS]))
  .flatMap((p, idx) => [
    doc({ buyerId: p.buyerId!, plotId: p.plotNo, name: "Aadhaar Card", category: "KYC", status: idx % 6 === 0 ? "Pending" : "Verified", uploadedBy: "Neha Sharma", uploadedByRole: "Sales Executive", uploadDate: p.bookingDate ?? "2025-06-01", fileSizeKb: 1000 + (idx % 5) * 100, fileType: "PDF", verifiedBy: idx % 6 === 0 ? undefined : "Ankit Verma" }),
    doc({ buyerId: p.buyerId!, plotId: p.plotNo, name: "Booking Form", category: "Property", status: idx % 8 === 0 ? "Resubmission Required" : "Verified", uploadedBy: "Sandeep Singh", uploadedByRole: "Relationship Manager", uploadDate: p.bookingDate ?? "2025-06-01", fileSizeKb: 1200 + (idx % 4) * 150, fileType: "PDF", verifiedBy: idx % 8 === 0 ? undefined : "Pooja Mehta", rejectionReason: idx % 8 === 0 ? "Signature missing on page 2. Please resubmit a signed copy." : undefined }),
  ]);

export const documents: DocumentItem[] = [...rahulDocs, ...otherHeroDocs, ...generatedDocs];

export function getDocumentsForBuyer(buyerId: string) {
  return documents.filter((d) => d.buyerId === buyerId).sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
}
