import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

/**
 * InputGradeModal Component
 * 
 * A modal dialog for inputting or editing student grades.
 * Supports quarter selection (1st, 2nd, 3rd, 4th) and allows
 * teachers to input numeric grades and remarks.
 * 
 * Features:
 * - Quarter dropdown selector
 * - Grade numeric input
 * - Remarks text input
 * - Save & Save & Next functionality
 * - Auto-populates existing grade data when editing
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback to close modal
 * @param {function} onSave - Callback when grade is saved (studentId, gradeData)
 * @param {object} student - The student object for whom to input grades
 * @param {string} subject - The subject being graded
 * @param {Array} allStudents - All students in class (for Save & Next)
 */
export default function InputGradeModal({ 
  isOpen, 
  onClose, 
  onSave, 
  student,
  gradeLevelId,
  selectedClass,
  allStudents = []
}) {
  // State for form inputs
  const [selectedQuarter, setSelectedQuarter] = useState('q1');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [gradeValue, setGradeValue] = useState('');
  const [remarks, setRemarks] = useState('');
  const [allGrades, setAllGrades] = useState({});
  const [gradesLoaded, setGradesLoaded] = useState(false);

  // Fetch subjects when grade level changes
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!gradeLevelId) return;
      
      try {
        setLoadingSubjects(true);
        const response = await axios.get(
          `${API_ENDPOINTS.GET_SUBJECTS_BY_GRADE}?gradeLevelId=${gradeLevelId}`,
          { withCredentials: true }
        );
        
        if (response.data.success) {
          setSubjects(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setLoadingSubjects(false);
      }
    };
    
    fetchSubjects();
  }, [gradeLevelId]);

  // Fetch all grades for this student
  useEffect(() => {
    const fetchStudentGrades = async () => {
      if (!student?.id || !selectedClass?.id) return;

      try {
        const response = await axios.get(
          `${API_ENDPOINTS.GET_STUDENT_GRADES_ALL_SUBJECTS}?studentId=${student.id}&sectionId=${selectedClass.id}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          setAllGrades(response.data.data);
          setGradesLoaded(true);
        }
      } catch (error) {
        console.error('Error fetching student grades:', error);
      }
    };

    fetchStudentGrades();
  }, [student?.id, selectedClass?.id]);

  // Find first empty grade slot and set default selection
  useEffect(() => {
    if (subjects.length > 0 && gradesLoaded && !selectedSubject) {
      // Logic to find the first empty slot
      let foundEmpty = false;
      const quarters = ['q1', 'q2', 'q3', 'q4'];

      // Iterate quarters first, then subjects
      // This ensures we fill Q1 for all subjects before moving to Q2
      for (const q of quarters) {
        for (const subject of subjects) {
          const subjectGrades = allGrades[subject.id];
          // If no grade for this subject/quarter, select it
          if (!subjectGrades || subjectGrades[q] === null || subjectGrades[q] === '') {
            setSelectedSubject(subject.id.toString());
            setSelectedQuarter(q);
            foundEmpty = true;
            break;
          }
        }
        if (foundEmpty) break;
      }

      // If no empty slot found (all filled), default to first subject and q1
      if (!foundEmpty && subjects.length > 0) {
        setSelectedSubject(subjects[0].id.toString());
        setSelectedQuarter('q1');
      }
    }
  }, [subjects, gradesLoaded, allGrades, selectedSubject]);

  // Update form when selection changes
  useEffect(() => {
    if (selectedSubject && allGrades[selectedSubject]) {
      const subjectGrades = allGrades[selectedSubject];
      setGradeValue(subjectGrades[selectedQuarter] !== null ? subjectGrades[selectedQuarter] : '');
      setRemarks(subjectGrades.remarks || '');
    } else {
      setGradeValue('');
      setRemarks('');
    }
  }, [selectedSubject, selectedQuarter, allGrades]);

  // Refresh grades when student changes (e.g. Next button)
  useEffect(() => {
    setGradesLoaded(false);
    setAllGrades({});
    setSelectedSubject(''); // Reset selection to trigger auto-select logic again
  }, [student?.id]);

  // Calculate if final grade can be computed
  const canComputeFinal = student?.grades?.q1 && student?.grades?.q2 && 
                          student?.grades?.q3 && student?.grades?.q4;
  const computedFinalGrade = canComputeFinal 
    ? ((parseFloat(student.grades.q1) + parseFloat(student.grades.q2) + 
        parseFloat(student.grades.q3) + parseFloat(student.grades.q4)) / 4).toFixed(2)
    : null;

  // Handle Save button click
  const handleSave = () => {
    if (!gradeValue) {
      alert('Please enter a grade value');
      return;
    }

    if (!selectedSubject) {
      alert('Please select a subject');
      return;
    }

    const selectedSubjectObj = subjects.find(s => s.id.toString() === selectedSubject);

    const gradeData = {
      [selectedQuarter]: parseFloat(gradeValue),
      remarks: remarks.trim(),
      subjectId: parseInt(selectedSubject),
      subjectName: selectedSubjectObj?.name
    };

    onSave(student.id, gradeData);

    // Update local allGrades state immediately to reflect the save
    const updatedAllGrades = {
      ...allGrades,
      [selectedSubject]: {
        ...allGrades[selectedSubject],
        [selectedQuarter]: parseFloat(gradeValue),
        remarks: remarks.trim()
      }
    };
    setAllGrades(updatedAllGrades);

    // Find next empty slot
    let foundNext = false;
    const quarters = ['q1', 'q2', 'q3', 'q4'];

    for (const q of quarters) {
      for (const subject of subjects) {
        const subjectGrades = updatedAllGrades[subject.id];
        // If no grade for this subject/quarter, select it
        if (!subjectGrades || subjectGrades[q] === null || subjectGrades[q] === '') {
          setSelectedSubject(subject.id.toString());
          setSelectedQuarter(q);
          foundNext = true;
          break;
        }
      }
      if (foundNext) break;
    }

    // Clear inputs for the next entry (or keep if not found)
    if (foundNext) {
      setGradeValue('');
      setRemarks('');
    } else {
      // All grades filled
      // Optionally close modal or show completion message
      // For now, we just clear inputs or keep them as is? 
      // Keeping them shows the last entered grade, which is fine.
    }
  };



  // Reset form to initial state
  const resetForm = () => {
    setSelectedQuarter('q1');
    setGradeValue('');
    setRemarks('');
    // Don't reset subject selection to maintain context
  };

  // Handle modal close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Don't render if modal is not open or no student selected
  if (!isOpen || !student) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[85vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="bg-gray-800 text-white px-5 py-3">
            <h2 className="text-xl font-bold">Input Grade</h2>
          </div>

          {/* Modal Body */}
          <div className="p-5 space-y-4 overflow-y-auto">
            {/* Student Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Student Name
              </label>
              <div className="text-lg text-gray-900 font-medium">
                {student.firstName} {student.lastName}
              </div>
            </div>

            {/* Quarter Selector */}
            <div>
              <label 
                htmlFor="quarter-select" 
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Select Quarter
              </label>
              <select
                id="quarter-select"
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all"
              >
                <option value="q1">1st Quarter</option>
                <option value="q2">2nd Quarter</option>
                <option value="q3">3rd Quarter</option>
                <option value="q4">4th Quarter</option>
              </select>
            </div>

            {/* Subject Selector */}
            <div>
              <label 
                htmlFor="subject-select" 
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Subject
              </label>
              {loadingSubjects ? (
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                  Loading subjects...
                </div>
              ) : (
                <select
                  id="subject-select"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all"
                  disabled={subjects.length === 0}
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Grade Input */}
            <div>
              <label 
                htmlFor="grade-input" 
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Grade
              </label>
              <input
                id="grade-input"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={gradeValue}
                onChange={(e) => setGradeValue(e.target.value)}
                placeholder="Enter grade (0-100)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Remarks Input */}
            <div>
              <label 
                htmlFor="remarks-input" 
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Remarks
              </label>
              <textarea
                id="remarks-input"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter remarks (optional)"
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            {/* Final Grade Display (if all quarters are complete) */}
            {computedFinalGrade && (
              <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Final Grade (Average):</span>
                  <span className="text-2xl font-bold text-amber-600">{computedFinalGrade}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  All quarterly grades are complete. Final grade is automatically calculated.
                </p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-50 px-5 py-3 flex justify-end gap-3">
            {/* Cancel Button */}
            <button
              onClick={handleClose}
              className="px-5 py-2 border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium rounded-full transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
