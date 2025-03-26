/**
 * Common formatting utilities for consistent data display
 */

/**
 * Format a date string into a localized date
 * @param dateString ISO date string
 * @param options Date formatting options
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
): string {
  try {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", options).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString || "";
  }
}

/**
 * Format a number with the specified options
 * @param value Number to format
 * @param options Number formatting options
 * @returns Formatted number string
 */
export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {
    maximumFractionDigits: 2,
  },
): string {
  try {
    return new Intl.NumberFormat("en-US", options).format(value);
  } catch (error) {
    console.error("Error formatting number:", error);
    return String(value);
  }
}

/**
 * Truncate text to a specified length and add ellipsis if needed
 * @param text Text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Format a file size in bytes to a human-readable string (KB, MB, GB)
 * @param bytes File size in bytes
 * @param decimals Number of decimal places to show
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
  );
}

/**
 * Format a message timestamp for chat display
 * @param timestamp ISO date string
 * @returns Formatted time string (e.g., "2:45 PM" or "Mar 15" if not today)
 */
export function formatMessageTime(timestamp: string): string {
  try {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();

    // Check if the message is from today
    if (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    ) {
      // Format as time only for today's messages
      return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(date);
    } else if (date.getFullYear() === now.getFullYear()) {
      // Format as month and day for this year
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date);
    } else {
      // Format with year for older messages
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    }
  } catch (error) {
    console.error("Error formatting message time:", error);
    return "";
  }
}
