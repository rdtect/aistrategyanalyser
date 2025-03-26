export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: string;
}

export interface Chat {
  id: string;
  name: string;
  company?: string;
  messages: Message[];
  // Add other necessary fields
}