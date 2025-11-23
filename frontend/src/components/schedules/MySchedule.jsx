import React from 'react';
import { Star, Bell } from 'lucide-react';

const MySchedule = ({ schedules, loading, onToggleFavorite, onSectionClick }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No schedules found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {schedules.map((schedule) => (
        <div
          key={schedule.id}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden"
        >
          {/* Table Header */}
          <div className="bg-amber-300 px-8 py-5 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {schedule.grade}
            </h3>
            <p className="text-lg font-medium text-gray-900">
              Adviser: {schedule.adviser}
            </p>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-300 dark:divide-gray-600">
            {schedule.sections.map((section) => (
              <div
                key={section.id}
                className="flex items-center justify-between px-8 py-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-center gap-6 flex-1">
                  {/* Star Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(schedule.id, section.id);
                    }}
                    className={`transition-all transform hover:scale-110 active:scale-95 ${
                      section.isFavorite
                        ? 'text-amber-500'
                        : 'text-gray-300 dark:text-gray-600 hover:text-amber-400'
                    }`}
                    title={section.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    aria-label={section.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star 
                      className="w-5 h-5" 
                      fill={section.isFavorite ? 'currentColor' : 'none'}
                      strokeWidth={2}
                    />
                  </button>

                  {/* Section Name */}
                  <div className="flex-1 min-w-[200px]">
                    <p className="font-medium text-gray-900 dark:text-white text-center">
                      {section.name}
                    </p>
                  </div>

                  {/* Room */}
                  <div className="flex-1 min-w-[150px]">
                    <p className="font-medium text-gray-900 dark:text-white text-center">
                      {section.room}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="flex-1 min-w-[120px] flex justify-center">
                    <span className="inline-block px-6 py-2 bg-amber-300/50 text-gray-600 dark:text-gray-700 rounded-xl font-medium text-sm">
                      {section.status}
                    </span>
                  </div>
                </div>

                {/* Emergency Dismissal Button */}
                <div className="ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSectionClick && onSectionClick(schedule, section, 'emergency');
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white rounded-full transition-all shadow-md hover:shadow-lg transform hover:scale-105 text-sm font-semibold whitespace-nowrap"
                    title="Send Emergency Dismissal Notice"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Emergency Dismissal</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MySchedule;
