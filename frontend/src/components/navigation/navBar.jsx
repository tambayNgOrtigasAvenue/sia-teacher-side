import React from 'react';

/**
 * NavBar Component
 * 
 * Simple top-level navigation bar for switching between main views.
 * 
 * @param {function} onNavClick - Callback function to handle navigation
 */
export default function NavBar({ onNavClick }) {
  return (
    <nav className="bg-gray-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex gap-4">
        {/* Announcements Button */}
        <button
          onClick={() => onNavClick('announcements')}
          className="px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          Announcements
        </button>

        {/* My Classes Button */}
        <button
          onClick={() => onNavClick('classList')}
          className="px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          My Classes
        </button>

        {/* Help & Support Button */}
        <button
          onClick={() => onNavClick('help')}
          className="px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
        >
          Help & Support
        </button>
      </div>
    </nav>
  );
}
