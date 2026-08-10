import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { BuyerLayout } from "@/components/layout/BuyerLayout";
import { LoginPage } from "@/features/auth/LoginPage";

const AdminDashboardPage = lazy(() => import("@/features/dashboard/AdminDashboardPage"));
const ProjectOverviewPage = lazy(() => import("@/features/projects/ProjectOverviewPage"));
const PlotLayoutPage = lazy(() => import("@/features/plots/PlotLayoutPage"));
const PlotInventoryPage = lazy(() => import("@/features/plots/PlotInventoryPage"));
const BuyersListPage = lazy(() => import("@/features/buyers/BuyersListPage"));
const BuyerProfilePage = lazy(() => import("@/features/buyers/BuyerProfilePage"));
const DocumentsAdminPage = lazy(() => import("@/features/documents/DocumentsAdminPage"));
const FinancePage = lazy(() => import("@/features/finance/FinancePage"));
const RelationshipsPage = lazy(() => import("@/features/relationships/RelationshipsPage"));
const SupportAdminPage = lazy(() => import("@/features/support/SupportAdminPage"));
const ReportsPage = lazy(() => import("@/features/reports/ReportsPage"));
const AdminSettingsPage = lazy(() => import("@/features/settings/AdminSettingsPage"));

const BuyerDashboardPage = lazy(() => import("@/features/buyer-portal/BuyerDashboardPage"));
const MyPlotPage = lazy(() => import("@/features/buyer-portal/MyPlotPage"));
const BuyerPaymentsPage = lazy(() => import("@/features/buyer-portal/BuyerPaymentsPage"));
const MyDocumentsPage = lazy(() => import("@/features/buyer-portal/MyDocumentsPage"));
const RegistrationPage = lazy(() => import("@/features/buyer-portal/RegistrationPage"));
const ProjectUpdatesPage = lazy(() => import("@/features/buyer-portal/ProjectUpdatesPage"));
const CommunicationPage = lazy(() => import("@/features/buyer-portal/CommunicationPage"));
const BuyerSupportPage = lazy(() => import("@/features/buyer-portal/BuyerSupportPage"));
const ReferralsPage = lazy(() => import("@/features/buyer-portal/ReferralsPage"));
const MyProfilePage = lazy(() => import("@/features/buyer-portal/MyProfilePage"));
const NotificationsPage = lazy(() => import("@/features/buyer-portal/NotificationsPage"));
const SalesOfficePage = lazy(() => import("@/features/buyer-portal/SalesOfficePage"));
const BuyerSettingsPage = lazy(() => import("@/features/buyer-portal/BuyerSettingsPage"));

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="projects" element={<ProjectOverviewPage />} />
        <Route path="plot-layout" element={<PlotLayoutPage />} />
        <Route path="plot-inventory" element={<PlotInventoryPage />} />
        <Route path="buyers" element={<BuyersListPage />} />
        <Route path="buyers/:buyerId" element={<BuyerProfilePage />} />
        <Route path="documents" element={<DocumentsAdminPage />} />
        <Route path="finance" element={<FinancePage />} />
        <Route path="relationships" element={<RelationshipsPage />} />
        <Route path="support" element={<SupportAdminPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      <Route path="/buyer" element={<BuyerLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<BuyerDashboardPage />} />
        <Route path="my-plot" element={<MyPlotPage />} />
        <Route path="payments" element={<BuyerPaymentsPage />} />
        <Route path="documents" element={<MyDocumentsPage />} />
        <Route path="registration" element={<RegistrationPage />} />
        <Route path="updates" element={<ProjectUpdatesPage />} />
        <Route path="communication" element={<CommunicationPage />} />
        <Route path="support" element={<BuyerSupportPage />} />
        <Route path="referrals" element={<ReferralsPage />} />
        <Route path="profile" element={<MyProfilePage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="sales-office" element={<SalesOfficePage />} />
        <Route path="settings" element={<BuyerSettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
