// Export components
export { default as Chat } from "./Chat.svelte.ts";
export { default as ChatMessage } from "./ChatMessage.svelte";
export { default as ChatInput } from "./ChatInput.svelte";
export { default as ChatHeader } from "./ChatHeader.svelte";

// Export store
export { default as chatStore } from "./Chat.svelte.ts";

// Export types
export type {
  Message,
  Chat,
  MessageStatus,
  MessageSender,
} from "$lib/_archived/lib/types/chat.ts";

// Constants and utilities
export const CHAT_EVENTS = {
  MESSAGE_SENT: "message:sent",
  CHAT_SWITCHED: "chat:switched",
  NEW_CHAT: "chat:new",
} as const;

// Chat utility functions
export const formatTimestamp = (date: Date): string => {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const generateChatName = (
  topic: string,
  category?: string,
  region?: string,
): string => {
  return `${topic}${category ? ` - ${category}` : ""}${region ? ` (${region})` : ""}`;
};

export const validateMessage = (content: string): boolean => {
  return content.trim().length > 0;
};
