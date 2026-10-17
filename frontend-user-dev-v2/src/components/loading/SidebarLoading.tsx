// components/SidebarLoading.tsx
"use client";

import React from "react";
import { useSidebar } from "@/context/SidebarContext";
import { HorizontaLDots } from "@/icons/index";

// ========================
// SKELETON COMPONENTS
// ========================
const SkeletonBox: React.FC<{ 
  width?: string; 
  height?: string; 
  className?: string;
  rounded?: boolean;
}> = ({ 
  width = "w-full", 
  height = "h-4", 
  className = "", 
  rounded = true 
}) => (
  <div 
    className={`
      ${width} ${height} 
      ${rounded ? "rounded" : ""} 
      bg-gray-200 dark:bg-gray-700 
      animate-pulse 
      ${className}
    `} 
  />
);

const SkeletonCircle: React.FC<{ size?: string; className?: string }> = ({ 
  size = "w-6 h-6", 
  className = "" 
}) => (
  <div 
    className={`
      ${size} 
      rounded-full 
      bg-gray-200 dark:bg-gray-700 
      animate-pulse 
      ${className}
    `} 
  />
);

const SkeletonMenuItem: React.FC<{ showText: boolean }> = ({ showText }) => (
  <div className="flex items-center gap-3 p-3">
    {/* Icon skeleton */}
    <SkeletonBox 
      width="w-5" 
      height="h-5" 
      className="flex-shrink-0" 
    />
    
    {/* Text skeleton */}
    {showText && (
      <SkeletonBox 
        width="w-24" 
        height="h-4" 
      />
    )}
  </div>
);

const SkeletonMenuSection: React.FC<{ 
  showText: boolean; 
  itemCount?: number;
  title?: string;
}> = ({ showText, itemCount = 3, title = "Menu" }) => (
  <div className="space-y-2">
    {/* Section header skeleton */}
    <div className={`mb-4 flex ${!showText ? "justify-center" : "justify-start"}`}>
      {showText ? (
        <SkeletonBox 
          width="w-12" 
          height="h-3" 
        />
      ) : (
        <HorizontaLDots />
      )}
    </div>
    
    {/* Menu items skeleton */}
    <div className="space-y-1">
      {Array.from({ length: itemCount }).map((_, index) => (
        <SkeletonMenuItem 
          key={index} 
          showText={showText} 
        />
      ))}
    </div>
  </div>
);

const SkeletonLogo: React.FC<{ showText: boolean }> = ({ showText }) => (
  <div className={`py-8 flex ${!showText ? "justify-center" : "justify-start"}`}>
    {showText ? (
      <SkeletonBox 
        width="w-32" 
        height="h-8" 
      />
    ) : (
      <SkeletonBox 
        width="w-8" 
        height="h-8" 
      />
    )}
  </div>
);

// ========================
// LOADING VARIANTS
// ========================
const PulseLoading: React.FC<{ showText: boolean }> = ({ showText }) => (
  <>
    <SkeletonLogo showText={showText} />
    
    <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar px-2">
      <nav className="mb-6">
        <div className="flex flex-col gap-6">
          {/* Main menu section */}
          <SkeletonMenuSection 
            showText={showText} 
            itemCount={4}
            title="Menu"
          />
          
          {/* Others section */}
          <SkeletonMenuSection 
            showText={showText} 
            itemCount={2}
            title="Others"
          />
        </div>
      </nav>
      
      {/* Bottom icon */}
      {!showText && (
        <div className="flex justify-center">
          <HorizontaLDots />
        </div>
      )}
    </div>
  </>
);

