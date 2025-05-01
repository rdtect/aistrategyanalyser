import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { version } from "$app/environment";
import { browser } from "$app/environment";
import { IDBService } from "$lib/services/IDBService";
import { logError } from "$lib/utils/errorHandler";
import { idbService } from "$lib/services/IDBService";

/**
 * Health check endpoint v1
 * Provides information about the application's health and status
 */

// Define the component status type
type ComponentStatus = {
  status: "ok" | "error" | "degraded" | "unknown" | "not_applicable";
  message?: string;
};

// Define the health response type
type HealthResponse = {
  status: "ok" | "degraded" | "error";
  version: string;
  timestamp: string;
  env: string;
  components: {
    api: ComponentStatus;
    storage: ComponentStatus;
  };
};

export const GET: RequestHandler = async () => {
  logError("Health check endpoint called", "GET /api/v1/health");
  let dbStatus = "unavailable";
  try {
    // Check if IDBService is available and try a simple read
    if (idbService) {
      const chats = await idbService.getAllChats(); // Simple read operation
      dbStatus = `ok (${chats.length} chats)`;
    } else {
      dbStatus = "not initialized in browser context";
    }
  } catch (error) {
    logError(error, "IDB Health Check Failed");
    dbStatus = `error: ${error instanceof Error ? error.message : String(error)}`;
  }

  // TODO: Add OpenAI health check if needed
  const openaiStatus = "ok"; // Placeholder

  const health: HealthResponse = {
    status: "ok",
    version: version || "development",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || "development",
    components: {
      api: { status: "ok" },
      storage: { status: "unknown" },
    },
  };

  // Check IndexedDB status if in browser
  if (browser) {
    try {
      // IDBService.initDB doesn't exist - test idbService instance instead
      if (idbService) {
        // Try a simple read operation to verify connectivity
        await idbService.getAllChats();
        health.components.storage.status = "ok";
      } else {
        health.components.storage = {
          status: "degraded",
          message: "IDBService instance not available",
        };
        health.status = "degraded";
      }
    } catch (error) {
      health.components.storage = {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      };
      health.status = "degraded";
    }
  } else {
    health.components.storage.status = "not_applicable";
  }

  // Set appropriate status code
  const status =
    health.status === "ok" ? 200 : health.status === "degraded" ? 200 : 503;

  return json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      dependencies: {
        database: dbStatus,
        openai: openaiStatus,
      },
    },
    { status },
  );
};
