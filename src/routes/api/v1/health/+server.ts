import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { version } from "$app/environment";
import { browser } from "$app/environment";
import { IDBService } from "$lib/services/idb.svelte";

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
      await IDBService.initDB();
      health.components.storage.status = "ok";
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

  return json(health, { status });
};
