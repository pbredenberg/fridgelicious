"use client";

import Link from "next/link";
import { useAppSelector } from "../../store/hooks";

export default function Navbar() {
  const userData = useAppSelector(state => state.userData);

  return (
    <nav className="bg-white shadow-md border-b-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-gray-800 hover:text-gray-600"
            >
              FridgeLicious
            </Link>
          </div>

          {/* User Profile Link */}
          <div className="flex items-center">
            <Link
              href="/profile"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
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
