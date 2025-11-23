import React from 'react';

/**
 * SubjectGradeRow Component
 * Renders a single row showing grades for one subject
 */
const SubjectGradeRow = ({ subject, grades }) => (
  <div className="px-6 py-4 grid grid-cols-8 gap-4 items-center border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
    <div className="col-span-2 font-medium text-gray-700 dark:text-gray-300">
      {subject.name}
    </div>
    <div className="text-center text-gray-600 dark:text-gray-400">
      {grades.q1 || '-'}
    </div>
    <div className="text-center text-gray-600 dark:text-gray-400">
      {grades.q2 || '-'}
    </div>
    <div className="text-center text-gray-600 dark:text-gray-400">
      {grades.q3 || '-'}
    </div>
    <div className="text-center text-gray-600 dark:text-gray-400">
      {grades.q4 || '-'}
    </div>
    <div className="text-center font-semibold text-gray-800 dark:text-gray-200">
      {grades.final || '-'}
    </div>
    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
      {grades.remarks || '-'}
    </div>
  </div>
);

/**
 * GradesTable Component
 * Displays grades table with all subjects and quarters
 * 
 * @param {Array} subjects - List of subjects
 * @param {object} grades - Grades data keyed by subject ID
 * @param {boolean} loading - Loading state
 * @param {string} error - Error message if any
 */
export default function GradesTable({ subjects, grades, loading, error }) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading grades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-lg mb-6">
        <p className="font-medium">Error loading grades</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden mb-6">
      {/* Table Header */}
      <div className="bg-amber-300 dark:bg-amber-400 px-6 py-5 grid grid-cols-8 gap-4 items-center font-semibold text-gray-700 dark:text-gray-800 text-center">
        <div className="col-span-2 text-left">Learning Areas</div>
        <div>1st</div>
        <div>2nd</div>
        <div>3rd</div>
        <div>4th</div>
        <div>Final Grade</div>
        <div>Remarks</div>
      </div>

      {/* Table Body - Subject Rows */}
      {subjects.map((subject) => (
        <SubjectGradeRow 
          key={subject.id}
          subject={subject}
          grades={grades[subject.id] || {}}
        />
      ))}
    </div>
  );
}
