import { browser } from "$app/environment";
import OpenAI from "openai";
import type { ErrorResponse } from "$lib/core/utils/errorHandling";
import { handleApiError, ErrorType } from "$lib/core/utils/errorHandling";

// Define models
export const OPENAI_MODELS = {
  GPT4: "gpt-4",
  GPT4_TURBO: "gpt-4-turbo-preview",
  GPT4O: "gpt-4o",
  GPT4O_MINI: "gpt-4o-mini",
};

// Create OpenAI client instance with intelligent error handling
let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (client) return client;

  if (!browser) {
    throw new Error(
      "OpenAI client can only be initialized in browser environment",
    );
  }

  try {
    client = new OpenAI({
      apiKey: "sk-dummy", // Will be replaced by server during proxy
      dangerouslyAllowBrowser: true, // We're using a proxy for API calls
      baseURL: "/api/openai-proxy", // Proxy endpoint on our server
    });
    return client;
  } catch (error) {
    console.error("Failed to initialize OpenAI client:", error);
    throw handleApiError({
      type: ErrorType.API,
      message: "Failed to initialize OpenAI client",
      details: error,
    });
  }
}

// Chat completion function with streaming support
export async function createChatCompletion(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  options = { model: OPENAI_MODELS.GPT4O },
): Promise<{ success: boolean; response?: string; error?: ErrorResponse }> {
  try {
    const openai = getClient();

    const response = await openai.chat.completions.create({
      model: options.model,
      messages,
      temperature: 0.7,
    });

    return {
      success: true,
      response: response.choices[0].message.content || "",
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      success: false,
      error: handleApiError(error),
    };
  }
}

// Export the client getter for advanced use cases
export { getClient };
