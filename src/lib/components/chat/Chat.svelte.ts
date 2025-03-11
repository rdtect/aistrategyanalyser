import { generateAIResponse } from '$lib/services/aiService';

export interface Message {
	id: number;
	sender: 'user' | 'ai';
	timestamp: string;
	content: string;
}

export interface Chat {
	id: number;
	name: string; // Format: Brand,Category,Region
	messages: Message[];
	createdAt: string;
}

// Sample data with nested structure
export const initialChats: Chat[] = [
	{
		id: 0,
		name: 'Adidas,Footwear,Global',
		createdAt: 'Yesterday @ 2:00pm',
		messages: [
			{
				id: 0,
				sender: 'ai',
				timestamp: 'Yesterday @ 2:30pm',
				content: '**AI Bot:** Hello! How can I assist you today regarding Adidas,Footwear,Global?'
			},
			{
				id: 1,
				sender: 'user',
				timestamp: 'Yesterday @ 2:45pm',
				content: `I'd like to know about their recent market performance.`
			},
			{
				id: 2,
				sender: 'ai',
				timestamp: 'Yesterday @ 2:50pm',
				content: `**AI Bot:**  Okay, here's a summary of Adidas' recent performance in the global footwear market:\n\n*   **Key Trends:** Increased competition from emerging brands.\n*   **Revenue:**  Moderate growth reported in Q2 2023.\n*   **Challenges:** Supply chain issues.\n\nWhat else would you like to know?`
			},
			{
				id: 3,
				sender: 'user',
				timestamp: 'Yesterday @ 2:52pm',
				content: `Thanks!  What about their innovation strategies?`
			}
		]
	},
	{
		id: 1,
		name: 'Nike,AthleticFootwear,India',
		createdAt: '2 days ago @ 9:00am',
		messages: [
			{
				id: 4,
				sender: 'ai',
				timestamp: '2 days ago @ 10:00am',
				content: `**AI Bot:**  Greetings! I'm ready to delve into the world of Nike, Athletic Footwear, India. How may I help?`
			},
			{
				id: 5,
				sender: 'user',
				timestamp: '2 days ago @ 10:15am',
				content: `What is the market share?`
			}
		]
	},
	{
		id: 2,
		name: 'Puma,Sportswear,USA',
		createdAt: '3 days ago @ 12:00pm',
		messages: [
			{
				id: 6,
				sender: 'ai',
				timestamp: '3 days ago @ 1:00pm',
				content: `**AI Bot:**  Hello! Ready to assist you with Puma, Sportswear, USA related questions`
			},
			{
				id: 7,
				sender: 'user',
				timestamp: '3 days ago @ 1:15pm',
				content: `How is their E-commerce doing?`
			}
		]
	}
];

export function createChatLogic() {
	// State
	let chats = $state(initialChats);
	let currentChatId = $state(0);
	let isLoading = $state(false);

	// Derived values
	const currentChat = $derived(chats.find((chat) => chat.id === currentChatId) || chats[0]);
	const messages = $derived(currentChat?.messages || []);

	// Methods
	function switchChat(id: number) {
		currentChatId = id;
	}

	function getCurrentTimestamp(): string {
		return new Date().toLocaleString('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: true
		});
	}

	function generateMessageId(chat: Chat): number {
		return chat.messages.length > 0 ? Math.max(...chat.messages.map((m) => m.id)) + 1 : 0;
	}

	async function handleMessageSubmit(message: string) {
		if (!currentChat) return;

		// Add user message
		const userMessage: Message = {
			id: generateMessageId(currentChat),
			sender: 'user',
			timestamp: getCurrentTimestamp(),
			content: message
		};

		// Update the chat with the new message - create a new array to trigger reactivity
		const updatedChats = chats.map((chat) =>
			chat.id === currentChatId ? { ...chat, messages: [...chat.messages, userMessage] } : chat
		);
		chats = updatedChats;

		// Set loading state
		isLoading = true;

		try {
			// Wait 1 second
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Generate AI response
			const responseContent = await generateAIResponse(currentChat, message);

			// Add AI response
			const aiMessage: Message = {
				id: generateMessageId(currentChat),
				sender: 'ai',
				timestamp: getCurrentTimestamp(),
				content: responseContent
			};

			// Update the chat with the AI response - create a new array to trigger reactivity
			const updatedChatsWithAI = chats.map((chat) =>
				chat.id === currentChatId ? { ...chat, messages: [...chat.messages, aiMessage] } : chat
			);
			chats = updatedChatsWithAI;
		} catch (error) {
			console.error('Error generating AI response:', error);
		} finally {
			isLoading = false;
		}
	}

	return {
		chats,
		currentChatId,
		currentChat,
		messages,
		isLoading,
		switchChat,
		handleMessageSubmit
	};
}
