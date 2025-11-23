import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import DarkModeProvider from './components/DarkModeProvider';
import DashboardLayout from './components/layout/dashboardLayout';
import DashboardPage from './components/pages/dashboardPage';
import ClassManagementApp from './components/pages/classManagementApp';
import TeachingSchedulePage from './components/pages/teachingSchedulePage';
import NotificationPage from './components/pages/notificationPage';
import AnnouncementContainer from './components/pages/announcementContainer';
import SettingsPage from './components/pages/settingsPage';
import ApplicationPage from './components/pages/applicationPage';
import HelpSupportPage from './components/pages/helpSupportPage';
import LoginPage from './components/pages/loginPage';
import RegisterTeacher from './components/common/homepage/registerTeacher';
import AttendancePage from './pages/AttendancePage';
import AttendanceReportPage from './pages/AttendanceReportPage';
import EmergencyDismissalPage from './pages/EmergencyDismissalPage';

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
            
            {/* Registration Route */}
            <Route path="/register-teacher" element={<RegisterTeacher />} />
            
            {/* Root path redirects to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
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
              <Route path="help-and-support" element={<HelpSupportPage />} />
            </Route>

            {/* Catch-all route - redirect to login for any unknown paths */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </DarkModeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;