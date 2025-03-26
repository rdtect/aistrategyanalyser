import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { checkOpenAIHealth } from "$lib/_archived/lib/server/services/openaiServer";

export const GET: RequestHandler = ({ url }) => {
  const model = url.searchParams.get("model") || "gpt-4";

  // Mock health data
  return json({
    status: "ok",
    timestamp: new Date().toISOString(),
    openai: {
      connected: true,
      model,
      error: undefined,
    },
  });
};
