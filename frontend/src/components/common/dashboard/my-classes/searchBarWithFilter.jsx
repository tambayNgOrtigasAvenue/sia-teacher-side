import React from 'react';
import { FilterIcon, SearchIcon } from './icons.jsx';

/**
 * SearchBarWithFilter Component (Reusable & Controlled)
 * 
 * A reusable, controlled component for search and filter UI.
 * Can be used for both class lists and student lists.
 * 
 * @param {string} searchTerm - Current search value
 * @param {function} onSearchChange - Callback when search input changes
 * @param {string} filterOption - Current filter selection
 * @param {function} onFilterChange - Callback when filter selection changes
 * @param {string} filterType - Either 'classes' or 'students' to determine filter options
 */
export default function SearchBarWithFilter({
  searchTerm,
  onSearchChange,
  filterOption,
  onFilterChange,
  filterType
}) {
  // Filter options for classes
  const classFilterOptions = [
    { value: 'All', label: 'All Classes' },
    { value: 'Favorited', label: 'Favorited' },
    { value: 'Pending', label: 'Pending' },
  ];

  // Filter options for students
  const studentFilterOptions = [
    { value: 'All', label: 'All Students' },
    { value: 'Present', label: 'Present' },
    { value: 'Absent', label: 'Absent' },
  ];

  // Select appropriate options based on filterType prop
  const options = filterType === 'classes' ? classFilterOptions : studentFilterOptions;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4 my-6">
      {/* Filter Dropdown */}
      <div className="relative w-full md:w-auto">
        <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <select
          value={filterOption}
          onChange={(e) => onFilterChange(e.target.value)}
          className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Search Input */}
      <div className="relative w-full md:w-auto">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>
    </div>
  );
}
