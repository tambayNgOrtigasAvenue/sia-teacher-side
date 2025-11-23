import React, { useState } from 'react';
import FaqSection from '../common/dashboard/help/faqSection.jsx';
import AskQuestionForm from '../common/dashboard/help/askQuestionForm.jsx';
import ContactUs from '../common/dashboard/help/contactUs.jsx';

/**
 * HelpSupportPage Component
 * 
 * Main container for the "Help & Support" page.
 * Displays FAQ section, Ask Question form, and Contact Us information.
 * Manages submitted questions in local state.
 */
export default function HelpSupportPage() {
  // State to store submitted questions
  const [submittedQuestions, setSubmittedQuestions] = useState([]);

  /**
   * Handle question submission from AskQuestionForm
   * Adds the question to state with timestamp
   */
  const handleSubmitQuestion = (questionData) => {
    const newQuestion = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...questionData
    };
    
    setSubmittedQuestions(prev => [...prev, newQuestion]);
    
    // Optional: Send to backend API
    // fetch('/api/help/questions', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newQuestion)
    // });
    
    console.log('Question submitted:', newQuestion);
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Page Header */}
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
        Help & Support
      </h1>

      {/* Main Content Card - FAQ and Ask Question */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg flex flex-col lg:flex-row gap-8">
        {/* Left Side - FAQ Section */}
        <div className="flex-1">
          <FaqSection />
        </div>

        {/* Right Side - Ask Question Form */}
        <div className="flex-1">
          <AskQuestionForm onSubmit={handleSubmitQuestion} />
        </div>
      </div>

      {/* Contact Us Section */}
      <div className="mt-8">
        <ContactUs />
      </div>
    </div>
  );
}