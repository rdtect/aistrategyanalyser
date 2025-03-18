import type { LayoutServerLoad } from "./$types";
import { sampleChats } from "$lib/data/sampleData";

export const load: LayoutServerLoad = async ({ cookies }) => {
  // Return sample chats - we'll merge with user chats on client side
  return {
    sampleChats,
    timestamp: Date.now(), // Include a timestamp for client-side to track new chats
  };
};
