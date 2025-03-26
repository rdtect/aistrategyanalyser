import type { Message } from "$lib/types/chat";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function handleApiError(error: unknown): Response {
  console.error("API Error:", error);

  if (error instanceof ApiError) {
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.details,
      }),
      { status: error.status },
    );
  }

  return new Response(
    JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }),
    { status: 500 },
  );
}

export function createSystemErrorMessage(error: unknown): Message {
  const errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred";

  return {
    id: crypto.randomUUID(),
    content: `Error: ${errorMessage}. Please try again.`,
    sender: "system",
    status: "error",
    timestamp: new Date().toISOString(),
    index: -1,
  };
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function createValidationError(
  message: string,
  details?: unknown,
): ApiError {
  return new ApiError(message, 400, details);
}

export function createAuthenticationError(
  message: string = "Authentication failed",
): ApiError {
  return new ApiError(message, 401);
}

export function createRateLimitError(
  message: string = "Rate limit exceeded",
): ApiError {
  return new ApiError(message, 429);
}
