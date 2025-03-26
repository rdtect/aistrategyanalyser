import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { ChatService } from "$lib/services/ChatService";
import { generateAIResponse } from "$lib/services/openai";
import type { Message } from "../../chats/types";
import { withErrorHandling } from "$lib/utils/errorHandler";

/**
 * Endpoint to handle adding messages to a chat and generating AI responses
 * POST /api/messages?chatId=123
 * Optimized for Svelte 5 and SvelteKit 2 best practices
 */
export const POST: RequestHandler = withErrorHandling(
  async ({ request, url }) => {
    // Get chat ID from query params
    const chatId = url.searchParams.get("chatId");
    if (!chatId) {
      throw error(400, "Missing chatId parameter");
    }

    // Check if chat exists
    const chat = await ChatService.getChatById(chatId);
    if (!chat) {
      throw error(404, `Chat with ID ${chatId} not found`);
    }

    // Get message from request body
    const data = await request.json();
    const { message, systemMessage } = data;

    if (!message && !systemMessage) {
      throw error(400, "Message content is required");
    }

    // Create a unique ID for the message using the Web Crypto API
    const messageId = crypto.randomUUID();

    // Determine if this is a user or system message
    const sender = systemMessage ? "system" : "user";
    const content = systemMessage || message;

    // Create the message object
    const userMessage: Message = {
      id: messageId,
      content,
      sender,
      timestamp: new Date().toISOString(),
      status: "sent",
      index: chat.messages.length,
    };

    // Add the message to the chat
    const updatedChat = await ChatService.addMessage(chatId, userMessage);

    if (!updatedChat) {
      throw error(500, "Failed to add message to chat");
    }

    // If it's a system message, don't generate an AI response
    if (systemMessage) {
      return json({ success: true, message: userMessage });
    }

    try {
      // Generate AI response
      const aiMessageContent = await generateAIResponse(message, {
        systemMessage: "You are an AI Strategy Analyst assistant.",
      });

      // Create the AI message
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        content: aiMessageContent.response,
        sender: "ai",
        timestamp: new Date().toISOString(),
        status: "sent",
        index: chat.messages.length + 1,
      };

      // Add the AI response to the chat
      await ChatService.addMessage(chatId, aiMessage);

      // Return both messages
      return json({
        success: true,
        userMessage,
        aiMessage,
        chatId,
      });
    } catch (error) {
      console.error("Error generating AI response:", error);
      // Still return success for the user message, just note AI failed
      return json({
        success: true,
        userMessage,
        aiError: "Failed to generate AI response",
        errorDetails: error instanceof Error ? error.message : String(error),
      });
    }
  },
);

/**
 * Endpoint to get messages for a specific chat
 * GET /api/messages?chatId=123
 * Optimized for Svelte 5 and SvelteKit 2 best practices
 */
export const GET: RequestHandler = withErrorHandling(async ({ url }) => {
  // Get chat ID from query params
  const chatId = url.searchParams.get("chatId");
  if (!chatId) {
    throw error(400, "Missing chatId parameter");
  }

  // Get chat from storage
  const chat = await ChatService.getChatById(chatId);
  if (!chat) {
    throw error(404, `Chat with ID ${chatId} not found`);
  }

  // Return chat messages with metadata
  return json({
    messages: chat.messages,
    chatId,
    chatName: chat.name,
    context: chat.context,
    lastUpdated: chat.updatedAt,
  });
});
