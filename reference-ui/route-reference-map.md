# Garden City UI reference map

Source: `D:\Garden city\garden_city_naugaon_admin_user_ui.pdf`

All pages were rendered to `reference-ui/pdf/page-XX.png`. Pages 1-2 and 13 are presentation dividers rather than application routes.

| PDF page | Reference screen | React route | Current component | Status |
|---:|---|---|---|---|
| 1 | Presentation cover | N/A | N/A | Inspected; informational |
| 2 | Admin Panel divider | N/A | N/A | Inspected; informational |
| 3 | Buyers Management / Buyer 360 | `/admin/buyers/:buyerId` | `BuyerProfilePage.tsx` | Mapped |
| 4 | Admin Dashboard | `/admin/dashboard` | `AdminDashboardPage.tsx` | Mapped |
| 5 | Documents Management | `/admin/documents` | `DocumentsAdminPage.tsx` | Mapped |
| 6 | Finance Management | `/admin/finance` | `FinancePage.tsx` | Mapped |
| 7 | Plot Inventory | `/admin/plot-inventory` | `PlotInventoryPage.tsx` | Mapped |
| 8 | Plot Layout | `/admin/plot-layout` | `PlotLayoutPage.tsx` | Mapped |
| 9 | Projects Management | `/admin/projects` | `ProjectOverviewPage.tsx` | Mapped |
| 10 | Relationship Management | `/admin/relationships` | `RelationshipsPage.tsx` | Mapped |
| 11 | Reports & Analytics | `/admin/reports` | `ReportsPage.tsx` | Mapped |
| 12 | Support Management | `/admin/support` | `SupportAdminPage.tsx` | Mapped |
| 13 | User Panel divider | N/A | N/A | Inspected; informational |
| 14 | Communication | `/buyer/communication` | `CommunicationPage.tsx` | Mapped |
| 15 | My Documents | `/buyer/documents` | `MyDocumentsPage.tsx` | Mapped |
| 16 | Notifications | `/buyer/notifications` | `NotificationsPage.tsx` | Mapped |
| 17 | Profile | `/buyer/profile` | `MyProfilePage.tsx` | Mapped |
| 18 | Property Dashboard | `/buyer/dashboard` | `BuyerDashboardPage.tsx` | Mapped |
| 19 | Sales Office | `/buyer/sales-office` | `SalesOfficePage.tsx` | Mapped |
| 20 | Payments | `/buyer/payments` | `BuyerPaymentsPage.tsx` | Mapped |
| 21 | Plot Details | `/buyer/my-plot` | `MyPlotPage.tsx` | Mapped |
| 22 | Project Updates | `/buyer/updates` | `ProjectUpdatesPage.tsx` | Mapped |
| 23 | Quick Contact | `/buyer/support` | `BuyerSupportPage.tsx` | Mapped |
| 24 | Referrals | `/buyer/referrals` | `ReferralsPage.tsx` | Mapped |
| 25 | Registration / Legal Process | `/buyer/registration` | `RegistrationPage.tsx` | Mapped |

Routes without a dedicated PDF screen: `/admin/buyers` (list), `/admin/settings`, and `/buyer/settings`. These retain the shared shell and responsive design system but have no one-to-one reference page.

## Shared measurements

### Admin reference screens (pages 3-12)

- Rendered reference: 1754 x 1241 (landscape, 1.413 aspect ratio).
- Reference application frame inside the presentation page: approximately 1660 x 1030.
- Sidebar: approximately 190 px in the reference application frame (11.4%).
- Topbar: approximately 74 px.
- Main content outer padding: approximately 24-30 px.
- Common section gap: approximately 16 px; compact card gap: approximately 10-14 px.
- Card padding: approximately 14-18 px.
- Card radius: approximately 8-10 px, subtle 1 px neutral border, minimal shadow.
- Page title: approximately 22-24 px; section title 14-16 px; body/table text 11-13 px.
- Desktop content is dense and uses the full remaining workspace width without a second sidebar offset.

### Buyer reference screens (pages 14-25)

- Rendered reference: 1241 x 1754 (portrait presentation page).
- Embedded application frame: approximately 1120 x 1450; effective UI aspect ratio approximately 0.77.
- Sidebar: approximately 175 px in the embedded frame (15.6%).
- Topbar: approximately 70 px.
- Main content padding: approximately 24-30 px.
- Common section gap: approximately 16-20 px; card gap: approximately 12-16 px.
- Card padding: approximately 16-20 px.
- Card radius: approximately 8-10 px with a neutral border and restrained shadow.
- Page title: approximately 22-26 px; section title 14-17 px; body/table text 11-13 px.
- Full-width relationship-manager band and four-column footer appear near the bottom on most Buyer screens.

## Shared shell targets

- Desktop sidebar width: 256 px in the implementation, consistent across Admin and Buyer routes.
- Topbar height: 64 px.
- One scroll container only: the route `<main>`; body and root remain viewport-locked.
- Content max width: 1440 px, centered, with 20-32 px responsive inline padding and 24-48 px vertical padding.
- Sidebar navigation scrolls independently while its portal switch/logout footer remains pinned and visible.
- Tables own any necessary horizontal overflow; pages never create horizontal overflow.
- Route navigation resets the actual main scroll element to the top.
