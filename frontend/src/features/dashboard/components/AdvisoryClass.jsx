import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../../config/api';

const { GET_ADVISORY_CLASSES } = API_ENDPOINTS;

const AdvisoryClass = () => {
  const navigate = useNavigate();
  const [advisoryClasses, setAdvisoryClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdvisoryClasses = async () => {
      try {
        const response = await axios.get(
          GET_ADVISORY_CLASSES,
          { withCredentials: true }
        );
        
        if (response.data.success) {
          setAdvisoryClasses(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching advisory classes:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisoryClasses();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Advisory Class
          </h2>
        </div>
        <div className="flex items-center justify-center py-8 px-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Advisory Class
        </h2>
      </div>
      
      {error && (
        <div className="px-6 pb-4">
          <div className="text-red-500 text-sm">
            Error loading advisory classes
          </div>
        </div>
      )}
      
      {advisoryClasses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center px-6 pb-6">
          <Users className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" />
          <p className="text-gray-500 dark:text-gray-400">
            No advisory class assigned
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            You will be notified when assigned as a class adviser
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            {/* Table Header */}
            <thead className="bg-[#F3D67D] dark:bg-yellow-700/80">
              <tr>
                <th
                  scope="col"
                  className="py-3 px-6 text-left text-sm font-semibold text-gray-800 dark:text-gray-900"
                >
                  Grade Level
                </th>
                <th
                  scope="col"
                  className="py-3 px-6 text-left text-sm font-semibold text-gray-800 dark:text-gray-900"
                >
                  Section
                </th>
                <th scope="col" className="relative py-3 px-6">
                  <span className="sr-only">Details</span>
                </th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {advisoryClasses.map((item) => (
                <tr key={item.id}>
                  <td className="whitespace-nowrap py-4 px-6 text-sm text-gray-700 dark:text-gray-300">
                    {item.grade}
                  </td>
                  <td className="whitespace-nowrap py-4 px-6 text-sm text-gray-700 dark:text-gray-300">
                    {item.section}
                  </td>
                  <td className="whitespace-nowrap py-4 px-6 text-right text-sm">
                    <button
                      onClick={() => navigate('/teacher-dashboard/my-classes/')}
                      className="font-medium text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 transition-colors"
                    >
                      View Class Details &gt;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdvisoryClass;