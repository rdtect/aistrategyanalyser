/**
 * Chat Types - Core type definitions for the chat feature
 */

// Message sender types
export type MessageSender = "user" | "ai" | "system";

// Message status types
export type MessageStatus = "sending" | "sent" | "error" | "streaming" | "regenerating" | "thinking";

// Source information for message citations
export interface Source {
  title: string;
  url?: string;
  content?: string;
}

// Message interface
export interface ChatMessage {
  id: string;
  content: string;
  sender: MessageSender;
  timestamp: number | string; // Accept either number (milliseconds) or ISO string
  status?: MessageStatus;
  sources?: Source[];
  index?: number; // Optional for compatibility with older code
}

// Chat context interface
export interface ChatContext {
  company: string;
  industry: string;
  region: string;
  additionalInfo?: string; // Any additional context beyond the structured fields
}

// Chat interface
export interface Chat {
  id: string;
  name: string;
  context: ChatContext;
  createdAt: number | string; // Accept either number (milliseconds) or ISO string
  updatedAt: number | string; // Accept either number (milliseconds) or ISO string
  messages: ChatMessage[];
}

// Health status interface
export interface HealthStatus {
  isActive: boolean;
  lastChecked: string;
  openai: {
    connected: boolean;
    model?: string;
    error?: string;
  };
}

// Model settings interface
export interface ModelSettings {
  model: string;
  temperature: number;
  webSearch?: boolean;
  webSearchContextSize?: "small" | "medium" | "large";
}
