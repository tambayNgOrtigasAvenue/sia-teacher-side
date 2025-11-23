import React from 'react';

/**
 * UpdateStudentModal Component
 * Modal for updating student profile information
 * 
 * @param {object} studentData - Student data object
 * @param {function} onInputChange - Callback when input changes
 * @param {function} onSave - Callback to save changes
 * @param {function} onClose - Callback to close modal
 * @param {boolean} saving - Saving state
 */
export default function UpdateStudentModal({ studentData, onInputChange, onSave, onClose, saving }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Update Student Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Row 1: Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={studentData.firstName}
                onChange={(e) => onInputChange('firstName', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Middle Name
              </label>
              <input
                type="text"
                value={studentData.middleName}
                onChange={(e) => onInputChange('middleName', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                placeholder="Enter middle name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={studentData.lastName}
                onChange={(e) => onInputChange('lastName', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                placeholder="Enter last name"
              />
            </div>
          </div>

          {/* Row 2: Birthday, Age, Student Number */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Birthday
              </label>
              <input
                type="date"
                value={studentData.birthdate}
                onChange={(e) => onInputChange('birthdate', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Age
              </label>
              <input
                type="number"
                value={studentData.age}
                onChange={(e) => onInputChange('age', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                placeholder="Enter age"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Student Number
              </label>
              <input
                type="text"
                value={studentData.studentNumber}
                onChange={(e) => onInputChange('studentNumber', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                placeholder="Enter student number"
              />
            </div>
          </div>

          {/* Row 3: Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Address
            </label>
            <textarea
              value={studentData.address}
              onChange={(e) => onInputChange('address', e.target.value)}
              rows="3"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all resize-none"
              placeholder="Enter complete address"
            />
          </div>

          {/* Row 4: Contact Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Contact Number
            </label>
            <input
              type="tel"
              value={studentData.contactNumber}
              onChange={(e) => onInputChange('contactNumber', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              placeholder="+63 (123) 456-7890"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-amber-300 hover:bg-amber-400 text-gray-800 font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
