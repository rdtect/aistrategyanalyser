import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { sampleChats } from "$lib";
import crypto from "crypto";
import { supabase } from "$lib/server/db/supabase";

export const load: PageServerLoad = async ({ locals }) => {
  console.log(`[Server] Loading sample chats: ${sampleChats.length} available`);

  // Log each sample chat to verify they're loaded correctly
  sampleChats.forEach((chat, index) => {
    console.log(`[Server] Sample chat ${index}: ${chat.id} - ${chat.name}`);
  });

  // Return sample chats data with explicit mapping to ensure consistency
  const sampleChatsData = sampleChats.map((chat) => ({
    id: chat.id,
    name: chat.name,
    createdAt: chat.createdAt,
    company: chat.context?.company || "",
    industry: chat.context?.industry || "",
    region: chat.context?.region || "",
  }));

  const { data, error } = await supabase
    .from("chat_metadata")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching chat metadata:", error);
  }

  return {
    sampleChats: sampleChatsData,
    chatMetadata: data ?? [],
  };
};

export const actions: Actions = {
  createChat: async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get("name")?.toString() || "New Strategy Analysis";
    const company = formData.get("company")?.toString();
    const industry = formData.get("industry")?.toString();
    const region = formData.get("region")?.toString();

    if (!name) {
      return fail(400, { error: "Chat name is required" });
    }

    try {
      console.log(`[Server] Creating new chat: ${name}`);
      // Generate a UUID on the server side
      const chatId = crypto.randomUUID();

      // Include the chat data in the redirect URL as query parameters
      // The client-side component will use this to initialize the chat
      const params = new URLSearchParams({
        new: "true",
        name,
        ...(company ? { company } : {}),
        ...(industry ? { industry } : {}),
        ...(region ? { region } : {}),
      });

      console.log(`[Server] Created chat with ID: ${chatId}`);
      throw redirect(303, `/chats/${chatId}?${params.toString()}`);
    } catch (error) {
      console.error("Failed to create chat:", error);
      return fail(500, { error: "Failed to create chat" });
    }
  },
};
