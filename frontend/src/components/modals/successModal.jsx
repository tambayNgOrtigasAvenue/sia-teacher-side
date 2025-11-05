
import React from 'react';
import Logo from '../../assets/img/gymnazu.png';

const SuccessModal = ({ isOpen, username }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 animate-fade-in">
        
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Login Successful!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Welcome back, <span className="font-semibold text-amber-600 dark:text-amber-400">{username || 'Student'}</span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Redirecting to your dashboard...
          </p>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-green-400 to-green-600 h-full rounded-full animate-progress"></div>
        </div>

        <div className="flex justify-center">
          <img src={Logo} alt="Logo" className="w-12 h-12 opacity-50" />
        </div>

      </div>
    </div>
  );
};

export default SuccessModal;