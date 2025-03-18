import type { Actions, PageServerLoad } from "./$types";
import { error, fail } from "@sveltejs/kit";
import { sampleChats, sampleMessages } from "$lib/data/sampleData";

export const load: PageServerLoad = async ({ params }) => {
  try {
    const chatId = params.id;

    // Get chat data from sample data
    const chat = sampleChats.find((c) => c.id === chatId);

    if (!chat) {
      return {
        status: 404,
        error: "Chat not found",
      };
    }

    // Get messages for this chat from sample data
    const messages = sampleMessages[chatId] || [];

    return {
      chat,
      messages,
    };
  } catch (e) {
    console.error("Error loading chat:", e);
    return {
      status: 500,
      error: "Failed to load chat",
    };
  }
};

export const actions: Actions = {
  sendMessage: async ({ request, params, fetch }) => {
    const formData = await request.formData();
    const message = formData.get("message")?.toString();
    const chatId = params.id;

    if (!message) {
      return fail(400, { error: "Message is required" });
    }

    try {
      // In a real app, we would save to the database
      // For now, we'll just return success
      return { success: true };
    } catch (e) {
      console.error("Error sending message:", e);
      return fail(500, { error: "Failed to process message" });
    }
  },
};
