"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { useUser } from "../context/UserContext";

// Import Lucide React icons
import {
  LayoutDashboard,
  Briefcase,
  User,
  FileText,
  GraduationCap,
  ChevronDown,
  MoreHorizontal,
  BookOpen,
  Building2,
  ClipboardList,
  Send,
  FileCheck,
  Mail,
  Users, // Icon untuk TalentPull
} from "lucide-react";
import AppSidebarSkeleton from "@/skeleton/AppSidebarSkeleton";

// ========================
// TYPES & INTERFACES
// ========================
type SubMenuItem = {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
  allowedRoles?: string[];
};

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: SubMenuItem[];
  allowedRoles?: string[];
};

type SubmenuState = {
  type: "main" | "others";
  index: number;
} | null;

// ========================
// MENU CONFIGURATION
// ========================
const MAIN_MENU_ITEMS: NavItem[] = [
  {
    icon: <LayoutDashboard size={20} />,
    name: "Dashboard",
    path: "/dashboard",
    allowedRoles: ["user", "perusahaan"],
  },
  {
    icon: <Briefcase size={20} />,
    name: "Lowongan Pekerjaan",
    path: "/lowongan-pekerjaan",
    allowedRoles: ["perusahaan"],
  },
  {
    icon: <User size={20} />,
    name: "Profile Perusahaan",
    path: "/profile-perusahaan",
    allowedRoles: ["perusahaan"],
  },
  {
    icon: <Users size={20} />,
    name: "Talent Pool",
    path: "/talent-pool",
    allowedRoles: ["perusahaan"],
  },
  {
    icon: <FileText size={20} />,
    name: "Resume",
    path: "/resume",
    allowedRoles: ["user"],
  },
  {
    icon: <Briefcase size={20} />,
    name: "Lowongan Pekerjaan",
    path: "/jobs",
    allowedRoles: ["user"],
  },
  {
    icon: <Send size={20} />,
    name: "Lamaran Saya",
    path: "/my-apply-jobs",
    allowedRoles: ["user"],
  },
  {
    icon: <Mail size={20} />,
    name: "Undangan Kerja",
    path: "/job-invitation",
    allowedRoles: ["user"],
  },
  // {
  //   icon: <GraduationCap size={20} />,
  //   name: "Akademik",
  //   path: "/academic/my-course",
  //   allowedRoles: ["user"],
  // },
];

const OTHER_MENU_ITEMS: NavItem[] = [
  // Tambahkan menu lain di sini jika diperlukan
];

