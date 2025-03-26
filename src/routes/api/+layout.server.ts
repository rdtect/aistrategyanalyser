import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

/**
 * API Root Layout Server
 * Handles common API tasks like:
 * - API versioning
 * - Authentication for API routes
 * - Metrics and logging
 */

export const load: LayoutServerLoad = async ({ url, route }) => {
  // Check if this is the root API path
  if (url.pathname === "/api") {
    // Redirect to v1 if no version specified
    redirect(308, "/api/v1");
  }

  // Get the API version from the path
  const pathParts = url.pathname.split("/");
  const versionIndex = pathParts.findIndex((part) => part === "api") + 1;
  const version = pathParts[versionIndex] || "v1";

  // Common data for all API routes
  return {
    version,
    timestamp: new Date().toISOString(),
    apiRoot: "/api/" + version,
  };
};
