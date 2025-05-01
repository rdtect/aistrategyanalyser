// src/lib/services/IDBService.ts
import Dexie, { type Table } from 'dexie';
import type { Chat, Message } from '$lib/types';
import { browser } from '$app/environment';
import { logError } from '$lib/utils/errorHandler';

export class IDBService extends Dexie {
  // Declare tables in the database
  chats!: Table<Chat, string>; // string is the type of the primary key (id)
  settings!: Table<{ id: string; value: string }, string>; // Add this line for settings

  constructor() {
    super('ai-chat-db'); // Database name
    this.version(2).stores({
      // Define schema for version 1
      // 'id' is the primary key, 'updatedAt' is an index for sorting/querying
      chats: 'id, updatedAt',
      settings: 'id', // Add settings table
    });
    // No need to explicitly call open() - Dexie does it automatically
    // upon first interaction if the DB isn't open yet.
    console.log('Dexie IDBService initialized');
  }

  // --- CRUD Operations ---

  async getAllChats(): Promise<Chat[]> {
    if (!browser) return []; // Dexie only works in the browser
    try {
      // Dexie automatically handles DB opening/readiness
      return await this.chats.orderBy('updatedAt').reverse().toArray();
    } catch (error) {
      logError(error, 'IDBService.getAllChats');
      return []; // Return empty on error
    }
  }

  async getChat(id: string): Promise<Chat | null> {
    if (!browser) return null;
    try {
      const chat = await this.chats.get(id);
      return chat ?? null; // Return chat or null if not found
    } catch (error) {
      logError(error, 'IDBService.getChat', { chatId: id });
      return null; // Return null on error
    }
  }

  async saveChat(chat: Chat): Promise<string | null> {
    if (!browser || !chat || !chat.id) return null;
    try {
      // Ensure we save a plain object if `chat` might be a Svelte proxy
      const plainChat = JSON.parse(JSON.stringify(chat));
      const savedId = await this.chats.put(plainChat);
      console.log(`IDB: Successfully saved chat ${savedId}`);
      return savedId;
    } catch (error) {
      logError(error, 'IDBService.saveChat', { chatId: chat.id });
      // Consider if further fallback (e.g., notify user) is needed
      return null; // Indicate save failure
    }
  }

  async deleteChat(id: string): Promise<boolean> {
    if (!browser || !id) return false;
    try {
      await this.chats.delete(id);
      console.log(`IDB: Deleted chat ${id}`);
      return true;
    } catch (error) {
      logError(error, 'IDBService.deleteChat', { chatId: id });
      return false;
    }
  }

  async addMessageToChat(chatId: string, message: Message): Promise<boolean> {
    if (!browser || !chatId || !message) return false;
    try {
      // Use Dexie's update method for atomic modification
      const count = await this.chats.update(chatId, (chat) => {
        // Dexie passes the existing chat object here
        // Ensure messages array exists
        if (!chat.messages) {
          chat.messages = [];
        }
        chat.messages.push(message);
        chat.updatedAt = new Date().toISOString();
        // No need to return anything specific unless modifying the primary key
      });
      if (count > 0) {
        console.log(`IDB: Added message to chat ${chatId}`);
        return true;
      } else {
        logError(new Error('Chat not found for adding message'), 'IDBService.addMessageToChat', { chatId });
        return false; // Chat with chatId not found
      }
    } catch (error) {
      logError(error, 'IDBService.addMessageToChat', { chatId });
      return false;
    }
  }

  async importChatFromJson(jsonString: string): Promise<string | null> {
     if (!browser) return null;
     try {
       const chat: Chat = JSON.parse(jsonString);
       // Basic validation
       if (!chat || !chat.id || !Array.isArray(chat.messages)) {
         throw new Error("Invalid chat data structure for import.");
       }
       // TODO: Add more robust validation using the validateAndHydrateChat logic if needed
       return await this.saveChat(chat);
     } catch (error) {
       logError(error, 'IDBService.importChatFromJson');
       return null;
     }
   }

  // --- Settings CRUD ---
  async getSetting(id: string): Promise<string | null> {
    if (!browser) return null;
    try {
      const entry = await this.settings.get(id);
      return entry?.value ?? null;
    } catch (e) {
      logError(e, 'IDBService.getSetting', { id });
      return null;
    }
  }

  async setSetting(id: string, value: string): Promise<void> {
    if (!browser) return;
    try {
      await this.settings.put({ id, value });
    } catch (e) {
      logError(e, 'IDBService.setSetting', { id, value });
    }
  }
}

// Export a singleton instance
export const idbService = browser ? new IDBService() : null;
