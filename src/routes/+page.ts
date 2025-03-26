import type { PageLoad } from "./$types";
import { sampleChats } from "$lib";

interface SampleChat {
  id: string;
  name: string;
  createdAt: string;
  context: {
    company?: string;
    industry?: string;
    region?: string;
  };
}

export const load: PageLoad = async () => {
  console.log(`[Client] Loading sample chats: ${sampleChats.length} available`);

  // Return sample chats data with explicit mapping to ensure consistency
  return {
    sampleChats: sampleChats.map((chat: any) => ({
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
