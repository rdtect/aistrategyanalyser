/**
 * Compatibility layer for old API
 * Forwards requests to the versioned API endpoint
 * @deprecated Use /api/v1/chats instead
 */

import type { RequestHandler } from "./$types";

// Forward all requests to the versioned endpoint
export const GET: RequestHandler = async ({ request, fetch }) => {
  console.warn(
    "Deprecated API endpoint /api/chats used. Please migrate to /api/v1/chats",
  );

  return fetch("/api/v1/chats", {
    method: "GET",
    headers: request.headers,
  });
};

export const POST: RequestHandler = async ({ request, fetch }) => {
  console.warn(
    "Deprecated API endpoint /api/chats used. Please migrate to /api/v1/chats",
  );

  return fetch("/api/v1/chats", {
    method: "POST",
    headers: request.headers,
    body: request.body,
  });
};
