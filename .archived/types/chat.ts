export interface Message {
  id: string;
  index: number;
  sender: MessageSender;
  content: string;
  timestamp: string;
  status?: MessageStatus;
  sources?: Source[];
}

export type MessageSender = "user" | "ai" | "system";
export type MessageStatus = "sending" | "sent" | "error" | "streaming";

export interface Source {
  title: string;
  url?: string;
  content?: string;
}

export interface Chat {
  id: string;
  name: string;
  company: string;
  industry: string;
  region: string;
  context: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  isDirty?: boolean;
}

export interface ModelSettings {
  model: string;
  temperature: number;
  webSearch?: boolean;
  webSearchContextSize?: "small" | "medium" | "large";
}

export interface HealthStatus {
  isActive: boolean;
  lastChecked: string;
  openai: {
    connected: boolean;
    model?: string;
    error?: string;
  };
}
