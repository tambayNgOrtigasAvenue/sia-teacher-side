import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ChevronDown, Calendar, X } from 'lucide-react';
import Breadcrumb from '../../../components/common/Breadcrumb';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../config/api';

const AttendancePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const classData = location.state?.classData;
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [attendanceFilters, setAttendanceFilters] = useState({
    Present: false,
    Absent: false,
    Late: false,
    Excused: false
  });
  const [summary, setSummary] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    notMarked: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [updatingAttendance, setUpdatingAttendance] = useState(false);

  // Breadcrumb items
  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/teacher-dashboard' },
    { label: 'My Classes', href: '/teacher-dashboard/my-classes' },
    { label: 'Attendance' },
  ];

  // Fetch students data with attendance
  useEffect(() => {
    if (classData?.id) {
      fetchAttendance();
    }
  }, [classData, selectedDate]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!classData?.id) {
        setError('No class selected');
        return;
      }

      const response = await axios.get(
        `${API_ENDPOINTS.GET_SECTION_ATTENDANCE}?sectionId=${classData.id}&date=${selectedDate}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setStudents(response.data.data.students);
        setFilteredStudents(response.data.data.students);
        setSummary(response.data.data.summary);
      } else {
        setError(response.data.message || 'Failed to fetch attendance');
        setStudents([]);
        setFilteredStudents([]);
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError('Error loading attendance data');
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search and filter
  useEffect(() => {
    let filtered = students;

    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (student) =>
          student.lastName.toLowerCase().includes(query) ||
          student.firstName.toLowerCase().includes(query) ||
          (student.middleName && student.middleName.toLowerCase().includes(query))
      );
    }

    // Apply attendance status filter
    const activeFilters = Object.keys(attendanceFilters).filter(key => attendanceFilters[key]);
    if (activeFilters.length > 0) {
      filtered = filtered.filter(student => activeFilters.includes(student.status));
    }

    setFilteredStudents(filtered);
  }, [searchQuery, students, attendanceFilters]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdownId && !event.target.closest('.relative')) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdownId]);

  // Handle filter checkbox change
  const handleFilterChange = (filterName) => {
    setAttendanceFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setShowDatePicker(false);
  };

  const clearDate = () => {
    setSelectedDate('');
  };

  const handleAttendanceReport = () => {
    navigate('/teacher-dashboard/attendance-report', {
      state: { classData }
    });
  };

  const handleStatusChange = async (studentId, newStatus) => {
    try {
      setUpdatingAttendance(true);

      const response = await axios.post(
        API_ENDPOINTS.UPDATE_ATTENDANCE,
        {
          studentId: studentId,
          sectionId: classData.id,
          status: newStatus,
          date: selectedDate
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update local state
        setStudents(prevStudents =>
          prevStudents.map(student =>
            student.id === studentId
              ? { ...student, status: newStatus }
              : student
          )
        );

        // Refresh to update summary
        await fetchAttendance();
        setOpenDropdownId(null);
      } else {
        alert('Failed to update attendance: ' + response.data.message);
      }
    } catch (err) {
      console.error('Error updating attendance:', err);
      alert('Error updating attendance. Please try again.');
    } finally {
      setUpdatingAttendance(false);
    }
  };

  const toggleDropdown = (studentId) => {
    setOpenDropdownId(openDropdownId === studentId ? null : studentId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30';
      case 'Absent':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30';
      case 'Late':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30';
      case 'Excused':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700';
    }
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
            Attendance
          </h1>
          <h2 className="text-xl md:text-2xl text-orange-600 dark:text-orange-500 mt-2">
            {classData ? `${classData.grade} - ${classData.section}` : 'No class selected'}
          </h2>
          {selectedDate && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Date: {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
        </div>

        {/* Search Bar and Date Picker */}
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
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Filter by status:</p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={attendanceFilters.Present}
                        onChange={() => handleFilterChange('Present')}
                        className="rounded text-amber-500 focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Present ({summary.present})</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={attendanceFilters.Absent}
                        onChange={() => handleFilterChange('Absent')}
                        className="rounded text-amber-500 focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Absent ({summary.absent})</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={attendanceFilters.Late}
                        onChange={() => handleFilterChange('Late')}
                        className="rounded text-amber-500 focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Late ({summary.late})</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={attendanceFilters.Excused}
                        onChange={() => handleFilterChange('Excused')}
                        className="rounded text-amber-500 focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Excused ({summary.excused})</span>
                    </label>
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

          {/* Date Picker */}
          <div className="relative max-w-[250px] w-full sm:ml-auto">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 flex items-center gap-3 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-colors shadow-sm">
              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="flex-1 text-sm text-gray-700 dark:text-gray-200 bg-transparent outline-none cursor-pointer"
                placeholder="Choose Date"
              />
              {selectedDate && (
                <button onClick={clearDate} className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 transition-colors">
                  <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Student List Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-6">
          {/* Table Header */}
          <div className="bg-amber-300 dark:bg-amber-400 px-6 py-4 grid grid-cols-12 gap-4 items-center rounded-t-2xl">
            <div className="col-span-3 font-semibold text-gray-800">
              Last Name
            </div>
            <div className="col-span-3 font-semibold text-gray-800">
              First Name
            </div>
            <div className="col-span-3 font-semibold text-gray-800">
              Middle Name
            </div>
            <div className="col-span-3 font-semibold text-gray-800">
              Status
            </div>
          </div>

          {/* Table Body */}
          <div className="overflow-visible">
            {loading ? (
              <div className="py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading students...</p>
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No students found
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {searchQuery ? 'Try adjusting your search criteria' : 'No students are enrolled in this class'}
                  </p>
                </div>
              </div>
            ) : (
              filteredStudents.map((student, index) => (
                <div
                  key={student.id || index}
                  className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 last:border-b-0 px-6 py-5 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="col-span-3 text-gray-700 dark:text-gray-300 font-medium">
                    {student.lastName}
                  </div>
                  <div className="col-span-3 text-gray-700 dark:text-gray-300">
                    {student.firstName}
                  </div>
                  <div className="col-span-3 text-gray-700 dark:text-gray-300">
                    {student.middleName}
                  </div>
                  <div className="col-span-3 relative">
                    <button
                      onClick={() => toggleDropdown(student.id)}
                      disabled={updatingAttendance}
                      className={`w-full px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-between transition-colors ${getStatusColor(student.status || 'Absent')
                        } hover:opacity-80 disabled:opacity-50`}
                    >
                      <span>{student.status || 'Absent'}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* Dropdown Menu */}
                    {openDropdownId === student.id && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-20">
                        <button
                          onClick={() => handleStatusChange(student.id, 'Present')}
                          className="w-full text-left px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                        >
                          Present
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.id, 'Absent')}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.id, 'Late')}
                          className="w-full text-left px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 transition-colors"
                        >
                          Late
                        </button>
                        <button
                          onClick={() => handleStatusChange(student.id, 'Excused')}
                          className="w-full text-left px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                        >
                          Excused
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Attendance Report Button */}
        <div className="flex justify-center sm:justify-end">
          <button
            onClick={handleAttendanceReport}
            className="bg-amber-400 hover:bg-amber-500 text-gray-800 font-medium text-base px-8 py-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Attendance Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
