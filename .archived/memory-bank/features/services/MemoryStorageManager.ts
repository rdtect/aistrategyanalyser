/**
 * MemoryStorageManager - Class-based encapsulation of IndexedDB operations for memory data
 * Optimized for Svelte 5 and SvelteKit 2 best practices
 */
import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { MemoryItem, MemoryFilter } from "../types/memory";
import { browser } from "$app/environment";

// Define the database schema
interface MemoryDB extends DBSchema {
  memories: {
    key: string;
    value: MemoryItem;
    indexes: {
      "by-date": string;
      "by-category": string;
      "by-source": string;
      "by-tags": string[];
    };
  };
}

/**
 * MemoryStorageManager - Handles all memory storage operations
 * Uses class-based encapsulation for better organization and maintainability
 */
export class MemoryStorageManager {
  private static DB_NAME = "ai-strategy-analyzer-memory";
  private static DB_VERSION = 1;
  private static MEMORIES_STORE = "memories";
  private dbPromise: Promise<IDBPDatabase<MemoryDB>> | null = null;

  constructor() {
    // Initialize the database connection when the class is instantiated
    if (browser) {
      this.initDB();
    }
  }

  /**
   * Initialize the database connection
   */
  async initDB(): Promise<IDBPDatabase<MemoryDB> | null> {
    if (!browser) return null;

    try {
      if (!this.dbPromise) {
        console.log(`[Memory Storage] Initializing IndexedDB database: ${MemoryStorageManager.DB_NAME} (v${MemoryStorageManager.DB_VERSION})`);
        
        this.dbPromise = openDB<MemoryDB>(MemoryStorageManager.DB_NAME, MemoryStorageManager.DB_VERSION, {
          upgrade: (db) => this.upgradeDB(db),
          blocked: () => {
            console.warn(`[Memory Storage] Database upgrade was blocked`);
          },
          blocking: () => {
            console.warn(`[Memory Storage] This connection is blocking a database upgrade`);
          },
          terminated: () => {
            console.warn(`[Memory Storage] Database connection was terminated unexpectedly`);
            this.dbPromise = null; // Reset so we can try to reconnect
          }
        });
        
        console.log(`[Memory Storage] IndexedDB database initialized successfully`);
      }

      return this.dbPromise;
    } catch (error) {
      console.error(`[Memory Storage] Failed to initialize IndexedDB:`, error);
      throw error;
    }
  }

  /**
   * Handle database upgrade
   */
  private upgradeDB(db: IDBPDatabase<MemoryDB>): void {
    console.log(`[Memory Storage] Upgrading IndexedDB database to version ${MemoryStorageManager.DB_VERSION}`);
    
    // Check if store already exists
    if (!db.objectStoreNames.contains(MemoryStorageManager.MEMORIES_STORE)) {
      // Create the memories store with the memory ID as the key path
      const memoryStore = db.createObjectStore(MemoryStorageManager.MEMORIES_STORE, {
        keyPath: "id",
      });

      // Create indexes for faster querying
      memoryStore.createIndex("by-date", "updatedAt");
      memoryStore.createIndex("by-category", "category");
      memoryStore.createIndex("by-source", "source");
      memoryStore.createIndex("by-tags", "tags", { multiEntry: true });
      
      console.log(`[Memory Storage] Created ${MemoryStorageManager.MEMORIES_STORE} object store with indexes`);
    } else {
      console.log(`[Memory Storage] ${MemoryStorageManager.MEMORIES_STORE} object store already exists`);
    }
  }

  /**
   * Get the database instance
   */
  private async getDB(): Promise<IDBPDatabase<MemoryDB>> {
    try {
      if (!this.dbPromise) {
        console.log(`[Memory Storage] No database connection, initializing...`);
        const db = await this.initDB();
        if (!db) {
          throw new Error("Failed to initialize database");
        }
        return db;
      }
      return this.dbPromise;
    } catch (error) {
      console.error(`[Memory Storage] Error getting database connection:`, error);
      throw error;
    }
  }

