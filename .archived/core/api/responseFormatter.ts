import { json } from "@sveltejs/kit";
import { ErrorType, type ErrorResponse } from "$lib/core/utils/errorHandling";

/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    type: ErrorType;
    details?: unknown;
  };
}

/**
 * Create a successful API response
 */
export function createSuccessResponse<T>(data: T, status = 200) {
  return json(
    {
      success: true,
      data,
    },
    { status },
  );
}

/**
 * Create an error API response
 */
export function createErrorResponse(
  message: string,
  type: ErrorType = ErrorType.UNKNOWN,
  details?: unknown,
  status = 400,
) {
  return json(
    {
      success: false,
      error: {
        message,
        type,
        details,
      },
    },
    { status },
  );
}

/**
 * Handle an error and create a standardized response
 */
export function handleApiErrorResponse(
  error: unknown,
  defaultMessage = "An unexpected error occurred",
  status = 500,
): Response {
  console.error("API Error:", error);

  if (error instanceof Error) {
    return createErrorResponse(
      error.message || defaultMessage,
      ErrorType.API,
      error.stack,
      status,
    );
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    "message" in error
  ) {
    const errorObj = error as ErrorResponse;
    return createErrorResponse(
      errorObj.message,
      errorObj.type,
      errorObj.details,
      status,
    );
  }

  return createErrorResponse(defaultMessage, ErrorType.UNKNOWN, error, status);
}

/**
 * Create a stream response for streaming data
 */
export function createStreamResponse(stream: ReadableStream) {
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
