import React from 'react';

/**
 * StudentInfoCard Component
 * Displays student's profile picture and personal information
 * 
 * @param {object} student - Student data object
 * @param {function} onUpdateClick - Callback when Update Info button is clicked
 */
export default function StudentInfoCard({ student, onUpdateClick }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 mb-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-8">
        {/* Profile Picture */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
            {student.profilePicture ? (
              <img 
                src={student.profilePicture} 
                alt={`${student.firstName} ${student.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl text-gray-400">
                {student.firstName?.[0]}{student.lastName?.[0]}
              </span>
            )}
          </div>
          <button 
            onClick={onUpdateClick}
            className="bg-amber-300 hover:bg-amber-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Update Info
          </button>
        </div>

        {/* Personal Information */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">Full Name:</p>
              <p className="text-gray-800 dark:text-gray-200 font-semibold text-lg">
                {student.firstName} {student.lastName}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">Birthday:</p>
              <p className="text-gray-800 dark:text-gray-200 font-semibold text-lg">
                {student.birthdate || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">Age:</p>
              <p className="text-gray-800 dark:text-gray-200 font-semibold text-lg">
                {student.age || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">Student Number:</p>
              <p className="text-gray-800 dark:text-gray-200 font-semibold text-lg">
                {student.studentNumber}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">Address:</p>
              <p className="text-gray-800 dark:text-gray-200 font-semibold text-lg">
                {student.address || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">Contact Number:</p>
              <p className="text-gray-800 dark:text-gray-200 font-semibold text-lg">
                {student.contactNumber || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <button className="text-gray-700 dark:text-gray-300 font-semibold text-lg hover:text-gray-900 dark:hover:text-white">
          Edit
        </button>
      </div>
    </div>
  );
}
