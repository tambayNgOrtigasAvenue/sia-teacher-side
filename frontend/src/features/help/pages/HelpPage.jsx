import React from 'react';
import FaqSection from '../components/FaqSection.jsx';
import AskQuestionForm from '../components/AskQuestionForm.jsx';
import ContactUs from '../components/ContactUs.jsx';

/**
 * HelpPage Component
 * 
 * Main container for the "Help & Support" page.
 * Displays FAQ section, Ask Question form, and Contact Us information.
 * 
 * @param {function} onAskQuestion - Callback function to handle question submission
 */
export default function HelpPage({ onAskQuestion }) {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <h1 className="text-4xl font-bold mb-6 text-gray-900">
        Help & Support
      </h1>

      {/* Main Content Card - FAQ and Ask Question */}
      <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col lg:flex-row gap-8">
        {/* Left Side - FAQ Section */}
        <div className="flex-1">
          <FaqSection />
        </div>

        {/* Right Side - Ask Question Form */}
        <div className="flex-1">
          <AskQuestionForm onSubmit={onAskQuestion} />
        </div>
      </div>

      {/* Contact Us Section */}
      <div className="mt-8">
        <ContactUs />
      </div>
    </div>
  );
}
