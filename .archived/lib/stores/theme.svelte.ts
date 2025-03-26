import { browser } from "$app/environment";
import { writable, derived } from "svelte/store";

type Theme = "light" | "dark";

// Create the base store
const themeStore = writable<Theme>(
  browser ? (localStorage.getItem("theme") as Theme) || "dark" : "dark"
);

// Derived stores
export const isDark = derived(themeStore, $theme => $theme === "dark");
export const logoSrc = derived(isDark, $isDark => `/logo-${$isDark ? "dark" : "light"}.svg`);

// Subscribe to changes and update DOM
if (browser) {
  themeStore.subscribe($theme => {
    document.documentElement.setAttribute("data-theme", $theme);
    document.documentElement.classList.toggle("dark", $theme === "dark");
    updateLogo($theme === "dark");
  });
}

// Helper functions
function updateLogo(isDark: boolean) {
  if (!browser) return;
  const logo = document.querySelector("img[data-logo]");
  if (logo) {
    logo.setAttribute("src", `/logo-${isDark ? "dark" : "light"}.svg`);
  }
}

export function toggleTheme() {
  themeStore.update($theme => {
    const newTheme = $theme === "light" ? "dark" : "light";
    if (browser) {
      localStorage.setItem("theme", newTheme);
    }
    return newTheme;
  });
}

export function getCurrentTheme() {
  let currentTheme: Theme = "dark";
  themeStore.subscribe(theme => {
    currentTheme = theme;
  })();
  return currentTheme;
}

export function getIsDark() {
  let dark = true;
  isDark.subscribe(value => {
    dark = value;
  })();
  return dark;
}

export function getLogoSrc() {
  let src = "/logo-dark.svg";
  logoSrc.subscribe(value => {
    src = value;
  })();
  return src;
}

// Initialize on load
if (browser) {
  window.addEventListener("DOMContentLoaded", () => {
    updateLogo(getCurrentTheme() === "dark");
  });
}
