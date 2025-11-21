import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';
import Breadcrumb from '../components/common/Breadcrumb';
import axios from 'axios';

const AttendanceReportPage = () => {
  const location = useLocation();
  const classData = location.state?.classData;
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState('');
  const [showQuarterDropdown, setShowQuarterDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Grade Levels & Sections', href: '/teacher-dashboard/my-classes' },
    { label: 'Class Details', href: '/teacher-dashboard/my-classes' },
    { label: 'Attendance', href: '/teacher-dashboard/attendance' },
    { label: 'Report' },
  ];

  // Quarter options
  const quarters = ['First', 'Second', 'Third', 'Fourth'];

  // Fetch attendance report data
  useEffect(() => {
    if (classData?.id && selectedQuarter) {
      fetchAttendanceReport();
    } else if (!selectedQuarter) {
      setLoading(false);
      setStudents([]);
      setFilteredStudents([]);
    }
  }, [selectedQuarter, classData]);

  const fetchAttendanceReport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!classData?.id) {
        setError('No class selected');
        return;
      }
      
      const response = await axios.get(
        `http://localhost/gymnazo-christian-academy-teacher-side/backend/api/attendance/get-attendance-report.php?sectionId=${classData.id}&quarter=${selectedQuarter}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setStudents(response.data.data);
        setFilteredStudents(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch attendance report');
        setStudents([]);
        setFilteredStudents([]);
      }
    } catch (err) {
      console.error('Error fetching attendance report:', err);
      setError('Error loading attendance report');
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(students);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = students.filter(
        (student) =>
          student.name.toLowerCase().includes(query)
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  const handleQuarterSelect = (quarter) => {
    setSelectedQuarter(quarter);
    setShowQuarterDropdown(false);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Attendance Report
          </h1>
          <h2 className="text-xl md:text-2xl text-orange-600 dark:text-orange-500 mt-2">
            {classData ? `${classData.grade} - ${classData.section}` : 'No class selected'}
          </h2>
        </div>

        {/* Search Bar and Quarter Selector */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search Bar with Filter */}
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden max-w-[594px] w-full">
            {/* Add Filter Button */}
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="relative bg-gray-50 dark:bg-gray-700 px-4 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border-r border-gray-200 dark:border-gray-600"
            >
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">
                Add filter
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              
              {/* Filter Dropdown */}
              {showFilterDropdown && (
                <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-10 min-w-[200px]">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Filter by Quarter:</p>
                  <div className="space-y-2">
                    {quarters.map((quarter) => (
                      <label key={quarter} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded">
                        <input 
                          type="checkbox" 
                          className="rounded text-amber-500 focus:ring-amber-500" 
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{quarter}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </button>

            {/* Search Input */}
            <div className="flex-1 px-4 py-3 flex items-center gap-3 bg-white dark:bg-gray-800">
              <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 outline-none"
              />
            </div>
          </div>

          {/* Quarter Selector */}
          <div className="relative max-w-[200px] w-full sm:ml-auto">
            <button
              onClick={() => setShowQuarterDropdown(!showQuarterDropdown)}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 flex items-center justify-between gap-3 hover:border-gray-400 dark:hover:border-gray-600 transition-colors shadow-sm"
            >
              <span className="text-sm text-gray-700 dark:text-gray-200">
                {selectedQuarter || 'Select Quarter'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>

            {/* Quarter Dropdown */}
            {showQuarterDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-10">
                {quarters.map((quarter) => (
                  <button
                    key={quarter}
                    onClick={() => handleQuarterSelect(quarter)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {quarter}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Attendance Report Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-6">
          {/* Table Header */}
          <div className="bg-amber-300 dark:bg-amber-400 px-6 py-4 grid grid-cols-12 gap-4 items-center">
            <div className="col-span-4 font-semibold text-gray-800">
              Name
            </div>
            <div className="col-span-2 font-semibold text-gray-800">
              Quarter
            </div>
            <div className="col-span-3 font-semibold text-gray-800">
              Total Present Day
            </div>
            <div className="col-span-3 font-semibold text-gray-800">
              Total Absence Day
            </div>
          </div>

          {/* Table Body */}
          {loading ? (
            <div className="py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading report...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="py-16 text-center">
              <div className="max-w-sm mx-auto">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No class and section found
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedQuarter 
                    ? `No attendance records available for ${selectedQuarter} quarter`
                    : 'Please select a quarter to view the attendance report'
                  }
                </p>
              </div>
            </div>
          ) : (
            filteredStudents.map((student, index) => (
              <div
                key={student.id || index}
                className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 last:border-b-0 px-6 py-5 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="col-span-4 text-gray-700 dark:text-gray-300 font-medium">
                  {student.name}
                </div>
                <div className="col-span-2 text-gray-700 dark:text-gray-300">
                  {student.quarter}
                </div>
                <div className="col-span-3 text-gray-700 dark:text-gray-300 text-center">
                  {student.totalPresent}
                </div>
                <div className="col-span-3 text-gray-700 dark:text-gray-300 text-center">
                  {student.totalAbsent}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceReportPage;
