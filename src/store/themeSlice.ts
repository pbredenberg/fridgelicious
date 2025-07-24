import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the possible theme values
export type ThemeMode = "light" | "dark" | "system";

// Define what our theme state looks like
interface ThemeState {
  mode: ThemeMode; // Current theme setting (light/dark/system)
  resolvedTheme: "light" | "dark"; // Actual theme being used (never 'system')
}

// Initial state - start with system preference
const initialState: ThemeState = {
  mode: "system",
  resolvedTheme: "light", // Default fallback, will be updated based on system
};

// Create the theme slice
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    // Action to set a specific theme mode
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },

    // Action to set the resolved theme (what's actually displayed)
    setResolvedTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.resolvedTheme = action.payload;
    },

    // Action to toggle between light, dark, and system
    toggleTheme: state => {
      if (state.mode === "light") {
        state.mode = "dark";
        state.resolvedTheme = "dark";
      } else if (state.mode === "dark") {
        state.mode = "system";
        // resolvedTheme will be updated by ThemeProvider based on system
      } else {
        // If currently on system, go to light (completing the cycle)
        state.mode = "light";
        state.resolvedTheme = "light";
      }
    },
  },
});

// Export the actions so components can use them
export const { setThemeMode, setResolvedTheme, toggleTheme } =
  themeSlice.actions;

// Export the reducer to add to our store
export default themeSlice.reducer;