// ========================
// MAIN COMPONENT
// ========================
const AppSidebar: React.FC = () => {
  // ========================
  // HOOKS & STATE
  // ========================
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { user, loading, canAccess } = useUser();
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState<SubmenuState>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // ========================
  // UTILITY FUNCTIONS
  // ========================
  const isActive = useCallback(
    (path: string) => {
      if (path === "/dashboard") {
        return pathname === "/dashboard";
      }
      return pathname.startsWith(path);
    },
    [pathname]
  );

  const getFilteredMenuItems = useCallback(
    (items: NavItem[]) => {
      if (loading || !user) return [];

      return items.filter((item) => {
        if (!item.allowedRoles || item.allowedRoles.length === 0) {
          return true;
        }
        return canAccess(item.allowedRoles);
      });
    },
    [loading, user, canAccess]
  );

  const getSidebarWidth = () => {
    if (isExpanded || isMobileOpen) return "w-[290px]";
    if (isHovered) return "w-[290px]";
    return "w-[90px]";
  };

  const getMobileTransform = () => {
    return isMobileOpen ? "translate-x-0" : "-translate-x-full";
  };

  const getContentAlignment = () => {
    return !isExpanded && !isHovered ? "lg:justify-center" : "justify-center";
  };

  const shouldShowText = () => {
    return isExpanded || isHovered || isMobileOpen;
  };

  // ========================
  // EVENT HANDLERS
  // ========================
  const handleSubmenuToggle = useCallback(
    (index: number, menuType: "main" | "others") => {
      setOpenSubmenu((prev) => {
        if (prev && prev.type === menuType && prev.index === index) {
          return null;
        }
        return { type: menuType, index };
      });
    },
    []
  );

  const handleMouseEnter = () => {
    if (!isExpanded) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // ========================
  // EFFECTS
  // ========================
  useEffect(() => {
    let submenuMatched = false;

    [
      { type: "main", items: getFilteredMenuItems(MAIN_MENU_ITEMS) },
      { type: "others", items: getFilteredMenuItems(OTHER_MENU_ITEMS) },
    ].forEach(({ type, items }) => {
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: type as "main" | "others", index });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive, getFilteredMenuItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      const element = subMenuRefs.current[key];

      if (element) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: element.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  // ========================
  // RENDER FUNCTIONS
  // ========================
  const renderLogo = () => (
    <div className={`py-8 flex ${getContentAlignment()}`}>
      <Link href="/">
        {shouldShowText() ? (
          <>
            <Image
              className="dark:hidden"
              src="/images/logo/jatimbissa.webp"
              alt="Logo"
              width={100}
              height={20}
            />
            <Image
              className="hidden dark:block"
              src="/images/logo/jatimbissa.webp"
              alt="Logo"
              width={150}
              height={40}
            />
          </>
        ) : (
          <Image
            src="/images/logo/jatimbissa.webp"
            alt="Logo"
            width={32}
            height={32}
          />
        )}
      </Link>
    </div>
  );

  const renderMenuHeader = (title: string) => (
    <h2
      className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-500 dark:text-gray-400 ${getContentAlignment()}`}
    >
      {shouldShowText() ? title : <MoreHorizontal size={16} />}
    </h2>
  );

  const renderSubmenuBadges = (subItem: SubMenuItem) => (
    <span className="flex items-center gap-1 ml-auto">
      {subItem.new && (
        <span
          className={`ml-auto ${
            isActive(subItem.path)
              ? "menu-dropdown-badge-active"
              : "menu-dropdown-badge-inactive"
          } menu-dropdown-badge`}
        >
          new
        </span>
      )}
      {subItem.pro && (
        <span
          className={`ml-auto ${
            isActive(subItem.path)
              ? "menu-dropdown-badge-active"
              : "menu-dropdown-badge-inactive"
          } menu-dropdown-badge`}
        >
          pro
        </span>
      )}
    </span>
  );

  const renderSubMenu = (
    nav: NavItem,
    index: number,
    menuType: "main" | "others"
  ) => {
    if (!nav.subItems || !shouldShowText()) return null;

    const key = `${menuType}-${index}`;
    const isOpen =
      openSubmenu?.type === menuType && openSubmenu?.index === index;

    return (
      <div
        ref={(el) => {
          subMenuRefs.current[key] = el;
        }}
        className="overflow-hidden transition-all duration-300"
        style={{
          height: isOpen ? `${subMenuHeight[key]}px` : "0px",
        }}
      >
        <ul className="mt-2 space-y-1 ml-9">
          {nav.subItems.map((subItem) => (
            <li key={subItem.name}>
              <Link
                href={subItem.path}
                className={`menu-dropdown-item ${
                  isActive(subItem.path)
                    ? "menu-dropdown-item-active"
                    : "menu-dropdown-item-inactive"
                }`}
              >
                {subItem.name}
                {renderSubmenuBadges(subItem)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderMenuItem = (
    nav: NavItem,
    index: number,
    menuType: "main" | "others"
  ) => {
    const hasSubItems = nav.subItems && nav.subItems.length > 0;
    const isSubmenuOpen =
      openSubmenu?.type === menuType && openSubmenu?.index === index;

    if (hasSubItems) {
      // Render submenu button
      return (
        <>
          <button
            onClick={() => handleSubmenuToggle(index, menuType)}
            className={`menu-item group ${
              isSubmenuOpen ? "menu-item-active" : "menu-item-inactive"
            } cursor-pointer ${getContentAlignment()}`}
          >
            <span
              className={`${
                isSubmenuOpen
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
              }`}
            >
              {nav.icon}
            </span>
            {shouldShowText() && (
              <>
                <span className="menu-item-text">{nav.name}</span>
                <ChevronDown
                  size={20}
                  className={`ml-auto transition-transform duration-200 ${
                    isSubmenuOpen ? "rotate-180 text-brand-500" : ""
                  }`}
                />
              </>
            )}
          </button>
          {renderSubMenu(nav, index, menuType)}
        </>
      );
    } else if (nav.path) {
      // Render regular menu link
      return (
        <Link
          href={nav.path}
          className={`menu-item group ${
            isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
          }`}
        >
          <span
            className={`${
              isActive(nav.path)
                ? "menu-item-icon-active"
                : "menu-item-icon-inactive"
            }`}
          >
            {nav.icon}
          </span>
          {shouldShowText() && (
            <span className="menu-item-text">{nav.name}</span>
          )}
        </Link>
      );
    }

    return null;
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => {
    const filteredItems = getFilteredMenuItems(items);

    return (
      <ul className="flex flex-col gap-4">
        {filteredItems.map((nav, index) => (
          <li key={nav.name}>{renderMenuItem(nav, index, menuType)}</li>
        ))}
      </ul>
    );
  };

  const renderLoadingState = () => (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 ${getSidebarWidth()} ${getMobileTransform()} lg:translate-x-0`}
    >
      <AppSidebarSkeleton />
    </aside>
  );

  // ========================
  // MAIN RENDER
  // ========================
  if (loading) {
    return renderLoadingState();
  }

  const filteredOtherItems = getFilteredMenuItems(OTHER_MENU_ITEMS);

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 ${getSidebarWidth()} ${getMobileTransform()} lg:translate-x-0`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Logo Section */}
      {renderLogo()}

      {/* Menu Section */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            {/* Main Menu */}
            <div>
              {renderMenuHeader("Menu")}
              {renderMenuItems(MAIN_MENU_ITEMS, "main")}
            </div>

            {/* Other Menu */}
            {filteredOtherItems.length > 0 && (
              <div>
                {renderMenuHeader("Others")}
                {renderMenuItems(OTHER_MENU_ITEMS, "others")}
              </div>
            )}
          </div>
        </nav>

        {/* Bottom Icon */}
        {!shouldShowText() && <MoreHorizontal size={16} />}
      </div>
    </aside>
  );
};

export default AppSidebar;
