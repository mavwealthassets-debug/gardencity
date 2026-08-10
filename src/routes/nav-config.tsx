import {
  LayoutGrid,
  Building2,
  Grid3x3,
  Table2,
  Users,
  FileText,
  Wallet,
  HeartHandshake,
  Headset,
  BarChart3,
  Settings,
  Home,
  Landmark,
  ClipboardCheck,
  ScrollText,
  MessageSquare,
  Gift,
  UserCircle,
  Bell,
  Phone,
  MapPinned,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
}

export const adminNavItems: NavItem[] = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutGrid, end: true },
  { label: "Projects", to: "/admin/projects", icon: Building2 },
  { label: "Plot Layout", to: "/admin/plot-layout", icon: Grid3x3 },
  { label: "Plot Inventory", to: "/admin/plot-inventory", icon: Table2 },
  { label: "Buyers", to: "/admin/buyers", icon: Users },
  { label: "Documents", to: "/admin/documents", icon: FileText },
  { label: "Finance", to: "/admin/finance", icon: Wallet },
  { label: "Relationships", to: "/admin/relationships", icon: HeartHandshake },
  { label: "Support", to: "/admin/support", icon: Headset },
  { label: "Reports", to: "/admin/reports", icon: BarChart3 },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

export const buyerNavItems: NavItem[] = [
  { label: "Dashboard", to: "/buyer/dashboard", icon: Home, end: true },
  { label: "My Plot", to: "/buyer/my-plot", icon: MapPinned },
  { label: "Payments", to: "/buyer/payments", icon: Wallet },
  { label: "My Documents", to: "/buyer/documents", icon: FileText },
  { label: "Registration", to: "/buyer/registration", icon: ClipboardCheck },
  { label: "Project Updates", to: "/buyer/updates", icon: ScrollText },
  { label: "Communication", to: "/buyer/communication", icon: MessageSquare },
  { label: "Support", to: "/buyer/support", icon: Headset },
  { label: "Referrals", to: "/buyer/referrals", icon: Gift },
  { label: "My Profile", to: "/buyer/profile", icon: UserCircle },
  { label: "Notifications", to: "/buyer/notifications", icon: Bell },
  { label: "Sales Office", to: "/buyer/sales-office", icon: Landmark },
  { label: "Settings", to: "/buyer/settings", icon: Settings },
];

export const quickContactNav: NavItem = { label: "Quick Contact", to: "/buyer/support", icon: Phone };
