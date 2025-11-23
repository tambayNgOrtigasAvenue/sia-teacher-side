import React from 'react';
import SearchBar from '../../../common/SearchBar.jsx';
import FilterDropdown from '../../../common/FilterDropdown.jsx';

/**
 * SearchBarWithFilter Component (Reusable & Controlled)
 * 
 * A combined component that includes both search and filter functionality.
 * This is a wrapper that combines SearchBar and FilterDropdown.
 * Can be used for pages that need both search and filter.
 * 
 * @param {string} searchTerm - Current search value
 * @param {function} onSearchChange - Callback when search input changes
 * @param {string} filterOption - Current filter selection
 * @param {function} onFilterChange - Callback when filter selection changes
 * @param {string} filterType - Either 'classes', 'students', or 'grades' to determine filter options
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

  // Filter options for grades
  const gradeFilterOptions = [
    { value: 'All', label: 'All Students' },
  ];

  // Select appropriate options based on filterType prop
  const getFilterOptions = () => {
    switch(filterType) {
      case 'classes':
        return classFilterOptions;
      case 'students':
        return studentFilterOptions;
      case 'grades':
        return gradeFilterOptions;
      default:
        return classFilterOptions;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4 my-6">
      {/* Filter Dropdown */}
      <FilterDropdown
        filterOption={filterOption}
        onFilterChange={onFilterChange}
        options={getFilterOptions()}
        className="w-full md:w-auto"
      />
      
      {/* Search Input */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        placeholder="Search..."
        className="md:w-auto"
      />
    </div>
  );
}
