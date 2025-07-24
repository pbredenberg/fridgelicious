"use client";

import { useEffect, useState, useCallback } from "react";
import { useTheme } from "../../store/hooks";

interface ThemeProviderProps {
  children: React.ReactNode;
}

const MEDIA_QUERY = "(prefers-color-scheme: dark)";

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { mode, resolvedTheme, setResolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Simple system theme detection
  const getSystemTheme = useCallback((): "light" | "dark" => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light";
  }, []);

  // Simple theme application
  const applyTheme = useCallback((theme: "light" | "dark") => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, []);

  // Determine current theme
  const getCurrentTheme = useCallback((): "light" | "dark" => {
    return mode === "system" ? getSystemTheme() : (mode as "light" | "dark");
  }, [mode, getSystemTheme]);

  // Handle initial mount
  useEffect(() => {
    setMounted(true);

    const currentTheme = getCurrentTheme();
    applyTheme(currentTheme);

    if (currentTheme !== resolvedTheme) {
      setResolvedTheme(currentTheme);
    }
  }, [getCurrentTheme, resolvedTheme, setResolvedTheme, applyTheme]);

  // Handle theme changes
  useEffect(() => {
    if (!mounted) return;

    const currentTheme = getCurrentTheme();

    if (currentTheme !== resolvedTheme) {
      setResolvedTheme(currentTheme);
      applyTheme(currentTheme);
    }
  }, [mounted, getCurrentTheme, resolvedTheme, setResolvedTheme, applyTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || mode !== "system") return;

    const mediaQuery = window.matchMedia(MEDIA_QUERY);

    const handleChange = () => {
      const newTheme = getSystemTheme();
      setResolvedTheme(newTheme);
      applyTheme(newTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mode, mounted, getSystemTheme, setResolvedTheme, applyTheme]);

  // Prevent flash during SSR
  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