  /**
   * Save a memory item to the database
   */
  async saveMemory(memory: MemoryItem): Promise<void> {
    if (!browser) return;

    try {
      // Create a safe sanitized version of the memory object
      const sanitizedMemory = this.sanitizeMemoryForStorage(memory);

      // Get DB instance
      const db = await this.getDB();

      // Save to IndexedDB
      await db.put("memories", sanitizedMemory);
      console.log(`Memory ${memory.id} saved to IndexedDB`);

      // Dispatch event to notify subscribers
      this.dispatchMemoryUpdateEvent(memory.id);
    } catch (error) {
      console.error(`Failed to save memory ${memory.id} to IndexedDB:`, error);
      throw error;
    }
  }

  /**
   * Helper function to sanitize a memory object for storage
   * This creates a clean object that's safe for IndexedDB storage
   */
  private sanitizeMemoryForStorage(memory: MemoryItem): MemoryItem {
    // Create basic structure with required fields
    const sanitized: MemoryItem = {
      id: memory.id,
      content: String(memory.content || ""),
      source: this.validateSource(memory.source),
      category: this.validateCategory(memory.category),
      tags: Array.isArray(memory.tags) ? memory.tags.map(tag => String(tag)) : [],
      createdAt: typeof memory.createdAt === "string" ? memory.createdAt : new Date().toISOString(),
      updatedAt: typeof memory.updatedAt === "string" ? memory.updatedAt : new Date().toISOString(),
    };

    // Add optional fields if they exist
    if (memory.relevanceScore !== undefined) {
      sanitized.relevanceScore = Number(memory.relevanceScore);
    }

    if (memory.metadata && typeof memory.metadata === 'object') {
      sanitized.metadata = { ...memory.metadata };
    }

    return sanitized;
  }

  /**
   * Validate memory source
   */
  private validateSource(source: any): MemoryItem['source'] {
    const validSources = ['chat', 'user', 'document', 'web', 'system'];
    return validSources.includes(source) ? source : 'user';
  }

  /**
   * Validate memory category
   */
  private validateCategory(category: any): MemoryItem['category'] {
    const validCategories = ['fact', 'insight', 'question', 'action', 'reference', 'custom'];
    return validCategories.includes(category) ? category : 'fact';
  }

  /**
   * Save multiple memories to IndexedDB
   */
  async saveMemories(memories: MemoryItem[]): Promise<void> {
    if (!browser) return;

    try {
      const db = await this.getDB();
      const tx = db.transaction("memories", "readwrite");
      const promises: Promise<any>[] = [];

      // Keep track of processed memory IDs for logging
      const processedIds: string[] = [];

      for (const memory of memories) {
        try {
          // Sanitize each memory before saving to ensure it's IndexedDB compatible
          const sanitizedMemory = this.sanitizeMemoryForStorage(memory);
          promises.push(tx.store.put(sanitizedMemory));
          processedIds.push(sanitizedMemory.id);
        } catch (err) {
          console.error(`Failed to process memory ${memory.id}:`, err);
        }
      }

      // Add the transaction completion to the promises
      promises.push(tx.done);

      // Wait for all operations to complete
      await Promise.all(promises);
      console.log(
        `${processedIds.length} memories saved to IndexedDB: ${processedIds.join(", ")}`,
      );
    } catch (error) {
      console.error("Error saving multiple memories to IndexedDB:", error);
      throw error;
    }
  }

  /**
   * Get a memory by ID
   */
  async getMemory(id: string): Promise<MemoryItem | undefined> {
    if (!browser) return undefined;

    const db = await this.getDB();
    return db.get("memories", id);
  }

  /**
   * Get all memories
   */
  async getAllMemories(): Promise<MemoryItem[]> {
    if (!browser) return [];

    const db = await this.getDB();
    return db.getAll("memories");
  }

