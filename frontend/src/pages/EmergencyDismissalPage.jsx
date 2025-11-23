import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Clock } from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb';
import axios from 'axios';
import toast from 'react-hot-toast';

const EmergencyDismissalPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const scheduleData = location.state?.schedule;

  const [dismissalTime, setDismissalTime] = useState({
    hour: '00',
    minute: '00',
    period: 'PM'
  });
  const [message, setMessage] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('all');
  const [selectedParent, setSelectedParent] = useState('');
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showParentDropdown, setShowParentDropdown] = useState(false);

  const breadcrumbItems = [
    { label: 'Teaching Schedule', href: '/teacher-dashboard/teaching-schedule' },
    { label: 'Emergency Dismissal' }
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    if (!scheduleData) {
      toast.error('No schedule data found');
      navigate('/teacher-dashboard/teaching-schedule');
      return;
    }

    // Fetch parents for this section
    fetchParents();
  }, [scheduleData, navigate]);

  const fetchParents = async () => {
    try {
      if (!scheduleData?.sectionId) return;

      const response = await axios.get(
        `http://localhost/gymnazo-christian-academy-teacher-side/backend/api/notifications/get-section-parents.php?sectionId=${scheduleData.sectionId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setParents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching parents:', error);
    }
  };

  const handleTimeChange = (field, value) => {
    setDismissalTime(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const incrementHour = () => {
    const current = parseInt(dismissalTime.hour);
    const next = current >= 12 ? 1 : current + 1;
    setDismissalTime(prev => ({ ...prev, hour: next.toString().padStart(2, '0') }));
  };

  const decrementHour = () => {
    const current = parseInt(dismissalTime.hour);
    const newValue = current <= 1 ? 12 : current - 1;
    setDismissalTime(prev => ({ ...prev, hour: newValue.toString().padStart(2, '0') }));
  };

  const incrementMinute = () => {
    const current = parseInt(dismissalTime.minute);
    const next = current >= 59 ? 0 : current + 1;
    setDismissalTime(prev => ({ ...prev, minute: next.toString().padStart(2, '0') }));
  };

  const decrementMinute = () => {
    const current = parseInt(dismissalTime.minute);
    const newValue = current <= 0 ? 59 : current - 1;
    setDismissalTime(prev => ({ ...prev, minute: newValue.toString().padStart(2, '0') }));
  };

  const togglePeriod = () => {
    setDismissalTime(prev => ({
      ...prev,
      period: prev.period === 'AM' ? 'PM' : 'AM'
    }));
  };

  const formatSelectedTime = () => {
    return `${dismissalTime.hour}:${dismissalTime.minute} ${dismissalTime.period}`;
  };

  const handleSendNotification = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (dismissalTime.hour === '00' && dismissalTime.minute === '00') {
      toast.error('Please set a valid dismissal time');
      return;
    }

    if (selectedRecipient === 'specific' && !selectedParent) {
      toast.error('Please select a parent');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost/gymnazo-christian-academy-teacher-side/backend/api/notifications/send-dismissal-notification.php',
        {
          scheduleId: scheduleData?.scheduleId,
          sectionId: scheduleData?.sectionId,
          gradeLevel: scheduleData?.gradeLevel,
          section: scheduleData?.section,
          subject: scheduleData?.subject,
          originalEndTime: scheduleData?.endTime,
          newDismissalTime: formatSelectedTime(),
          message: message,
          recipientType: selectedRecipient,
          parentId: selectedRecipient === 'specific' ? selectedParent : null
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Notification sent successfully!');
        setMessage('');
        setDismissalTime({ hour: '00', minute: '00', period: 'PM' });
        setSelectedRecipient('all');
        setSelectedParent('');
      } else {
        toast.error(response.data.message || 'Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Error sending notification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!scheduleData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fcfcfcf7] dark:bg-gray-900 px-8 py-6">
      <div className="max-w-[1600px] mx-auto">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mt-6 mb-8">
          <h1 className="text-5xl font-bold text-[#404040] dark:text-white mb-1">Class Schedule</h1>
          <h2 className="text-2xl font-medium text-[#945c42] dark:text-amber-400">
            Grade {scheduleData.gradeLevel} - Section {scheduleData.section}
          </h2>
        </div>

        <div className="flex gap-6">
          {/* Main Schedule Area */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden">
            {/* Day Tabs */}
            <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              {days.map((day) => (
                <button
                  key={day}
                  className={`flex-1 px-4 py-4 text-sm font-semibold transition-colors ${
                    day === scheduleData.day
                      ? 'text-[#ffad1f] border-b-2 border-[#e08e00] bg-white dark:bg-gray-800'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {day.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Schedule Item */}
            <div className="p-8">
              <div className="flex items-start justify-between pb-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {scheduleData.subject}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Grade {scheduleData.gradeLevel} - Section {scheduleData.section}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Teacher: {scheduleData.teacher}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <Clock size={16} className="text-amber-500" />
                    <span className="font-medium">{scheduleData.startTime} - {scheduleData.endTime}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Room:</span> {scheduleData.room}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Dismissal Panel */}
          <div className="w-[380px] bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-gray-800 dark:to-gray-800/50 border border-amber-200 dark:border-gray-700 rounded-3xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 text-center">
            Change Dismissal Time
          </h2>

          {/* Schedule Info */}
          <div className="mb-6 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800/50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-400">Grade Level:</span>
              <span className="font-semibold">Grade {scheduleData.gradeLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-400">Section:</span>
              <span className="font-semibold">{scheduleData.section}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-400">Day:</span>
              <span className="font-semibold">{scheduleData.day}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-400">Start of Class:</span>
              <span className="font-semibold">{scheduleData.startTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-600 dark:text-gray-400">End of Class:</span>
              <span className="font-semibold">{scheduleData.endTime}</span>
            </div>
          </div>

          {/* Time Picker */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Edit dismissal time:
            </label>
            <div className="flex items-center gap-2 justify-center bg-white dark:bg-gray-800/50 rounded-xl p-3">
              {/* Hour */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={incrementHour}
                  className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  ▲
                </button>
                <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-base font-bold text-gray-900 dark:text-white min-w-[50px] text-center">
                  {dismissalTime.hour}
                </div>
                <button
                  onClick={decrementHour}
                  className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  ▼
                </button>
              </div>

              <span className="text-2xl font-bold text-gray-600 dark:text-gray-400">:</span>

              {/* Minute */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={incrementMinute}
                  className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  ▲
                </button>
                <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-base font-bold text-gray-900 dark:text-white min-w-[50px] text-center">
                  {dismissalTime.minute}
                </div>
                <button
                  onClick={decrementMinute}
                  className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  ▼
                </button>
              </div>

              {/* AM/PM Toggle */}
              <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => handleTimeChange('period', 'AM')}
                  className={`px-5 py-2 text-sm font-semibold transition-colors ${
                    dismissalTime.period === 'AM'
                      ? 'bg-amber-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  AM
                </button>
                <button
                  onClick={() => handleTimeChange('period', 'PM')}
                  className={`px-5 py-2 text-sm font-semibold transition-colors ${
                    dismissalTime.period === 'PM'
                      ? 'bg-amber-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  PM
                </button>
              </div>
            </div>
          </div>

          {/* Selected Value Display */}
          <div className="mb-6 bg-white dark:bg-gray-800/50 rounded-xl p-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Selected Value:</span>
              <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{formatSelectedTime()}</span>
            </div>
          </div>

          {/* Message Input */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Message:
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full h-28 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Send To Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Send To:
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedRecipient('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedRecipient === 'all'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-amber-500 shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                All parents
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
              <div className="relative flex-1">
                <button
                  onClick={() => {
                    setSelectedRecipient('specific');
                    setShowParentDropdown(!showParentDropdown);
                  }}
                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-between transition-all ${
                    selectedRecipient === 'specific'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-amber-500 shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="truncate">
                    {selectedParent
                      ? parents.find(p => p.id === selectedParent)?.name
                      : 'Select parent'}
                  </span>
                  <ChevronDown size={18} className="ml-2 flex-shrink-0" />
                </button>

                {showParentDropdown && (
                  <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl max-h-48 overflow-y-auto z-10">
                    {parents.length > 0 ? (
                      parents.map((parent) => (
                        <button
                          key={parent.id}
                          onClick={() => {
                            setSelectedParent(parent.id);
                            setShowParentDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          {parent.name}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                        No parents found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendNotification}
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3.5 rounded-full text-base font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              'Notify Parents Now'
            )}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default EmergencyDismissalPage;
