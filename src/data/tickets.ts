import type { SupportTicket } from "@/types";
import { buyers } from "./seed";

let seq = 1764;
function ticket(partial: Omit<SupportTicket, "id" | "activity"> & { activity?: SupportTicket["activity"] }): SupportTicket {
  const id = `TKT-2025-${seq--}`;
  return {
    id,
    activity: partial.activity ?? [
      { id: `${id}-a1`, type: "created", text: "Ticket created", by: buyers.find((b) => b.id === partial.buyerId)?.name ?? "Buyer", date: partial.createdOn },
      { id: `${id}-a2`, type: "assigned", text: `Assigned to ${partial.assignedTo}`, by: partial.assignedTo, date: partial.createdOn },
    ],
    ...partial,
  };
}

const CATEGORIES: SupportTicket["category"][] = ["Payments", "Registration", "Documentation", "Infrastructure", "Site Visit", "General Query"];
const PRIORITIES: SupportTicket["priority"][] = ["Low", "Medium", "High"];
const AGENTS = ["Pooja K.", "Saurabh A.", "Ritika T.", "Manish N."];

export const tickets: SupportTicket[] = [
  ticket({
    buyerId: "buyer-rohit", plotId: "GCN-045", subject: "Street light not working near A-125",
    description: "The street light near plot A-125 has not been working since last 3 days. It's very dark at night and causing inconvenience. Please look into it.",
    category: "Infrastructure", priority: "High", status: "Open", assignedTo: "Pooja K.", createdOn: "2026-08-09T10:15:00", slaState: "At Risk",
    activity: [
      { id: "a1", type: "created", text: "Rohit Sharma created this ticket", by: "Rohit Sharma", date: "2026-08-09T10:15:00" },
      { id: "a2", type: "assigned", text: "Pooja K. assigned this ticket to herself", by: "Pooja K.", date: "2026-08-09T10:20:00" },
      { id: "a3", type: "note", text: "Maintenance team informed on 09 Aug. Awaiting confirmation.", by: "Pooja K.", date: "2026-08-09T11:05:00" },
      { id: "a4", type: "status", text: "Pooja K. changed status to Open", by: "Pooja K.", date: "2026-08-09T11:05:00" },
    ],
  }),
  ticket({ buyerId: "buyer-priya", plotId: "GCN-078", subject: "Payment receipt not received", description: "I made a payment last week via UPI but haven't received a receipt via email yet.", category: "Payments", priority: "Medium", status: "In Progress", assignedTo: "Saurabh A.", createdOn: "2026-08-09T09:02:00", slaState: "Within SLA" }),
  ticket({ buyerId: "buyer-amit", plotId: "GCN-012", subject: "Registry document correction", description: "There is a minor spelling error in my name on the registry document. Requesting correction.", category: "Registration", priority: "High", status: "Open", assignedTo: "Ritika T.", createdOn: "2026-08-08T04:45:00", slaState: "At Risk" }),
  ticket({ buyerId: "buyer-priya", plotId: "GCN-078", subject: "NOC copy required", description: "Requesting a copy of the No Objection Certificate for bank loan processing.", category: "Documentation", priority: "Medium", status: "In Progress", assignedTo: "Manish N.", createdOn: "2026-08-08T05:30:00", slaState: "Within SLA" }),
  ticket({ buyerId: "buyer-rahul", plotId: "GCN-047", subject: "Document Clarification", description: "Need clarification on which document is required next for registration completion.", category: "Documentation", priority: "Medium", status: "In Progress", assignedTo: "Pooja K.", createdOn: "2026-08-07T14:00:00", slaState: "Within SLA" }),
  ticket({ buyerId: "buyer-vikram", plotId: "GCN-021", subject: "Request for site visit", description: "Would like to schedule a site visit next weekend with family.", category: "Site Visit", priority: "Low", status: "Resolved", assignedTo: "Pooja K.", createdOn: "2026-08-06T03:25:00", slaState: "Within SLA" }),
  ticket({ buyerId: "buyer-neha", plotId: "GCN-073", subject: "Outstanding amount clarification", description: "The outstanding amount shown does not match what I expected. Please clarify the breakdown.", category: "Payments", priority: "High", status: "Open", assignedTo: "Saurabh A.", createdOn: "2026-08-06T05:10:00", slaState: "Breached" }),
  ticket({ buyerId: "buyer-rohit", plotId: "GCN-045", subject: "Road repair near plot B-156", description: "There is a pothole forming near the internal road, requesting repair before monsoon damage worsens.", category: "Infrastructure", priority: "Medium", status: "In Progress", assignedTo: "Ritika T.", createdOn: "2026-08-04T11:40:00", slaState: "Within SLA" }),
  ticket({ buyerId: "buyer-priya", plotId: "GCN-078", subject: "Boundary wall guidelines", description: "Requesting the approved guidelines for constructing a boundary wall on my plot.", category: "General Query", priority: "Low", status: "Resolved", assignedTo: "Manish N.", createdOn: "2026-08-03T09:15:00", slaState: "Within SLA" }),
];

const generated: SupportTicket[] = buyers
  .filter((b) => b.plotId && !tickets.some((t) => t.buyerId === b.id))
  .slice(0, 24)
  .map((b, idx) =>
    ticket({
      buyerId: b.id,
      plotId: b.plotId,
      subject: ["Water supply query", "Possession timeline query", "Duplicate payment concern", "Site cleanliness feedback", "Loan NOC request", "Landscaping delay query"][idx % 6],
      description: "Buyer raised a general query through the support portal regarding their plot and account.",
      category: CATEGORIES[idx % CATEGORIES.length],
      priority: PRIORITIES[idx % PRIORITIES.length],
      status: (["Open", "In Progress", "Resolved", "Resolved", "Closed"] as const)[idx % 5],
      assignedTo: AGENTS[idx % AGENTS.length],
      createdOn: `2026-0${(idx % 6) + 3}-${String(1 + (idx % 27)).padStart(2, "0")}T${String(9 + (idx % 8)).padStart(2, "0")}:00:00`,
      slaState: (["Within SLA", "Within SLA", "At Risk", "Breached", "No SLA"] as const)[idx % 5],
    })
  );

tickets.push(...generated);

export function getTicketsForBuyer(buyerId: string) {
  return tickets.filter((t) => t.buyerId === buyerId).sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime());
}
