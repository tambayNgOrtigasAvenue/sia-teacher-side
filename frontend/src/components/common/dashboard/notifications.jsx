import React from 'react';
import { Bell } from 'lucide-react';

// Placeholder data
const notificationData = [
  {
    id: 1,
    sender: 'ADMIN',
    time: '10:07 AM',
    message: 'The schedule of class Section B has been approved. Kindly re...',
  },
  {
    id: 2,
    sender: 'ADMIN',
    time: '8:40 AM',
    message: 'The schedule of class Section B has been approved. Kindly re...',
  },
  {
    id: 3,
    sender: 'REGISTRAR',
    time: '7:37 AM',
    message: 'The schedule of class Section B has been approved. Kindly re...',
  },
];

const Notifications = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Notifications
        </h2>
        <a
          href="#"
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          view all
        </a>
      </div>
      <div className="space-y-4">
        {notificationData.map((notif) => (
          <div key={notif.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="flex items-center justify-center h-8 w-8 rounded-full bg-[#F3D67D]/50 dark:bg-yellow-700/50">
                <Bell className="w-4 h-4 text-yellow-700 dark:text-yellow-300" />
              </span>
            </div>
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-sm font-semibold text-gray-800 dark:text-white">
                  {notif.sender}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {notif.time}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {notif.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;