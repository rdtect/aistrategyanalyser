/**
 * StorageManager service
 * Handles persistent storage permissions and provides information about storage usage.
 */

import { browser } from "$app/environment";
import { logError } from "../utils/errorHandler";

interface StorageEstimate {
  quota: number;
  usage: number;
  usageDetails?: {
    [key: string]: number;
  };
  persisted: boolean;
}

export class StorageManagerService {
  constructor() {
    if (!browser) {
      console.warn(
        "StorageManagerService is intended for browser environments.",
      );
    }
  }

  isSupported(): boolean {
    return (
      browser &&
      "storage" in navigator &&
      "persist" in navigator.storage &&
      "estimate" in navigator.storage
    );
  }

  async requestPersistence(): Promise<boolean> {
    if (!this.isSupported()) {
      console.warn("Storage Manager API is not supported.");
      return false;
    }
    try {
      return await navigator.storage.persist();
    } catch (error) {
      logError(error, "StorageManagerService.requestPersistence");
      return false;
    }
  }

  async isPersisted(): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }
    try {
      return await navigator.storage.persisted();
    } catch (error) {
      logError(error, "StorageManagerService.isPersisted");
      return false;
    }
  }

  async getEstimate(): Promise<StorageEstimate | null> {
    if (!this.isSupported()) {
      return null;
    }
    try {
      const estimate: any = await navigator.storage.estimate();
      const persisted = await navigator.storage.persisted();
      const result: StorageEstimate = {
        quota: estimate.quota || 0,
        usage: estimate.usage || 0,
        usageDetails: estimate.usageDetails ?? {},
        persisted,
      };
      return result;
    } catch (error) {
      logError(error, "StorageManagerService.getEstimate");
      return null;
    }
  }

  async initializePersistence(silentMode = false): Promise<boolean> {
    const persisted = await this.isPersisted();
    if (persisted) {
      !silentMode && console.log("Storage is already persisted");
      return true;
    }
    const result = await this.requestPersistence();
    if (result) {
      !silentMode && console.log("Storage persistence granted successfully");
    } else {
      !silentMode &&
        console.warn("Storage persistence request was denied or failed");
    }
    return result;
  }
}

// Export a singleton instance
export const storageManagerService = browser
  ? new StorageManagerService()
  : null;
