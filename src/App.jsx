import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Layouts
import PublicLayout from "./layouts/PublicLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";

// Public Pages
import HomePage from "./pages/public/HomePage.jsx";
import AboutPage from "./pages/public/AboutPage.jsx";
import HowItWorksPage from "./pages/public/HowItWorksPage.jsx";
import LiveMapPage from "./pages/public/LiveMapPage.jsx";
import LoginPage from "./pages/public/LoginPage.jsx";
import SmsSimulatorPage from "./pages/public/SmsSimulatorPage.jsx";

// Citizen Pages
import CitizenDashboard from "./pages/citizen/CitizenDashboard.jsx";
import ReportWastePage from "./pages/citizen/ReportWastePage.jsx";
import AIAnalysisPage from "./pages/citizen/AIAnalysisPage.jsx";
import MyReportsPage from "./pages/citizen/MyReportsPage.jsx";
import TrackCollectionPage from "./pages/citizen/TrackCollectionPage.jsx";
import CommunityPage from "./pages/citizen/CommunityPage.jsx";
import CitizenProfilePage from "./pages/citizen/CitizenProfilePage.jsx";

// Admin Pages
import AdminOverviewPage from "./pages/admin/AdminOverviewPage.jsx";
import AllReportsPage from "./pages/admin/AllReportsPage.jsx";
import PriorityQueuePage from "./pages/admin/PriorityQueuePage.jsx";
import HotspotManagementPage from "./pages/admin/HotspotManagementPage.jsx";
import RouteOptimizationPage from "./pages/admin/RouteOptimizationPage.jsx";
import VehicleManagementPage from "./pages/admin/VehicleManagementPage.jsx";
import WorkerManagementPage from "./pages/admin/WorkerManagementPage.jsx";
import AnalyticsPage from "./pages/admin/AnalyticsPage.jsx";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage.jsx";

// Driver Pages
import DriverOverviewPage from "./pages/driver/DriverOverviewPage.jsx";
import AssignedCollectionsPage from "./pages/driver/AssignedCollectionsPage.jsx";
import DriverNavigationPage from "./pages/driver/DriverNavigationPage.jsx";
import DriverHistoryPage from "./pages/driver/DriverHistoryPage.jsx";
import DriverProfilePage from "./pages/driver/DriverProfilePage.jsx";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/live-map" element={<LiveMapPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sms-simulator" element={<SmsSimulatorPage />} />
          </Route>

          {/* Citizen Portal Routes */}
          <Route element={<ProtectedRoute roles={["citizen"]} />}>
          <Route path="/citizen" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/citizen/dashboard" replace />} />
            <Route path="dashboard" element={<CitizenDashboard />} />
            <Route path="report" element={<ReportWastePage />} />
            <Route path="ai-analysis" element={<AIAnalysisPage />} />
            <Route path="my-reports" element={<MyReportsPage />} />
            <Route path="track" element={<TrackCollectionPage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="profile" element={<CitizenProfilePage />} />
          </Route>
          </Route>

          {/* Admin Command Centre Routes */}
          <Route element={<ProtectedRoute roles={["administrator"]} />}>
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/admin/overview" replace />} />
            <Route path="overview" element={<AdminOverviewPage />} />
            <Route path="reports" element={<AllReportsPage />} />
            <Route path="priority-queue" element={<PriorityQueuePage />} />
            <Route path="ai-lab" element={<AIAnalysisPage />} />
            <Route path="hotspots" element={<HotspotManagementPage />} />
            <Route path="route-optimization" element={<RouteOptimizationPage />} />
            <Route path="vehicles" element={<VehicleManagementPage />} />
            <Route path="workers" element={<WorkerManagementPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
          </Route>

          {/* Driver Fleet Portal Routes */}
          <Route element={<ProtectedRoute roles={["driver"]} />}>
          <Route path="/driver" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/driver/overview" replace />} />
            <Route path="overview" element={<DriverOverviewPage />} />
            <Route path="tasks" element={<AssignedCollectionsPage />} />
            <Route path="navigation" element={<DriverNavigationPage />} />
            <Route path="history" element={<DriverHistoryPage />} />
            <Route path="profile" element={<DriverProfilePage />} />
          </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
