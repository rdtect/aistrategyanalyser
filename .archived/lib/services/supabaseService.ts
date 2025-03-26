import { createClient } from "@supabase/supabase-js";
import type { Chat, Message } from "$lib/_archived/lib/types/chat";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export const supabaseService = {
  async saveChat(chat: Chat) {
    const { data, error } = await supabase.from("chats").upsert({
      id: chat.id,
      name: chat.name,
      company: chat.company,
      industry: chat.industry,
      region: chat.region,
      created_at: chat.createdAt,
    });

    if (error) throw error;
    return data;
  },

  async saveMessage(chatId: string, message: Message) {
    const { data, error } = await supabase.from("messages").insert({
      chat_id: chatId,
      content: message.content,
      sender: message.sender,
      timestamp: message.timestamp,
      status: message.status,
    });

    if (error) throw error;
    return data;
  },

  async loadChats() {
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async loadMessages(chatId: string) {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("timestamp", { ascending: true });

    if (error) throw error;
    return data;
  },
};
