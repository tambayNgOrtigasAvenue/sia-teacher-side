import React, { useState } from 'react';

/**
 * AskQuestionForm Component
 * 
 * Renders a form for users to submit questions or support requests.
 * Collects full name, student ID, and description.
 * 
 * @param {function} onSubmit - Callback function to handle form submission
 */
export default function AskQuestionForm({ onSubmit }) {
  // Form field states
  const [fullName, setFullName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [description, setDescription] = useState('');

  /**
   * Handle form submission
   * Validates fields, calls onSubmit callback, and resets form
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!fullName.trim() || !employeeId.trim() || !description.trim()) {
      alert('Please fill in all fields');
      return;
    }

    // Call parent callback with form data
    onSubmit({
      fullName: fullName.trim(),
      employeeId: employeeId.trim(),
      description: description.trim()
    });

    // Reset form fields
    setFullName('');
    setEmployeeId('');
    setDescription('');

    // Show success message
    alert('Your question has been submitted successfully! We will respond shortly.');
  };

  return (
    <div className="bg-amber-50 dark:bg-gray-700 p-6 rounded-2xl">
      {/* Section Header */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        Ask Question
      </h2>

      {/* Question Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name Input */}
        <div>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
          />
        </div>

        {/* Employee ID Input */}
        <div>
          <input
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="Employee ID"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
          />
        </div>

        {/* Description Textarea */}
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description..."
            rows="6"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-amber-400 hover:bg-amber-500 text-white font-semibold px-8 py-3 rounded-full transition-colors shadow-md hover:shadow-lg"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
