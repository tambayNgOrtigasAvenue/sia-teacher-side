import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import StudentInfoCard from '../cards/StudentInfoCard';
import GradesTable from '../cards/GradesTable';
import ReportCardModal from '../modals/ReportCardModal';
import WholeYearReportCard from '../modals/WholeYearReportCard';
import UpdateStudentModal from '../modals/UpdateStudentModal';

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
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [studentData, setStudentData] = useState({
    firstName: student?.firstName || '',
    lastName: student?.lastName || '',
    middleName: student?.middleName || '',
    birthdate: student?.birthdate || '',
    age: student?.age || '',
    studentNumber: student?.studentNumber || '',
    address: student?.address || '',
    contactNumber: student?.contactNumber || '',
  });
  const [saving, setSaving] = useState(false);
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);

  // Fetch subjects and grades when component mounts
  useEffect(() => {
    if (student && classData) {
      fetchStudentGrades();
    }
  }, [student, classData]);

  // Update form data when student changes
  useEffect(() => {
    if (student) {
      setStudentData({
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        middleName: student.middleName || '',
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
      
      console.log('Updating student with data:', {
        studentId: student.id,
        ...studentData
      });
      
      const response = await axios.post(
        'http://localhost/gymnazo-christian-academy-teacher-side/backend/api/students/update-student-profile.php',
        {
          studentId: student.id,
          ...studentData
        },
        { withCredentials: true }
      );

      console.log('Update response:', response.data);

      if (response.data.success) {
        // Update parent student object
        Object.assign(student, studentData);
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
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Grade Levels & Sections &gt; Class Details &gt; View Info
      </p>

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