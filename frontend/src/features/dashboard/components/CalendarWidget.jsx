import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarWidget = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  // Get calendar data for current month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date().getDate();
  const isCurrentMonth = new Date().getMonth() === month && new Date().getFullYear() === year;
  
  // Get first day of month (0 = Sunday, 6 = Saturday)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  // Get number of days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Create dates array with null for empty cells
  const dates = [];
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayOfMonth; i++) {
    dates.push(null);
  }
  // Add all days in month
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push(i);
  }
  // Add empty cells to complete the last row
  while (dates.length % 7 !== 0) {
    dates.push(null);
  }
  
  // Format month name
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const displayMonth = `${monthNames[month]} ${year}`;
  
  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={goToPreviousMonth}
          className="p-1 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
          {displayMonth}
        </h3>
        <button 
          onClick={goToNextMonth}
          className="p-1 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {days.map((day) => (
          <div
            key={day}
            className="text-xs font-semibold text-gray-500 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
        {dates.map((date, index) => (
          <div
            key={index}
            className={`aspect-square flex items-center justify-center text-sm rounded-lg ${
              date
                ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors'
                : 'text-transparent pointer-events-none'
            } ${
              date === today && isCurrentMonth
                ? 'bg-yellow-500 dark:bg-yellow-600 text-white font-bold hover:bg-yellow-600 dark:hover:bg-yellow-700'
                : ''
            }`}
          >
            {date}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarWidget;