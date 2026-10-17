import React from "react";

// Base Skeleton Component
interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
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

// Skeleton Text Component
interface SkeletonTextProps {
  lines?: number;
  className?: string;
  animate?: boolean;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 1,
  className = "",
  animate = true,
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          className={`h-4 ${
            index === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
          }`}
          animate={animate}
        />
      ))}
    </div>
  );
};

// Skeleton Avatar Component
interface SkeletonAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "square" | "rounded";
  className?: string;
  animate?: boolean;
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = "md",
  shape = "circle",
  className = "",
  animate = true,
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  const shapeClasses = {
    circle: "rounded-full",
    square: "rounded-none",
    rounded: "rounded-lg",
  };

  return (
    <Skeleton
      className={`${sizeClasses[size]} ${shapeClasses[shape]} ${className}`}
      animate={animate}
    />
  );
};

// Skeleton Button Component
interface SkeletonButtonProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  animate?: boolean;
}

export const SkeletonButton: React.FC<SkeletonButtonProps> = ({
  size = "md",
  className = "",
  animate = true,
}) => {
  const sizeClasses = {
    sm: "h-8 w-20",
    md: "h-10 w-24",
    lg: "h-12 w-32",
  };

  return (
    <Skeleton
      className={`${sizeClasses[size]} rounded-lg ${className}`}
      animate={animate}
    />
  );
};

// Job Card Skeleton Component
interface JobCardSkeletonProps {
  animate?: boolean;
}

export const JobCardSkeleton: React.FC<JobCardSkeletonProps> = ({
  animate = true,
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start space-x-3">
        <SkeletonAvatar size="md" shape="rounded" animate={animate} />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" animate={animate} />
          <Skeleton className="h-4 w-1/2" animate={animate} />
        </div>
      </div>

      {/* Job Details */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded" animate={animate} />
          <Skeleton className="h-4 w-32" animate={animate} />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded" animate={animate} />
          <Skeleton className="h-4 w-40" animate={animate} />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded" animate={animate} />
          <Skeleton className="h-4 w-24" animate={animate} />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded" animate={animate} />
          <Skeleton className="h-4 w-36" animate={animate} />
        </div>
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

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
        <Skeleton className="h-6 w-20 rounded-full" animate={animate} />
        <Skeleton className="h-4 w-24" animate={animate} />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Skeleton className="h-10 flex-1 rounded-lg" animate={animate} />
        <Skeleton className="h-10 w-20 rounded-lg" animate={animate} />
      </div>
    </div>
  );
};

// Job List Skeleton Component
interface JobListSkeletonProps {
  count?: number;
  animate?: boolean;
}

export const JobListSkeleton: React.FC<JobListSkeletonProps> = ({
  count = 6,
  animate = true,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, index) => (
        <JobCardSkeleton key={index} animate={animate} />
      ))}
    </div>
  );
};

// Search Section Skeleton
export const SearchSectionSkeleton: React.FC<{ animate?: boolean }> = ({
  animate = true,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm space-y-4">
      {/* Search Bar */}
      <Skeleton className="h-12 w-full rounded-xl" animate={animate} />

      {/* Filter Button */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-32 rounded-lg" animate={animate} />
        <Skeleton className="h-6 w-40" animate={animate} />
      </div>
    </div>
  );
};

// Table Row Skeleton Component
interface TableRowSkeletonProps {
  columns?: number;
  animate?: boolean;
}

export const TableRowSkeleton: React.FC<TableRowSkeletonProps> = ({
  columns = 4,
  animate = true,
}) => {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      {Array.from({ length: columns }, (_, index) => (
        <td key={index} className="px-6 py-4">
          <Skeleton className="h-4 w-full" animate={animate} />
        </td>
      ))}
    </tr>
  );
};

// Table Skeleton Component
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  animate?: boolean;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  showHeader = true,
  animate = true,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <table className="w-full">
        {showHeader && (
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {Array.from({ length: columns }, (_, index) => (
                <th key={index} className="px-6 py-3">
                  <Skeleton className="h-4 w-20" animate={animate} />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {Array.from({ length: rows }, (_, index) => (
            <TableRowSkeleton key={index} columns={columns} animate={animate} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Profile Card Skeleton Component
export const ProfileCardSkeleton: React.FC<{ animate?: boolean }> = ({
  animate = true,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      {/* Header with Avatar */}
      <div className="flex items-center space-x-4">
        <SkeletonAvatar size="lg" animate={animate} />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-48" animate={animate} />
          <Skeleton className="h-4 w-32" animate={animate} />
          <Skeleton className="h-4 w-40" animate={animate} />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <SkeletonText lines={3} animate={animate} />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton
            key={index}
            className="h-6 w-16 rounded-full"
            animate={animate}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <SkeletonButton size="md" className="flex-1" animate={animate} />
        <SkeletonButton size="md" animate={animate} />
      </div>
    </div>
  );
};

// Stats Card Skeleton Component
interface StatsCardSkeletonProps {
  count?: number;
  animate?: boolean;
}

export const StatsCardSkeleton: React.FC<StatsCardSkeletonProps> = ({
  count = 4,
  animate = true,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-8 rounded-lg" animate={animate} />
            <Skeleton className="h-8 w-16" animate={animate} />
          </div>
          <Skeleton className="h-4 w-24" animate={animate} />
        </div>
      ))}
    </div>
  );
};

// Loading Page Skeleton Component
export const JobPageUserSkeleton: React.FC<{ animate?: boolean }> = ({
  animate = true,
}) => {
  return (
    <div className="space-y-6">
      {/* Search Section */}
      <SearchSectionSkeleton animate={animate} />

      {/* Stats Cards */}
      {/* <StatsCardSkeleton count={6} animate={animate} /> */}

      {/* Content */}
      <JobListSkeleton count={9} animate={animate} />
    </div>
  );
};

// Modal Skeleton Component
export const ModalSkeleton: React.FC<{ animate?: boolean }> = ({
  animate = true,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <SkeletonAvatar size="lg" shape="rounded" animate={animate} />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" animate={animate} />
            <Skeleton className="h-4 w-32" animate={animate} />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-lg" animate={animate} />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" animate={animate} />
            <div className="space-y-3">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="flex justify-between">
                  <Skeleton className="h-4 w-20" animate={animate} />
                  <Skeleton className="h-4 w-24" animate={animate} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" animate={animate} />
            <SkeletonText lines={4} animate={animate} />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-6 w-32" animate={animate} />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }, (_, index) => (
                <Skeleton
                  key={index}
                  className="h-6 w-16 rounded-full"
                  animate={animate}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
        <SkeletonButton size="lg" className="flex-1" animate={animate} />
        <SkeletonButton size="lg" animate={animate} />
        <SkeletonButton size="lg" animate={animate} />
      </div>
    </div>
  );
};
