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

export function createStreamingCompletion() {
  // State to track current stream
  let currentStream: { cancel: () => void } | null = $state(null);

  // Create completion with streaming
  async function streamCompletion(
    chatId: string,
    messages: Message[],
    signal?: AbortSignal
  ) {
    // Convert our message format to OpenAI format
    const openaiMessages = messages.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.content,
    }));

    // Add system message for 4C's framework
    openaiMessages.unshift({
      role: "system",
      content:
        "You are an AI strategy analyst using the 4C's framework (Company, Customers, Competitors, Context). Analyze business strategy questions with this framework, providing structured insights.",
    });

    try {
      // Create the completion with streaming
      const stream = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: openaiMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2000,
        signal,
      });

      // Set up stream handler for cancellation
      currentStream = {
        cancel: () => {
          signal?.abort();
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
    streamCompletion,
    cancelStream,
    isStreaming,
  };
}
