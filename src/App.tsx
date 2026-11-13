import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { AdminShell } from '@/components/layout/AdminShell';
import { AdminProtectedRoute } from '@/routes/AdminProtectedRoute';

import AdminLoginPage from '@/features/auth/AdminLoginPage';
import AdminDashboardPage from '@/features/dashboard/AdminDashboardPage';
import BusinessesPage from '@/features/businesses/BusinessesPage';
import UsersPage from '@/features/users/UsersPage';
import SubscriptionsPage from '@/features/subscriptions/SubscriptionsPage';
import PaymentSubmissionsPage from '@/features/payments/PaymentSubmissionsPage';
import PlansPage from '@/features/plans/PlansPage';
import SupportTicketsPage from '@/features/support/SupportTicketsPage';
import AuditLogsPage from '@/features/audit/AuditLogsPage';
import SystemHealthPage from '@/features/system/SystemHealthPage';
import PlatformConfigPage from '@/features/config/PlatformConfigPage';
import AdminSettingsPage from '@/features/settings/AdminSettingsPage';

export default function App() {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AdminLoginPage />} />

      <Route element={<AdminProtectedRoute><AdminShell /></AdminProtectedRoute>}>
        <Route path="/dashboard" element={<AdminDashboardPage />} />
        <Route path="/businesses" element={<BusinessesPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/payments" element={<PaymentSubmissionsPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/support" element={<SupportTicketsPage />} />
        <Route path="/audit" element={<AuditLogsPage />} />
        <Route path="/health" element={<SystemHealthPage />} />
        <Route path="/config" element={<PlatformConfigPage />} />
        <Route path="/settings" element={<AdminSettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}
