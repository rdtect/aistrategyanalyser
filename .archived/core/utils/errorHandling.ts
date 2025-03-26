// Standardized error handling utilities

/**
 * Error types for consistent error handling
 */
export enum ErrorType {
  API = "API_ERROR",
  VALIDATION = "VALIDATION_ERROR",
  NETWORK = "NETWORK_ERROR",
  AUTHENTICATION = "AUTH_ERROR",
  UNKNOWN = "UNKNOWN_ERROR",
}

/**
 * Structured error response
 */
export interface ErrorResponse {
  type: ErrorType;
  message: string;
  details?: unknown;
  friendlyMessage?: string;
}

/**
 * Handles API errors with consistent formatting
 */
export function handleApiError(error: unknown): ErrorResponse {
  // Handle specific error types
  if (error instanceof Error) {
    // Check for network errors
    if (error.message.includes("fetch") || error.message.includes("network")) {
      return {
        type: ErrorType.NETWORK,
        message: error.message,
        friendlyMessage:
          "Unable to connect to the server. Please check your internet connection.",
      };
    }

    // Handle authentication errors
    if (
      error.message.includes("authentication") ||
      error.message.includes("unauthorized")
    ) {
      return {
        type: ErrorType.AUTHENTICATION,
        message: error.message,
        friendlyMessage: "Authentication error. Please log in again.",
      };
    }

    // Default API error
    return {
      type: ErrorType.API,
      message: error.message,
      friendlyMessage: "An error occurred while processing your request.",
    };
  }

  // Handle validation errors (usually from form validation)
  if (typeof error === "object" && error !== null && "validation" in error) {
    return {
      type: ErrorType.VALIDATION,
      message: "Validation error",
      details: error,
      friendlyMessage: "Please check your input and try again.",
    };
  }

  // Unknown errors
  console.error("Unknown error:", error);
  return {
    type: ErrorType.UNKNOWN,
    message: "An unexpected error occurred",
    friendlyMessage: "Something went wrong. Please try again later.",
  };
}

/**
 * Creates a user-friendly error message
 */
export function getFriendlyErrorMessage(error: unknown): string {
  const errorResponse = handleApiError(error);
  return errorResponse.friendlyMessage || errorResponse.message;
}

/**
 * Logs errors to console with consistent formatting
 */
export function logError(error: unknown, context?: string): void {
  const errorResponse = handleApiError(error);
  if (context) {
    console.error(
      `Error in ${context}:`,
      errorResponse.message,
      errorResponse.details || "",
    );
  } else {
    console.error(errorResponse.message, errorResponse.details || "");
  }
}
