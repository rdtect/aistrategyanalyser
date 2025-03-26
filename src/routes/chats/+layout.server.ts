import type { LayoutServerLoad } from "./$types";
import { sampleChats as originalSampleChats } from "$lib";

export const load: LayoutServerLoad = async ({ cookies }) => {
  // Ensure sample chats have consistent formatting
  const sampleChats = originalSampleChats.map((chat) => ({
    id: chat.id,
    name: chat.name || "Untitled Analysis",
    createdAt: chat.createdAt || new Date().toISOString(),
    updatedAt: chat.updatedAt || new Date().toISOString(),
    context: chat.context || {},
    messages: chat.messages || [],
  }));

  return {
    sampleChats,
    timestamp: Date.now(), // Include a timestamp for client-side to track new chats
  };
};
