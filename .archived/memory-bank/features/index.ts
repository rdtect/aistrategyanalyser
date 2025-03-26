/**
 * Memory Bank Feature
 * Exports all memory bank components and functionality
 */

// Export components
export { default as MemoryBank } from './components/MemoryBank.svelte';
export { default as MemoryDetail } from './components/MemoryDetail.svelte';
export { default as MemoryExtractor } from './components/MemoryExtractor.svelte';

// Export stores
export { memoryStore } from './stores/MemoryStore';

// Export services
export { memoryExtractionService } from './services/MemoryExtractionService';
export { MemoryStorageManager } from './services/MemoryStorageManager';

// Export types
export type { 
  MemoryItem, 
  MemorySource, 
  MemoryCategory,
  MemoryFilter,
  MemoryContext,
  MemoryBankStats
} from './types/memory';