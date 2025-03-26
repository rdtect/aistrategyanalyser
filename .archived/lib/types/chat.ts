/**
 * Chat and message type definitions for the application
 */

export type MessageStatus =
  | "sending"
  | "sent"
  | "error"
  | "streaming"
  | "completed";
export type MessageSender = "user" | "ai" | "system";

export interface Message {
  id: string;
  content: string;
  sender: MessageSender;
  timestamp: Date | string;
  status?: MessageStatus;
  sources?: Source[];
}

export interface Chat {
  id: string;
  name: string;
  messages: Message[];
  createdAt: Date;
  updatedAt?: Date;
  company?: string;
  industry?: string;
  region?: string;
  context?: string;
}

export interface ChatSettings {
  model: string;
  webSearch: boolean;
  webSearchContextSize: string;
  reasoning: boolean;
}

export interface HealthStatus {
  isActive: boolean;
  lastChecked: string;
  openai?: {
    connected: boolean;
    model?: string;
    error?: string;
  };
}

export interface Source {
  title: string;
  url: string;
  snippet: string;
}

export interface Analysis {
  id: string;
  company: string;
  industry: string;
  region: string;
  additionalContext?: string;
  status: AnalysisStatus;
  chatId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AnalysisStatus =
  | "CREATED"
  | "QUESTIONS_SELECTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED";

export interface AnalysisQuestion {
  id: string;
  analysisId: string;
  questionId: string;
  question: string;
  prompt: string;
}

export interface AnalysisResponse {
  id: string;
  analysisId: string;
  questionId: string;
  content: string;
}

export interface ChatStore {
  init: (initialChats: Chat[]) => boolean;
  chats: Readable<Chat[]>;
  currentChatId: Readable<string | null>;
  isLoading: Readable<boolean>;
  status: Readable<HealthStatus>;
  settings: Readable<any>; // Or specific settings type
  createNewChat: (options: {
    name: string;
    company: string;
    industry: string;
    region: string;
    context?: string;
  }) => Promise<string>;
  switchChat: (id: string) => void;
  handleMessageSubmit: (messageContent: string) => Promise<void>;
  deleteChat: (id: string) => void;
  checkApiStatus: () => Promise<HealthStatus | undefined>;
  updateModel: (model: string) => Promise<void>;
  exportToMarkdown: () => void;
  addMessage: typeof createMessage; // Assuming createMessage is exported
  addSystemMessage: typeof createMessage; // Assuming createMessage is exported
  createMessage: typeof createMessage;
}
