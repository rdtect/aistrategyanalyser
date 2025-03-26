import { openDB, type DBSchema } from "idb";

interface ChatDB extends DBSchema {
  chats: {
    key: string;
    value: {
      id: string;
      name: string;
      company?: string;
      industry?: string;
      region?: string;
      messages: Array<{
        id: string;
        content: string;
        sender: "user" | "ai" | "system";
        timestamp: string;
      }>;
      createdAt: string;
      updatedAt: string;
    };
    indexes: { "by-date": string };
  };
}

const DB_NAME = "ai-strategy-analyzer";
const DB_VERSION = 1;

export async function getDb() {
  return openDB<ChatDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const chatStore = db.createObjectStore("chats", { keyPath: "id" });
      chatStore.createIndex("by-date", "updatedAt");
    },
  });
}

export async function getAllChats() {
  const db = await getDb();
  return db.getAllFromIndex("chats", "by-date");
}

export async function getChatById(id: string) {
  const db = await getDb();
  return db.get("chats", id);
}

export async function saveChat(chat: ChatDB["chats"]["value"]) {
  const db = await getDb();
  chat.updatedAt = new Date().toISOString();
  return db.put("chats", chat);
}

export async function deleteChat(id: string) {
  const db = await getDb();
  return db.delete("chats", id);
}
