"use client";

import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  setUsername,
  setDailyCalorieIntake,
  resetUserData,
} from "../../store/userDataSlice";
import Link from "next/link";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const userData = useAppSelector(state => state.userData);

  const [newUsername, setNewUsername] = useState(userData.username);
  const [newCalorieIntake, setNewCalorieIntake] = useState(
    userData.dailyCalorieIntake.toString()
  );

  const handleUpdateUsername = () => {
    dispatch(setUsername(newUsername));
  };

  const handleUpdateCalorieIntake = () => {
    const calories = parseInt(newCalorieIntake);
    if (!isNaN(calories) && calories > 0) {
      dispatch(setDailyCalorieIntake(calories));
    }
  };

  const handleResetData = () => {
    dispatch(resetUserData());
    setNewUsername("");
    setNewCalorieIntake("2000");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">User Profile</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Back to Home
          </Link>
        </div>

        {/* User Data Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter username"
                />
                <button
                  onClick={handleUpdateUsername}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Update
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Calorie Intake
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newCalorieIntake}
                  onChange={e => setNewCalorieIntake(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter daily calorie intake"
                />
                <button
                  onClick={handleUpdateCalorieIntake}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Update
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="font-semibold text-gray-800 mb-2">
              Current Profile
            </h3>
            <p>
              <strong>Username:</strong> {userData.username || "Not set"}
            </p>
            <p>
              <strong>Daily Calorie Intake:</strong>{" "}
              {userData.dailyCalorieIntake} calories
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleResetData}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Reset Profile Data
            </button>
          </div>
        </div>

        {/* Data Persistence Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">
            ℹ️ Data Persistence
          </h3>
          <p className="text-blue-700 text-sm">
            All your profile data is automatically saved to localStorage and
            will be restored when you refresh the page.
          </p>
        </div>
      </div>
    </div>
  );
}
