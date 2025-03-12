import { generateAIResponse } from '$lib/services/aiService';
import { marked } from 'marked';
import { sampleChats, type Chat, type Message } from '$lib/data/sampleChats';

// Create reactive state variables
let chats = $state(sampleChats);
let currentChatId = $state(0);
let isLoading = $state(false);

// Create a chat store to expose state and methods
export const chatStore = {
	// Getters for state
	get chats() {
		return chats;
	},

	get currentChatId() {
		return currentChatId;
	},

	get isLoading() {
		return isLoading;
	},

	// Computed values
	get currentChat() {
		return chats.find((chat) => chat.id === currentChatId);
	},

	get messages() {
		return this.currentChat?.messages || [];
	},

	// Setters for state
	set chats(value) {
		chats = value;
	},

	set currentChatId(value) {
		currentChatId = value;
	},

	set isLoading(value) {
		isLoading = value;
	},

	/**
	 * Formats a plain text message with markdown
	 */
	formatMessage(text: string): string {
		try {
			return marked.parse(text) as string;
		} catch (error) {
			console.error('Error parsing markdown:', error);
			return text;
		}
	},

	/**
	 * Returns a timestamp string for the current time
	 */
	getTimestamp(): string {
		return new Date().toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit'
		});
	},

	/**
	 * Generates a new message ID for the current chat
	 */
	generateMessageId(): number {
		return this.messages.length ? Math.max(...this.messages.map((m) => m.id)) + 1 : 0;
	},

	/**
	 * Switches to a different chat session
	 */
	switchChat(id: number): void {
		currentChatId = id;
	},

	/**
	 * Handles submission of a new message
	 */
	async handleMessageSubmit(messageContent: string): Promise<void> {
		if (!messageContent.trim() || !this.currentChat) return;

		// Create user message
		const userMessage: Message = {
			id: this.generateMessageId(),
			content: messageContent,
			sender: 'user',
			timestamp: this.getTimestamp(),
			status: 'sending'
		};

		// Update chat with user message
		chats = chats.map((chat) =>
			chat.id === currentChatId ? { ...chat, messages: [...chat.messages, userMessage] } : chat
		);

		isLoading = true;

		try {
			const aiResponse = await generateAIResponse(this.currentChat, messageContent);
			const formattedResponse = this.formatMessage(aiResponse);

			const aiMessage: Message = {
				id: this.generateMessageId(),
				content: formattedResponse,
				sender: 'ai',
				timestamp: this.getTimestamp(),
				status: 'sent'
			};

			// Update chat with AI response
			chats = chats.map((chat) =>
				chat.id === currentChatId ? { ...chat, messages: [...chat.messages, aiMessage] } : chat
			);
		} catch (error) {
			console.error('Error generating AI response:', error);
		} finally {
			isLoading = false;
		}
	},

	/**
	 * Creates a new chat session
	 */
	createNewChat(name: string): void {
		const newChat: Chat = {
			id: Math.max(...chats.map((c) => c.id)) + 1,
			name,
			messages: [],
			createdAt: new Date().toISOString()
		};

		chats = [...chats, newChat];
		currentChatId = newChat.id;
	},

	/**
	 * Deletes a chat session
	 */
	deleteChat(id: number): void {
		chats = chats.filter((chat) => chat.id !== id);

		if (currentChatId === id) {
			currentChatId = chats[0]?.id || 0;
		}
	}
};
