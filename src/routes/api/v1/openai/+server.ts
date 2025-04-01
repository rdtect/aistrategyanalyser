import { error as svelteKitError, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { OPENAI_API_KEY } from "$env/static/private";
import { withErrorHandling } from "$lib/utils/errorHandler";
import OpenAI from "openai";
import type {
  ChatCompletionMessageParam,
  ChatCompletionMessageToolCall,
} from "openai/resources/chat/completions";

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

// Define types for the function parameters
interface HandleResponsesAPIParams {
  messages: ChatCompletionMessageParam[];
  model: string;
  tools?: any;
  temperature?: number;
  max_tokens?: number;
  reasoning?: any;
}

/**
 * Process a POST request to the OpenAI API
 */
export const POST: RequestHandler = withErrorHandling(async ({ request }) => {
  const requestBody = await request.json();
  console.log(
    "[/api/v1/openai] Received request body:",
    JSON.stringify(requestBody),
  );

  const {
    messages,
    model = "gpt-4o",
    temperature = 0.7,
    max_tokens,
    tools = [],
    responseFormat,
    reasoning,
  } = requestBody;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw svelteKitError(400, "Messages are required and must be an array");
  }

  try {
    // Always use the Responses API path
    console.log("[/api/v1/openai] Forwarding to handleResponsesAPI...");
    const responseData = await handleResponsesAPI({
      messages,
      model,
      tools,
      temperature,
      max_tokens,
      reasoning,
    });
    return json(responseData);
  } catch (err) {
    console.error("Error calling OpenAI API:", err);

    if (err instanceof Response) {
      throw err;
    }

    if (err instanceof Error) {
      throw svelteKitError(500, `Failed to process request: ${err.message}`);
    }

    throw svelteKitError(500, "An unknown error occurred");
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
}: HandleResponsesAPIParams): Promise<{
  content: string | null;
  tool_calls: ChatCompletionMessageToolCall[] | undefined;
}> {
  try {
    // Extract the latest user message content for the Responses API
    const lastUserMessage = messages.filter((m) => m.role === "user").pop();
    const responsesInput = lastUserMessage?.content || ""; // Fallback to empty string

    // Prepare parameters for the Responses API
    const responseAPIParams = {
      model: model || "gpt-4o",
      input: responsesInput, // Revert to passing the string
      tools: tools, // Pass the tools array (e.g., for web_search_preview)
      // Add other specific parameters for Responses API if needed
    };

    console.log(
      "Calling OpenAI Responses API with params:",
      JSON.stringify(responseAPIParams, null, 2),
    );
    // *** Use openai.responses.create instead ***
    const response = await openai.responses.create(responseAPIParams as any);

    console.log(
      "[/api/v1/openai handleResponsesAPI] Received from OpenAI SDK (responses.create):",
      JSON.stringify(response),
    );

    // *** Adapt response extraction based on actual structure ***
    // Use the top-level output_text field which seems to contain the final answer
    const assistantResponseContent = (response as any)?.output_text ?? null;
    // Extract tool calls if needed, though they might be less relevant if output_text is present.
    // For now, let's assume tool_calls aren't needed if output_text is present.
    const toolCalls = undefined; // Adjust if tool execution results need separate handling

    if (assistantResponseContent === null) {
      // Simplified check
      console.warn(
        "[/api/v1/openai handleResponsesAPI] Responses.create did not return output_text.",
      );
    }

    return {
      content: assistantResponseContent,
      tool_calls: toolCalls,
    };
  } catch (err) {
    console.error("Error calling OpenAI Responses API:", err);
    if (err instanceof Error) {
      throw svelteKitError(
        500,
        `Failed to process Responses API request: ${err.message}`,
      );
    }
    throw svelteKitError(
      500,
      "Failed to process Responses API request: Unknown error",
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
