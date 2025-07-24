"use client";

import { useTheme } from "../../store/hooks";

export default function ThemeToggle() {
  const { mode, setThemeMode } = useTheme();

  // Cycle through theme modes: light → dark → system → light...
  const cycleTheme = () => {
    if (mode === "light") {
      setThemeMode("dark");
    } else if (mode === "dark") {
      setThemeMode("system");
    } else {
      setThemeMode("light");
    }
  };

  // Get the appropriate icon and label for current mode
  const getThemeIcon = () => {
    switch (mode) {
      case "light":
        return (
          <svg
            className="w-5 h-5 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "dark":
        return (
          <svg
            className="w-5 h-5 text-blue-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        );
      case "system":
        return (
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const getThemeLabel = () => {
    switch (mode) {
      case "light":
        return "Light mode";
      case "dark":
        return "Dark mode";
      case "system":
        return "System mode";
      default:
        return "Toggle theme";
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="
        relative p-2 rounded-lg
        bg-gray-100 hover:bg-gray-200
        dark:bg-gray-800 dark:hover:bg-gray-700
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-900
      "
      aria-label={`Current theme: ${getThemeLabel()}. Click to cycle through themes.`}
      title={getThemeLabel()}
    >
      <div className="flex items-center justify-center transition-transform duration-200 hover:scale-110">
        {getThemeIcon()}
      </div>
    </button>
  );
}
