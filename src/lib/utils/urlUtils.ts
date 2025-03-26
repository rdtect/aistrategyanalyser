/**
 * Simple URL utility functions that help extract and validate URL parameters
 */

/**
 * Extract a valid ID from URL parameters
 * @param params URL parameters object
 * @param paramName Name of the parameter to extract
 * @returns The ID if valid, null otherwise
 */
export function extractValidId(params: Record<string, string>, paramName: string = 'id'): string | null {
  if (!params || typeof params !== 'object') return null;
  
  const id = params[paramName];
  if (!id || typeof id !== 'string' || id.trim() === '') return null;
  
  return id.trim();
}

/**
 * Check if a string is a valid UUID
 * @param id String to check
 * @returns True if valid UUID, false otherwise
 */
export function isValidUuid(id: string): boolean {
  if (!id || typeof id !== 'string') return false;
  
  // Simple UUID validation regex
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Validate that a URL parameter is both present and a valid UUID
 * @param params URL parameters object
 * @param paramName Name of the parameter to validate
 * @returns The valid UUID if valid, null otherwise
 */
export function validateUuidParam(params: Record<string, string>, paramName: string = 'id'): string | null {
  const id = extractValidId(params, paramName);
  return id && isValidUuid(id) ? id : null;
}