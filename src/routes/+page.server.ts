import type { PageServerLoad } from "./$types";
import { loadAllChats } from "./chats/(components)/ChatUtils";

/**
 * Load data for the home page
 */
export const load: PageServerLoad = async () => {
  // Use the shared utility to load all chats
  return {
    chats: loadAllChats(),
  };
};
