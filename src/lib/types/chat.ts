export type MessageStatus =
  | "sent"
  | "streaming"
  | "completed"
  | "error"
  | "cancelled";
export type MessageSender = "user" | "ai";

export interface Source {
  title: string;
  url: string;
  snippet: string;
}

export interface Message {
  id: string;
  content: string;
  sender: MessageSender;
  timestamp: Date;
  status: MessageStatus;
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
