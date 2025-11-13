import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppearancesTab from '../common/settings/appearancesTab';
import MyAccountTab from '../common/settings/myAccountTab';

/**
 * SettingsPage Component
 * Main settings page with tabs for Appearances and My Account
 */
export default function SettingsPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Appearances');

  // Check if we should open "My Account" tab based on navigation state
  useEffect(() => {
    if (location.state?.openMyAccount) {
      setActiveTab('My Account');
    }
  }, [location.state]);

  const tabs = [
    { id: 'Appearances', label: 'Appearances' },
    { id: 'My Account', label: 'My Account' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'Appearances':
        return <AppearancesTab />;
      case 'My Account':
        return <MyAccountTab />;
      default:
        return <AppearancesTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      {/* Page Header */}
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Settings
      </h1>

      {/* Tab Buttons */}
      <div className="flex items-center gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-[15px] text-base font-semibold transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-amber-400 text-neutral-700 border-2 border-black/20'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300/50 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderContent()}
    </div>
  );
}
