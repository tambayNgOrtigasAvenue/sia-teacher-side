import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import StudentInfoCard from '../../../components/cards/StudentInfoCard';
import GradesTable from '../../../components/cards/GradesTable';
import ReportCardModal from '../../../components/modals/ReportCardModal';
import WholeYearReportCard from '../../../components/modals/WholeYearReportCard';
import UpdateStudentModal from '../../../components/modals/UpdateStudentModal';
import Breadcrumb from '../../../components/common/Breadcrumb.jsx';
import { API_ENDPOINTS } from '../../../config/api';

/**
 * StudentGradesPage Component
 * 
 * Displays a single student's grades across all subjects
 * Shows personal information and grade table with all subjects
 * 
 * @param {object} student - The selected student object
 * @param {object} classData - The class/section data
 * @param {function} onBack - Callback to navigate back
 * @param {function} onInputGrade - Callback to open grade input modal
 * @param {function} onBackToClassList - Callback to navigate back to class list
 */
export default function StudentGradesPage({
  student,
  classData,
  onBack,
  onInputGrade,
  onBackToClassList
}) {
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showQuarterDropdown, setShowQuarterDropdown] = useState(false);
  const [showReportCardModal, setShowReportCardModal] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [studentData, setStudentData] = useState({
    firstName: student?.firstName || '',
    lastName: student?.lastName || '',
    middleName: student?.middleName || '',
    gender: student?.gender || '',
    profilePicture: student?.profilePicture || '',
    birthdate: student?.birthdate || '',
    age: student?.age || '',
    studentNumber: student?.studentNumber || '',
    address: student?.address || '',
    contactNumber: student?.contactNumber || '',
  });
  const [saving, setSaving] = useState(false);
  const dropdownRef = useRef(null);
  
  // Deadline state
  const [deadline, setDeadline] = useState(null);
  const [canGrade, setCanGrade] = useState(false);
  const [deadlineLoading, setDeadlineLoading] = useState(true);
  const [currentQuarter, setCurrentQuarter] = useState('q1'); // Default to q1

  const fetchAllStudentData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchStudentGrades(),
      ]);
    } catch (err) {
      console.error('Error fetching all student data:', err);
      setError('Failed to load all student data.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch subjects and grades when component mounts
  useEffect(() => {
    if (student && classData) {
      fetchAllStudentData();
      fetchGradingDeadline();
    }
  }, [student, classData]);
  
  // Fetch grading deadline
  const fetchGradingDeadline = async () => {
    try {
      setDeadlineLoading(true);
      const response = await axios.get(
        `${API_ENDPOINTS.CHECK_GRADING_DEADLINE}?quarter=${currentQuarter}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setDeadline(response.data.deadline);
        setCanGrade(response.data.canGrade);
      } else {
        setCanGrade(false);
      }
    } catch (error) {
      console.error('Error fetching deadline:', error);
      setCanGrade(false);
    } finally {
      setDeadlineLoading(false);
    }
  };
  
  // Refetch deadline when quarter changes
  useEffect(() => {
    if (student && classData) {
      fetchGradingDeadline();
    }
  }, [currentQuarter]);

  // Update form data when student changes
  useEffect(() => {
    if (student) {
      setStudentData({
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        middleName: student.middleName || '',
        gender: student.gender || '',
        profilePicture: student.profilePicture || '',
        birthdate: student.birthdate || '',
        age: student.age || '',
        studentNumber: student.studentNumber || '',
        address: student.address || '',
        contactNumber: student.contactNumber || '',
      });
    }
  }, [student]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowQuarterDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle quarter selection and show modal
  const handleQuarterSelect = (quarter) => {
    setSelectedQuarter(quarter);
    setShowQuarterDropdown(false);
    setShowReportCardModal(true);
  };

  // Handle print from modal
  const handlePrintReportCard = () => {
    window.print();
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setStudentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle save student info
  const handleSaveStudentInfo = async () => {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append('studentId', student.id);
      formData.append('firstName', studentData.firstName);
      formData.append('lastName', studentData.lastName);
      formData.append('middleName', studentData.middleName);
      formData.append('gender', studentData.gender);
      formData.append('birthdate', studentData.birthdate);
      formData.append('age', studentData.age);
      formData.append('studentNumber', studentData.studentNumber);
      formData.append('address', studentData.address);
      formData.append('contactNumber', studentData.contactNumber);

      if (studentData.profilePictureFile) {
        formData.append('profilePicture', studentData.profilePictureFile);
      }

      console.log('Updating student with formData...');

      const response = await axios.post(
        API_ENDPOINTS.UPDATE_STUDENT_PROFILE,
        formData,
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      console.log('Update response:', response.data);

      if (response.data.success) {
        // Update parent student object with returned data
        Object.assign(student, response.data.data);
        
        // Clear the file input state
        setStudentData(prev => ({ ...prev, profilePictureFile: null }));
        
        setShowUpdateModal(false);
        alert('Student profile updated successfully!');
      } else {
        const errorMsg = response.data.message || 'Failed to update student profile';
        console.error('Update failed:', response.data);
        alert(errorMsg);
      }
    } catch (err) {
      console.error('Error updating student:', err);
      console.error('Error response:', err.response?.data);
      const errorMsg = err.response?.data?.message || 'An error occurred while updating student profile';
      alert(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  // Calculate average for selected quarter
  const calculateQuarterAverage = (quarter) => {
    const quarterKey = `q${quarter}`;
    const validGrades = Object.values(grades)
      .map(g => g[quarterKey])
      .filter(g => g && !isNaN(g));

    if (validGrades.length === 0) return '-';
    const sum = validGrades.reduce((acc, grade) => acc + parseFloat(grade), 0);
    return (sum / validGrades.length).toFixed(2);
  };

  const fetchStudentGrades = async () => {
    try {
      // Fetch subjects for this grade level
      const subjectsResponse = await axios.get(
        `${API_ENDPOINTS.GET_SUBJECTS_BY_GRADE}?gradeLevelId=${classData.gradeLevelId}`,
        { withCredentials: true }
      );

      if (subjectsResponse.data.success) {
        setSubjects(subjectsResponse.data.data);

        // Fetch grades for each subject
        await fetchGradesForAllSubjects(subjectsResponse.data.data);
      }
    } catch (err) {
      console.error('Error fetching student grades:', err);
      setError('Failed to load grades');
    }
  };

  const fetchGradesForAllSubjects = async (subjectsList) => {
    const gradesData = {};

    for (const subject of subjectsList) {
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.GET_SECTION_GRADES}?sectionId=${classData.id}&subjectId=${subject.id}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          const studentGrade = response.data.data.find(s => s.id === student.id);
          if (studentGrade) {
            gradesData[subject.id] = studentGrade.grades;
          }
        }
      } catch (err) {
        console.error(`Error fetching grades for subject ${subject.id}:`, err);
      }
    }

    setGrades(gradesData);
  };

  if (!student) {
    return <div className="p-8 text-center">No student selected</div>;
  }

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/teacher-dashboard' },
    { label: 'My Classes', onClick: onBackToClassList },
    { label: 'Class Details', onClick: onBack },
    { label: 'View Info' }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4 flex items-center gap-2 transition-colors"
      >
        <span>&larr;</span>
        <span>Class Details</span>
      </button>

      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Student Information Card */}
      <StudentInfoCard
        student={student}
        onUpdateClick={() => setShowUpdateModal(true)}
      />

      {/* Report Title */}
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
        REPORT ON LEARNING PROGRESS AND ACHIEVEMENT
      </h2>

      {/* Grades Table */}
      <GradesTable
        subjects={subjects}
        grades={grades}
        loading={loading}
        error={error}
      />
      
      {/* Grading Deadline Status */}
      {!deadlineLoading && !canGrade && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                Grading is currently disabled
              </p>
              <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                {!deadline 
                  ? 'No grading deadline has been set by the administrator. Please contact your admin.'
                  : deadline.status === 'not_started' 
                    ? `Grading period starts on ${new Date(deadline.startDate).toLocaleDateString()}`
                    : `Grading deadline expired on ${new Date(deadline.deadlineDate).toLocaleDateString()}`
                }
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Grading Deadline Active Status */}
      {!deadlineLoading && canGrade && deadline && (
        <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                Grading is open
              </p>
              <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                Deadline: {new Date(deadline.deadlineDate).toLocaleDateString()} at {new Date(deadline.deadlineDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center gap-4">
        {/* Input Grade Button */}
        {!loading && !error && subjects.length > 0 && (
          <div className="relative group">
            <button
              onClick={() => {
                if (!canGrade) {
                  return; // Do nothing if grading is disabled
                }
                onInputGrade(student);
              }}
              disabled={!canGrade || deadlineLoading}
              className={`font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors ${
                canGrade && !deadlineLoading
                  ? 'bg-amber-300 hover:bg-amber-400 text-gray-800 cursor-pointer'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed opacity-60'
              }`}
            >
              {deadlineLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking...
                </>
              ) : (
                <>
                  {canGrade ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                  {canGrade ? 'Input Grade' : 'Grading Closed'}
                </>
              )}
            </button>
            {!canGrade && !deadlineLoading && (
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded shadow-lg z-10">
                {!deadline 
                  ? 'No grading deadline set. Contact administrator.'
                  : 'Grading deadline has passed or not started yet.'
                }
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4">


          {/* Print Report Card Dropdown Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowQuarterDropdown(!showQuarterDropdown)}
              className="bg-amber-300 hover:bg-amber-400 px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Report Card
              <svg
                className={`w-4 h-4 transition-transform ${showQuarterDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showQuarterDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                <button
                  onClick={() => handleQuarterSelect(1)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
                >
                  1st Quarter
                </button>
                <button
                  onClick={() => handleQuarterSelect(2)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
                >
                  2nd Quarter
                </button>
                <button
                  onClick={() => handleQuarterSelect(3)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
                >
                  3rd Quarter
                </button>
                <button
                  onClick={() => handleQuarterSelect(4)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors"
                >
                  4th Quarter
                </button>
                <hr className="my-1 border-gray-200 dark:border-gray-700" />
                <button
                  onClick={() => handleQuarterSelect('whole-year')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold transition-colors"
                >
                  Whole Year
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Report Card Modal */}
      {showReportCardModal && selectedQuarter && (
        selectedQuarter === 'whole-year' ? (
          <WholeYearReportCard
            student={student}
            classData={classData}
            subjects={subjects}
            grades={grades}
            onClose={() => setShowReportCardModal(false)}
            onPrint={handlePrintReportCard}
          />
        ) : (
          <ReportCardModal
            student={student}
            classData={classData}
            subjects={subjects}
            grades={grades}
            quarter={selectedQuarter}
            average={calculateQuarterAverage(selectedQuarter)}
            onClose={() => setShowReportCardModal(false)}
            onPrint={handlePrintReportCard}
          />
        )
      )}

      {/* Update Student Modal */}
      {showUpdateModal && (
        <UpdateStudentModal
          studentData={studentData}
          onInputChange={handleInputChange}
          onSave={handleSaveStudentInfo}
          onClose={() => setShowUpdateModal(false)}
          saving={saving}
        />
      )}
    </div>
  );
}