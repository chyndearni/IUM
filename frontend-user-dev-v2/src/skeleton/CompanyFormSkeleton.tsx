import React from "react";

// Base Skeleton Component
const Skeleton = ({
  className = "",
  variant = "rectangular",
  animation = "pulse",
}: {
  className?: string;
  variant?: "rectangular" | "circular" | "text";
  animation?: "pulse" | "wave" | "none";
}) => {
  const baseClasses = "bg-gray-200 dark:bg-gray-700";

  const variantClasses = {
    rectangular: "rounded",
    circular: "rounded-full",
    text: "rounded",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-bounce", // You can implement wave animation with custom CSS
    none: "",
  };

  return (
    <div
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${animationClasses[animation]} 
        ${className}
      `}
    />
  );
};

// Preset Skeleton Components
export const SkeletonText = ({
  lines = 1,
  className = "",
  lastLineWidth = "75%",
}: {
  lines?: number;
  className?: string;
  lastLineWidth?: string;
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        className={`h-4 ${
          index === lines - 1 && lines > 1 ? `w-[${lastLineWidth}]` : "w-full"
        }`}
        variant="text"
      />
    ))}
  </div>
);

export const SkeletonButton = ({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) => {
  const sizeClasses = {
    sm: "h-8 w-20",
    md: "h-10 w-24",
    lg: "h-12 w-32",
  };

  return (
    <Skeleton className={`${sizeClasses[size]} rounded-lg ${className}`} />
  );
};

export const SkeletonInput = ({
  className = "",
  hasLabel = true,
  hasIcon = false,
}: {
  className?: string;
  hasLabel?: boolean;
  hasIcon?: boolean;
}) => (
  <div className={`space-y-2 ${className}`}>
    {hasLabel && <Skeleton className="h-4 w-24" />}
    <div className="relative">
      {hasIcon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Skeleton variant="circular" className="w-5 h-5" />
        </div>
      )}
      <Skeleton
        className={`h-12 w-full rounded-lg ${hasIcon ? "pl-11" : ""}`}
      />
    </div>
  </div>
);

export const SkeletonCard = ({
  children,
  className = "",
  padding = "p-6",
}: {
  children?: React.ReactNode;
  className?: string;
  padding?: string;
}) => (
  <div
    className={`
    bg-white dark:bg-gray-800 
    rounded-2xl 
    shadow-sm 
    border border-gray-200 dark:border-gray-700 
    ${padding} 
    ${className}
  `}
  >
    {children}
  </div>
);

export const SkeletonAvatar = ({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  return (
    <Skeleton
      variant="circular"
      className={`${sizeClasses[size]} ${className}`}
    />
  );
};

// Form-specific Loading Skeleton
export const FormLoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    {/* Breadcrumb */}
    <div className="mb-6 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center space-x-2 mb-4">
        <SkeletonText lines={1} className="w-16" />
        <Skeleton className="w-2 h-4" />
        <SkeletonText lines={1} className="w-24" />
      </div>
      <SkeletonText lines={1} className="w-64" />
    </div>

    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <SkeletonCard>
        {/* Card Header */}
        <div className="mb-6">
          <SkeletonText lines={1} className="w-56 mb-2" />
          <SkeletonText lines={1} className="w-80" />
        </div>

        <div className="space-y-8">
          {/* Form Sections */}
          {Array.from({ length: 5 }).map((_, sectionIndex) => (
            <SkeletonCard key={sectionIndex}>
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-6">
                <Skeleton variant="circular" className="w-5 h-5" />
                <SkeletonText lines={1} className="w-48" />
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Array.from({ length: Math.floor(Math.random() * 4) + 2 }).map(
                  (_, fieldIndex) => (
                    <div
                      key={fieldIndex}
                      className={
                        fieldIndex === 0 && sectionIndex === 0
                          ? "lg:col-span-2"
                          : ""
                      }
                    >
                      {fieldIndex === 0 && sectionIndex === 0 ? (
                        // Special file upload skeleton
                        <div className="space-y-3">
                          <SkeletonText lines={1} className="w-28" />
                          <div className="flex items-center gap-6">
                            <SkeletonAvatar size="xl" className="rounded-xl" />
                            <div className="space-y-2">
                              <SkeletonButton />
                              <SkeletonText lines={1} className="w-48" />
                            </div>
                          </div>
                        </div>
                      ) : Math.random() > 0.5 ? (
                        <SkeletonInput hasIcon={Math.random() > 0.5} />
                      ) : (
                        // Textarea skeleton
                        <div className="space-y-2">
                          <SkeletonText lines={1} className="w-32" />
                          <Skeleton className="h-24 w-full rounded-lg" />
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </SkeletonCard>
          ))}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <SkeletonButton size="lg" className="w-full sm:w-auto" />
            <SkeletonButton className="w-full sm:w-auto" />
            <SkeletonButton size="sm" className="w-full sm:w-auto" />
          </div>
        </div>
      </SkeletonCard>
    </div>
  </div>
);

// Simple Loading Replacement
export const SimpleLoadingSkeleton = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="w-8 h-8 mx-auto mb-4">
        <Skeleton
          variant="circular"
          className="w-full h-full"
          animation="pulse"
        />
      </div>
      <SkeletonText lines={1} className="w-32" />
    </div>
  </div>
);

// Grid Skeleton for listings
export const GridSkeleton = ({
  items = 6,
  columns = 3,
}: {
  items?: number;
  columns?: number;
}) => {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      className={`grid ${
        gridClasses[columns as keyof typeof gridClasses]
      } gap-6`}
    >
      {Array.from({ length: items }).map((_, index) => (
        <SkeletonCard key={index}>
          <div className="space-y-4">
            <SkeletonAvatar size="lg" className="mx-auto" />
            <SkeletonText lines={2} />
            <SkeletonButton className="w-full" />
          </div>
        </SkeletonCard>
      ))}
    </div>
  );
};

// Table Skeleton
export const TableSkeleton = ({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
    {/* Table Header */}
    <div className="border-b border-gray-200 dark:border-gray-700 p-4">
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }).map((_, index) => (
          <SkeletonText key={index} lines={1} className="w-20" />
        ))}
      </div>
    </div>

    {/* Table Body */}
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4">
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="flex items-center">
                {colIndex === 0 && (
                  <SkeletonAvatar size="sm" className="mr-3" />
                )}
                <SkeletonText
                  lines={1}
                  className={colIndex === 0 ? "w-24" : "w-16"}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
