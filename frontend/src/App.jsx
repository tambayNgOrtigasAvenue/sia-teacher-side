import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DarkModeProvider from './components/DarkModeProvider';
import DashboardLayout from './components/layout/dashboardLayout';
import DashboardPage from './components/pages/dashboardPage';
import ClassManagementApp from './components/pages/classManagementApp';
import TeachingSchedulePage from './components/pages/teachingSchedulePage';
import NotificationPage from './components/pages/notificationPage';
import AnnouncementContainer from './components/pages/announcementContainer';
import SettingsPage from './components/pages/applicationPage';
import HelpSupportPage from './components/pages/helpSupportPage';


function App() {
  return (
    <>
      <BrowserRouter>
        <DarkModeProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/teacher-dashboard" replace />} />
            <Route path="/teacher-dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="my-classes" element={<ClassManagementApp />} />
              <Route path="teaching-schedule" element={<TeachingSchedulePage />} />
              <Route path="notifications" element={<NotificationPage />} />
              <Route path="announcements" element={<AnnouncementContainer />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="help-and-support" element={<HelpSupportPage />} />
            </Route>
          </Routes>
        </DarkModeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;