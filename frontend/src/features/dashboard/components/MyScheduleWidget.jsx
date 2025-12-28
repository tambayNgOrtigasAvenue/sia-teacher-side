import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScheduleItem from './ScheduleItem';
import { API_ENDPOINTS } from '../../../config/api';

const MySchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get(
          API_ENDPOINTS.GET_TEACHER_SCHEDULE,
          { withCredentials: true }
        );

        if (response.data.success) {
          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const today = days[new Date().getDay()]; //Change this for testing

          // Filter schedules for today
          // The backend returns 'day' as 'Monday', 'Tuesday', etc.
          const todaysSchedules = response.data.data.filter(schedule => schedule.day === today);
          setSchedules(todaysSchedules);
        }
      } catch (err) {
        console.error('Error fetching schedules:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          My Schedule (Today)
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        My Schedule (Today)
      </h2>

      {error && (
        <div className="text-red-500 text-sm mb-4">
          Error loading schedule: {error}
        </div>
      )}

      {schedules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No class schedule found for today
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Your schedule will appear here once classes are assigned
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {schedules.map((item, index) => (
            <React.Fragment key={item.ScheduleID || index}>
              <ScheduleItem item={item} />
              {index < schedules.length - 1 && (
                <hr className="border-gray-200 dark:border-gray-700" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySchedule;