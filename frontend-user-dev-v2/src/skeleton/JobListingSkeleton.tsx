import React from "react";

// Shimmer Animation Component with inline styles
const ShimmerEffect = ({ className }: { className?: string }) => (
  <div
    className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 ${className}`}
    style={{
      background:
        "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
    }}
  >
    <style jsx>{`
      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }

      .dark div {
        background: linear-gradient(
          90deg,
          #374151 25%,
          #4b5563 50%,
          #374151 75%
        ) !important;
      }
    `}</style>
  </div>
);

// Alternative Pulse Animation (more compatible)
const PulseEffect = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${className}`} />
);

// Individual Job Card Skeleton
const JobCardSkeleton = () => (
  <article className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col h-full">
    {/* Header */}
    <header className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3 flex-1">
        {/* Company Logo */}
        <PulseEffect className="w-12 h-12 rounded-lg" />

        <div className="flex-1 min-w-0 space-y-2">
          {/* Job Title */}
          <PulseEffect className="h-5 rounded w-3/4" />
          {/* Company Name */}
          <PulseEffect className="h-4 rounded w-1/2" />
        </div>
      </div>
    </header>

    {/* Job Details */}
    <section className="space-y-3 mb-4">
      {/* Location */}
      <div className="flex items-center">
        <PulseEffect className="w-4 h-4 rounded mr-2" />
        <PulseEffect className="h-4 rounded w-2/3" />
      </div>

      {/* Salary */}
      <div className="flex items-center">
        <PulseEffect className="w-4 h-4 rounded mr-2" />
        <PulseEffect className="h-4 rounded w-1/2" />
      </div>

      {/* Job Type */}
      <div className="flex items-center">
        <PulseEffect className="w-4 h-4 rounded mr-2" />
        <PulseEffect className="h-4 rounded w-1/3" />
      </div>

      {/* Experience */}
      <div className="flex items-center">
        <PulseEffect className="w-4 h-4 rounded mr-2" />
        <PulseEffect className="h-4 rounded w-2/5" />
      </div>
    </section>

    {/* Skills */}
    <section className="mb-4">
      <div className="flex flex-wrap gap-2">
        <PulseEffect className="h-6 rounded-full w-16" />
        <PulseEffect className="h-6 rounded-full w-20" />
        <PulseEffect className="h-6 rounded-full w-14" />
        <PulseEffect className="h-6 rounded-full w-18" />
      </div>
    </section>

    {/* Spacer */}
    <div className="flex-1"></div>

    {/* Deadline and Date */}
    <div className="flex items-center justify-between mb-4">
      <PulseEffect className="h-6 rounded-full w-20" />
      <PulseEffect className="h-4 rounded w-24" />
    </div>

    {/* Actions */}
    <footer className="flex space-x-3 pt-4 border-t border-gray-100 dark:border-gray-700">
      <PulseEffect className="flex-1 h-10 rounded-lg" />
      <PulseEffect className="h-10 w-20 rounded-lg" />
    </footer>
  </article>
);

// Stats Card Skeleton
const StatsCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
    <div className="flex items-center">
      <PulseEffect className="w-8 h-8 rounded mr-3" />
      <div className="space-y-2 flex-1">
        <PulseEffect className="h-6 rounded w-16" />
        <PulseEffect className="h-4 rounded w-24" />
      </div>
    </div>
  </div>
);

// Main Job Listing Skeleton Component
export const JobListingSkeleton = ({
  showStats = true,
  cardCount = 6,
}: {
  showStats?: boolean;
  cardCount?: number;
}) => (
  <div className="space-y-6">
    {/* Stats Section */}
    {showStats && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>
    )}

    {/* Job Cards Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: cardCount }, (_, index) => (
        <JobCardSkeleton key={index} />
      ))}
    </div>

    {/* Load More Button Skeleton */}
    <div className="text-center mt-8">
      <PulseEffect className="inline-block h-12 w-40 rounded-lg" />
    </div>
  </div>
);

// Alternative: Simpler Line Skeleton for other use cases
export const SimpleJobSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <PulseEffect className="w-16 h-16 rounded-xl" />
        <div className="flex-1 space-y-2">
          <PulseEffect className="h-6 rounded w-3/4" />
          <PulseEffect className="h-4 rounded w-1/2" />
        </div>
      </div>

      {/* Content Lines */}
      <div className="space-y-3">
        <PulseEffect className="h-4 rounded w-full" />
        <PulseEffect className="h-4 rounded w-5/6" />
        <PulseEffect className="h-4 rounded w-4/6" />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4">
        <PulseEffect className="h-10 rounded-lg flex-1" />
        <PulseEffect className="h-10 rounded-lg w-24" />
      </div>
    </div>
  </div>
);

// Compact List Skeleton (for mobile or compact views)
export const CompactJobSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
    <div className="flex items-center space-x-3">
      <PulseEffect className="w-12 h-12 rounded-lg" />
      <div className="flex-1 space-y-2">
        <PulseEffect className="h-5 rounded w-3/4" />
        <PulseEffect className="h-4 rounded w-1/2" />
      </div>
      <div className="space-y-2">
        <PulseEffect className="h-6 rounded-full w-20" />
        <PulseEffect className="h-4 rounded w-16" />
      </div>
    </div>
  </div>
);

// Table Row Skeleton (for table layouts)
export const JobTableRowSkeleton = () => (
  <tr className="border-b border-gray-200 dark:border-gray-700">
    <td className="px-6 py-4">
      <div className="flex items-center space-x-3">
        <PulseEffect className="w-10 h-10 rounded-lg" />
        <div className="space-y-2">
          <PulseEffect className="h-4 rounded w-32" />
          <PulseEffect className="h-3 rounded w-24" />
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <PulseEffect className="h-4 rounded w-20" />
    </td>
    <td className="px-6 py-4">
      <PulseEffect className="h-4 rounded w-24" />
    </td>
    <td className="px-6 py-4">
      <PulseEffect className="h-4 rounded w-16" />
    </td>
    <td className="px-6 py-4">
      <div className="flex space-x-2">
        <PulseEffect className="h-8 w-16 rounded" />
        <PulseEffect className="h-8 w-16 rounded" />
      </div>
    </td>
  </tr>
);

// Enhanced Shimmer Skeleton (uses CSS-in-JS for shimmer effect)
export const ShimmerJobSkeleton = () => {
  const shimmerStyle = {
    background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
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

      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-xl" style={shimmerStyle} />
          <div className="flex-1 space-y-2">
            <div className="h-6 rounded w-3/4" style={shimmerStyle} />
            <div className="h-4 rounded w-1/2" style={shimmerStyle} />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div className="h-4 rounded w-full" style={shimmerStyle} />
          <div className="h-4 rounded w-5/6" style={shimmerStyle} />
          <div className="h-4 rounded w-4/6" style={shimmerStyle} />
        </div>
      </div>
    </div>
  );
};

// Usage Example Component
export const JobListingWithSkeleton = ({
  isLoading,
  jobs,
  showStats = true,
}: {
  isLoading: boolean;
  jobs?: any[];
  showStats?: boolean;
}) => {
  if (isLoading) {
    return <JobListingSkeleton showStats={showStats} cardCount={6} />;
  }

  // Your actual job listing content here
  return (
    <div>
      {/* Your actual job listing JSX */}
      {jobs && jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, index) => (
            <div key={index}>{/* Your job card component */}</div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            Belum ada lowongan pekerjaan tersedia
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListingSkeleton;
