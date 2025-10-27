import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

const ScheduleItem = ({ item }) => {
  const iconClass = "w-4 h-4 text-gray-500 dark:text-gray-400 mr-2";
  
  return (
    <div className="py-2">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{item.subject}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{item.grade}</p>
      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
        <div className="flex items-center">
          <Calendar className={iconClass} />
          <span>{item.day}</span>
        </div>
        <div className="flex items-center">
          <Clock className={iconClass} />
          <span>{item.time}</span>
        </div>
        <div className="flex items-center">
          <MapPin className={iconClass} />
          <span>{item.room}</span>
        </div>
      </div>
    </div>
  );
};

export default ScheduleItem;