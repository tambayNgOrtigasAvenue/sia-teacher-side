import React from 'react';
import { X } from 'lucide-react';

const AddClassModal = ({
  isOpen,
  formData,
  gradeLevels,
  sectionsData,
  activeSchoolYear,
  onClose,
  onSubmit,
  onChange,
  onGradeLevelChange,
  onCreateSections,
  getSectionTheme
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add New Class
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Teacher Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Teacher *
            </label>
            <select
              value={formData.teacherId}
              onChange={(e) => onChange({ ...formData, teacherId: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors"
              required
            >
              <option value="">Select Teacher</option>
              {formData.teachers && formData.teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} ({teacher.employeeNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Grade Level Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Grade Level *
            </label>
            {gradeLevels.length === 0 ? (
              <div className="space-y-3">
                <select
                  disabled
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                >
                  <option value="">Loading grade levels...</option>
                </select>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>No grade levels found.</strong> The database may need to be initialized.
                    Please run the seed script: <code className="bg-amber-100 dark:bg-amber-900 px-1 py-0.5 rounded">backend/seeders/seed-teaching-schedule-data.sql</code>
                  </p>
                </div>
              </div>
            ) : (
              <select
                value={formData.gradeLevelId}
                onChange={(e) => onGradeLevelChange(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-colors"
                required
              >
                <option value="">Select Grade Level</option>
                {gradeLevels.filter(grade => grade.id <= 6).map(grade => (
                  <option key={grade.id} value={grade.id}>
                    {grade.name.toLowerCase().includes('grade') ? grade.name : `Grade ${grade.name}`}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Section Selection with Student Count */}
          {formData.gradeLevelId && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Section ({formData.gradeLevelId ? getSectionTheme(parseInt(formData.gradeLevelId)).name : 'Theme Names'}) *
                </label>
                <button
                  type="button"
                  onClick={() => onCreateSections(formData.gradeLevelId)}
                  className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                  disabled={!formData.gradeLevelId}
                >
                  + Create Sections
                </button>
              </div>
              {sectionsData.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {sectionsData.map(section => (
                    <label
                      key={section.sectionId}
                      className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-colors ${formData.sectionId === section.sectionId.toString()
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-amber-300'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="section"
                          value={section.sectionId}
                          checked={formData.sectionId === section.sectionId.toString()}
                          onChange={(e) => onChange({ ...formData, sectionId: e.target.value })}
                          className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {section.sectionName}
                          </p>
                          {section.adviserName && (
                            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                              Adviser: {section.adviserName}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {section.studentCount}/{section.maxCapacity} students
                            {section.studentCount >= section.maxCapacity && (
                              <span className="ml-2 text-red-500 font-medium">• FULL</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${section.status === 'Full' ? 'bg-red-100 text-red-700' :
                        section.status === 'Almost Full' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                        {section.status}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <p>No sections found for this grade.</p>
                  <p className="text-xs mt-1">Theme: <span className="font-medium text-amber-600">{getSectionTheme(parseInt(formData.gradeLevelId)).name}</span></p>
                  <button
                    type="button"
                    onClick={() => onCreateSections(formData.gradeLevelId)}
                    className="mt-2 text-amber-600 hover:text-amber-700 font-medium text-sm"
                  >
                    Click here to create sections
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Note:</strong> The selected teacher will be assigned as the adviser for the selected section.
              They can manage the class schedule and students after assignment.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-amber-300 text-gray-900 rounded-lg hover:bg-amber-400 transition-colors font-medium"
            >
              Assign to Section
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClassModal;
