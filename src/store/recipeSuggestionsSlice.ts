import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Recipe {
  recipe_name: string;
  brief_description: string;
  main_ingredients: string[];
  estimated_cooking_time: string;
  difficulty_level: string;
}

interface RecipeSuggestionsState {
  recipes: Recipe[];
  lastUpdated: string | null;
  fridgeItemsUsed: string[];
}

const initialState: RecipeSuggestionsState = {
  recipes: [],
  lastUpdated: null,
  fridgeItemsUsed: [],
};

const recipeSuggestionsSlice = createSlice({
  name: "recipeSuggestions",
  initialState,
  reducers: {
    setRecipes: (
      state,
      action: PayloadAction<{ recipes: Recipe[]; fridgeItems: string[] }>
    ) => {
      state.recipes = action.payload.recipes;
      state.fridgeItemsUsed = action.payload.fridgeItems;
      state.lastUpdated = new Date().toISOString();
    },
    clearRecipes: state => {
      state.recipes = [];
      state.lastUpdated = null;
      state.fridgeItemsUsed = [];
    },
    addRecipe: (state, action: PayloadAction<Recipe>) => {
      if (
        !state.recipes.find(
          recipe => recipe.recipe_name === action.payload.recipe_name
        )
      ) {
        state.recipes.push(action.payload);
        state.lastUpdated = new Date().toISOString();
      }
    },
    removeRecipe: (state, action: PayloadAction<string>) => {
      state.recipes = state.recipes.filter(
        recipe => recipe.recipe_name !== action.payload
      );
      state.lastUpdated = new Date().toISOString();
    },
  },
});

export const { setRecipes, clearRecipes, addRecipe, removeRecipe } =
  recipeSuggestionsSlice.actions;
export default recipeSuggestionsSlice.reducer;
