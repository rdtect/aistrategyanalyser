import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { OPENAI_API_KEY } from "$env/static/private";

/**
 * API endpoint for streaming OpenAI responses
 * Returns a stream of text chunks as they're generated
 */
export const POST: RequestHandler = async ({ request }) => {
  console.log("[stream API] Received request");

  try {
    // Parse the request body
    const body = await request.json();
    console.log("[stream API] Request body:", JSON.stringify(body));

    // Extract input from message property if present
    const input = body.input || body.message; // Accept either input or message
    const options = body.options || {};

    // Validate input
    if (!input) {
      console.error("[stream API] Input is undefined or null");
      return json({ error: "Input is required" }, { status: 400 });
    }

    // Prepare the request to OpenAI
    const openaiRequest = {
      model: options?.model || "gpt-4o",
      input: input,
      stream: true,
      temperature: options?.temperature || 1,
      tools: options?.tools || [],
      instructions: options?.instructions || null,
    };

    console.log(
      "[stream API] Sending to OpenAI:",
      JSON.stringify(openaiRequest),
    );

    // Make the actual API call to OpenAI
    const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "OpenAI-Beta": "responses=v1", // Required for new Responses API
      },
      body: JSON.stringify(openaiRequest),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error("[stream API] OpenAI API error:", errorData);
      return json(
        { error: errorData.error?.message || "OpenAI API error" },
        { status: openaiResponse.status },
      );
    }

    const stream = openaiResponse.body;
    if (!stream) {
      throw new Error("Failed to get stream from OpenAI");
    }

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("[stream API] Error:", error);
    return json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
};

// Stream response helper
function streamResponse(res: ReadableStream): Response {
  return new Response(res, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
