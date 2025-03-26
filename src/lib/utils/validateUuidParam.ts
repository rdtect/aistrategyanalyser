/**
 * Validates that the provided params contain a valid UUID
 * @param params The URL parameters object
 * @returns The validated UUID or null if invalid
 */
export function validateUuidParam(
  params: Record<string, string> | any,
): string | null {
  if (!params) {
    return null;
  }

  const id = params.id;

  if (!id || typeof id !== "string") {
    return null;
  }

  // UUID validation pattern
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidPattern.test(id)) {
    return null;
  }

  return id;
}
