import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "$env/static/private";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export const GET: RequestHandler = async ({ url }) => {
  const model = url.searchParams.get("model") || "gpt-4o-mini";

  try {
    // Test the OpenAI Responses API connection with a simple request
    const response = await openai.responses.create({
      model: model,
      input: "Hello, this is a test message. Please respond with 'OK'.",
      max_output_tokens: 16,
    });

    // Check if we got a valid response
    const connected = response && response.status === "completed";

    return json({
      status: "ok",
      timestamp: new Date().toISOString(),
      openai: {
        connected,
        model: model,
        response: connected ? "Connection successful" : "No response received",
      },
    });
  } catch (error) {
    console.error("OpenAI API health check failed:", error);

    return json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        openai: {
          connected: false,
          model: model,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 500 }
    );
  }
};
