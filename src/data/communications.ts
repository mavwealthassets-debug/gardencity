import type { CommunicationItem } from "@/types";

let seq = 1;
function comm(partial: Omit<CommunicationItem, "id">): CommunicationItem {
  return { id: `comm-${seq++}`, ...partial };
}

export const communications: CommunicationItem[] = [
  comm({ buyerId: "buyer-rahul", channel: "Meeting", subject: "Site Visit Scheduled", body: "Visited site with RM Sandeep Singh.", from: "Sandeep Singh", date: "2025-01-10T11:00:00", status: "Resolved", direction: "outbound", internal: false }),
  comm({ buyerId: "buyer-rahul", channel: "System", subject: "Plot Booked", body: "Plot GCN-047 booked.", from: "System", date: "2025-01-14T16:30:00", status: "Closed", direction: "outbound", internal: false }),
  comm({ buyerId: "buyer-rahul", channel: "Call", subject: "Welcome Call Completed", body: "Introduced project, team & post-sale support.", from: "Sandeep Singh", date: "2025-01-16T10:30:00", status: "Resolved", direction: "outbound", internal: false }),
  comm({ buyerId: "buyer-rahul", channel: "System", subject: "Registration Update", body: "Plot registration process update shared.", from: "System", date: "2025-05-20T11:45:00", status: "Closed", direction: "outbound", internal: false }),
  comm({ buyerId: "buyer-rahul", channel: "WhatsApp", subject: "Development Update Shared", body: "Shared site progress photos and latest updates.", from: "Sandeep Singh", date: "2026-08-05T04:15:00", status: "Resolved", direction: "outbound", internal: false }),
  comm({ buyerId: "buyer-rahul", channel: "Email", subject: "Payment Reminder", body: "Reminder for 3rd installment due 15 Sep 2026.", from: "Accounts Team", date: "2026-08-08T09:15:00", status: "In Progress", direction: "outbound", internal: false }),
  comm({ buyerId: "buyer-rahul", channel: "Notice", subject: "Festive Season Notice", body: "Office timings during the festive season.", from: "Admin Team", date: "2026-08-02T17:00:00", status: "Closed", direction: "outbound", internal: false }),
  comm({ buyerId: "buyer-rahul", channel: "Message", subject: "Project Progress Update", body: "Latest update on infrastructure and development work.", from: "Project Team", date: "2026-08-09T10:30:00", status: "Resolved", direction: "outbound", internal: false }),
  comm({ buyerId: "buyer-rahul", channel: "System", subject: "Internal Note — Follow-up", body: "Buyer asked about possession timeline during last call, follow up before 3rd installment due date.", from: "Sandeep Singh", date: "2026-08-06T15:00:00", status: "Open", direction: "outbound", internal: true }),

  comm({ buyerId: "buyer-rohit", channel: "Call", subject: "Registration Receipt Follow-up", body: "Discussed sharing final registration receipt.", from: "Priya Singh", date: "2025-03-22T12:00:00", status: "Resolved", direction: "outbound", internal: false }),
  comm({ buyerId: "buyer-rohit", channel: "System", subject: "Payment Received", body: "Final payment received in full.", from: "System", date: "2025-03-01T09:00:00", status: "Closed", direction: "outbound", internal: false }),

  comm({ buyerId: "buyer-priya", channel: "Meeting", subject: "Walk-in Site Visit", body: "First site visit and township walkthrough with buyer.", from: "Sandeep Singh", date: "2025-05-30T10:00:00", status: "Resolved", direction: "outbound", internal: false }),
  comm({ buyerId: "buyer-priya", channel: "Email", subject: "Document Checklist Shared", body: "Shared checklist of pending KYC and financial documents.", from: "Sandeep Singh", date: "2025-06-02T09:00:00", status: "In Progress", direction: "outbound", internal: false }),
  comm({ buyerId: "buyer-priya", channel: "System", subject: "Internal Note", body: "PAN card image rejected, buyer informed to resubmit clearer scan.", from: "Ankit Verma", date: "2025-06-03T11:00:00", status: "Open", direction: "outbound", internal: true }),

  comm({ buyerId: "buyer-amit", channel: "WhatsApp", subject: "Referral Bonus Update", body: "Shared update on referral cashback processing.", from: "Neha Sharma", date: "2026-08-01T14:00:00", status: "In Progress", direction: "outbound", internal: false }),
  comm({ buyerId: "buyer-amit", channel: "Call", subject: "Payment Confirmation Call", body: "Confirmed receipt of second installment.", from: "Neha Sharma", date: "2025-05-20T10:00:00", status: "Resolved", direction: "outbound", internal: false }),

  comm({ buyerId: "buyer-neha", channel: "System", subject: "Booking Created", body: "Booking created for Plot GCN-073.", from: "System", date: "2026-05-30T09:45:00", status: "Closed", direction: "outbound", internal: false }),
  comm({ buyerId: "buyer-neha", channel: "Email", subject: "Awaiting Booking Payment", body: "Follow-up email sent regarding pending booking amount payment.", from: "Neha Sharma", date: "2026-08-04T10:00:00", status: "Open", direction: "outbound", internal: false }),

  comm({ buyerId: "buyer-vikram", channel: "System", subject: "Registration Completed", body: "Sale deed registered successfully.", from: "System", date: "2025-04-05T13:10:00", status: "Closed", direction: "outbound", internal: false }),
];

export function getCommunicationsForBuyer(buyerId: string, includeInternal = true) {
  return communications
    .filter((c) => c.buyerId === buyerId && (includeInternal || !c.internal))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
