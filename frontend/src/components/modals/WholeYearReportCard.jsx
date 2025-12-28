import React from 'react';

/**
 * WholeYearReportCard Component
 * Modal displaying student's complete annual report card with all quarters
 * 
 * @param {object} student - Student data
 * @param {object} classData - Class/section data
 * @param {Array} subjects - List of subjects
 * @param {object} grades - Grades data for all quarters
 * @param {function} onClose - Close modal callback
 * @param {function} onPrint - Print callback
 */
export default function WholeYearReportCard({ student, classData, subjects, grades, onClose, onPrint }) {
  const currentYear = new Date().getFullYear();
  const schoolYear = `${currentYear}-${(currentYear + 1).toString().slice(-2)}`;
  
  // Calculate final grade for each subject (average of all 4 quarters)
  const calculateFinalGrade = (subjectId) => {
    const q1 = parseFloat(grades[subjectId]?.q1) || 0;
    const q2 = parseFloat(grades[subjectId]?.q2) || 0;
    const q3 = parseFloat(grades[subjectId]?.q3) || 0;
    const q4 = parseFloat(grades[subjectId]?.q4) || 0;
    
    if (q1 === 0 && q2 === 0 && q3 === 0 && q4 === 0) return '-';
    
    const count = [q1, q2, q3, q4].filter(g => g > 0).length;
    if (count === 0) return '-';
    
    return ((q1 + q2 + q3 + q4) / 4).toFixed(2);
  };

  // Calculate general average across all subjects
  const calculateGeneralAverage = () => {
    let totalGrades = 0;
    let subjectCount = 0;

    subjects.forEach(subject => {
      const finalGrade = calculateFinalGrade(subject.id);
      if (finalGrade !== '-') {
        totalGrades += parseFloat(finalGrade);
        subjectCount++;
      }
    });

    return subjectCount > 0 ? (totalGrades / subjectCount).toFixed(2) : '-';
  };

  // Determine class standing based on general average
  const getClassStanding = () => {
    const gwa = calculateGeneralAverage();
    if (gwa === '-') return 'N/A';
    const average = parseFloat(gwa);
    return average >= 75 ? 'PASS' : 'FAILED';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-[420px] my-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none z-10 print:hidden"
        >
          ×
        </button>

        {/* Header Section */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="text-center space-y-0.5">
            {/* Republic Header */}
            <p className="text-[9px] font-semibold text-gray-700">REPUBLIC OF THE PHILIPPINES</p>
            <p className="text-[9px] text-gray-600">Department of Education</p>
            <p className="text-[9px] text-gray-600">National Capital Region</p>
            <p className="text-[9px] text-gray-600">Division of City School</p>
            <p className="text-[9px] text-gray-600">Quezon City</p>
            
            {/* School Info with Logo */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-left">
                <p className="text-[10px] font-bold text-gray-800">GCA SF</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 flex items-center justify-center">
                  <img 
                    src="/src/assets/img/gymnazu.png" 
                    alt="GCA Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-bold text-gray-800 leading-tight">GCA</p>
                  <p className="text-[9px] text-gray-700 leading-tight">GYMNAZO CHRISTIAN ACADEMY</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold text-gray-700">Learner's Achievement Progress</p>
                <p className="text-[9px] font-semibold text-gray-700">GRADE SCHOOL DEPARTMENT</p>
                <p className="text-[9px] text-gray-600">School Year {schoolYear}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Student Information */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="space-y-1 text-[10px]">
            <div className="flex gap-2">
              <span className="font-semibold text-gray-700 w-16">Name:</span>
              <div className="flex-1">
                <div className="border-b border-gray-300 pb-0.5">
                  <span className="text-gray-900">{student.lastName?.toUpperCase() || ''}</span>
                </div>
                <div className="flex gap-2 mt-1">
                  <div className="flex-1">
                    <p className="text-[8px] text-gray-500">Surname</p>
                    <p className="text-[9px] text-gray-700">{student.lastName?.toUpperCase() || ''}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-[8px] text-gray-500">Given Name</p>
                    <p className="text-[9px] text-gray-700">{student.firstName?.toUpperCase() || ''}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-[8px] text-gray-500">Middle Name</p>
                    <p className="text-[9px] text-gray-700">{student.middleName?.toUpperCase() || ''}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex gap-1">
                <span className="font-semibold text-gray-700">STUDENT No.:</span>
                <span className="text-gray-900 border-b border-gray-300 flex-1">{student.studentNumber || ''}</span>
              </div>
              <div className="flex gap-1">
                <span className="font-semibold text-gray-700">LRN:</span>
                <span className="text-gray-900 border-b border-gray-300 flex-1"></span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex gap-1 col-span-2">
                <span className="font-semibold text-gray-700">LEVEL & SECTION:</span>
                <span className="text-gray-900 border-b border-gray-300 flex-1">
                  {classData.grade?.toUpperCase()}-{classData.section?.toUpperCase()}
                </span>
              </div>
              <div className="flex gap-1">
                <span className="font-semibold text-gray-700">AGE:</span>
                <span className="text-gray-900 border-b border-gray-300 flex-1">{student.age || '-'}</span>
              </div>
            </div>
            <div className="flex gap-1">
              <span className="font-semibold text-gray-700">Gender:</span>
              <span className="text-gray-900 border-b border-gray-300 flex-1">{student.gender || ''}</span>
            </div>
          </div>
        </div>

        {/* Periodic Grading Section */}
        <div className="px-4 py-3">
          {/* Header with dark background */}
          <div className="bg-gray-800 text-white text-center py-2 mb-2">
            <p className="text-[11px] font-bold">PERIODIC GRADING</p>
          </div>
          
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-1 border-b border-gray-300 pb-1 mb-1 bg-gray-800 text-white py-1.5 px-1">
            <div className="text-[10px] font-semibold">Learning Areas</div>
            <div className="text-[10px] font-semibold text-center">1</div>
            <div className="text-[10px] font-semibold text-center">2</div>
            <div className="text-[10px] font-semibold text-center">3</div>
            <div className="text-[10px] font-semibold text-center">4</div>
            <div className="text-[10px] font-semibold text-center">Final Grade</div>
          </div>

          {/* Subject Grades */}
          <div className="space-y-0.5">
            {subjects.map((subject) => (
              <div key={subject.id} className="grid grid-cols-6 gap-1 py-0.5 border-b border-gray-100">
                <div className="text-[10px] text-gray-700">{subject.name}</div>
                <div className="text-[10px] text-gray-700 text-center">
                  {grades[subject.id]?.q1 || '-'}
                </div>
                <div className="text-[10px] text-gray-700 text-center">
                  {grades[subject.id]?.q2 || '-'}
                </div>
                <div className="text-[10px] text-gray-700 text-center">
                  {grades[subject.id]?.q3 || '-'}
                </div>
                <div className="text-[10px] text-gray-700 text-center">
                  {grades[subject.id]?.q4 || '-'}
                </div>
                <div className="text-[10px] font-semibold text-gray-800 text-center">
                  {calculateFinalGrade(subject.id)}
                </div>
              </div>
            ))}
          </div>

          {/* General Average */}
          <div className="border-t-2 border-gray-800 mt-2 pt-2">
            <div className="grid grid-cols-6 gap-1">
              <div className="col-span-5 text-[11px] font-bold text-gray-800">GENERAL AVE</div>
              <div className="text-[11px] font-bold text-gray-800 text-center">
                {calculateGeneralAverage()}
              </div>
            </div>
          </div>
        </div>

        {/* Class Standing */}
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">PUPIL IN CLASS</span>
              <span className="text-gray-900">-</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">CLASS STANDING</span>
              <span className={`font-semibold ${
                getClassStanding() === 'PASS' ? 'text-green-600' : 
                getClassStanding() === 'FAILED' ? 'text-red-600' : 'text-gray-900'
              }`}>
                {getClassStanding()}
              </span>
            </div>
          </div>
        </div>

        {/* Teacher Remarks */}
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="bg-gray-800 text-white py-1.5 px-2 mb-2">
            <div className="grid grid-cols-2">
              <p className="text-[10px] font-bold">Period</p>
              <p className="text-[10px] font-bold">Teacher Remark(s)</p>
            </div>
          </div>
          
          <div className="space-y-0.5 text-[10px]">
            {['1st Quarter', '2nd Quarter', '3rd Quarter', '4th Quarter'].map((quarter, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-2 py-1 border-b border-gray-100">
                <div className="text-gray-700">{quarter}</div>
                <div className="text-gray-700"> </div>
              </div>
            ))}
          </div>
        </div>

        {/* Parent's Signature */}
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="bg-gray-800 text-white py-1.5 px-2 mb-2">
            <div className="grid grid-cols-2">
              <p className="text-[10px] font-bold">Period</p>
              <p className="text-[10px] font-bold">Parent's Signature</p>
            </div>
          </div>
          
          <div className="space-y-0.5 text-[10px]">
            {['1st Quarter', '2nd Quarter', '3rd Quarter', '4th Quarter'].map((quarter, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-2 py-1 border-b border-gray-100">
                <div className="text-gray-700">{quarter}</div>
                <div className="text-gray-700"> </div>
              </div>
            ))}
          </div>
        </div>

        {/* Print Button */}
        <div className="px-4 py-4 flex justify-center border-t border-gray-200">
          <button
            onClick={onPrint}
            className="bg-amber-300 hover:bg-amber-400 px-5 py-2 rounded-lg font-semibold text-xs flex items-center gap-2 transition-colors"
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
}
