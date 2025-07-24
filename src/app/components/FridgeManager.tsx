"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  addItem,
  removeItem,
  clearAllItems,
  FoodItem,
} from "../../store/fridgeContentsSlice";
import { useExpirationNotifications } from "../../hooks/useExpirationNotifications";
import { chuckItem } from "../../store/wasteTrackerSlice";
import { getExpirationStatus } from "../../utils/expirationUtils";

export default function FridgeManager() {
  const dispatch = useAppDispatch();
  const fridgeItems = useAppSelector(state => state.fridgeContents.items);

  // Enable expiration notifications
  useExpirationNotifications(fridgeItems);

  const [newItemName, setNewItemName] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  const handleAddItem = () => {
    const isValidInput = newItemName.trim() && expirationDate;

    if (isValidInput) {
      dispatch(addItem({ name: newItemName.trim(), expirationDate }));
      toast.success(`Added ${newItemName.trim()} to fridge!`, {
        icon: "✅",
        duration: 3000,
      });
      setNewItemName("");
      setExpirationDate("");
    }
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeItem(id));
  };

  const handleChuckItem = (item: FoodItem) => {
    dispatch(chuckItem(item));
    dispatch(removeItem(item.id));
    toast.success(`Chucked ${item.name}!`, {
      icon: "🗑️",
      duration: 3000,
    });
  };

  const handleClearAll = () => {
    dispatch(clearAllItems());
  };

  const formatExpirationDate = (expirationDate: string | null) => {
    if (!expirationDate) return "No expiration date";
    const date = new Date(expirationDate);
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg transition-colors duration-200">
      <Toaster position="top-right" />

      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        Fridge Manager
      </h2>

      {/* Add Item Form */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg transition-colors duration-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 transition-colors duration-200">
          Add New Item
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Item name"
            value={newItemName}
            onChange={e => setNewItemName(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
          />
          <input
            type="date"
            value={expirationDate}
            onChange={e => setExpirationDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
          />
          <button
            onClick={handleAddItem}
            className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Add Item
          </button>
        </div>
      </div>

      {/* Fridge Contents */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
            Current Items ({fridgeItems.length})
          </h3>
          {fridgeItems.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-md hover:bg-red-600 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
            >
              Clear All
            </button>
          )}
        </div>

        {fridgeItems.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8 transition-colors duration-200">
            Your fridge is empty. Add some items to get started!
          </p>
        ) : (
          <div className="space-y-2">
            {fridgeItems.map((item: FoodItem) => {
              const expirationStatus = getExpirationStatus(item.expirationDate);
              const isExpired = expirationStatus.isExpired;
              const isExpiringSoon = expirationStatus.isExpiringSoon;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border transition-colors duration-200 ${
                    isExpired
                      ? "bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800"
                      : isExpiringSoon
                        ? "bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-800"
                        : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <span className="text-gray-900 dark:text-gray-100 transition-colors duration-200">
                        {item.name}
                      </span>
                      <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                        {formatExpirationDate(item.expirationDate)}
                        {isExpired && (
                          <span className="ml-2 text-red-600 dark:text-red-400 font-medium">
                            (Expired)
                          </span>
                        )}
                        {isExpiringSoon && !isExpired && (
                          <span className="ml-2 text-yellow-600 dark:text-yellow-400 font-medium">
                            (Expires Soon)
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleChuckItem(item)}
                        className="px-3 py-1 bg-orange-500 dark:bg-orange-600 text-white text-sm rounded hover:bg-orange-600 dark:hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200"
                      >
                        Chuck
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="px-3 py-1 bg-red-500 dark:bg-red-600 text-white text-sm rounded hover:bg-red-600 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
