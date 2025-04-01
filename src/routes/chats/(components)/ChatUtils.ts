import { sampleChats } from '$lib';
import type { Chat } from '$lib/types';
import { ChatService } from '$lib/services/ChatService';

/**
 * Load all chats from storage or sample data
 * Uses the ChatService with server-side caching
 */
export async function loadAllChats(): Promise<Chat[]> {
  // First try to get from ChatService
  const chats = await ChatService.getAllChats();
  
  // If no chats found, use sample chats and cache them
  if (chats.length === 0) {
    ChatService.cacheChats(sampleChats);
    return sampleChats;
  }
  
  return chats;
}

/**
 * Load a single chat by ID
 * Uses the ChatService with server-side caching
 */
export async function loadChatById(id: string): Promise<Chat | null> {
  if (!id) return null;
  
  // First try to get from ChatService
  const chat = await ChatService.getChatById(id);
  
  // If not found, check in sample chats
  if (!chat) {
    const sampleChat = sampleChats.find(chat => chat.id === id);
    if (sampleChat) {
      // Cache the sample chat for future requests
      ChatService.cacheChat(sampleChat);
      return sampleChat;
    }
    return null;
  }
  
  return chat;
}