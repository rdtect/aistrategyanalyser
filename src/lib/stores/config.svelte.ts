// src/lib/stores/config.svelte.ts
import { browser } from "$app/environment";
import type { UserSettings } from "$lib/types";

// --- Default Settings ---
const defaultSettings: UserSettings = {
  profile: {
    name: "User",
  },
  theme: {
    darkMode: "system", // 'system' | 'dark' | 'light'
  },
  openai: {
    apiKey: "",
    model: "gpt-4o", // Default to newer model
    temperature: 0.7,
    maxTokens: 4096, // Match OpenAI defaults more closely if desired
  },
  preferences: {
    autoScroll: true,
  },
};

// --- Load Initial State ---
function loadInitialSettings(): UserSettings {
  if (!browser) {
    return defaultSettings; // Return default on server
  }
  try {
    const stored = localStorage.getItem("app_settings"); // Use a consistent key
    if (stored) {
      const parsed = JSON.parse(stored);
      // Deep merge stored settings with defaults to handle missing/new keys
      // A simple merge for now, enhance if deep nesting becomes complex
      const mergedSettings = {
        profile: { ...defaultSettings.profile, ...(parsed.profile || {}) },
        theme: { ...defaultSettings.theme, ...(parsed.theme || {}) },
        openai: { ...defaultSettings.openai, ...(parsed.openai || {}) },
        preferences: {
          ...defaultSettings.preferences,
          ...(parsed.preferences || {}),
        },
      };
      return mergedSettings as UserSettings; // Assert type after merge
    }
  } catch (e) {
    console.error("Failed to load settings from localStorage", e);
    localStorage.removeItem("app_settings"); // Clear potentially corrupted data
  }
  return defaultSettings;
}

// --- Create Global State ---
export const appSettings = $state(loadInitialSettings());

// --- Optional: Helper functions/actions ---
export function resetOpenAISettings() {
  // Create a new object to ensure reactivity triggers
  appSettings.openai = { ...defaultSettings.openai };
}

export function updateTheme(newTheme: "system" | "dark" | "light") {
  appSettings.theme.darkMode = newTheme;
  // Theme application logic (adding/removing 'dark' class) should
  // ideally react to this store change elsewhere (e.g., in AppBar or root layout effect)
}

console.log("Initial appSettings loaded:", appSettings);
