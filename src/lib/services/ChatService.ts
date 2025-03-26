import type { Chat, Message } from "../../routes/chats/types";
import { browser } from '$app/environment';
import { IDBService } from './idb.svelte';
import { logError, withRetry, ErrorMessages } from '$lib/utils/errorHandler';

/**
 * ChatService provides a unified interface for chat operations
 * with server-side caching and client-side persistence
 */
export class ChatService {
  // Server-side cache for faster access
  private static serverCache = new Map<string, Chat>();
  
  /**
   * Get all chats from storage with retries and improved error handling
   */
  static async getAllChats(): Promise<Chat[]> {
    if (browser) {
      try {
        // Use withRetry for more resilient data loading
        return await withRetry(
          async () => await IDBService.getAllChats(),
          3,  // 3 attempts
          500  // 500ms base delay
        );
      } catch (error) {
        logError(error, 'ChatService.getAllChats');
        return [];
      }
    } else {
      // Return from server cache when in SSR context
      return Array.from(this.serverCache.values());
    }
  }
  
  /**
   * Get a chat by ID with enhanced error handling and fallbacks
   */
  static async getChatById(id: string): Promise<Chat | null> {
    if (!id) return null;
    
    if (browser) {
      try {
        // Use withRetry for more resilient data loading
        return await withRetry(
          async () => {
            const chat = await IDBService.getChat(id);
            if (!chat && typeof localStorage !== 'undefined') {
              // Try localStorage fallbacks if IDB fails
              const fallbackJson = localStorage.getItem(`chat_fallback_${id}`) || 
                                  localStorage.getItem(`chat_backup_${id}`);
              if (fallbackJson) {
                console.log(`Found chat ${id} in localStorage fallback`);
                return JSON.parse(fallbackJson);
              }
            }
            return chat;
          },
          3,  // 3 attempts
          500  // 500ms base delay
        );
      } catch (error) {
        logError(error, 'ChatService.getChatById', { chatId: id });
        return null;
      }
    } else {
      // Return from server cache when in SSR context
      return this.serverCache.get(id) || null;
    }
  }
  
  /**
   * Save a chat with fallbacks and resilience
   */
  static async saveChat(chat: Chat): Promise<void> {
    if (!chat || !chat.id) {
      throw new Error(ErrorMessages.INVALID_INPUT);
    }
    
    // Ensure we're not using a proxy object
    const serializedChat = JSON.parse(JSON.stringify(chat));
    
    if (browser) {
      // In browser, use IDBService with retries
      try {
        await withRetry(
          async () => {
            await IDBService.saveChat(serializedChat);
            
            // Also save to localStorage as backup
            if (typeof localStorage !== 'undefined') {
              try {
                localStorage.setItem(`chat_backup_${chat.id}`, JSON.stringify(serializedChat));
              } catch (lsError) {
                console.warn(`Could not save backup to localStorage:`, lsError);
              }
            }
          },
          3,  // 3 attempts
          500  // 500ms base delay
        );
      } catch (error) {
        logError(error, 'ChatService.saveChat', { chatId: chat.id });
        
        // Try localStorage as a last resort
        if (typeof localStorage !== 'undefined') {
          try {
            localStorage.setItem(`chat_fallback_${chat.id}`, JSON.stringify(serializedChat));
            console.log(`Saved chat ${chat.id} to localStorage fallback`);
          } catch (lsError) {
            // Re-throw the original error if localStorage also fails
            throw error;
          }
        } else {
          throw error;
        }
      }
    } else {
      // In SSR, update server cache
      this.serverCache.set(chat.id, serializedChat);
    }
  }
  
  /**
   * Delete a chat
   */
  static async deleteChat(id: string): Promise<void> {
    if (!id) return;
    
    if (browser) {
      try {
        await IDBService.deleteChat(id);
      } catch (error) {
        console.error(`Error deleting chat ${id}:`, error);
        throw error;
      }
    } else {
      // In SSR, remove from server cache
      this.serverCache.delete(id);
    }
  }
  
  /**
   * Add a message to a chat
   */
  static async addMessage(chatId: string, message: Message): Promise<Chat | null> {
    if (!chatId || !message) return null;
    
    // Get the chat
    const chat = await this.getChatById(chatId);
    if (!chat) return null;
    
    // Add the message
    chat.messages.push(message);
    chat.updatedAt = new Date().toISOString();
    
    // Save the updated chat
    await this.saveChat(chat);
    
    return chat;
  }
  
  /**
   * Cache a chat in the server-side store
   * Used by server-side load functions to improve performance
   */
  static cacheChat(chat: Chat): void {
    if (!browser && chat && chat.id) {
      this.serverCache.set(chat.id, chat);
    }
  }
  
  /**
   * Cache multiple chats in the server-side store
   */
  static cacheChats(chats: Chat[]): void {
    if (!browser && chats && chats.length > 0) {
      chats.forEach(chat => {
        if (chat && chat.id) {
          this.serverCache.set(chat.id, chat);
        }
      });
    }
  }
  
  /**
   * Clear the server-side cache
   */
  static clearCache(): void {
    if (!browser) {
      this.serverCache.clear();
    }
  }
}