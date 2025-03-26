/**
 * Shared OpenAI service functions for client-side use
 */

import type { OpenAIRequestOptions } from "./openaiService";

/**
 * Generate an AI response using the non-streaming endpoint
 */
export async function generateAIResponse(
  input: string,
  options: OpenAIRequestOptions = {},
) {
  try {
    const response = await fetch("/api/ai/response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, options }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate AI response");
    }

    return response.json();
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
}

/**
 * Generate a streaming AI response
 * Returns a ReadableStream for incremental text processing
 */
export async function generateStreamingAIResponse(
  input: string,
  options: OpenAIRequestOptions = {},
) {
  try {
    const response = await fetch("/api/ai/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: input,
        context: {
          model: options.model,
          instructions: options.instructions,
          previousResponseId: options.previousResponseId,
          webSearch: !!options.tools?.some(
            (tool) =>
              tool.type === "web_search_preview" || tool.type === "web_search",
          ),
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Streaming response failed: ${errorText}`);
    }

    return {
      stream: response.body,
      contentType: response.headers.get("Content-Type"),
      processStream: async (onChunk: (text: string) => void): Promise<void> => {
        if (!response.body) throw new Error("Response body is null");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text = decoder.decode(value);
            onChunk(text);
          }
        } finally {
          reader.releaseLock();
        }
      },
    };
  } catch (error) {
    console.error("Error generating streaming response:", error);
    throw error;
  }
}

/**
 * Check the health of the OpenAI API
 */
export async function checkAPIHealth(model: string = "gpt-4o") {
  try {
    const response = await fetch(
      `/api/health?model=${encodeURIComponent(model)}`,
    );

    if (!response.ok) {
      throw new Error("Health check failed");
    }

    return response.json();
  } catch (error) {
    console.error("Health check error:", error);
    throw error;
  }
}
