import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import HeaderPage from '../components/HeaderPage.jsx';
import SearchBarWithFilter from '../components/SearchBarWithFilter.jsx';
import ViewMyClasses from '../components/ViewMyClasses.jsx';
import Breadcrumb from '../../../components/common/Breadcrumb.jsx';

/**
 * MyClassesPage Component
 * 
 * Container for the "My Classes" page that assembles child components.
 * Manages local state for search and filter functionality.
 * Handles loading and error states from parent component.
 * 
 * @param {Array} classes - The list of classes (from database or mock)
 * @param {boolean} loading - Loading state indicator
 * @param {string} error - Error message if any
 * @param {function} onViewClassDetails - Callback to navigate to class details page
 * @param {function} onToggleFavorite - Callback to toggle favorite status
 * @param {function} onRefresh - Callback to manually refresh class list
 */
export default function MyClassesPage({
  classes,
  loading,
  error,
  onViewClassDetails,
  onToggleFavorite,
  onRefresh
}) {
  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('All');

  // Filtering Logic
  // Filters the classes prop based on both search term and filter option
  const filteredClasses = classes.filter((classItem) => {
    // Apply filter option
    let matchesFilter = true;
    if (filterOption === 'Favorited') {
      matchesFilter = classItem.isFavorited === true;
    } else if (filterOption === 'Pending') {
      matchesFilter = classItem.status === 'pending';
    }
    // filterOption === 'All' means matchesFilter stays true

    // Apply search term (searches grade and section)
    const matchesSearch =
      searchTerm === '' ||
      classItem.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.section.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/teacher-dashboard' },
    { label: 'My Classes' }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-8">
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Static Header with Refresh Button */}
      <div className="flex justify-between items-start mb-6">
        <HeaderPage />
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title="Refresh class list"
          >
            <RefreshCw size={18} />
            <span className="hidden md:inline">Refresh</span>
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          <p className="font-medium">Error loading classes</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Search and Filter Controls */}
      <SearchBarWithFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterOption={filterOption}
        onFilterChange={setFilterOption}
        filterType="classes"
      />

      {/* Loading State */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading classes...</p>
        </div>
      ) : (
        /* Class List with Navigation and Favorite Callbacks */
        <ViewMyClasses
          classes={filteredClasses}
          onViewClassDetails={onViewClassDetails}
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </div>
  );
}