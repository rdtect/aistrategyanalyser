/**
 * Compatibility layer for old API
 * Forwards requests to the versioned API endpoint
 * @deprecated Use /api/v1/openai instead
 */

import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

// Forward all requests to the versioned endpoint
export const POST: RequestHandler = async ({ request, fetch }) => {
  console.warn(
    "Deprecated API endpoint /api/chat used. Please migrate to /api/v1/openai",
  );

  // Forward the request to the new endpoint
  return fetch("/api/v1/openai", {
    method: "POST",
    headers: request.headers,
    body: request.body,
  });
};

// Also forward GET requests
export const GET: RequestHandler = async ({ request, url }) => {
  console.warn(
    "Deprecated API endpoint /api/chat used. Please migrate to /api/v1/openai",
  );

  // Build new URL with same params
  const newUrl = new URL("/api/v1/openai", url.origin);
  url.searchParams.forEach((value, key) => {
    newUrl.searchParams.append(key, value);
  });

  // Forward to new endpoint
  return fetch(newUrl, {
    method: "GET",
    headers: request.headers,
  });
};
