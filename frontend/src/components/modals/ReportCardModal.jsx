import React from 'react';

/**
 * ReportCardModal Component
 * Modal displaying student's report card for a specific quarter
 * 
 * @param {object} student - Student data
 * @param {object} classData - Class/section data
 * @param {Array} subjects - List of subjects
 * @param {object} grades - Grades data
 * @param {number} quarter - Selected quarter (1-4)
 * @param {string} average - Calculated average
 * @param {function} onClose - Close modal callback
 * @param {function} onPrint - Print callback
 */
export default function ReportCardModal({ student, classData, subjects, grades, quarter, average, onClose, onPrint }) {
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
            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              <img 
                src="/src/assets/img/gymnazu.png" 
                alt="School Logo"
                className="w-full h-full object-contain"
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
}
