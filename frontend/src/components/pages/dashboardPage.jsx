import React from 'react';
import Welcome from '../common/dashboard/welcome';
import MySchedule from '../common/dashboard/myschedule';
import Notifications from '../common/dashboard/notifications';
import CalendarWidget from '../common/dashboard/calendarwidget';
import Announcements from '../common/dashboard/announcements';
import AdvisoryClass from '../common/dashboard/advisoryclass';

const DashboardPage = () => {
  return (
    // Main container for the dashboard content, with padding
    <div className="bg-gray-50 dark:bg-gray-900 min-h-full">
      {/* This grid is the core layout.
        - Default (mobile): Items stack vertically (achieved by mb-6).
        - lg: screens: Applies the 4-column, 7-row grid structure.
      */}
      <div className="lg:grid lg:grid-cols-4 lg:grid-rows-7 lg:gap-6">
        
        {/* Welcome Banner */}
        <div className="lg:col-span-4 mb-6 lg:mb-0">
          <Welcome />
        </div>

        {/* My Schedule */}
        <div className="lg:col-span-2 lg:row-span-6 lg:row-start-2 mb-6 lg:mb-0">
          <MySchedule />
        </div>

        {/* Notifications */}
        <div className="lg:row-span-2 lg:col-start-3 lg:row-start-2 mb-6 lg:mb-0">
          <Notifications />
        </div>

        {/* Calendar */}
        <div className="lg:col-span-2 lg:col-start-3 lg:row-start-4 mb-6 lg:mb-0">
          <CalendarWidget />
        </div>
        
        {/* Announcements */}
        <div className="lg:col-span-2 lg:row-span-2 lg:col-start-3 lg:row-start-4 mb-6 lg:mb-0">
          <Announcements />
        </div>

        {/* Advisory Class */}
        <div className="lg:col-span-2 lg:row-span-2 lg:col-start-3 lg:row-start-6 mb-6 lg:mb-0">
          <AdvisoryClass />
        </div>
        
      </div>
    </div>
  );
};

export default DashboardPage;