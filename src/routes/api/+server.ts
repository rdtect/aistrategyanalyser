import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

/**
 * API Root Endpoint
 * Provides documentation and navigation for the API
 */

export const GET: RequestHandler = async ({ url }) => {
  const baseUrl = `${url.protocol}//${url.host}`;

  const apiDocs = {
    name: "AI Strategy Analyzer API",
    description: "API for the AI Strategy Analyzer application",
    version: "v1",
    baseUrl: `${baseUrl}/api/v1`,
    documentation: `${baseUrl}/api/docs`,
    endpoints: [
      {
        path: "/api/v1/openai",
        methods: ["POST", "GET"],
        description: "OpenAI integration endpoint for chat completions",
      },
      {
        path: "/api/v1/chats",
        methods: ["GET", "POST"],
        description: "Manage chat resources",
      },
      {
        path: "/api/v1/chats/:id",
        methods: ["GET", "PUT", "DELETE"],
        description: "Manage individual chat resources",
      },
      {
        path: "/api/v1/health",
        methods: ["GET"],
        description: "Health check endpoint",
      },
    ],
    notice: "This API is currently in development and subject to change.",
  };

  return json(apiDocs);
};
