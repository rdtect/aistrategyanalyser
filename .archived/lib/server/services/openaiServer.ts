import OpenAI from "openai";
import { OPENAI_API_KEY } from "$env/static/private";
import type { ResponseCreateParams } from "openai/resources";
import { extractTextFromResponse } from "$lib/services/openaiService";
import type { OpenAIRequestOptions } from "$lib/services/openaiService";

// Centralized OpenAI client (server-side only)
export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Default system instruction
const DEFAULT_SYSTEM_INSTRUCTION =
  "You are an AI strategy analyst using the 4C's framework (Company, Customers, Competitors, Context). " +
  "Analyze business strategy questions with this framework, providing structured insights.";

/**
 * Creates a non-streaming response using OpenAI Responses API
 */
export async function createResponse(
  input: string,
  options: OpenAIRequestOptions = {},
) {
  try {
    const response = await openai.responses.create({
      model: options.model || "gpt-4o",
      input,
      instructions: options.instructions || DEFAULT_SYSTEM_INSTRUCTION,
      tools: options.tools || [],
      ...(options.previousResponseId
        ? { previous_response_id: options.previousResponseId }
        : {}),
    });

    return response;
  } catch (error) {
    console.error("Error generating OpenAI response:", error);
    throw error;
  }
}

/**
 * Creates a streaming response using OpenAI Responses API
 */
export async function createStreamingResponse(
  input: string,
  options: OpenAIRequestOptions = {},
) {
  try {
    const stream = await openai.responses.create({
      model: options.model || "gpt-4o",
      input,
      stream: true,
      instructions: options.instructions || DEFAULT_SYSTEM_INSTRUCTION,
      tools: options.tools || [],
      ...(options.previousResponseId
        ? { previous_response_id: options.previousResponseId }
        : {}),
    });

    return stream;
  } catch (error) {
    console.error("Error generating OpenAI streaming response:", error);
    throw error;
  }
}

/**
 * Check the health/connection to OpenAI
 */
export async function checkOpenAIHealth(model: string = "gpt-4o") {
  try {
    // Simple completion to check if API is responsive
    const response = await openai.responses.create({
      model,
      input: "Hello",
      max_output_tokens: 20, // Minimum requirement of 16
    });

    return {
      connected: true,
      model: response.model,
      responseId: response.id,
    };
  } catch (error) {
    console.error("OpenAI health check failed:", error);
    return {
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
