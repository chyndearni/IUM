"use client";
import React, { useEffect, useState } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const isHomePage = false;
  // const isHomePage = pathname === "/";

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    } else {
      // Check system preference if no saved theme
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(prefersDark);
    }
    setMounted(true);
    const isLoginCookie = Cookies.get("isLogin");
    setIsLogin(isLoginCookie === "true");
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen for cookie changes (for login/logout)
  useEffect(() => {
    const checkLoginStatus = () => {
      const isLoginCookie = Cookies.get("isLogin");
      setIsLogin(isLoginCookie === "true");
    };

    // Check on mount
    checkLoginStatus();

    // Set up an interval to check periodically (in case cookie changes)
    const interval = setInterval(checkLoginStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  // Toggle dark mode and save to localStorage
  const toggleDarkMode = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  // Apply dark mode class to document
  useEffect(() => {
    if (mounted) {
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [darkMode, mounted]);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  // Dynamic navbar background based on scroll, theme, and current page
  const getNavbarBackground = () => {
    // If not on home page, always show solid background
    if (!isHomePage) {
      return darkMode
        ? "bg-gray-900 border-b border-gray-700"
        : "bg-white border-b border-gray-200 shadow-sm";
    }

    // On home page, show background only when scrolled
    if (isScrolled) {
      return darkMode
        ? "bg-gray-900/95 backdrop-blur-sm border-b border-gray-700"
        : "bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm";
    }

    return "bg-transparent";
  };

  // Dynamic text colors based on scroll, theme, and current page
  const getTextColor = (isPrimary = false) => {
    // If not on home page, use regular theme colors
    if (!isHomePage) {
      if (isPrimary) {
        return darkMode ? "text-white" : "text-gray-900";
      }
      return darkMode ? "text-gray-300" : "text-gray-600";
    }

    // On home page with scroll
    if (isScrolled) {
      if (isPrimary) {
        return darkMode ? "text-white" : "text-gray-900";
      }
      return darkMode ? "text-gray-300" : "text-gray-600";
    }

    // On home page without scroll (transparent), always use light colors for visibility
    return isPrimary ? "text-white" : "text-gray-300";
  };

  const getHoverTextColor = () => {
    return "hover:text-blue-400";
  };

  // Dynamic button backgrounds
  const getButtonBackground = () => {
    // If not on home page, use regular theme backgrounds
    if (!isHomePage) {
      return darkMode
        ? "bg-gray-800 hover:bg-gray-700"
        : "bg-gray-100 hover:bg-gray-200";
    }

    // On home page with scroll
    if (isScrolled) {
      return darkMode
        ? "bg-gray-800 hover:bg-gray-700"
        : "bg-gray-100 hover:bg-gray-200";
    }

    // On home page without scroll (transparent)
    return "bg-black/20 hover:bg-black/30 backdrop-blur-sm";
  };

  const getMenuButtonBackground = () => {
    // If not on home page, use regular theme backgrounds
    if (!isHomePage) {
      return darkMode
        ? "bg-gray-800 hover:bg-gray-700"
        : "bg-gray-100 hover:bg-gray-200";
    }

    // On home page with scroll
    if (isScrolled) {
      return darkMode
        ? "bg-gray-800 hover:bg-gray-700"
        : "bg-gray-100 hover:bg-gray-200";
    }

    // On home page without scroll (transparent)
    return "bg-black/20 hover:bg-black/30 backdrop-blur-sm";
  };

  // Dynamic mobile menu background
  const getMobileMenuBackground = () => {
    return darkMode
      ? "bg-gray-900/95 backdrop-blur-sm border-t border-gray-700"
      : "bg-white/95 backdrop-blur-sm border-t border-gray-200";
  };

  // Dynamic moon icon color
  const getMoonIconColor = () => {
    // If not on home page, use theme-appropriate color
    if (!isHomePage) {
      return darkMode ? "text-gray-300" : "text-gray-600";
    }

    // On home page with scroll
    if (isScrolled) {
      return darkMode ? "text-gray-300" : "text-gray-600";
    }

    // On home page without scroll (transparent)
    return "text-gray-300";
  };

  // Dynamic menu icon color
  const getMenuIconColor = () => {
    // If not on home page, use theme-appropriate color
    if (!isHomePage) {
      return darkMode ? "text-gray-300" : "text-gray-600";
    }

    // On home page with scroll
    if (isScrolled && !darkMode) {
      return "text-gray-600";
    }

    // On home page without scroll or with dark mode
    return "text-gray-300";
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getNavbarBackground()}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo - Responsive sizing */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-2">
              <img
                src="/images/logo/jatimbissa.png"
                alt="InklusifKerja Logo"
                className="w-full h-10 sm:w-full sm:h-12 rounded-lg hover:opacity-90 transition-opacity"
              />
              <span
                className={`text-lg sm:text-xl font-bold hidden xs:block transition-colors ${getTextColor(
                  true
                )}`}
              >
                JatimBissa
              </span>
            </div>
          </div>

          {/* Desktop/Tablet Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4 lg:space-x-8">
              <Link
                href="/"
                className={`px-2 lg:px-3 py-2 text-sm font-medium transition-colors ${getTextColor(
                  true
                )} ${getHoverTextColor()}`}
              >
                Beranda
              </Link>
              <Link
                href="/cari-kerja"
                className={`px-2 lg:px-3 py-2 text-sm font-medium transition-colors ${getTextColor()} ${getHoverTextColor()}`}
              >
                Cari Kerja
              </Link>
              {/* <Link
                href="/akademik"
                className={`px-2 lg:px-3 py-2 text-sm font-medium transition-colors ${getTextColor()} ${getHoverTextColor()}`}
              >
                Akademik
              </Link> */}
              {/* <Link
                href="/toko"
                className={`px-2 lg:px-3 py-2 text-sm font-medium transition-colors ${getTextColor()} ${getHoverTextColor()}`}
              >
                Toko
              </Link> */}
            </div>
          </div>

          {/* Right Section */}
          {/* Auth Buttons - Hidden on small mobile */}
          {!isLogin ? (
            <div className="hidden sm:flex items-center space-x-2">
              <Link
                href="/login"
                className={`px-3 py-2 text-sm font-medium transition-colors ${getTextColor()} ${getHoverTextColor()}`}
              >
                Masuk
              </Link>
              {/* <Link
                  href="/register"
                  className="bg-brand-500 hover:bg-brand-600 text-white px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Daftar
                </Link> */}
              <Link
                href="/register-user"
                className="bg-brand-500 hover:bg-brand-600 text-white px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Daftar Sebagai Pengguna
              </Link>
              <Link
                href="/register-company"
                className="bg-brand-500 hover:bg-brand-600 text-white px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Daftar Sebagai Perusahaan
              </Link>
            </div>
          ) : (
            <div className="hidden sm:flex items-center space-x-2">
              <Link
                href="/dashboard"
                className="bg-brand-500 hover:bg-brand-600 text-white px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
            </div>
          )}

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Dark Mode Toggle - Always visible */}
            <button
              onClick={toggleDarkMode}
              className={`p-1.5 sm:p-2 rounded-lg transition-colors ${getButtonBackground()}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              ) : (
                <Moon
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${getMoonIconColor()}`}
                />
              )}
            </button>
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-1.5 sm:p-2 rounded-lg transition-colors ${getMenuButtonBackground()}`}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className={`w-4 h-4 sm:w-5 sm:h-5 ${getMenuIconColor()}`} />
              ) : (
                <Menu
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${getMenuIconColor()}`}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Optimized for touch */}
      {mobileMenuOpen && (
        <div className={`md:hidden ${getMobileMenuBackground()}`}>
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`block px-3 py-3 text-base font-medium transition-colors rounded-lg ${getTextColor(
                true
              )} ${getHoverTextColor()}`}
            >
              Beranda
            </Link>
            <Link
              href="/cari-kerja"
              className={`block px-3 py-3 text-base font-medium transition-colors rounded-lg ${getTextColor()} ${getHoverTextColor()}`}
            >
              Cari Kerja
            </Link>
            {/* <Link
              href="/akademik"
              className={`block px-3 py-3 text-base font-medium transition-colors rounded-lg ${getTextColor()} ${getHoverTextColor()}`}
            >
              Akademik
            </Link> */}
            {/* <Link
              href="/toko"
              className={`block px-3 py-3 text-base font-medium transition-colors rounded-lg ${getTextColor()} ${getHoverTextColor()}`}
            >
              Toko
            </Link> */}

            {!isLogin ? (
              <div
                className={`border-t pt-3 mt-3 sm:hidden ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <Link
                  href="/login"
                  className={`block w-full text-left px-3 py-3 text-base font-medium transition-colors rounded-lg ${getTextColor()} ${getHoverTextColor()}`}
                >
                  Masuk
                </Link>
                {/* <Link
                  href="/register"
                  className="block w-full text-left px-3 py-3 text-base font-medium bg-brand-500 hover:bg-brand-600 text-white rounded-lg mt-2 transition-colors"
                >
                  Daftar
                </Link> */}
                <Link
                  href="/register-user"
                  className="block w-full text-left px-3 py-3 text-base font-medium bg-brand-500 hover:bg-brand-600 text-white rounded-lg mt-2 transition-colors"
                >
                  Daftar Sebagai Pengguna
                </Link>
                <Link
                  href="/register-company"
                  className="block w-full text-left px-3 py-3 text-base font-medium bg-brand-500 hover:bg-brand-600 text-white rounded-lg mt-2 transition-colors"
                >
                  Daftar Sebagai Perusahaan
                </Link>
              </div>
            ) : (
              <div
                className={`border-t pt-3 mt-3 sm:hidden ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <Link
                  href="/dashboard"
                  className="block w-full text-left px-3 py-3 text-base font-medium bg-brand-500 hover:bg-brand-600 text-white rounded-lg mt-2 transition-colors"
                >
                  Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
