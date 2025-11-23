import React from 'react';
import { Filter } from 'lucide-react';

/**
 * FilterDropdown Component
 * 
 * A reusable filter dropdown component.
 * Can be configured with custom filter options.
 * 
 * @param {string} filterOption - Current filter selection
 * @param {function} onFilterChange - Callback when filter selection changes
 * @param {Array} options - Array of filter options [{value: string, label: string}]
 * @param {string} className - Additional CSS classes for the container
 */
export default function FilterDropdown({
  filterOption,
  onFilterChange,
  options,
  className = ""
}) {
  return (
    <div className={`relative ${className}`}>
      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
      <select
        value={filterOption}
        onChange={(e) => onFilterChange(e.target.value)}
        className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full focus:outline-none focus:ring-2 focus:ring-amber-400 appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
