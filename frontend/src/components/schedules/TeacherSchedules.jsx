import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { canManageAllSchedules } from '../../utils/permissions';

const TeacherSchedules = ({ schedules, loading, onEdit, onDelete }) => {
  const { user } = useAuth();
  const userCanManageAllSchedules = canManageAllSchedules(user);
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden">
      {/* Table Header */}
      <div className="bg-amber-300 px-6 py-4">
        <div className="grid grid-cols-6 gap-4 text-center font-semibold text-gray-900">
          <div>Teacher Name</div>
          <div>Subject</div>
          <div>Day</div>
          <div>Time</div>
          <div>Room</div>
          <div>Actions</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {schedules.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No teacher schedules found
            </p>
          </div>
        ) : (
          schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="grid grid-cols-6 gap-4 px-6 py-5 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center justify-center">
                <p className="font-medium text-gray-900 dark:text-white">
                  {schedule.teacher}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <p className="text-gray-900 dark:text-white">
                  {schedule.subject}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <p className="text-gray-900 dark:text-white">
                  {schedule.day}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <p className="text-gray-900 dark:text-white">
                  {schedule.time}
                </p>
              </div>
              <div className="flex items-center justify-center">
                <p className="text-gray-900 dark:text-white">
                  {schedule.room}
                </p>
              </div>
              <div className="flex items-center justify-center gap-3">
                {userCanManageAllSchedules ? (
                  <>
                    <button
                      onClick={() => onEdit(schedule)}
                      className="text-amber-500 hover:text-amber-600 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(schedule.id)}
                      className="text-red-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <span className="text-gray-400 dark:text-gray-500 text-sm">View Only</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherSchedules;
