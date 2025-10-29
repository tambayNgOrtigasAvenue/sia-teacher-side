import React, { useState, useEffect } from 'react';
import AnnouncementPage from './announcementPage.jsx';

/**
 * AnnouncementContainer Component
 * 
 * Container component that manages announcement data state.
 * In production, this would fetch data from the API.
 * 
 * DATABASE INTEGRATION POINT:
 * Replace mockAnnouncements with API call to backend
 */
export default function AnnouncementContainer() {
  // State for announcements data
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Mock Announcements Data
   * 
   * In production, replace this with API call:
   * useEffect(() => {
   *   fetch('/api/announcements')
   *     .then(res => res.json())
   *     .then(data => {
   *       setAnnouncements(data);
   *       setLoading(false);
   *     })
   *     .catch(err => {
   *       setError(err.message);
   *       setLoading(false);
   *     });
   * }, []);
   */
  useEffect(() => {
    // Simulate API call with setTimeout
    const mockAnnouncements = [
      {
        id: 1,
        title: 'Suspension of Classes',
        description: 'Copy that provides context about what is being shown in this modal. Give specific instruction if needed and be messaging to what users value.',
        imageUrl: 'https://placehold.co/600x400/333/FFF?text=Enrollment',
        facebookUrl: 'https://facebook.com'
      },
      {
        id: 2,
        title: 'Suspension of Classes',
        description: 'Copy that provides context about what is being shown in this modal. Give specific instruction if needed and be messaging to what users value.',
        imageUrl: 'https://placehold.co/600x400/333/FFF?text=Enrollment',
        facebookUrl: 'https://facebook.com'
      },
      {
        id: 3,
        title: 'Suspension of Classes',
        description: 'Copy that provides context about what is being shown in this modal. Give specific instruction if needed and be messaging to what users value.',
        imageUrl: 'https://placehold.co/600x400/333/FFF?text=Enrollment',
        facebookUrl: 'https://facebook.com'
      },
      {
        id: 4,
        title: 'Enrollment Ongoing',
        description: 'We are now accepting enrollments for the upcoming school year. Get 10% discount for early bird registrations. Limited slots available.',
        imageUrl: 'https://placehold.co/600x400/F59E0B/FFF?text=Enrollment',
        facebookUrl: 'https://facebook.com'
      },
      {
        id: 5,
        title: 'Sports Fest 2025',
        description: 'Join us for our annual Sports Fest! Various sports competitions and team-building activities for all grade levels. Parents are welcome to attend.',
        imageUrl: 'https://placehold.co/600x400/10B981/FFF?text=Sports+Fest',
        facebookUrl: 'https://facebook.com'
      },
      {
        id: 6,
        title: 'Parent-Teacher Conference',
        description: 'Schedule your one-on-one meeting with your child\'s teachers. Discuss progress reports and academic concerns. Sign up at the school office.',
        imageUrl: 'https://placehold.co/600x400/3B82F6/FFF?text=PTC',
        facebookUrl: 'https://facebook.com'
      }
    ];

    // Simulate loading delay
    setTimeout(() => {
      setAnnouncements(mockAnnouncements);
      setLoading(false);
    }, 500);
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
          <p className="mt-4 text-gray-600">Loading announcements...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium">Error loading announcements</p>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // Render AnnouncementPage with data
  return <AnnouncementPage announcements={announcements} />;
}
