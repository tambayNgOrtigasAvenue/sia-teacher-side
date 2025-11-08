import React from 'react';

/**
 * AnnouncementCard Component
 * 
 * Renders a single announcement card with image, title, description, and action buttons.
 * 
 * @param {object} announcement - Announcement object containing:
 *   - id: unique identifier
 *   - title: announcement title
 *   - description: announcement description text
 *   - imageUrl: URL for the announcement image
 *   - facebookUrl: Link to Facebook post
 */
export default function AnnouncementCard({ announcement }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
      {/* Announcement Image */}
      <div className="relative">
        <img 
          src={announcement.imageUrl} 
          alt={announcement.title}
          className="w-full h-48 object-cover"
        />
        {/* Optional badge overlay */}
        <div className="absolute top-3 left-3 bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-full">
          NEW
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Announcement Title */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {announcement.title}
        </h3>

        {/* Announcement Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow line-clamp-3">
          {announcement.description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          {/* Read More Button */}
          <button 
            className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-full text-sm transition-colors"
            onClick={() => {
              // TODO: Implement read more functionality (show full announcement)
              console.log('Read more:', announcement.id);
            }}
          >
            Read More
          </button>

          {/* View on Facebook Button */}
          <a 
            href={announcement.facebookUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 bg-amber-400 hover:bg-amber-500 text-white font-medium py-2 px-4 rounded-full text-sm transition-colors text-center"
          >
            View on Facebook
          </a>
        </div>
      </div>
    </div>
  );
}
