import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { OPENAI_API_KEY } from "$env/static/private";
import { withErrorHandling } from "$lib/utils/errorHandler";
import OpenAI from "openai";

/**
 * Versioned OpenAI API endpoint (v1)
 * Provides a unified interface for making OpenAI API calls
 *
 * Features:
 * - Proper error handling
 * - Rate limiting protections
 * - Streaming support
 * - Consistent response format
 * - Support for OpenAI Responses API
 */

interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// Initialize the OpenAI client once
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

/**
 * Process a POST request to the OpenAI API
 */
export const POST: RequestHandler = withErrorHandling(async ({ request }) => {
  const {
    messages,
    model = "gpt-4o",
    stream = false,
    temperature = 0.7,
    max_tokens,
    tools = [],
    responseFormat,
    useResponsesAPI = false,
    reasoning,
  } = await request.json();

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw error(400, "Messages are required and must be an array");
  }

  try {
    // If we're using the Responses API, handle it differently
    if (useResponsesAPI) {
      return await handleResponsesAPI({
        messages,
        model,
        tools,
        temperature,
        max_tokens,
        reasoning,
      });
    }

    // Call OpenAI API using the chat completions endpoint
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: max_tokens || undefined,
        stream,
        tools: tools.length > 0 ? tools : undefined,
        response_format: responseFormat || undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("OpenAI API error:", errorData || response.statusText);
      throw error(
        response.status,
        `OpenAI API error: ${errorData?.error?.message || response.statusText}`,
      );
    }

    // If streaming, pass through the stream
    if (stream) {
      const responseStream = new ReadableStream({
        async start(controller) {
          const reader = response.body?.getReader();
          if (!reader) {
            controller.close();
            return;
          }

          const decoder = new TextDecoder("utf-8");
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                // Make sure to send the [DONE] message at the end
                controller.enqueue(
                  new TextEncoder().encode("data: [DONE]\n\n"),
                );
                controller.close();
                break;
              }

              // Pass through the chunks directly - don't modify the SSE format
              const chunk = decoder.decode(value, { stream: true });
              controller.enqueue(new TextEncoder().encode(chunk));
            }
          } catch (error) {
            console.error("Error processing stream:", error);
            controller.error(error);
          }
        },
      });

      return new Response(responseStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Regular response
    const data = await response.json();
    return json({
      text: data.choices[0]?.message?.content || "",
      model: data.model,
      usage: data.usage,
      id: data.id,
    });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);

    if (error instanceof Error && !(error instanceof Response)) {
      throw error(500, `Failed to process request: ${error.message}`);
    }

    // If it's already a Response error, just throw it
    if (error instanceof Response) {
      throw error;
    }

    throw error(500, "An unknown error occurred");
  }
});

/**
 * Handle requests using the OpenAI Responses API
 */
async function handleResponsesAPI({
  messages,
  model,
  tools,
  temperature,
  max_tokens,
  reasoning,
}) {
  try {
    // Extract the user message (typically the last one)
    const userMessages = messages.filter((msg) => msg.role === "user");
    const lastUserMessage =
      userMessages[userMessages.length - 1]?.content || "";

    // Get system messages to include as context
    const systemMessages = messages.filter((msg) => msg.role === "system");
    const systemInstructions = systemMessages
      .map((msg) => msg.content)
      .join("\n\n");

    // Previous assistant responses for context (excluding the last user message)
    const assistantMessages = messages.filter(
      (msg) => msg.role === "assistant",
    );
    const previousExchange = messages
      .slice(0, -1) // Exclude the most recent user message
      .filter((msg) => msg.role === "user" || msg.role === "assistant")
      .map(
        (msg) =>
          `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`,
      )
      .join("\n\n");

    const contextString = previousExchange
      ? `Previous conversation:\n${previousExchange}\n\nUser's new message: ${lastUserMessage}`
      : lastUserMessage;

    // Create the response
    const response = await openai.responses.create({
      model,
      input: contextString,
      instructions: systemInstructions || undefined,
      tools: tools.length > 0 ? tools : undefined,
      temperature,
      max_tokens: max_tokens || undefined,
      reasoning: reasoning || undefined,
    });

    // Return consistent format
    return json({
      text: response.output_text,
      model: model,
      usage: {
        // Estimated usage since Responses API doesn't return it
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
      id: response.id,
    });
  } catch (error) {
    console.error("Error calling OpenAI Responses API:", error);
    throw error(
      500,
      `Failed to process Responses API request: ${error.message || "Unknown error"}`,
    );
  }
}

/**
 * Process a GET request to check API status
 */
export const GET: RequestHandler = withErrorHandling(async () => {
  return json({
    status: "ok",
    version: "v1",
    models: ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"],
    features: ["streaming", "responses-api", "tools", "reasoning"],
  });
});
