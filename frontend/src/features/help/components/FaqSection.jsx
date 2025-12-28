import React, { useState } from 'react';
import FaqItem from './FaqItem.jsx';
import { KeyRound, ScrollText, CreditCard, MessageSquareText } from '../../../components/icons/icons.jsx';

/**
 * FaqSection Component
 * 
 * Renders the FAQ section with collapsible accordion items.
 * Each item can be toggled open/closed independently.
 */
export default function FaqSection() {
  // State to track which FAQ item is currently open
  const [openId, setOpenId] = useState(null);

  /**
   * FAQ Data
   * Array of frequently asked questions with their answers
   */
  const faqData = [
    {
      id: 'q1',
      icon: KeyRound,
      question: 'How does the RFID attendance work?',
      answer: 'The RFID attendance system uses radio frequency identification technology to automatically record student attendance. Students simply tap their RFID card on the reader when entering the classroom, and their attendance is instantly logged in the system. Teachers can view real-time attendance reports through the dashboard.'
    },
    {
      id: 'q2',
      icon: ScrollText,
      question: 'What is the enroll subsystem?',
      answer: 'The enrollment subsystem is a comprehensive module that handles student registration and enrollment processes. It allows administrators to manage student information, assign students to classes, track enrollment status, and generate enrollment reports. Parents can also use this system to submit enrollment applications online.'
    },
    {
      id: 'q3',
      icon: CreditCard,
      question: 'How are payment processed?',
      answer: 'Payments are processed through our secure online payment gateway. Parents can pay tuition fees, miscellaneous fees, and other school charges using credit cards, debit cards, or online banking. The system automatically generates official receipts and updates the student\'s account balance in real-time.'
    },
    {
      id: 'q4',
      icon: MessageSquareText,
      question: 'What is TextSundo?',
      answer: 'TextSundo is our SMS notification service that keeps parents and teachers informed about important school updates. It sends automated text messages for announcements, event reminders, grade notifications, and emergency alerts. Teachers can also use it to send custom messages to parents regarding their child\'s performance or behavior.'
    }
  ];

  /**
   * Handle toggle for accordion items
   * Opens the clicked item, or closes it if it's already open
   */
  const handleToggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div>
      {/* Section Header */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">FAQ</h2>

      {/* FAQ Items List */}
      <div className="space-y-4">
        {faqData.map((faq) => (
          <FaqItem
            key={faq.id}
            question={faq.question}
            answer={faq.answer}
            IconComponent={faq.icon}
            isOpen={openId === faq.id}
            onToggle={() => handleToggle(faq.id)}
          />
        ))}
      </div>
    </div>
  );
}
