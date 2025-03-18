import { browser } from "$app/environment";

function initializeTheme() {
  if (!browser) return "dark"; // Default to dark mode on server

  const stored = localStorage.getItem("theme");
  if (stored) return stored;

  // Default to dark mode instead of using preference
  return "dark";
}

let currentTheme = $state(initializeTheme());

export function theme() {
  return currentTheme;
}

// Update the logo based on the current theme
function updateLogo(isDark: boolean) {
  if (!browser) return;

  // Find all logo images in the document
  const logoImages = document.querySelectorAll('img[src*="logo"]');

  logoImages.forEach((img) => {
    const imgElement = img as HTMLImageElement;
    // If it's a logo image, update the src
    if (imgElement.src.includes("/logo")) {
      // Update to the appropriate logo based on theme
      if (isDark && !imgElement.src.includes("-dark")) {
        imgElement.src = imgElement.src.replace("/logo", "/logo-dark");
      } else if (!isDark && imgElement.src.includes("-dark")) {
        imgElement.src = imgElement.src.replace("/logo-dark", "/logo");
      }
    }
  });
}

export function toggleTheme() {
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  currentTheme = newTheme; // Fix: assign to a variable first

  if (browser) {
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    // Toggle the dark class for Tailwind
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    // Update logo based on theme
    updateLogo(newTheme === "dark");
  }
}

// Initialize dark mode and logo on load
if (browser) {
  // Apply theme immediately to avoid flash
  document.documentElement.setAttribute("data-theme", currentTheme);
  document.documentElement.classList.toggle("dark", currentTheme === "dark");

  // Update logo after the DOM is loaded
  window.addEventListener("DOMContentLoaded", () => {
    updateLogo(currentTheme === "dark");
  });
}
