import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Bell, Search, ChevronDown } from 'lucide-react';

/**
 * NotificationPage Component
 * 
 * Displays notifications from the announcement table
 * Shows category, description, date, time, and status
 */
const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'http://localhost/gymnazo-christian-academy-teacher-side/backend/api/announcements/get-announcements.php',
        { withCredentials: true }
      );

      if (response.data.success) {
        // Transform announcements into notification format
        const transformedNotifications = response.data.data.map(announcement => ({
          id: announcement.id,
          category: announcement.createdBy || 'ADMIN',
          description: announcement.title,
          date: new Date(announcement.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          }),
          time: new Date(announcement.createdAt).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          status: 'Completed', // Since these are published announcements
          fullMessage: announcement.message
        }));
        
        setNotifications(transformedNotifications);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = searchTerm === '' || 
      notification.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterOption === 'All' || 
      notification.category === filterOption ||
      notification.status === filterOption;
    
    return matchesSearch && matchesFilter;
  });

  // Get unique categories for filter options
  const categories = ['All', ...new Set(notifications.map(n => n.category))];
  const statuses = ['All', 'Completed', 'Pending'];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-6">
          Notifications
        </h1>

        {/* Search Bar with Filter */}
        <div className="flex items-center gap-0 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md max-w-2xl overflow-hidden relative">
          {/* Filter Dropdown */}
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-sm font-medium">
                {filterOption === 'All' ? 'Add filter' : filterOption}
              </span>
              <ChevronDown size={16} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Filter Dropdown Menu */}
            {isFilterOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 min-w-[160px]">
                <div className="py-2">
                  {/* All Option */}
                  <button
                    onClick={() => {
                      setFilterOption('All');
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      filterOption === 'All' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    All
                  </button>

                  {/* Categories */}
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Category
                  </div>
                  {categories.filter(c => c !== 'All').map(category => (
                    <button
                      key={category}
                      onClick={() => {
                        setFilterOption(category);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        filterOption === category ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {category}
                    </button>
                  ))}

                  {/* Status */}
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Status
                  </div>
                  {statuses.filter(s => s !== 'All').map(status => (
                    <button
                      key={status}
                      onClick={() => {
                        setFilterOption(status);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        filterOption === status ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-3 flex-1 bg-gray-100 dark:bg-gray-800 px-4 py-3">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-gray-600 dark:text-gray-300 placeholder-gray-400 outline-none text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Badge */}
        {filterOption !== 'All' && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Active filter:</span>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium">
              {filterOption}
              <button
                onClick={() => setFilterOption('All')}
                className="hover:text-amber-900 dark:hover:text-amber-200 transition-colors"
              >
                ×
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Notifications Table */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden">
        {/* Table Header */}
        <div className="bg-[#F4D77D] dark:bg-amber-600 px-8 py-5">
          <div className="grid grid-cols-[200px_1fr_150px_120px_150px] gap-6 text-center font-medium text-gray-700 dark:text-gray-900">
            <div>Category</div>
            <div>Description</div>
            <div>Date</div>
            <div>Time</div>
            <div>Status</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">Error loading notifications</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">{error}</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Bell className="w-20 h-20 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-xl font-semibold">
                You have no notifications
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                {searchTerm ? 'Try adjusting your search' : 'New notifications will appear here'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className="px-8 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="grid grid-cols-[200px_1fr_150px_120px_150px] gap-6 items-center text-center">
                  {/* Category */}
                  <div className="font-medium text-gray-700 dark:text-gray-300">
                    {notification.category}
                  </div>

                  {/* Description */}
                  <div className="text-gray-700 dark:text-gray-300 text-left truncate">
                    {notification.description}
                  </div>

                  {/* Date */}
                  <div className="text-gray-700 dark:text-gray-300">
                    {notification.date}
                  </div>

                  {/* Time */}
                  <div className="text-gray-700 dark:text-gray-300">
                    {notification.time}
                  </div>

                  {/* Status */}
                  <div
                    className={`font-medium ${
                      notification.status === 'Completed'
                        ? 'text-green-500'
                        : 'text-red-400'
                    }`}
                  >
                    {notification.status}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;