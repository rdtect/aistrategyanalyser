// src/lib/utils/validation.ts
import type { Chat, Message } from "$lib/types";
import { v4 as uuidv4 } from "uuid";
import { logError } from "$lib/utils/errorHandler";

/**
 * Helper function to validate and hydrate a single message object.
 * Ensures required fields exist and have reasonable defaults.
 */
export function validateAndHydrateMessage(msg: any, index: number): Message {
  const validRole =
    msg?.role && ["user", "assistant", "system"].includes(msg.role)
      ? msg.role
      : "system"; // Default to system if missing or invalid

  const validStatus =
    msg?.status &&
    ["sending", "sent", "error", "streaming", "delivered", "read"].includes(
      msg.status,
    )
      ? msg.status
      : "sent"; // Default to sent

  return {
    id: msg?.id || uuidv4(), // Ensure ID exists
    role: validRole,
    content: msg?.content ?? null, // Ensure content is string or null
    timestamp: msg?.timestamp || new Date().toISOString(), // Provide default timestamp
    status: validStatus,
    index: typeof msg?.index === "number" ? msg.index : index, // Ensure index is number, use provided or fallback
    // Optional fields - ensure they exist or are undefined/null
    sources: Array.isArray(msg?.sources) ? msg.sources : undefined,
    tool_calls: msg?.tool_calls,
    tool_call_id: msg?.tool_call_id,
  };
}

/**
 * Helper function to validate and hydrate a chat object.
 * Ensures required fields exist and have reasonable defaults.
 */
export function validateAndHydrateChat(chatData: any): Chat | null {
  if (!chatData || typeof chatData.id !== "string") {
    logError(
      new Error("Invalid chat data: Missing or invalid ID"),
      "validateAndHydrateChat",
      { chatData },
    );
    return null;
  }

  const messages: Message[] = Array.isArray(chatData.messages)
    ? chatData.messages.map(validateAndHydrateMessage)
    : [];

  return {
    id: chatData.id,
    name: chatData.name || "Untitled Chat", // Default name
    messages: messages,
    createdAt: chatData.createdAt || new Date().toISOString(), // Default dates
    updatedAt: chatData.updatedAt || new Date().toISOString(),
    context: chatData.context, // Assume context structure is handled elsewhere or optional
    tags: Array.isArray(chatData.tags) ? chatData.tags : undefined,
    isArchived:
      typeof chatData.isArchived === "boolean" ? chatData.isArchived : false,
  };
}
