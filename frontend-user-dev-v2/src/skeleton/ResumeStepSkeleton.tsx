"use client";

import React from "react";

// ========================
// RESUME STEP SKELETON WITH SHIMMER EFFECT
// ========================
const ResumeStepSkeleton: React.FC = () => {
  const ShimmerBox: React.FC<{
    width?: string;
    height?: string;
    className?: string;
    rounded?: string;
  }> = ({
    width = "w-full",
    height = "h-4",
    className = "",
    rounded = "rounded",
  }) => (
    <div
      className={`${width} ${height} ${rounded} relative overflow-hidden bg-gray-200 dark:bg-gray-700 ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </div>
  );

  // Step card skeleton
  const StepCardSkeleton: React.FC<{ isActive?: boolean }> = ({
    isActive = false,
  }) => (
    <div className="group cursor-pointer">
      <div
        className={`
        relative p-3 sm:p-4 rounded-2xl border-2 transition-all duration-300
        ${
          isActive
            ? "bg-gradient-to-br from-blue-500 to-purple-600 border-transparent shadow-xl"
            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        }
      `}
      >
        {/* Icon Skeleton */}
        <div className="flex justify-center mb-2 sm:mb-3">
          <div
            className={`
            p-2 sm:p-3 rounded-xl
            ${
              isActive
                ? "bg-white/20 backdrop-blur-sm"
                : "bg-gray-100 dark:bg-gray-700"
            }
          `}
          >
            <ShimmerBox
              width="w-5 h-5 sm:w-6 sm:h-6"
              height=""
              rounded="rounded"
            />
          </div>
        </div>

        {/* Title Skeleton */}
        <div className="flex justify-center mb-2">
          <ShimmerBox width="w-16 sm:w-20" height="h-3 sm:h-4" />
        </div>

        {/* Step Number Badge Skeleton */}
        <div
          className={`
          absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center
          ${isActive ? "bg-yellow-400" : "bg-gray-300 dark:bg-gray-600"}
        `}
        >
          <ShimmerBox
            width="w-2 h-2 sm:w-3 sm:h-3"
            height=""
            rounded="rounded-full"
          />
        </div>

        {/* Active indicator */}
        {isActive && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 to-purple-600/20 animate-pulse" />
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="transition-all duration-300">
        <div className="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="mb-12 text-center mx-auto">
            {/* Title Skeleton */}
            <div className="flex justify-center mb-4">
              <ShimmerBox width="w-80" height="h-10" rounded="rounded-lg" />
            </div>

            {/* Description Skeleton */}
            <div className="flex justify-center mb-6">
              <ShimmerBox width="w-64" height="h-6" rounded="rounded" />
            </div>

            {/* Progress Bar Skeleton */}
            <div className="max-w-xl mx-auto">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full w-1/3"></div>
              </div>

              {/* Progress Text Skeleton */}
              <div className="flex justify-center">
                <ShimmerBox width="w-20" height="h-4" />
              </div>
            </div>
          </div>

          {/* Step Indicator Skeleton */}
          <div className="w-full mx-auto mb-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {/* Render 10 step cards */}
              {Array.from({ length: 10 }).map((_, index) => (
                <StepCardSkeleton key={index} isActive={index === 2} />
              ))}
            </div>
          </div>

          {/* Step Content Skeleton */}
          <div className="w-full mx-auto">
            {/* Form Content Skeleton */}
            <div className="mb-12">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
                {/* Form Title */}
                <div className="flex justify-center mb-6">
                  <ShimmerBox width="w-48" height="h-8" rounded="rounded-lg" />
                </div>

                {/* Form Fields */}
                <div className="space-y-6">
                  {/* Field 1 */}
                  <div>
                    <ShimmerBox width="w-24" height="h-5" className="mb-2" />
                    <ShimmerBox
                      width="w-full"
                      height="h-12"
                      rounded="rounded-lg"
                    />
                  </div>

                  {/* Field 2 */}
                  <div>
                    <ShimmerBox width="w-32" height="h-5" className="mb-2" />
                    <ShimmerBox
                      width="w-full"
                      height="h-12"
                      rounded="rounded-lg"
                    />
                  </div>

                  {/* Field 3 - Two columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <ShimmerBox width="w-20" height="h-5" className="mb-2" />
                      <ShimmerBox
                        width="w-full"
                        height="h-12"
                        rounded="rounded-lg"
                      />
                    </div>
                    <div>
                      <ShimmerBox width="w-28" height="h-5" className="mb-2" />
                      <ShimmerBox
                        width="w-full"
                        height="h-12"
                        rounded="rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Field 4 - Textarea */}
                  <div>
                    <ShimmerBox width="w-36" height="h-5" className="mb-2" />
                    <ShimmerBox
                      width="w-full"
                      height="h-32"
                      rounded="rounded-lg"
                    />
                  </div>

                  {/* Additional Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index}>
                        <ShimmerBox
                          width="w-16"
                          height="h-5"
                          className="mb-2"
                        />
                        <ShimmerBox
                          width="w-full"
                          height="h-12"
                          rounded="rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons in Form */}
                <div className="flex justify-end mt-8 space-x-3">
                  <ShimmerBox width="w-24" height="h-10" rounded="rounded-lg" />
                  <ShimmerBox width="w-28" height="h-10" rounded="rounded-lg" />
                </div>
              </div>
            </div>

            {/* Navigation Buttons Skeleton */}
            <div className="flex justify-between items-center">
              {/* Previous Button */}
              <div className="flex items-center px-4 py-2 sm:px-6 sm:py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-md">
                <ShimmerBox
                  width="w-4 h-4 sm:w-5 sm:h-5"
                  height=""
                  rounded="rounded"
                  className="mr-1 sm:mr-2"
                />
                <ShimmerBox width="w-12 sm:w-16" height="h-4 sm:h-5" />
              </div>

              {/* Next Button */}
              <div className="flex items-center px-4 py-2 sm:px-6 sm:py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 shadow-md">
                <ShimmerBox
                  width="w-8 sm:w-12"
                  height="h-4 sm:h-5"
                  className="mr-1 sm:mr-2"
                />
                <ShimmerBox
                  width="w-4 h-4 sm:w-5 sm:h-5"
                  height=""
                  rounded="rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shimmer Animation CSS */}
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </>
  );
};

export default ResumeStepSkeleton;
