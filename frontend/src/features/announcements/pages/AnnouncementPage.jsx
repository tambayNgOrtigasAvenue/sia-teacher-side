import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../../../components/common/SearchBar.jsx';
import AnnouncementCard from '../../../components/cards/announcementCard.jsx';
import Breadcrumb from '../../../components/common/Breadcrumb.jsx';
import { API_ENDPOINTS } from '../../../config/api';

/**
 * AnnouncementPage Component
 * 
 * Main page for displaying updated announcements.
 * Shows a grid of announcement cards with search functionality.
 */
export default function AnnouncementPage() {
  // State for announcements data
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for search functionality
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch announcements on mount
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(
          API_ENDPOINTS.GET_ANNOUNCEMENTS,
          { withCredentials: true }
        );

        if (response.data.success) {
          setAnnouncements(response.data.data);
        } else {
          setError('Failed to fetch announcements');
        }
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setError('Error loading announcements. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  // Filtering Logic
  // Filters announcements based on search term (title or description)
  const filteredAnnouncements = announcements.filter((announcement) => {
    if (searchTerm === '') return true;

    const matchesTitle = announcement.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesDescription = (announcement.message || announcement.summary || '')
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesTitle || matchesDescription;
  });

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/teacher-dashboard' },
    { label: 'Announcements' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-8">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Page Header */}
      <div className="pb-6">
        <h1 className="text-center text-5xl font-bold text-gray-900 dark:text-white">
          Updated <span className="text-amber-400">Announcement</span>
        </h1>
      </div>

      {/* Search Bar */}
      <div className="px-8 mb-6 max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search announcements..."
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-center text-red-500 mb-4">
          {error}
        </div>
      )}

      {/* Announcements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={{
                ...announcement,
                description: announcement.summary || announcement.message, // Map message/summary to description
                // Ensure imageUrl is valid or provide a placeholder if needed
                imageUrl: announcement.imageUrl || 'https://via.placeholder.com/400x200?text=No+Image'
              }}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No announcements found</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
}