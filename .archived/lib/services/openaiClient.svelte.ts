/**
 * Client-side OpenAI service using Svelte 5 runes
 * This service handles interactions with OpenAI via our server API endpoints
 */

import type { OpenAIRequestOptions } from "./openaiService";

export interface StreamControls {
  isStreaming: boolean;
  cancel: () => void;
}

// Create a singleton instance
let clientInstance: ReturnType<typeof createInternalOpenAIClient> | null = null;

/**
 * Internal function to create the client
 */
function createInternalOpenAIClient() {
  // Track streaming state
  let isStreaming = $state(false);
  let abortController: AbortController | null = $state(null);
  let apiKey = $state("");
  let keyFetchAttempted = $state(false);

  // Function to get API key securely from server
  async function fetchApiKey() {
    // Skip if already attempted
    if (keyFetchAttempted) return false;

    keyFetchAttempted = true;

    try {
      const response = await fetch("/api/ai/key");
      if (!response.ok) throw new Error("Failed to fetch API key");
      const data = await response.json();
      apiKey = data.key;
      return true;
    } catch (error) {
      console.error("Error fetching API key:", error);
      return false;
    }
  }

  // Initialize method - doesn't immediately fetch to avoid SSR issues
  function initialize() {
    if (typeof window !== "undefined") {
      // Only fetch in browser environment
      fetchApiKey();
    }
  }

  /**
   * Generate a non-streaming AI response
   */
  async function generateResponse(
    input: string,
    options: OpenAIRequestOptions = {},
  ) {
    try {
      const controller = new AbortController();
      abortController = controller;

      const response = await fetch("/api/ai/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input,
          options: {
            model: options.model || "gpt-4o",
            system: options.instructions,
            tools: options.tools,
            previousResponseId: options.previousResponseId,
          },
        }),
        signal: controller.signal,
      });

      abortController = null;

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to generate AI response");
      }

      return response.json();
    } catch (error) {
      abortController = null;
      if (error instanceof DOMException && error.name === "AbortError") {
        console.log("Request was aborted");
        return null;
      }
      throw error;
    }
  }

  /**
   * Generate a streaming AI response
   */
  async function generateStreamingResponse(
    input: string,
    options: OpenAIRequestOptions = {},
  ) {
    console.log(
      "[openaiClient] generateStreamingResponse called with input:",
      input,
    );
    console.log("[openaiClient] options:", options);

    if (!input || typeof input !== "string") {
      console.error("[openaiClient] Invalid input:", input);
      return mockStreamResponse(
        "Invalid input provided. Please try again with a valid message.",
      );
    }

    if (input.trim() === "") {
      console.error("[openaiClient] Empty input provided");
      return mockStreamResponse(
        "Empty input provided. Please try again with a valid message.",
      );
    }

    try {
      // Use the server endpoint with the new Responses API format
      console.log("[openaiClient] Sending request to API with input:", input);

      const response = await fetch("/api/ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input, // The user's message
          options: {
            model: options.model || "gpt-4o",
            instructions:
              options.instructions || "You are a helpful AI assistant.",
            tools: options.tools || [],
          },
        }),
      });

      console.log("[openaiClient] Received response:", response.status);

      // Check for non-200 responses
      if (!response.ok) {
        console.error("OpenAI API error:", response.status);
        // Fallback to mock stream in development
        return mockStreamResponse(
          "Error from OpenAI API. This is a fallback response.",
        );
      }

      console.log("OpenAI API response received successfully");

      // Process the SSE stream from the Responses API
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get reader from response");
      }

      // Simplify stream processing to reduce potential reactivity issues
      const processedStream = new ReadableStream({
        async start(controller) {
          const decoder = new TextDecoder();
          let buffer = "";

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                // Process any remaining data in buffer
                if (buffer.trim()) {
                  try {
                    parseAndEnqueueContent(buffer, controller);
                  } catch (e) {
                    console.error("Error processing final buffer:", e);
                  }
                }
                controller.close();
                break;
              }

              buffer += decoder.decode(value, { stream: true });

              // Process complete SSE events
              const completeEvents = buffer.split("\n\ndata: ");
              buffer = completeEvents.pop() || ""; // Keep the last incomplete chunk

              for (const event of completeEvents) {
                if (!event.trim()) continue;

                try {
                  const eventString = event.startsWith("data: ")
                    ? event
                    : `data: ${event}`;
                  parseAndEnqueueContent(eventString, controller);
                } catch (e) {
                  console.error("Error processing event:", e);
                }
              }
            }
          } catch (e) {
            console.error("Error reading stream:", e);
            controller.error(e);
          }
        },
      });

      // Helper function to parse SSE events and enqueue content
      function parseAndEnqueueContent(
        eventString: string,
        controller: ReadableStreamDefaultController,
      ) {
        try {
          const dataStart = eventString.indexOf("data: ");
          if (dataStart === -1) return;

          const jsonData = eventString.slice(dataStart + 6).trim();
          if (!jsonData) return;

          const eventData = JSON.parse(jsonData);

          // Extract text content from the structured response
          if (
            eventData.type === "message" &&
            eventData.content &&
            eventData.content.length > 0
          ) {
            for (const contentItem of eventData.content) {
              if (contentItem.type === "output_text") {
                controller.enqueue(new TextEncoder().encode(contentItem.text));
              }
            }
          }
        } catch (e) {
          console.error("Error parsing SSE data:", e);
        }
      }

      // Return the processed stream
      return {
        stream: processedStream,
        cancel: () => reader.cancel(),
      };
    } catch (error) {
      console.error("Error in generateStreamingResponse:", error);
      return mockStreamResponse(
        "Exception occurred. This is a fallback response.",
      );
    }
  }

  // Mock stream response for development/fallback
  function mockStreamResponse(message: string) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Split the message into chunks to simulate streaming
        const chunks = message.split(" ");
        let i = 0;

        const interval = setInterval(() => {
          if (i >= chunks.length) {
            clearInterval(interval);
            controller.close();
            return;
          }

          controller.enqueue(encoder.encode(chunks[i] + " "));
          i++;
        }, 150);
      },
    });

    return { stream, cancel: () => {} };
  }

  /**
   * Cancel any ongoing request
   */
  function cancelRequest() {
    if (abortController) {
      abortController.abort();
      abortController = null;
      isStreaming = false;
    }
  }

  /**
   * Check OpenAI API health
   */
  async function checkHealth(model = "gpt-4o") {
    try {
      const response = await fetch(`/api/health?model=${model}`);
      if (!response.ok) {
        throw new Error("Health check failed");
      }
      return await response.json();
    } catch (error) {
      console.error("Health check error:", error);
      throw error;
    }
  }

  // Fix the state reactivity issue
  const streaming = $derived.by(() => isStreaming);

  return {
    initialize,
    generateResponse,
    generateStreamingResponse,
    cancelRequest,
    checkHealth,
    get isStreaming() {
      return streaming;
    },
  };
}

/**
 * Get the singleton OpenAI client
 */
export function createOpenAIClient() {
  if (!clientInstance) {
    clientInstance = createInternalOpenAIClient();
  }
  return clientInstance;
}
