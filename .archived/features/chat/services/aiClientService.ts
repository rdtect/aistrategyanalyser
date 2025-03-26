/**
 * AI Client Service - Client-side service for interacting with AI endpoints
 * Optimized for Svelte 5 and SvelteKit 2 best practices
 */
import type { Chat, ChatMessage } from "../types/chat";

/**
 * Options for AI response generation
 */
interface AIResponseOptions {
  useResponsesAPI?: boolean;
  temperature?: number;
  model?: string;
}

/**
 * Class-based implementation of AI client service
 */
class AIClientService {
  /**
   * Generate an AI response for a given chat and user message
   * Calls the server endpoint instead of directly using OpenAI
   */
  async generateAIResponse(
    chat: Chat,
    userMessage: string,
    options: AIResponseOptions = { useResponsesAPI: true }
  ): Promise<ChatMessage> {
    try {
      // Create system message with context information
      const systemMessage = this.createSystemMessageFromContext(chat.context);

      // Create message history for the API
      const messageHistory = [
        { role: "system", content: systemMessage },
        // Include up to 10 most recent messages for context
        ...chat.messages.slice(-10).map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.content,
        })),
        { role: "user", content: userMessage },
      ];

      // Call the server-side endpoint
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messageHistory,
          useResponsesAPI: options.useResponsesAPI,
          temperature: options.temperature,
          model: options.model
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get AI response");
      }

      const data = await response.json();
      const responseContent = data.content;

      // Create and return the message
      return {
        id: crypto.randomUUID(),
        content: responseContent || "No response generated",
        sender: "ai",
        timestamp: new Date().toISOString(),
        status: "sent",
        index: chat.messages.length + 1,
        ...(data.sources && { sources: data.sources })
      };
    } catch (error) {
      console.error("Error generating AI response:", error);
      throw error;
    }
  }

  /**
   * Create a system message from the chat context
   */
  createSystemMessageFromContext(context: Chat["context"]): string {
    return `You are an AI strategy analyst helping to analyze the following company:
Company: ${context?.company || "Unknown"}
Industry: ${context?.industry || "Unspecified"}
Region: ${context?.region || "Global"}
${context?.additionalInfo ? `Additional Context: ${context.additionalInfo}` : ""}

Please provide detailed, insightful analysis based on the latest market trends and data. 
Structure your responses with clear headings, bullet points, and concise paragraphs.
Your goal is to provide actionable insights that can help inform strategic decision-making.
`;
  }

  /**
   * Stream an AI response for real-time display
   * This is an alternative to the standard response method
   */
  async streamAIResponse(
    chat: Chat,
    userMessage: string,
    onChunk: (chunk: string) => void,
    options: AIResponseOptions = { useResponsesAPI: true }
  ): Promise<ChatMessage> {
    try {
      // Create system message with context information
      const systemMessage = this.createSystemMessageFromContext(chat.context);

      // Create message history for the API
      const messageHistory = [
        { role: "system", content: systemMessage },
        // Include up to 10 most recent messages for context
        ...chat.messages.slice(-10).map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.content,
        })),
        { role: "user", content: userMessage },
      ];

      // Call the server-side streaming endpoint
      const response = await fetch('/api/ai/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messageHistory,
          temperature: options.temperature,
          model: options.model
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get AI response");
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      // Process the stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let content = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        content += chunk;
        onChunk(chunk);
      }

      // Create and return the complete message
      return {
        id: crypto.randomUUID(),
        content,
        sender: "ai",
        timestamp: new Date().toISOString(),
        status: "sent",
        index: chat.messages.length + 1
      };
    } catch (error) {
      console.error("Error streaming AI response:", error);
      throw error;
    }
  }
}

// Export a singleton instance
export const aiClientService = new AIClientService();