/**
 * Format a date to show only hours and minutes
 */
export function formatLastChecked(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
