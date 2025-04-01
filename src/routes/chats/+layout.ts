// Enable SSR by default, disable only on specific routes that require it
export const ssr = true;

import type { LayoutLoad } from "./$types";
import { sampleChats } from "$lib";
import type { Chat } from "$lib/types";

export const load: LayoutLoad = async () => {
  console.log(`[Client] Loading sample chats: ${sampleChats.length} available`);

  // Return sample chats data with explicit mapping to ensure consistency
  return {
    // Ensure the mapping matches the expected return type for LayoutLoad
    // and that sampleChats has the correct type (e.g., SampleChatSummary[])
    sampleChats: sampleChats.map((chat: Chat) => ({
      id: chat.id,
      name: chat.name,
      createdAt: chat.createdAt,
      context: {
        company: chat.context?.company || "",
        industry: chat.context?.industry || "",
        region: chat.context?.region || "",
      },
    })),
  };
};
