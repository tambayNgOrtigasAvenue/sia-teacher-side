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
    <div className="space-y-4 md:space-y-6">
      {schedules.map((schedule) => (
        <div
          key={schedule.id}
          className="bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl shadow-lg overflow-hidden"
        >
          {/* Table Header */}
          <div className="bg-amber-300 px-3 md:px-6 lg:px-8 py-3 md:py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h3 className="text-base md:text-lg font-semibold text-gray-900">
              {schedule.grade.replace(/^Grade\s+/i, '')}
            </h3>
            <p className="text-sm md:text-base lg:text-lg font-medium text-gray-900">
              Adviser: {schedule.adviser}
            </p>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-300 dark:divide-gray-600">
            {schedule.sections.map((section) => (
              <div
                key={section.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between px-3 md:px-6 lg:px-8 py-3 md:py-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group gap-3 md:gap-4"
              >
                <div className="flex items-center gap-3 md:gap-4 lg:gap-6 flex-1 w-full md:w-auto">
                  {/* Star Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(schedule.id, section.id);
                    }}
                    className={`transition-all transform hover:scale-110 active:scale-95 flex-shrink-0 ${
                      section.isFavorite
                        ? 'text-amber-500'
                        : 'text-gray-300 dark:text-gray-600 hover:text-amber-400'
                    }`}
                    title={section.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    aria-label={section.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star 
                      className="w-4 h-4 md:w-5 md:h-5" 
                      fill={section.isFavorite ? 'currentColor' : 'none'}
                      strokeWidth={2}
                    />
                  </button>

                  {/* Section Name */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm md:text-base truncate md:text-center">
                      {section.name}
                    </p>
                  </div>

                  {/* Room */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm md:text-base truncate md:text-center">
                      {section.room}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="flex-shrink-0">
                    <span className="inline-block px-3 md:px-4 lg:px-6 py-1 md:py-2 bg-amber-300/50 text-gray-600 dark:text-gray-700 rounded-lg md:rounded-xl font-medium text-xs md:text-sm">
                      {section.status}
                    </span>
                  </div>
                </div>

                {/* Emergency Dismissal Button */}
                <div className="w-full md:w-auto md:ml-2 lg:ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSectionClick && onSectionClick(schedule, section, 'emergency');
                    }}
                    disabled={section.status !== 'Approved'}
                    className={`flex items-center justify-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-full transition-all shadow-md text-xs md:text-sm font-semibold whitespace-nowrap w-full md:w-auto ${
                      section.status === 'Approved'
                        ? 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white hover:shadow-lg transform hover:scale-105 cursor-pointer'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-60'
                    }`}
                    title={
                      section.status === 'Approved'
                        ? 'Send Emergency Dismissal Notice'
                        : 'Cannot send dismissal - Section has no approved schedule'
                    }
                  >
                    <Bell className="w-3 h-3 md:w-4 md:h-4" />
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
