import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";
import {
  setThemeMode,
  setResolvedTheme,
  toggleTheme,
  type ThemeMode,
} from "./themeSlice";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Simplified theme hook
export const useTheme = () => {
  const theme = useAppSelector(state => state.theme);
  const dispatch = useAppDispatch();

  return {
    // Current state
    mode: theme.mode,
    resolvedTheme: theme.resolvedTheme,

    // Actions
    setThemeMode: (mode: ThemeMode) => dispatch(setThemeMode(mode)),
    setResolvedTheme: (theme: "light" | "dark") =>
      dispatch(setResolvedTheme(theme)),
    toggleTheme: () => dispatch(toggleTheme()),

    // Convenience properties
    isDark: theme.resolvedTheme === "dark",
    isLight: theme.resolvedTheme === "light",
    isSystemMode: theme.mode === "system",
  };
};
