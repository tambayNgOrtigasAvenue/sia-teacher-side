import React from 'react';
import { Star } from 'lucide-react';

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
                onClick={() => onSectionClick && onSectionClick(schedule, section)}
                className="flex items-center justify-between px-8 py-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                {/* Star Icon */}
                <div className="flex items-center gap-6 flex-1">
                  <button
                    onClick={() => onToggleFavorite(schedule.id, section.id)}
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
                  <div className="w-56 text-center">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {section.name}
                    </p>
                  </div>

                  {/* Room */}
                  <div className="w-56 text-center">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {section.room}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="w-56 text-center">
                    <span className="inline-block px-6 py-2 bg-amber-300/50 text-gray-600 dark:text-gray-700 rounded-xl font-medium">
                      {section.status}
                    </span>
                  </div>
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