const ShimmerLoading: React.FC<{ showText: boolean }> = ({ showText }) => (
  <>
    <div className={`py-8 flex ${!showText ? "justify-center" : "justify-start"}`}>
      <div className={`${showText ? "w-32 h-8" : "w-8 h-8"} bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%] rounded`} />
    </div>
    
    <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar px-2">
      <nav className="mb-6">
        <div className="flex flex-col gap-6">
          {[...Array(2)].map((_, sectionIndex) => (
            <div key={sectionIndex} className="space-y-3">
              {/* Section header */}
              <div className={`flex ${!showText ? "justify-center" : "justify-start"}`}>
                {showText ? (
                  <div className="w-12 h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%] rounded" />
                ) : (
                  <HorizontaLDots />
                )}
              </div>
              
              {/* Menu items */}
              {[...Array(3)].map((_, itemIndex) => (
                <div key={itemIndex} className="flex items-center gap-3 p-3">
                  <div className="w-5 h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%] rounded" />
                  {showText && (
                    <div className="w-24 h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%] rounded" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </nav>
    </div>
  </>
);

const DotsLoading: React.FC<{ showText: boolean }> = ({ showText }) => (
  <>
    <SkeletonLogo showText={showText} />
    
    <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar px-2">
      <nav className="mb-6">
        <div className="flex flex-col gap-6">
          {[...Array(2)].map((_, sectionIndex) => (
            <div key={sectionIndex} className="space-y-3">
              {/* Section header */}
              <div className={`flex ${!showText ? "justify-center" : "justify-start"}`}>
                {showText ? (
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, dotIndex) => (
                      <div 
                        key={dotIndex}
                        className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce"
                        style={{ animationDelay: `${dotIndex * 0.1}s` }}
                      />
                    ))}
                  </div>
                ) : (
                  <HorizontaLDots />
                )}
              </div>
              
              {/* Menu items */}
              {[...Array(3)].map((_, itemIndex) => (
                <div key={itemIndex} className="flex items-center gap-3 p-3">
                  <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-ping" />
                  {showText && (
                    <SkeletonBox width="w-24" height="h-4" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </nav>
    </div>
  </>
);

// ========================
// MAIN LOADING COMPONENT
// ========================
type LoadingVariant = "pulse" | "shimmer" | "dots" | "minimal";

interface SidebarLoadingProps {
  variant?: LoadingVariant;
  showLogo?: boolean;
  itemCounts?: {
    main?: number;
    others?: number;
  };
}

const SidebarLoading: React.FC<SidebarLoadingProps> = ({ 
  variant = "pulse",
  showLogo = true,
  itemCounts = { main: 4, others: 2 }
}) => {
  const { isExpanded, isMobileOpen, isHovered } = useSidebar();
  
  // ========================
  // UTILITY FUNCTIONS
  // ========================
  const getSidebarWidth = () => {
    if (isExpanded || isMobileOpen) return "w-[290px]";
    if (isHovered) return "w-[290px]";
    return "w-[90px]";
  };

  const getMobileTransform = () => {
    return isMobileOpen ? "translate-x-0" : "-translate-x-full";
  };

  const shouldShowText = () => {
    return isExpanded || isHovered || isMobileOpen;
  };

  // ========================
  // RENDER VARIANTS
  // ========================
  const renderLoadingContent = () => {
    const showText = shouldShowText();
    
    switch (variant) {
      case "shimmer":
        return <ShimmerLoading showText={showText} />;
      case "dots":
        return <DotsLoading showText={showText} />;
      case "minimal":
        return (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400" />
          </div>
        );
      case "pulse":
      default:
        return <PulseLoading showText={showText} />;
    }
  };

  return (
    <aside
      className={`
        fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 
        bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 
        h-screen transition-all duration-300 ease-in-out z-50 
        border-r border-gray-200 
        ${getSidebarWidth()} 
        ${getMobileTransform()} 
        lg:translate-x-0
      `}
    >
      {renderLoadingContent()}
    </aside>
  );
};

// ========================
// INDIVIDUAL COMPONENTS EXPORT
// ========================
export { 
  SidebarLoading as default,
  SkeletonBox,
  SkeletonCircle,
  SkeletonMenuItem,
  SkeletonMenuSection,
  PulseLoading,
  ShimmerLoading,
  DotsLoading
};

// ========================
// USAGE EXAMPLES
// ========================

// Example 1: Basic usage
// <SidebarLoading />

// Example 2: With shimmer effect
// <SidebarLoading variant="shimmer" />

// Example 3: Minimal spinner
// <SidebarLoading variant="minimal" />

// Example 4: Custom item counts
// <SidebarLoading 
//   variant="pulse" 
//   itemCounts={{ main: 5, others: 3 }} 
// />

// Example 5: Without logo
// <SidebarLoading 
//   variant="dots" 
//   showLogo={false} 
// />