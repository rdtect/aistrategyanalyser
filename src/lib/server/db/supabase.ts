import { createClient } from "@supabase/supabase-js";
import type { Chat } from "$lib/types";

// Define variables for Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
}

// Create the client directly here
export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

export async function getChat(chatId: string): Promise<Chat | null> {
  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .eq("id", chatId)
    .single();

  if (error) {
    console.error("Error fetching chat:", error);
    return null;
  }

  return data;
}
