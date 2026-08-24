import React, { useState } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { PatientAppPreviewDrawer } from "../preview/PatientAppPreviewDrawer";
import { useProviderStore } from "../../store/useProviderStore";

export const AppShell: React.FC = () => {
  const location = useLocation();
  const isAuthenticated = useProviderStore((s) => s.isAuthenticated);
  const onboarding = useProviderStore((s) => s.onboarding);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If onboarding is not completed and user is not on onboarding path, redirect to onboarding
  if (!onboarding.isCompleted && !location.pathname.startsWith("/onboarding")) {
    return <Navigate to="/onboarding/account" replace />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Right Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation */}
        <Topbar />

        {/* Dynamic Page Router Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating Simulated Live Patient App Drawer */}
      <PatientAppPreviewDrawer />
    </div>
  );
};