  /**
   * Get memories by filter
   */
  async getMemoriesByFilter(filter: MemoryFilter): Promise<MemoryItem[]> {
    if (!browser) return [];

    const db = await this.getDB();
    let memories = await db.getAll("memories");

    // Apply filters
    if (filter.searchTerm) {
      const searchTermLower = filter.searchTerm.toLowerCase();
      memories = memories.filter(memory => 
        memory.content.toLowerCase().includes(searchTermLower) ||
        memory.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
      );
    }

    if (filter.categories && filter.categories.length > 0) {
      memories = memories.filter(memory => 
        filter.categories!.includes(memory.category)
      );
    }

    if (filter.sources && filter.sources.length > 0) {
      memories = memories.filter(memory => 
        filter.sources!.includes(memory.source)
      );
    }

    if (filter.tags && filter.tags.length > 0) {
      memories = memories.filter(memory => 
        filter.tags!.some(tag => memory.tags.includes(tag))
      );
    }

    if (filter.dateRange) {
      if (filter.dateRange.start) {
        const startDate = new Date(filter.dateRange.start).getTime();
        memories = memories.filter(memory => 
          new Date(memory.createdAt).getTime() >= startDate
        );
      }
      
      if (filter.dateRange.end) {
        const endDate = new Date(filter.dateRange.end).getTime();
        memories = memories.filter(memory => 
          new Date(memory.createdAt).getTime() <= endDate
        );
      }
    }

    // Apply sorting
    const sortField = filter.sortBy || 'updatedAt';
    const sortDirection = filter.sortDirection || 'desc';
    
    memories.sort((a, b) => {
      let valueA, valueB;
      
      if (sortField === 'relevance') {
        valueA = a.relevanceScore || 0;
        valueB = b.relevanceScore || 0;
      } else {
        valueA = new Date(a[sortField]).getTime();
        valueB = new Date(b[sortField]).getTime();
      }
      
      return sortDirection === 'asc' 
        ? valueA - valueB 
        : valueB - valueA;
    });

    return memories;
  }

  /**
   * Get memories by tag
   */
  async getMemoriesByTag(tag: string): Promise<MemoryItem[]> {
    if (!browser) return [];

    const db = await this.getDB();
    const memories = await db.getAllFromIndex("memories", "by-tags", tag);
    return memories;
  }

  /**
   * Get memories by category
   */
  async getMemoriesByCategory(category: MemoryItem['category']): Promise<MemoryItem[]> {
    if (!browser) return [];

    const db = await this.getDB();
    const memories = await db.getAllFromIndex("memories", "by-category", category);
    return memories;
  }

  /**
   * Get memories by source
   */
  async getMemoriesBySource(source: MemoryItem['source']): Promise<MemoryItem[]> {
    if (!browser) return [];

    const db = await this.getDB();
    const memories = await db.getAllFromIndex("memories", "by-source", source);
    return memories;
  }

  /**
   * Delete a memory by ID
   */
  async deleteMemory(id: string): Promise<void> {
    if (!browser) return;

    const db = await this.getDB();
    await db.delete("memories", id);
    console.log(`Memory ${id} deleted from IndexedDB`);

    // Dispatch event to notify subscribers
    this.dispatchMemoryUpdateEvent(id);
  }

  /**
   * Delete multiple memories by IDs
   */
  async deleteMemories(ids: string[]): Promise<void> {
    if (!browser) return;

    const db = await this.getDB();
    const tx = db.transaction("memories", "readwrite");
    
    const promises = ids.map(id => tx.store.delete(id));
    promises.push(tx.done);
    
    await Promise.all(promises);
    console.log(`Deleted ${ids.length} memories from IndexedDB`);
    
    // Dispatch event to notify subscribers
    this.dispatchMemoryUpdateEvent();
  }

  /**
   * Clear all memories (for testing/debugging)
   */
  async clearAllMemories(): Promise<void> {
    if (!browser) return;

    const db = await this.getDB();
    await db.clear("memories");
    console.log("All memories cleared from IndexedDB");
    
    // Dispatch event to notify subscribers
    this.dispatchMemoryUpdateEvent();
  }

  /**
   * Export all memories as JSON
   */
  async exportMemoriesAsJSON(): Promise<string> {
    if (!browser) return "[]";

    const memories = await this.getAllMemories();
    return JSON.stringify(memories, null, 2);
  }

  /**
   * Import memories from JSON
   */
  async importMemoriesFromJSON(json: string): Promise<number> {
    if (!browser) return 0;

    try {
      const memories = JSON.parse(json) as MemoryItem[];

      if (!Array.isArray(memories)) {
        throw new Error("Invalid JSON format: expected an array of memories");
      }

      await this.saveMemories(memories);
      return memories.length;
    } catch (error) {
      console.error("Error importing memories:", error);
      throw error;
    }
  }

  /**
   * Helper function to dispatch memory update events
   */
  private dispatchMemoryUpdateEvent(memoryId?: string): void {
    if (browser) {
      window.dispatchEvent(
        new CustomEvent("userMemoriesUpdated", {
          detail: { memoryId },
        }),
      );
    }
  }
}