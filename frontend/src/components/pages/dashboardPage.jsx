import React from 'react';
import Welcome from '../common/dashboard/welcome';
import MySchedule from '../common/dashboard/myschedule';
import Notifications from '../common/dashboard/notifications';
import CalendarWidget from '../common/dashboard/calendarwidget';
import Announcements from '../common/dashboard/announcements';
import AdvisoryClass from '../common/dashboard/advisoryclass';

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