import { marked } from 'marked';
import { sampleChats, type Chat, type Message } from '$lib/data/sampleChats';
import { AI_MODELS, type AIModel, type SearchContextSize } from '$lib/config/aiModels';
import { string } from 'zod';
import { browser } from '$app/environment';
import { checkHealth } from '$lib/actions/healthCheck';

async function generateAIResponse(message: string, context?: unknown) {
	const response = await fetch('/api/ai', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ message, context })
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || 'Failed to generate AI response');
	}

	const data = await response.json();
	return data.response;
}

// Create default values without self-references
const defaultChat: Chat = {
	id: 0,
	name: 'New Chat',
	messages: [],
	createdAt: new Date().toISOString(),
	company: '',
	industry: '',
	region: ''
};

// Use the default values for initialization
let chats = $state<Chat[]>(sampleChats.length > 0 ? [...sampleChats] : [defaultChat]);
let currentChatId = $state(sampleChats.length > 0 ? sampleChats[0]?.id || 0 : 0);
let isLoading = $state(false);

// Fix for AI_MODELS array issues - use a safer approach to get the default model
let defaultModel: AIModel = 'gpt-4o-mini';
// Check if AI_MODELS is an array and has items
if (Array.isArray(AI_MODELS) && AI_MODELS.length > 0) {
	defaultModel = AI_MODELS[0].id as AIModel;
} else if (typeof AI_MODELS === 'object' && AI_MODELS !== null) {
	// If it's an object, get the first key
	const keys = Object.keys(AI_MODELS);
	if (keys.length > 0) {
		defaultModel = keys[0] as AIModel;
	}
}

// Default settings configuration with fixed initialization
let settings = $state({
	model: defaultModel,
	webSearch: false,
	webSearchContextSize: 'medium' as SearchContextSize,
	reasoning: false
});

interface ChatStatus {
	isActive: boolean;
	lastChecked: string;
	openai?: {
		connected: boolean;
		model?: string;
		error?: string;
	};
	error?: string;
}

let status: ChatStatus = $state({
	isActive: false,
	lastChecked: new Date().toISOString(),
	openai: {
		connected: false,
		model: undefined
	}
});

