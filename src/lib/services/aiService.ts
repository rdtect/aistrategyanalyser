import OpenAI from "openai";
import { OPENAI_API_KEY } from "$env/static/private";
import {
  searchSimilarDocuments,
  storeDocumentWithEmbedding,
} from "./embeddingService";
import { chats } from "$lib/stores/chatStore";
import type { Message } from "$lib/types/chat";
import type { ResponseCreateParams } from "openai/resources/responses";

interface DocumentWithContent {
  content: string;
  // Add other properties if needed
}

// Initialize OpenAI client (server-side only)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function createAIResponse(
  input: string,
  options: Partial<ResponseCreateParams> = {}
) {
  try {
    const response = await openai.responses.create({
      model: "gpt-4o",
      input,
      ...options,
    });

    return response;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw error;
  }
}

export function createStreamingResponse() {
  // State to track current stream
  let currentStream: { cancel: () => void } | null = $state(null);

  // Create response with streaming
  async function streamResponse(
    input: string,
    options: {
      previousResponseId?: string;
      instructions?: string;
      model?: string;
      signal?: AbortSignal;
    } = {}
  ) {
    try {
      // Create the streaming response
      const stream = await openai.responses.create({
        model: options.model || "gpt-4o",
        input,
        stream: true,
        instructions:
          options.instructions ||
          "You are an AI strategy analyst using the 4C's framework (Company, Customers, Competitors, Context). Analyze business strategy questions with this framework, providing structured insights.",
        ...(options.previousResponseId
          ? { previous_response_id: options.previousResponseId }
          : {}),
        signal: options.signal,
      });

      // Set up stream handler for cancellation
      currentStream = {
        cancel: () => {
          options.signal?.abort();
          currentStream = null;
        },
      };

      return stream;
    } catch (error) {
      currentStream = null;
      throw error;
    }
  }

  // Cancel current stream if active
  function cancelStream() {
    if (currentStream) {
      currentStream.cancel();
      currentStream = null;
    }
  }

  // Get current streaming status
  const isStreaming = $derived(!!currentStream);

  return {
    streamResponse,
    cancelStream,
    isStreaming,
  };
}
