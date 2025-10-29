import React from 'react';
import { StarIcon } from './icons.jsx';

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
    <div className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* List Header */}
      <div className="bg-amber-300 px-6 py-4 grid grid-cols-10 gap-4 items-center">
        {/* Aligns with the 1-col-span star */}
        <div className="col-span-1"></div>
        
        {/* Aligns with the 3-col-span grade */}
        <div className="col-span-9 md:col-span-3 font-semibold text-gray-700">
          Grade Level
        </div>
        
        {/* Aligns with the 3-col-span section */}
        <div className="col-span-10 md:col-span-3 font-semibold text-gray-700">
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
          <div className="px-6 py-12 text-center text-gray-500">
            <p className="text-lg font-medium">No classes found</p>
            <p className="text-sm mt-2">Try adjusting your search or filter criteria</p>
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
  <div className="px-6 py-5 grid grid-cols-10 gap-4 items-center border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
    {/* Star Icon - Clickable to toggle favorite status */}
    <div className="col-span-1">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite && onToggleFavorite(classData.id);
        }}
        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
        title={classData.isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        {classData.isFavorited ? (
          <StarIcon className="w-5 h-5" />
        ) : (
          <StarIcon className="w-5 h-5 fill-transparent text-gray-400" />
        )}
      </button>
    </div>
    
    {/* Grade Level */}
    <div className="col-span-9 md:col-span-3 text-gray-700 font-medium">
      {classData.grade}
    </div>
    
    {/* Section */}
    <div className="col-span-10 md:col-span-3 text-gray-600">
      {classData.section}
    </div>
    
    {/* Status/Button - Dynamic based on class status */}
    <div className="col-span-10 md:col-span-3 flex justify-start md:justify-end">
      {classData.status === 'pending' ? (
        // Pending status lozenge
        <span className="bg-amber-100 text-amber-800 font-medium py-2 px-5 rounded-full text-sm">
          Pending
        </span>
      ) : (
        // Active class - show "View Class Details" button
        // THIS IS THE KEY NAVIGATION TRIGGER
        <button 
          onClick={() => onViewClassDetails(classData)}
          className="bg-amber-400 hover:bg-amber-500 text-gray-800 font-medium py-2 px-5 rounded-full text-sm transition-colors"
        >
          View Class Details
        </button>
      )}
    </div>
  </div>
);