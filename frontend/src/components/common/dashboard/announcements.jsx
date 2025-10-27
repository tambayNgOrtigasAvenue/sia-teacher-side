import React from 'react';
import { Bell } from 'lucide-react';

// Placeholder data
const announcementData = [
  {
    id: 1,
    title: 'Sports Day Announcement',
    message: 'The school\'s Annual Sports Day will be held on May 12, 2025.',
  },
  {
    id: 2,
    title: 'Summer Break Start Date',
    message: 'Summer break begins on May 25, 2025. Have a wonderful summer!',
  },
  {
    id: 3,
    title: 'Christmas Break Start Date',
    message: 'Summer break begins on Dec 11, 2025. Have a wonderful holiday!',
  },
];

const Announcements = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Announcements
        </h2>
        <a
          href="#"
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          view all
        </a>
      </div>
      <div className="space-y-4">
        {announcementData.map((item) => (
          <div key={item.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="flex items-center justify-center h-8 w-8 rounded-full bg-[#F3D67D]/50 dark:bg-yellow-700/50">
                <Bell className="w-4 h-4 text-yellow-700 dark:text-yellow-300" />
              </span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-white">
                {item.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {item.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;