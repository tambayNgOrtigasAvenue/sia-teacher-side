import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import DarkModeProvider from './components/DarkModeProvider';
import DashboardLayout from './components/layout/dashboardLayout';

// Feature: Auth
import LoginPage from './features/auth/pages/LoginPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage';

// Feature: Dashboard
import DashboardPage from './features/dashboard/pages/DashboardPage';

// Feature: Classes
import ClassManagementApp from './features/classes/pages/ClassManagementApp';
import ApplicationPage from './features/classes/pages/ApplicationPage';

// Feature: Scheduling
import TeachingSchedulePage from './features/scheduling/pages/TeachingSchedulePage';
import EmergencyDismissalPage from './features/scheduling/pages/EmergencyDismissalPage';

// Feature: Attendance
import AttendancePage from './features/attendance/pages/AttendancePage';
import AttendanceReportPage from './features/attendance/pages/AttendanceReportPage';

// Feature: Notifications
import NotificationPage from './features/notifications/pages/NotificationPage';

// Feature: Announcements
import AnnouncementContainer from './features/announcements/pages/AnnouncementContainer';

// Feature: Settings
import SettingsPage from './features/settings/pages/SettingsPage';

// Feature: Help
import HelpSupportPage from './features/help/pages/HelpSupportPage';

// Other
import RegisterTeacher from './components/common/homepage/registerTeacher';

/** 
 * ProtectedRoute Component
 * Checks if user is authenticated before allowing access to dashboard routes
 */
function ProtectedRoute({ children }) {
  // Check if user is authenticated (checks for session/token)
  // This is a simple check - modify based on your auth implementation
  const isAuthenticated = () => {
    // Check if there's a session or token stored
    // For now, we'll check localStorage or sessionStorage
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('teacherSession');
    return !!token; // Returns true if token exists
  };

  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected content
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DarkModeProvider>
          <Routes>
            {/* Login Route - Default landing page */}
            <Route path="/login" element={<LoginPage />} />

            {/* Password Reset Routes 
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            */}

            {/* Root path redirects to login
            <Route path="/" element={<Navigate to="/login" replace />} />
            */}

            {/* Protected Dashboard Routes */}
            <Route
              path="/teacher-dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="my-classes" element={<ClassManagementApp />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="attendance-report" element={<AttendanceReportPage />} />
              <Route path="teaching-schedule" element={<TeachingSchedulePage />} />
              <Route path="emergency-dismissal" element={<EmergencyDismissalPage />} />
              <Route path="notifications" element={<NotificationPage />} />
              <Route path="announcements" element={<AnnouncementContainer />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Catch-all route - redirect t  o login for any unknown paths */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </DarkModeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;