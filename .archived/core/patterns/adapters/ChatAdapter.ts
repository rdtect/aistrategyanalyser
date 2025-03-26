/**
 * Chat Adapter - Convert between different Chat model types
 */
import type {
  Chat as AppChat,
  ChatMessage as AppChatMessage,
  MessageStatus,
} from "$lib/features/chat/types/chat";
import {
  createAdapter,
  withDefault,
  ensureType,
  safeGet,
} from "../types/AdapterPattern";

/**
 * Generic sample chat type that matches the structure from sampleChats.ts
 * This is intentionally loose to handle various incoming formats
 */
export interface SampleChat {
  id: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
  context: {
    company: string;
    industry: string;
    region: string;
    additionalInfo?: string;
  };
  messages: Array<{
    id: string;
    index?: number;
    sender: string;
    content: string;
    timestamp: string;
    status?: string;
    sources?: Array<{
      title: string;
      url?: string;
      content?: string;
    }>;
  }>;
  [key: string]: any; // Allow additional properties
}

/**
 * Create an adapter to normalize any chat-like object to our app's Chat type
 */
export const chatAdapter = createAdapter<any, AppChat>((sampleChat) => {
  if (!sampleChat || typeof sampleChat !== "object") {
    throw new Error("Invalid chat object");
  }

  // Normalize updatedAt (required field in AppChat)
  const updatedAt = withDefault(
    sampleChat.updatedAt,
    withDefault(sampleChat.createdAt, new Date().toISOString()),
  );

  // Normalize messages
  const messages: AppChatMessage[] = Array.isArray(sampleChat.messages)
    ? sampleChat.messages.map(normalizeMessage)
    : [];

  // Return a normalized AppChat object
  return {
    id: ensureType<string>(sampleChat.id, ""),
    name: ensureType<string>(sampleChat.name, "Untitled Chat"),
    createdAt: ensureType<string>(
      sampleChat.createdAt,
      new Date().toISOString(),
    ),
    updatedAt: updatedAt,
    context: {
      company: safeGet<string>(sampleChat, "context.company", ""),
      industry: safeGet<string>(sampleChat, "context.industry", ""),
      region: safeGet<string>(sampleChat, "context.region", ""),
      additionalInfo: safeGet<string>(sampleChat, "context.additionalInfo", ""),
    },
    messages: messages,
  };
});

/**
 * Helper function to normalize a message object
 */
function normalizeMessage(message: any): AppChatMessage {
  if (!message || typeof message !== "object") {
    throw new Error("Invalid message object");
  }

  // Ensure valid sender
  const validSenders = ["user", "ai", "system"];
  const sender = validSenders.includes(message.sender)
    ? message.sender
    : "system";

  // Normalize message status
  const status = normalizeMessageStatus(message.status);

  // Return normalized message
  return {
    id: ensureType<string>(message.id, ""),
    content: ensureType<string>(message.content, ""),
    sender: sender as "user" | "ai" | "system",
    timestamp: ensureType<string>(message.timestamp, new Date().toISOString()),
    status,
    // Copy sources if they exist
    ...(Array.isArray(message.sources)
      ? { sources: message.sources.map(normalizeSource) }
      : {}),
    // Copy index if it exists
    ...(typeof message.index === "number" ? { index: message.index } : {}),
  };
}

/**
 * Helper function to normalize a source object
 */
function normalizeSource(source: any): {
  title: string;
  url?: string;
  content?: string;
} {
  if (!source || typeof source !== "object") {
    return { title: "Unknown Source" };
  }

  return {
    title: ensureType<string>(source.title, "Unknown Source"),
    ...(source.url ? { url: ensureType<string>(source.url, "") } : {}),
    ...(source.content
      ? { content: ensureType<string>(source.content, "") }
      : {}),
  };
}

/**
 * Helper function to ensure the message status is valid
 */
function normalizeMessageStatus(status: any): MessageStatus | undefined {
  const validStatuses: MessageStatus[] = [
    "sending",
    "sent",
    "error",
    "streaming",
    "regenerating",
    "thinking",
  ];

  if (
    typeof status !== "string" ||
    !validStatuses.includes(status as MessageStatus)
  ) {
    // Default to sent or return undefined
    return "sent";
  }

  return status as MessageStatus;
}
