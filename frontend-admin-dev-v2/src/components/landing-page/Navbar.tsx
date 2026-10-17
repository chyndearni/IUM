"use client";
import React, { useEffect, useState } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

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
    // ubah jadi boolean
    setIsLogin(isLoginCookie === "true");
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

  if (!mounted) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo - Responsive sizing */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-brand-500 hover:bg-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">
                  IK
                </span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white hidden xs:block">
                InklusifKerja
              </span>
            </div>
          </div>

          {/* Desktop/Tablet Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4 lg:space-x-8">
              <Link
                href="/"
                className="text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 px-2 lg:px-3 py-2 text-sm font-medium transition-colors"
              >
                Beranda
              </Link>
              <Link
                href="/cari-kerja"
                className="text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 px-2 lg:px-3 py-2 text-sm font-medium transition-colors"
              >
                Cari Kerja
              </Link>
              <Link
                href="/akademik"
                className="text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 px-2 lg:px-3 py-2 text-sm font-medium transition-colors"
              >
                Akademik
              </Link>
              <Link
                href="/toko"
                className="text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 px-2 lg:px-3 py-2 text-sm font-medium transition-colors"
              >
                Toko
              </Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Dark Mode Toggle - Always visible */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 sm:p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              )}
            </button>

            {/* Auth Buttons - Hidden on small mobile */}
            {!isLogin ? (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="bg-brand-500 hover:bg-brand-600 text-white px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Daftar
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

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Optimized for touch */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-3 text-base font-medium text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors rounded-lg"
            >
              Beranda
            </Link>
            <Link
              href="/cari-kerja"
              className="block px-3 py-3 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors rounded-lg"
            >
              Cari Kerja
            </Link>
            <Link
              href="/akademi"
              className="block px-3 py-3 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors rounded-lg"
            >
              Akadmi
            </Link>
            <Link
              href="/toko"
              className="block px-3 py-3 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors rounded-lg"
            >
              Toko
            </Link>

            {!isLogin ? (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3 sm:hidden">
                <Link
                  href="/login"
                  className="block w-full text-left px-3 py-3 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors rounded-lg"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="block w-full text-left px-3 py-3 text-base font-medium bg-brand-600 hover:bg-brand-700 text-white rounded-lg mt-2 transition-colors"
                >
                  Daftar
                </Link>
              </div>
            ) : (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3 sm:hidden">
                <Link
                  href="/dashboard"
                  className="block w-full text-left px-3 py-3 text-base font-medium bg-brand-600 hover:bg-brand-700 text-white rounded-lg mt-2 transition-colors"
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
