/**
 * Theme store for managing light/dark mode
 * Follows the Zen of Python: Simple is better than complex
 */
import { browser } from "$app/environment";

type Theme = "light" | "dark";

// Define the store interface first to avoid circular reference
interface ThemeStore {
  current: Theme;
  toggle: () => void;
  setTheme: (newTheme: Theme) => void;
}

// Singleton instance for store
let _instance: ThemeStore | null = null;

/**
 * Create the theme store
 */
export function createThemeStore(): ThemeStore {
  if (_instance) return _instance;

  // Theme state - use 'let' for $state variables that will be reassigned
  let theme = $state<Theme>("dark");

  // Initialize theme from localStorage or system preference
  function init() {
    if (!browser) return;

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      theme = savedTheme;
    } else {
      // Check for system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      theme = prefersDark ? "dark" : "light";
    }

    // Apply theme to document
    updateDocumentTheme();
  }

  // Toggle between light and dark mode
  function toggle() {
    theme = theme === "light" ? "dark" : "light";

    if (browser) {
      localStorage.setItem("theme", theme);
      updateDocumentTheme();
    }
  }

  // Set specific theme
  function setTheme(newTheme: Theme) {
    theme = newTheme;

    if (browser) {
      localStorage.setItem("theme", theme);
      updateDocumentTheme();
    }
  }

  // Apply theme to document element
  function updateDocumentTheme() {
    if (!browser) return;

    const htmlElement = document.documentElement;

    if (theme === "dark") {
      htmlElement.classList.add("dark");
      htmlElement.setAttribute("data-theme", "dark");
    } else {
      htmlElement.classList.remove("dark");
      htmlElement.setAttribute("data-theme", "light");
    }
  }

  // Listen for system theme changes
  if (browser) {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
          setTheme(e.matches ? "dark" : "light");
        }
      });
  }

  // Initialize on creation
  init();

  // Store interface
  _instance = {
    get current() {
      return theme;
    },
    toggle,
    setTheme,
  };

  return _instance;
}

// Export singleton instance
export const themeStore = createThemeStore();
