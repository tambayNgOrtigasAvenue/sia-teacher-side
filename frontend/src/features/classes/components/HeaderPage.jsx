import React from 'react';

/**
 * HeaderPage Component
 * 
 * Renders the static page header for the "My Classes" page.
 * This is a presentational component with no state or logic.
 */
export default function Header() {
  return (
    <div className="mb-6">
      <h1 className="text-5xl font-bold text-gray-800 dark:text-white">My Classes</h1>
      <p className="text-xl text-orange-600 dark:text-orange-400">Grade Levels & Sections</p>
    </div>
  );
}