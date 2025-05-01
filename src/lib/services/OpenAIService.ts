/**
 * Shared OpenAI service functions for client-side use
 * Updated to use versioned API endpoints
 */

import { browser } from "$app/environment";
import { ErrorMessages, logError, withRetry } from "$lib/utils/errorHandler";

// Define message format for OpenAI APIs
// Allow role 'tool' and associated properties
export type OpenAIMessage =
  | { role: "user"; content: string | null }
  | { role: "system"; content: string | null }
  | { role: "assistant"; content: string | null; tool_calls?: any[] }
  | { role: "tool"; content: string | null; tool_call_id: string };

// Define OpenAI request options interface
export interface OpenAIRequestOptions {
  model?: string;
  temperature?: number;
  systemMessage?: string;
  useStream?: boolean; // Control whether to use streaming
  tools?: Array<{ type: string; [key: string]: any }>;
  responseFormat?: {
    type: "text" | "json_object";
  };
  useResponsesAPI?: boolean;
  reasoning?: {
    effort?: "low" | "medium" | "high";
  };
}

// Define the unified response structure type
export type UnifiedAIResponseType = {
  response: {
    message: {
      content: string | null;
      tool_calls: any[] | undefined;
    };
  };
  metadata: any;
};

export class OpenAIService {
  constructor() {
    // Constructor logic if needed
  }

  async generateAIResponse(
    input: string | OpenAIMessage[],
    options: OpenAIRequestOptions = {},
  ): Promise<UnifiedAIResponseType> {
    try {
      const shouldStream =
        options.useStream ?? (typeof input === "string" && input.length > 100);
      if (shouldStream) {
        return this._generateStreamingResponse(input, options);
      }
      return this._generateStandardResponse(input, options);
    } catch (error) {
      logError(error, "OpenAIService.generateAIResponse");
      throw error;
    }
  }

  // Make helper methods private
  private async _generateStandardResponse(
    input: string | OpenAIMessage[],
    options: OpenAIRequestOptions = {},
  ): Promise<UnifiedAIResponseType> {
    const messages =
      typeof input === "string" ? [{ role: "user", content: input }] : input;
    if (options.systemMessage && !messages.some((m) => m.role === "system")) {
      messages.unshift({ role: "system", content: options.systemMessage });
    }

    const response = await fetch("/api/v1/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        model: options.model || "gpt-4o",
        temperature: options.temperature || 0.7,
        useResponsesAPI: options.useResponsesAPI !== false,
        reasoning: options.reasoning,
        tools: options.tools,
        responseFormat: options.responseFormat,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Failed to fetch or parse error" }));
      throw new Error(errorData?.error || "Failed to generate AI response");
    }

    const data = await response.json();

    if (data.text !== undefined) {
      return {
        response: { message: { content: data.text, tool_calls: undefined } },
        metadata: { model: data.model, usage: data.usage, id: data.id },
      };
    } else if (data.content !== undefined || data.tool_calls !== undefined) {
      return {
        response: {
          message: { content: data.content, tool_calls: data.tool_calls },
        },
        metadata: {
          model: options.model || "gpt-4o",
          usage: undefined,
          id: undefined,
        },
      };
    } else {
      logError(
        new Error("Unexpected API response format"),
        "OpenAIService._generateStandardResponse",
        { responseData: data },
      );
      throw new Error("Unexpected response format from API");
    }
  }

  // Make helper methods private
  private async _generateStreamingResponse(
    input: string | OpenAIMessage[],
    options: OpenAIRequestOptions = {},
  ): Promise<UnifiedAIResponseType> {
    let fullContent = "";
    const streamResult = await this.generateStreamingAIResponse(input, options);
    await streamResult.processStream((chunk) => {
      const deltaContent = this.extractOpenAIStreamContent(chunk);
      fullContent += deltaContent;
    });
    return {
      response: { message: { content: fullContent, tool_calls: undefined } },
      metadata: {
        model: options.model || "gpt-4o",
        usage: undefined,
        id: undefined,
      },
    };
  }

  extractOpenAIStreamContent(chunk: string): string {
    try {
      if (chunk.includes("data: [DONE]")) return "";
      const dataMatch = chunk.match(/data: ({.*})/);
      if (!dataMatch) return "";
      const data = JSON.parse(dataMatch[1]);
      return data?.choices?.[0]?.delta?.content || "";
    } catch (error) {
      logError(error, "OpenAIService.extractOpenAIStreamContent");
      return "";
    }
  }

  async generateStreamingAIResponse(
    input: string | OpenAIMessage[],
    options: OpenAIRequestOptions = {},
  ) {
    try {
      const messages =
        typeof input === "string" ? [{ role: "user", content: input }] : input;
      if (options.systemMessage && !messages.some((m) => m.role === "system")) {
        messages.unshift({ role: "system", content: options.systemMessage });
      }

      const response = await fetch("/api/v1/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages,
          model: options.model || "gpt-4o",
          temperature: options.temperature || 0.7,
          tools: options.tools,
          responseFormat: options.responseFormat,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Streaming response failed: ${errorText}`);
      }

      return {
        stream: response.body,
        contentType: response.headers.get("Content-Type"),
        processStream: async (
          onChunk: (text: string) => void,
        ): Promise<void> => {
          if (!response.body) throw new Error("Response body is null");
          const reader = response.body.getReader();
          const decoder = new TextDecoder("utf-8");
          let buffer = "";
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() || "";
              for (const line of lines) {
                if (line.trim()) onChunk(line);
              }
            }
            if (buffer.trim()) onChunk(buffer);
          } finally {
            reader.releaseLock();
          }
        },
      };
    } catch (error) {
      logError(error, "OpenAIService.generateStreamingAIResponse");
      throw error;
    }
  }

  async checkAPIHealth() {
    try {
      const response = await fetch("/api/v1/health");
      if (!response.ok) throw new Error("Health check failed");
      return response.json();
    } catch (error) {
      logError(error, "OpenAIService.checkAPIHealth");
      throw error;
    }
  }

  // Fetch available AI models
  async getAvailableModels({
    fetch: customFetch,
  }: { fetch?: typeof fetch } = {}): Promise<string[]> {
    const fetchFn = customFetch || fetch;

    // Default models to fall back to if API endpoint isn't available
    const fallbackModels = ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"];

    try {
      // Try to fetch models from API with a short timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const response = await fetchFn("/api/v1/models", {
        signal: controller.signal,
      }).finally(() => clearTimeout(timeoutId));

      if (!response.ok) {
        console.warn(
          `Models API returned status ${response.status}: ${response.statusText}`,
        );
        return fallbackModels;
      }

      const data = await response.json();
      const models = data?.models || [];

      // If the API returned an empty array, use fallback models
      return models.length > 0 ? models : fallbackModels;
    } catch (error) {
      // Log error but don't crash the application
      if (error instanceof Error && error.name === "AbortError") {
        console.warn("Models API request timed out, using fallback models");
      } else {
        logError(error, "OpenAIService.getAvailableModels");
      }

      // Return fallback models instead of an empty array
      return fallbackModels;
    }
  }
}

// Create a singleton instance
const openAIService = new OpenAIService();

// Export instance methods as standalone functions
export const generateAIResponse =
  openAIService.generateAIResponse.bind(openAIService);
export const generateStreamingAIResponse =
  openAIService.generateStreamingAIResponse.bind(openAIService);
export const extractOpenAIStreamContent =
  openAIService.extractOpenAIStreamContent.bind(openAIService);
export const getAvailableModels =
  openAIService.getAvailableModels.bind(openAIService);
