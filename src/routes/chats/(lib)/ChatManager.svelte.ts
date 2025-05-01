// TODO: Future work: Add chat rename, archive, and multi-step analysis flows if needed.

import { v4 as uuidv4 } from "uuid";
import type { Chat, Message } from "$lib/types";
import { idbService } from "$lib/services/IDBService";
import { browser } from "$app/environment";
import { SvelteMap } from "svelte/reactivity";
import { generateAIResponse } from "$lib/services/OpenAIService";

// Minimal ChatManager singleton for POC
class ChatManager {
  // reactive map instance: mutate in-place to preserve subscriptions
  chatsMap = $state(new SvelteMap<string, Chat>());
  activeChatId = $state<string | null>(null);
  isLoading = $state<boolean>(true);
  error = $state<string | null>(null);
  isStreaming = $state<boolean>(false);
  streamingContent = $state<string>("");

  // Derived chat list and active chat for Svelte 5 runes
  chatList = $derived.by((): Chat[] => Array.from(this.chatsMap.values()));
  activeChat = $derived.by(() => this.activeChatId ? this.chatsMap.get(this.activeChatId) ?? null : null);

  // Add systemPrompt to ChatManager state (global for now, can be per-chat)
  systemPrompt = $state<string>(""); // will be set on init

  abortController: AbortController | null = null;

  // Helper to fetch the global default system prompt from markdown
  async fetchDefaultSystemPrompt(): Promise<string> {
    const res = await fetch('/src/routes/chats/(lib)/data/system_prompt.md');
    return await res.text();
  }

  async loadSystemPrompt() {
    let prompt = await idbService?.getSetting?.('systemPrompt');
    if (!prompt) {
      prompt = await this.fetchDefaultSystemPrompt();
      if (prompt) await idbService?.setSetting?.('systemPrompt', prompt);
    }
    this.systemPrompt = prompt || '';
  }

  constructor() {
    if (browser) {
      this.loadSystemPrompt();
      this.initializeChatState();
    } else {
      this.isLoading = false;
    }
  }

  async initializeChatState(): Promise<void> {
    if (!browser) {
      this.isLoading = false;
      return;
    }
    this.isLoading = true;
    this.error = null;
    try {
      if (!idbService) throw new Error("IndexedDB not available");
      const chats = await idbService.getAllChats();
      console.log('[ChatManager] Loaded chats from IDB:', chats);
      // repopulate existing map instead of replacing
      this.chatsMap.clear();
      for (const c of chats) this.chatsMap.set(c.id, c);
      console.log('[ChatManager] SvelteMap after load:', Array.from(this.chatsMap.values()));
      if (this.activeChatId && !this.chatsMap.has(this.activeChatId)) {
        this.activeChatId = null;
      }
    } catch (e) {
      this.error = `Failed to load chats: ${e instanceof Error ? e.message : String(e)}`;
    } finally {
      this.isLoading = false;
    }
  }

  async createChat(name = "New Chat", context?: any): Promise<Chat | null> {
    const id = uuidv4();
    const now = new Date().toISOString();
    const newChat: Chat = { id, name, messages: [], createdAt: now, updatedAt: now, context: context || undefined };
    try {
      if (!idbService) throw new Error("IndexedDB not available");
      await idbService.saveChat(newChat);
      // add new chat to existing map
      this.chatsMap.set(id, newChat);
      this.activeChatId = id;
      return newChat;
    } catch (e) {
      this.error = "Failed to create chat";
      return null;
    }
  }

  async deleteChat(id: string): Promise<boolean> {
    try {
      if (!idbService) throw new Error("IndexedDB not available");
      await idbService.deleteChat(id);
      // remove chat from existing map
      this.chatsMap.delete(id);
      if (this.activeChatId === id) {
        this.activeChatId = null;
      }
      return true;
    } catch (e) {
      this.error = "Failed to delete chat";
      return false;
    }
  }

  selectChat(id: string | null): void {
    if (id === null) {
      this.activeChatId = null;
      this.error = null;
      return;
    }
    if (this.chatsMap.has(id)) {
      this.activeChatId = id;
      this.error = null;
    }
  }

  /**
   * Prepare messages to send to OpenAI:
   * - System prompt (if set)
   * - Indexed context chunks (if any, placeholder for now)
   * - Recent chat messages (windowed, e.g. last 10)
   */
  prepareMessagesForAI(chat: Chat, userMessage: Message, contextChunks: Message[] = []): Message[] {
    const messages: Message[] = [];
    if (this.systemPrompt) {
      messages.push({ role: "system", content: this.systemPrompt });
    }
    // Insert indexed context chunks (if any)
    if (contextChunks.length > 0) {
      messages.push(...contextChunks);
    }
    // Add last N chat messages (windowed context, e.g. last 10)
    const windowSize = 10;
    const priorMessages = chat.messages.slice(-windowSize);
    messages.push(...priorMessages);
    // Add the new user message
    messages.push(userMessage);
    return messages;
  }

  async sendMessage(content: string, contextChunks: Message[] = []): Promise<void> {
    if (!content.trim() || this.isStreaming) return;
    const chatId = this.activeChatId;
    if (!chatId) return;
    const userMessage: Message = { id: uuidv4(), role: "user", content, timestamp: new Date().toISOString() };
    const chat = this.chatsMap.get(chatId);
    if (!chat) return;
    const updatedChat = { ...chat, messages: [...chat.messages, userMessage], updatedAt: new Date().toISOString() };
    try {
      if (!idbService) throw new Error("IndexedDB not available");
      await idbService.saveChat(updatedChat);
      this.chatsMap.set(chatId, updatedChat);
      this.isStreaming = true;
      this.streamingContent = "";
      // Prepare messages for OpenAI (system prompt, context, windowed history)
      const messagesForAI = this.prepareMessagesForAI(updatedChat, userMessage, contextChunks);
      try {
        const aiResult = await generateAIResponse(messagesForAI);
        const aiMessage: Message = {
          id: uuidv4(),
          role: "assistant",
          content: aiResult.response.message.content ?? "[No response]",
          timestamp: new Date().toISOString()
        };
        const chatWithAI = { ...updatedChat, messages: [...updatedChat.messages, aiMessage], updatedAt: new Date().toISOString() };
        await idbService.saveChat(chatWithAI);
        this.chatsMap.set(chatId, chatWithAI);
      } catch (err) {
        this.error = 'Failed to get AI response.';
      } finally {
        this.isStreaming = false;
        this.streamingContent = "";
      }
    } catch (e) {
      this.error = "Failed to send message";
      this.isStreaming = false;
    }
  }

  cancelAIResponse() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}

const chatManager = new ChatManager();
export { chatManager };
