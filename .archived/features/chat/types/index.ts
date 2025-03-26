/**
 * Chat Feature Type Definitions
 * 
 * This file contains all the TypeScript interfaces and types
 * related to the chat feature in the AI Strategy Analyzer application.
 */

/**
 * Chat interface representing a single conversation
 */
export interface Chat {
  /** Unique identifier for the chat */
  id: string;
  
  /** Display name for the chat */
  name: string;
  
  /** Optional company name associated with this chat/analysis */
  company?: string;
  
  /** Optional industry category */
  industry?: string;
  
  /** Optional region information */
  region?: string;
  
  /** Creation timestamp (ISO string or number) */
  createdAt: string | number;
  
  /** Last update timestamp (ISO string or number) */
  updatedAt: string | number;
  
  /** Array of messages in this chat */
  messages: ChatMessage[];
}

/**
 * Chat message representing a single message in a chat
 */
export interface ChatMessage {
  /** Unique identifier for the message */
  id: string;
  
  /** Message content */
  content: string;
  
  /** Sender of the message (user, AI, or system) */
  sender: 'user' | 'ai' | 'system';
  
  /** Timestamp when the message was sent (ISO string or number) */
  timestamp: string | number;
}

/**
 * AI model settings
 */
export interface ModelSettings {
  /** The AI model to use (e.g., "gpt-4o") */
  model: string;
  
  /** Temperature setting (0-1) */
  temperature: number;
  
  /** Whether to enable web search */
  webSearch: boolean;
  
  /** Web search context size (small, medium, large) */
  webSearchContextSize?: 'small' | 'medium' | 'large';
}

/**
 * Health status information
 */
export interface HealthStatus {
  /** Whether the system is active */
  isActive: boolean;
  
  /** When the status was last checked */
  lastChecked: string;
  
  /** OpenAI-specific health information */
  openai: {
    connected: boolean;
    model?: string;
    error?: string;
  };
}

/**
 * Chat export formats
 */
export type ExportFormat = 'markdown' | 'html' | 'json';

/**
 * Result of a file system access operation
 */
export interface FileSystemResult {
  success: boolean;
  error?: string;
}