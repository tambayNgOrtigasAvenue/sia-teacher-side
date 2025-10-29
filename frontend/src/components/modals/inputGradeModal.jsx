import React, { useState, useEffect } from 'react';

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
  subject = "Mathematics",
  allStudents = []
}) {
  // State for form inputs
  const [selectedQuarter, setSelectedQuarter] = useState('q1');
  const [gradeValue, setGradeValue] = useState('');
  const [remarks, setRemarks] = useState('');

  // Auto-populate existing grade data when student or quarter changes
  useEffect(() => {
    if (student && student.grades) {
      setGradeValue(student.grades[selectedQuarter] || '');
      setRemarks(student.grades.remarks || '');
    }
  }, [student, selectedQuarter]);

  // Handle Save button click
  const handleSave = () => {
    if (!gradeValue) {
      alert('Please enter a grade value');
      return;
    }

    const gradeData = {
      [selectedQuarter]: parseFloat(gradeValue),
      remarks: remarks.trim()
    };

    onSave(student.id, gradeData);
    resetForm();
  };

  // Handle Save & Next button click
  const handleSaveAndNext = () => {
    if (!gradeValue) {
      alert('Please enter a grade value');
      return;
    }

    const gradeData = {
      [selectedQuarter]: parseFloat(gradeValue),
      remarks: remarks.trim()
    };

    onSave(student.id, gradeData);

    // Find next student
    const currentIndex = allStudents.findIndex(s => s.id === student.id);
    const nextStudent = allStudents[currentIndex + 1];

    if (nextStudent) {
      // Modal will re-render with next student via useEffect
      resetForm();
      // Parent component should update the student prop
    } else {
      // No more students, close modal
      resetForm();
      onClose();
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setSelectedQuarter('q1');
    setGradeValue('');
    setRemarks('');
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
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="bg-gray-800 text-white px-6 py-4">
            <h2 className="text-2xl font-bold">Input Grade</h2>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-5">
            {/* Student Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Student Name
              </label>
              <div className="text-lg text-gray-900 font-medium">
                {student.firstName} {student.lastName}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subject
              </label>
              <div className="text-lg text-gray-900 font-medium">
                {subject}
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
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
            {/* Cancel Button */}
            <button
              onClick={handleClose}
              className="px-5 py-2 border border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>

            {/* Save & Next Button (only show if not last student) */}
            {allStudents.findIndex(s => s.id === student.id) < allStudents.length - 1 && (
              <button
                onClick={handleSaveAndNext}
                className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full transition-colors"
              >
                Save & Next
              </button>
            )}

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
