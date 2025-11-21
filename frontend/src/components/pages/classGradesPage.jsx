import React, { useState } from 'react';
import SearchBarWithFilter from '../common/dashboard/my-classes/searchBarWithFilter.jsx';

/**
 * ClassGradesPage Component
 * 
 * Renders the "Class Grades" page for the selected class.
 * Displays a table with student names and their quarter grades.
 * 
 * @param {object} classData - The selected class object
 * @param {Array} students - The list of students with their grades
 * @param {boolean} loading - Loading state indicator
 * @param {string} error - Error message if any
 * @param {function} onBack - Callback to navigate back to class details
 */
export default function ClassGradesPage({ 
  classData, 
  students, 
  loading, 
  error, 
  onBack
}) {
  // State for student search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('All');

  // Filtering Logic for Students
  const filteredStudents = students.filter((student) => {
    // Apply search term (searches first name and last name)
    const matchesSearch =
      searchTerm === '' ||
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="text-sm text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2 transition-colors"
      >
        <span>&larr;</span>
        <span>Class Details</span>
      </button>

      {/* Breadcrumbs */}
      <p className="text-sm text-gray-500 mb-4">
        Grade Levels & Sections &gt; Class Details &gt; Class Grades
      </p>

      {/* Dynamic Header */}
      <header className="mb-6">
        <h1 className="text-5xl font-bold text-gray-900">
          {classData.grade}
        </h1>
        <h2 className="text-xl text-orange-600 mt-2">
          {classData.section}
          {classData.subject && <span className="text-gray-500"> • {classData.subject}</span>}
        </h2>
      </header>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error loading grades</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Search and Filter for Students */}
      <SearchBarWithFilter 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterOption={filterOption}
        onFilterChange={setFilterOption}
        filterType="grades"
      />

      {/* Loading State or Student Grade List */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
          <p className="mt-4 text-gray-600">Loading grades...</p>
        </div>
      ) : (
        <StudentGradeList students={filteredStudents} />
      )}
    </div>
  );
}

/**
 * StudentGradeList Component (Internal)
 * 
 * Renders the container and header for the grades table.
 * Maps over students to render individual rows.
 * 
 * @param {Array} students - The filtered list of students to display
 */
const StudentGradeList = ({ students }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden overflow-x-auto">
    {/* Table Header */}
    <div className="bg-amber-300 px-6 py-4 grid grid-cols-9 gap-4 items-center">
      <div className="col-span-2 font-semibold text-gray-700">
        Name
      </div>
      <div className="col-span-1 font-semibold text-gray-700 text-center">
        1st
      </div>
      <div className="col-span-1 font-semibold text-gray-700 text-center">
        2nd
      </div>
      <div className="col-span-1 font-semibold text-gray-700 text-center">
        3rd
      </div>
      <div className="col-span-1 font-semibold text-gray-700 text-center">
        4th
      </div>
      <div className="col-span-2 font-semibold text-gray-700 text-center">
        Final Grade
      </div>
      <div className="col-span-1 font-semibold text-gray-700 text-center">
        Remarks
      </div>
    </div>

    {/* Table Body */}
    <div>
      {students.length > 0 ? (
        students.map((student) => (
          <StudentGradeRow 
            key={student.id} 
            studentData={student}
          />
        ))
      ) : (
        <div className="px-6 py-12 text-center text-gray-500">
          <p className="text-lg font-medium">No students found</p>
          <p className="text-sm mt-2">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  </div>
);

/**
 * StudentGradeRow Component (Internal)
 * 
 * Renders a single row in the grades table.
 * Displays student name and all their grades (quarter and final).
 * 
 * @param {object} studentData - The student data to render
 */
const StudentGradeRow = ({ studentData }) => (
  <div className="px-6 py-5 grid grid-cols-9 gap-4 items-center border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
    {/* Student Name */}
    <div className="col-span-2 text-gray-700 font-medium">
      {studentData.lastName}, {studentData.firstName}
    </div>

    {/* 1st Quarter Grade */}
    <div className="col-span-1 text-gray-600 text-center">
      {studentData.grades.q1 || '-'}
    </div>

    {/* 2nd Quarter Grade */}
    <div className="col-span-1 text-gray-600 text-center">
      {studentData.grades.q2 || '-'}
    </div>

    {/* 3rd Quarter Grade */}
    <div className="col-span-1 text-gray-600 text-center">
      {studentData.grades.q3 || '-'}
    </div>

    {/* 4th Quarter Grade */}
    <div className="col-span-1 text-gray-600 text-center">
      {studentData.grades.q4 || '-'}
    </div>

    {/* Final Grade */}
    <div className="col-span-2 text-gray-600 text-center font-semibold">
      {studentData.grades.final || '-'}
    </div>

    {/* Remarks */}
    <div className="col-span-1 text-gray-600 text-sm text-center">
      {studentData.grades.remarks || '-'}
    </div>
  </div>
);
