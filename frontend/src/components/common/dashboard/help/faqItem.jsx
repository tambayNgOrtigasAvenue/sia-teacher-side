import React from 'react';
import { ChevronDown } from '../../../icons/icons.jsx';

/**
 * FaqItem Component
 * 
 * Renders a single collapsible FAQ accordion item.
 * Shows/hides the answer when the header is clicked.
 * 
 * @param {string} question - The FAQ question text
 * @param {string} answer - The FAQ answer text
 * @param {Component} IconComponent - The icon component to display
 * @param {boolean} isOpen - Whether this item is currently expanded
 * @param {function} onToggle - Callback function when item is clicked
 */
export default function FaqItem({ question, answer, IconComponent, isOpen, onToggle }) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-all">
      {/* Accordion Header (Clickable) */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
      >
        {/* Icon */}
        <div className="flex-shrink-0">
          <IconComponent className="w-6 h-6 text-amber-500" />
        </div>

        {/* Question Text */}
        <span className="flex-1 font-medium text-gray-900 dark:text-white">
          {question}
        </span>

        {/* Chevron Icon (Rotates when open) */}
        <ChevronDown 
          className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Accordion Content (Answer) */}
      {isOpen && (
        <div className="p-4 pt-0 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}
