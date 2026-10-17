import React from "react";

const CVLoadingSkeleton = () => {
  const shimmerClasses =
    "animate-pulse bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]";

  return (
    <div className="min-h-screen dark:bg-gray-900 py-8">
      {/* Export Button Skeleton */}
      <div className="flex items-center justify-start mb-6 max-w-4xl gap-3">
        <div className={`${shimmerClasses} h-12 w-36 rounded-lg`}></div>
        <div className={`${shimmerClasses} h-12 w-28 rounded-lg`}></div>
      </div>

      {/* CV Container */}
      <div className="w-full mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
        {/* Header Section Skeleton */}
        <div className="bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Image Skeleton */}
            <div
              className={`w-40 h-40 rounded-2xl ${shimmerClasses} border-4 border-white/20`}
            ></div>

            {/* Header Info Skeleton */}
            <div className="flex-1 text-center md:text-left w-full">
              <div className="mb-4">
                {/* Name Skeleton */}
                <div
                  className={`${shimmerClasses} h-10 w-64 mx-auto md:mx-0 mb-3 rounded`}
                ></div>
                {/* Description Skeleton */}
                <div
                  className={`${shimmerClasses} h-4 w-full mb-2 rounded`}
                ></div>
                <div
                  className={`${shimmerClasses} h-4 w-3/4 mx-auto md:mx-0 rounded`}
                ></div>
              </div>

              {/* Contact Info Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <div className={`${shimmerClasses} w-4 h-4 rounded`}></div>
                  <div className={`${shimmerClasses} h-4 w-32 rounded`}></div>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <div className={`${shimmerClasses} w-4 h-4 rounded`}></div>
                  <div className={`${shimmerClasses} h-4 w-28 rounded`}></div>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <div
                    className={`${shimmerClasses} h-6 w-24 rounded-full`}
                  ></div>
                  <div
                    className={`${shimmerClasses} h-6 w-20 rounded-full`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Section Skeleton Template */}
          {[...Array(6)].map((_, sectionIndex) => (
            <section key={sectionIndex}>
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`${shimmerClasses} w-6 h-6 rounded`}></div>
                <div className={`${shimmerClasses} h-8 w-48 rounded`}></div>
              </div>

              {/* Section Content */}
              {sectionIndex === 0 ? (
                // Personal Summary - Single paragraph
                <div className="space-y-2">
                  <div className={`${shimmerClasses} h-4 w-full rounded`}></div>
                  <div className={`${shimmerClasses} h-4 w-5/6 rounded`}></div>
                  <div className={`${shimmerClasses} h-4 w-4/5 rounded`}></div>
                </div>
              ) : sectionIndex === 1 ? (
                // Personal Data - Grid layout
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2">
                      <div
                        className={`${shimmerClasses} h-4 w-24 rounded`}
                      ></div>
                      <div
                        className={`${shimmerClasses} h-4 w-32 rounded`}
                      ></div>
                    </div>
                  ))}
                </div>
              ) : sectionIndex === 2 ? (
                // Address - Complex grid
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, itemIndex) => (
                    <div key={itemIndex}>
                      <div className="flex items-start gap-2 mb-2">
                        <div
                          className={`${shimmerClasses} h-4 w-32 rounded`}
                        ></div>
                        <div
                          className={`${shimmerClasses} h-4 w-20 rounded`}
                        ></div>
                      </div>
                      {itemIndex >= 2 && (
                        <div className="space-y-1">
                          <div
                            className={`${shimmerClasses} h-3 w-40 rounded`}
                          ></div>
                          <div
                            className={`${shimmerClasses} h-3 w-36 rounded`}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : sectionIndex === 3 || sectionIndex === 4 ? (
                // Experience & Education - Timeline items
                <div className="space-y-6">
                  {[...Array(2)].map((_, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="border-l-4 border-gray-200 dark:border-gray-600 pl-6"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <div
                          className={`${shimmerClasses} h-6 w-48 rounded`}
                        ></div>
                        <div
                          className={`${shimmerClasses} h-4 w-32 rounded mt-2 md:mt-0`}
                        ></div>
                      </div>
                      <div
                        className={`${shimmerClasses} h-5 w-40 rounded mb-1`}
                      ></div>
                      <div
                        className={`${shimmerClasses} h-4 w-56 rounded mb-2`}
                      ></div>
                      <div className="space-y-1">
                        <div
                          className={`${shimmerClasses} h-4 w-full rounded`}
                        ></div>
                        <div
                          className={`${shimmerClasses} h-4 w-4/5 rounded`}
                        ></div>
                        <div
                          className={`${shimmerClasses} h-4 w-3/5 rounded`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Skills section - Tag layout
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`${shimmerClasses} w-6 h-6 rounded`}
                      ></div>
                      <div
                        className={`${shimmerClasses} h-8 w-32 rounded`}
                      ></div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[72, 85, 64, 96, 78, 89, 67, 93].map(
                        (width, tagIndex) => (
                          <div
                            key={tagIndex}
                            className={`${shimmerClasses} h-7 rounded-full`}
                            style={{ width: `${width}px` }}
                          ></div>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`${shimmerClasses} w-6 h-6 rounded`}
                      ></div>
                      <div
                        className={`${shimmerClasses} h-8 w-24 rounded`}
                      ></div>
                    </div>
                    <div className="space-y-2">
                      {[...Array(3)].map((_, langIndex) => (
                        <div
                          key={langIndex}
                          className="flex justify-between items-center"
                        >
                          <div
                            className={`${shimmerClasses} h-4 w-20 rounded`}
                          ></div>
                          <div
                            className={`${shimmerClasses} h-4 w-16 rounded`}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>
          ))}

          {/* Additional sections skeleton */}
          {[...Array(3)].map((_, index) => (
            <section key={`extra-${index}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`${shimmerClasses} w-6 h-6 rounded`}></div>
                <div className={`${shimmerClasses} h-8 w-36 rounded`}></div>
              </div>
              <div className="space-y-4">
                {[...Array(2)].map((_, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="border-l-4 border-gray-200 dark:border-gray-600 pl-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
                      <div
                        className={`${shimmerClasses} h-5 w-44 rounded`}
                      ></div>
                      <div
                        className={`${shimmerClasses} h-4 w-28 rounded mt-1 md:mt-0`}
                      ></div>
                    </div>
                    <div
                      className={`${shimmerClasses} h-4 w-36 rounded mb-1`}
                    ></div>
                    <div
                      className={`${shimmerClasses} h-4 w-20 rounded mb-2`}
                    ></div>
                    <div className="space-y-1">
                      <div
                        className={`${shimmerClasses} h-3 w-full rounded`}
                      ></div>
                      <div
                        className={`${shimmerClasses} h-3 w-3/4 rounded`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Custom shimmer animation styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .animate-pulse {
          animation: shimmer 2s ease-in-out infinite;
          background: linear-gradient(
            90deg,
            rgba(229, 231, 235, 1) 25%,
            rgba(243, 244, 246, 1) 50%,
            rgba(229, 231, 235, 1) 75%
          );
          background-size: 200% 100%;
        }

        .dark .animate-pulse {
          background: linear-gradient(
            90deg,
            rgba(55, 65, 81, 1) 25%,
            rgba(75, 85, 99, 1) 50%,
            rgba(55, 65, 81, 1) 75%
          );
          background-size: 200% 100%;
        }

        @media print {
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
};

export default CVLoadingSkeleton;
