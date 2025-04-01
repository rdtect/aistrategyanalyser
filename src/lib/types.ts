/**
 * Core type definitions for the application
 */

export interface Message {
  id?: string; // Optional ID
  role: "user" | "assistant" | "system";
  content: string | null;
  timestamp?: string;
  status?: "sending" | "sent" | "error" | "streaming" | "delivered" | "read";
  index?: number;
  sources?: Array<{
    title: string;
    url?: string;
  }>;
  tool_calls?: any;
  tool_call_id?: string;
}

export interface ChatContext {
  id: string;
  name: string;
  tags?: string[];
  userId?: string; // Added for potential multi-user scenarios
  model_config?: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  };
  analysis_preferences?: {
    // Example structure
    focus_areas?: string[];
    output_format?: string;
  };
  system_prompt?: string; // Add optional system prompt
  company?: string;
  industry?: string;
  region?: string;
  additionalInfo?: string;
  competitors?: string[];
  selectedQuestionIds?: string[];
  // Add other relevant context fields as needed
}

export interface Chat {
  id: string; // UUID
  name: string;
  messages: Message[];
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
  context?: ChatContext;
  // Optional metadata
  tags?: string[];
  isArchived?: boolean;
}

// --- Settings Types ---

export interface ProfileSettings {
  name: string;
  // email?: string; // Example future field
}

export interface ThemeSettings {
  darkMode: "system" | "dark" | "light";
}

export interface OpenAISettings {
  apiKey: string;
  model: string; // Consider using a literal type if models are fixed
  temperature: number;
  maxTokens: number;
}

export interface PreferenceSettings {
  autoScroll: boolean;
  // Add other preferences
}

export interface UserSettings {
  profile: ProfileSettings;
  theme: ThemeSettings;
  openai: OpenAISettings;
  preferences: PreferenceSettings;
}

// Placeholder types for AnalysisCreation component
export type AnalysisResult = any;
export type AnalysisSuggestion = any;
