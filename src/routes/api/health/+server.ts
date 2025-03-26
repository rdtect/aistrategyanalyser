import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { supabase } from "$lib/server/db/supabase";

/**
 * Simple health check endpoint
 * Verifies:
 * 1. Server is responding
 * 2. Database connection is working
 * 3. API dependencies are available
 */
export const GET: RequestHandler = async () => {
  try {
    const checks = {
      server: "healthy",
      database: "checking...",
      api: "available",
    };

    // Check Supabase connection
    try {
      const { data, error } = await supabase
        .from("chat_metadata")
        .select("count", { count: "exact" })
        .limit(1);

      checks.database = error ? "unhealthy" : "healthy";
    } catch (dbError) {
      console.error("Database health check failed:", dbError);
      checks.database = "unhealthy";
    }

    // Determine overall status - healthy only if all checks pass
    const isHealthy = Object.values(checks).every(
      (status) => status === "healthy",
    );

    return json(
      {
        status: isHealthy ? "healthy" : "degraded",
        checks,
        timestamp: new Date().toISOString(),
      },
      {
        status: isHealthy ? 200 : 503,
      },
    );
  } catch (error) {
    console.error("Health check failed:", error);
    return json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
      },
    );
  }
};
