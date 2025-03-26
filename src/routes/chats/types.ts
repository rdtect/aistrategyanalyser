export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai" | "system";
  timestamp: string;
  status?: "sending" | "sent" | "error" | "streaming" | "delivered" | "read";
  index?: number;
  sources?: Array<{
    title: string;
    url?: string;
  }>;
}

export interface ChatContext {
  company?: string;
  industry?: string;
  region?: string;
  additionalInfo?: string;
  competitors?: string[];
}

export interface Chat {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  context: ChatContext;
  messages: Message[];
  settings?: Record<string, any>;
}
