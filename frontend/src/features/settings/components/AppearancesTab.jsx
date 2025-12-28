import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useDarkMode } from '../../../context/DarkModeContext';
import { API_ENDPOINTS } from '../../../config/api';

/**
 * AppearancesTab Component
 * Allows users to customize theme and accent colors
 */
export default function AppearancesTab() {
  const { isDarkMode, toggleDarkMode, setDarkMode } = useDarkMode(); // Add setDarkMode if available
  const [selectedTheme, setSelectedTheme] = useState(isDarkMode ? 'dark' : 'light'); // Initialize from context
  const [selectedAccent, setSelectedAccent] = useState('#22c55e');
  const [saving, setSaving] = useState(false);

  // Accent color options
  const accentColors = [
    { id: 'green', color: '#22c55e', name: 'Green' },
    { id: 'yellow', color: '#f7c236', name: 'Yellow' },
    { id: 'pink', color: '#ec4899', name: 'Pink' },
    { id: 'orange', color: '#ff6347', name: 'Orange' },
  ];

  // Theme options
  const themes = [
    { id: 'dark', name: 'Dark', bgColor: 'bg-black', borderColor: 'border-transparent' },
    { id: 'light', name: 'Light', bgColor: 'bg-white/30', borderColor: 'border-black/20' },
    { id: 'auto', name: 'Light Dark', bgColor: 'bg-neutral-700', borderColor: 'border-transparent' },
  ];

  useEffect(() => {
    fetchUserPreferences();
  }, []);

  // Sync with dark mode context
  useEffect(() => {
    if (isDarkMode) {
      setSelectedTheme('dark');
    } else {
      setSelectedTheme('light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Apply accent color immediately when it changes (for preview)
    document.documentElement.style.setProperty('--accent-color', selectedAccent);
    
    // Optional: You can also map specific accent colors to standard Tailwind colors if you want
    // to override the 'amber' look dynamically, but that requires significant CSS overrides.
    // For now, we ensure the CSS variable is set.
  }, [selectedAccent]);

  // Fetch user preferences from API
  const fetchUserPreferences = async () => {
    try {
      const response = await axios.get(
        API_ENDPOINTS.GET_APPEARANCE_SETTINGS,
        { withCredentials: true }
      );

      if (response.data.success) {
        const { theme, accentColor } = response.data.data;
        setSelectedTheme(theme || 'light');
        setSelectedAccent(accentColor || '#22c55e');
        
        // REMOVE the direct DOM manipulation - let the context handle it
        // Instead, sync with context only if there's a mismatch
        const shouldBeDark = theme === 'dark';
        if (shouldBeDark !== isDarkMode) {
          toggleDarkMode();
        }
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  // Handle theme selection
  const handleThemeSelect = (themeId) => {
    setSelectedTheme(themeId);
    
    // Update dark mode context
    if (themeId === 'dark') {
      if (!isDarkMode) toggleDarkMode();
    } else if (themeId === 'light') {
      if (isDarkMode) toggleDarkMode();
    }
  };

  // Handle accent color selection
  const handleAccentSelect = (color) => {
    setSelectedAccent(color);
  };

  // Save preferences
  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await axios.post(
        API_ENDPOINTS.UPDATE_APPEARANCE_SETTINGS,
        {
          theme: selectedTheme,
          accentColor: selectedAccent,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Appearance settings saved!');
        
        // Apply accent color to root
        document.documentElement.style.setProperty('--accent-color', selectedAccent);
      } else {
        toast.error(response.data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="bg-white dark:bg-gray-800 rounded-[35px] border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-8">
          Appearances Settings
        </h2>

        {/* Theme Section */}
        <div className="mb-12">
          <h3 className="text-base font-bold text-gray-800 dark:text-white mb-6">Theme</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                className={`relative group transition-all duration-200 ${
                  selectedTheme === theme.id ? 'scale-105' : 'hover:scale-102'
                }`}
              >
                {/* Theme Preview Card */}
                <div
                  className={`h-[214px] rounded-[30px] ${theme.bgColor} border-2 ${
                    selectedTheme === theme.id
                      ? 'border-amber-400 shadow-lg'
                      : theme.borderColor
                  } transition-all duration-200`}
                />
                
                {/* Theme Label */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedTheme === theme.id
                        ? 'border-amber-400 bg-amber-400'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                    }`}
                  >
                    {selectedTheme === theme.id && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="font-bold text-base text-gray-800 dark:text-white">
                    {theme.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Accent Color Section */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-gray-800 dark:text-white mb-6">Accent Color</h3>
          <div className="flex items-center gap-6">
            {accentColors.map((accent) => (
              <button
                key={accent.id}
                onClick={() => handleAccentSelect(accent.color)}
                className={`relative group transition-all duration-200 ${
                  selectedAccent === accent.color ? 'scale-110' : 'hover:scale-105'
                }`}
                title={accent.name}
              >
                <div
                  className={`w-[68px] h-[68px] rounded-full transition-all duration-200 ${
                    selectedAccent === accent.color
                      ? 'ring-4 ring-amber-400 ring-offset-4 dark:ring-offset-gray-800'
                      : 'hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600 hover:ring-offset-2 dark:hover:ring-offset-gray-800'
                  }`}
                  style={{ backgroundColor: accent.color }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-4 bg-gradient-to-b from-[#f4d77d] to-[#f7c236] rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="font-bold text-lg text-white">
              {saving ? 'Saving...' : 'Change'}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
