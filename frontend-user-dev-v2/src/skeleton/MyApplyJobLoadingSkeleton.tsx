import React from "react";

// Base Skeleton Component
interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  animate = true,
}) => {
  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 rounded ${
        animate ? "animate-pulse" : ""
      } ${className}`}
    />
  );
};

// Application Card Skeleton
const ApplicationCardSkeleton: React.FC<{ animate?: boolean }> = ({
  animate = true,
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      {/* Header with Status */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 flex-1">
          {/* Company Logo */}
          <div className="relative">
            <Skeleton className="w-12 h-12 rounded-lg" animate={animate} />
            {/* Disability indicator placeholder */}
            <div className="absolute -bottom-1 -right-1">
              <Skeleton className="w-5 h-5 rounded-full" animate={animate} />
            </div>
          </div>

          {/* Job Info */}
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-5 w-3/4" animate={animate} />
            <Skeleton className="h-4 w-1/2" animate={animate} />
            <Skeleton className="h-3 w-1/3" animate={animate} />
          </div>
        </div>

        {/* Status Badge */}
        <Skeleton className="h-7 w-20 rounded-full" animate={animate} />
      </div>

      {/* Job Details */}
      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Skeleton className="w-4 h-4 rounded" animate={animate} />
            <Skeleton className="h-4 w-32" animate={animate} />
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton
            key={index}
            className="h-6 w-16 rounded-full"
            animate={animate}
          />
        ))}
      </div>

      {/* Disability Support Section */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="w-4 h-4 rounded" animate={animate} />
          <Skeleton className="h-4 w-32" animate={animate} />
        </div>
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: 2 }, (_, index) => (
            <Skeleton
              key={index}
              className="h-5 w-20 rounded-full"
              animate={animate}
            />
          ))}
        </div>
      </div>

      {/* Status Timeline */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
        <Skeleton className="h-4 w-24" animate={animate} />
        <div className="space-y-2">
          {Array.from({ length: 2 }, (_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Skeleton className="w-2 h-2 rounded-full" animate={animate} />
              <Skeleton className="h-3 w-40" animate={animate} />
            </div>
          ))}
        </div>
      </div>

      {/* Special Notification Placeholder */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
        <div className="flex items-start space-x-2">
          <Skeleton className="w-4 h-4 rounded mt-0.5" animate={animate} />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" animate={animate} />
            <Skeleton className="h-3 w-full" animate={animate} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3 pt-4 border-t border-gray-100 dark:border-gray-700">
        <Skeleton className="h-10 flex-1 rounded-lg" animate={animate} />
      </div>
    </div>
  );
};

// Sidebar Skeleton
const SidebarSkeleton: React.FC<{ animate?: boolean }> = ({
  animate = true,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
      {/* Title */}
      <Skeleton className="h-6 w-32" animate={animate} />

      {/* Search Bar */}
      <div className="relative">
        <Skeleton className="h-10 w-full rounded-lg" animate={animate} />
      </div>

      {/* Filter Options */}
      <div className="space-y-2">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="flex items-center justify-between p-3">
            <div className="flex items-center space-x-2">
              <Skeleton className="w-4 h-4 rounded" animate={animate} />
              <Skeleton className="h-4 w-20" animate={animate} />
            </div>
            <Skeleton className="h-5 w-6 rounded-full" animate={animate} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Header Skeleton
const HeaderSkeleton: React.FC<{ animate?: boolean }> = ({
  animate = true,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" animate={animate} />
          <Skeleton className="h-5 w-80" animate={animate} />
        </div>
        <Skeleton className="h-5 w-32" animate={animate} />
      </div>
    </div>
  );
};

// Stats Card Skeleton
const StatsCardSkeleton: React.FC<{ animate?: boolean }> = ({
  animate = true,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="w-5 h-5 rounded" animate={animate} />
          <Skeleton className="h-4 w-16" animate={animate} />
        </div>
        <Skeleton className="h-6 w-8" animate={animate} />
      </div>
    </div>
  );
};

// Empty State Skeleton
const EmptyStateSkeleton: React.FC<{ animate?: boolean }> = ({
  animate = true,
}) => {
  return (
    <div className="text-center py-12 space-y-4">
      <Skeleton className="w-24 h-24 rounded-full mx-auto" animate={animate} />
      <Skeleton className="h-6 w-64 mx-auto" animate={animate} />
      <Skeleton className="h-4 w-80 mx-auto" animate={animate} />
      <Skeleton className="h-10 w-32 mx-auto rounded-lg" animate={animate} />
    </div>
  );
};

// Main Loading Skeleton Component
export const MyApplyJobLoadingSkeleton: React.FC<{ animate?: boolean }> = ({
  animate = true,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <HeaderSkeleton animate={animate} />

      {/* Stats Cards Row (Optional - if you want to add stats) */}
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }, (_, index) => (
          <StatsCardSkeleton key={index} animate={animate} />
        ))}
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <SidebarSkeleton animate={animate} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }, (_, index) => (
              <ApplicationCardSkeleton key={index} animate={animate} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Alternative: Loading with different card counts
export const MyApplyJobLoadingSkeletonSmall: React.FC<{
  animate?: boolean;
}> = ({ animate = true }) => {
  return (
    <div className="space-y-6">
      <HeaderSkeleton animate={animate} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <SidebarSkeleton animate={animate} />
        </div>

        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }, (_, index) => (
              <ApplicationCardSkeleton key={index} animate={animate} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Alternative: Empty state skeleton
export const MyApplyJobEmptyStateSkeleton: React.FC<{ animate?: boolean }> = ({
  animate = true,
}) => {
  return (
    <div className="space-y-6">
      <HeaderSkeleton animate={animate} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <SidebarSkeleton animate={animate} />
        </div>

        <div className="lg:col-span-3">
          <EmptyStateSkeleton animate={animate} />
        </div>
      </div>
    </div>
  );
};
