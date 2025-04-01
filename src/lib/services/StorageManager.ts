/**
 * StorageManager service
 * Handles persistent storage permissions and provides information about storage usage.
 */

interface StorageEstimate {
  quota: number;
  usage: number;
  usageDetails?: {
    [key: string]: number;
  };
  persisted: boolean;
}

/**
 * Check if the browser supports the Storage Manager API
 */
export function isStorageManagerSupported(): boolean {
  return (
    typeof navigator !== "undefined" &&
    "storage" in navigator &&
    "persist" in navigator.storage &&
    "estimate" in navigator.storage
  );
}

/**
 * Request persistent storage permission
 * This prevents the browser from automatically clearing the storage
 * when disk space is low.
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (!isStorageManagerSupported()) {
    console.warn("Storage Manager API is not supported in this browser");
    return false;
  }

  try {
    return await navigator.storage.persist();
  } catch (error) {
    console.error("Error requesting persistent storage:", error);
    return false;
  }
}

/**
 * Check if storage is persisted already
 */
export async function isStoragePersisted(): Promise<boolean> {
  if (!isStorageManagerSupported()) {
    return false;
  }

  try {
    return await navigator.storage.persisted();
  } catch (error) {
    console.error("Error checking storage persistence:", error);
    return false;
  }
}

/**
 * Get storage usage estimate
 */
export async function getStorageEstimate(): Promise<StorageEstimate | null> {
  if (!isStorageManagerSupported()) {
    return null;
  }

  try {
    // Cast to any to access potential non-standard property
    const estimate: any = await navigator.storage.estimate();
    const persisted = await navigator.storage.persisted();

    // Define our extended interface locally
    interface ExtendedStorageEstimate {
      quota: number;
      usage: number;
      usageDetails?: { [key: string]: number };
      persisted: boolean;
    }

    const result: ExtendedStorageEstimate = {
      quota: estimate.quota || 0,
      usage: estimate.usage || 0,
      // Safely access usageDetails if it exists
      usageDetails: estimate.usageDetails ?? {},
      persisted,
    };
    return result;
  } catch (error) {
    console.error("Error getting storage estimate:", error);
    return null;
  }
}

/**
 * Format bytes to a human-readable string (KB, MB, GB)
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
  );
}

/**
 * Initialize storage persistence
 * This will request permission if not already granted
 */
export async function initializeStoragePersistence(
  silentMode = false,
): Promise<boolean> {
  // Check if already persisted
  const persisted = await isStoragePersisted();

  if (persisted) {
    !silentMode && console.log("Storage is already persisted");
    return true;
  }

  // Request permission
  const result = await requestPersistentStorage();

  if (result) {
    !silentMode && console.log("Storage persistence granted successfully");
  } else {
    !silentMode &&
      console.warn("Storage persistence request was denied or failed");
  }

  return result;
}
