import React from 'react';
import { Facebook, Mail, Phone } from '../../../icons/icons.jsx';

/**
 * ContactUs Component
 * 
 * Renders static contact information for the school.
 * Displays Facebook page, email, and phone number with icons.
 */
export default function ContactUs() {
  return (
    <div className="bg-amber-50 dark:bg-gray-700 p-6 rounded-2xl">
      {/* Section Header */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        Contact Us
      </h2>

      {/* Contact Information List */}
      <div className="space-y-3">
        {/* Facebook Contact */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <Facebook className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </div>
          <a
            href="https://facebook.com/GymnazoChristianAcademy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            Gymnazo Christian Academy
          </a>
        </div>

        {/* Email Contact */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <Mail className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </div>
          <a
            href="mailto:482022.gymnazochristianacademy@gmail.com"
            className="text-gray-800 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            482022.gymnazochristianacademy@gmail.com
          </a>
        </div>

        {/* Phone Contact */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <Phone className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </div>
          <a
            href="tel:282472450"
            className="text-gray-800 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            282472450
          </a>
        </div>
      </div>
    </div>
  );
}
