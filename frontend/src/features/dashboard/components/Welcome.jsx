import React from 'react';
import { useAuth } from '../../../context/AuthContext';

const Welcome = () => {
  const { user } = useAuth();
  
  return (
    <div className="w-full bg-yellow-300/70 dark:bg-yellow-800/60 p-6 rounded-xl shadow-sm">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Welcome back,
      </h1>
      <p className="text-xl text-gray-700 dark:text-gray-200">
        {user?.fullName || 'Teacher'}!
      </p>
    </div>
  );
};

export default Welcome;