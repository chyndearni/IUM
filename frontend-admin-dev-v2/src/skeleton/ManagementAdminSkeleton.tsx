import React from "react";

const ManagementAdminSkeleton: React.FC = () => {
  // Skeleton shimmer animation class
  const shimmerClass =
    "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6">
        <div className={`h-6 w-64 rounded ${shimmerClass}`}></div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Header Section Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <div className={`h-8 w-48 rounded mb-2 ${shimmerClass}`}></div>
              <div className={`h-4 w-64 rounded ${shimmerClass}`}></div>
            </div>
            <div className={`h-10 w-32 rounded-lg ${shimmerClass}`}></div>
          </div>
        </div>

        {/* Filter and Search Section Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className={`h-10 w-full rounded-lg ${shimmerClass}`}></div>
            </div>
            <div className="w-full sm:w-40">
              <div className={`h-10 w-full rounded-lg ${shimmerClass}`}></div>
            </div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6"
            >
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-lg ${shimmerClass}`}></div>
                <div className="ml-3 sm:ml-4 flex-1">
                  <div
                    className={`h-4 w-20 rounded mb-2 ${shimmerClass}`}
                  ></div>
                  <div className={`h-8 w-12 rounded ${shimmerClass}`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Section Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {/* Mobile Card View Skeleton */}
          <div className="block lg:hidden">
            <div className="space-y-4 p-4">
              {[1, 2, 3, 4, 5].map((index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`h-10 w-10 rounded-full ${shimmerClass}`}
                      ></div>
                      <div>
                        <div
                          className={`h-4 w-24 rounded mb-2 ${shimmerClass}`}
                        ></div>
                        <div
                          className={`h-6 w-16 rounded-full ${shimmerClass}`}
                        ></div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className={`h-8 w-8 rounded ${shimmerClass}`}></div>
                      <div className={`h-8 w-8 rounded ${shimmerClass}`}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className={`h-4 w-48 rounded ${shimmerClass}`}></div>
                    <div className={`h-4 w-36 rounded ${shimmerClass}`}></div>
                    <div className={`h-4 w-28 rounded ${shimmerClass}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Table View Skeleton */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <div className={`h-4 w-12 rounded ${shimmerClass}`}></div>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <div className={`h-4 w-12 rounded ${shimmerClass}`}></div>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <div className={`h-4 w-16 rounded ${shimmerClass}`}></div>
                  </th>
                  <th className="px-6 py-3 text-left">
                    <div className={`h-4 w-12 rounded ${shimmerClass}`}></div>
                  </th>
                  <th className="px-6 py-3 text-right">
                    <div
                      className={`h-4 w-8 rounded ml-auto ${shimmerClass}`}
                    ></div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`h-10 w-10 rounded-full ${shimmerClass}`}
                        ></div>
                        <div className="ml-4">
                          <div
                            className={`h-4 w-24 rounded mb-2 ${shimmerClass}`}
                          ></div>
                          <div
                            className={`h-3 w-32 rounded ${shimmerClass}`}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`h-6 w-16 rounded-full ${shimmerClass}`}
                      ></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`h-4 w-20 rounded mb-1 ${shimmerClass}`}
                      ></div>
                      <div className={`h-3 w-16 rounded ${shimmerClass}`}></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`h-4 w-20 rounded ${shimmerClass}`}></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-3">
                        <div
                          className={`h-4 w-4 rounded ${shimmerClass}`}
                        ></div>
                        <div
                          className={`h-4 w-4 rounded ${shimmerClass}`}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Skeleton */}
          <div className="px-4 sm:px-6 py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className={`h-4 w-48 rounded ${shimmerClass}`}></div>
              <div className="flex gap-2">
                <div className={`h-8 w-20 rounded ${shimmerClass}`}></div>
                <div className={`h-8 w-16 rounded ${shimmerClass}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementAdminSkeleton;
