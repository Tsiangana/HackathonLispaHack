import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { OnboardingWizard } from "./pages/onboarding/OnboardingWizard";

import { OverviewDashboard } from "./pages/dashboard/OverviewDashboard";
import { HospitalProfilePage } from "./pages/hospital/HospitalProfilePage";
import { HospitalLocationsPage } from "./pages/hospital/HospitalLocationsPage";
import { ServicesListPage } from "./pages/services/ServicesListPage";
import { ServiceDetailPage } from "./pages/services/ServiceDetailPage";
import { OperationalStatusPage } from "./pages/operations/OperationalStatusPage";
import { AnnouncementsPage } from "./pages/operations/AnnouncementsPage";
import { PatientRequestsPage } from "./pages/requests/PatientRequestsPage";
import { InfrastructureMonitoringPage } from "./pages/monitoring/InfrastructureMonitoringPage";
import { AnalyticsPage } from "./pages/analytics/AnalyticsPage";
import { TeamManagementPage } from "./pages/team/TeamManagementPage";
import { SettingsPage } from "./pages/settings/SettingsPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

        {/* Onboarding Route */}
        <Route path="/onboarding/*" element={<OnboardingWizard />} />

        {/* Protected SaaS App Routes */}
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<OverviewDashboard />} />
          <Route path="/hospital/profile" element={<HospitalProfilePage />} />
          <Route path="/hospital/locations" element={<HospitalLocationsPage />} />

          <Route path="/services" element={<ServicesListPage />} />
          <Route path="/services/:id" element={<ServiceDetailPage />} />

          <Route path="/operations/status" element={<OperationalStatusPage />} />
          <Route path="/operations/announcements" element={<AnnouncementsPage />} />
          <Route path="/operations/announcements/:id" element={<AnnouncementsPage />} />

          <Route path="/requests" element={<PatientRequestsPage />} />
          <Route path="/requests/:id" element={<PatientRequestsPage />} />

          <Route path="/telemetry" element={<InfrastructureMonitoringPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/team" element={<TeamManagementPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
