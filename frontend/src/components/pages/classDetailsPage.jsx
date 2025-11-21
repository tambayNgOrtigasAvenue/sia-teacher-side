import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Printer } from 'lucide-react';
import SearchBarWithFilter from '../common/dashboard/my-classes/searchBarWithFilter.jsx';

/**
 * ClassDetailsPage Component
 * 
 * The "redirect" page that displays detailed information about a selected class.
 * Shows a list of students enrolled in the class with search and filter capabilities.
 * 
 * @param {object} classData - The selected class object (selectedClass from App.jsx)
 * @param {Array} students - The list of students in this class (from database or mock)
 * @param {boolean} loading - Loading state indicator
 * @param {string} error - Error message if any
 * @param {function} onBack - Callback to navigate back to the class list
 * @param {function} onViewGrades - Callback to navigate to class grades page (all students quarterly)
 * @param {function} onViewStudentInfo - Callback to navigate to individual student grades page
 */
export default function ClassDetailsPage({ 
  classData, 
  students, 
  loading, 
  error, 
  onBack,
  onViewGrades,
  onViewStudentInfo
}) {
  // State for student search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('All');
  
  // Navigation hook for routing
  const navigate = useNavigate();

  // Filtering Logic for Students
  // Filters the students prop based on search term and attendance filter
  const filteredStudents = students.filter((student) => {
    // Apply filter option
    let matchesFilter = true;
    if (filterOption === 'Present') {
      matchesFilter = student.attendance === 'Present';
    } else if (filterOption === 'Absent') {
      matchesFilter = student.attendance === 'Absent';
    }
    // filterOption === 'All' means matchesFilter stays true

    // Apply search term (searches first name and last name)
    const matchesSearch =
      searchTerm === '' ||
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  /**
   * Export student list to CSV
   * 
   * DATABASE INTEGRATION POINT:
   * Can be enhanced to generate reports from backend
   */
  const handleExportCSV = () => {
    const headers = ['Last Name', 'First Name', 'Attendance', 'Grade'];
    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(s => 
        `${s.lastName},${s.firstName},${s.attendance},${s.grade}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${classData.grade}_${classData.section}_students.csv`;
    a.click();
  };

  /**
   * Print student list
   */
  const handlePrint = () => {
    window.print();
  };

  /**
   * Navigate to Attendance Page
   */
  const handleViewAttendance = () => {
    navigate('/teacher-dashboard/attendance', {
      state: { classData }
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="text-sm text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2 transition-colors"
      >
        <span>&larr;</span>
        <span>Grade Levels & Sections</span>
      </button>

      {/* Breadcrumbs */}
      <p className="text-sm text-gray-500 mb-4">
        Grade Levels & Sections &gt; Class Details
      </p>

      {/* Dynamic Header - Shows selected class info with action buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <header>
          <h1 className="text-5xl font-bold text-gray-900">
            {classData.grade}
          </h1>
          <h2 className="text-xl text-orange-600 mt-2">
            {classData.section}
            {classData.subject && <span className="text-gray-500"> • {classData.subject}</span>}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Total Students: {students.length} | Present: {students.filter(s => s.attendance === 'Present').length} | Absent: {students.filter(s => s.attendance === 'Absent').length}
          </p>
        </header>
        
        {/* Export/Print Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Export to CSV"
          >
            <Download size={18} />
            <span className="hidden md:inline">Export</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Print"
          >
            <Printer size={18} />
            <span className="hidden md:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error loading students</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Search and Filter for Students */}
      <SearchBarWithFilter 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterOption={filterOption}
        onFilterChange={setFilterOption}
        filterType="students"
      />

      {/* Loading State or Student List */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
          <p className="mt-4 text-gray-600">Loading students...</p>
        </div>
      ) : (
        <StudentList students={filteredStudents} onViewStudentInfo={onViewStudentInfo} />
      )}

      {/* Footer Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={onViewGrades}
          className="bg-amber-400 hover:bg-amber-500 text-gray-800 font-medium py-3 px-8 rounded-full transition-colors"
        >
          View Class Grade
        </button>
        <button 
          onClick={handleViewAttendance}
          className="bg-amber-400 hover:bg-amber-500 text-gray-800 font-medium py-3 px-8 rounded-full transition-colors"
        >
          View Attendance
        </button>
      </div>
    </div>
  );
}

/**
 * StudentList Component (Internal)
 * 
 * Renders the container and header for the student list table.
 * Maps over filtered students to render individual rows.
 * 
 * @param {Array} students - The filtered list of students to display
 * @param {function} onViewStudentInfo - Callback when View Info button is clicked
 */
const StudentList = ({ students, onViewStudentInfo }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
    {/* Table Header */}
    <div className="bg-amber-300 px-6 py-4 grid grid-cols-12 gap-4 items-center">
      <div className="col-span-3 font-semibold text-gray-700">
        Last Name
      </div>
      <div className="col-span-3 font-semibold text-gray-700">
        First Name
      </div>
      <div className="col-span-3 font-semibold text-gray-700">
        Attendance
      </div>
      <div className="col-span-2 font-semibold text-gray-700">
        Grade
      </div>
      <div className="col-span-1"></div>
    </div>

    {/* Table Body */}
    <div>
      {students.length > 0 ? (
        students.map((student) => (
          <StudentRow key={student.id} studentData={student} onViewStudentInfo={onViewStudentInfo} />
        ))
      ) : (
        <div className="px-6 py-12 text-center text-gray-500">
          <p className="text-lg font-medium">No students found</p>
          <p className="text-sm mt-2">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  </div>
);

/**
 * StudentRow Component (Internal)
 * 
 * Renders a single row in the student list.
 * Displays student information with conditional styling for attendance.
 * Has a View Info button to see individual student grades.
 * 
 * @param {object} studentData - The student data to render
 * @param {function} onViewStudentInfo - Callback when View Info button is clicked
 */
const StudentRow = ({ studentData, onViewStudentInfo }) => (
  <div 
    className="px-6 py-5 grid grid-cols-12 gap-4 items-center border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
    {/* Last Name */}
    <div className="col-span-3 text-gray-700 font-medium">
      {studentData.lastName}
    </div>

    {/* First Name */}
    <div className="col-span-3 text-gray-700">
      {studentData.firstName}
    </div>

    {/* Attendance Lozenge - Conditional styling based on status */}
    <div className="col-span-3">
      {studentData.attendance === 'Present' ? (
        <span className="inline-block bg-green-100 text-green-800 font-medium py-1 px-3 rounded-full text-sm">
          Present ✓
        </span>
      ) : (
        <span className="inline-block bg-red-100 text-red-800 font-medium py-1 px-3 rounded-full text-sm">
          Absent →
        </span>
      )}
    </div>

    {/* Grade */}
    <div className="col-span-2 text-gray-600 text-center">
      {studentData.grade}
    </div>

    {/* View Info Button */}
    <div className="col-span-1 flex justify-end">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onViewStudentInfo(studentData);
        }}
        className="bg-amber-300 hover:bg-amber-400 text-gray-800 font-medium py-2 px-4 rounded-full text-sm transition-colors whitespace-nowrap"
      >
        View Info
      </button>
    </div>
  </div>
);
