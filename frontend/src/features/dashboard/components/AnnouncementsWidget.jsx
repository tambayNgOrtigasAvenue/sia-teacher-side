import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Megaphone } from 'lucide-react';
import { API_ENDPOINTS } from '../../../config/api';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.GET_ANNOUNCEMENTS}?limit=3`,
          { withCredentials: true }
        );
        
        if (response.data.success) {
          setAnnouncements(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Announcements
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
          Announcements
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
          Error loading announcements
        </div>
      )}
      
      {announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Megaphone className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" />
          <p className="text-gray-500 dark:text-gray-400">
            No announcements available
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            School announcements will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((item) => (
            <div key={item.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-[#F3D67D]/50 dark:bg-yellow-700/50">
                  <Bell className="w-4 h-4 text-yellow-700 dark:text-yellow-300" />
                </span>
              </div>
              <div className="flex-1 min-w-0">
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
      )}
    </div>
  );
};

export default Announcements;