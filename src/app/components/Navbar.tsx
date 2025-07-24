"use client";

import Link from "next/link";
import { useAppSelector } from "../../store/hooks";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const userData = useAppSelector(state => state.userData);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md border-b-2 border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-gray-800 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            >
              FridgeLicious
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              href="/waste-report"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors duration-200"
            >
              <span>📊</span>
              <span>Waste Report</span>
            </Link>
          </div>

          {/* Right side - Theme Toggle and User Profile */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Profile Link */}
            <Link
              href="/profile"
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200">
                <span className="text-white text-sm font-medium">
                  {userData.username
                    ? userData.username.charAt(0).toUpperCase()
                    : "U"}
                </span>
              </div>
              <span className="hidden sm:block">
                {userData.username || "User Profile"}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
