/**
 * Client-side OpenAI service using Svelte 5 runes
 * This service handles interactions with OpenAI via our server API endpoints
 */

import type { OpenAIRequestOptions } from "./openaiService";

export interface StreamControls {
  isStreaming: boolean;
  cancel: () => void;
}

/**
 * Create client-side OpenAI service with reactive streaming state
 */
export function createOpenAIClient() {
  // Track streaming state
  let isStreaming = $state(false);
  let abortController: AbortController | null = $state(null);

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
    try {
      console.log(
        "Starting streaming request with input:",
        input.substring(0, 50) + "...",
      );
      console.log("Using options:", JSON.stringify(options, null, 2));

      isStreaming = true;
      const controller = new AbortController();
      abortController = controller;

      const response = await fetch("/api/ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          chatId: options.chatId,
          context: {
            previousResponseId: options.previousResponseId,
            model: options.model || "gpt-4o",
            webSearch: options.webSearch || false,
            ...options.context,
          },
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        console.error(
          "Stream response not OK:",
          response.status,
          response.statusText,
        );
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to generate AI response stream: ${response.status} ${response.statusText}`,
        );
      }

      console.log("Stream response OK, returning stream");

      return {
        stream: response.body,
        cancel: () => {
          controller.abort();
          isStreaming = false;
          abortController = null;
        },
      };
    } catch (error) {
      console.error("Streaming request failed:", error);
      isStreaming = false;
      abortController = null;
      throw error;
    }
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

  // For convenience in templates, create a $derived value
  const streaming = $derived(isStreaming);

  return {
    generateResponse,
    generateStreamingResponse,
    cancelRequest,
    checkHealth,
    get isStreaming() {
      return streaming;
    },
  };
}
