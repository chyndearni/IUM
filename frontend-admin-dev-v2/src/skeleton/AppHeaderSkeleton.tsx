"use client";

import React from "react";

// ========================
// USER DROPDOWN SKELETON WITH SHIMMER EFFECT
// ========================
const AppHeaderSkeleton: React.FC = () => {
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

  return (
    <>
      <button className="flex items-center text-gray-700 dark:text-gray-400 cursor-not-allowed">
        {/* Avatar Skeleton */}
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <ShimmerBox width="w-full" height="h-full" rounded="rounded-full" />
        </span>

        {/* User Info Skeleton */}
        <div className="flex flex-col items-start mr-1 space-y-1">
          {/* Name Skeleton */}
          <ShimmerBox width="w-20" height="h-4" />
          {/* Role Skeleton */}
          <ShimmerBox width="w-16" height="h-3" />
        </div>

        {/* Chevron Icon Skeleton */}
        <ShimmerBox width="w-[18px]" height="h-5" />
      </button>

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

export default AppHeaderSkeleton;
