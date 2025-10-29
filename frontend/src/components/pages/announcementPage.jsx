import React, { useState } from 'react';
import SearchBarWithFilter from '../common/dashboard/my-classes/searchBarWithFilter.jsx';
import AnnouncementCard from '../cards/announcementCard.jsx';

/**
 * AnnouncementPage Component
 * 
 * Main page for displaying updated announcements.
 * Shows a grid of announcement cards with search functionality.
 * 
 * @param {Array} announcements - Array of announcement objects from parent state
 */
export default function AnnouncementPage({ announcements }) {
  // State for search functionality
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering Logic
  // Filters announcements based on search term (title or description)
  const filteredAnnouncements = announcements.filter((announcement) => {
    if (searchTerm === '') return true;

    const matchesTitle = announcement.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesDescription = announcement.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesTitle || matchesDescription;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="pt-8 pb-6">
        <h3 className="text-center text-gray-500 text-sm font-semibold tracking-wider uppercase mb-2">
          ANNOUNCEMENT
        </h3>
        <h1 className="text-center text-5xl font-bold text-gray-900">
          Updated <span className="text-amber-400">Announcement</span>
        </h1>
      </div>

      {/* Search Bar */}
      <div className="px-8 mb-6">
        <SearchBarWithFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterOption="All"
          onFilterChange={() => {}}
          filterType="announcements"
        />
      </div>

      {/* Announcements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <AnnouncementCard 
              key={announcement.id} 
              announcement={announcement} 
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No announcements found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
}