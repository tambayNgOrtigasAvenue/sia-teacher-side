import React from 'react';

// Placeholder data
const advisoryClassData = [
  {
    id: 1,
    grade: 'Grade 6',
    section: 'Section A',
  },
  {
    id: 2,
    grade: 'Grade 6',
    section: 'Section B',
  },
];

const AdvisoryClass = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm h-full overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Advisory Class
        </h2>
      </div>
      
      {/* Table structure */}
      <div className="flow-root">
        <div className="-mx-6 -my-2 overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle px-6">
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
              <tbody className="bg-white dark:bg-gray-800">
                {advisoryClassData.map((item) => (
                  <tr key={item.id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="whitespace-nowrap py-4 px-6 text-sm text-gray-700 dark:text-gray-300">
                      {item.grade}
                    </td>
                    <td className="whitespace-nowrap py-4 px-6 text-sm text-gray-700 dark:text-gray-300">
                      {item.section}
                    </td>
                    <td className="whitespace-nowrap py-4 px-6 text-right text-sm">
                      <a
                        href="#"
                        className="font-medium text-yellow-600 dark:text-yellow-400 hover:text-yellow-800"
                      >
                        View Class Details &gt;
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisoryClass;