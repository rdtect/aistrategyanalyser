import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { OPENAI_API_KEY } from "$env/static/private";

/**
 * API endpoint for non-streaming OpenAI response generation
 * This endpoint wraps the OpenAI Responses API
 */
export const POST: RequestHandler = async ({ request }) => {
  console.log("[response API] Received request");

  try {
    // Parse the request body
    const body = await request.json();
    console.log("[response API] Request body:", JSON.stringify(body));

    const { input, options } = body;

    // Validate input
    if (!input) {
      return json({ error: "Input is required" }, { status: 400 });
    }

    // Prepare the request to OpenAI
    const openaiRequest = {
      model: options?.model || "gpt-4o",
      input: input,
      stream: true, // Enable streaming for real-time responses
      temperature: options?.temperature || 1,
      tools: options?.tools || [],
      instructions: options?.instructions || null,
    };

    console.log(
      "[response API] Sending to OpenAI:",
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

    // If streaming is enabled, pass the stream directly to the client
    if (openaiRequest.stream) {
      const responseStream = openaiResponse.body;
      if (!responseStream) {
        throw new Error("Failed to get stream from OpenAI");
      }

      return new Response(responseStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // For non-streaming responses, return the JSON
    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      return json(
        { error: errorData.error?.message || "OpenAI API error" },
        { status: openaiResponse.status },
      );
    }

    const responseData = await openaiResponse.json();
    return json(responseData);
  } catch (error) {
    console.error("[response API] Error:", error);
    return json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
};
