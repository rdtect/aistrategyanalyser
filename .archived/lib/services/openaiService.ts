import type { ResponseCreateParams } from "openai/resources";

// Standard interface for all OpenAI requests
export interface OpenAIRequestOptions {
  model?: string;
  instructions?: string;
  previousResponseId?: string;
  context?: unknown;
  signal?: AbortSignal;
  tools?: ResponseCreateParams["tools"];
  webSearch?: boolean;
  chatId?: string;
}

// Default system instruction
const DEFAULT_SYSTEM_INSTRUCTION = `You are an AI Strategy Analyst assistant. 
Provide thorough, well-researched analyses of business strategy questions.
Be specific, factual, and back up your insights with relevant data where possible.`;

// Utility functions for both client and server
export function extractTextFromResponse(response: any) {
  try {
    // Handle various response formats
    if (response.content && Array.isArray(response.content)) {
      // Extract text content from response
      const textContent = response.content
        .filter((item: any) => item.type === "text")
        .map((item: any) => item.text?.value || "")
        .join("\n\n");

      // Extract sources if available
      const sources =
        response.annotations?.sources || response.context?.citations || [];

      return { textContent, sources };
    }

    // Handle string response or other formats
    return {
      textContent:
        typeof response === "string" ? response : JSON.stringify(response),
      sources: [],
    };
  } catch (error) {
    console.error("Error extracting text from response:", error);
    return {
      textContent: "Error processing response",
      sources: [],
    };
  }
}

// Client-side utilities for formatting messages
export function formatMessagesForUI(messages: any[]) {
  return messages.map((msg) => ({
    role: msg.role,
    content:
      typeof msg.content === "string"
        ? msg.content
        : extractTextFromResponse(msg).textContent,
  }));
}
