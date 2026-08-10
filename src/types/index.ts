// Central domain types for the Garden City Naugaon CRM & Buyer Portal prototype.
// All data is mocked; these types describe the shape a future API would return.

export type Role = "admin" | "buyer";

export interface SessionUser {
  id: string;
  role: Role;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  title?: string;
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
  townshipSizeAcres: number;
  totalPlots: number;
  location: string;
  launchDate: string;
  legalStatus: "RERA Approved" | "Pending Approval";
  reraNumber: string;
  salesManager: { name: string; phone: string };
  developmentPhase: string;
  developmentStatus: "Completed" | "In Progress" | "Upcoming";
  amenities: string[];
  locationAdvantages: string[];
  plotCategories: { label: string; count: number; percent: number }[];
}

export type PlotStatus = "available" | "booked" | "sold" | "reserved";
export type PlotFacing = "North" | "South" | "East" | "West" | "North-East" | "North-West" | "South-East" | "South-West";

export interface Plot {
  id: string;
  plotNo: string;
  projectId: string;
  block: string;
  widthFt: number;
  depthFt: number;
  areaSqYd: number;
  category: string;
  facing: PlotFacing;
  roadWidthFt: number;
  isCorner: boolean;
  isParkFacing: boolean;
  status: PlotStatus;
  basePricePerSqYd: number;
  basePrice: number;
  discount: number;
  finalPrice: number;
  buyerId?: string;
  bookingDate?: string;
  paidAmount?: number;
  balanceAmount?: number;
  assignedExecutive?: string;
}

export interface Buyer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  status: "Active" | "Inactive" | "Lead";
  purpose: "Investment" | "Self Use";
  source: "Website" | "Referral" | "Walk-in" | "Broker" | "Advertisement";
  assignedRmId: string;
  buyerSince: string;
  kycStatus: "Verified" | "Pending" | "Rejected";
  registrationStatus: "Completed" | "In Progress" | "Pending";
  plotId?: string;
  notes: string;
  nextFollowUp?: { date: string; note: string; assignedTo: string };
  avatarUrl?: string;
}

export interface RelationshipManager {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  title: string;
}

export interface Booking {
  id: string;
  plotId: string;
  buyerId: string;
  bookingDate: string;
  bookingAmount: number;
  status: "Held" | "Booked" | "Confirmed" | "Cancelled";
}

export type PaymentStatus = "Paid" | "Pending" | "Overdue" | "Failed" | "Partially Paid" | "Upcoming";

export interface PaymentInstallment {
  id: string;
  buyerId: string;
  plotId: string;
  installmentLabel: string;
  installmentNo: number;
  totalInstallments: number;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: PaymentStatus;
  paidOn?: string;
}

export interface PaymentTransaction {
  id: string;
  buyerId: string;
  plotId: string;
  date: string;
  amount: number;
  mode: "UPI" | "Bank Transfer" | "Cheque" | "Card" | "Cash";
  status: "Success" | "Pending" | "Failed";
  referenceNo: string;
  receiptAvailable: boolean;
}

export interface LoanInfo {
  buyerId: string;
  bankName: string;
  accountHolder: string;
  loanAmount: number;
  disbursedAmount: number;
  accountNumberMasked: string;
  ifsc: string;
  loanAccountNo: string;
}

export type DocumentCategory = "KYC" | "Financial" | "Property" | "Legal";
export type DocumentStatus = "Verified" | "Pending" | "Rejected" | "Resubmission Required";

export interface DocumentItem {
  id: string;
  buyerId: string;
  plotId?: string;
  name: string;
  category: DocumentCategory;
  status: DocumentStatus;
  uploadedBy: string;
  uploadedByRole: string;
  uploadDate: string;
  fileSizeKb: number;
  fileType: "PDF" | "JPG" | "PNG";
  verifiedBy?: string;
  rejectionReason?: string;
  expiresOn?: string;
  version: number;
  history: { version: number; date: string; action: string; by: string }[];
}

export type MilestoneStatus = "Completed" | "In Progress" | "Upcoming";

export interface RegistrationMilestone {
  id: string;
  buyerId: string;
  step: "Agreement" | "KYC Verification" | "Sale Deed" | "Registration" | "Possession";
  status: MilestoneStatus;
  date?: string;
  description: string;
  linkedDocumentId?: string;
}

export type CommunicationChannel = "Message" | "Call" | "Email" | "Notice" | "WhatsApp" | "Meeting" | "System";

export interface CommunicationItem {
  id: string;
  buyerId: string;
  channel: CommunicationChannel;
  subject: string;
  body: string;
  from: string;
  date: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  direction: "inbound" | "outbound";
  internal: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  category: "Payment" | "Document" | "Project" | "Registration" | "Support" | "Meeting" | "General";
  title: string;
  body: string;
  date: string;
  read: boolean;
  link?: string;
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  title: string;
  description: string;
  category: "Construction" | "Infrastructure" | "Amenities" | "Events";
  date: string;
  images: string[];
}

export type TicketPriority = "Low" | "Medium" | "High";
export type TicketStatus = "Open" | "In Progress" | "Resolved" | "On Hold" | "Closed";

export interface SupportTicket {
  id: string;
  buyerId: string;
  plotId?: string;
  subject: string;
  description: string;
  category: "Payments" | "Registration" | "Documentation" | "Infrastructure" | "Site Visit" | "General Query";
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo: string;
  createdOn: string;
  slaState: "Within SLA" | "At Risk" | "Breached" | "No SLA";
  activity: { id: string; type: string; text: string; by: string; date: string }[];
}

export interface Referral {
  id: string;
  referrerBuyerId: string;
  referredName: string;
  referredEmail: string;
  referredPhone: string;
  status: "Eligible" | "Site Visit Scheduled" | "Interested" | "Converted" | "Lost";
  plotId?: string;
  saleValue?: number;
  rewardAmount: number;
  rewardStatus: "Pending" | "Processed";
  referredOn: string;
}

export interface ActivityLogItem {
  id: string;
  type: "sale" | "booking" | "payment" | "document" | "agreement" | "communication" | "registration";
  title: string;
  description: string;
  date: string;
  icon?: string;
}
