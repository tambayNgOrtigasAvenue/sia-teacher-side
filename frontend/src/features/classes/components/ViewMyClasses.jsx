import React from 'react';
import { StarIcon } from './Icons.jsx';

/**
 * ViewMyClasses Component
 * 
 * Renders the presentational list of classes with filtering support.
 * This is a controlled component that receives data and callbacks via props.
 * 
 * @param {Array} classes - The filtered list of classes to display
 * @param {function} onViewClassDetails - Callback function to navigate to class details
 * @param {function} onToggleFavorite - Callback function to toggle favorite status
 */
export default function ViewMyClasses({ classes, onViewClassDetails, onToggleFavorite }) {
  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      {/* List Header */}
      <div className="bg-amber-300 dark:bg-amber-600 px-6 py-4 grid grid-cols-10 gap-4 items-center">
        {/* Aligns with the 1-col-span star */}
        <div className="col-span-1"></div>
        
        {/* Aligns with the 3-col-span grade */}
        <div className="col-span-9 md:col-span-3 font-semibold text-gray-700 dark:text-gray-900">
          Grade Level
        </div>
        
        {/* Aligns with the 3-col-span section */}
        <div className="col-span-10 md:col-span-3 font-semibold text-gray-700 dark:text-gray-900">
          Section
        </div>
        
        {/* Aligns with the 3-col-span button (intentionally blank) */}
        <div className="col-span-10 md:col-span-3"></div>
      </div>
      
      {/* List Body */}
      <div>
        {classes.length > 0 ? (
          classes.map((classItem) => (
            <ClassRow 
              key={classItem.id} 
              classData={classItem}
              onViewClassDetails={onViewClassDetails}
              onToggleFavorite={onToggleFavorite}
            />
          ))
        ) : (
          <div className="px-6 py-16 text-center text-gray-500 dark:text-gray-400">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <p className="text-lg font-medium text-gray-900 dark:text-white">No class and section found</p>
            <p className="text-sm mt-2">No classes are currently assigned to you</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * ClassRow Component (Internal)
 * 
 * Renders a single row in the class list.
 * Handles the dynamic display of favorited status and action buttons.
 * Star icon is clickable to toggle favorite status.
 * 
 * @param {object} classData - The data for the class to render
 * @param {function} onViewClassDetails - Callback to trigger navigation
 * @param {function} onToggleFavorite - Callback to toggle favorite status
 */
const ClassRow = ({ classData, onViewClassDetails, onToggleFavorite }) => (
  <div className="px-6 py-5 grid grid-cols-10 gap-4 items-center border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
    {/* Star Icon - Clickable to toggle favorite status */}
    <div className="col-span-1">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite && onToggleFavorite(classData.id);
        }}
        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
        title={classData.isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        {classData.isFavorited ? (
          <StarIcon className="w-5 h-5" />
        ) : (
          <StarIcon className="w-5 h-5 fill-transparent text-gray-400 dark:text-gray-500" />
        )}
      </button>
    </div>
    
    {/* Grade Level */}
    <div className="col-span-9 md:col-span-3 text-gray-700 dark:text-gray-300 font-medium">
      {classData.grade}
    </div>
    
    {/* Section */}
    <div className="col-span-10 md:col-span-3 text-gray-600 dark:text-gray-400">
      {classData.section}
    </div>
    
    {/* View Class Details Button - Always show for all classes */}
    <div className="col-span-10 md:col-span-3 flex justify-start md:justify-end">
      <button 
        onClick={() => onViewClassDetails(classData)}
        className="bg-amber-400 hover:bg-amber-500 text-gray-800 dark:text-gray-900 font-medium py-2 px-5 rounded-full text-sm transition-colors"
      >
        View Class Details →
      </button>
    </div>
  </div>
);