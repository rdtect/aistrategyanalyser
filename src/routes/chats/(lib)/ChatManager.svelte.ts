/**
 * ChatManager: Singleton for chat state management
 * 
 * This class serves as the single source of truth for all chat-related state in the application.
 * It uses Svelte 5 runes for reactivity and provides methods for chat operations.
 * 
 * Important architectural patterns:
 * - All components should import the exported singleton instance
 * - No direct $state exports to prevent naming conflicts and reassignment errors
 * - All chat state mutations flow through this manager
 */

import { v4 as uuidv4 } from "uuid";
import type { Chat, Message } from "$lib/types";
import { idbService } from "$lib/services/IDBService";
import { browser } from "$app/environment";
import { SvelteMap } from "svelte/reactivity";
import { generateAIResponse } from "$lib/services/OpenAIService";
import { fetchDefaultSystemPrompt } from "$lib/state/chatState.svelte";

class ChatManager {
  // Reactive state with Svelte 5 runes
  chatsMap = $state(new SvelteMap<string, Chat>());
  activeChatId = $state<string | null>(null);
  isLoading = $state<boolean>(true);
  error = $state<string | null>(null);
  isStreaming = $state<boolean>(false);
  streamingContent = $state<string>("");
  systemPrompt = $state<string | null>(null);
  abortController = $state<AbortController | null>(null);

  // Derived properties
  chatList = $derived.by((): Chat[] => Array.from(this.chatsMap.values()));
  activeChat = $derived.by(() => this.activeChatId ? this.chatsMap.get(this.activeChatId) ?? null : null);
  
  constructor() {
    if (browser) {
      // Initialize state when in browser
      this.loadSystemPrompt();
      this.initializeChatState();
    }
  }

  /**
   * Load system prompt from IDB or fallback to default
   */
  async loadSystemPrompt(): Promise<string | null> {
    if (!browser || !idbService) return null;
    
    try {
      let prompt = await idbService.getSetting('systemPrompt');
      if (!prompt) {
        prompt = await fetchDefaultSystemPrompt();
        if (prompt) await idbService.setSetting('systemPrompt', prompt);
      }
      this.systemPrompt = prompt;
      return prompt;
    } catch (error) {
      this.error = `Failed to load system prompt: ${error instanceof Error ? error.message : String(error)}`;
      return null;
    }
  }

  /**
   * Initialize chat state from IndexedDB
   */
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
      
      // Repopulate existing map instead of replacing (preserves reactivity)
      this.chatsMap.clear();
      for (const chat of chats) this.chatsMap.set(chat.id, chat);
      
      // Ensure activeChatId is valid
      if (this.activeChatId && !this.chatsMap.has(this.activeChatId)) {
        this.activeChatId = null;
      }
    } catch (error) {
      this.error = `Failed to load chats: ${error instanceof Error ? error.message : String(error)}`;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Create a new chat
   */
  async createChat(name = "New Chat", context?: any): Promise<Chat | null> {
    const id = uuidv4();
    const now = new Date().toISOString();
    const newChat: Chat = { 
      id, 
      name, 
      messages: [], 
      createdAt: now, 
      updatedAt: now, 
      context: context || undefined 
    };
    
    try {
      if (!idbService) throw new Error("IndexedDB not available");
      await idbService.saveChat(newChat);
      this.chatsMap.set(id, newChat);
      this.activeChatId = id;
      return newChat;
    } catch (error) {
      this.error = `Failed to create chat: ${error instanceof Error ? error.message : String(error)}`;
      return null;
    }
  }

  /**
   * Delete a chat by ID
   */
  async deleteChat(id: string): Promise<boolean> {
    try {
      if (!idbService) throw new Error("IndexedDB not available");
      await idbService.deleteChat(id);
      this.chatsMap.delete(id);
      
      if (this.activeChatId === id) {
        this.activeChatId = null;
      }
      return true;
    } catch (error) {
      this.error = `Failed to delete chat: ${error instanceof Error ? error.message : String(error)}`;
      return false;
    }
  }

  /**
   * Select a chat as the active chat
   */
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
    
    // Add system prompt if available
    if (this.systemPrompt) {
      messages.push({ role: "system", content: this.systemPrompt });
    }
    
    // Insert indexed context chunks (if any)
    if (contextChunks.length > 0) {
      messages.push(...contextChunks);
    }
    
    // Add last N chat messages (windowed context)
    const windowSize = 10;
    const priorMessages = chat.messages.slice(-windowSize);
    messages.push(...priorMessages);
    
    // Add the new user message
    messages.push(userMessage);
    return messages;
  }

  /**
   * Send a message in the active chat
   */
  async sendMessage(content: string, contextChunks: Message[] = []): Promise<void> {
    // Validate inputs and state
    if (!content.trim() || this.isStreaming) return;
    const chatId = this.activeChatId;
    if (!chatId) return;
    
    // Create user message
    const userMessage: Message = { 
      id: uuidv4(), 
      role: "user", 
      content, 
      timestamp: new Date().toISOString() 
    };
    
    const chat = this.chatsMap.get(chatId);
    if (!chat) return;
    
    // Update chat with user message
    const updatedChat = { 
      ...chat, 
      messages: [...chat.messages, userMessage], 
      updatedAt: new Date().toISOString() 
    };
    
    try {
      if (!idbService) throw new Error("IndexedDB not available");
      await idbService.saveChat(updatedChat);
      this.chatsMap.set(chatId, updatedChat);
      this.isStreaming = true;
      this.streamingContent = "";
      
      // Prepare messages for OpenAI
      const messagesForAI = this.prepareMessagesForAI(updatedChat, userMessage, contextChunks);
      
      try {
        // Get AI response
        const aiResult = await generateAIResponse(messagesForAI);
        
        // Create AI message
        const aiMessage: Message = {
          id: uuidv4(),
          role: "assistant",
          content: aiResult.response.message.content ?? "[No response]",
          timestamp: new Date().toISOString()
        };
        
        // Update chat with AI response
        const chatWithAI = { 
          ...updatedChat, 
          messages: [...updatedChat.messages, aiMessage], 
          updatedAt: new Date().toISOString() 
        };
        
        await idbService.saveChat(chatWithAI);
        this.chatsMap.set(chatId, chatWithAI);
      } catch (error) {
        this.error = `Failed to get AI response: ${error instanceof Error ? error.message : String(error)}`;
      } finally {
        this.isStreaming = false;
        this.streamingContent = "";
      }
    } catch (error) {
      this.error = `Failed to send message: ${error instanceof Error ? error.message : String(error)}`;
      this.isStreaming = false;
    }
  }

  /**
   * Cancel an in-progress AI response
   */
  cancelAIResponse(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
      this.isStreaming = false;
    }
  }
}

/**
 * Singleton instance of ChatManager
 * Import this in all components that need access to chat state
 */
const chatManager = new ChatManager();
export { chatManager };
