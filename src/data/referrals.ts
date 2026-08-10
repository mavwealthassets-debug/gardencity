import type { Referral } from "@/types";

export const referrals: Referral[] = [
  { id: "ref-1", referrerBuyerId: "buyer-rahul", referredName: "Amit Verma", referredEmail: "amit.verma@email.com", referredPhone: "+91 98765 12345", status: "Converted", plotId: "GCN-012", saleValue: 3200000, rewardAmount: 25000, rewardStatus: "Processed", referredOn: "2026-02-15" },
  { id: "ref-2", referrerBuyerId: "buyer-rahul", referredName: "Karan Malhotra", referredEmail: "karan.malhotra@email.com", referredPhone: "+91 91234 56789", status: "Converted", saleValue: 5000000, rewardAmount: 25000, rewardStatus: "Processed", referredOn: "2026-03-10" },
  { id: "ref-3", referrerBuyerId: "buyer-amit", referredName: "Neha Agarwal", referredEmail: "neha.agarwal@email.com", referredPhone: "+91 98220 33445", status: "Interested", rewardAmount: 25000, rewardStatus: "Pending", referredOn: "2026-05-24" },
  { id: "ref-4", referrerBuyerId: "buyer-vikram", referredName: "Vikram Patel", referredEmail: "vikram.patel@email.com", referredPhone: "+91 99887 66554", status: "Eligible", rewardAmount: 25000, rewardStatus: "Pending", referredOn: "2026-05-21" },
  { id: "ref-5", referrerBuyerId: "buyer-rohit", referredName: "Sneha Iyer", referredEmail: "sneha.iyer@email.com", referredPhone: "+91 93456 77889", status: "Site Visit Scheduled", rewardAmount: 25000, rewardStatus: "Pending", referredOn: "2026-05-18" },
  { id: "ref-6", referrerBuyerId: "buyer-priya", referredName: "Rakesh Nair", referredEmail: "rakesh.nair@email.com", referredPhone: "+91 87654 32109", status: "Lost", rewardAmount: 25000, rewardStatus: "Pending", referredOn: "2026-04-02" },
  { id: "ref-7", referrerBuyerId: "buyer-neha", referredName: "Pooja Mehta", referredEmail: "pooja.mehta@email.com", referredPhone: "+91 91234 56780", status: "Eligible", rewardAmount: 25000, rewardStatus: "Pending", referredOn: "2026-06-01" },
];

export function getReferralsForBuyer(buyerId: string) {
  return referrals.filter((r) => r.referrerBuyerId === buyerId).sort((a, b) => new Date(b.referredOn).getTime() - new Date(a.referredOn).getTime());
}