export const chatStore = {
	get chats() {
		return chats;
	},
	get currentChatId() {
		return currentChatId;
	},
	get isLoading() {
		return isLoading;
	},
	get settings() {
		return settings;
	},
	get status() {
		return status;
	},
	get currentChat() {
		// Avoid trying to find in an undefined array
		if (!chats || chats.length === 0) {
			return defaultChat;
		}
		// Add safety check to handle cases where no chats match the current ID
		const chat = chats.find((chat) => chat && chat.id === currentChatId);
		// If no chat is found, return the first chat or a default object with empty values
		return chat || (chats.length > 0 ? chats[0] : defaultChat);
	},
	get messages() {
		const chat = this.currentChat;
		return chat && chat.messages ? chat.messages : [];
	},
	async createNewChat(options: {
		name: string;
		company: string;
		industry: string;
		region: string;
		context?: string;
	}): Promise<number> {
		// Add safety check before using Math.max
		const maxId =
			chats && chats.length > 0
				? Math.max(...chats.filter((c) => c && c.id !== undefined).map((c) => c.id))
				: -1;
		const newChat: Chat = {
			id: maxId + 1,
			name: options.name,
			messages: [],
			createdAt: new Date().toISOString(),
			company: options.company,
			industry: options.industry,
			region: options.region,
			context: options.context
		};
		chats = [...chats, newChat];
		currentChatId = newChat.id;
		return newChat.id;
	},
	formatMessage(text: string): string {
		try {
			return marked.parse(text) as string;
		} catch (error) {
			console.error('Error parsing markdown:', error);
			return text;
		}
	},
	getTimestamp(): string {
		return new Date().toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit'
		});
	},
	generateMessageId(): number {
		const messages = this.messages;
		return messages.length > 0
			? Math.max(...messages.filter((m) => m && m.id !== undefined).map((m) => m.id)) + 1
			: 0;
	},
	switchChat(id: number): void {
		currentChatId = id;
	},
	async handleMessageSubmit(messageContent: string): Promise<void> {
		if (!messageContent.trim() || !this.currentChat) return;
		const userMessage: Message = {
			id: this.generateMessageId(),
			content: messageContent,
			sender: 'user',
			timestamp: this.getTimestamp(),
			status: 'sending'
		};
		chats = chats.map((chat) =>
			chat.id === currentChatId ? { ...chat, messages: [...chat.messages, userMessage] } : chat
		) as Chat[];
		isLoading = true;
		try {
			const aiResponse = await generateAIResponse(messageContent, this.currentChat);
			const formattedResponse = this.formatMessage(aiResponse);
			const aiMessage: Message = {
				id: this.generateMessageId(),
				content: formattedResponse,
				sender: 'ai',
				timestamp: this.getTimestamp(),
				status: 'sent'
			};
			chats = chats.map((chat) =>
				chat.id === currentChatId ? { ...chat, messages: [...chat.messages, aiMessage] } : chat
			) as Chat[];
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
				// Don't return anything here to fix the type error
			} else {
				const errorMessage = 'An unknown error occurred';
				console.error(errorMessage, error);
				// Don't return anything here to fix the type error
			}
		} finally {
			isLoading = false;
		}
	},
	async handleAIResponse(response: string): Promise<void> {
		if (!response || !this.currentChat) return;

		const formattedResponse = this.formatMessage(response);

		const aiMessage: Message = {
			id: this.generateMessageId(),
			content: formattedResponse,
			sender: 'ai',
			timestamp: this.getTimestamp(),
			status: 'sent'
		};

		chats = chats.map((chat) =>
			chat.id === currentChatId ? { ...chat, messages: [...chat.messages, aiMessage] } : chat
		) as Chat[];
	},
	deleteChat(id: number): void {
		chats = chats.filter((chat) => chat.id !== id) as Chat[];
		if (currentChatId === id) {
			currentChatId = chats[0]?.id || 0;
		}
	},
	async cancelCurrentRequest() {
		// Only run in browser environment
		if (!browser) return;

		try {
			// Cancel any ongoing fetch requests
			if (typeof window !== 'undefined' && window._currentChatRequest) {
				window._currentChatRequest.abort();
			}
			// Reset any ongoing streams
			if (typeof window !== 'undefined' && window._currentChatStream) {
				window._currentChatStream.cancel();
			}
		} catch (error) {
			console.error('Error cancelling request:', error);
		}
	},
	async processQuestion(chatId: number, questionData: { question: string; prompt: string }) {
		// Only run in browser environment
		if (!browser) return null;

		try {
			// Create an AbortController for this specific request
			if (typeof window !== 'undefined') {
				window._currentChatRequest = new AbortController();
				return await generateAIResponse(questionData.prompt, {
					chatId,
					question: questionData.question,
					signal: window._currentChatRequest.signal
				});
			}
			return null;
		} catch (error: unknown) {
			if (error && typeof error === 'object' && 'name' in error && error.name === 'AbortError') {
				return null;
			}
			throw error;
		}
	},
	async checkApiStatus() {
		if (!browser) return;
		try {
			// Include the current model in the request
			const response = await fetch(`/api/health?model=${settings.model}`);
			const data = await response.json();

			// Update the status with the response
			status = {
				isActive: data.status === 'ok',
				lastChecked: data.timestamp,
				openai: {
					connected: data.openai.connected,
					model: data.openai.model
				}
			};

			return status;
		} catch (error) {
			status = {
				isActive: false,
				lastChecked: new Date().toISOString(),
				openai: {
					connected: false,
					error: error instanceof Error ? error.message : 'Unknown error'
				}
			};
			throw error;
		}
	},
	async updateModel(model: AIModel) {
		settings.model = model;
		await this.checkApiStatus();
	},
	exportToMarkdown() {
		const markdown = this.messages
			.map((msg) => {
				const role = msg.sender === 'user' ? 'User' : 'Assistant';
				return `### ${role} (${msg.timestamp})\n\n${msg.content}\n`;
			})
			.join('\n');
		const blob = new Blob([markdown], { type: 'text/markdown' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `chat-${new Date().toISOString()}.md`;
		a.click();
		URL.revokeObjectURL(url);
	}
};

// Add these to the window type
declare global {
	interface Window {
		_currentChatRequest: AbortController;
		_currentChatStream: { cancel: () => void };
	}
}

// Ensure browser-specific code only runs in the browser
if (browser) {
	setTimeout(() => chatStore.checkApiStatus(), 1000);
} else {
	// SSR safe initialization - nothing to do here
	console.log('Running in SSR mode');
}
