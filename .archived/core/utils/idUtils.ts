// src/lib/core/utils/idUtils.ts
// Simple ID generation without external dependencies

/**
 * Generates a unique ID string for use as an identifier
 */
export function generateId(): string {
  // Simple UUID v4 implementation that doesn't require external dependencies
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Validates if a string is a valid ID
 */
export function isValidId(id: string): boolean {
  // Check for UUID format
  return (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      id,
    ) ||
    // Check for CUID format (for backwards compatibility)
    /^c[a-z0-9]{24}$/.test(id) ||
    // CUID2 format
    /^[a-z0-9]{24}$/.test(id)
  );
}
