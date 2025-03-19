import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';
import type { ResponseCreateParams } from 'openai/resources/responses';

// Centralized OpenAI client (server-side only)
export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Standard interface for all OpenAI requests
export interface OpenAIRequestOptions {
  model?: string;
  instructions?: string;
  previousResponseId?: string;
  context?: unknown;
  signal?: AbortSignal;
  tools?: ResponseCreateParams['tools'];
}

// Default system instruction
const DEFAULT_SYSTEM_INSTRUCTION = 
  "You are an AI strategy analyst using the 4C's framework (Company, Customers, Competitors, Context). " +
  "Analyze business strategy questions with this framework, providing structured insights.";

/**
 * Creates a non-streaming response using OpenAI Responses API
 */
export async function createResponse(
  input: string,
  options: OpenAIRequestOptions = {}
) {
  try {
    const response = await openai.responses.create({
      model: options.model || "gpt-4o",
      input,
      instructions: options.instructions || DEFAULT_SYSTEM_INSTRUCTION,
      tools: options.tools || [],
      ...(options.previousResponseId ? { previous_response_id: options.previousResponseId } : {}),
      signal: options.signal,
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
  options: OpenAIRequestOptions = {}
) {
  try {
    const stream = await openai.responses.create({
      model: options.model || "gpt-4o",
      input,
      stream: true,
      instructions: options.instructions || DEFAULT_SYSTEM_INSTRUCTION,
      tools: options.tools || [],
      ...(options.previousResponseId ? { previous_response_id: options.previousResponseId } : {}),
      signal: options.signal,
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
      max_output_tokens: 10, // Keep it minimal for health check
    });
    
    return {
      connected: true,
      model: response.model,
      responseId: response.id
    };
  } catch (error) {
    console.error("OpenAI health check failed:", error);
    return {
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

/**
 * Extract text content from OpenAI response
 */
export function extractTextFromResponse(response: any) {
  let textContent = "";
  let sources = [];

  if (response && response.output) {
    for (const item of response.output) {
      if (item.type === "message" && item.content) {
        for (const content of item.content) {
          if (content.type === "output_text") {
            textContent += content.text;

            // Extract any annotations (like web sources)
            if (content.annotations && content.annotations.length > 0) {
              sources = content.annotations.map((annotation: any) => ({
                title: annotation.title || "",
                url: annotation.url || "",
                snippet:
                  content.text.substring(
                    annotation.start_index,
                    annotation.end_index
                  ) || "",
              }));
            }
          }
        }
      }
    }
  }

  return { textContent, sources };
}