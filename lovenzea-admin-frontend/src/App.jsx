import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout
import AdminLayout from './layouts/AdminLayout';

// Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminUserManagement from './pages/AdminUserManagement';
import MobileUsersManagement from './pages/MobileUsersManagement';
import MobileUserDetails from './pages/MobileUserDetails';
import VerificationQueue from './pages/VerificationQueue';
import PhotoModeration from './pages/PhotoModeration';
import ReportManagement from './pages/ReportManagement';
import SubscriptionManagement from './pages/SubscriptionManagement';
import SupportTickets from './pages/SupportTickets';
import ContactMessages from './pages/ContactMessages';
import EventManagement from './pages/EventManagement';
import AdminLogViewer from './pages/AdminLogViewer';

function App() {
  return (
    <BrowserRouter>
      {/* Premium Toast Notifications Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: '600',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#0f172a',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#0f172a',
            },
          },
        }}
      />

      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Protected Admin Console Routes */}
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUserManagement />} />
          <Route path="mobile-users" element={<MobileUsersManagement />} />
          <Route path="mobile-users/:id" element={<MobileUserDetails />} />
          <Route path="events" element={<EventManagement />} />
          <Route path="approvals" element={<VerificationQueue />} />
          <Route path="photos" element={<PhotoModeration />} />
          <Route path="reports" element={<ReportManagement />} />
          <Route path="subscriptions" element={<SubscriptionManagement />} />
          <Route path="support" element={<SupportTickets />} />
          <Route path="contacts" element={<ContactMessages />} />
          <Route path="logs" element={<AdminLogViewer />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
