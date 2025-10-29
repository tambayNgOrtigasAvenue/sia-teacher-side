import React, { useState, useEffect } from 'react';
import MyClassesPage from './myClassesPage.jsx';
import ClassDetailsPage from './classDetailsPage.jsx';
import ClassGradesPage from './classGradesPage.jsx';
import InputGradeModal from '../modals/inputGradeModal.jsx';

/**
 * ClassManagementApp Component (Main Component & State Manager)
 * 
 * This is the main entry point that controls the entire application.
 * Manages navigation state, data, and grade input functionality.
 * All data is stored in state and updates dynamically without database.
 * 
 * State Management:
 * - Navigation between pages (classList, classDetails, classGrades)
 * - Student data with grades
 * - Modal state for grade input
 * - Selected class tracking
 */
export default function ClassManagementApp() {
  // ===== NAVIGATION STATE =====
  
  /**
   * currentView: Controls which "page" is visible
   * - 'classList': Shows MyClassesPage
   * - 'classDetails': Shows ClassDetailsPage (student roster)
   * - 'classGrades': Shows ClassGradesPage (grade input table)
   */
  const [currentView, setCurrentView] = useState('classList');
  
  /**
   * selectedClass: Stores the data of the class that the user clicks on
   */
  const [selectedClass, setSelectedClass] = useState(null);

  // ===== MODAL STATE =====
  
  /**
   * isGradeModalOpen: Controls the "Input Grade" modal visibility
   */
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  
  /**
   * studentToGrade: Stores the student object being graded
   */
  const [studentToGrade, setStudentToGrade] = useState(null);

  // ===== DATA STATE =====
  
  /**
   * classes: Stores the list of classes
   */
  const [classes, setClasses] = useState([]);

  /**
   * students: Master list of students with their grades
   * This is the single source of truth for all student data
   */
  const [students, setStudents] = useState([]);

  /**
   * loading: Tracks loading state for data fetching
   */
  const [loading, setLoading] = useState(false);

  /**
   * error: Stores error messages
   */
  const [error, setError] = useState(null);

  // ===== MOCK DATA INITIALIZATION =====

  /**
   * Mock Classes Data
   * In production, this would come from API
   */
  const mockClasses = [
    { id: 1, grade: 'Grade 6', section: 'Section A', subject: 'Mathematics', isFavorited: true, status: 'active' },
    { id: 2, grade: 'Grade 6', section: 'Section B', subject: 'Science', isFavorited: true, status: 'pending' },
    { id: 3, grade: 'Grade 2', section: 'Section C', subject: 'English', isFavorited: false, status: 'active' },
    { id: 4, grade: 'Grade 3', section: 'Section B', subject: 'Filipino', isFavorited: false, status: 'active' },
    { id: 5, grade: 'Grade 5', section: 'Section A', subject: 'History', isFavorited: false, status: 'active' },
    { id: 6, grade: 'Grade 4', section: 'Section C', subject: 'Physical Education', isFavorited: false, status: 'active' },
    { id: 7, grade: 'Grade 1', section: 'Section A', subject: 'Arts', isFavorited: false, status: 'active' },
  ];

  /**
   * Mock Students Data with Grades
   * Each student has a grades object to store quarter grades
   */
  const mockStudents = [
    { 
      id: 1, 
      lastName: 'Aldabon', 
      firstName: 'Mark', 
      attendance: 'Present', 
      grades: { q1: null, q2: null, q3: null, q4: null, final: null, remarks: null }
    },
    { 
      id: 2, 
      lastName: 'Abarquez', 
      firstName: 'Jefferson', 
      attendance: 'Present', 
      grades: { q1: null, q2: null, q3: null, q4: null, final: null, remarks: null }
    },
    { 
      id: 3, 
      lastName: 'Cabiling', 
      firstName: 'Allyana', 
      attendance: 'Present', 
      grades: { q1: null, q2: null, q3: null, q4: null, final: null, remarks: null }
    },
    { 
      id: 4, 
      lastName: 'Garcia', 
      firstName: 'Alexandria', 
      attendance: 'Present', 
      grades: { q1: null, q2: null, q3: null, q4: null, final: null, remarks: null }
    },
    { 
      id: 5, 
      lastName: 'Legaspina', 
      firstName: 'Nathelee', 
      attendance: 'Absent', 
      grades: { q1: null, q2: null, q3: null, q4: null, final: null, remarks: null }
    },
    { 
      id: 6, 
      lastName: 'Peta', 
      firstName: 'Ayra', 
      attendance: 'Present', 
      grades: { q1: null, q2: null, q3: null, q4: null, final: null, remarks: null }
    },
    { 
      id: 7, 
      lastName: 'Sebastian', 
      firstName: 'Karl', 
      attendance: 'Present', 
      grades: { q1: null, q2: null, q3: null, q4: null, final: null, remarks: null }
    },
    { 
      id: 8, 
      lastName: 'Sumido', 
      firstName: 'Jan', 
      attendance: 'Present', 
      grades: { q1: null, q2: null, q3: null, q4: null, final: null, remarks: null }
    },
  ];

  // ===== DATA INITIALIZATION =====

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setClasses(mockClasses);
      setStudents(mockStudents);
      setLoading(false);
    }, 500);
  }, []);

  // ===== NAVIGATION FUNCTIONS =====

  /**
   * handleViewClassDetails
   * Navigate from class list to class details (student roster)
   */
  const handleViewClassDetails = (classData) => {
    setSelectedClass(classData);
    setCurrentView('classDetails');
  };

  /**
   * handleBackToList
   * Navigate from any page back to class list
   */
  const handleBackToList = () => {
    setSelectedClass(null);
    setCurrentView('classList');
  };

  /**
   * handleViewClassGrades
   * Navigate from class details to grades page
   */
  const handleViewClassGrades = () => {
    setCurrentView('classGrades');
  };

  /**
   * handleBackToDetails
   * Navigate from grades page back to class details
   */
  const handleBackToDetails = () => {
    setCurrentView('classDetails');
  };

  // ===== MODAL FUNCTIONS =====

  /**
   * handleOpenGradeModal
   * Open the grade input modal for a specific student
   */
  const handleOpenGradeModal = (studentData) => {
    setStudentToGrade(studentData);
    setIsGradeModalOpen(true);
  };

  /**
   * handleCloseGradeModal
   * Close the grade input modal
   */
  const handleCloseGradeModal = () => {
    setStudentToGrade(null);
    setIsGradeModalOpen(false);
  };

  // ===== GRADE MANAGEMENT =====

  /**
   * handleSaveGrade
   * Save a new grade for a student
   * Updates the students state with the new grade data
   * 
   * @param {number} studentId - The ID of the student
   * @param {object} newGradeData - Object containing grade info (e.g., { q1: 90, remarks: "Excellent" })
   */
  const handleSaveGrade = (studentId, newGradeData) => {
    setStudents(prevStudents => 
      prevStudents.map(student => {
        if (student.id === studentId) {
          // Update the student's grades object
          return {
            ...student,
            grades: {
              ...student.grades,
              ...newGradeData
            }
          };
        }
        return student;
      })
    );
    
    handleCloseGradeModal();
    
    // Optional: Show success message
    console.log(`Grade saved for student ${studentId}:`, newGradeData);
  };

  /**
   * handleToggleFavorite
   * Toggle favorite status for a class
   */
  const handleToggleFavorite = async (classId) => {
    setClasses(prevClasses => 
      prevClasses.map(cls => 
        cls.id === classId 
          ? { ...cls, isFavorited: !cls.isFavorited }
          : cls
      )
    );
  };

  // ===== CONDITIONAL RENDERING =====

  /**
   * Render the appropriate page based on currentView
   * Also render the grade input modal when open
   */
  return (
    <>
      {currentView === 'classList' && (
        <MyClassesPage 
          classes={classes}
          loading={loading}
          error={error}
          onViewClassDetails={handleViewClassDetails}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {currentView === 'classDetails' && (
        <ClassDetailsPage 
          classData={selectedClass}
          students={students}
          loading={loading}
          error={error}
          onBack={handleBackToList}
          onViewGrades={handleViewClassGrades}
        />
      )}

      {currentView === 'classGrades' && (
        <ClassGradesPage 
          classData={selectedClass}
          students={students}
          loading={loading}
          error={error}
          onBack={handleBackToDetails}
          onInputGrade={handleOpenGradeModal}
        />
      )}

      {/* Grade Input Modal - Rendered conditionally */}
      {isGradeModalOpen && studentToGrade && (
        <InputGradeModal 
          isOpen={isGradeModalOpen}
          student={studentToGrade}
          subject={selectedClass?.subject || 'Mathematics'}
          allStudents={students}
          onClose={handleCloseGradeModal}
          onSave={handleSaveGrade}
        />
      )}
    </>
  );
}
