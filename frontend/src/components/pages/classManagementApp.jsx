import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

  // ===== DATA INITIALIZATION =====

  useEffect(() => {
    fetchTeacherClasses();
  }, []);

  // Fetch teacher's classes from API
  const fetchTeacherClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        'http://localhost/gymnazo-christian-academy-teacher-side/backend/api/teachers/get-teacher-classes.php',
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setClasses(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch classes');
      }
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Error loading classes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch students for selected section (for class details - roster only)
  const fetchStudentsForSection = async (sectionId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost/gymnazo-christian-academy-teacher-side/backend/api/teachers/get-students-by-section.php?sectionId=${sectionId}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        // Add grades structure to each student
        const studentsWithGrades = response.data.data.map(student => ({
          ...student,
          grades: { q1: null, q2: null, q3: null, q4: null, final: null, remarks: null }
        }));
        setStudents(studentsWithGrades);
      } else {
        setError(response.data.message || 'Failed to fetch students');
        setStudents([]);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Error loading students. Please try again.');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch students with grades for selected section
  const fetchStudentsWithGrades = async (sectionId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost/gymnazo-christian-academy-teacher-side/backend/api/grades/get-section-grades.php?sectionId=${sectionId}`,
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setStudents(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch grades');
        setStudents([]);
      }
    } catch (err) {
      console.error('Error fetching grades:', err);
      setError('Error loading grades. Please try again.');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // ===== NAVIGATION FUNCTIONS =====

  /**
   * handleViewClassDetails
   * Navigate from class list to class details (student roster)
   * Fetch students for the selected section
   */
  const handleViewClassDetails = (classData) => {
    setSelectedClass(classData);
    setCurrentView('classDetails');
    // Fetch students for this section
    fetchStudentsForSection(classData.id);
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
   * Navigate from class details to grades page and fetch grades
   */
  const handleViewClassGrades = () => {
    setCurrentView('classGrades');
    // Fetch grades data when navigating to grades page
    if (selectedClass && selectedClass.id) {
      fetchStudentsWithGrades(selectedClass.id);
    }
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
   * Save a new grade for a student to the database
   * 
   * @param {number} studentId - The ID of the student (StudentProfileID)
   * @param {object} newGradeData - Object containing grade info (e.g., { q1: 90, remarks: "Excellent" })
   */
  const handleSaveGrade = async (studentId, newGradeData) => {
    try {
      // Extract the quarter and grade value from newGradeData
      const quarter = Object.keys(newGradeData).find(key => key.startsWith('q'));
      const gradeValue = newGradeData[quarter];
      const remarks = newGradeData.remarks || '';
      
      if (!quarter || gradeValue === undefined) {
        throw new Error('Invalid grade data');
      }
      
      // Send to backend
      const response = await axios.post(
        'http://localhost/gymnazo-christian-academy-teacher-side/backend/api/grades/save-quarterly-grade.php',
        {
          studentProfileId: studentId,
          sectionId: selectedClass.id,
          quarter: quarter,
          gradeValue: gradeValue,
          remarks: remarks
        },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        // Update local state with the new grade
        setStudents(prevStudents => 
          prevStudents.map(student => {
            if (student.id === studentId) {
              const updatedGrades = {
                ...student.grades,
                [quarter]: gradeValue,
                remarks: remarks
              };
              
              // If backend calculated final grade, update it
              if (response.data.data.finalGrade !== null) {
                updatedGrades.final = response.data.data.finalGrade;
              }
              
              return {
                ...student,
                grades: updatedGrades
              };
            }
            return student;
          })
        );
        
        handleCloseGradeModal();
        
        // Show success message (you can add a toast notification here)
        console.log('Grade saved successfully:', response.data.message);
      } else {
        throw new Error(response.data.message || 'Failed to save grade');
      }
    } catch (err) {
      console.error('Error saving grade:', err);
      alert(err.response?.data?.message || err.message || 'Failed to save grade. Please try again.');
    }
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
          onRefresh={fetchTeacherClasses}
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
