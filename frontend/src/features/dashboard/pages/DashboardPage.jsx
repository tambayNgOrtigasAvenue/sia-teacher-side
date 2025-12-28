import React from 'react';
import Welcome from '../components/Welcome';
import MySchedule from '../components/MyScheduleWidget';
import Notifications from '../components/NotificationsWidget';
import CalendarWidget from '../components/CalendarWidget';
import Announcements from '../components/AnnouncementsWidget';
import AdvisoryClass from '../components/AdvisoryClass';

const DashboardPage = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-full p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Welcome Banner - Full Width */}
        <Welcome />

        {/* Main Content - Adaptive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Left Column - Schedule and Calendar */}
          <div className="space-y-6 flex flex-col">
            <MySchedule />
            <CalendarWidget />
          </div>

          {/* Right Column - Notifications, Announcements, Advisory Class */}
          <div className="space-y-6 flex flex-col">
            <Notifications />
            <Announcements />
            <AdvisoryClass />
          </div>
          
        </div>
        
      </div>
    </div>
  );
};

export default DashboardPage;