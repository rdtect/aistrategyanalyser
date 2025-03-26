/**
 * Adapter Pattern for Type Conversion
 *
 * This pattern provides a way to convert one type into another,
 * making incompatible interfaces work together.
 */

/**
 * Base Adapter interface that defines the contract for adapters
 */
export interface Adapter<FromType, ToType> {
  adapt(from: FromType): ToType;
}

/**
 * Create a type-safe adapter function
 */
export function createAdapter<FromType, ToType>(
  adaptFn: (from: FromType) => ToType,
): Adapter<FromType, ToType> {
  return {
    adapt: adaptFn,
  };
}

/**
 * A simple implementation of optional property handler
 * Useful for normalizing objects with missing properties
 */
export function withDefault<T>(value: T | undefined, defaultValue: T): T {
  return value !== undefined ? value : defaultValue;
}

/**
 * Safe type conversion helper
 * Ensures a value conforms to the expected type or returns a default
 */
export function ensureType<T>(value: any, defaultValue: T): T {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  return value as T;
}

/**
 * Safely extract a nested property from an object
 */
export function safeGet<T>(obj: any, path: string, defaultValue: T): T {
  if (!obj) return defaultValue;

  const keys = path.split(".");
  let result = obj;

  for (const key of keys) {
    if (result === undefined || result === null) {
      return defaultValue;
    }
    result = result[key];
  }

  return result !== undefined && result !== null ? (result as T) : defaultValue;
}
