"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * ThemeSwitcher Component
 * 
 * Logic:
 * 1. Mode Detection: Detects current theme (light, dark, system).
 * 2. Interaction: Allows users to cycle through theme options.
 * 3. Persistence: next-themes handles storage and hydration.
 */
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 border border-stone-200 dark:border-stone-800 rounded-md animate-pulse bg-stone-50 dark:bg-stone-900" />
    );
  }

  return (
    <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-1">
      <button
        onClick={() => setTheme("light")}
        className={`p-1.5 rounded-md transition-all ${
          theme === "light"
            ? "bg-white text-stone-900 shadow-sm"
            : "text-stone-500 hover:text-stone-700"
        }`}
        title="Light Mode"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-1.5 rounded-md transition-all ${
          theme === "dark"
            ? "bg-stone-800 text-white shadow-sm"
            : "text-stone-500 hover:text-stone-400"
        }`}
        title="Dark Mode"
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-1.5 rounded-md transition-all ${
          theme === "system"
            ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm"
            : "text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
        }`}
        title="System Preference"
      >
        <Monitor className="w-4 h-4" />
      </button>
    </div>
  );
}
