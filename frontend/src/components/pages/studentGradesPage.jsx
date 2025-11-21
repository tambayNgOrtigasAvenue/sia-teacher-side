import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

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
 */
export default function StudentGradesPage({ 
  student, 
  classData, 
  onBack,
  onInputGrade
}) {
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showQuarterDropdown, setShowQuarterDropdown] = useState(false);
  const [showReportCardModal, setShowReportCardModal] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState(null);
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);

  // Fetch subjects and grades when component mounts
  useEffect(() => {
    if (student && classData) {
      fetchStudentGrades();
    }
  }, [student, classData]);

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
      setLoading(true);
      setError(null);

      // Fetch subjects for this grade level
      const subjectsResponse = await axios.get(
        `http://localhost/gymnazo-christian-academy-teacher-side/backend/api/subjects/get-subjects-by-grade.php?gradeLevelId=${classData.gradeLevelId}`,
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
    } finally {
      setLoading(false);
    }
  };

  const fetchGradesForAllSubjects = async (subjectsList) => {
    const gradesData = {};
    
    for (const subject of subjectsList) {
      try {
        const response = await axios.get(
          `http://localhost/gymnazo-christian-academy-teacher-side/backend/api/grades/get-section-grades.php?sectionId=${classData.id}&subjectId=${subject.id}`,
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
      <p className="text-sm text-gray-500 mb-6">
        Grade Levels & Sections &gt; Class Details &gt; View Info
      </p>

      {/* Student Information Card */}
      <div className="bg-white rounded-3xl shadow-lg p-8 mb-6 border border-gray-200">
        <div className="flex items-start gap-8">
          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
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
            <button className="bg-amber-300 hover:bg-amber-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Update Info
            </button>
          </div>

          {/* Personal Information */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-lg">Full Name:</p>
                <p className="text-gray-800 font-semibold text-lg">
                  {student.firstName} {student.lastName}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-lg">Birthday:</p>
                <p className="text-gray-800 font-semibold text-lg">
                  {student.birthdate || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-lg">Age:</p>
                <p className="text-gray-800 font-semibold text-lg">
                  {student.age || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-lg">Student Number:</p>
                <p className="text-gray-800 font-semibold text-lg">
                  {student.studentNumber}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-lg">Address:</p>
                <p className="text-gray-800 font-semibold text-lg">
                  {student.address || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-lg">Contact Number:</p>
                <p className="text-gray-800 font-semibold text-lg">
                  {student.contactNumber || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <button className="text-gray-700 font-semibold text-lg hover:text-gray-900">
            Edit
          </button>
        </div>
      </div>

      {/* Report Title */}
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        REPORT ON LEARNING PROGRESS AND ACHIEVEMENT
      </h2>

      {/* Grades Table */}
      {loading ? (
        <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
          <p className="mt-4 text-gray-600">Loading grades...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
          <p className="font-medium">Error loading grades</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-6">
          {/* Table Header */}
          <div className="bg-amber-300 px-6 py-5 grid grid-cols-8 gap-4 items-center font-semibold text-gray-700 text-center">
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
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center gap-4">
        {/* Input Grade Button */}
        {!loading && !error && subjects.length > 0 && (
          <button
            onClick={() => onInputGrade(student)}
            className="bg-amber-300 hover:bg-amber-400 text-gray-800 font-semibold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors"
          >
            Input Grade
          </button>
        )}
        
        <div className="flex gap-4">
        <button className="bg-amber-300 hover:bg-amber-400 px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Send via Email
        </button>
        
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
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={() => handleQuarterSelect(1)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 transition-colors"
              >
                1st Quarter
              </button>
              <button
                onClick={() => handleQuarterSelect(2)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 transition-colors"
              >
                2nd Quarter
              </button>
              <button
                onClick={() => handleQuarterSelect(3)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 transition-colors"
              >
                3rd Quarter
              </button>
              <button
                onClick={() => handleQuarterSelect(4)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 transition-colors"
              >
                4th Quarter
              </button>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Report Card Modal */}
      {showReportCardModal && selectedQuarter && (
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
      )}
    </div>
  );
}

/**
 * SubjectGradeRow Component
 * Renders a single row showing grades for one subject
 */
const SubjectGradeRow = ({ subject, grades }) => (
  <div className="px-6 py-4 grid grid-cols-8 gap-4 items-center border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors">
    <div className="col-span-2 font-medium text-gray-700">
      {subject.name}
    </div>
    <div className="text-center text-gray-600">
      {grades.q1 || '-'}
    </div>
    <div className="text-center text-gray-600">
      {grades.q2 || '-'}
    </div>
    <div className="text-center text-gray-600">
      {grades.q3 || '-'}
    </div>
    <div className="text-center text-gray-600">
      {grades.q4 || '-'}
    </div>
    <div className="text-center font-semibold text-gray-800">
      {grades.final || '-'}
    </div>
    <div className="text-center text-sm text-gray-600">
      {grades.remarks || '-'}
    </div>
  </div>
);

/**
 * ReportCardModal Component
 * Modal displaying student's report card for a specific quarter
 */
const ReportCardModal = ({ student, classData, subjects, grades, quarter, average, onClose, onPrint }) => {
  const quarterNames = ['1ST', '2ND', '3RD', '4TH'];
  const quarterKey = `q${quarter}`;
  const currentYear = new Date().getFullYear();
  const schoolYear = `${currentYear}-${(currentYear + 1).toString().slice(-2)}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-[400px]">
        {/* Header */}
        <div className="bg-white border-b border-gray-300 rounded-t-xl px-3 py-2 relative">
          <button
            onClick={onClose}
            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 text-xl font-bold leading-none"
          >
            ×
          </button>
          <div className="flex items-center justify-center gap-2">
            {/* School Logo */}
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              <img 
                src="https://via.placeholder.com/40" 
                alt="School Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <h2 className="text-sm font-bold text-gray-800 leading-tight">GYMNAZO CHRISTIAN ACADEMY</h2>
              <p className="text-xs font-semibold text-red-600">GRADE SLIP</p>
            </div>
          </div>
        </div>

        {/* Quarter and School Year */}
        <div className="border-b border-gray-300 px-3 py-1.5 text-center">
          <p className="text-xs font-medium text-gray-700">
            {quarterNames[quarter - 1]} QUARTER S.Y. {schoolYear}
          </p>
        </div>

        {/* Student Name */}
        <div className="border-b border-gray-300 px-3 py-1.5">
          <p className="text-xs font-medium text-gray-700 text-center">
            NAME: {student.lastName?.toUpperCase()} {student.firstName?.toUpperCase()} {student.middleName?.[0]?.toUpperCase()}.
          </p>
        </div>

        {/* Grade and Section */}
        <div className="border-b border-gray-300 px-3 py-1.5">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-gray-800">GRADE & SECTION</p>
            <p className="text-sm font-semibold text-gray-800">
              {classData.grade?.toUpperCase()}-{classData.section?.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Grades Table */}
        <div className="px-3 py-2">
          {/* Table Header */}
          <div className="flex justify-between items-center border-b border-gray-300 pb-1.5 mb-1.5">
            <p className="text-sm font-semibold text-gray-700 flex-1">Learning Areas</p>
            <p className="text-sm font-semibold text-gray-700 w-12 text-center">{quarter}</p>
          </div>

          {/* Subject Grades */}
          <div className="space-y-1">
            {subjects.map((subject) => (
              <div key={subject.id} className="flex justify-between items-center py-0.5">
                <p className="text-xs font-medium text-gray-700 flex-1">{subject.name}</p>
                <p className="text-xs text-gray-700 w-12 text-center">
                  {grades[subject.id]?.[quarterKey] || '-'}
                </p>
              </div>
            ))}
          </div>

          {/* Average */}
          <div className="border-t border-gray-300 mt-2 pt-2">
            <div className="flex justify-between items-center">
              <p className="text-base font-bold text-gray-800">Average</p>
              <p className="text-base font-bold text-gray-800 w-12 text-center">{average}</p>
            </div>
          </div>
        </div>

        {/* Print Button */}
        <div className="px-3 pb-3 flex justify-center">
          <button
            onClick={onPrint}
            className="bg-amber-300 hover:bg-amber-400 px-5 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Report Card
          </button>
        </div>
      </div>
    </div>
  );
};
