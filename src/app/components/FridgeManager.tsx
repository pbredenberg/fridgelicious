"use client";

import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  addItem,
  removeItem,
  clearAllItems,
} from "../../store/fridgeContentsSlice";
import {
  setRecipes,
  clearRecipes,
  Recipe,
} from "../../store/recipeSuggestionsSlice";

export default function FridgeManager() {
  const dispatch = useAppDispatch();
  const fridgeItems = useAppSelector(state => state.fridgeContents.items);
  const savedRecipes = useAppSelector(state => state.recipeSuggestions.recipes);
  const lastUpdated = useAppSelector(
    state => state.recipeSuggestions.lastUpdated
  );

  const [newItem, setNewItem] = useState("");
  const [currentRecipes, setCurrentRecipes] = useState<Recipe[]>([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [recipeError, setRecipeError] = useState<string | null>(null);

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

  const handleClearSavedRecipes = () => {
    dispatch(clearRecipes());
  };

  const handleSaveRecipes = () => {
    if (currentRecipes.length > 0) {
      dispatch(
        setRecipes({ recipes: currentRecipes, fridgeItems: fridgeItems })
      );
      setCurrentRecipes([]); // Clear current recipes after saving
    }
  };

  const handleGetRecipes = async () => {
    if (fridgeItems.length === 0) {
      setRecipeError("Please add some items to your fridge first!");
      return;
    }

    setIsLoadingRecipes(true);
    setRecipeError(null);
    setCurrentRecipes([]); // Clear any existing current recipes

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: fridgeItems }),
      });

      const data = await response.json();

      if (data.success) {
        setCurrentRecipes(data.recipes); // Set to local state, not Redux
      } else {
        setRecipeError(data.error || "Failed to get recipe suggestions");
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setRecipeError(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsLoadingRecipes(false);
    }
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

        {/* Recipe Ideas Button */}
        <div className="mb-4">
          <button
            onClick={handleGetRecipes}
            disabled={isLoadingRecipes || fridgeItems.length === 0}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
          >
            {isLoadingRecipes ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Getting Recipe Ideas...
              </span>
            ) : (
              `🍳 Get Recipe Ideas (${fridgeItems.length} items)`
            )}
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
                <span className="text-gray-800">{item}</span>
                <button
                  onClick={() => handleRemoveItem(item)}
                  className="text-red-500 hover:text-red-700 font-bold text-lg"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recipe Error Display */}
      {recipeError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-800 mb-2">⚠️ Error</h3>
          <p className="text-red-700 text-sm">{recipeError}</p>
        </div>
      )}

      {/* Current Recipe Suggestions Display (not saved yet) */}
      {currentRecipes.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">🍳 New Recipe Ideas</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 bg-yellow-100 px-2 py-1 rounded">
                Not saved yet
              </span>
              <button
                onClick={handleSaveRecipes}
                className="px-4 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 font-semibold"
              >
                💾 Save Recipes
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentRecipes.map((recipe, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {recipe.recipe_name}
                </h3>

                <div className="mb-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      recipe.difficulty_level === "Easy"
                        ? "bg-green-100 text-green-800"
                        : recipe.difficulty_level === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {recipe.difficulty_level}
                  </span>
                </div>

                <div className="space-y-2 text-sm mb-3">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-16">
                      Time:
                    </span>
                    <span className="text-gray-600">
                      {recipe.estimated_cooking_time}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3">
                  {recipe.brief_description}
                </p>

                {recipe.main_ingredients &&
                  recipe.main_ingredients.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700 text-sm">
                        Ingredients:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {recipe.main_ingredients.map((ingredient, i) => (
                          <span
                            key={i}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saved Recipe Suggestions Display */}
      {savedRecipes.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">📚 Saved Recipe Ideas</h2>
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <span className="text-sm text-gray-500">
                  Saved: {new Date(lastUpdated).toLocaleDateString()}
                </span>
              )}
              <button
                onClick={handleClearSavedRecipes}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Clear Saved
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedRecipes.map((recipe, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {recipe.recipe_name}
                </h3>

                <div className="mb-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      recipe.difficulty_level === "Easy"
                        ? "bg-green-100 text-green-800"
                        : recipe.difficulty_level === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {recipe.difficulty_level}
                  </span>
                </div>

                <div className="space-y-2 text-sm mb-3">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-16">
                      Time:
                    </span>
                    <span className="text-gray-600">
                      {recipe.estimated_cooking_time}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3">
                  {recipe.brief_description}
                </p>

                {recipe.main_ingredients &&
                  recipe.main_ingredients.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700 text-sm">
                        Ingredients:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {recipe.main_ingredients.map((ingredient, i) => (
                          <span
                            key={i}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      )}

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
