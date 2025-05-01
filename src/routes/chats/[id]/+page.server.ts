import { fail, redirect, error as skError } from "@sveltejs/kit";
import type { Chat } from "$lib/types";
import type { PageServerLoad, Actions } from "./$types";

/**
 * Load data for a specific chat with error handling.
 * TODO: Replace mock with real ChatService when backend is ready.
 */
export const load: PageServerLoad = async ({ params }) => {
  console.warn("ChatService not available, returning mock chat for load");
  return {
    chat: {
      id: params.id,
      name: "Mock Chat",
      messages: [],
      context: null,
      selectedQuestionIds: [],
    },
  };
};

export const actions: Actions = {
  // Placeholder for future chat actions
  // TODO: Implement updateChat and deleteChat when backend is ready
};
