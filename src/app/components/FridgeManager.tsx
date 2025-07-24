"use client";

import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  addItem,
  removeItem,
  clearAllItems,
} from "../../store/fridgeContentsSlice";

export default function FridgeManager() {
  const dispatch = useAppDispatch();
  const fridgeItems = useAppSelector(state => state.fridgeContents.items);

  const [newItem, setNewItem] = useState("");

  const handleAddItem = () => {
    if (newItem.trim()) {
      dispatch(addItem(newItem.trim()));
      setNewItem("");
    }
  };

  const handleRemoveItem = (item: string) => {
    dispatch(removeItem(item));
  };

  const handleClearAll = () => {
    dispatch(clearAllItems());
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Fridge Manager</h1>

      {/* Fridge Contents Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Fridge Contents</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            onKeyPress={e => e.key === "Enter" && handleAddItem()}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add food item"
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
            {fridgeItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <span className="flex-1">{item}</span>
                <button
                  onClick={() => handleRemoveItem(item)}
                  className="ml-2 px-2 py-1 text-red-500 hover:text-red-700 focus:outline-none"
                >
                  ×
                </button>
              </div>
            ))}
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
