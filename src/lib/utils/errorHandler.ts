/**
 * Central error handling utilities for the application
 */

import { browser } from "$app/environment";
import type { RequestHandler } from "@sveltejs/kit";

// Error types
export enum ErrorType {
  STORAGE = "storage",
  NETWORK = "network",
  VALIDATION = "validation",
  AUTH = "auth",
  UNKNOWN = "unknown",
}

/**
 * Error messages used throughout the application
 */
export const ErrorMessages = {
  INVALID_INPUT: "Invalid input data",
  NOT_FOUND: "Resource not found",
  UNAUTHORIZED: "Unauthorized access",
  SERVER_ERROR: "An unexpected error occurred",
  STORAGE_ERROR: "Failed to access storage",
};

/**
 * Format an error for user-friendly display
 *
 * @param error The error object
 * @param context Optional context about where the error occurred
 * @returns Formatted error message
 */
export function formatError(error: unknown, context?: string): string {
  if (error instanceof Error) {
    const message = error.message || ErrorMessages.SERVER_ERROR;
    return context ? `${context}: ${message}` : message;
  } else if (typeof error === "string") {
    return context ? `${context}: ${error}` : error;
  } else {
    return context
      ? `${context}: ${ErrorMessages.SERVER_ERROR}`
      : ErrorMessages.SERVER_ERROR;
  }
}

/**
 * Logs errors with consistent formatting
 * @param error The error to log
 * @param context The context in which the error occurred
 * @param metadata Additional information about the error
 */
export function logError(
  error: unknown,
  context: string,
  metadata: Record<string, any> = {},
): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  console.error(`[ERROR] ${context}: ${errorMessage}`, {
    ...metadata,
    timestamp: new Date().toISOString(),
    stack,
  });

  // In a production app, you might want to send this to an error tracking service
  if (browser && typeof window !== "undefined" && window.dispatchEvent) {
    try {
      window.dispatchEvent(
        new CustomEvent("app:error", {
          detail: {
            error: {
              message: errorMessage,
              name: error instanceof Error ? error.name : undefined,
              stack: stack,
            },
            source: context,
            details: metadata,
            time: new Date().toISOString(),
          },
        }),
      );
    } catch (e) {
      // Fail silently
    }
  }
}

/**
 * Wraps an async function with retry logic
 * @param fn The function to retry
 * @param maxAttempts Maximum number of retry attempts
 * @param baseDelay Base delay between retries in ms
 * @returns The result of the function
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 300,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < maxAttempts) {
        // Exponential backoff with jitter
        const delay =
          baseDelay * Math.pow(1.5, attempt - 1) * (0.9 + Math.random() * 0.2);
        console.warn(
          `Retry attempt ${attempt}/${maxAttempts} after ${Math.round(delay)}ms`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Higher-order function to wrap request handlers with consistent error handling
 * @param handler The request handler function
 * @returns A request handler with error handling
 */
export function withErrorHandling(handler: RequestHandler): RequestHandler {
  return async (event) => {
    try {
      return await handler(event);
    } catch (error) {
      logError(error, "API Handler", {
        url: event.url.pathname,
        method: event.request.method,
      });

      if (error instanceof Response) {
        // Pass through Response objects (like redirect)
        return error;
      }

      return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : String(error),
          status: "error",
          timestamp: new Date().toISOString(),
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  };
}
