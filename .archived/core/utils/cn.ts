import { clsx, type ClassValue } from "clsx";

/**
 * Simplified class name utility that doesn't require external dependencies
 * If clsx is available, it will use that, otherwise it will join classes with a space
 */
export function cn(...inputs: ClassValue[]): string {
  try {
    // Use clsx if available
    return clsx(inputs);
  } catch (e) {
    // Fallback implementation - just join with spaces and filter out falsy values
    return inputs.flat().filter(Boolean).join(" ").trim();
  }
}
