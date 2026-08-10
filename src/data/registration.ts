import type { RegistrationMilestone } from "@/types";
import { buyers } from "./seed";

export const rahulMilestones: RegistrationMilestone[] = [
  { id: "reg-rahul-1", buyerId: "buyer-rahul", step: "Agreement", status: "Completed", date: "2025-01-18", description: "Sale Agreement signed by buyer and developer." },
  { id: "reg-rahul-2", buyerId: "buyer-rahul", step: "KYC Verification", status: "Completed", date: "2025-01-22", description: "KYC documents (Aadhaar, PAN, bank statement) verified successfully." },
  { id: "reg-rahul-3", buyerId: "buyer-rahul", step: "Sale Deed", status: "Completed", date: "2026-08-01", description: "Sale Deed executed and signed by both parties." },
  { id: "reg-rahul-4", buyerId: "buyer-rahul", step: "Registration", status: "In Progress", date: undefined, description: "Registration process is underway at the Sub-Registrar office." },
  { id: "reg-rahul-5", buyerId: "buyer-rahul", step: "Possession", status: "Upcoming", date: undefined, description: "Plot possession will be handed over after registration completion." },
];

function milestonesFor(buyerId: string, regStatus: string): RegistrationMilestone[] {
  const stepOrder: RegistrationMilestone["step"][] = ["Agreement", "KYC Verification", "Sale Deed", "Registration", "Possession"];
  const completedCount = regStatus === "Completed" ? 5 : regStatus === "In Progress" ? 3 : 1;
  return stepOrder.map((step, i) => ({
    id: `reg-${buyerId}-${i}`,
    buyerId,
    step,
    status: i < completedCount ? "Completed" : i === completedCount ? "In Progress" : "Upcoming",
    date: i < completedCount ? "2025-06-01" : undefined,
    description: `${step} milestone for this buyer's plot.`,
  }));
}

const otherMilestones: RegistrationMilestone[] = buyers
  .filter((b) => b.id !== "buyer-rahul" && b.plotId)
  .flatMap((b) => milestonesFor(b.id, b.registrationStatus));

export const registrationMilestones: RegistrationMilestone[] = [...rahulMilestones, ...otherMilestones];

export function getMilestonesForBuyer(buyerId: string) {
  return registrationMilestones.filter((m) => m.buyerId === buyerId);
}
