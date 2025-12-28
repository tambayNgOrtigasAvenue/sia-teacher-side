import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell } from 'lucide-react';
import { API_ENDPOINTS } from '../../../config/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.GET_NOTIFICATIONS}?limit=3`,
          { withCredentials: true }
        );
        
        if (response.data.success) {
          setNotifications(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
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
      
      {error && (
        <div className="text-red-500 text-sm mb-4">
          Error loading notifications
        </div>
      )}
      
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Bell className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" />
          <p className="text-gray-500 dark:text-gray-400">
            You have no notifications
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            New notifications will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div key={notif.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-[#F3D67D]/50 dark:bg-yellow-700/50">
                  <Bell className="w-4 h-4 text-yellow-700 dark:text-yellow-300" />
                </span>
              </div>
              <div className="flex-1 min-w-0">
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
      )}
    </div>
  );
};

export default Notifications;