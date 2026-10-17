"use client";

import React from "react";
import { useSidebar } from "../context/SidebarContext";
import { MoreHorizontal } from "lucide-react";

// ========================
// SKELETON COMPONENT
// ========================
const AppSidebarSkeleton: React.FC = () => {
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

  const getContentAlignment = () => {
    return !isExpanded && !isHovered ? "lg:justify-center" : "justify-start";
  };

  const shouldShowText = () => {
    return isExpanded || isHovered || isMobileOpen;
  };

  // ========================
  // SKELETON RENDER FUNCTIONS
  // ========================
  const SkeletonBox: React.FC<{
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
      className={`${width} ${height} ${rounded} bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse ${className}`}
    />
  );

  const renderLogoSkeleton = () => (
    <div className={`py-8 flex ${getContentAlignment()}`}>
      {shouldShowText() ? (
        <SkeletonBox width="w-36" height="h-10" rounded="rounded-lg" />
      ) : (
        <SkeletonBox width="w-8" height="h-8" rounded="rounded-lg" />
      )}
    </div>
  );

  const renderMenuHeaderSkeleton = () => (
    <div className={`mb-4 flex ${getContentAlignment()}`}>
      {shouldShowText() ? (
        <SkeletonBox width="w-16" height="h-3" />
      ) : (
        <MoreHorizontal
          size={16}
          className="text-gray-300 dark:text-gray-600"
        />
      )}
    </div>
  );

  const renderMenuItemSkeleton = (
    textWidth: string,
    withSubmenu = false,
    isActive = false
  ) => (
    <div
      className={`flex items-center space-x-3 py-3 px-3 rounded-xl transition-all duration-200 ${getContentAlignment()} ${
        isActive ? "bg-gray-100 dark:bg-gray-800" : ""
      }`}
    >
      {/* Icon skeleton */}
      <SkeletonBox
        width="w-5"
        height="h-5"
        rounded="rounded"
        className="flex-shrink-0"
      />

      {shouldShowText() && (
        <>
          {/* Text skeleton with predefined widths */}
          <SkeletonBox width={textWidth} height="h-4" className="flex-1" />

          {/* Chevron skeleton for submenu */}
          {withSubmenu && (
            <SkeletonBox width="w-4" height="h-4" className="flex-shrink-0" />
          )}
        </>
      )}
    </div>
  );

  const renderSubmenuSkeleton = () => {
    if (!shouldShowText()) return null;

    // Predefined widths instead of random
    const submenuWidths = ["w-20", "w-24", "w-16"];

    return (
      <div className="ml-9 mt-2 space-y-2">
        {submenuWidths.map((width, index) => (
          <div key={index} className="flex items-center py-2 px-3">
            <SkeletonBox width={width} height="h-3" />
            {/* Badge skeleton for second item */}
            {index === 1 && (
              <SkeletonBox
                width="w-8"
                height="h-4"
                rounded="rounded-full"
                className="ml-auto"
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderMenuSectionSkeleton = (
    items: Array<{
      textWidth: string;
      hasSubmenu?: boolean;
      isActive?: boolean;
    }>
  ) => (
    <div className="space-y-1">
      {items.map((item, index) => (
        <div key={index} className="transition-all duration-200">
          {renderMenuItemSkeleton(
            item.textWidth,
            item.hasSubmenu,
            item.isActive
          )}
          {item.hasSubmenu && renderSubmenuSkeleton()}
        </div>
      ))}
    </div>
  );

  // ========================
  // PREDEFINED MENU CONFIGURATIONS (No randomness)
  // ========================
  const mainMenuItems = [
    { textWidth: "w-20", isActive: true }, // Dashboard - active
    { textWidth: "w-32" }, // Lowongan Pekerjaan
    { textWidth: "w-28" }, // Profile Perusahaan
    { textWidth: "w-16" }, // Resume
    { textWidth: "w-24" }, // Lamaran Saya
    { textWidth: "w-20", hasSubmenu: true }, // Akademik - with submenu
  ];

  const otherMenuItems = [
    { textWidth: "w-18" },
    { textWidth: "w-22" },
    { textWidth: "w-20" },
  ];

  // ========================
  // MAIN RENDER
  // ========================
  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 ${getSidebarWidth()} ${getMobileTransform()} lg:translate-x-0`}
    >
      {/* Logo Skeleton */}
      {renderLogoSkeleton()}

      {/* Menu Section Skeleton */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-6">
            {/* Main Menu Skeleton */}
            <div>
              {renderMenuHeaderSkeleton()}
              {renderMenuSectionSkeleton(mainMenuItems)}
            </div>

            {/* Other Menu Skeleton (always show for consistency) */}
            {shouldShowText() && (
              <div>
                {renderMenuHeaderSkeleton()}
                {renderMenuSectionSkeleton(otherMenuItems)}
              </div>
            )}
          </div>
        </nav>

        {/* Bottom Icon Skeleton */}
        {!shouldShowText() && (
          <div className="mt-auto mb-4 flex justify-center">
            <MoreHorizontal
              size={16}
              className="text-gray-300 dark:text-gray-600"
            />
          </div>
        )}
      </div>
    </aside>
  );
};

// ========================
// ALTERNATIVE SIMPLE SKELETON
// ========================
export const SimpleSidebarSkeleton: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered } = useSidebar();

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

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 ${getSidebarWidth()} ${getMobileTransform()} lg:translate-x-0`}
    >
      {/* Simple loading spinner */}
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        {shouldShowText() && (
          <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
            Memuat menu...
          </span>
        )}
      </div>
    </aside>
  );
};

// ========================
// ENHANCED SKELETON WITH SHIMMER (No hydration issues)
// ========================
export const ShimmerSidebarSkeleton: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered } = useSidebar();

  const getSidebarWidth = () => {
    if (isExpanded || isMobileOpen) return "w-[290px]";
    if (isHovered) return "w-[290px]";
    return "w-[90px]";
  };

  const getMobileTransform = () => {
    return isMobileOpen ? "translate-x-0" : "-translate-x-full";
  };

  const getContentAlignment = () => {
    return !isExpanded && !isHovered ? "lg:justify-center" : "justify-start";
  };

  const shouldShowText = () => {
    return isExpanded || isHovered || isMobileOpen;
  };

  const ShimmerBox: React.FC<{
    width?: string;
    height?: string;
    className?: string;
  }> = ({ width = "w-full", height = "h-4", className = "" }) => (
    <div
      className={`${width} ${height} relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </div>
  );

  return (
    <>
      <aside
        className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 ${getSidebarWidth()} ${getMobileTransform()} lg:translate-x-0`}
      >
        {/* Logo Skeleton */}
        <div className={`py-8 flex ${getContentAlignment()}`}>
          {shouldShowText() ? (
            <ShimmerBox width="w-36" height="h-10" />
          ) : (
            <ShimmerBox width="w-8" height="h-8" />
          )}
        </div>

        {/* Menu Section */}
        <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
          <nav className="mb-6">
            <div className="flex flex-col gap-6">
              {/* Main Menu */}
              <div>
                <div className={`mb-4 flex ${getContentAlignment()}`}>
                  {shouldShowText() ? (
                    <ShimmerBox width="w-16" height="h-3" />
                  ) : (
                    <MoreHorizontal
                      size={16}
                      className="text-gray-300 dark:text-gray-600"
                    />
                  )}
                </div>

                <div className="space-y-1">
                  {/* Menu items with predefined widths */}
                  {[
                    { width: "w-20", active: true },
                    { width: "w-32", active: false },
                    { width: "w-28", active: false },
                    { width: "w-16", active: false },
                    { width: "w-24", active: false },
                    { width: "w-20", active: false, submenu: true },
                  ].map((item, index) => (
                    <div key={index}>
                      <div
                        className={`flex items-center space-x-3 py-3 px-3 rounded-xl ${getContentAlignment()} ${
                          item.active ? "bg-gray-100 dark:bg-gray-800" : ""
                        }`}
                      >
                        <ShimmerBox
                          width="w-5"
                          height="h-5"
                          className="flex-shrink-0"
                        />
                        {shouldShowText() && (
                          <>
                            <ShimmerBox
                              width={item.width}
                              height="h-4"
                              className="flex-1"
                            />
                            {item.submenu && (
                              <ShimmerBox
                                width="w-4"
                                height="h-4"
                                className="flex-shrink-0"
                              />
                            )}
                          </>
                        )}
                      </div>
                      {/* Submenu */}
                      {item.submenu && shouldShowText() && (
                        <div className="ml-9 mt-2 space-y-2">
                          {["w-20", "w-24", "w-16"].map((width, subIndex) => (
                            <div
                              key={subIndex}
                              className="flex items-center py-2 px-3"
                            >
                              <ShimmerBox width={width} height="h-3" />
                              {subIndex === 1 && (
                                <ShimmerBox
                                  width="w-8"
                                  height="h-4"
                                  className="ml-auto rounded-full"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {!shouldShowText() && (
            <div className="mt-auto mb-4 flex justify-center">
              <MoreHorizontal
                size={16}
                className="text-gray-300 dark:text-gray-600"
              />
            </div>
          )}
        </div>
      </aside>

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

export default AppSidebarSkeleton;
