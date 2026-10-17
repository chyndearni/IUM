import React from "react";

const JobFormSkeleton = () => {
  // Shimmer animation component
  const Shimmer = ({ className = "" }: { className?: string }) => (
    <div
      className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse bg-[length:200%_100%] ${className}`}
      style={{
        animation: "shimmer 2s infinite linear",
      }}
    />
  );

  // Skeleton input field
  const SkeletonInput = ({ width = "w-full" }: { width?: string }) => (
    <div className="space-y-2">
      <Shimmer className={`h-4 ${width} rounded`} />
      <Shimmer className="h-10 w-full rounded-lg" />
    </div>
  );

  // Skeleton textarea
  const SkeletonTextarea = ({ rows = 4 }: { rows?: number }) => (
    <div className="space-y-2">
      <Shimmer className="h-4 w-1/3 rounded" />
      <Shimmer className={`h-${rows * 6} w-full rounded-lg`} />
    </div>
  );

  // Skeleton checkbox group
  const SkeletonCheckboxGroup = () => (
    <div className="space-y-4">
      <Shimmer className="h-4 w-2/3 rounded" />
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
        >
          <Shimmer className="h-4 w-1/4 rounded mb-3" />
          <div className="space-y-2">
            {[1, 2].map((subItem) => (
              <div key={subItem} className="flex items-center space-x-3 p-2">
                <Shimmer className="w-4 h-4 rounded" />
                <Shimmer className="h-4 w-20 rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // Skeleton skills section
  const SkeletonSkills = () => (
    <div className="space-y-3">
      <Shimmer className="h-4 w-1/3 rounded" />
      <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
        {[1, 2, 3, 4].map((item) => (
          <Shimmer key={item} className="h-8 w-20 rounded-full" />
        ))}
      </div>
      <Shimmer className="h-4 w-1/2 rounded" />
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Shimmer key={item} className="h-8 w-16 rounded-full" />
        ))}
      </div>
    </div>
  );

  return (
    <>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-full mx-auto py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            {/* Header Skeleton */}
            <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white p-6 rounded-t-lg">
              <div className="flex items-center space-x-3">
                <Shimmer className="w-8 h-8 rounded bg-brand-500" />
                <div className="space-y-2">
                  <Shimmer className="h-8 w-48 rounded bg-brand-500" />
                  <Shimmer className="h-4 w-64 rounded bg-brand-400" />
                </div>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Basic Job Information Section */}
              <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Shimmer className="w-5 h-5 rounded" />
                  <Shimmer className="h-6 w-48 rounded" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SkeletonInput width="w-3/4" />
                  <SkeletonInput width="w-2/3" />
                  <div className="space-y-3">
                    <Shimmer className="h-4 w-1/3 rounded" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="relative">
                        <Shimmer className="h-10 w-full rounded-lg" />
                        <Shimmer className="absolute -top-2 left-3 h-3 w-12 rounded" />
                      </div>
                      <div className="relative">
                        <Shimmer className="h-10 w-full rounded-lg" />
                        <Shimmer className="absolute -top-2 left-3 h-3 w-16 rounded" />
                      </div>
                    </div>
                    <Shimmer className="h-4 w-32 rounded" />
                    <Shimmer className="h-3 w-full rounded" />
                  </div>
                  <SkeletonInput width="w-1/2" />
                  <SkeletonInput width="w-3/4" />
                  <SkeletonInput width="w-2/3" />
                  <SkeletonInput width="w-3/4" />
                </div>
              </section>

              {/* Disability Types Section */}
              <section className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Shimmer className="w-5 h-5 rounded" />
                    <Shimmer className="h-6 w-64 rounded" />
                  </div>
                  <Shimmer className="h-4 w-16 rounded" />
                </div>

                <SkeletonCheckboxGroup />
              </section>

              {/* Work Accommodations Section */}
              <section className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Shimmer className="w-5 h-5 rounded" />
                  <Shimmer className="h-6 w-40 rounded" />
                </div>

                <SkeletonTextarea rows={4} />

                <div className="mt-4">
                  <SkeletonTextarea rows={3} />
                </div>
              </section>

              {/* Job Description Section */}
              <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <Shimmer className="h-6 w-40 rounded mb-4" />
                <SkeletonTextarea rows={6} />
              </section>

              {/* Requirements Section */}
              <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <Shimmer className="h-6 w-32 rounded mb-4" />
                <SkeletonTextarea rows={8} />
              </section>

              {/* Responsibilities Section */}
              <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <Shimmer className="h-6 w-36 rounded mb-4" />
                <SkeletonTextarea rows={8} />
              </section>

              {/* Benefits Section */}
              <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <Shimmer className="h-6 w-44 rounded mb-4" />
                <SkeletonTextarea rows={8} />
              </section>

              {/* Skills Section */}
              <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <Shimmer className="h-6 w-52 rounded mb-4" />
                <SkeletonSkills />
              </section>

              {/* Submit Buttons Section */}
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <Shimmer className="h-12 w-32 rounded-lg" />
                  <Shimmer className="h-12 w-40 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobFormSkeleton;
