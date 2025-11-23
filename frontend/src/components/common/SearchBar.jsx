import React from 'react';
import { Search } from 'lucide-react';

/**
 * SearchBar Component
 * 
 * A simple, reusable search input component.
 * Can be used standalone on any page that needs search functionality.
 * 
 * @param {string} searchTerm - Current search value
 * @param {function} onSearchChange - Callback when search input changes
 * @param {string} placeholder - Placeholder text for the input (default: "Search...")
 * @param {string} className - Additional CSS classes for the container
 */
export default function SearchBar({
  searchTerm,
  onSearchChange,
  placeholder = "Search...",
  className = ""
}) {
  return (
    <div className={`relative w-full ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 w-full focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
    </div>
  );
}
