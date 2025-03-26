import { supabase } from "$lib/core/utils/db/supabase";
import { user } from "$lib/features/auth/stores/authStore.svelte";
import { get } from "svelte/store";
import * as indexedDb from "$lib/core/utils/db/indexedDb";
import type { User } from "@supabase/supabase-js";

const isBrowser = typeof window !== "undefined";

// Sync chat metadata to Supabase
export async function syncChatMetadata(chatId: string) {
  if (!isBrowser) {
    return { error: "Cannot sync during server-side rendering" };
  }

  const currentUser = get(user);
  if (!currentUser) return { error: "User not authenticated" };

  // Type assertion for currentUser
  const userId = currentUser.id;

  const chat = await indexedDb.getChatById(chatId);
  if (!chat) return { error: "Chat not found" };

  const { error } = await supabase.from("chat_metadata").upsert({
    id: chat.id,
    user_id: userId,
    name: chat.name,
    company: chat.company || null,
    industry: chat.industry || null,
    region: chat.region || null,
    updated_at: new Date().toISOString(),
  });

  return { error };
}

// Get all chat metadata for the current user
export async function getUserChatMetadata() {
  if (!isBrowser) {
    return {
      data: null,
      error: "Cannot get metadata during server-side rendering",
    };
  }

  const currentUser = get(user);
  if (!currentUser) return { data: null, error: "User not authenticated" };

  const { data, error } = await supabase
    .from("chat_metadata")
    .select("*")
    .eq("user_id", currentUser.id)
    .order("updated_at", { ascending: false });

  return { data, error };
}
