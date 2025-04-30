import { getAvailableModels } from "$lib/services/OpenAIService";
// Removed Supabase/Chat loading logic as it must happen client-side for IndexedDB
// import { supabase } from "$lib/server/db/supabase";
import type { LayoutServerLoad } from "./$types";
// Using 'any[]' temporarily as ChatMetadata type location is unknown
// import type { ChatMetadata } from "$lib/types";

/** @type {import('./$types').LayoutServerLoad} */
export const load: LayoutServerLoad = async ({ fetch }) => {
  try {
    // Fetch only server-available data, e.g., models
    const modelsResponse = await getAvailableModels({ fetch });

    return {
      available_models: modelsResponse,
      // No chats are loaded here
    };
  } catch (err) {
    console.error("Failed to load layout server data (models):", err);
    // Return default for models on error
    return {
      available_models: [],
    };
  }
};
