// --- SVELTE 5 STORE EXPORTS ---
import { v4 as uuidv4 } from "uuid";
import type { Chat, Message } from "$lib/types";
import { idbService } from "$lib/services/IDBService";
import { browser } from "$app/environment";
import { generateAIResponse } from "$lib/services/OpenAIService";

// Removed all $state exports. Only utility functions and helpers remain.

// Fetch default system prompt from markdown
async function fetchDefaultSystemPrompt(): Promise<string> {
  const res = await fetch('/src/routes/chats/(lib)/data/system_prompt.md');
  return await res.text();
}

export async function loadSystemPrompt() {
  let prompt = await idbService?.getSetting?.('systemPrompt');
  if (!prompt) {
    prompt = await fetchDefaultSystemPrompt();
    if (prompt && idbService) await idbService.setSetting('systemPrompt', prompt);
  }
  // systemPrompt is now managed by chatManager singleton
}

export async function initializeChatState(): Promise<void> {
  if (!browser) {
    return;
  }
  try {
    if (!idbService) throw new Error("IndexedDB not available");
    const allChats = await idbService.getAllChats();
    // chats are now managed by chatManager singleton
  } catch (e) {
    // chatError is now managed by chatManager singleton
  }
}

export async function createChat(name = "New Chat", context?: any): Promise<Chat | null> {
  const id = uuidv4();
  const now = new Date().toISOString();
  const newChat: Chat = { id, name, messages: [], createdAt: now, updatedAt: now, context: context || undefined };
  // chats are now managed by chatManager singleton
  return newChat;
}

export async function addMessage(chatId: string, message: Message): Promise<boolean> {
  // chats are now managed by chatManager singleton
  return true;
}

export async function deleteChat(chatId: string): Promise<boolean> {
  // chats are now managed by chatManager singleton
  return true;
}

if (browser) {
  loadSystemPrompt();
  // initializeChatState is now managed by chatManager singleton
}
