import type { NotificationItem } from "@/types";

export const buyerNotifications: NotificationItem[] = [
  { id: "bn-1", userId: "buyer-rahul", category: "Payment", title: "Installment Due Reminder", body: "Your 3rd installment of ₹5,00,000 is due on 15 Sep 2026. Please make the payment on time to avoid late fees.", date: "2026-08-10T09:30:00", read: false, link: "/buyer/payments" },
  { id: "bn-2", userId: "buyer-rahul", category: "Project", title: "New Project Update Shared", body: "A new project update “Internal Road Work Completed in Block B” has been shared in Project Updates.", date: "2026-08-10T08:15:00", read: false, link: "/buyer/updates" },
  { id: "bn-3", userId: "buyer-rahul", category: "Support", title: "Support Request #SUP-101 in Progress", body: "Your support request regarding “Document Clarification” is currently in progress. Our team will update you soon.", date: "2026-08-09T16:45:00", read: false, link: "/buyer/support" },
  { id: "bn-4", userId: "buyer-rahul", category: "Meeting", title: "Site Visit Scheduled", body: "Your site visit is scheduled on 18 Aug 2026 at 11:00 AM. Our team will be available at the site.", date: "2026-08-09T11:20:00", read: true, link: "/buyer/dashboard" },
  { id: "bn-5", userId: "buyer-rahul", category: "General", title: "Happy Birthday, Rahul!", body: "Wishing you a wonderful year ahead filled with happiness and success!", date: "2026-08-01T09:00:00", read: true },
  { id: "bn-6", userId: "buyer-rahul", category: "Document", title: "Document Requested", body: "Please upload your latest bank statement to complete verification for your loan pre-approval.", date: "2026-07-28T10:00:00", read: true, link: "/buyer/documents" },
  { id: "bn-7", userId: "buyer-rahul", category: "Registration", title: "Registration Milestone Updated", body: "Your Sale Deed has been executed. Registration is now in progress.", date: "2026-08-01T12:00:00", read: true, link: "/buyer/registration" },
  { id: "bn-8", userId: "buyer-rahul", category: "Support", title: "Meeting Reminder", body: "Reminder: your call with Relationship Manager Sandeep Singh is scheduled for tomorrow at 4:00 PM.", date: "2026-07-25T09:00:00", read: true },
];

export const adminNotifications: NotificationItem[] = [
  { id: "an-1", userId: "admin-1", category: "Payment", title: "Overdue Payment Alert", body: "18 payments totaling ₹1.85 Cr are overdue by more than 30 days.", date: "2026-08-10T08:00:00", read: false, link: "/admin/finance" },
  { id: "an-2", userId: "admin-1", category: "Document", title: "Documents Pending Verification", body: "37 documents are pending verification across active buyers.", date: "2026-08-10T07:30:00", read: false, link: "/admin/documents" },
  { id: "an-3", userId: "admin-1", category: "Support", title: "High Priority Ticket Opened", body: "Rohit Sharma raised a High priority ticket: “Street light not working near A-125”.", date: "2026-08-09T15:10:00", read: false, link: "/admin/support" },
  { id: "an-4", userId: "admin-1", category: "General", title: "New Booking Created", body: "Neha Gupta booked Plot GCN-073.", date: "2026-08-09T09:45:00", read: true, link: "/admin/buyers" },
  { id: "an-5", userId: "admin-1", category: "Meeting", title: "Site Visit Scheduled", body: "A site visit has been scheduled for tomorrow with 3 prospective buyers.", date: "2026-08-08T12:00:00", read: true },
  { id: "an-6", userId: "admin-1", category: "Registration", title: "Registration Completed", body: "Registration for Rohit Sharma (GCN-045) marked as completed.", date: "2026-08-07T10:00:00", read: true, link: "/admin/buyers" },
];

export function getNotificationsForUser(userId: string) {
  const list = userId === "admin-1" ? adminNotifications : buyerNotifications;
  return [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
