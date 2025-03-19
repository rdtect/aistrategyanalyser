import { sampleChats } from "$lib/data/sampleData";
import type { PageServerLoad } from "./$types";

/**
 * Server load function for the home page
 * This provides initial chat data
 */
export const load: PageServerLoad = async () => {
  // In the future, this would load chats from a database
  // For now, we're using sample data
  return {
    chats: sampleChats,
    timestamp: new Date().toISOString(),
  };
};
