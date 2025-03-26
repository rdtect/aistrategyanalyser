import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  // Get the API key from environment variables
  const apiKey = process.env.OPENAI_API_KEY || "";

  // Return the key (in production, this should have additional security)
  return json({
    key: apiKey,
  });
};
