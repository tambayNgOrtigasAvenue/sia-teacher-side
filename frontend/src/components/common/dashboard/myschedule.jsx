import React from 'react';
import ScheduleItem from './scheduleitem';

// Placeholder data defined inside the component
const scheduleData = [
  {
    id: 1,
    subject: 'English',
    grade: 'Grade 5 - Section A',
    day: 'Monday',
    time: '6:30 AM - 7:30 AM',
    room: 'Room 201',
  },
  {
    id: 2,
    subject: 'Math',
    grade: 'Grade 4 - Section B',
    day: 'Monday',
    time: '8:30 AM - 9:30 AM',
    room: 'Room 101',
  },
  {
    id: 3,
    subject: 'Science',
    grade: 'Grade 3 - Section C',
    day: 'Tuesday',
    time: '9:30 AM - 10:30 AM',
    room: 'Room 203',
  },
  {
    id: 4,
    subject: 'TLE',
    grade: 'Grade 2 - Section A',
    day: 'Wednesday',
    time: '11:30 AM - 12:00 PM',
    room: 'Room 201',
  },
  {
    id: 5,
    subject: 'ESP',
    grade: 'Grade 1 - Section A',
    day: 'Thursday',
    time: '1:30 AM - 2:30 AM',
    room: 'Room 203',
  },
  {
    id: 6,
    subject: 'ESP',
    grade: 'Grade 1 - Section B',
    day: 'Friday',
    time: '3:30 AM - 4:30 PM',
    room: 'Room 202',
  },
];

const MySchedule = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 h-full">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        My Schedule
      </h2>
      <div className="space-y-4">
        {scheduleData.map((item, index) => (
          <React.Fragment key={item.id}>
            <ScheduleItem item={item} />
            {index < scheduleData.length - 1 && (
              <hr className="border-gray-200 dark:border-gray-700" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MySchedule;