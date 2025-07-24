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

  const handleClearAll = () => {
    dispatch(clearAllItems());
  };

  const handleChuckItem = (item: FoodItem) => {
    dispatch(chuckItem(item));
    dispatch(removeItem(item.id));
    toast.success(`Chucked ${item.name}!`, {
      icon: "🗑️",
      duration: 3000,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-center mb-8">Fridge Manager</h1>

      {/* Fridge Contents Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Fridge Contents</h2>

        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="text"
            value={newItemName}
            onChange={e => setNewItemName(e.target.value)}
            className="flex-1 min-w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add food item"
          />
          <input
            type="date"
            value={expirationDate}
            onChange={e => setExpirationDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddItem}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Add
          </button>
          <button
            onClick={handleClearAll}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Clear All
          </button>
        </div>

        {fridgeItems.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No items in fridge</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {fridgeItems.map((item: FoodItem) => {
              const expirationStatus = getExpirationStatus(item.expirationDate);
              const isExpired = expirationStatus.isExpired;
              const isExpiringSoon = expirationStatus.isExpiringSoon;

              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-md ${
                    isExpired
                      ? "bg-red-50 border-2 border-red-200"
                      : isExpiringSoon
                        ? "bg-yellow-50 border-2 border-yellow-200"
                        : "bg-gray-50"
                  }`}
                >
                  <div className="flex-1">
                    <span
                      className={`font-medium ${
                        isExpired
                          ? "text-red-700"
                          : isExpiringSoon
                            ? "text-yellow-700"
                            : ""
                      }`}
                    >
                      {item.name}
                    </span>
                    <p
                      className={`text-sm ${
                        isExpired
                          ? "text-red-600"
                          : isExpiringSoon
                            ? "text-yellow-600"
                            : "text-gray-500"
                      }`}
                    >
                      Expires: {item.expirationDate}
                      {isExpired && " (EXPIRED)"}
                      {isExpiringSoon && !isExpired && " (Expiring Soon)"}
                    </p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    {isExpired && (
                      <button
                        onClick={() => handleChuckItem(item)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Chuck It
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="px-2 py-1 text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Persistence Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">
          ℹ️ Data Persistence
        </h3>
        <p className="text-blue-700 text-sm">
          All your fridge data is automatically saved to localStorage and will
          be restored when you refresh the page.
        </p>
      </div>
    </div>
  );
}
